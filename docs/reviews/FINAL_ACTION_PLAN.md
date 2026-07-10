# Final Action Plan — Touchlabs

**Data aggiornamento:** 29 giugno 2026  
**Stato:** P0 completato (tecnico) · **P1 implementato** (Fase 1 + Fase 2) · Go-live bloccato dai LAUNCH BLOCKER

---

## P0 — LAUNCH BLOCKER ANCORA APERTI

Queste attività restano **obbligatorie prima del go-live**. Non sono complete.

| # | Attività | Responsabile | Riferimento |
|---|----------|--------------|-------------|
| LB-1 | **Configurazione SMTP e test reale del form** | Ops / backend | `api/.env`, `docs/deployment/CONTACT_FORM_SETUP.md` |
| LB-2 | **Inserimento dati societari definitivi** | Azienda | `docs/TODO_COMPANY_DATA.md` |
| LB-3 | **Validazione legale Privacy Policy e Cookie Policy** | Legale | `public/privacy.html`, `public/cookie.html` |
| LB-4 | **QA manuale finale browser e viewport** | QA | 6 viewport — vedi `P1_SMOKE_TEST.md` |
| LB-5 | **Replica configurazione nginx in produzione** | Ops | `docs/deployment/nginx-redirects.conf`, `docs/deployment/REDIRECT_MAP.md` |

---

## P1 — Stato implementazione

| ID | Titolo | Stato | Note |
|----|--------|-------|------|
| P1-1 | Showreel home | ✅ | Master 72 MB in `assets-source/video/`; deploy usa WebM + MP4 compresso; nessun re-encoding |
| P1-2 | Portfolio video | ✅ | `data-portfolio-video` + `initPortfolioVideos()` |
| P1-3 | Snellire spatial-computing | ✅ | −22% righe; invest + Nottetempo narrativo rimossi; teaser portfolio |
| P1-4 | Rimuovere 9 service cards home | ✅ | CTA «Scopri tutti i servizi» |
| P1-5 | Identità home sintetica | ✅ | Frase + «La nostra storia» |
| P1-6 | Innovation Hub fonte principale | ✅ | Teaser su Home e Chi siamo |
| P1-7 | CTA per ruolo | ✅ | Navbar/finali contatti allineati; landing compatte «Parliamone» mantenute |
| P1-8 | OG raster hub | ✅ | `og-image.jpg` 1200×630 |
| P1-9 | JSON-LD indirizzo | ✅ | `streetAddress` verificato |
| P1-10 | JSON-LD ITM | ⛔ Annullata | — |
| P1-11 | Poster b-r1ng | ✅ | Hero + gallery + portfolio |
| P1-12 | `--radius-xl` | ✅ | 20px in `:root` |
| P1-13 | Token hero case study | ✅ | Token famiglie + `HERO_LAYOUT_EXCEPTIONS.md` |
| P1-14 | REDIRECT_MAP | ✅ | Solo redirect verificato documentato |
| V-001 | Overflow portfolio mobile | ✅ | `style.css` — min-height unset + contain grid |
| V-016 | Icona play mobile portfolio | ✅ | `.portfolio-video-play` in `main.js` + CSS |
| — | Footer globale (2 livelli) | ✅ | Blocco company rimosso; 18 pagine allineate |

**Smoke test:** [P1_SMOKE_TEST.md](./P1_SMOKE_TEST.md)

---

## P1 — Attività non eseguite / residui

| Voce | Motivo |
|------|--------|
| Re-encoding showreel | Peso attuale (WebM 18 MB) già accettabile; qualità non degradata |
| Redirect legacy Joomla aggiuntivi | Nessun traffico verificato — vedi `REDIRECT_MAP.md` § Legacy |
| Riduzione spatial-computing al −30% | Raggiunto −22%; ulteriore taglio richiederebbe compromesso su applicazioni/settori |
| QA browser 6 viewport | LAUNCH BLOCKER LB-4 |

---

## P2 / P3

**Non implementati.** Non avviare senza nuova approvazione.

---

## Documenti correlati

- [P1_SMOKE_TEST.md](./P1_SMOKE_TEST.md)
- [HERO_LAYOUT_EXCEPTIONS.md](./HERO_LAYOUT_EXCEPTIONS.md)
- [REDIRECT_MAP.md](../deployment/REDIRECT_MAP.md)
- [P0_FINAL_VALIDATION.md](./P0_FINAL_VALIDATION.md)
