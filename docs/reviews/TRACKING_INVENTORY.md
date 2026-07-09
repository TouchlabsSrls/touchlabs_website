# Inventario tracciamento — Touchlabs
**Data:** 9 luglio 2026  
**Scope:** `public/` (HTML, CSS, JS)  
**Metodo:** analisi statica del codice sorgente

---

## Sintesi

Il sito **non utilizza analytics, pixel pubblicitari o strumenti di profilazione**. I servizi di terze parti rilevati sono:

1. **Google Fonts** (caricamento CSS/font da Google)
2. **Google Maps** (iframe su `contatti.html` — da caricare solo su azione utente)

Non sono presenti cookie di tracciamento impostati dal sito. **Non è necessario un banner cookie invasivo** per strumenti di marketing; le informative documentano i servizi tecnici e la mappa su richiesta.

---

## Cookie first-party

| Nome | Tipo | Durata | Scopo | Presente |
|------|------|--------|-------|----------|
| *(nessuno impostato dal sito)* | — | — | — | No |

Il sito non imposta cookie propri al caricamento delle pagine.

---

## Local Storage / Session Storage

| Chiave | Uso | Presente |
|--------|-----|----------|
| *(nessuna)* | — | No |

---

## Analytics e pixel

| Strumento | Stato |
|-----------|--------|
| Google Analytics (GA4) | **Assente** |
| Google Tag Manager | **Assente** |
| Meta Pixel | **Assente** |
| Hotjar / Clarity / Plausible | **Assente** |

---

## Font esterni

| Servizio | File coinvolti | URL | Cookie terze parti | Note |
|----------|----------------|-----|-------------------|------|
| Google Fonts | ~~Tutte le pagine~~ | **Rimosso** — font self-hosted in `/assets/fonts/` | — | Aggiornato 9 luglio 2026 |

---

## Iframe e embed

| Servizio | Pagina | Caricamento | Cookie / tracciamento |
|----------|--------|-------------|----------------------|
| Google Maps | `contatti.html` | **Click-to-load** (placeholder fino al click) | Possibili cookie Google solo dopo caricamento iframe |

---

## Video e asset

| Origine | Tipo | Tracciamento |
|---------|------|--------------|
| `/assets/video/*` | Self-hosted | No |
| `/assets/img/*` | Self-hosted | No |

---

## Form contatti

| Elemento | Dati inviati | Destinazione |
|----------|--------------|--------------|
| `#contact-form` | Nome, email, azienda, telefono, area interesse, messaggio, consenso privacy | Endpoint `/api/contact.php` → email SMTP interna |

Nessun servizio terzo sul form (no Formspree, no reCAPTCHA al momento).

---

## Conclusioni operative

| Azione | Decisione |
|--------|-----------|
| Banner cookie marketing | **Non necessario** (nessun tracker) |
| Cookie policy | **Sì** — documentare font Google e mappa |
| Privacy policy | **Sì** — con validazione legale |
| Google Maps | **Click-to-load** implementato |
| Google Fonts | Documentato; self-hosting opzionale in evoluzione futura |

---

## Revisione post go-live

Ripetere l'inventario se vengono aggiunti:

- Google Analytics / GTM
- reCAPTCHA o servizi anti-spam di terze parti
- Chat widget (Intercom, Crisp, ecc.)
- Embed social (YouTube, Vimeo, LinkedIn)
