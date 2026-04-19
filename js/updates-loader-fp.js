// Cascina Fontana — Public updates loader · /flashplayer variant
// Flash/Adobe 2012 UI style. Targets #updatesGrid + plain-CSS lightbox.
(function () {
  const grid = document.getElementById('updatesGrid');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function fmtDate(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function empty(msg) {
    grid.innerHTML = `<p style="color:#888;text-align:center;padding:32px;font-style:italic;grid-column:1/-1">${esc(msg)}</p>`;
  }

  function cardHTML(u, idx) {
    const imgs  = Array.isArray(u.image_urls) ? u.image_urls : [];
    const first = imgs[0];
    const media = first
      ? `<img src="${esc(first)}" alt="${esc(u.title)}" loading="lazy">`
      : `<span>${esc(u.title)}</span>`;
    const countBadge = imgs.length > 1
      ? `<em class="badge">${imgs.length} foto</em>`
      : '';
    const place = [u.city, u.country].filter(Boolean).join(', ');
    const meta  = [fmtDate(u.created_at), place].filter(Boolean).join(' · ');
    const desc  = u.description
      ? `<p class="update__desc">${esc(u.description)}</p>`
      : '';
    return `
      <article class="update${imgs.length ? ' update--clickable' : ''}" data-idx="${idx}">
        <div class="update__img">
          ${media}
          ${countBadge}
        </div>
        <div class="update__body">
          ${meta ? `<p class="update__meta">${esc(meta)}</p>` : ''}
          <h3>${esc(u.title)}</h3>
          ${desc}
        </div>
      </article>
    `;
  }

  let allUpdates = [];

  function render() {
    if (!allUpdates.length) { empty('Nessun aggiornamento al momento.'); return; }
    grid.innerHTML = allUpdates.map((u, i) => cardHTML(u, i)).join('');
    grid.querySelectorAll('.update--clickable').forEach(card => {
      card.addEventListener('click', () => {
        const u = allUpdates[Number(card.dataset.idx)];
        if (u && Array.isArray(u.image_urls) && u.image_urls.length) openLightbox(u);
      });
    });
  }

  async function load() {
    if (!window.sb) { empty('Backend non configurato.'); return; }
    const { data, error } = await window.sb
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { empty('Errore: ' + error.message); return; }
    allUpdates = data || [];
    render();
  }

  // ── Lightbox (plain CSS, no Tailwind) ──
  let lb = null;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'fp-lightbox';
    lb.innerHTML = `
      <div class="fp-lightbox__inner">
        <button data-lb-close class="fp-lb-btn fp-lb-close" title="Chiudi">✕</button>
        <button data-lb-prev class="fp-lb-btn fp-lb-nav fp-lb-prev" title="Precedente">&#8249;</button>
        <button data-lb-next class="fp-lb-btn fp-lb-nav fp-lb-next" title="Successiva">&#8250;</button>
        <div class="fp-lb-content">
          <img data-lb-img class="fp-lb-img" alt="">
          <div data-lb-caption class="fp-lb-caption"></div>
          <div data-lb-counter class="fp-lb-counter"></div>
        </div>
      </div>
    `;
    document.body.appendChild(lb);
    lb.querySelector('[data-lb-close]').addEventListener('click', closeLightbox);
    lb.querySelector('[data-lb-prev]').addEventListener('click', () => step(-1));
    lb.querySelector('[data-lb-next]').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target === lb.querySelector('.fp-lightbox__inner')) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb || lb.style.display === 'none') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft')  step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    return lb;
  }

  let lbUpdate = null;
  let lbIndex  = 0;

  function openLightbox(u) {
    lbUpdate = u;
    lbIndex  = 0;
    const el = ensureLightbox();
    el.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    syncLightbox();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.style.display = 'none';
    document.body.style.overflow = '';
    lbUpdate = null;
  }

  function step(delta) {
    if (!lbUpdate) return;
    const n = lbUpdate.image_urls.length;
    lbIndex = (lbIndex + delta + n) % n;
    syncLightbox();
  }

  function syncLightbox() {
    if (!lb || !lbUpdate) return;
    const urls  = lbUpdate.image_urls;
    const single = urls.length <= 1;
    lb.querySelector('[data-lb-img]').src = urls[lbIndex];
    const place = [lbUpdate.city, lbUpdate.country].filter(Boolean).join(', ');
    const meta  = [fmtDate(lbUpdate.created_at), place].filter(Boolean).join(' · ');
    lb.querySelector('[data-lb-caption]').innerHTML =
      `<strong>${esc(lbUpdate.title)}</strong>` +
      (meta ? `<br><span>${esc(meta)}</span>` : '');
    lb.querySelector('[data-lb-counter]').textContent = `${lbIndex + 1} / ${urls.length}`;
    lb.querySelector('[data-lb-prev]').style.display = single ? 'none' : '';
    lb.querySelector('[data-lb-next]').style.display = single ? 'none' : '';
  }

  // Initial load + realtime
  load();
  if (window.sb) {
    window.sb.channel('updates-public-fp')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, load)
      .subscribe();
  }
})();
