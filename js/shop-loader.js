// Cascina Fontana — Public shop loader
// Fetches listings from Supabase, renders cards, handles filter + realtime.
(function () {
  const grid  = document.getElementById('shopGrid');
  const chips = document.querySelectorAll('#shopFilter .chip');
  if (!grid) return;

  const CAT_LABEL = { macchine: 'MACCHINARIO', prodotti: 'PRODOTTO', materiali: 'MATERIALE' };

  let currentCat = 'all';
  let allListings = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function cardHTML(l) {
    const sold = l.status === 'sold';
    const firstImg = (Array.isArray(l.image_urls) && l.image_urls[0]) || l.image_url;
    const img = firstImg
      ? `<img src="${esc(firstImg)}" alt="${esc(l.title)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover">`
      : `<span class="font-heading text-2xl font-bold text-primary/60 relative z-10">${esc(l.title)}</span>`;
    const badge = sold
      ? `<span class="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium bg-red-500 text-white rounded-full z-10">VENDUTO</span>`
      : (CAT_LABEL[l.category]
          ? `<span class="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium bg-primary text-dark-bg rounded-full z-10">${CAT_LABEL[l.category]}</span>`
          : '');
    const subj = encodeURIComponent(`Shop | ${l.title}`);
    return `
      <article class="product glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${sold ? 'opacity-70' : ''}" data-cat="${esc(l.category)}">
        <div class="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
          ${img}
          ${badge}
        </div>
        <div class="p-5">
          <h3 class="font-heading text-lg font-bold text-dark-text mb-1">${esc(l.title)}</h3>
          <p class="text-xs text-dark-muted mb-3 line-clamp-2">${esc(l.description)}</p>
          <div class="flex items-center justify-between">
            <span class="font-heading text-xl font-bold text-primary">${esc(l.price) || '—'}</span>
            <a href="mailto:pzkko@yahoo.com?subject=${subj}" class="text-xs text-primary hover:underline">Info →</a>
          </div>
        </div>
      </article>
    `;
  }

  function empty(msg) {
    grid.innerHTML = `<div class="col-span-full text-center py-12 text-dark-muted">${esc(msg)}</div>`;
  }

  function render() {
    const list = currentCat === 'all' ? allListings : allListings.filter(l => l.category === currentCat);
    if (!list.length) { empty('Nessun annuncio disponibile.'); return; }
    grid.innerHTML = list.map(cardHTML).join('');
  }

  async function load() {
    if (!window.sb) { empty('Backend non configurato.'); return; }
    const { data, error } = await window.sb
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { empty('Errore: ' + error.message); return; }
    allListings = data || [];
    render();
  }

  // Filter chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      currentCat = chip.dataset.cat;
      chips.forEach(c => {
        c.classList.remove('bg-primary', 'text-dark-bg', 'font-medium');
        c.classList.add('bg-dark-card', 'text-dark-muted', 'border', 'border-dark-border');
      });
      chip.classList.add('bg-primary', 'text-dark-bg', 'font-medium');
      chip.classList.remove('bg-dark-card', 'text-dark-muted', 'border', 'border-dark-border');
      render();
    });
  });

  // Initial load + realtime
  load();
  if (window.sb) {
    window.sb.channel('listings-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, load)
      .subscribe();
  }
})();
