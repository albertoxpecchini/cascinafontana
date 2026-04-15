/* Cascina Fontana — main.js — zero dependencies */
'use strict';

/* ── NAV: transparent → solid on scroll ─────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── MOBILE MENU ─────────────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  })
);

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
  );
  reveals.forEach(el => observer.observe(el));
} else {
  /* fallback: show all immediately */
  reveals.forEach(el => el.classList.add('visible'));
}

/* ── FORM → Web3Forms ────────────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    const orig = btn.textContent;
    btn.textContent = 'Invio…';
    btn.disabled = true;

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (data.success) {
        btn.textContent = 'Inviato';
        form.reset();
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
      } else {
        throw new Error(data.message || 'error');
      }
    } catch (err) {
      console.error(err);
      btn.textContent = 'Errore — riprova';
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    }
  });
}
