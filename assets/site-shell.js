(() => {
  const script = document.currentScript;
  if (!document.querySelector('link[rel~="icon"]')) {
    const icon = document.createElement('link'); icon.rel = 'icon'; icon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%23050b09'/%3E%3Cpath d='M18 18h28v28H18z' rx='8' fill='%2358e6bd'/%3E%3Cpath d='m24 33 5 5 12-14' fill='none' stroke='%23050b09' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"; document.head.append(icon);
  }
  const root = new URL('../', new URL(script.src, location.href));
  const title = document.title.toLowerCase();
  const body = document.body;
  if (body.querySelector('.products')) body.classList.add('studio-home');
  else if (title.includes('traduction')) body.classList.add('studio-translation');
  else if (title.includes('confidential') || title.includes('conditions') || title.includes('suppression')) {
    body.classList.add('studio-legal');
    if (!body.querySelector(':scope > header')) body.classList.add('studio-legal-compact');
  }
  else if (body.querySelector('.hero') && body.querySelector('main')) body.classList.add('studio-product');
  else body.classList.add('studio-utility');

  const sourceNav = document.querySelector('.topbar .site-nav, .top .links, .site-nav');
  const sourceLanguage = document.querySelector('.lang-switch a, .switch a, button.lang, button.lang-switch');
  const nav = document.createElement('nav');
  nav.className = 'studio-nav';
  nav.setAttribute('aria-label', 'Navigation principale');
  const brand = document.createElement('a');
  brand.className = 'studio-brand';
  brand.href = new URL('index.html', root).href;
  brand.innerHTML = '<span class="studio-brand-mark" aria-hidden="true"></span><span>BoutchSoftware</span><small>SOFTWARE STUDIO</small>';
  const menu = document.createElement('div');
  menu.className = 'studio-menu';
  menu.id = 'studio-menu';
  if (sourceNav) Array.from(sourceNav.querySelectorAll('a')).forEach((link) => menu.append(link.cloneNode(true)));
  if (!menu.children.length) {
    menu.innerHTML = `<a href="${new URL('index.html',root)}">Accueil</a><a href="${new URL('index.html#produits',root)}">Applications</a><a href="${new URL('translations.html',root)}">Traductions</a>`;
  }
  const toggle = document.createElement('button');
  toggle.className = 'studio-menu-toggle'; toggle.type = 'button'; toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-controls','studio-menu');
  toggle.innerHTML = '<span class="studio-sr-only">Ouvrir le menu</span><i></i><i></i>';
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded',String(open)); });
  menu.addEventListener('click', () => { nav.classList.remove('menu-open'); toggle.setAttribute('aria-expanded','false'); });
  nav.append(brand, menu);
  if (sourceLanguage) {
    body.classList.add('studio-has-language');
    const language = document.createElement('button'); language.className = 'studio-language'; language.type = 'button';
    const updateLanguage = () => language.textContent = body.classList.contains('show-en') ? 'FR' : 'EN'; updateLanguage();
    language.addEventListener('click', (event) => { event.preventDefault(); sourceLanguage.click(); setTimeout(updateLanguage,0); }); nav.append(language);
  }
  nav.append(toggle);
  body.prepend(nav);

  const progress = document.createElement('i'); progress.className = 'studio-progress'; progress.setAttribute('aria-hidden','true'); body.prepend(progress);
  const updateProgress = () => { const total = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${total > 0 ? scrollY / total * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  const targets = document.querySelectorAll('main section, main .feature, main .step, main .card, main .product, main .rules, main .contact-card');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.08});
    targets.forEach((node) => { node.classList.add('studio-reveal'); observer.observe(node); });
  }
})();
