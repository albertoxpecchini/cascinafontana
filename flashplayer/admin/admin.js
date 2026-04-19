// Cascina Fontana — Admin dashboard /flashplayer variant (listings + updates)
(function () {
  const $ = (id) => document.getElementById(id);
  const LOGIN_URL = '/flashplayer/admin/login.html';

  const bootLoader = $('bootLoader');
  const adminRoot  = $('adminRoot');

  function bootFail(msg) {
    bootLoader.innerHTML =
      `<p class="text-red-400">${msg}</p>` +
      `<p class="mt-3"><a href="${LOGIN_URL}" class="text-primary underline">Login</a></p>`;
  }

  async function boot() {
    if (!window.sb) { bootFail('Backend non configurato (js/supabase-client.js).'); return; }
    const { data, error } = await window.sb.auth.getSession();
    if (error || !data.session) {
      window.location.href = LOGIN_URL;
      return;
    }
    $('userEmail').textContent = data.session.user.email || '';
    bootLoader.classList.add('hidden');
    adminRoot.classList.remove('hidden');

    wireGlobal();
    Listings.init();
    Updates.init();

    window.sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.href = LOGIN_URL;
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  let toastTimer = null;
  function toast(msg, type) {
    const el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('success', 'error');
    if (type) el.classList.add(type);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  async function compressImage(file, maxSize = 1200, quality = 0.7) {
    if (!file.type.startsWith('image/')) return file;
    const dataUrl = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = dataUrl;
    });
    let { width, height } = img;
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width  = Math.round(width  * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return file;
    const name = (file.name || 'image').replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  }

  async function uploadFiles(bucket, files, onProgress) {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const raw = files[i];
      if (onProgress) onProgress(`Compressione ${i + 1}/${files.length}…`);
      const compressed = await compressImage(raw);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      if (onProgress) onProgress(`Upload ${i + 1}/${files.length}…`);
      const { error } = await window.sb.storage.from(bucket).upload(path, compressed, {
        cacheControl: '3600', upsert: false, contentType: 'image/jpeg'
      });
      if (error) throw error;
      const { data } = window.sb.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  function renderThumbs(container, urls, onRemove) {
    container.innerHTML = urls.map((u, i) => `
      <div class="relative group">
        <img src="${esc(u)}" alt="" class="thumb">
        <button type="button" data-rm="${i}"
          class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition">×</button>
      </div>
    `).join('');
    container.querySelectorAll('[data-rm]').forEach(btn => {
      btn.addEventListener('click', () => onRemove(Number(btn.dataset.rm)));
    });
  }

  function wireGlobal() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        $('tab-listings').classList.toggle('hidden', tab !== 'listings');
        $('tab-updates').classList.toggle('hidden',  tab !== 'updates');
      });
    });

    $('logoutBtn').addEventListener('click', async () => {
      await window.sb.auth.signOut();
      window.location.href = LOGIN_URL;
    });
  }

  const Listings = (() => {
    let editingId = null;
    let currentUrls = [];

    function showErr(msg) { const el = $('l_formError'); el.textContent = msg; el.classList.remove('hidden'); }
    function clearErr()   { $('l_formError').classList.add('hidden'); }

    function reset() {
      $('listingForm').reset();
      $('l_id').value = '';
      editingId = null;
      currentUrls = [];
      $('l_imagesPreview').innerHTML = '';
      $('l_uploadStatus').textContent = '';
      $('listingFormTitle').innerHTML = 'Nuovo <span class="gradient-text">annuncio</span>';
      $('listingCancelEdit').classList.add('hidden');
      clearErr();
    }

    function fill(l) {
      $('l_id').value          = l.id;
      $('l_title').value       = l.title || '';
      $('l_category').value    = l.category || 'macchine';
      $('l_brand').value       = l.brand || '';
      $('l_model').value       = l.model || '';
      $('l_displacement').value= l.displacement || '';
      $('l_hp').value          = l.hp || '';
      $('l_fuel').value        = l.fuel || '';
      $('l_usage_hours').value = l.usage_hours || '';
      $('l_condition').value   = l.condition || '';
      $('l_color').value       = l.color || '';
      $('l_registered').checked = !!l.registered;
      $('l_documents').checked  = !!l.documents;
      $('l_insured').checked    = !!l.insured;
      currentUrls = Array.isArray(l.image_urls) && l.image_urls.length
        ? [...l.image_urls]
        : (l.image_url ? [l.image_url] : []);
      renderThumbs($('l_imagesPreview'), currentUrls, removeUrl);
      editingId = l.id;
      $('listingFormTitle').innerHTML = 'Modifica <span class="gradient-text">annuncio</span>';
      $('listingCancelEdit').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function removeUrl(i) {
      currentUrls.splice(i, 1);
      renderThumbs($('l_imagesPreview'), currentUrls, removeUrl);
    }

    async function load() {
      const c = $('listingsContainer');
      c.innerHTML = `<div class="text-center text-dark-muted py-6 text-sm">Caricamento…</div>`;
      const { data, error } = await window.sb.from('listings').select('*').order('created_at', { ascending: false });
      if (error) { c.innerHTML = `<div class="text-red-400 py-4 text-sm">Errore: ${esc(error.message)}</div>`; return; }
      $('l_count').textContent = data.length ? `· ${data.length}` : '';
      if (!data.length) {
        c.innerHTML = `<div class="text-dark-muted py-6 text-sm text-center">Nessun annuncio.</div>`;
        return;
      }
      c.innerHTML = data.map(row).join('');
      c.querySelectorAll('[data-edit]').forEach(b => {
        b.addEventListener('click', () => { const l = data.find(x => x.id === b.dataset.edit); if (l) fill(l); });
      });
      c.querySelectorAll('[data-delete]').forEach(b => {
        b.addEventListener('click', () => del(b.dataset.delete, b.dataset.title));
      });
    }

    function row(l) {
      const firstImg = (l.image_urls && l.image_urls[0]) || l.image_url;
      const thumb = firstImg
        ? `<img src="${esc(firstImg)}" alt="" class="w-16 h-16 object-cover rounded-lg border border-dark-border flex-shrink-0">`
        : `<div class="w-16 h-16 rounded-lg bg-primary/10 border border-dark-border flex items-center justify-center text-primary/60 text-xs flex-shrink-0">—</div>`;
      const catLabel = { macchine:'Macchinario', prodotti:'Prodotto', materiali:'Materiale' }[l.category] || l.category || '—';
      const imgCount = (l.image_urls && l.image_urls.length) || (l.image_url ? 1 : 0);
      const meta = [l.brand, l.model].filter(Boolean).join(' ') || '';
      return `
        <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/40 border border-dark-border hover:border-primary/30 transition flex-wrap sm:flex-nowrap">
          ${thumb}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-heading font-semibold text-dark-text truncate">${esc(l.title)}</h3>
              <span class="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">${esc(catLabel)}</span>
              ${imgCount ? `<span class="text-[10px] text-dark-muted">${imgCount} foto</span>` : ''}
            </div>
            <p class="text-xs text-dark-muted mt-0.5">${esc(meta)}</p>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <button data-edit="${esc(l.id)}" class="px-2.5 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">Modifica</button>
            <button data-delete="${esc(l.id)}" data-title="${esc(l.title)}" class="px-2.5 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">Elimina</button>
          </div>
        </div>
      `;
    }

    async function save(e) {
      e.preventDefault();
      clearErr();
      const btn = $('l_saveBtn');
      btn.disabled = true;
      btn.textContent = 'Salvataggio…';
      try {
        const files = $('l_images').files;
        let uploaded = [];
        if (files && files.length) {
          uploaded = await uploadFiles('listings', files, msg => { $('l_uploadStatus').textContent = msg; });
        }
        const allUrls = [...currentUrls, ...uploaded];
        $('l_uploadStatus').textContent = uploaded.length ? `${uploaded.length} caricate.` : '';

        const payload = {
          title:        $('l_title').value.trim(),
          category:     $('l_category').value,
          brand:        $('l_brand').value.trim() || null,
          model:        $('l_model').value.trim() || null,
          displacement: $('l_displacement').value.trim() || null,
          hp:           $('l_hp').value.trim() || null,
          fuel:         $('l_fuel').value || null,
          usage_hours:  $('l_usage_hours').value.trim() || null,
          condition:    $('l_condition').value || null,
          color:        $('l_color').value.trim() || null,
          registered:   $('l_registered').checked,
          documents:    $('l_documents').checked,
          insured:      $('l_insured').checked,
          image_urls:   allUrls
        };

        let error;
        if (editingId) ({ error } = await window.sb.from('listings').update(payload).eq('id', editingId));
        else           ({ error } = await window.sb.from('listings').insert(payload));
        if (error) throw error;

        toast(editingId ? 'Annuncio aggiornato.' : 'Annuncio creato.', 'success');
        reset();
        load();
      } catch (err) {
        showErr(err.message || String(err));
        toast('Errore nel salvataggio.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Salva annuncio';
      }
    }

    async function del(id, title) {
      if (!confirm(`Eliminare "${title}"?`)) return;
      const { error } = await window.sb.from('listings').delete().eq('id', id);
      if (error) { toast('Errore: ' + error.message, 'error'); return; }
      if (editingId === id) reset();
      toast('Annuncio eliminato.', 'success');
      load();
    }

    function onPick() {
      const files = Array.from($('l_images').files || []);
      if (!files.length) return;
      $('l_uploadStatus').textContent = `${files.length} file pronti — upload al salvataggio.`;
      const readers = files.map(f => new Promise(res => {
        const r = new FileReader();
        r.onload = e => res(e.target.result);
        r.readAsDataURL(f);
      }));
      Promise.all(readers).then(previews => {
        const combined = [...currentUrls, ...previews];
        const container = $('l_imagesPreview');
        container.innerHTML = combined.map((u, i) => `
          <div class="relative group">
            <img src="${esc(u)}" alt="" class="thumb ${i >= currentUrls.length ? 'ring-2 ring-primary/40' : ''}">
            ${i < currentUrls.length
              ? `<button type="button" data-rm="${i}" class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition">×</button>`
              : `<span class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold">NEW</span>`
            }
          </div>
        `).join('');
        container.querySelectorAll('[data-rm]').forEach(btn => {
          btn.addEventListener('click', () => removeUrl(Number(btn.dataset.rm)));
        });
      });
    }

    function init() {
      $('listingForm').addEventListener('submit', save);
      $('l_resetBtn').addEventListener('click', () => setTimeout(reset, 0));
      $('listingCancelEdit').addEventListener('click', reset);
      $('l_refreshBtn').addEventListener('click', load);
      $('l_images').addEventListener('change', onPick);
      load();
    }

    return { init };
  })();

  const Updates = (() => {
    let editingId = null;
    let currentUrls = [];

    function showErr(msg) { const el = $('u_formError'); el.textContent = msg; el.classList.remove('hidden'); }
    function clearErr()   { $('u_formError').classList.add('hidden'); }

    function reset() {
      $('updateForm').reset();
      $('u_id').value = '';
      editingId = null;
      currentUrls = [];
      $('u_imagesPreview').innerHTML = '';
      $('u_uploadStatus').textContent = '';
      $('updateFormTitle').innerHTML = 'Nuovo <span class="gradient-text">aggiornamento</span>';
      $('updateCancelEdit').classList.add('hidden');
      clearErr();
    }

    function fill(u) {
      $('u_id').value         = u.id;
      $('u_title').value      = u.title || '';
      $('u_description').value= u.description || '';
      $('u_city').value       = u.city || '';
      $('u_country').value    = u.country || '';
      currentUrls = Array.isArray(u.image_urls) ? [...u.image_urls] : [];
      renderThumbs($('u_imagesPreview'), currentUrls, removeUrl);
      editingId = u.id;
      $('updateFormTitle').innerHTML = 'Modifica <span class="gradient-text">aggiornamento</span>';
      $('updateCancelEdit').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function removeUrl(i) {
      currentUrls.splice(i, 1);
      renderThumbs($('u_imagesPreview'), currentUrls, removeUrl);
    }

    async function load() {
      const c = $('updatesContainer');
      c.innerHTML = `<div class="text-center text-dark-muted py-6 text-sm">Caricamento…</div>`;
      const { data, error } = await window.sb.from('updates').select('*').order('created_at', { ascending: false });
      if (error) { c.innerHTML = `<div class="text-red-400 py-4 text-sm">Errore: ${esc(error.message)}</div>`; return; }
      $('u_count').textContent = data.length ? `· ${data.length}` : '';
      if (!data.length) {
        c.innerHTML = `<div class="text-dark-muted py-6 text-sm text-center">Nessun aggiornamento.</div>`;
        return;
      }
      c.innerHTML = data.map(row).join('');
      c.querySelectorAll('[data-edit]').forEach(b => {
        b.addEventListener('click', () => { const u = data.find(x => x.id === b.dataset.edit); if (u) fill(u); });
      });
      c.querySelectorAll('[data-delete]').forEach(b => {
        b.addEventListener('click', () => del(b.dataset.delete, b.dataset.title));
      });
    }

    function row(u) {
      const first = (u.image_urls && u.image_urls[0]);
      const thumb = first
        ? `<img src="${esc(first)}" alt="" class="w-16 h-16 object-cover rounded-lg border border-dark-border flex-shrink-0">`
        : `<div class="w-16 h-16 rounded-lg bg-primary/10 border border-dark-border flex items-center justify-center text-primary/60 text-xs flex-shrink-0">—</div>`;
      const place = [u.city, u.country].filter(Boolean).join(', ');
      const imgCount = (u.image_urls && u.image_urls.length) || 0;
      const when = u.created_at ? new Date(u.created_at).toLocaleDateString('it-IT') : '';
      return `
        <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/40 border border-dark-border hover:border-primary/30 transition flex-wrap sm:flex-nowrap">
          ${thumb}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-heading font-semibold text-dark-text truncate">${esc(u.title)}</h3>
              ${imgCount ? `<span class="text-[10px] text-dark-muted">${imgCount} immagini</span>` : ''}
            </div>
            <p class="text-xs text-dark-muted mt-0.5">${esc(place) || '—'} · ${esc(when)}</p>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <button data-edit="${esc(u.id)}" class="px-2.5 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">Modifica</button>
            <button data-delete="${esc(u.id)}" data-title="${esc(u.title)}" class="px-2.5 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">Elimina</button>
          </div>
        </div>
      `;
    }

    async function save(e) {
      e.preventDefault();
      clearErr();
      const btn = $('u_saveBtn');
      btn.disabled = true;
      btn.textContent = 'Salvataggio…';
      try {
        const files = $('u_images').files;
        let uploaded = [];
        if (files && files.length) {
          uploaded = await uploadFiles('updates', files, msg => { $('u_uploadStatus').textContent = msg; });
        }
        const allUrls = [...currentUrls, ...uploaded];
        $('u_uploadStatus').textContent = uploaded.length ? `${uploaded.length} caricate.` : '';

        const payload = {
          title:       $('u_title').value.trim(),
          description: $('u_description').value.trim() || null,
          city:        $('u_city').value.trim() || null,
          country:     $('u_country').value.trim() || null,
          image_urls:  allUrls
        };

        let error;
        if (editingId) ({ error } = await window.sb.from('updates').update(payload).eq('id', editingId));
        else           ({ error } = await window.sb.from('updates').insert(payload));
        if (error) throw error;

        toast(editingId ? 'Aggiornamento modificato.' : 'Aggiornamento pubblicato.', 'success');
        reset();
        load();
      } catch (err) {
        showErr(err.message || String(err));
        toast('Errore nel salvataggio.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Salva aggiornamento';
      }
    }

    async function del(id, title) {
      if (!confirm(`Eliminare "${title}"?`)) return;
      const { error } = await window.sb.from('updates').delete().eq('id', id);
      if (error) { toast('Errore: ' + error.message, 'error'); return; }
      if (editingId === id) reset();
      toast('Aggiornamento eliminato.', 'success');
      load();
    }

    function onPick() {
      const files = Array.from($('u_images').files || []);
      if (!files.length) return;
      $('u_uploadStatus').textContent = `${files.length} file pronti — upload al salvataggio.`;
      const readers = files.map(f => new Promise(res => {
        const r = new FileReader();
        r.onload = e => res(e.target.result);
        r.readAsDataURL(f);
      }));
      Promise.all(readers).then(previews => {
        const combined = [...currentUrls, ...previews];
        const container = $('u_imagesPreview');
        container.innerHTML = combined.map((u, i) => `
          <div class="relative group">
            <img src="${esc(u)}" alt="" class="thumb ${i >= currentUrls.length ? 'ring-2 ring-primary/40' : ''}">
            ${i < currentUrls.length
              ? `<button type="button" data-rm="${i}" class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition">×</button>`
              : `<span class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold">NEW</span>`
            }
          </div>
        `).join('');
        container.querySelectorAll('[data-rm]').forEach(btn => {
          btn.addEventListener('click', () => removeUrl(Number(btn.dataset.rm)));
        });
      });
    }

    function init() {
      $('updateForm').addEventListener('submit', save);
      $('u_resetBtn').addEventListener('click', () => setTimeout(reset, 0));
      $('updateCancelEdit').addEventListener('click', reset);
      $('u_refreshBtn').addEventListener('click', load);
      $('u_images').addEventListener('change', onPick);
      load();
    }

    return { init };
  })();

  boot();
})();