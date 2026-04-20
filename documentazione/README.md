# CASCINA FONTANA

> Sito ufficiale — Società Agricola Cascina Fontana S.S., Rodigo (MN)

- Home: https://cascinafontana.xyz

Versioning: `MAJOR.MINOR.PATCH` (es. `1.0.1`). Attuale: vedi [`VERSION`](./VERSION).

**Regola di lavoro:** ogni modifica → si aggiorna `README.md` dove serve **e** si scrive una voce in `CHANGELOG.md` in italiano semplice. Il messaggio del commit è solo il numero di versione.

### Script di release

Un solo comando per versionare, committare, taggare e pushare:

```sh
# stage delle modifiche reali
git add <files>

# release: scrive VERSION, commit con messaggio = versione, tag, push
sh script/release.sh
```

Lo script legge la versione attuale da `VERSION` e incrementa automaticamente la patch: `1.0.1`, `1.0.2`, `1.0.3`, ecc.

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
├── index.html               # homepage Coinbase-inspired, singlepage
├── vercel.json              # rewrites
├── amministrazione/
│   ├── index.html           # admin dashboard
│   ├── login.html           # admin login
│   └── admin.js             # admin logic
├── moduli/                  # loader e helper scripts
├── risorse/immagini/        # favicon + immagini galleria
├── risorse/loghi/           # loghi brand
├── database/                # migration e config
├── script/                  # automazione e rilascio
├── documentazione/          # README, DESIGN, CHANGELOG, GSAP
└── riferimenti-design/      # riferimenti design brand
```

## Home root (`/`)

Homepage Coinbase-inspired con sezioni: attività, galleria, shop, aggiornamenti, Campino's e contatti.

## Galleria foto

- File sorgente immagini: `risorse/immagini/`.
- File dati galleria: `moduli/gallery-data.js`.
- Renderer: `moduli/gallery-loader.js`.
- Workflow: si copiano le nuove foto in `risorse/immagini/`, poi si aggiorna `moduli/gallery-data.js` per decidere quali immagini pubblicare e in che ordine.
- Nota: `risorse/immagini/` puo` contenere anche file tecnici (per esempio favicon). La presenza nella cartella non implica pubblicazione automatica in galleria.

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
    { "source": "/admin",         "destination": "/amministrazione/index.html" },
    { "source": "/admin/login",   "destination": "/amministrazione/login.html" },
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

Convenzione commit: messaggio = versione sola (`MAJOR.MINOR.PATCH`, es. `1.0.1`). Tutti i dettagli nel changelog.
