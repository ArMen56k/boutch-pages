/* RFC 3161 / CMS minimal verifier for the FreeTSA root embedded below. */
const FREETSA_ROOT_SHA256 = 'a6379e7cecc05faa3cbf076013d745e327bbbaa38c0b9af22469d4701d18aabc';
const OID_SIGNED_DATA = '1.2.840.113549.1.7.2';
const OID_TST_INFO = '1.2.840.113549.1.9.16.1.4';
const OID_SHA256 = '2.16.840.1.101.3.4.2.1';

async function verifyTimestamp(envelope, responseBuffer) {
  const data = new Uint8Array(responseBuffer);
  const response = timestampTlv(data, 0);
  const responseFields = timestampChildren(data, response);
  if (!responseFields[0] || timestampInteger(data, timestampChildren(data, responseFields[0])[0]) > 1) throw new Error('réponse TSA refusée');
  if (!responseFields[1]) throw new Error('réponse TSA sans jeton');
  const contentInfo = timestampChildren(data, responseFields[1]);
  if (timestampOid(data, contentInfo[0]) !== OID_SIGNED_DATA || contentInfo[1]?.tag !== 0xA0) throw new Error('jeton CMS inattendu');
  const signedData = timestampTlv(data, contentInfo[1].contentStart);
  const fields = timestampChildren(data, signedData);
  const eci = timestampChildren(data, fields[2]);
  if (timestampOid(data, eci[0]) !== OID_TST_INFO || eci[1]?.tag !== 0xA0) throw new Error('contenu TSA inattendu');
  const tstInfo = timestampTlv(data, timestampChildren(data, eci[1])[0].contentStart);
  const tstFields = timestampChildren(data, tstInfo);
  const imprint = timestampChildren(data, tstFields[2]);
  if (timestampOid(data, timestampChildren(data, imprint[0])[0]) !== OID_SHA256) throw new Error('algorithme TSA inattendu');
  const expected = new Uint8Array(await crypto.subtle.digest('SHA-256', envelope));
  if (!timestampEqual(expected, data.slice(imprint[1].contentStart, imprint[1].end))) throw new Error('jeton TSA ne portant pas sur la signature');

  const certificates = timestampChildren(data, fields.find(value => value.tag === 0xA0) || {}).map(node => timestampCertificate(data, node));
  const root = await timestampRoot(certificates);
  const signerInfo = timestampChildren(data, timestampChildren(data, fields[fields.length - 1])[0]);
  const leaf = timestampSignerCertificate(data, certificates, signerInfo[1]);
  if (!leaf) throw new Error('certificat TSA signataire absent');
  const issuedAt = timestampTime(data.slice(tstFields[4].contentStart, tstFields[4].end));
  if (issuedAt < leaf.notBefore || issuedAt > leaf.notAfter) throw new Error('jeton hors validité du certificat TSA');
  if (!await timestampVerifyWithCertificate(root, leaf.signatureAlgorithm, leaf.tbs, leaf.signature)) throw new Error('chaîne TSA invalide');
  if (!timestampHasTsaUsage(data, leaf)) throw new Error('certificat TSA non autorisé pour l’horodatage');
  const signedAttributes = signerInfo[3];
  if (!signedAttributes || signedAttributes.tag !== 0xA0 || !await timestampMessageDigestMatches(data, signedAttributes, timestampSlice(data, tstInfo), timestampDigestAlgorithm(data, signerInfo[2]))) throw new Error('attributs CMS invalides');
  const signed = timestampSlice(data, signedAttributes); signed[0] = 0x31;
  const signatureAlgorithm = timestampAlgorithm(data, signerInfo[4]);
  if (!await timestampVerifyWithCertificate(leaf, signatureAlgorithm, signed, data.slice(signerInfo[5].contentStart, signerInfo[5].end))) throw new Error('signature TSA invalide');
  return { timestamp: issuedAt };
}

function timestampCertificate(data, node) {
  const fields = timestampChildren(data, node), tbs = fields[0], tbsFields = timestampChildren(data, tbs);
  const offset = tbsFields[0].tag === 0xA0 ? 1 : 0, spki = tbsFields[offset + 5];
  const curve = timestampCurve(data, spki);
  const validity = timestampChildren(data, tbsFields[offset + 3]);
  return { der: timestampSlice(data, node), tbs: timestampSlice(data, tbs), serial: timestampSlice(data, tbsFields[offset]), issuer: timestampSlice(data, tbsFields[offset + 2]), spki: timestampSlice(data, spki), curve, notBefore: timestampX509Time(data.slice(validity[0].contentStart, validity[0].end)), notAfter: timestampX509Time(data.slice(validity[1].contentStart, validity[1].end)), extensions: tbsFields.find(value => value.tag === 0xA3), signatureAlgorithm: timestampAlgorithm(data, fields[1]), signature: data.slice(fields[2].contentStart + 1, fields[2].end) };
}

async function timestampRoot(certificates) {
  for (const certificate of certificates) if (await timestampSha256(certificate.der) === FREETSA_ROOT_SHA256) return certificate;
  throw new Error('ancre FreeTSA absente');
}

function timestampSignerCertificate(data, certificates, sid) {
  const values = timestampChildren(data, sid);
  return certificates.find(certificate => timestampEqual(certificate.issuer, timestampSlice(data, values[0])) && timestampEqual(certificate.serial, timestampSlice(data, values[1])));
}

async function timestampVerifyWithCertificate(certificate, algorithm, signed, signature) {
  const keyAlgorithm = algorithm.name === 'ECDSA' ? { name: 'ECDSA', namedCurve: certificate.curve?.name } : { name: algorithm.name, hash: algorithm.hash };
  if (algorithm.name === 'ECDSA' && !certificate.curve) throw new Error('courbe TSA inconnue');
  const key = await crypto.subtle.importKey('spki', certificate.spki, keyAlgorithm, false, ['verify']);
  const value = algorithm.name === 'ECDSA' ? ecdsaDerToRaw(signature, certificate.curve.size) : signature;
  return crypto.subtle.verify({ name: algorithm.name, hash: algorithm.hash }, key, value, signed);
}

function timestampMessageDigestMatches(data, attributes, tstInfo, hash) {
  const attribute = timestampChildren(data, attributes).find(value => timestampOid(data, timestampChildren(data, value)[0]) === '1.2.840.113549.1.9.4');
  if (!attribute) return false;
  const octet = timestampChildren(data, timestampChildren(data, attribute)[1])[0];
  return timestampDigest(tstInfo, hash).then(digest => digest === timestampHex(data.slice(octet.contentStart, octet.end)));
}

function timestampHasTsaUsage(data, certificate) {
  if (!certificate.extensions) return false;
  const list = timestampChildren(data, timestampChildren(data, certificate.extensions)[0]);
  return list.some(extension => {
    const fields = timestampChildren(data, extension);
    if (timestampOid(data, fields[0]) !== '2.5.29.37') return false;
    const value = fields[fields.length - 1], usages = timestampChildren(data, timestampTlv(data, value.contentStart));
    return usages.some(usage => timestampOid(data, usage) === '1.3.6.1.5.5.7.3.8');
  });
}

function timestampAlgorithm(data, node) {
  const oid = timestampOid(data, timestampChildren(data, node)[0]);
  const algorithms = {
    '1.2.840.113549.1.1.11': { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, '1.2.840.113549.1.1.12': { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' }, '1.2.840.113549.1.1.13': { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' },
    '1.2.840.10045.4.3.2': { name: 'ECDSA', hash: 'SHA-256' }, '1.2.840.10045.4.3.3': { name: 'ECDSA', hash: 'SHA-384' }, '1.2.840.10045.4.3.4': { name: 'ECDSA', hash: 'SHA-512' },
  };
  if (!algorithms[oid]) throw new Error('algorithme TSA non pris en charge');
  return algorithms[oid];
}

function timestampDigestAlgorithm(data, node) {
  const hashes = { '2.16.840.1.101.3.4.2.1': 'SHA-256', '2.16.840.1.101.3.4.2.2': 'SHA-384', '2.16.840.1.101.3.4.2.3': 'SHA-512' };
  const hash = hashes[timestampOid(data, timestampChildren(data, node)[0])];
  if (!hash) throw new Error('empreinte CMS non prise en charge');
  return hash;
}

function timestampCurve(data, spki) {
  const values = timestampChildren(data, timestampChildren(data, spki)[0]);
  if (timestampOid(data, values[0]) !== '1.2.840.10045.2.1') return null;
  const curves = { '1.2.840.10045.3.1.7': { name: 'P-256', size: 32 }, '1.3.132.0.34': { name: 'P-384', size: 48 }, '1.3.132.0.35': { name: 'P-521', size: 66 } };
  return curves[timestampOid(data, values[1])] || null;
}

function timestampTlv(data, start) { if (!data || start >= data.length) throw new Error('DER tronqué'); let cursor = start + 1, length = data[cursor++]; if (length & 0x80) { const count = length & 0x7F; if (!count || count > 4 || cursor + count > data.length) throw new Error('taille DER invalide'); length = 0; for (let index = 0; index < count; index++) length = length * 256 + data[cursor++]; } if (cursor + length > data.length) throw new Error('DER tronqué'); return { tag: data[start], start, contentStart: cursor, end: cursor + length }; }
function timestampChildren(data, parent) { const values = []; for (let cursor = parent.contentStart; cursor < parent.end;) { const value = timestampTlv(data, cursor); values.push(value); cursor = value.end; } return values; }
function timestampSlice(data, value) { return data.slice(value.start, value.end); }
function timestampEqual(left, right) { return left?.length === right?.length && left.every((value, index) => value === right[index]); }
function timestampInteger(data, value) { return data.slice(value.contentStart, value.end).reduce((result, byte) => result * 256 + byte, 0); }
function timestampOid(data, value) { const bytes = data.slice(value.contentStart, value.end), result = [Math.floor(bytes[0] / 40), bytes[0] % 40]; let current = 0; for (let index = 1; index < bytes.length; index++) { current = current * 128 + (bytes[index] & 0x7F); if (!(bytes[index] & 0x80)) { result.push(current); current = 0; } } if (current) throw new Error('OID invalide'); return result.join('.'); }
async function timestampSha256(value) { return timestampHex(new Uint8Array(await crypto.subtle.digest('SHA-256', value))); }
async function timestampDigest(value, hash) { return timestampHex(new Uint8Array(await crypto.subtle.digest(hash, value))); }
function timestampHex(bytes) { return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join(''); }
function timestampTime(bytes) { const raw = new TextDecoder().decode(bytes).replace(/\.\d+Z$/, 'Z'); const match = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/); if (!match) throw new Error('date TSA invalide'); return new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6])).toISOString(); }
function timestampX509Time(bytes) { const raw = new TextDecoder().decode(bytes); const match = raw.match(/^(\d{2}|\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/); if (!match) throw new Error('validité TSA invalide'); const year = match[1].length === 2 ? (Number(match[1]) >= 50 ? 1900 : 2000) + Number(match[1]) : Number(match[1]); return new Date(Date.UTC(year, match[2] - 1, match[3], match[4], match[5], match[6])).toISOString(); }
