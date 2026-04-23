const NAV_ITEMS = [
  { href: '/main',     label: 'Home' },
  { href: '/storia',   label: 'Storia' },
  { href: '/dati',     label: 'Dati' },
  { href: '/galleria', label: 'Galleria' },
  { href: '/prodotti', label: 'Prodotti' },
  { href: '/novita',   label: 'Novità' },
  { href: '/shop',     label: 'Shop' },
  { href: '/contatti', label: 'Contatti' },
];

export function initNav(activePage) {
  const links = NAV_ITEMS.map(({ href, label }) => {
    const cls = href === `/${activePage}` ? 'active' : '';
    return `<a href="${href}" class="${cls}">${label}</a>`;
  }).join('');

  const headerHtml = `
    <header class="site-header">
      <div class="container">
        <a href="/main" class="nav-brand">Cascina Fontana</a>
        <nav class="nav-links" aria-label="Navigazione principale">${links}</nav>
        <a href="/shop" class="nav-cta">Shop</a>
        <button class="nav-hamburger" aria-expanded="false" aria-label="Apri menu" id="nav-hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <nav class="nav-mobile" id="nav-mobile" aria-label="Menu mobile">${links}</nav>
  `;

  const placeholder = document.getElementById('site-header');
  if (placeholder) {
    placeholder.outerHTML = headerHtml;
  } else {
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
  }

  const btn    = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-mobile');
  if (!btn || !drawer) return;

  function closeDrawer() {
    drawer.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && !btn.contains(e.target)) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}
