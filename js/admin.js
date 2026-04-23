import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  window.__ENV__?.SUPABASE_URL  ?? '',
  window.__ENV__?.SUPABASE_ANON ?? ''
);

// ── DOM ──────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const loginScreen   = $('login-screen');
const adminApp      = $('admin-app');
const loginForm     = $('login-form');
const loginError    = $('login-error');
const loginBtn      = $('login-btn');
const adminEmailEl  = $('admin-email');
const logoutBtn     = $('logout-btn');

const tabBtns       = document.querySelectorAll('.tab-btn');
const tabShop       = $('tab-shop');
const tabNovita     = $('tab-novita');

const shopGrid      = $('shop-grid');
const btnNewProduct = $('btn-new-product');

const postList      = $('post-list');
const btnPublish    = $('btn-publish');
const postTitleEl   = $('post-title');
const postDescEl    = $('post-desc');

const productModal  = $('product-modal');
const modalTitleEl  = $('modal-title-text');
const modalClose    = $('modal-close');
const modalCancel   = $('modal-cancel');
const modalSave     = $('modal-save');
const productIdEl   = $('product-id');
const pTitle        = $('p-title');
const pPrice        = $('p-price');
const pCategory     = $('p-category');
const pStatus       = $('p-status');
const pDesc         = $('p-desc');
const pImageFile    = $('p-image-file');
const pImageUrl     = $('p-image-url');
const imgUploadArea = $('img-upload-area');
const imgPreview    = $('img-preview');
const imgPh         = $('img-ph');

// ── AUTH ─────────────────────────────────────────────────────────────────────
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) showDashboard(session.user);
  else         showLogin();
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginError.textContent = '';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Accesso in corso…';

  const { error } = await supabase.auth.signInWithPassword({
    email:    $('login-email').value.trim(),
    password: $('login-password').value,
  });

  if (error) {
    loginError.textContent = 'Credenziali non valide.';
    loginBtn.disabled = false;
    loginBtn.textContent = 'Accedi';
  }
});

logoutBtn.addEventListener('click', () => supabase.auth.signOut());

function showLogin() {
  loginScreen.hidden = false;
  adminApp.hidden    = true;
}

function showDashboard(user) {
  loginScreen.hidden    = true;
  adminApp.hidden       = false;
  adminEmailEl.textContent = user.email;
  loadShop();
  loadNovita();
}

// ── TABS ─────────────────────────────────────────────────────────────────────
tabBtns.forEach(btn => btn.addEventListener('click', () => {
  tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  tabShop.hidden   = btn.dataset.tab !== 'shop';
  tabNovita.hidden = btn.dataset.tab !== 'novita';
}));

// ── SHOP — LOAD ───────────────────────────────────────────────────────────────
async function loadShop() {
  shopGrid.innerHTML = '<p style="color:var(--muted);font-size:.9rem;padding:.5rem 0">Caricamento…</p>';

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    shopGrid.innerHTML = `<p style="color:var(--danger)">Errore: ${esc(error.message)}</p>`;
    return;
  }

  if (!data.length) {
    shopGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div style="font-size:2.5rem">📦</div>
        <p>Nessun prodotto. Aggiungi il primo!</p>
      </div>`;
    return;
  }

  shopGrid.innerHTML = data.map(productCard).join('');

  shopGrid.querySelectorAll('[data-edit]').forEach(btn =>
    btn.addEventListener('click', () => openModal(data.find(p => p.id === btn.dataset.edit)))
  );
  shopGrid.querySelectorAll('[data-del]').forEach(btn =>
    btn.addEventListener('click', () => deleteProduct(btn.dataset.del))
  );
}

function productCard(p) {
  const statusBadge = p.status === 'available'
    ? '<span class="badge badge-green">Disponibile</span>'
    : '<span class="badge badge-gray">Non disponibile</span>';

  const img = p.image_url
    ? `<img class="product-card-img" src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const ph = `<div class="product-card-img-ph" ${p.image_url ? 'style="display:none"' : ''}>📷</div>`;

  const excerpt = p.description
    ? `<div style="font-size:.82rem;color:var(--muted);margin-top:.2rem;line-height:1.4">
        ${esc(p.description.slice(0, 90))}${p.description.length > 90 ? '…' : ''}
       </div>`
    : '';

  return `
    <article class="product-card">
      ${img}${ph}
      <div class="product-card-body">
        <div class="product-card-title">${esc(p.title)}</div>
        <div class="product-card-meta">
          <span class="product-price">€${Number(p.price).toFixed(2)}</span>
          ${p.category ? `<span class="badge">${esc(p.category)}</span>` : ''}
          ${statusBadge}
        </div>
        ${excerpt}
      </div>
      <div class="product-card-actions">
        <button class="btn btn-secondary" style="padding:.4rem .8rem;font-size:.8rem" data-edit="${p.id}">Modifica</button>
        <button class="btn btn-danger"    style="padding:.4rem .8rem;font-size:.8rem" data-del="${p.id}">Elimina</button>
      </div>
    </article>`;
}

async function deleteProduct(id) {
  if (!confirm('Eliminare questo prodotto?')) return;
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) { alert('Errore: ' + error.message); return; }
  loadShop();
}

// ── MODAL — OPEN / CLOSE ─────────────────────────────────────────────────────
btnNewProduct.addEventListener('click', () => openModal(null));
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
productModal.addEventListener('click', e => { if (e.target === productModal) closeModal(); });

document.addEventListener('keydown', e => { if (e.key === 'Escape' && !productModal.hidden) closeModal(); });

function openModal(p) {
  productIdEl.value  = p?.id ?? '';
  pTitle.value       = p?.title ?? '';
  pPrice.value       = p?.price ?? '';
  pCategory.value    = p?.category ?? 'Prodotti';
  pStatus.value      = p?.status ?? 'available';
  pDesc.value        = p?.description ?? '';
  pImageUrl.value    = p?.image_url ?? '';
  setPreview(p?.image_url ?? '');
  modalTitleEl.textContent = p ? 'Modifica prodotto' : 'Nuovo prodotto';
  productModal.hidden = false;
  pTitle.focus();
}

function closeModal() {
  productModal.hidden = true;
  pImageFile.value    = '';
}

// ── MODAL — SAVE ─────────────────────────────────────────────────────────────
modalSave.addEventListener('click', async () => {
  if (!pTitle.value.trim() || !pPrice.value) {
    alert('Titolo e prezzo sono obbligatori.');
    return;
  }

  setModalSaving(true);

  const payload = {
    title:       pTitle.value.trim(),
    price:       parseFloat(pPrice.value),
    category:    pCategory.value,
    status:      pStatus.value,
    description: pDesc.value.trim() || null,
    image_url:   pImageUrl.value.trim() || null,
  };

  const id = productIdEl.value;
  const { error } = id
    ? await supabase.from('listings').update(payload).eq('id', id)
    : await supabase.from('listings').insert([payload]);

  setModalSaving(false);
  if (error) { alert('Errore: ' + error.message); return; }

  closeModal();
  loadShop();
});

function setModalSaving(on) {
  modalSave.disabled    = on;
  modalSave.textContent = on ? 'Salvataggio…' : 'Salva';
}

// ── IMAGE UPLOAD ──────────────────────────────────────────────────────────────
imgUploadArea.addEventListener('click', () => pImageFile.click());

pImageFile.addEventListener('change', async () => {
  const file = pImageFile.files[0];
  if (!file) return;

  setModalSaving(true);
  modalSave.textContent = 'Caricamento immagine…';

  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { data, error } = await supabase.storage.from('shop').upload(path, file, { upsert: true });

  setModalSaving(false);
  if (error) { alert('Errore upload: ' + error.message); return; }

  const { data: { publicUrl } } = supabase.storage.from('shop').getPublicUrl(data.path);
  pImageUrl.value = publicUrl;
  setPreview(publicUrl);
});

pImageUrl.addEventListener('input', () => setPreview(pImageUrl.value));

function setPreview(url) {
  if (url) {
    imgPreview.src = url;
    imgPreview.hidden = false;
    imgPh.hidden      = true;
  } else {
    imgPreview.hidden = true;
    imgPh.hidden      = false;
  }
}

// ── NOVITÀ — LOAD ─────────────────────────────────────────────────────────────
async function loadNovita() {
  postList.innerHTML = '<p style="color:var(--muted);font-size:.9rem;padding:.5rem 0">Caricamento…</p>';

  const { data, error } = await supabase
    .from('updates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    postList.innerHTML = `<p style="color:var(--danger)">Errore: ${esc(error.message)}</p>`;
    return;
  }

  if (!data.length) {
    postList.innerHTML = `
      <div class="empty-state">
        <div style="font-size:2.5rem">📢</div>
        <p>Nessun aggiornamento ancora.</p>
      </div>`;
    return;
  }

  postList.innerHTML = data.map(postItem).join('');

  postList.querySelectorAll('[data-del-post]').forEach(btn =>
    btn.addEventListener('click', () => deletePost(btn.dataset.delPost))
  );
}

function postItem(p) {
  const date  = new Date(p.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  const title = p.title || p.titolo || '';
  return `
    <div class="post-item">
      <div class="post-date">${date}</div>
      <div class="post-body">
        ${title       ? `<div class="post-title">${esc(title)}</div>` : ''}
        ${p.description ? `<div class="post-desc">${esc(p.description)}</div>` : ''}
      </div>
      <button class="post-del" data-del-post="${esc(p.id)}" title="Elimina">&times;</button>
    </div>`;
}

// ── NOVITÀ — PUBLISH ──────────────────────────────────────────────────────────
btnPublish.addEventListener('click', async () => {
  const title       = postTitleEl.value.trim();
  const description = postDescEl.value.trim();
  if (!title && !description) return;

  btnPublish.disabled    = true;
  btnPublish.textContent = 'Pubblicazione…';

  const { error } = await supabase.from('updates').insert([{ title, description }]);

  btnPublish.disabled    = false;
  btnPublish.textContent = 'Pubblica';

  if (error) { alert('Errore: ' + error.message); return; }

  postTitleEl.value = '';
  postDescEl.value  = '';
  loadNovita();
});

async function deletePost(id) {
  if (!confirm('Eliminare questo aggiornamento?')) return;
  const { error } = await supabase.from('updates').delete().eq('id', id);
  if (error) { alert('Errore: ' + error.message); return; }
  loadNovita();
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
