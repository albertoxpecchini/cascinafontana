# 🚀 Setup Completo Gallerie Supabase

## ✅ Cosa è stato creato

Tutto il sistema è pronto! Ho creato:

### 📊 Admin Panels (gestione contenuti)
- **`/admin/index.html`** — Dashboard principale
- **`/admin/login.html`** — Login (PIN: `1234`)
- **`/admin/galleria.html`** — Gestisci immagini galleria
- **`/admin/novita.html`** — Pubblica post/notizie
- **`/admin/prodotti.html`** — Aggiungi prodotti con foto

### 📚 File JavaScript componenti
- **`/js/supabase.js`** — Client Supabase + helper fetch
- **`/js/gallery.js`** — Componenti galleria (carousel, grid)
- **`/js/novita.js`** — Componenti news
- **`/js/prodotti.js`** — Componenti prodotti
- **`/js/admin-auth.js`** — Sistema autenticazione admin
- **`/js/admin-env.js`** — Configurazione ambiente

### 📖 Documentazione
- **`GALLERIE_SUPABASE.md`** — Guida veloce
- **`SUPABASE_SETUP.md`** — Setup database e storage
- **`SETUP_COMPLETO.md`** — Questo file

### ⚙️ Configurazione
- **`.env`** — Credenziali Supabase (già configurate)

---

## 🎯 Prossimi Step

### 1️⃣ Setup Database Supabase (SE NON FATTO)

Accedi a https://supabase.com/dashboard e:

1. **Crea un nuovo project** (se non esiste)
2. Vai a **SQL Editor**
3. Copia il codice da `SUPABASE_SETUP.md` → sezione "Step 1"
4. Esegui le query

### 2️⃣ Setup Storage Buckets

1. Vai a **Storage** nella dashboard Supabase
2. Crea 3 bucket (come descritto in `SUPABASE_SETUP.md`):
   - `galleria` (pubblico)
   - `prodotti` (pubblico)
3. Abilita "Public bucket" per ciascuno

### 3️⃣ Accedi ai Pannelli Admin

**URL**: `/admin/login.html`
**PIN Default**: `1234` ⚠️ **CAMBIA PRIMA DI ANDARE IN PRODUZIONE!**

Dopo il login → Dashboard (`/admin/index.html`)

### 4️⃣ Carica i Tuoi Contenuti

- **Galleria**: Upload immagini con didascalie
- **Novità**: Pubblica post/aggiornamenti
- **Prodotti**: Aggiungi prodotti con foto

### 5️⃣ Integra nei Tuoi Siti

Vedi `GALLERIE_SUPABASE.md` per gli esempi di codice.

---

## 🔐 Sicurezza

### ⚠️ PIN AMMINISTRATORE

Prima di andare in PRODUZIONE, cambia il PIN!

Modifica `/js/admin-auth.js`:
```javascript
PIN: '1234',  // ← Cambia questo!
```

### 🛡️ Supabase RLS

Le tabelle hanno Row Level Security abilitato:
- ✅ Chiunque può **leggere** (PUBLIC)
- ✅ Solo admin possono **modificare** (protetto dal PIN)

---

## 📱 Utilizzo

### Carousel Galleria (home page)
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
<div id="gallery"></div>
<div id="lightbox"><img id="lightbox-img"><button id="lightbox-close">✕</button></div>

<script type="module">
  import { loadGalleryGrid } from '/js/gallery.js';
  loadGalleryGrid('gallery');
</script>
```

### Novità (news feed)
```html
<div id="news"></div>

<script type="module">
  import { loadNovita } from '/js/novita.js';
  loadNovita('news', 5); // ultimi 5 post
</script>
```

### Prodotti (shop)
```html
<div id="shop" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;"></div>

<script type="module">
  import { loadProdotti } from '/js/prodotti.js';
  loadProdotti('shop', { featuredFirst: true });
</script>
```

---

## 🐛 Troubleshooting

### "Errore caricamento immagini"
→ Controlla che i bucket di storage siano creati e **pubblici**

### "Credenziali mancanti"
→ Verifica che `.env` abbia le credenziali Supabase

### Immagini non si caricano
→ Controlla il bucket in Supabase Storage (deve essere pubblico)

### Login non funziona
→ Apri console (F12) e controlla che `admin-auth.js` sia caricato

---

## 📞 Supporto

Tutti i file hanno commenti inline per facilitare modifiche future.

Se hai domande, controlla:
1. Console del browser (F12) per errori
2. Supabase Dashboard → Logs
3. I commenti nei file `.js`

---

## ✨ Fatto!

Tutto è pronto per:
- ✅ Caricare immagini
- ✅ Pubblicare novità
- ✅ Gestire prodotti
- ✅ Visualizzare contenuti con componenti React-ready

**Buon lavoro! 🎉**
