# Collaudo QA Locale — Report finale

**Data:** 10 luglio 2026  
**Ambiente:** `http://localhost:8084/`  
**Baseline RC:** commit `dc8bd8a` · tag `rc-local-2026-07-10`  
**Audit automatico:** `docs/reviews/local-qa-audit.json` (`node scripts/local-qa-audit.mjs`)

**Deploy:** non effettuato · **P2/P3:** non avviati

---

## Esito sintetico

| Area | Esito |
|------|-------|
| HTTP / link interni | ✅ 0 link rotti, 0 asset 404 |
| Responsive (6 viewport × 19 pagine prioritarie) | ✅ 0 overflow dopo fix cookie |
| Console JavaScript | ✅ 0 errori |
| Form contatti (senza SMTP) | ✅ Validazione OK, 503 su invio valido, honeypot OK |
| Video / media | ✅ Comportamento conforme; note minori sotto |
| Accessibilità essenziale | ✅ Skip link, H1, label form; nessun fix urgente |
| Asset cleanup | 📋 Inventario in [UNUSED_ASSETS.md](./UNUSED_ASSETS.md) |

---

## Fase 2 — Navigazione

### HTTP
Tutte le pagine rispondono **200**, eccetto `configuratori-3d.html` → **301** verso `digital-experience.html` (redirect nginx locale, atteso).

### Struttura pagine (campione automatico)
- **Title:** presente su tutte le 19 pagine
- **H1:** 1 per pagina su tutte le pagine pubbliche; `configuratori-3d.html` è stub redirect senza H1 (intenzionale)
- **Navbar:** coerente su tutte le pagine con header completo
- **Footer:** Privacy + Cookie linkati ovunque
- **Skip link:** presente (verificato Playwright)

### Link interni
| Esito | Dettaglio |
|-------|-----------|
| Link rotti | **0** |
| Anchor inesistenti | **0** |
| URL legacy Joomla / `.php` | **0** nei contenuti HTML |
| Pagine non linkate dal sito | `/configuratori-3d.html` — raggiungibile solo via URL diretto/redirect; non in menu (by design, vedi `REDIRECT_MAP.md`) |

### Pagine raggiungibili dal menu principale
Home, Chi siamo, Servizi, Portfolio, Innovation Hub, Contatti.

### Pagine secondarie (non in navbar, linkate da contenuti)
Tutti i pilastri, case study, legali, Luxury Living Group (da portfolio).

---

## Fase 3 — Responsive

Viewport testati: **1440×900**, **1280×800**, **1024×768**, **768×1024**, **390×844**, **360×800**.

Pagine prioritarie + legali + redirect: 19 URL × 6 viewport = 114 combinazioni.

| Esito post-fix | |
|----------------|---|
| Overflow orizzontale | **0** casi |
| H1 multipli | **0** |
| Errori console | **0** |

### Fix applicato in collaudo
Vedi **P0-LOCAL-001** (overflow `cookie.html` su mobile).

---

## Fase 4 — Video e media

| Pagina | Video | Peso (formati) | Poster | Desktop | Mobile | Problemi |
|--------|-------|----------------|--------|---------|--------|----------|
| `index.html` | Showreel hero | 18,2 MB WebM + 28,1 MB MP4 | `touchlabs-showreel-poster.jpg` | Autoplay hero (muted) | Autoplay se non reduced-motion | — |
| `index.html` | Video breather clubhouse | 4,0 MB WebM + 7,9 MB MP4 | `configuratore-poster.jpg` | IO autoplay | Pausa fuori viewport | — |
| `index.html` | Editorial Haier | 1,9 MB WebM + 2,7 MB MP4 | `haier-poster.jpg` | IO autoplay | Pausa fuori viewport | — |
| `portfolio.html` | Surgeree | 5,1 MB WebM + 5,4 MB MP4 | `surgeree-video-poster.jpg` | 1 video in play (IO) | Tap-to-play + overlay | — |
| `portfolio.html` | Luxury Living | 7,9 MB MP4 | `video-poster.jpg` | IO | Tap-to-play | — |
| `portfolio.html` | Nottetempo | 6,0 MB MP4 | `cover.jpg` | IO | Tap-to-play | — |
| `portfolio.html` | b-r1ng | 8,2 MB MP4 | `hero.jpg` | IO | Tap-to-play | — |
| `portfolio.html` | ITM Monoblock | 2,7 MB WebM + 1,9 MB MP4 | `video-poster.jpg` | IO | Tap-to-play | — |
| `surgeree.html` | Demo | 5,1 MB WebM + 5,4 MB MP4 | `surgeree-video-poster.jpg` | Autoplay muted | Pausa / reduced-motion | — |
| `br1ng.html` | Hero | 8,2 MB MP4 | `hero.jpg` | Autoplay muted | Come hero | — |
| `br1ng.html` | Gallery | 8,2 MB MP4 | `hero.jpg` | Tap / controls | Tap / controls | — |
| `nottetempo.html` | Cover | 6,0 MB MP4 | `cover.jpg` | No autoplay | Controls | — |
| `scattolini.html` | Configuratore | 3,3 MB MP4 | `configurazioni.jpg` | No autoplay | Controls | — |
| `il-labirinto.html` | Esperienza | 13,7 MB MP4 | `cover.png` | No autoplay | Controls | Path in `img/` (vedi P1) |
| `luxury-living-group.html` | Configuratore | 7,9 MB MP4 | `video-poster.jpg` | Autoplay muted | IO | — |
| `digital-experience.html` | ITM Monoblock | 2,7 MB WebM + 1,9 MB MP4 | `video-poster.jpg` | Autoplay muted | IO | — |
| `spatial-computing.html` | Labirinto teaser | 13,7 MB MP4 | `cover.png` | Autoplay muted | IO | Stesso file in `img/` |

**Comportamenti verificati:** `preload` appropriato, `muted`/`playsinline` su autoplay, pausa fuori viewport, max 1 portfolio video attivo, tap-to-play mobile, `prefers-reduced-motion` e `Save-Data` rispettati in `main.js`.

---

## Fase 5 — Form contatti

| Test | HTTP | Esito |
|------|------|-------|
| Nome mancante | 422 | Messaggio campo `name` |
| Email non valida | 422 | Messaggio campo `email` |
| Privacy non accettata | 422 | Messaggio `privacy_consent` |
| Honeypot compilato | 200 | Successo silenzioso (anti-spam) |
| Invio valido senza SMTP | **503** | «Servizio email non configurato. Contattaci a info@touchlabs.it.» |

✅ Nessun falso messaggio di successo su invio reale  
✅ Nessun dettaglio tecnico esposto all'utente  
✅ Nessun errore console sulla pagina contatti

---

## Fase 6 — Accessibilità essenziale

| Controllo | Esito |
|-----------|-------|
| Skip link | ✅ Presente |
| Un H1 per pagina | ✅ (eccetto stub redirect) |
| Menu mobile `aria-expanded` | ✅ |
| Pulsanti play portfolio | ✅ `aria-label`, tastiera Enter/Space |
| Label form contatti | ✅ Associate agli input |
| Alt text immagini principali | ✅ Presenti su hero/gallery |
| Focus visibile | ✅ Stili `:focus-visible` in CSS |
| Contenuto senza JS | ✅ HTML e link navigabili; animazioni `.reveal` richiedono JS per fade-in |
| `prefers-reduced-motion` | ✅ Animazioni e autoplay disabilitati |

Nessun problema evidente a basso rischio richiede fix immediato.

---

## Fase 7 — Asset cleanup

Vedi [UNUSED_ASSETS.md](./UNUSED_ASSETS.md).

**Non cancellato nulla.** Master video non referenziati (~18,5 MB) candidati a spostamento in `assets-source/video/` prima del deploy.

---

# Priorità fix

## P0-LOCAL — Bug da correggere subito

### P0-LOCAL-001 — Overflow orizzontale cookie policy (mobile) ✅ RISOLTO

| Campo | Valore |
|-------|--------|
| **Pagina** | `cookie.html` |
| **Viewport** | 390×844, 360×800 |
| **Descrizione** | Tabella `.legal-table` e `<code>` nel callout legale superavano la larghezza viewport (scrollWidth fino a 451px) |
| **Gravità** | Alta — scroll orizzontale indesiderato |
| **File** | `public/assets/css/style.css` |
| **Fix applicato** | `table-layout: fixed`, font/padding ridotti su mobile, `overflow-wrap` su `code` |
| **Rischio regressione** | Basso — scope limitato alle pagine legali |

**Stato post-fix:** 0 overflow su tutti i viewport nel re-run audit.

---

## P1-LOCAL — Correzioni importanti

### P1-LOCAL-001 — Master video non referenziati in `public/`

| Campo | Valore |
|-------|--------|
| **Pagina** | — (deploy) |
| **Viewport** | — |
| **Descrizione** | 3 file MP4 master (~18,5 MB) non usati dalle pagine HTML |
| **Gravità** | Media — peso deploy inutile |
| **File** | `public/assets/video/haier/haier.mp4`, `surgeree/surgeree-demo.mp4`, `itm-monoblock/itm-monoblock.mp4` |
| **Fix proposto** | Spostare in `assets-source/video/` |
| **Rischio regressione** | Basso se si mantengono le versioni compresse referenziate |

### P1-LOCAL-002 — Video Labirinto in cartella `img/`

| Campo | Valore |
|-------|--------|
| **Pagina** | `il-labirinto.html`, `spatial-computing.html` |
| **Descrizione** | `labirinto.mp4` è sotto `/assets/img/projects/labirinto/` |
| **Fix proposto** | Spostare in `/assets/video/labirinto/` e aggiornare i riferimenti HTML |
| **Rischio regressione** | Medio — richiede aggiornamento path in 2 HTML |

### P1-LOCAL-003 — `luxury-living-group.html` non in navbar

| Campo | Valore |
|-------|--------|
| **Pagina** | `luxury-living-group.html` |
| **Descrizione** | Raggiungibile da portfolio ma non dal menu principale |
| **Fix proposto** | Valutare se aggiungere link in portfolio hero o lasciare come case study secondario |
| **Rischio regressione** | Basso — decisione editoriale |

---

## POLISH — Rifiniture estetiche opzionali

### POLISH-001 — CTA «Scopri tutti i servizi» poco evidente (V-004)

| Campo | Valore |
|-------|--------|
| **Pagina** | `index.html` |
| **Viewport** | Tutti |
| **Descrizione** | Link testuale sotto i 4 pilastri meno visibile rispetto alle CTA primarie |
| **Fix proposto** | Valutare `btn btn--secondary` o maggiore contrasto |
| **Rischio regressione** | Basso — estetico |

### POLISH-002 — Spatial Computing lungo su mobile (V-002)

| Campo | Valore |
|-------|--------|
| **Pagina** | `spatial-computing.html` |
| **Viewport** | 390×844, 360×800 |
| **Descrizione** | Pagina lunga; scroll elevato ma senza overflow |
| **Fix proposto** | Nessun taglio ulteriore senza approvazione contenuti |
| **Rischio regressione** | Alto se si rimuovono sezioni |

### POLISH-003 — Preview ITM e gallery Nottetempo non usate

| Campo | Valore |
|-------|--------|
| **Descrizione** | 8 immagini in `public/assets/` non referenziate (~1,2 MB) |
| **Fix proposto** | Integrare in pagina o archiviare in `assets-source/` |
| **Rischio regressione** | Basso |

---

## LAUNCH — Solo prima della pubblicazione

| ID | Attività |
|----|----------|
| LB-1 | Configurare SMTP e test invio reale |
| LB-2 | Dati societari definitivi |
| LB-3 | Validazione legale Privacy / Cookie |
| LB-4 | Smoke test su staging/produzione (browser reali) |
| LB-5 | Replica nginx + redirect produzione |
| L-01 | Spostare master video fuori da `public/` |
| L-02 | Rimuovere o sostituire `og-image.svg` legacy |
| L-03 | Verificare redirect legacy Joomla aggiuntivi se emerge traffico |

---

## Fix applicati automaticamente in questa sessione

1. **P0-LOCAL-001** — overflow `cookie.html` mobile (`style.css`)
2. **Script audit** — `scripts/local-qa-audit.mjs` (form test con `privacy_consent` + `application/x-www-form-urlencoded`; fix parsing tag `<video>`)

---

## Cosa non è stato fatto (per istruzione esplicita)

- ❌ Deploy su `newtl.touchlabs.it` o altri ambienti
- ❌ Configurazione SMTP
- ❌ Modifica nginx produzione, dati societari, testi legali definitivi
- ❌ Nuove sezioni o riscrittura pagine
- ❌ Avvio P2 / P3
- ❌ Cancellazione asset

---

## Riferimenti

- [LOCAL_RELEASE_CANDIDATE.md](./LOCAL_RELEASE_CANDIDATE.md)
- [UNUSED_ASSETS.md](./UNUSED_ASSETS.md)
- [local-qa-audit.json](./local-qa-audit.json)
- [FINAL_ACTION_PLAN.md](./FINAL_ACTION_PLAN.md)
