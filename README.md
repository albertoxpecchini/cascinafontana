# CASCINA FONTANA

> Sito ufficiale — Società Agricola Cascina Fontana S.S., Rodigo (MN)

- Home: https://cascinafontana.xyz

Versioning: `MAJOR.MINOR.PATCH` (es. `1.0.1`). Attuale: vedi [`VERSION`](./VERSION).

**Regola di lavoro:** ogni modifica → si aggiorna `README.md` dove serve **e** si scrive una voce in `CHANGELOG.md` in italiano semplice. Il messaggio del commit è solo il numero di versione.

## Documentazione completa

La documentazione principale del progetto è in `documentazione/README.md`.

- `documentazione/README.md` → guide, workflow, release, stato e struttura file
- `documentazione/CHANGELOG.md` → log delle modifiche

## Stato del repository

- Sito statico, nessun runtime, nessuna build step
- Hosting: Vercel
- Target: desktop + mobile moderni

## Come usare il repository

1. Modifica i file del sito e dei contenuti.
2. Aggiorna `documentazione/CHANGELOG.md` con una voce in italiano semplice.
3. Esegui il rilascio con `sh script/release.sh` dopo aver aggiunto le modifiche.
