(function () {
  'use strict';

  const LINKS = [
    { href: '/main', label: 'Home' },
    { href: '/storia', label: 'Storia' },
    { href: '/dati', label: 'Dati' },
    { href: '/galleria', label: 'Galleria' },
    { href: '/prodotti', label: 'Prodotti' },
    { href: '/novita', label: 'Novità' },
    { href: '/shop', label: 'Shop' },
    { href: '/contatti', label: 'Contatti' },
  ];

  const STYLE_ID = 'cfm-mobile-nav-style';
  const DRAWER_ID = 'cfm-mobile-drawer';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .cfm-mobile-toggle,
      .cfm-mobile-drawer { display: none; }

      @media (max-width: 1023px) {
        html.cfm-mobile-nav-open,
        html.cfm-mobile-nav-open body { overflow: hidden; }

        header .max-w-6xl { gap: 0.75rem; padding-left: 1rem; padding-right: 1rem; }
        header a[href="/main"] span { max-width: 44vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .cfm-shop-cta { padding-left: 0.85rem !important; padding-right: 0.85rem !important; }

        .cfm-mobile-toggle {
          display: inline-flex;
          width: 2.25rem;
          height: 2.25rem;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          transition: background 160ms ease, border-color 160ms ease;
        }

        .cfm-mobile-toggle:hover,
        .cfm-mobile-toggle[aria-expanded="true"] {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .cfm-mobile-toggle-box {
          position: relative;
          width: 1rem;
          height: 0.75rem;
        }

        .cfm-mobile-toggle-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transition: transform 180ms ease, opacity 180ms ease, top 180ms ease;
        }

        .cfm-mobile-toggle-line:nth-child(1) { top: 0; }
        .cfm-mobile-toggle-line:nth-child(2) { top: 5px; }
        .cfm-mobile-toggle-line:nth-child(3) { top: 10px; }

        .cfm-mobile-toggle[aria-expanded="true"] .cfm-mobile-toggle-line:nth-child(1) { top: 5px; transform: rotate(45deg); }
        .cfm-mobile-toggle[aria-expanded="true"] .cfm-mobile-toggle-line:nth-child(2) { opacity: 0; }
        .cfm-mobile-toggle[aria-expanded="true"] .cfm-mobile-toggle-line:nth-child(3) { top: 5px; transform: rotate(-45deg); }

        .cfm-mobile-drawer {
          position: fixed;
          inset: 4rem 0 0 0;
          z-index: 49;
          display: block;
          opacity: 0;
          pointer-events: none;
          background: rgba(15, 15, 15, 0.98);
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          transform: translateY(-0.5rem);
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .cfm-mobile-drawer.is-open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .cfm-mobile-drawer__inner {
          min-height: 100%;
          padding: 1rem;
          overflow-y: auto;
        }

        .cfm-mobile-drawer__nav {
          display: grid;
          gap: 0.55rem;
          max-width: 32rem;
          margin: 0 auto;
        }

        .cfm-mobile-drawer__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 3rem;
          padding: 0.85rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 0.85rem;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.98rem;
          font-weight: 600;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .cfm-mobile-drawer__link::after {
          content: '›';
          color: rgba(62, 207, 142, 0.9);
          font-size: 1.25rem;
          line-height: 1;
        }

        .cfm-mobile-drawer__link:hover,
        .cfm-mobile-drawer__link.is-active {
          background: rgba(62, 207, 142, 0.11);
          border-color: rgba(62, 207, 142, 0.32);
          color: #ffffff;
        }
      }

      @media (max-width: 420px) {
        .cfm-shop-cta { font-size: 0 !important; }
        .cfm-shop-cta::after { content: 'Shop'; font-size: 13px; }
      }
    `;
    document.head.appendChild(style);
  }

  function currentPath() {
    const path = window.location.pathname.replace(/\/$/, '');
    return path || '/main';
  }

  function buildDrawer() {
    const drawer = document.createElement('div');
    drawer.id = DRAWER_ID;
    drawer.className = 'cfm-mobile-drawer';
    drawer.setAttribute('aria-hidden', 'true');

    const activePath = currentPath();
    const links = LINKS.map(({ href, label }) => {
      const normalizedHref = href.replace(/\/$/, '');
      const active = activePath === normalizedHref || (activePath === '' && href === '/main');
      return `<a class="cfm-mobile-drawer__link${active ? ' is-active' : ''}" href="${href}">${label}</a>`;
    }).join('');

    drawer.innerHTML = `<div class="cfm-mobile-drawer__inner"><nav class="cfm-mobile-drawer__nav" aria-label="Navigazione mobile">${links}</nav></div>`;
    return drawer;
  }

  function initMobileNav() {
    const header = document.querySelector('header');
    if (!header || document.getElementById(DRAWER_ID)) return;

    injectStyles();

    const toolbar = header.querySelector('.max-w-6xl');
    const actions = toolbar ? toolbar.querySelector('.shrink-0:last-child') : null;
    if (!toolbar || !actions) return;

    const shopCta = actions.querySelector('a[href="/shop"]');
    if (shopCta) {
      shopCta.classList.add('cfm-shop-cta');
      shopCta.setAttribute('aria-label', 'Vai allo shop');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cfm-mobile-toggle';
    button.setAttribute('aria-label', 'Apri menu');
    button.setAttribute('aria-controls', DRAWER_ID);
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span class="cfm-mobile-toggle-box" aria-hidden="true"><span class="cfm-mobile-toggle-line"></span><span class="cfm-mobile-toggle-line"></span><span class="cfm-mobile-toggle-line"></span></span>';
    actions.appendChild(button);

    const drawer = buildDrawer();
    header.insertAdjacentElement('afterend', drawer);

    function setOpen(open) {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.documentElement.classList.toggle('cfm-mobile-nav-open', open);
    }

    button.addEventListener('click', () => {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });

    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setOpen(false);
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', closeOnDesktop);
    } else {
      desktopQuery.addListener(closeOnDesktop);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
}());
