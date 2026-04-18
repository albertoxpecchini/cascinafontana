# CASCINA FONTANA

> Sito ufficiale — Società Agricola Cascina Fontana S.S., Rodigo (MN)

- Home: https://cascinafontana.xyz
- Flash mode: https://cascinafontana.xyz/flashplayer

Versioning: `YYYY.MM.DD.N` (date + daily sequence). Current: `2026.04.18.5`.

---

## Stato

- Sito statico, nessun runtime, nessuna build step
- Hosting: Vercel
- Target: desktop + mobile moderni

## Stack

- HTML5 semantico
- CSS3 (custom properties, grid, animazioni)
- Vanilla JS (navigazione, reveal, mailer client-side, mappa)
- Nessuna dipendenza runtime lato sorgente
- CDN esterne caricate dal browser:
  - Leaflet 1.9.4 (solo `/flashplayer`, mappa)
  - OpenStreetMap tile server (mappa)
  - Adobe Source Serif (solo `/flashplayer`)
  - FormSubmit AJAX (invio form)

## Font

- Root (`/`): Apple system stack — `-apple-system`, `BlinkMacSystemFont`, `SF Pro Text/Display`, `SF Mono`, fallback sans/mono
- `/flashplayer`: Source Serif 4 + Arial/Helvetica system

## Palette

`#F9F7F7` · `#DBE2EF` · `#3F72AF` · `#112D4E`

---

## Struttura file

```
cascinafontana/
├── index.html            # home root
├── style.css             # stili root
├── main.js               # JS root
├── vercel.json           # rewrites
├── public/images/        # asset home
└── flashplayer/
    ├── index.html        # singlepage Flash-style
    ├── style.css
    └── logo.svg
```

## Sezioni root

Hero · Sistema · Attività · Produzione · Filiera · Strutture · Sostenibilità · Gelsi · Fontana · Galleria · Contatti

## Sezioni `/flashplayer`

Topnav · Storia · Certificazioni · Galleria · Shop · Testimonial · Orari & Mappa · FAQ · Newsletter · Preventivo · Downloads · Footer

---

## Mappa

- Coordinate: `45.178311, 10.660775` (Via Belvedere 1, 46040 Rodigo MN)
- Root: iframe OpenStreetMap embed
- `/flashplayer`: Leaflet + OSM tiles, marker con popup indirizzo

---

## Form — CFMailer

Modulo client-side in `flashplayer/index.html`. Applicato a:

- Newsletter (`#nl-form`)
- Preventivo (`#q-form`)

Funzionalità:

- Validazione regex email + campi minimi
- Sanitizzazione (strip control chars, trim, max length)
- Rate-limit locale (30s per form via `localStorage`)
- Honeypot (`_honey`)
- Invio AJAX a `https://formsubmit.co/ajax/pzkko@yahoo.com`
- Retry con backoff `[2s, 6s, 15s]`
- Offline queue persistente (`localStorage.cf_mail_queue`) con drain su `online` e `load`
- Fallback `mailto:` se falliscono tutti i tentativi
- Log rotante (max 50 entry) in `localStorage.cf_mail_log`

### Setup FormSubmit

Attivazione una tantum: la prima richiesta a `formsubmit.co/ajax/<email>` invia una mail di attivazione al destinatario. Cliccare il link di conferma una volta — dopodiché tutte le consegne arrivano normalmente.

---

## Routing (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/",             "destination": "/index.html" },
    { "source": "/flashplayer",  "destination": "/flashplayer/index.html" },
    { "source": "/(.*)",         "destination": "/$1" }
  ]
}
```

## Deploy

Push su `main` → deploy automatico Vercel. Nessun build command.

---

## Contatti reali

- Via Belvedere 1, 46040 Rodigo (MN) · Italia
- Email: `pzkko@yahoo.com`
- PEC: `cascinafontana@pec.it`
- Tel: `+39 0376 681052`
- P.IVA: `02196490201`

---

## Changelog recente

- `2026.04.18.5` — purge stale font names from CSS comments
- `2026.04.18.4` — drop `/jdm` route + folder, sync root map coords
- `2026.04.18.3` — root: Apple system font stack, rimosso nothingfont `@font-face`
- `2026.04.18.2` — CFMailer module (sanitize, rate-limit, queue, retry, mailto, log)
- `2026.04.18.1` — quote form AJAX con honeypot e validazione client
- `2026.04.17.1` — newsletter AJAX formsubmit + inline result
- `1.4.1` — `/flashplayer` Leaflet map
- `1.4` — root: storia, certificazioni, shop, testimonial, mappa, FAQ, newsletter, downloads
- `1.3.5` — `/flashplayer` espansione completa
