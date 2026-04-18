# Registro delle modifiche

Formato versione: `AAAA.MM.GG.N` (data + numero del giorno).
Ogni voce racconta cosa è cambiato in parole semplici.

---

## 2026.04.18.10
- Riscritta la storia recente di `main` (da `1.4` in poi): ogni commit ora porta solo il numero di versione, niente descrizioni nel messaggio.
- Aggiunto un hook `commit-msg` tracciato in `.githooks/` che rifiuta messaggi non conformi al formato versione.
- `README.md` spiega come attivare l'hook dopo un clone (`git config core.hooksPath .githooks`).

## 2026.04.18.9
- Regola di lavoro esplicita nel `README.md`: ogni modifica tocca anche il `README.md` (se pertinente) e lascia una voce in questo `CHANGELOG.md`.
- Le voci del changelog d'ora in avanti sono in italiano semplice, leggibili anche da chi non fa il mestiere.

## 2026.04.18.8
- Creato il file `CHANGELOG.md`: il registro completo delle modifiche ora vive qui.
- Il `README.md` rimanda a questo file per la cronologia.
- Da ora in poi i messaggi dei commit sono solo il numero di versione.

## 2026.04.18.7
- La pagina iniziale ora ha titolo e descrizione veri (prima c'era solo "1.3").
- Sotto il titolo grande sono comparsi tre pulsanti: "Contattaci", "Vedi shop", "Come lavoriamo".
- I numeri della cascina ora dicono anche a cosa si riferiscono: 63 biolche ≈ 42 ettari, 8 trattori, 30 pannelli, 18 anni dal 2007.
- Tolti i riquadri vuoti: ora si vedono davvero le foto del campo, del capannone e della fontana.
- I testi grigi sono più scuri, si leggono meglio.
- Le sezioni sono un po' più vicine tra loro, meno spazio vuoto.
- La freccia in fondo all'home ora dice "↓ Scopri".

## 2026.04.18.6
- Riscritto il `README.md` con lo stato attuale del sito.
- Tolti i riferimenti vecchi a Web3Forms e al percorso `/jdm`.
- Aggiunto il dettaglio del nuovo sistema di invio email e dei font.

## 2026.04.18.5
- Puliti alcuni commenti nel CSS che nominavano ancora i vecchi font.

## 2026.04.18.4
- Rimossa la vecchia cartella `/jdm` e la sua redirect.
- Le coordinate della mappa sulla home ora coincidono con quelle della cascina.

## 2026.04.18.3
- La home ora usa i font di sistema di Apple (SF Pro, SF Mono).
- Niente più download di font esterni sulla pagina principale.

## 2026.04.18.2
- I due form della pagina `/flashplayer` (newsletter e preventivo) ora hanno un sistema di invio più robusto:
  - Controlla l'email e i campi obbligatori.
  - Pulisce lo spam con un campo nascosto (honeypot).
  - Se l'utente preme troppo spesso, aspetta 30 secondi.
  - Se la rete cade, l'invio riprova da solo più volte.
  - Se proprio non ci riesce, mette il messaggio in coda e lo manda quando si torna online.
  - Come ultima via d'uscita, offre un link "apri nella tua email".

## 2026.04.18.1
- Il modulo preventivo non ricarica più la pagina: ora invia in background e mostra subito la risposta.
- Aggiunto controllo anti-spam e validazione dei campi.

## 2026.04.17.1
- Anche la newsletter ora invia in background, senza ricaricare, e mostra l'esito sotto al pulsante.

## 1.4.1
- La mappa di `/flashplayer` non è più un iframe: ora è una mappa interattiva con indicatore e popup dell'indirizzo.

## 1.4
- Aggiunte alle sezioni della home: Storia, Certificazioni, Shop, Testimonial, Orari+Mappa, FAQ, Newsletter e Download.

## 1.3.5
- `/flashplayer` ampliato: menu in alto, storia, certificazioni, galleria, testimonial, orari, FAQ, newsletter, modulo preventivo, downloads, footer più ricco.

## 1.3.4
- `/flashplayer` ridisegnato in stile "centro download 2012", con font Source Serif e logo scarabeo.

## 1.3.3
- `/flashplayer` riorganizzato come presentazione con sezione shop.
- Pulizia di riferimenti obsoleti e aggiornamento dei file di configurazione.

## 1.3.2
- README riscritto in stile 2012.

## 1.3
- Grande pulizia: eliminata la vecchia impalcatura Next.js e gli asset inutilizzati.
