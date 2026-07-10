# P1 — Smoke test (Fase 1 + Fase 2 + fix V-001 / V-016)

**Data:** 10 luglio 2026  
**Ambiente:** `docker compose` → `http://localhost:8084`

---

## Fix post-review (10 lug 2026)

| ID | File | Esito |
|----|------|--------|
| V-001 | `style.css` (regole `.portfolio-showcase*`) | ✅ overflow mobile risolto @390/360 |
| V-016 | `style.css` + `main.js` (`.portfolio-video-play`) | ✅ icona play mobile; nascosta in riproduzione |

**Verifica automatica:** `node scripts/p1-portfolio-verify.mjs` → `docs/reviews/screenshots/p1-visual/portfolio/verify-v001-v016.json`

| Viewport | scrollWidth = clientWidth | Play mobile | Desktop video |
|----------|---------------------------|-------------|---------------|
| 1440×900 | ✅ 1440 | 0 bottoni | max 1 in play |
| 768×1024 | ✅ 768 | 5 visibili, tap ok | — |
| 390×844 | ✅ 390 | 5 visibili, tap ok | — |
| 360×800 | ✅ 360 | 5 visibili, tap ok | — |

Screenshot post-fix: `portfolio/{viewport}/verify-full.png`, `verify-bring.png`

---

## Pagine modificate

| Pagina | Interventi P1 |
|--------|----------------|
| `index.html` | P1-4, P1-5, P1-6, P1-8, P1-9, P1-7 (CTA hero) |
| `chi-siamo.html` | P1-6, P1-8 |
| `innovation-hub.html` | P1-8 (riferimento — contenuto invariato, fonte principale hub) |
| `servizi.html`, `contatti.html`, `portfolio.html` | P1-8 |
| `br1ng.html`, `portfolio.html#bring` | P1-11 |
| `spatial-computing.html` | P1-3, P1-7 |
| `portfolio.html` | P1-2, P1-11, V-001, V-016 |
| `assets/css/style.css` | P1-12, P1-13, V-001, V-016 |
| `assets/js/main.js` | P1-2, V-016 |
| `assets/img/brand/og-image.jpg` | P1-8 (nuovo) |
| `assets-source/video/` | P1-1 (master 72 MB fuori da `public/`) |
| `docs/deployment/REDIRECT_MAP.md` | P1-14 |

---

## HTTP smoke (curl)

| URL | Status |
|-----|--------|
| `/` | 200 |
| `/chi-siamo.html` | 200 |
| `/servizi.html` | 200 |
| `/portfolio.html` | 200 |
| `/innovation-hub.html` | 200 |
| `/spatial-computing.html` | 200 |
| `/br1ng.html` | 200 |
| `/surgeree.html` | 200 |
| `/assets/img/brand/og-image.jpg` | 200 (1200×630, ~31 KB) |

---

## Contenuti verificati

- Home: sezione «Cosa costruiamo» **assente**; CTA «Scopri tutti i servizi» **presente** dopo i 4 pilastri
- Home: about-brief sintetico + link «La nostra storia»
- Home / Chi siamo: teaser Innovation Hub con link (non rimossi)
- `spatial-computing.html`: sezione «Perché oggi conviene investire…» **assente**
- JSON-LD Home: `streetAddress: "Via Capo di Lucca 12"`
- Video b-r1ng: attributo `poster` su hero, gallery e portfolio
- `--radius-xl: 20px` definito in `:root` (progressione 8 → 12 → 16 → 20)

---

## Link

- CTA pilastri → `/servizi.html` ✅
- Teaser Innovation Hub → `/innovation-hub.html` ✅
- Teaser portfolio Spatial → case study dedicati ✅

---

## Console / JS

- Portfolio @4 viewport: **0 errori** `pageerror` (Playwright 10 lug 2026)
- `initPortfolioVideos()` + overlay `.portfolio-video-play` su mobile

---

## Responsive

- Portfolio overflow mobile: **risolto** (V-001)
- Resto sito: LB-4 ancora aperto per QA manuale completo

---

## Regressioni note

| Area | Valutazione |
|------|-------------|
| Impatto visivo Home | Riduzione sezione 9 card — **intenzionale**; pilastri + CTA servizi mantengono percorso |
| Spatial Computing | Lunghezza −22% (707→554 righe); sotto target indicativo −30% ma senza tagli al posizionamento commerciale |
| Showreel | Nessun re-encoding; WebM 18 MB + MP4 28 MB invariati; master 72 MB spostato in `assets-source/` |
| OG image | Raster JPG con logo; tipografia sistema (non Manrope) — accettabile per social preview |

---

## Non modificato (vincoli rispettati)

- Form, SMTP, `api/`, nginx produzione, privacy/cookie definitive, dati societari
- P2 / P3 non avviati
