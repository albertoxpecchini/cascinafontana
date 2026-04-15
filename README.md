# Cascina Fontana

Landing page per Cascina Fontana — azienda agricola a gestione diretta.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **Framer Motion** — animazioni e transizioni
- **Mapbox GL** — mappa interattiva
- **Resend** — invio email dal form contatti

## Struttura

```
app/            → pagine e API routes
components/site → sezioni della landing page
public/         → immagini, icone, grafiche SVG
```

## Setup

```bash
npm install
cp .env.example .env.local
```

Compilare `.env.local` con:

| Variabile | Descrizione |
|-----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token Mapbox per la mappa |
| `RESEND_API_KEY` | API key Resend |
| `CONTACT_TO` | Email destinatario form contatti |

## Sviluppo

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deploy

Configurato per Vercel. Impostare le variabili d'ambiente nel dashboard.
