# Technical, Accessibility & Performance Audit — Touchlabs

**Agente:** Technical, Accessibility & Performance QA  
**Data:** 9 luglio 2026  
**Scope:** 16 HTML, `public/assets/css/style.css`, `public/assets/js/main.js`, media in `public/assets/`  
**Stato:** Solo analisi — nessuna modifica applicata

---

## Sintesi esecutiva

Il sito è statico ben strutturato (skip-link, landmark, lazy loading diffuso, `prefers-reduced-motion` su animazioni e video). I **bloccanti pre-lancio** sono il **form contatti non funzionante**, l’assenza di **fallback no-JS** per contenuti `.reveal`/`.animate-in`, e i **rischi performance** da video multipli (showreel 28 MB + 7 autoplay sul portfolio). Manca `sitemap.xml` e `robots.txt` (coperti anche da SEO Launch).

---

## Bloccanti

| ID | Pagina / file | Selettore / elemento | Problema | Proposta |
|----|---------------|----------------------|----------|----------|
| TP-B1 | `contatti.html` + `main.js` L98–106 | `#contact-form`, `action="#"` | Submit intercettato con `preventDefault()` — **nessun invio** | Integrare backend (Formspree, API, Netlify Forms) e rimuovere stub |
| TP-B2 | Site-wide CSS + JS | `.reveal`, `.animate-in` (`style.css` L1379–1403) | Senza JavaScript gli elementi restano **`opacity: 0`** (nessun `<noscript>` né regola CSS di fallback) | Aggiungere regola `@media (scripting: none)` o `<noscript>` che imposti `opacity: 1` |
| TP-B3 | `portfolio.html`, `index.html` | `[data-showreel] video` | Showreel **28 MB** (`touchlabs-showreel-compressed.mp4`) + **18 MB** webm; duplicato su home e portfolio | Usare versione più leggera; una sola istanza; considerare `preload="none"` fuori hero |

---

## Importanti

### Link e navigazione

| ID | Problema | File | Nota |
|----|----------|------|------|
| TP-I1 | Menu mobile richiede JS | `main.js` L23–39, `#nav-toggle` | Su mobile senza JS la nav desktop è nascosta e il toggle non funziona | CSS fallback: mostrare `.navbar__list` o link essenziali senza JS |
| TP-I2 | Redirect `configuratori-3d.html` solo client-side | `configuratori-3d.html` | `meta refresh` + JS — **non 301 server** | Regola nginx in deploy (vedi SEO Launch) |
| TP-I3 | Link interni verificati manualmente | 16 HTML | Nessun href verso pagine inesistenti rilevato nel grep | Confermare in staging tutti gli anchor (`#nottetempo`, `#itm-monoblock`, ecc.) |

### JavaScript e console

| ID | File | Problema |
|----|------|----------|
| TP-I4 | `main.js` | `video.play().catch(function () {})` — errori autoplay silenziati (accettabile) |
| TP-I5 | Portfolio | **7 video** con `autoplay` sulla stessa pagina — carico rete/CPU elevato su scroll |
| TP-I6 | `main.js` L109–150 | Showreel: IO per play/pause — buona pratica; hero showreel parte subito |

### HTML semantico

| ID | Pagina | Problema | Proposta |
|----|--------|----------|----------|
| TP-I7 | `configuratori-3d.html` | Nessun `<h1>`, solo redirect | Accettabile per pagina transitoria; preferire 301 senza HTML |
| TP-I8 | Case study | Struttura `main` → `section` → `header` coerente | OK |
| TP-I9 | `contatti.html` | `h2.visually-hidden` + `h3` per “Cosa succede dopo” | Gerarchia corretta |

### Accessibilità

| ID | Elemento | Problema | Proposta |
|----|----------|----------|----------|
| TP-I10 | `#nav-toggle` | Nessuna regola `.navbar__toggle:focus-visible` in `style.css` | Aggiungere outline coerente con `.btn:focus-visible` |
| TP-I11 | Logo `alt=""` | Decorativo con `aria-label` sul link — **corretto** | Nessuna azione |
| TP-I12 | Illustrazioni SVG home | `alt=""` su pillar e layer Surgeree — decorative | OK se non informative |
| TP-I13 | `innovation-hub.html` | Immagine research con `alt=""` | Verificare se informativa → aggiungere alt descrittivo |
| TP-I14 | Video | `aria-label` presente su quasi tutti i `<video>` | OK |
| TP-I15 | Form `contatti.html` | Label associate (`for`/`id`), `required` su campi chiave | OK struttura; manca feedback post-submit |
| TP-I16 | Skip-link | Presente + `:focus` visibile (`style.css` L147) | OK |
| TP-I17 | Focus generale | `:focus-visible` su btn, link nav, form, footer | OK su componenti principali |

### Contrasto e motion

| ID | Nota |
|----|------|
| TP-I18 | Contrasto non misurato con tool automatico in questa sessione — **verificare** testo secondario su `.section--dark` e `.portfolio-card--compact` |
| TP-I19 | `@media (prefers-reduced-motion: reduce)` (`style.css` L4776+) disabilita animazioni e forza `.reveal`/`.animate-in` visibili | **Buona pratica** |
| TP-I20 | Video: con reduced motion, autoplay rimosso e `controls` aggiunti (`main.js` L118–122) | OK |

### Media — dimensioni e formato

| File | Dimensione | Uso |
|------|------------|-----|
| `touchlabs-showreel.mp4` | 72 MB | Non referenziato in HTML (asset morto?) |
| `touchlabs-showreel-compressed.mp4` | 28 MB | Home + portfolio showreel |
| `touchlabs-showreel.webm` | 18 MB | Home + portfolio |
| `configuratore_clubhouse/configuratore.mp4` | 35 MB | Non referenziato in HTML |
| `br1ng/br1ng.mp4` | 8.2 MB | Hero + portfolio, **solo MP4** (no webm) |
| `nottetempo/nottetempo.mp4` | 6 MB | Portfolio, solo MP4 |
| `itm-monoblock/*` | 1.9–3.2 MB | Portfolio — webm + mp4 compresso ✓ |
| `surgeree/surgeree-demo-*` | 5–5.8 MB | Case study — webm + compresso ✓ |
| `img/projects/labirinto/labirinto.mp4` | 14 MB | Path insolito (video in cartella img) |

| ID | Problema | Proposta |
|----|----------|----------|
| TP-I21 | Asset video non usati occupano spazio repo/deploy | Rimuovere o escludere da deploy se non necessari |
| TP-I22 | `br1ng.html` hero + portfolio video senza `poster` | Aggiungere poster (es. `hero.jpg`) |
| TP-I23 | Portfolio `#bring` video senza `poster` | Aggiungere `poster="/assets/img/projects/br1ng/hero.jpg"` |
| TP-I24 | Alcuni video solo MP4 | Aggiungere WebM dove manca (br1ng, nottetempo) per browser che lo preferiscono |

### Preload e lazy loading

| ID | Stato |
|----|--------|
| TP-I25 | Immagini galleria: `loading="lazy"` diffuso ✓ |
| TP-I26 | Video: `preload="metadata"` — corretto per non scaricare tutto subito |
| TP-I27 | Font Google: `preconnect` presente; nessun `preload` font — accettabile |
| TP-I28 | Nessun `<link rel="preload">` per hero LCP (immagine/video) — opportunità su home |

### Core Web Vitals — rischi stimati

| Metrica | Rischio | Causa |
|---------|---------|--------|
| **LCP** | Alto su home/portfolio | Showreel video hero, font esterni |
| **INP** | Basso | Sito statico, pochi listener |
| **CLS** | Medio-basso | Video con poster aiutano; hero video senza poster (br1ng) peggiorano |
| **TBT** | Medio | `main.js` leggero; molti video IO su portfolio |

---

## Opzionali

| ID | Problema | File |
|----|----------|------|
| TP-O1 | `labirinto.mp4` in `img/projects/` | Spostare in `assets/video/` per coerenza |
| TP-O2 | GIF galleria LLG 934 KB | Convertire in video o WebP animato |
| TP-O3 | Service worker / caching | Non presente — valutare post-lancio |
| TP-O4 | Minificazione CSS/JS | File singoli non minificati — impatto modesto su nginx gzip |
| TP-O5 | `digital-experience.html` img con classe `spatial-case-video__player` | Semantica HTML confusa (img vs video) |

---

## Comportamento senza JavaScript — riepilogo

| Funzione | Senza JS |
|----------|----------|
| Navigazione desktop | OK |
| Menu mobile | **Non funziona** |
| Scroll reveal / hero animate-in | **Contenuto invisibile** |
| Form submit | **Bloccato** (preventDefault richiede JS attivo) |
| Showreel autoplay | Dipende da attributi HTML — parziale |
| Parallax Surgeree | Disabilitato (OK) |

---

## Checklist test consigliata

1. Lighthouse su `index.html`, `portfolio.html`, `contatti.html` (mobile)  
2. axe DevTools su form contatti e navigazione tastiera completa  
3. Network throttling 3G — tempo caricamento portfolio  
4. Disabilitare JS in Chrome — verificare leggibilità  
5. `prefers-reduced-motion: reduce` — video e animazioni  
6. Invio form dopo integrazione backend
