# Cascina Fontana

Sito della Società Agricola Cascina Fontana — Rodigo, Mantova.

Stile 2012 "presentazione" · deck a slide fullscreen · shop integrato per annunci di vendita.

## Stack

Statico: HTML + CSS + JS vanilla. Nessun build step. Deploy su Vercel.

## Struttura

```
.
├── index.html       # deck (7 slide) + shop + contatti + footer
├── style.css        # palette terra/oro, Playfair Display + Lato
├── main.js          # nav, pager, filtro shop, form web3forms
├── public/images/   # campo.jpg, capannone.jpg, fontana.JPG
└── vercel.json      # rewrites
```

## Sezioni

1. Hero
2. Sistema
3. Attività
4. Produzione
5. Filiera
6. Strutture
7. Identità
- Shop (annunci: macchinari, prodotti, materiali)
- Contatti (form web3forms — sostituire `YOUR_KEY` in `index.html`)
