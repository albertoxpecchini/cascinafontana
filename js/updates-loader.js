// Cascina Fontana — Public updates loader
// Fetches updates from Supabase, renders cards, realtime refresh, lightbox gallery.
(function () {
  const grid = document.getElementById('updatesGrid');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function fmtDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function empty(msg) {
    grid.innerHTML = `<div class="col-span-full text-center py-12 text-dark-muted">${esc(msg)}</div>`;
  }

  function cardHTML(u, idx) {
    const imgs = Array.isArray(u.image_urls) ? u.image_urls : [];
    const first = imgs[0];
    const media = first
      ? `<img src="${esc(first)}" alt="${esc(u.title)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover">`
      : `<div class="absolute inset-0 flex items-center justify-center"><span class="font-heading text-primary/60 text-2xl">${esc(u.title)}</span></div>`;
    const countBadge = imgs.length > 1
      ? `<span class="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium bg-dark-bg/80 text-dark-text rounded-full z-10 backdrop-blur-sm">${imgs.length} foto</span>`
      : '';
    const place = [u.city, u.country].filter(Boolean).join(', ');
    return `
      <article class="update glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${imgs.length ? 'cursor-pointer' : ''}" data-idx="${idx}">
        <div class="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
          ${media}
          ${countBadge}
        </div>
        <div class="p-5">
          <div class="flex items-center gap-2 text-[11px] text-dark-muted mb-2">
            <span>${esc(fmtDate(u.created_at))}</span>
            ${place ? `<span>·</span><span>${esc(place)}</span>` : ''}
          </div>
          <h3 class="font-heading text-lg font-bold text-dark-text mb-2">${esc(u.title)}</h3>
          ${u.description ? `<p class="text-sm text-dark-muted line-clamp-3">${esc(u.description)}</p>` : ''}
        </div>
      </article>
    `;
  }

  let allUpdates = [];

  function render() {
    if (!allUpdates.length) { empty('Nessun aggiornamento al momento.'); return; }
    grid.innerHTML = allUpdates.map((u, i) => cardHTML(u, i)).join('');
    grid.querySelectorAll('.update').forEach(card => {
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

  // ---------- Lightbox ----------
  let lb = null;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'updatesLightbox';
    lb.className = 'fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm hidden items-center justify-center p-4';
    lb.innerHTML = `
      <button data-lb-close class="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-card/80 border border-dark-border text-dark-text hover:bg-primary hover:text-dark-bg transition flex items-center justify-center">✕</button>
      <button data-lb-prev class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-card/80 border border-dark-border text-dark-text hover:bg-primary hover:text-dark-bg transition flex items-center justify-center text-xl">‹</button>
      <button data-lb-next class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-card/80 border border-dark-border text-dark-text hover:bg-primary hover:text-dark-bg transition flex items-center justify-center text-xl">›</button>
      <div class="max-w-5xl w-full flex flex-col items-center gap-3">
        <img data-lb-img class="max-h-[75vh] max-w-full object-contain rounded-lg" alt="">
        <div data-lb-caption class="text-center text-dark-text"></div>
        <div data-lb-counter class="text-xs text-dark-muted"></div>
      </div>
    `;
    document.body.appendChild(lb);
    lb.querySelector('[data-lb-close]').addEventListener('click', closeLightbox);
    lb.querySelector('[data-lb-prev]').addEventListener('click', () => step(-1));
    lb.querySelector('[data-lb-next]').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (lb.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    return lb;
  }

  let lbUpdate = null;
  let lbIndex = 0;

  function openLightbox(u) {
    lbUpdate = u;
    lbIndex = 0;
    const el = ensureLightbox();
    el.classList.remove('hidden');
    el.classList.add('flex');
    document.body.style.overflow = 'hidden';
    syncLightbox();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.add('hidden');
    lb.classList.remove('flex');
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
    const urls = lbUpdate.image_urls;
    lb.querySelector('[data-lb-img]').src = urls[lbIndex];
    const place = [lbUpdate.city, lbUpdate.country].filter(Boolean).join(', ');
    const meta = [fmtDate(lbUpdate.created_at), place].filter(Boolean).join(' · ');
    lb.querySelector('[data-lb-caption]').innerHTML =
      `<div class="font-heading font-bold text-lg">${esc(lbUpdate.title)}</div>` +
      (meta ? `<div class="text-xs text-dark-muted mt-1">${esc(meta)}</div>` : '');
    lb.querySelector('[data-lb-counter]').textContent = `${lbIndex + 1} / ${urls.length}`;
    const single = urls.length <= 1;
    lb.querySelector('[data-lb-prev]').style.display = single ? 'none' : '';
    lb.querySelector('[data-lb-next]').style.display = single ? 'none' : '';
  }

  // Initial load + realtime
  load();
  if (window.sb) {
    window.sb.channel('updates-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, load)
      .subscribe();
  }
})();
