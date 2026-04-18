# Changelog

Formato versione: `AAAA.MM.GG.N` (data + sequenza giornaliera).

---

## 2026.04.18.7
- Home: `<title>` e meta description corretti (non più "1.3").
- Hero: aggiunti tre CTA — Contattaci (primario), Vedi shop (ghost), Come lavoriamo (link).
- Statistiche hero con contesto: `63 biolche · ≈42 ha`, `8 trattori · flotta`, `30 pannelli · autonomia`, `18 anni · dal 2007`.
- Abilitate foto reali già presenti: `campo.jpg`, `capannone.jpg`, `fontana.JPG` su sezioni Produzione, Strutture, Fontana e slot galleria 5/10/12.
- Contrasto testo: `--muted` da `0.45` a `0.72`.
- Spaziatura sezioni: `--sec-y` da `clamp(80, 10vw, 144)` a `clamp(56, 7vw, 104)`.
- Hero scroll: etichetta `↓ Scopri`.

## 2026.04.18.6
- README riscritto sullo stato attuale: rimossi riferimenti Web3Forms e `/jdm`, aggiunte le specifiche di CFMailer e font.

## 2026.04.18.5
- `style.css`: rimossi nomi font obsoleti dai commenti (NType82 / Lettera Mono / Ndot57).

## 2026.04.18.4
- Rimossa cartella `/jdm` e relativa redirect in `vercel.json`.
- Aggiornati riferimenti in `README.md`.
- Sincronizzate coordinate mappa root a `45.17831, 10.66077`.

## 2026.04.18.3
- Root: rimosse le `@font-face` di NType82 / LetteraMono / Ndot57.
- Adottato stack Apple system (`SF Pro Text/Display`, `SF Mono`) con fallback standard.

## 2026.04.18.2
- Introdotto modulo `CFMailer` in `/flashplayer`:
  - Sanitizzazione input (trim, strip control chars, max length).
  - Validazione regex email e campi richiesti.
  - Rate-limit locale (30s per form, `localStorage`).
  - Honeypot `_honey`.
  - Retry con backoff `[2s, 6s, 15s]`.
  - Coda offline persistente con drain su `online` e `load`.
  - Fallback `mailto:` al fallimento finale.
  - Log rotante (max 50 entry) in `localStorage.cf_mail_log`.

## 2026.04.18.1
- Form preventivo `/flashplayer`: invio AJAX a FormSubmit, risultato inline, honeypot, validazione client.

## 2026.04.17.1
- Newsletter `/flashplayer`: invio AJAX a FormSubmit, risultato inline, validazione regex email.

## 1.4.1
- `/flashplayer`: sostituito l'iframe OpenStreetMap con mappa Leaflet 1.9.4, centrata su `45.178311, 10.660775`, marker con popup indirizzo.

## 1.4
- Root: sezioni Storia, Certificazioni, Shop, Testimonial, Orari+Mappa, FAQ, Newsletter, Downloads.

## 1.3.5
- `/flashplayer`: espansione completa (topnav, storia, certificazioni, galleria, testimonial, orari+mappa, FAQ, newsletter, preventivo, downloads, footer).

## 1.3.4
- `/flashplayer`: redesign con Source Serif, logo "beetle", stile 2012 download-center.

## 1.3.3
- `/flashplayer`: redesign presentation deck + shop.
- Rimossi riferimenti legacy, aggiornati `README.md` e `vercel.json`.

## 1.3.2
- README: riscrittura completa in stile 2012.

## 1.3
- Cleanup massivo: rimosso scaffolding Next.js e asset inutilizzati.
