(() => {
  const currentScript = document.currentScript;
  const assetUrl = new URL(currentScript.src, window.location.href);
  const rootUrl = new URL('../', assetUrl);
  const href = (path) => new URL(path, rootUrl).href;

  // The home and contribution pages have their own bespoke navigation systems.
  if (document.querySelector('.topbar, .top .nav')) return;

  let nav = document.querySelector('.site-nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Navigation principale');
    document.body.prepend(nav);
  }

  nav.classList.add('shell-nav');
  const originalLinks = Array.from(nav.querySelectorAll(':scope > a'));
  const genericOnly = originalLinks.length === 1 && originalLinks[0].textContent.trim() === 'BoutchSoftware';
  if (genericOnly) originalLinks[0].remove();

  const menu = document.createElement('div');
  menu.className = 'shell-menu';
  menu.id = 'site-menu';
  originalLinks.forEach((link) => menu.append(link));

  if (!menu.children.length) {
    menu.innerHTML = [
      `<a href="${href('index.html')}"><span class="shell-fr">Accueil</span><span class="shell-en">Home</span></a>`,
      `<a href="${href('index.html#produits')}"><span class="shell-fr">Applications</span><span class="shell-en">Apps</span></a>`,
      `<a href="${href('translations.html')}"><span class="shell-fr">Traductions</span><span class="shell-en">Translations</span></a>`
    ].join('');
  }

  const brand = document.createElement('a');
  brand.className = 'shell-brand';
  brand.href = href('index.html');
  brand.innerHTML = '<span class="shell-mark" aria-hidden="true"></span><span>BoutchSoftware</span><small>STUDIO</small>';
  const toggle = document.createElement('button');
  toggle.className = 'shell-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'site-menu');
  toggle.innerHTML = '<span class="sr-only">Ouvrir le menu</span><i></i><i></i>';
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  menu.addEventListener('click', () => { nav.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); });

  nav.replaceChildren(brand, toggle, menu);
  const firstContent = Array.from(document.body.children).find((node) => node !== nav && node.tagName !== 'SCRIPT');
  if (firstContent) document.body.insertBefore(nav, firstContent);
})();
