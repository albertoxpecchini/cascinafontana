import { fetchListings } from '/js/supabase.js';

let cachedItems = null;

async function getItems() {
  if (cachedItems) return cachedItems;
  cachedItems = await fetchListings({ availableOnly: true });
  return cachedItems;
}

function productCard(item, preview = false) {
  const imgHtml = item.image_url
    ? `<img class="product-card-img" src="${item.image_url}" alt="${item.title}" loading="lazy">`
    : `<div class="product-card-img-placeholder">📦</div>`;

  const paypalHtml = preview
    ? `<a href="/shop" class="btn btn-ghost btn-sm" style="width:100%;text-align:center;">Vedi nello shop</a>`
    : `<div id="paypal-btn-${item.id}"></div>`;

  return `
    <div class="product-card">
      ${imgHtml}
      <div class="product-card-body">
        <div class="product-card-meta">
          <h3>${item.title}</h3>
          ${item.price ? `<span class="product-price">€${item.price}</span>` : ''}
        </div>
        ${item.category    ? `<span class="badge badge-gray">${item.category}</span>` : ''}
        ${item.description ? `<p class="product-card-desc">${item.description}</p>`   : ''}
        <div class="product-card-footer">${paypalHtml}</div>
      </div>
    </div>
  `;
}

function renderItems(container, items, preview) {
  if (!items.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>Nessun prodotto disponibile.</p></div>`;
    return;
  }
  container.innerHTML = items.map(item => productCard(item, preview)).join('');
}

function renderPaypalButtons(items) {
  if (typeof paypal === 'undefined') return;

  items.forEach(item => {
    const btnContainer = document.getElementById(`paypal-btn-${item.id}`);
    if (!btnContainer) return;

    paypal.Buttons({
      style: { layout: 'horizontal', color: 'gold', shape: 'pill', label: 'pay', height: 40 },

      async createOrder() {
        const res = await fetch('/api/paypal-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: item.id, qty: 1, price: item.price, title: item.title }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Errore PayPal');
        return data.id;
      },

      async onApprove({ orderID }) {
        const res = await fetch('/api/paypal-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderID }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Errore cattura');
        showConfirmation(item.title);
      },

      onError(err) {
        console.error('[PayPal]', err);
        alert('Si è verificato un errore con il pagamento. Riprova.');
      },
    }).render(`#paypal-btn-${item.id}`);
  });
}

export async function loadShopPreview(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const items = (await getItems()).slice(0, limit);
    renderItems(container, items, true);
  } catch (err) {
    console.error('[shop]', err);
    container.innerHTML = `<div class="empty-state"><p>Errore nel caricamento.</p></div>`;
  }
}

export async function loadShopAll(containerId, filterCategory = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const all   = await getItems();
    const items = filterCategory ? all.filter(i => (i.category ?? '').toLowerCase() === filterCategory.toLowerCase()) : all;
    renderItems(container, items, false);
    renderPaypalButtons(items);
  } catch (err) {
    console.error('[shop]', err);
    container.innerHTML = `<div class="empty-state"><p>Errore nel caricamento.</p></div>`;
  }
}

function showConfirmation(title) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:300;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;padding:40px;max-width:400px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:16px;">✓</div>
      <h3 style="margin-bottom:8px;">Pagamento completato!</h3>
      <p style="color:var(--color-muted);margin-bottom:24px;">
        Grazie per aver acquistato <strong>${title}</strong>. Riceverai una email di conferma.
      </p>
      <button class="btn btn-primary" id="modal-close-btn">Chiudi</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#modal-close-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
