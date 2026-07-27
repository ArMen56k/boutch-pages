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
  else if (title.includes('confidential') || title.includes('conditions') || title.includes('suppression')) {
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

  const dropdown = document.createElement('div');
  dropdown.className = 'studio-dropdown';
  const dropdownTrigger = document.createElement('button');
  dropdownTrigger.className = 'studio-dropdown-trigger';
  dropdownTrigger.type = 'button';
  dropdownTrigger.setAttribute('aria-expanded', 'false');
  dropdownTrigger.setAttribute('aria-controls', 'studio-all-pages');
  dropdownTrigger.innerHTML = `${label('Toutes les pages', 'All pages')}<span class="studio-chevron" aria-hidden="true"></span>`;
  const dropdownPanel = document.createElement('div');
  dropdownPanel.className = 'studio-dropdown-panel';
  dropdownPanel.id = 'studio-all-pages';
  dropdownPanel.innerHTML = `<div class="studio-dropdown-heading"><div><span class="i18n-fr">Explorer BoutchSoftware</span><span class="i18n-en">Explore BoutchSoftware</span></div><p><span class="i18n-fr">Toutes les pages, organisées par usage.</span><span class="i18n-en">Every page, organised by purpose.</span></p></div>`;
  const dropdownGrid = document.createElement('div');
  dropdownGrid.className = 'studio-dropdown-grid';

  const groups = [
    {
      fr: 'Applications', en: 'Applications', className: 'studio-menu-group-apps', items: [
        { key: 'apps', href: new URL('index.html#produits', primaryRoot).href, fr: 'Toutes les applications', en: 'All applications' },
        { key: 'prepcalm', href: new URL('prepcalm/index.html', primaryRoot).href, fr: 'PrepCalm', en: 'PrepCalm' },
        { key: 'touch', href: new URL('index.html', touchRoot).href, fr: 'Touché, c’est fait', en: 'Touché, c’est fait' },
        { key: 'preuve', href: new URL('preuve-a-lappui/index.html', primaryRoot).href, fr: 'Preuve à l’appui', en: 'Preuve à l’appui' },
        { key: 'serene', href: new URL('serene/index.html', primaryRoot).href, fr: 'Serene Decisions', en: 'Serene Decisions' }
      ]
    },
    {
      fr: 'Pages pratiques', en: 'Practical pages', className: 'studio-menu-group-tools', items: [
        { key: 'prepcalm-list', href: new URL('prepcalm/l/index.html', primaryRoot).href, fr: 'Ouvrir une liste PrepCalm', en: 'Open a PrepCalm list' },
        { key: 'preuve-verify', href: new URL('preuve-a-lappui/verifier/index.html', primaryRoot).href, fr: 'Vérifier un dossier photo', en: 'Verify a photo record' },
        { key: 'touch-invite', href: new URL('j/index.html', touchRoot).href, fr: 'Invitation Touché', en: 'Touché invitation' },
        { key: 'touch-tag', href: new URL('t/index.html', touchRoot).href, fr: 'Ouvrir une étiquette Touché', en: 'Open a Touché tag' }
      ]
    },
    {
      fr: 'BoutchSoftware', en: 'BoutchSoftware', className: 'studio-menu-group-company', items: [
        { key: 'philosophy', href: new URL('index.html#philosophie', primaryRoot).href, fr: 'Notre philosophie', en: 'Our philosophy' },
        { key: 'translations', href: new URL('translations.html', primaryRoot).href, fr: 'Participer aux traductions', en: 'Contribute translations' }
      ]
    },
    {
      fr: 'Informations légales', en: 'Legal information', className: 'studio-menu-group-legal', items: [
        { key: 'prepcalm-privacy', href: new URL('prepcalm/privacy.html', primaryRoot).href, fr: 'PrepCalm · Confidentialité', en: 'PrepCalm · Privacy' },
        { key: 'prepcalm-terms', href: new URL('prepcalm/terms.html', primaryRoot).href, fr: 'PrepCalm · Conditions', en: 'PrepCalm · Terms' },
        { key: 'touch-privacy', href: new URL('touchefait/privacy.html', primaryRoot).href, fr: 'Touché · Confidentialité', en: 'Touché · Privacy' },
        { key: 'touch-terms', href: new URL('touchefait/terms.html', primaryRoot).href, fr: 'Touché · Conditions', en: 'Touché · Terms' },
        { key: 'touch-delete', href: new URL('touchefait/delete-account.html', primaryRoot).href, fr: 'Touché · Suppression du compte', en: 'Touché · Delete account' },
        { key: 'preuve-privacy', href: new URL('preuve-a-lappui/privacy.html', primaryRoot).href, fr: 'Preuve · Confidentialité', en: 'Preuve · Privacy' },
        { key: 'preuve-terms', href: new URL('preuve-a-lappui/terms.html', primaryRoot).href, fr: 'Preuve · Conditions', en: 'Preuve · Terms' },
        { key: 'serene-privacy', href: new URL('serene/privacy.html', primaryRoot).href, fr: 'Serene · Confidentialité', en: 'Serene · Privacy' },
        { key: 'serene-terms', href: new URL('serene/terms.html', primaryRoot).href, fr: 'Serene · Conditions', en: 'Serene · Terms' }
      ]
    }
  ];
  const hasPiluloPages = location.pathname.toLowerCase().includes('/pilulo/') || root.pathname.toLowerCase().endsWith('/boutch/');
  if (hasPiluloPages) {
    groups[0].items.push({ key: 'pilulo', href: new URL('pilulo/index.html', root).href, fr: 'Pilulo', en: 'Pilulo' });
    groups[3].items.push(
      { key: 'pilulo-privacy', href: new URL('pilulo/privacy.html', root).href, fr: 'Pilulo · Confidentialité', en: 'Pilulo · Privacy' },
      { key: 'pilulo-terms', href: new URL('pilulo/terms.html', root).href, fr: 'Pilulo · Conditions', en: 'Pilulo · Terms' }
    );
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

  const currentPath = decodeURI(location.pathname).toLowerCase().replace(/\/index\.html$/, '/');
  const getActiveKey = () => {
    if (currentPath.includes('/prepcalm/l/')) return 'prepcalm-list';
    if (currentPath.endsWith('/prepcalm/privacy.html')) return 'prepcalm-privacy';
    if (currentPath.endsWith('/prepcalm/terms.html')) return 'prepcalm-terms';
    if (currentPath.endsWith('/prepcalm/')) return 'prepcalm';
    if (currentPath.includes('/preuve-a-lappui/verifier/')) return 'preuve-verify';
    if (currentPath.endsWith('/preuve-a-lappui/privacy.html')) return 'preuve-privacy';
    if (currentPath.endsWith('/preuve-a-lappui/terms.html')) return 'preuve-terms';
    if (currentPath.endsWith('/preuve-a-lappui/')) return 'preuve';
    if (currentPath.endsWith('/serene/privacy.html')) return 'serene-privacy';
    if (currentPath.endsWith('/serene/terms.html')) return 'serene-terms';
    if (currentPath.endsWith('/serene/')) return 'serene';
    if (currentPath.includes('/touchefait/j/')) return 'touch-invite';
    if (currentPath.includes('/touchefait/t/')) return 'touch-tag';
    if (currentPath.endsWith('/touchefait/privacy.html')) return 'touch-privacy';
    if (currentPath.endsWith('/touchefait/terms.html')) return 'touch-terms';
    if (currentPath.endsWith('/touchefait/delete-account.html')) return 'touch-delete';
    if (currentPath.endsWith('/touchefait/')) return 'touch';
    if (currentPath.endsWith('/pilulo/privacy.html')) return 'pilulo-privacy';
    if (currentPath.endsWith('/pilulo/terms.html')) return 'pilulo-terms';
    if (currentPath.endsWith('/pilulo/')) return 'pilulo';
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
  dropdownTrigger.addEventListener('click', () => setDropdown(precisePointer.matches || !dropdown.classList.contains('is-open')));
  dropdown.addEventListener('mouseenter', () => { if (precisePointer.matches) setDropdown(true); });
  dropdown.addEventListener('mouseleave', () => { if (precisePointer.matches) setDropdown(false); });
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
