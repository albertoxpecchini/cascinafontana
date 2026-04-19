# CASCINA FONTANA

> Sito ufficiale — Società Agricola Cascina Fontana S.S., Rodigo (MN)

- Home: https://cascinafontana.xyz

Versioning: `AAAA.MM.GG.NN` (data + numero del giorno, zero-padded). Attuale: vedi [`VERSION`](./VERSION).

**Regola di lavoro:** ogni modifica → si aggiorna `README.md` dove serve **e** si scrive una voce in `CHANGELOG.md` in italiano semplice. Il messaggio del commit è solo il numero di versione.

### Script di release

Un solo comando per versionare, committare, taggare e pushare:

```sh
# stage delle modifiche reali
git add <files>

# release: scrive VERSION, commit con messaggio = versione, tag, push
sh scripts/release.sh
```

Lo script calcola automaticamente la prossima sequenza del giorno (`NN` zero-padded) leggendo tag e log.

### Hook di validazione commit

Un hook `commit-msg` blocca i messaggi che non rispettano il formato versione.

File tracciato: `.githooks/commit-msg`. Per attivarlo dopo un clone:

```sh
git config core.hooksPath .githooks
chmod +x .githooks/commit-msg
```

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
  - FormSubmit AJAX (invio form)

## Font

Stack unico di sistema per l'intero sito — nessun font esterno caricato:

```
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
```

## Palette

`#F9F7F7` · `#DBE2EF` · `#3F72AF` · `#112D4E`

---

## Struttura file

```
cascinafontana/
├── index.html            # homepage Coinbase-inspired, singlepage
├── vercel.json           # rewrites
├── admin/
│   ├── index.html        # admin dashboard
│   ├── login.html        # admin login
│   └── admin.js          # admin logic
├── js/                   # loader e helper scripts
├── public/images/        # favicon + immagini galleria
└── supabase/             # migration e config
```

## Home root (`/`)

Homepage Coinbase-inspired con sezioni: attività, galleria, shop, aggiornamenti, Campino's e contatti.

## Galleria foto

- File sorgente immagini: `public/images/`.
- File dati galleria: `js/gallery-data.js`.
- Renderer: `js/gallery-loader.js`.
- Workflow: si copiano le nuove foto in `public/images/`, poi si aggiorna `js/gallery-data.js` per decidere quali immagini pubblicare e in che ordine.
- Nota: `public/images/` puo` contenere anche file tecnici (per esempio favicon). La presenza nella cartella non implica pubblicazione automatica in galleria.

---

## Mappa

- Coordinate: `45.178311, 10.660775` (Via Belvedere 1, 46040 Rodigo MN)

---

## Form — CFMailer

Modulo client-side in `index.html`. Applicato a:

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
    { "source": "/home",          "destination": "/index.html" },
    { "source": "/admin",         "destination": "/admin/index.html" },
    { "source": "/admin/login",   "destination": "/admin/login.html" },
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

## Changelog

Vedi [`CHANGELOG.md`](./CHANGELOG.md).

Convenzione commit: messaggio = versione sola (`AAAA.MM.GG.N`). Tutti i dettagli nel changelog.
