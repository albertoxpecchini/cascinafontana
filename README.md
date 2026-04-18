# CASCINA FONTANA v1.3.2

> OFFICIAL WEBSITE PROJECT
> Societa Agricola Cascina Fontana S.S. - Rodigo (MN)

### QUICK LINKS

- HOME: [https://cascinafontana.xyz](https://cascinafontana.xyz)
- FLASH MODE: [https://cascinafontana.xyz/flashplayer](https://cascinafontana.xyz/flashplayer)

---

## WEBSITE STATUS (2012 STYLE)

- Project type: Static website
- Dependencies: 0 runtime dependencies
- Framework: none
- Build step: none
- Hosting: Vercel
- Browser target: modern desktop + mobile

---

## TECH SPECS

- HTML5 semantic layout
- CSS3 custom properties + grid + animations
- Vanilla JavaScript (navigation, reveal effects, form submit)
- Web3Forms for contact form delivery

---

## FILE MAP

```txt
cascinafontana/
|-- index.html
|-- style.css
|-- main.js
|-- vercel.json
|-- public/
|   `-- images/
`-- flashplayer/
    |-- index.html
    `-- style.css
```

---

## MAIN SECTIONS

```txt
Hero
Sistema
Attivita
Produzione
Filiera
Strutture
Sostenibilita
Gelsi
Fontana
Galleria
Contatti
```

---

## CONTACT FORM SETUP

The form uses [Web3Forms](https://web3forms.com) (no backend needed).

1. Create a key at `https://web3forms.com/create`
2. Open `index.html`
3. Replace the placeholder key:

```html
<input type="hidden" name="access_key" value="YOUR_KEY">
```

---

## DEPLOY

Vercel serves the project as static files with no build process.

```json
{
  "buildCommand": "",
  "outputDirectory": ".",
  "framework": null
}
```

Important routes in `vercel.json`:

- `/` -> `/index.html`
- `/flashplayer` -> `/flashplayer/index.html`

---

## FLASH EASTER EGG

The footer button (red Flash icon) opens `/flashplayer`, a 2012-style tribute page inspired by classic Adobe Flash installer screens.

---

## CHANGELOG

### 1.3.2 (2026)

- README rewritten in full 2012 style
- Retro structure retained with updated setup/deploy notes

---

Best viewed with passion for old-school web.
