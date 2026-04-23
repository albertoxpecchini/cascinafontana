# 🖼️ Sistema Gallerie Supabase

Hai a disposizione **3 modi di costruire gallerie** direttamente da Supabase:

## 1️⃣ Galleria (Portfolio immagini)

**Cosa è**: Carousel e grid di immagini — perfetto per mostrare foto della cascina, campi, prodotti in azione

**Admin Panel**: 👉 `/admin/galleria.html`
- Carica immagini
- Ordina le foto
- Aggiungi didascalie

**Componenti disponibili**:
- **Carousel** (slide automatico): `initCarousel()` in `gallery.js`
- **Grid gallery** (lightbox): `loadGalleryGrid()` in `gallery.js`

---

## 2️⃣ Novità (Blog/News)

**Cosa è**: Post con titolo, descrizione e data — per comunicare aggiornamenti, aperture, eventi

**Admin Panel**: 👉 `/admin/novita.html`
- Pubblica post
- Gestisci notizie
- Elimina vecchi aggiornamenti

**Componente**: `loadNovita()` in `novita.js`

---

## 3️⃣ Prodotti (Catalogo vendita)

**Cosa è**: Prodotti aziendali con foto — marmellate, vini, formaggi, ecc.

**Admin Panel**: 👉 `/admin/prodotti.html`
- Aggiungi prodotti con foto
- Metti in evidenza (⭐)
- Organizza per categoria

**Componente**: `loadProdotti()` in `prodotti.js`

---

## 🚀 Quick Start

1. **Esegui setup SQL** (vedi `SUPABASE_SETUP.md`)
2. **Accedi ai panel admin**:
   - Galleria: `/admin/galleria.html`
   - Novità: `/admin/novita.html`
   - Prodotti: `/admin/prodotti.html`
3. **Carica contenuti**
4. **Integra nei tuoi siti** (vedi i file `.js` della cartella `/js`)

---

## 📁 File principali

```
/js/
  ├── supabase.js      → Connessione Supabase + helper di fetch
  ├── gallery.js       → Componenti galleria (carousel, grid)
  ├── novita.js        → Componenti news
  └── prodotti.js      → Componenti prodotti

/admin/
  ├── index.html       → Dashboard principale
  ├── galleria.html    → Admin galleria
  ├── novita.html      → Admin novità
  └── prodotti.html    → Admin prodotti
```

---

## 💡 Esempi d'uso

### Carousel Galleria in Home
```html
<div id="carousel-track"></div>
<button id="prev-btn">←</button>
<button id="next-btn">→</button>
<div id="carousel-dots"></div>

<script type="module">
  import { initCarousel } from '/js/gallery.js';
  initCarousel('carousel', 'carousel-track', 'prev-btn', 'next-btn', 'carousel-dots');
</script>
```

### Grid Galleria con Lightbox
```html
<div id="gallery-container"></div>
<div id="lightbox" class="lightbox">
  <img id="lightbox-img">
  <button id="lightbox-close">✕</button>
</div>

<script type="module">
  import { loadGalleryGrid } from '/js/gallery.js';
  loadGalleryGrid('gallery-container');
</script>
```

### Novità (ultimi 3 post)
```html
<div id="news"></div>

<script type="module">
  import { loadNovita } from '/js/novita.js';
  loadNovita('news', 3);
</script>
```

### Prodotti (con in evidenza)
```html
<div id="shop" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;"></div>

<script type="module">
  import { loadProdotti } from '/js/prodotti.js';
  loadProdotti('shop', { featuredFirst: true });
</script>
```

---

✅ **Tutto è già configurato e pronto!**
