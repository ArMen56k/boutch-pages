(() => {
  "use strict";

  const TOKEN_PREFIX = "j1.";
  const MAX_TOKEN_CHARS = 196608;
  const MAX_OPTIONS = 10000;
  const MAX_TITLE_CHARS = 300;
  const MAX_OPTION_CHARS = 4000;
  const PLAY_URL = "https://play.google.com/store/apps/details?id=com.boutch.serene";

  const loading = document.getElementById("share-loading");
  const error = document.getElementById("share-error");
  const content = document.getElementById("share-content");
  const titleNode = document.getElementById("shared-title");
  const countNode = document.getElementById("shared-count");
  const optionsNode = document.getElementById("shared-options");

  const fail = () => {
    loading.classList.add("is-hidden");
    content.classList.add("is-hidden");
    error.classList.remove("is-hidden");
  };

  const decode = (token) => {
    if (!token.startsWith(TOKEN_PREFIX) || token.length > MAX_TOKEN_CHARS) throw new Error("token");
    const value = token.slice(TOKEN_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/");
    const padded = value + "=".repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const documentValue = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (documentValue.v !== 1 || typeof documentValue.t !== "string") throw new Error("version");
    if (documentValue.t.length > MAX_TITLE_CHARS || !Array.isArray(documentValue.o)) throw new Error("shape");
    if (documentValue.o.length < 2 || documentValue.o.length > MAX_OPTIONS) throw new Error("count");
    const options = documentValue.o.map((option) => {
      if (!option || typeof option.t !== "string") throw new Error("option");
      const text = option.t.trim();
      const weight = option.w === undefined ? 1 : option.w;
      const enabled = option.e === undefined ? true : option.e;
      if (!text || text.length > MAX_OPTION_CHARS || !Number.isInteger(weight) || weight < 0 || typeof enabled !== "boolean") throw new Error("option");
      return { text, weight, enabled };
    });
    return { title: documentValue.t.trim() || "Liste partagée", options };
  };

  const probabilityLabel = (option, totalWeight) => {
    if (!option.enabled) return { fr: "Exclue", en: "Excluded" };
    if (totalWeight <= 0) return null;
    const value = 100 * option.weight / totalWeight;
    const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: value < 1 ? 1 : 0 }).format(value);
    return { fr: `${formatted} %`, en: `${formatted}%` };
  };

  const render = (payload, token) => {
    titleNode.textContent = payload.title;
    countNode.textContent = `${payload.options.length} options`;
    document.title = `${payload.title} — Serene Decisions`;
    const totalWeight = payload.options.filter((option) => option.enabled).reduce((sum, option) => sum + option.weight, 0);
    const hasCustomWeights = payload.options.some((option) => option.weight !== 1 || !option.enabled);
    const fragment = document.createDocumentFragment();
    payload.options.forEach((option) => {
      const item = document.createElement("li");
      if (!option.enabled) item.classList.add("is-disabled");
      const text = document.createElement("span");
      text.textContent = option.text;
      item.append(text);
      if (hasCustomWeights) {
        const label = probabilityLabel(option, totalWeight);
        if (label) {
          const badgeFr = document.createElement("small");
          badgeFr.className = "fr";
          badgeFr.textContent = label.fr;
          const badgeEn = document.createElement("small");
          badgeEn.className = "en";
          badgeEn.textContent = label.en;
          item.append(badgeFr, badgeEn);
        }
      }
      fragment.append(item);
    });
    optionsNode.replaceChildren(fragment);

    const intentUrl = `intent://share?d=${encodeURIComponent(token)}#Intent;scheme=serene;package=com.boutch.serene;S.browser_fallback_url=${encodeURIComponent(PLAY_URL)};end`;
    document.querySelectorAll("#open-app-fr, #open-app-en").forEach((link) => { link.href = intentUrl; });
    document.documentElement.classList.toggle("android", /Android/i.test(navigator.userAgent));

    const plainText = [payload.title, ...payload.options.map((option) => `${option.enabled ? "•" : "○"} ${option.text}`)].join("\n");
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(plainText);
      } catch (_) {
        const helper = document.createElement("textarea");
        helper.value = plainText;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.append(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
      }
      const fr = document.getElementById("copy-list-fr");
      const en = document.getElementById("copy-list-en");
      fr.textContent = "Liste copiée";
      en.textContent = "List copied";
      setTimeout(() => { fr.textContent = "Copier la liste"; en.textContent = "Copy the list"; }, 1800);
    };
    document.getElementById("copy-list-fr").addEventListener("click", copy);
    document.getElementById("copy-list-en").addEventListener("click", copy);

    loading.classList.add("is-hidden");
    error.classList.add("is-hidden");
    content.classList.remove("is-hidden");
  };

  try {
    const token = decodeURIComponent(location.hash.slice(1));
    render(decode(token), token);
  } catch (_) {
    fail();
  }
})();
