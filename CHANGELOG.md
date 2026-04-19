# Registro Modifiche

Formato versione corrente: `AAAA.MM.GG.NN` (data + sequenza giornaliera zero-padded).
Legacy pre-standardizzazione: `1.x`.

Questo file e` allineato ai commit versionati presenti nella history Git: cosa e` cambiato, perche`, impatto runtime/deploy.

---

## In sviluppo
- Ripristinata la galleria foto nella home principale.
- Le foto vengono lette dalla lista condivisa in `js/gallery-data.js`.
- Documentato il flusso per aggiungere nuove foto in `public/images/` e pubblicarle in galleria.

## 2026.04.18.23
- Integrato loader aggiornamenti live nella root:
  - aggiunto `js/updates-loader.js`,
  - wiring lato `index.html` per visualizzare updates dinamici.
- Effetto: homepage pronta a ricevere feed aggiornamenti senza hardcode manuale.

## 2026.04.18.22
- Evoluzione stack admin/listings:
  - refactor importante di `admin/admin.js` e `admin/index.html`,
  - aggiornamento `js/shop-loader.js`,
  - nuova migration `20260418130000_extend_listings_add_updates.sql`.
- Effetto: modello dati esteso con supporto updates e UI admin potenziata.

## 2026.04.18.21
- Bootstrap completo del layer dati + backoffice parallelo:
  - introdotta area `admin/` (`index.html`, `login.html`, `admin.js`),
  - introdotti client/script Supabase (`js/supabase-client.js`, `scripts/apply-schema.js`),
  - creata migration base `20260418120000_init_listings.sql`,
  - aggiornati `package.json`, `vercel.json`, `.gitignore`.
- Effetto: da sito statico puro a flusso ibrido con contenuti shop gestibili da admin.

## 2026.04.18.20
- Consolidata la variante `index-uupm.html` dentro `index.html`.
- Rimosso file ponte temporaneo `index-uupm.html`.
- Effetto: una sola root page canonica con integrazione completa del nuovo layout/contenuto.

## 2026.04.18.19
- Aggiunto `index-uupm.html` come branch sperimentale completo della home.
- Effetto: staging locale di una versione alternativa prima del merge nella root.

## 2026.04.18.18
- Tuning incrementale di `index.html` + `style.css`.
- Effetto: rifiniture UI/UX e stabilizzazione del layout dopo il refactor strutturale.

## 2026.04.18.17
- Rollback/migrazione strutturale dal namespace `home/` alla root:
  - rimossi `home/index.html`, `home/main.js`, `home/style.css`,
  - riportati contenuti e stili su `index.html`, `main.js`, `style.css`,
  - aggiornato `vercel.json`.
- Effetto: semplificazione routing e riduzione duplicazioni tra varianti home.

## 2026.04.18.16
- Iterazione su variante `home/`:
  - update markup in `home/index.html`,
  - rework CSS in `home/style.css`.
- Effetto: miglioramento visual/spacing prima del merge successivo sulla root.

## 2026.04.18.15
- Introdotta variante home separata su cartella `home/`:
  - creati `home/index.html`, `home/style.css`, `home/main.js`,
  - adattata `index.html` di ingresso,
  - update routing in `vercel.json`.
- Effetto: separazione sperimentale tra shell root e nuova home estesa.

## 2026.04.18.14
- Root `/` convertita in splash minimalista ad alta resa visiva:
  - background scuro con blob animati,
  - card glassmorphism,
  - CTA unica `Enter Flash Mode` -> `/flashplayer`.
- `index.html` root reso self-contained (CSS inline), senza import di `style.css` e `main.js`.
- `style.css` e `main.js` root mantenuti come artefatti legacy dormienti (non caricati in produzione).
- Contenuto esteso invariato e confinato su `/flashplayer` (shop, certificazioni, form, mappa, ecc.).
- `README.md` sincronizzato con nuova struttura + nota file legacy.

## 2026.04.18.13
- Font stack unificato in una sola famiglia di sistema:
  `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`.
- Rimossi residui di font custom/hardcoded (Source Serif, alias espliciti SF Pro/Mono, fallback eterogenei).
- Eliminato caricamento esterno Source Serif da `/flashplayer`.
- Variabili CSS `--display`, `--mono`, `--dot` riallineate a `--sans` senza modifica markup.
- `README.md` aggiornato per riflettere stack font canonico.

## 2026.04.18.12
- Pipeline release hardenizzata: `scripts/release.sh` ora crea tag annotati (`git tag -a`).
- Effetto operativo: `git push --follow-tags` propaga i tag in automatico senza passaggi manuali.

## 2026.04.18.11
- Introdotto file `VERSION` in root come source of truth della versione corrente.
- `scripts/release.sh` automatizza incremento sequenza giornaliera (`NN`), scrittura `VERSION`, commit, tag e push.
- Versionamento Git reso deterministico e disaccoppiato da file non pertinenti.
- Formalizzato formato `AAAA.MM.GG.NN` con `NN` a 2 cifre.

## 2026.04.18.10
- Cleanup storico branch `main` dalla release `1.4` in avanti: commit message standardizzato = sola versione.
- Aggiunto hook tracciato `.githooks/commit-msg` per enforcement formato commit.
- `README.md` esteso con istruzioni di bootstrap hook post-clone (`core.hooksPath`).

## 2026.04.18.9
- Formalizzata policy di lavoro in `README.md`:
  - ogni change rilevante aggiorna documentazione,
  - ogni change lascia traccia in `CHANGELOG.md`.
- Changelog orientato a leggibilita` non-specialistica (italiano semplice).

## 2026.04.18.8
- Bootstrap del file `CHANGELOG.md` come registro ufficiale modifiche.
- `README.md` collegato al changelog per cronologia centralizzata.
- Convenzione commit consolidata: messaggio = versione.

## 2026.04.18.7
- Home potenziata lato contenuti/UX:
  - titolo + descrizione reali (rimozione placeholder),
  - tre CTA aggiuntive (`Contattaci`, `Vedi shop`, `Come lavoriamo`).
- Metriche aziendali rese esplicite e contestualizzate (biolche/ettari, mezzi, pannelli, anni attivita`).
- Rimpiazzati box vuoti con immagini reali (campo, capannone, fontana).
- Migliorata leggibilita` tipografica (grigi piu` contrastati).
- Ridotte spaziature verticali e ottimizzata densita` delle sezioni.
- Microcopy freccia hero aggiornata in `"↓ Scopri"`.

## 2026.04.18.6
- `README.md` riscritto allineandolo allo stato reale del progetto.
- Rimossi riferimenti obsoleti (Web3Forms, percorso `/jdm`).
- Documentati nuovo mailer client-side e assetto font.

## 2026.04.18.5
- Pulizia commenti CSS: rimossi riferimenti legacy ai vecchi font.

## 2026.04.18.4
- Decommission cartella `/jdm` + relativa redirect.
- Coordinate mappa home riallineate alla posizione reale della cascina.

## 2026.04.18.3
- Home migrata a font di sistema Apple (`SF Pro`, `SF Mono`).
- Rimosso download di font esterni sulla root.

## 2026.04.18.2
- Hardening completo dei form `/flashplayer` (`newsletter` + `preventivo`):
  - validazione email/campi obbligatori,
  - anti-bot honeypot,
  - rate-limit locale (30s),
  - retry automatico in caso di rete instabile,
  - coda offline con reinvio al ritorno online,
  - fallback finale via client email.

## 2026.04.18.1
- Form `preventivo` portato a submit asincrono (no page reload).
- Inseriti controlli anti-spam e validazione base campi.

## 2026.04.17.1
- Form `newsletter` migrato a invio asincrono con feedback inline, senza refresh pagina.

## 1.4.1
- Mappa `/flashplayer` migrata da iframe statico a mappa interattiva con marker + popup indirizzo.

## 1.4
- Espansione macro-sezioni home:
  `Storia`, `Certificazioni`, `Shop`, `Testimonial`, `Orari+Mappa`, `FAQ`, `Newsletter`, `Download`.

## 1.3.5
- `/flashplayer` esteso a landing completa con:
  topnav, storia, certificazioni, galleria, testimonial, orari, FAQ, newsletter, preventivo, downloads, footer avanzato.

## 1.3.4
- Restyle `/flashplayer` in tema "centro download 2012".
- Introdotti font Source Serif e logo scarabeo (poi rimossi in release successive).

## 1.3.3
- `/flashplayer` riorganizzato in formato presentazione + sezione shop.
- Pulizia riferimenti obsoleti e update file di configurazione.

## 1.3.2
- `README.md` riscritto con estetica/documentazione in stile 2012.

## 1.3.1
- Iterazione UX su `/flashplayer` con aggiornamenti di struttura e stile.
- Asset visuale aggiunto: `public/images/flash_128.jpg`.
- Ritocchi correlati su root (`index.html`, `style.css`) per consistenza di navigazione.

## 1.3
- Major cleanup: rimossa la precedente impalcatura Next.js con relativi asset non utilizzati.

## 1.2
- Introduzione baseline del progetto in stack Next.js con:
  - app router (`app/`),
  - componenti modulari (`components/site/*`),
  - route API contatti (`app/api/contatti/route.ts`),
  - asset grafici/immagini in `public/`.
- Inclusi file di configurazione TypeScript/ESLint/Next e lockfile dipendenze.
- Effetto: primo impianto completo del sito prima della successiva migrazione verso statico puro.

---

## Note Tecniche
- Deploy target: Vercel static hosting, build step assente.
- Policy commit: messaggio uguale alla versione (enforced via hook).
- Version source of truth: file `VERSION` in root.
