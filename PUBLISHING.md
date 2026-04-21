# Checklist di pubblicazione — Cascina Fontana

Spunta ogni punto **prima** di fare push su GitHub.

---

## Codice

- [ ] Build passa senza errori (`npm run build`)
- [ ] Lint passa senza errori (`npm run lint`)
- [ ] Nessun `console.log`, breakpoint o codice di debug rimasto
- [ ] Nessun codice morto (funzioni/variabili non usate)
- [ ] Test funzionanti (se presenti)

---

## Sicurezza e file

- [ ] Nessun file sensibile (`.env`, API keys, credenziali) nel commit
- [ ] `.gitignore` copre `.env*`, `node_modules/`, `.next/`, `out/`
- [ ] Nessun file inutile (cache, build vecchie, file temporanei)

---

## Dipendenze e configurazione

- [ ] `package.json` coerente con le dipendenze effettivamente usate
- [ ] Configurazioni ambiente documentate in `README.md` (setup rapido)

---

## Struttura e leggibilità

- [ ] Struttura cartelle ordinata e comprensibile
- [ ] Nomi file e variabili chiari e consistenti

---

## Documentazione

- [ ] `README.md` presente e aggiornato
- [ ] Descrizione repository coerente con lo stato attuale del progetto
- [ ] Licenza presente (se necessaria)

---

## Git e versioning

- [ ] Commit puliti e con messaggi significativi (cronologia chiara)
- [ ] Ultimo commit rispecchia lo stato reale del progetto
- [ ] Branch corretto (`main` aggiornato)
- [ ] Versioning coerente — usare lo script di release:

```sh
# Patch automatica (x.x.+1)
sh script/release.sh

# Versione specifica
sh script/release.sh 2.0.0
```

---

## Qualità visiva e funzionale

- [ ] Performance base verificata (nessun errore evidente in console)
- [ ] UI controllata su desktop e mobile (DevTools → 390 px)
- [ ] Link, API e risorse esterne funzionanti
- [ ] Hero section visibile all'apertura
- [ ] Form contatti invia senza errori
- [ ] Galleria si carica correttamente

---

## Verifica post-push

- [ ] Deploy Vercel verde ([dashboard](https://vercel.com/dashboard))
- [ ] Sito live funzionante
