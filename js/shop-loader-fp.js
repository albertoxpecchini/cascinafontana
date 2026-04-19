// Cascina Fontana — Public shop loader · /flashplayer variant
// Flash/Adobe 2012 UI style. Targets #shopGrid + #shopFilter .chip
(function () {
  const grid  = document.getElementById('shopGrid');
  const chips = document.querySelectorAll('#shopFilter .chip');
  if (!grid) return;

  const CAT_LABEL = { macchine: 'Macchinario', prodotti: 'Prodotto', materiali: 'Materiale' };

  let currentCat = 'all';
  let allListings = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function cardHTML(l) {
    const sold     = l.status === 'sold';
    const firstImg = (Array.isArray(l.image_urls) && l.image_urls[0]) || l.image_url;
    const imgPart  = firstImg
      ? `<img src="${esc(firstImg)}" alt="${esc(l.title)}" loading="lazy">`
      : `<span>${esc(l.title)}</span>`;
    const badge = sold
      ? `<em class="badge">VENDUTO</em>`
      : (CAT_LABEL[l.category]
          ? `<em class="badge badge--blue">${esc(CAT_LABEL[l.category]).toUpperCase()}</em>`
          : '');
    const subj  = encodeURIComponent('Richiesta disponibilita | ' + l.title);
    const price = l.price ? esc(l.price) : '—';
    const desc  = l.description ? `<p class="product__meta">${esc(l.description)}</p>` : '';
    return `
      <article class="product${sold ? ' product--sold' : ''}" data-cat="${esc(l.category)}">
        <div class="product__img">
          ${imgPart}
          ${badge}
        </div>
        <div class="product__body">
          <h3>${esc(l.title)}</h3>
          ${desc}
          <p class="product__price">${price}</p>
          <a class="Button" href="mailto:pzkko@yahoo.com?subject=${subj}">Richiedi informazioni</a>
        </div>
      </article>
    `;
  }

  function empty(msg) {
    grid.innerHTML = `<p style="color:#888;text-align:center;padding:32px;font-style:italic;grid-column:1/-1">${esc(msg)}</p>`;
  }

  function render() {
    const list = currentCat === 'all' ? allListings : allListings.filter(l => l.category === currentCat);
    if (!list.length) { empty('Nessuna disponibilita pubblicata al momento.'); return; }
    grid.innerHTML = list.map(cardHTML).join('');
  }

  async function load() {
    if (!window.sb) { empty('Archivio non disponibile.'); return; }
    const { data, error } = await window.sb
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { empty('Errore di caricamento: ' + error.message); return; }
    allListings = data || [];
    render();
  }

  // Filter chips — toggle .is-on (Flash style)
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      currentCat = chip.dataset.cat;
      chips.forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      render();
    });
  });

  // Initial load + realtime
  load();
  if (window.sb) {
    window.sb.channel('listings-public-fp')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, load)
      .subscribe();
  }
})();
