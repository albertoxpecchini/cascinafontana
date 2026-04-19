// Cascina Fontana — Admin dashboard logic
(function () {
  const $ = (id) => document.getElementById(id);

  // ---------- Boot / auth gate ----------
  const bootLoader = $('bootLoader');
  const adminRoot  = $('adminRoot');

  function fail(msg) {
    bootLoader.innerHTML = `<p class="text-red-400">${msg}</p><p class="mt-3"><a href="/admin/login.html" class="text-primary underline">Login</a></p>`;
  }

  async function boot() {
    if (!window.sb) { fail('Backend non configurato (js/supabase-client.js).'); return; }
    const { data, error } = await window.sb.auth.getSession();
    if (error || !data.session) {
      window.location.href = '/admin/login.html';
      return;
    }
    $('userEmail').textContent = data.session.user.email || '';
    bootLoader.classList.add('hidden');
    adminRoot.classList.remove('hidden');
    wireEvents();
    loadListings();

    // Listen to auth changes → bounce on signout
    window.sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.href = '/admin/login.html';
    });
  }

  // ---------- State ----------
  let editingId = null;

  // ---------- Helpers ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function showFormError(msg) {
    const el = $('formError');
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  function clearFormError() { $('formError').classList.add('hidden'); }

  function resetForm() {
    $('listingForm').reset();
    $('listingId').value = '';
    editingId = null;
    $('formTitle').innerHTML = 'Nuovo <span class="gradient-text">annuncio</span>';
    $('cancelEditBtn').classList.add('hidden');
    $('imagePreview').classList.add('hidden');
    $('uploadStatus').textContent = '';
    clearFormError();
  }

  function fillForm(l) {
    $('listingId').value   = l.id;
    $('title').value       = l.title || '';
    $('price').value       = l.price || '';
    $('category').value    = l.category || 'macchine';
    $('description').value = l.description || '';
    $('status').value      = l.status || 'available';
    $('image_url').value   = l.image_url || '';
    if (l.image_url) {
      $('imagePreviewImg').src = l.image_url;
      $('imagePreview').classList.remove('hidden');
    } else {
      $('imagePreview').classList.add('hidden');
    }
    editingId = l.id;
    $('formTitle').innerHTML = 'Modifica <span class="gradient-text">annuncio</span>';
    $('cancelEditBtn').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- Image upload ----------
  async function uploadImage(file) {
    const ext   = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path  = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await window.sb.storage.from('listings').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });
    if (upErr) throw upErr;
    const { data } = window.sb.storage.from('listings').getPublicUrl(path);
    return data.publicUrl;
  }

  // ---------- CRUD ----------
  async function loadListings() {
    const container = $('listingsContainer');
    container.innerHTML = `<div class="text-center text-dark-muted py-6 text-sm">Caricamento…</div>`;
    const { data, error } = await window.sb.from('listings').select('*').order('created_at', { ascending: false });
    if (error) {
      container.innerHTML = `<div class="text-red-400 py-4 text-sm">Errore: ${esc(error.message)}</div>`;
      return;
    }
    $('countBadge').textContent = data.length ? `· ${data.length}` : '';
    if (!data.length) {
      container.innerHTML = `<div class="text-dark-muted py-6 text-sm text-center">Nessun annuncio. Crea il primo sopra.</div>`;
      return;
    }
    container.innerHTML = data.map(rowHTML).join('');
    // Wire actions
    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const l = data.find(x => x.id === btn.dataset.edit);
        if (l) fillForm(l);
      });
    });
    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deleteListing(btn.dataset.delete, btn.dataset.title));
    });
    container.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', () => toggleStatus(btn.dataset.toggle, btn.dataset.current));
    });
  }

  function rowHTML(l) {
    const thumb = l.image_url
      ? `<img src="${esc(l.image_url)}" alt="" class="w-16 h-16 object-cover rounded-lg border border-dark-border flex-shrink-0">`
      : `<div class="w-16 h-16 rounded-lg bg-primary/10 border border-dark-border flex items-center justify-center text-primary/60 text-xs flex-shrink-0">—</div>`;
    const statusLabel = l.status === 'sold'
      ? `<span class="px-2 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-400 rounded-full">VENDUTO</span>`
      : `<span class="px-2 py-0.5 text-[10px] font-medium bg-green-500/20 text-green-400 rounded-full">DISPONIBILE</span>`;
    const catLabel = { macchine:'Macchinario', prodotti:'Prodotto', materiali:'Materiale' }[l.category] || l.category || '—';
    return `
      <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/40 border border-dark-border hover:border-primary/30 transition flex-wrap sm:flex-nowrap">
        ${thumb}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-heading font-semibold text-dark-text truncate">${esc(l.title)}</h3>
            ${statusLabel}
          </div>
          <p class="text-xs text-dark-muted mt-0.5">${esc(catLabel)} · ${esc(l.price) || '—'}</p>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <button data-toggle="${esc(l.id)}" data-current="${esc(l.status)}"
            class="px-2.5 py-1.5 text-xs rounded-lg border border-dark-border hover:border-primary hover:text-primary transition">
            ${l.status === 'sold' ? 'Ripristina' : 'Segna venduto'}
          </button>
          <button data-edit="${esc(l.id)}"
            class="px-2.5 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">
            Modifica
          </button>
          <button data-delete="${esc(l.id)}" data-title="${esc(l.title)}"
            class="px-2.5 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
            Elimina
          </button>
        </div>
      </div>
    `;
  }

  async function saveListing(e) {
    e.preventDefault();
    clearFormError();
    const saveBtn = $('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvataggio…';

    try {
      // Upload image if file picked
      const file = $('imageFile').files[0];
      let imageUrl = $('image_url').value.trim();
      if (file) {
        $('uploadStatus').textContent = 'Caricamento immagine…';
        imageUrl = await uploadImage(file);
        $('uploadStatus').textContent = 'Caricata.';
      }

      const payload = {
        title:       $('title').value.trim(),
        price:       $('price').value.trim() || null,
        description: $('description').value.trim() || null,
        category:    $('category').value,
        status:      $('status').value,
        image_url:   imageUrl || null
      };

      let error;
      if (editingId) {
        ({ error } = await window.sb.from('listings').update(payload).eq('id', editingId));
      } else {
        ({ error } = await window.sb.from('listings').insert(payload));
      }
      if (error) throw error;

      resetForm();
      loadListings();
    } catch (err) {
      showFormError(err.message || String(err));
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salva annuncio';
    }
  }

  async function deleteListing(id, title) {
    if (!confirm(`Eliminare "${title}"?`)) return;
    const { error } = await window.sb.from('listings').delete().eq('id', id);
    if (error) { alert('Errore: ' + error.message); return; }
    if (editingId === id) resetForm();
    loadListings();
  }

  async function toggleStatus(id, current) {
    const next = current === 'sold' ? 'available' : 'sold';
    const { error } = await window.sb.from('listings').update({ status: next }).eq('id', id);
    if (error) { alert('Errore: ' + error.message); return; }
    loadListings();
  }

  // ---------- Wire UI ----------
  function wireEvents() {
    $('listingForm').addEventListener('submit', saveListing);
    $('resetBtn').addEventListener('click', resetForm);
    $('cancelEditBtn').addEventListener('click', resetForm);
    $('refreshBtn').addEventListener('click', loadListings);

    $('logoutBtn').addEventListener('click', async () => {
      await window.sb.auth.signOut();
      window.location.href = '/admin/login.html';
    });

    // Image preview on URL change
    $('image_url').addEventListener('input', () => {
      const url = $('image_url').value.trim();
      if (url) {
        $('imagePreviewImg').src = url;
        $('imagePreview').classList.remove('hidden');
      } else {
        $('imagePreview').classList.add('hidden');
      }
    });

    // Image preview on file pick
    $('imageFile').addEventListener('change', () => {
      const file = $('imageFile').files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        $('imagePreviewImg').src = e.target.result;
        $('imagePreview').classList.remove('hidden');
        $('uploadStatus').textContent = `${file.name} · pronto per upload`;
      };
      reader.readAsDataURL(file);
    });
  }

  boot();
})();
