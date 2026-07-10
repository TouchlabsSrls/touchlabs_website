# Release Candidate Locale — Touchlabs

**Data freeze:** 10 luglio 2026  
**Ambiente:** `http://localhost:8084/` (Docker nginx + PHP-FPM)  
**Stato:** RC locale — nessun deploy effettuato

---

## Commit e tag di riferimento

| Riferimento | Valore |
|-------------|--------|
| **Commit baseline RC** | `dc8bd8a` — *Implementa P1 completo e fix portfolio mobile V-001/V-016* |
| **Tag annotato** | `rc-local-2026-07-10` (punta a `dc8bd8a`) |
| **Branch** | `main` (allineato a `origin/main` al momento del freeze) |

> Il collaudo QA locale e il fix overflow cookie (post-freeze) sono documentati in [LOCAL_QA_FINAL.md](./LOCAL_QA_FINAL.md).

---

## Pagine presenti (`public/`)

19 file HTML:

| Pagina | Ruolo |
|--------|-------|
| `index.html` | Home |
| `chi-siamo.html` | Chi siamo |
| `servizi.html` | Hub servizi |
| `portfolio.html` | Portfolio progetti |
| `innovation-hub.html` | Innovation Hub |
| `contatti.html` | Contatti + form |
| `spatial-computing.html` | Pilastro Spatial Computing |
| `ai-applicata.html` | Pilastro AI |
| `software-custom.html` | Pilastro Software |
| `digital-experience.html` | Pilastro Digital Experience |
| `surgeree.html` | Case study Surgeree |
| `br1ng.html` | Case study b-r1ng® |
| `nottetempo.html` | Case study Nottetempo |
| `scattolini.html` | Case study Scattolini |
| `il-labirinto.html` | Case study Il Labirinto |
| `luxury-living-group.html` | Case study Luxury Living Group |
| `privacy.html` | Privacy policy |
| `cookie.html` | Cookie policy |
| `configuratori-3d.html` | Stub redirect → `digital-experience.html` (301 nginx locale) |

---

## Funzionalità implementate

### Navigazione e layout
- Navbar responsive con menu mobile (hamburger + `aria-expanded`)
- Skip link «Vai al contenuto principale» su tutte le pagine principali
- Footer con link Privacy e Cookie su ogni pagina
- Design system CSS (`style.css`), font self-hosted, token hero e `--radius-xl: 20px`

### Contenuti e CTA
- Home snellita: 4 pilastri, teaser Innovation Hub, showreel, fasce video
- Hub servizi con gateway verso i 4 pilastri
- Portfolio con showcase progetti, video viewport-aware, anchor interne
- Case study completi per i progetti principali
- CTA «Parliamo del tuo progetto» in navbar

### Media
- Showreel home (WebM + MP4 compresso; master 72 MB in `assets-source/video/`)
- Video breather con `IntersectionObserver` (pausa fuori viewport)
- Portfolio: max 1 video in play, tap-to-play mobile, overlay play (V-016)
- Poster su tutti i video hero principali

### Form contatti
- Validazione client-side (nome, email, messaggio, consenso privacy)
- API `POST /api/contact.php` con honeypot, rate limit, messaggi utente in italiano
- In locale senza SMTP: risposta **503** con messaggio comprensibile (nessun falso successo)

### SEO / metadata
- OG image raster `og-image.jpg` 1200×630
- JSON-LD Organization con `streetAddress`
- Canonical e meta description per pagina
- `docs/deployment/REDIRECT_MAP.md` per redirect verificati

### Accessibilità (base)
- `prefers-reduced-motion` rispettato (animazioni e autoplay video disabilitati)
- `Save-Data`: autoplay portfolio disabilitato, `controls` mostrati
- Label form, `aria-label` su video, heading gerarchici

---

## Launch blocker intenzionalmente aperti

| ID | Descrizione | Note |
|----|-------------|------|
| **LB-1** | SMTP e test invio reale form | `api/.env` non configurato in locale |
| **LB-2** | Dati societari definitivi | Vedi `docs/TODO_COMPANY_DATA.md` |
| **LB-3** | Validazione legale Privacy / Cookie | Testi con callout «da confermare» |
| **LB-4** | QA browser finale pre-go-live | Collaudo locale completato; smoke produzione ancora da fare |
| **LB-5** | Replica nginx produzione | Redirect e SSL su server reale |

---

## Attività P1 completate

| ID | Titolo | Stato |
|----|--------|-------|
| P1-1 | Showreel home | ✅ Master fuori `public/` |
| P1-2 | Portfolio video viewport | ✅ `initPortfolioVideos()` |
| P1-3 | Snellire spatial-computing | ✅ −22% righe |
| P1-4 | Rimuovere 9 service cards home | ✅ |
| P1-5 | Identità home sintetica | ✅ |
| P1-6 | Innovation Hub fonte principale | ✅ |
| P1-7 | CTA per ruolo | ✅ |
| P1-8 | OG raster hub | ✅ |
| P1-9 | JSON-LD indirizzo | ✅ |
| P1-11 | Poster b-r1ng | ✅ |
| P1-12 | `--radius-xl` 20px | ✅ |
| P1-13 | Token hero case study | ✅ |
| P1-14 | REDIRECT_MAP | ✅ |
| V-001 | Overflow portfolio mobile | ✅ |
| V-016 | Icona play mobile portfolio | ✅ |

**Non implementati / fuori scope:** P2, P3, P1-10 (annullata), deploy produzione.

---

## Script di collaudo

```bash
node scripts/local-qa-audit.mjs
```

Output: `docs/reviews/local-qa-audit.json`

---

## Documenti correlati

- [LOCAL_QA_FINAL.md](./LOCAL_QA_FINAL.md) — report collaudo e priorità fix
- [UNUSED_ASSETS.md](./UNUSED_ASSETS.md) — asset non referenziati
- [FINAL_ACTION_PLAN.md](./FINAL_ACTION_PLAN.md) — piano P0/P1/LB
- [P1_SMOKE_TEST.md](./P1_SMOKE_TEST.md)
- [P1_VISUAL_REVIEW.md](./P1_VISUAL_REVIEW.md)
