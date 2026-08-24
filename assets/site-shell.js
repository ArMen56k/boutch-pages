(() => {
  const script = document.currentScript;
  if (!document.querySelector('link[rel~="icon"]')) {
    const icon = document.createElement('link'); icon.rel = 'icon'; icon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%23050b09'/%3E%3Cpath d='M18 18h28v28H18z' rx='8' fill='%2358e6bd'/%3E%3Cpath d='m24 33 5 5 12-14' fill='none' stroke='%23050b09' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"; document.head.append(icon);
  }
  const root = new URL('../', new URL(script.src, location.href));
  const primaryRoot = location.hostname.toLowerCase() === 'boutchsoftware.github.io'
    ? new URL('https://armen56k.github.io/boutch-pages/')
    : root;
  const title = document.title.toLowerCase();
  const body = document.body;
  if (body.querySelector('.products')) body.classList.add('studio-home');
  else if (title.includes('traduction')) body.classList.add('studio-translation');
  else if (title.includes('aide') || title.includes('help') || title.includes('support')) body.classList.add('studio-help');
  else if (title.includes('confidential') || title.includes('conditions') || title.includes('suppression') || title.includes('mentions légales') || title.includes('legal notice')) {
    body.classList.add('studio-legal');
    if (!body.querySelector(':scope > header')) body.classList.add('studio-legal-compact');
  }
  else if (body.querySelector('.hero') && body.querySelector('main')) body.classList.add('studio-product');
  else body.classList.add('studio-utility');

  const sourceLanguage = document.querySelector('.lang-switch a, .switch a, button.lang, button.lang-switch');
  const touchRoot = new URL('https://boutchsoftware.github.io/touchefait/');
  const nav = document.createElement('nav');
  nav.className = 'studio-nav';
  nav.setAttribute('aria-label', 'Navigation principale');
  const brand = document.createElement('a');
  brand.className = 'studio-brand';
  brand.href = new URL('index.html', primaryRoot).href;
  brand.innerHTML = '<span class="studio-brand-mark" aria-hidden="true"></span><span>BoutchSoftware</span><small>SOFTWARE STUDIO</small>';
  const menu = document.createElement('div');
  menu.className = 'studio-menu';
  menu.id = 'studio-menu';
  const label = (fr, en) => `<span class="i18n-fr">${fr}</span><span class="i18n-en">${en}</span>`;
  const createLink = (item, className) => {
    const link = document.createElement('a');
    link.className = className;
    link.href = item.href;
    link.dataset.navKey = item.key;
    link.innerHTML = label(item.fr, item.en);
    return link;
  };

  const homeLink = createLink({
    key: 'home', href: new URL('index.html', primaryRoot).href, fr: 'Accueil', en: 'Home'
  }, 'studio-top-link');
  menu.append(homeLink);

  const helpPages = [
    { path: '/prepcalm/', href: new URL('prepcalm/aide.html', primaryRoot).href },
    { path: '/preuve-a-lappui/', href: new URL('preuve-a-lappui/aide.html', primaryRoot).href },
    { path: '/serene/', href: new URL('serene/aide.html', primaryRoot).href },
    { path: '/touchefait/', href: new URL('touchefait/aide.html', primaryRoot).href },
    { path: '/pilulo/', href: new URL('pilulo/aide.html', root).href }
  ];
  const currentHelp = helpPages.find((item) => location.pathname.toLowerCase().includes(item.path));
  if (currentHelp) {
    const helpLink = createLink({
      key: 'help', href: currentHelp.href, fr: 'Aide', en: 'Help'
    }, 'studio-top-link studio-help-link');
    if (location.pathname.toLowerCase().endsWith('/aide.html')) helpLink.setAttribute('aria-current', 'page');
    menu.append(helpLink);
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'studio-dropdown';
  const dropdownTrigger = document.createElement('button');
  dropdownTrigger.className = 'studio-dropdown-trigger';
  dropdownTrigger.type = 'button';
  dropdownTrigger.setAttribute('aria-expanded', 'false');
  dropdownTrigger.setAttribute('aria-controls', 'studio-discover');
  dropdownTrigger.innerHTML = `${label('Découvrir', 'Explore')}<span class="studio-chevron" aria-hidden="true"></span>`;
  const dropdownPanel = document.createElement('div');
  dropdownPanel.className = 'studio-dropdown-panel';
  dropdownPanel.id = 'studio-discover';
  dropdownPanel.innerHTML = `<div class="studio-dropdown-heading"><div><span class="i18n-fr">Découvrir BoutchSoftware</span><span class="i18n-en">Discover BoutchSoftware</span></div><p><span class="i18n-fr">Applications, philosophie et traductions.</span><span class="i18n-en">Applications, philosophy and translations.</span></p></div>`;
  const dropdownGrid = document.createElement('div');
  dropdownGrid.className = 'studio-dropdown-grid';

  const groups = [
    {
      fr: 'Applications', en: 'Applications', className: 'studio-menu-group-apps', items: [
        { key: 'apps', href: new URL('index.html#produits', primaryRoot).href, fr: 'Toutes les applications', en: 'All applications' },
        { key: 'prepcalm', href: new URL('prepcalm/index.html', primaryRoot).href, fr: 'PrepCalm', en: 'PrepCalm' },
        { key: 'touch', href: new URL('index.html', touchRoot).href, fr: 'Touché, c’est fait', en: 'Touché, c’est fait' },
        { key: 'preuve', href: new URL('preuve-a-lappui/index.html', primaryRoot).href, fr: 'D’un commun accord', en: 'D’un commun accord' },
        { key: 'serene', href: new URL('serene/index.html', primaryRoot).href, fr: 'Serene Decisions', en: 'Serene Decisions' }
      ]
    },
    {
      fr: 'BoutchSoftware', en: 'BoutchSoftware', className: 'studio-menu-group-company', items: [
        { key: 'philosophy', href: new URL('index.html#philosophie', primaryRoot).href, fr: 'Notre philosophie', en: 'Our philosophy' },
        { key: 'translations', href: new URL('translations.html', primaryRoot).href, fr: 'Participer aux traductions', en: 'Contribute translations' }
      ]
    }
  ];
  const hasPiluloPages = location.pathname.toLowerCase().includes('/pilulo/') || root.pathname.toLowerCase().endsWith('/boutch/');
  if (hasPiluloPages) {
    groups[0].items.push({ key: 'pilulo', href: new URL('pilulo/index.html', root).href, fr: 'Pilulo', en: 'Pilulo' });
  }
  groups.forEach((group) => {
    const section = document.createElement('section');
    section.className = `studio-menu-group ${group.className}`;
    section.innerHTML = `<p class="studio-menu-group-title">${label(group.fr, group.en)}</p>`;
    const links = document.createElement('div');
    links.className = 'studio-dropdown-links';
    group.items.forEach((item) => links.append(createLink(item, 'studio-dropdown-link')));
    section.append(links);
    dropdownGrid.append(section);
  });
  dropdownPanel.append(dropdownGrid);
  dropdown.append(dropdownTrigger, dropdownPanel);
  menu.append(dropdown);

  const legalLink = createLink({
    key: 'legal', href: new URL('mentions-legales.html', primaryRoot).href,
    fr: 'Mentions légales', en: 'Legal notice'
  }, 'studio-top-link studio-legal-link');
  if (location.pathname.toLowerCase().endsWith('/mentions-legales.html')) legalLink.setAttribute('aria-current', 'page');
  menu.append(legalLink);

  const currentPath = decodeURI(location.pathname).toLowerCase().replace(/\/index\.html$/, '/');
  const getActiveKey = () => {
    if (currentPath.includes('/prepcalm/')) return 'prepcalm';
    if (currentPath.includes('/preuve-a-lappui/')) return 'preuve';
    if (currentPath.includes('/serene/')) return 'serene';
    if (currentPath.includes('/touchefait/')) return 'touch';
    if (currentPath.includes('/pilulo/')) return 'pilulo';
    if (currentPath.endsWith('/translations.html')) return 'translations';
    if (location.hash === '#produits') return 'apps';
    if (location.hash === '#philosophie') return 'philosophy';
    return 'home';
  };
  const syncActiveLink = () => {
    const activeKey = getActiveKey();
    menu.querySelectorAll('a[data-nav-key]').forEach((link) => {
      if (link.dataset.navKey === activeKey) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    dropdown.classList.toggle('has-current', activeKey !== 'home');
  };
  syncActiveLink();
  window.addEventListener('hashchange', syncActiveLink);

  const setDropdown = (open) => {
    dropdown.classList.toggle('is-open', open);
    dropdownTrigger.setAttribute('aria-expanded', String(open));
  };
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let dropdownCloseTimer = 0;
  const cancelDropdownClose = () => {
    if (!dropdownCloseTimer) return;
    clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = 0;
  };
  dropdownTrigger.addEventListener('click', () => setDropdown(!dropdown.classList.contains('is-open')));
  dropdown.addEventListener('mouseenter', () => {
    if (!precisePointer.matches) return;
    cancelDropdownClose();
    setDropdown(true);
  });
  dropdown.addEventListener('mouseleave', () => {
    if (!precisePointer.matches) return;
    cancelDropdownClose();
    dropdownCloseTimer = setTimeout(() => {
      dropdownCloseTimer = 0;
      setDropdown(false);
    }, 320);
  });
  dropdownPanel.addEventListener('mouseenter', cancelDropdownClose);
  dropdown.addEventListener('focusin', (event) => { if (event.target !== dropdownTrigger) setDropdown(true); });
  dropdown.addEventListener('focusout', (event) => { if (!dropdown.contains(event.relatedTarget)) setDropdown(false); });

  const toggle = document.createElement('button');
  toggle.className = 'studio-menu-toggle'; toggle.type = 'button'; toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-controls','studio-menu');
  toggle.innerHTML = '<span class="studio-sr-only">Ouvrir le menu</span><i></i><i></i>';
  const setMenu = (open) => {
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) setDropdown(false);
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  nav.append(brand, menu);
  if (sourceLanguage) {
    body.classList.add('studio-has-language');
    const language = document.createElement('button'); language.className = 'studio-language'; language.type = 'button';
    const updateLanguage = () => language.textContent = body.classList.contains('show-en') ? 'FR' : 'EN'; updateLanguage();
    language.addEventListener('click', (event) => { event.preventDefault(); sourceLanguage.click(); setTimeout(updateLanguage,0); }); nav.append(language);
  }
  nav.append(toggle);
  body.prepend(nav);
  document.addEventListener('click', (event) => { if (!nav.contains(event.target)) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (dropdown.classList.contains('is-open')) { setDropdown(false); dropdownTrigger.focus(); }
    else if (nav.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });

  const progress = document.createElement('i'); progress.className = 'studio-progress'; progress.setAttribute('aria-hidden','true'); body.prepend(progress);
  const updateProgress = () => { const total = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${total > 0 ? scrollY / total * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  const targets = document.querySelectorAll('main section, main .feature, main .step, main .card, main .product, main .rules, main .contact-card');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.08});
    targets.forEach((node) => { node.classList.add('studio-reveal'); observer.observe(node); });
  }
})();
