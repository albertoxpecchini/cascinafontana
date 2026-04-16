# Cascina Fontana

Sito istituzionale della Società Agricola Cascina Fontana S.S. — produzione agricola gestita con precisione, Rodigo (MN).

**→ [cascinafontana.xyz](https://cascinafontana.xyz)**

---

## Stack

Sito statico puro — zero framework, zero dipendenze runtime.

| Layer | Tecnologia |
|-------|-----------|
| Markup | HTML5 semantico |
| Stile | CSS3 (custom properties, grid, keyframes) |
| Script | Vanilla JS — IntersectionObserver, Web3Forms |
| Font | NType-82 · Lettera Mono LL · Ndot-57 ([nothingfont](https://github.com/xeji01/nothingfont)) |
| Deploy | Vercel (static, no build step) |
| Form | [Web3Forms](https://web3forms.com) → pzkko@yahoo.com |

## Palette

```
#F9F7F7  background
#DBE2EF  bordi / sezioni secondarie
#3F72AF  accento blu
#112D4E  testo / dark sections
```

## Struttura

```
index.html        → pagina unica
style.css         → tutti gli stili
main.js           → nav scroll, reveal, form submit
public/images/    → foto (da completare)
vercel.json       → routing statico + redirect /jdm
```

## Sezioni

`Hero` → `Sistema` → `Attività` → `Produzione` → `Filiera` → `Strutture` → `Sostenibilità` → `Gelsi` → `Fontana` → `Galleria` → `Chiusura` → `Contatti`

## Form contatti

Il form usa [Web3Forms](https://web3forms.com). Per attivarlo:

1. Vai su web3forms.com/create
2. Inserisci `pzkko@yahoo.com`
3. Ottieni `access_key`
4. Sostituisci `YOUR_KEY` in `index.html` → `<input name="access_key">`

## Dati societari

```
Società Agricola Cascina Fontana S.S.
P.IVA / CF: 02196490201
VAT EU: IT02196490201
Via Belvedere 1 — 46040 Rodigo (MN) — Italia
PEC: cascinafontana@pec.it
```

## Branch

| Branch | Cosa serve |
|--------|-----------|
| `main` | Sito statico corrente → cascinafontana.xyz |
| `jdm` | Versione precedente Next.js → cascinafontana.xyz/jdm |

---

*Versione 1.2 — 2026*
