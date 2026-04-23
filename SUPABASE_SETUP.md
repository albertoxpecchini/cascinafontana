# 🚀 Guida Setup Supabase — Cascina Fontana

## Step 1: Creare le tabelle

Accedi a Supabase Dashboard → SQL Editor e copia/incolla questo codice:

```sql
-- Tabella Galleria
CREATE TABLE galleria (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  url TEXT NOT NULL,
  caption TEXT,
  ordine INT DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Updates (Novità)
CREATE TABLE updates (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Prodotti (aziendali)
CREATE TABLE prodotti (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titolo TEXT NOT NULL,
  categoria TEXT,
  descrizione TEXT,
  image_url TEXT,
  in_evidenza BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Listings (Shop/E-commerce)
CREATE TABLE listings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita Row Level Security
ALTER TABLE galleria ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE prodotti ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica (tutti possono leggere)
CREATE POLICY "Public read access" ON galleria FOR SELECT USING (true);
CREATE POLICY "Public read access" ON updates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON prodotti FOR SELECT USING (true);
CREATE POLICY "Public read access" ON listings FOR SELECT USING (true);
```

Clicca "Run" per eseguire.

## Step 2: Creare i Storage Buckets

Nella dashboard Supabase, vai a **Storage** e crea 3 bucket:

1. **galleria** (pubblico)
2. **novita** (pubblico, opzionale)
3. **prodotti** (pubblico)

Per ogni bucket:
- Clicca il menu ⋯ → Edit bucket
- Abilita **Public bucket**
- Salva

## Step 3: Aggiungere le Policy di Storage

Nel SQL Editor, aggiungi:

```sql
-- Policies per storage galleria
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (
  bucket_id = 'galleria'
);

CREATE POLICY "Public upload access" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'galleria' AND auth.role() = 'authenticated'
);

-- Policies per storage prodotti
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (
  bucket_id = 'prodotti'
);

CREATE POLICY "Public upload access" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'prodotti' AND auth.role() = 'authenticated'
);
```

## Step 4: Configurazione Ambiente

Il file `.env` è già configurato con:
```
SUPABASE_URL=https://fjdfxynwshejyjvxhqry.supabase.co
SUPABASE_ANON_KEY=sbp_16c85a2d94ab24db666f6858bd0495d336aac935
```

## Step 5: Utilizzo Pannelli Admin

### Admin Galleria
👉 **URL**: `/admin/galleria.html`
- Carica immagini
- Gestisci ordine
- Aggiungi didascalie

### Admin Novità
👉 **URL**: `/admin/novita.html`
- Pubblica post
- Gestisci aggiornamenti

### Admin Prodotti
👉 **URL**: `/admin/prodotti.html`
- Aggiungi prodotti con foto
- Metti in evidenza
- Gestisci categorie

### Dashboard Admin
👉 **URL**: `/admin/index.html`
- Pannello principale con accesso a tutti gli strumenti

## Step 6: Integrare nei tuoi siti

### Galleria (index.html home)
```html
<div id="gallery-carousel"></div>
<script type="module">
  import { initCarousel } from '/js/gallery.js';
  initCarousel('carousel', 'carousel-track', 'prev-btn', 'next-btn', 'dots');
</script>
```

### Novità (pagina news)
```html
<div id="news-container"></div>
<script type="module">
  import { loadNovita } from '/js/novita.js';
  loadNovita('news-container', 5); // ultimi 5 post
</script>
```

### Prodotti (pagina shop)
```html
<div id="products-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;"></div>
<script type="module">
  import { loadProdotti } from '/js/prodotti.js';
  loadProdotti('products-container', { featuredFirst: true }); // mostra prodotti in evidenza prima
</script>
```

## 📝 Note

- **Immagini**: Caricate tramite admin si salvano automaticamente in Supabase Storage
- **Performance**: Usa `limit` per paginare i dati
- **Cache**: Gli URL delle immagini sono CDN-cached da Supabase
- **Sicurezza**: Le chiavi sono pubbliche ma il RLS limita le modifiche a soli admin autenticati

---

Per domande o problemi, controlla la console del browser (F12) per errori.
