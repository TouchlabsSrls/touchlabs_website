# P0 Final Validation — Touchlabs

**Data:** 9 luglio 2026  
**Ambiente:** Docker locale `http://localhost:8084`  
**Scope:** verifica e hardening P0 — nessuna attività P1/P2/P3

---

## Esito globale

| Area | Stato | Go-live |
|------|--------|---------|
| No-JS / navigazione | ✅ OK | Pronto |
| Portfolio / Nottetempo / ITM | ✅ OK | Pronto |
| Redirect 301 | ✅ OK | Pronto (replicare nginx in produzione) |
| Font self-hosted | ✅ OK | Pronto |
| Form contatti | ⚠️ Parziale | **Bloccato** fino a SMTP + test reale |
| Privacy / Cookie | 🔒 Bloccato | Validazione legale + dati societari |
| Performance asset | ⚠️ Note aperte | Non bloccante P0 |
| Responsive smoke | ⚠️ Parziale | Verifica browser manuale consigliata |

### Autorizzazione a procedere con P1

**NO** — restano aperti:
1. Configurazione SMTP e test invio reale
2. Validazione legale `privacy.html` / `cookie.html`
3. Dati societari in `docs/TODO_COMPANY_DATA.md`

---

## 1. Form contatti

Dettaglio: [CONTACT_FORM_TEST.md](./CONTACT_FORM_TEST.md)

**Hardening in questa sessione:**
- IP dietro proxy (`X-Forwarded-For`, `X-Real-IP`)
- From obbligatorio `@touchlabs.it`
- Errori SMTP non esposti
- Log senza PII
- Fix crash loop nginx (redirect inline in `docker/nginx.conf`)

**Test API (senza SMTP):** 422 validazione, honeypot, 503 senza falso successo — tutti PASS.

---

## 2. Google Fonts → self-hosted

| Verifica | Esito |
|----------|--------|
| Font scaricati in `public/assets/fonts/` | ✅ Manrope + Plus Jakarta Sans (woff2) |
| `@font-face` in `public/assets/css/fonts.css` | ✅ `font-display: swap` |
| Rimossi preconnect/stylesheet Google | ✅ 0 riferimenti in HTML |
| `fonts.css` servito | HTTP 200 |
| Richieste a fonts.googleapis.com / gstatic | **0** in HTML e fonts.css |

Tipografia invariata (stessi family e pesi).

---

## 3. Redirect `configuratori-3d.html`

| Test | Esito |
|------|--------|
| `HTTP 301` | ✅ |
| `Location: .../digital-experience.html` | ✅ (con `Host: localhost:8084`) |
| Nessun redirect JavaScript | ✅ rimosso da `configuratori-3d.html` |
| Nessun meta refresh | ✅ rimosso |
| Catena redirect | ✅ singolo hop |
| Link interni a `configuratori-3d` | ✅ 0 nel sito |
| `sitemap.xml` | ✅ esclude vecchio URL |
| `robots.txt` | ✅ `Disallow: /configuratori-3d.html` |

**Fix applicato:** nginx redirect usa `$http_host` per preservare la porta in locale.

---

## 4. ITM Monoblock

| Verifica | Esito |
|----------|--------|
| `digital-experience.html#itm-monoblock` | ✅ `id="itm-monoblock"` presente |
| Nome progetto | ✅ ITM Monoblock |
| Descrizione | ✅ video CGI industriale / fiere B2B |
| Video + poster | ✅ webm + mp4, `video-poster.jpg` |
| Case study completo | ✅ non creato (corretto) |
| Conteggio case study portfolio | ✅ 6 (ITM escluso) |

---

## 5. Privacy e dati societari

| Elemento | Stato |
|----------|--------|
| `docs/TODO_COMPANY_DATA.md` | ✅ aggiornato (9 campi mancanti + blocco legale) |
| `privacy.html` marker validazione | 🔒 presenti — **non definitiva** |
| `cookie.html` marker validazione | 🔒 presente — **non definitiva** |
| P.IVA / ragione sociale in footer | ❌ non inventati (corretto) |

---

## 6. Smoke test pagine (HTTP + struttura)

Tutte **HTTP 200** su localhost:8084:

- index.html
- chi-siamo.html
- servizi.html
- portfolio.html
- innovation-hub.html
- contatti.html
- spatial-computing.html
- ai-applicata.html
- software-custom.html
- digital-experience.html
- surgeree.html
- nottetempo.html

**Viewport 1440→360:** non testati con browser automatizzato in questa sessione. Analisi statica CSS:
- Breakpoint navbar mobile: `max-width: 1024px`
- Fallback no-JS nav: `html:not(.js)` regole presenti
- Form contatti: layout responsive esistente (`form-row` collapse)

**Verifica manuale consigliata** sui 6 viewport indicati prima del go-live.

**JavaScript disabilitato:** contenuto `.reveal`/`.animate-in` visibile per default; menu mobile espone link (no toggle).

**Console JS:** non strumentata in CI; nessun errore evidente da analisi statica di `main.js`.

---

## 7. Performance e asset

| Controllo | Esito |
|-----------|--------|
| Showreel solo in home | ✅ |
| Poster su video principali | ⚠️ **Mancanti:** `br1ng.html` hero video, `portfolio.html` `#bring` video |
| Video >10 MB non referenziati | ⚠️ `touchlabs-showreel.mp4` (72 MB), `configuratore_clubhouse` (35 MB) — non in HTML |
| Portfolio autoplay video | 5 istanze (nota performance, non fix P0) |
| Lazy loading immagini galleria | ✅ diffuso |
| `preload="metadata"` su video | ✅ prevalente |
| Asset 404 su link interni campione | ✅ nessuno rilevato |
| Google Fonts esterni | ✅ rimossi |

**Non compressi** file già in uso (come da istruzione).

---

## 8. Problemi risolti in questa sessione

1. Crash loop nginx (redirects.conf come file separato in `conf.d/`)
2. Redirect 301 senza porta su localhost
3. Esposizione errori SMTP all'utente
4. Rate limit / IP senza supporto proxy
5. Google Fonts → self-hosted
6. Meta refresh su `configuratori-3d.html`

---

## 9. Problemi ancora aperti (P0)

| ID | Problema | Azione |
|----|----------|--------|
| O1 | SMTP non configurato | Compilare `api/.env`, test invio reale |
| O2 | Rate limit non testato end-to-end | Dopo SMTP funzionante |
| O3 | Privacy/cookie non definitive | Revisione legale + dati societari |
| O4 | Poster mancanti video b-r1ng | Fix minimo consigliato pre-lancio (non P1) |
| O5 | Asset video morti in repo | Escludere da deploy o rimuovere |
| O6 | Test responsive browser | QA manuale 6 viewport |

---

## 10. Configurazioni manuali mancanti

1. `api/.env` — credenziali SMTP produzione
2. Dati in `docs/TODO_COMPANY_DATA.md`
3. Blocco nginx produzione da `docs/deployment/nginx-redirects.conf`
4. Validazione legale privacy/cookie
5. Test invio email reale + Reply-To

---

## 11. URL da verificare in staging/produzione

- https://www.touchlabs.it/
- https://www.touchlabs.it/portfolio.html
- https://www.touchlabs.it/nottetempo.html
- https://www.touchlabs.it/digital-experience.html#itm-monoblock
- https://www.touchlabs.it/contatti.html
- https://www.touchlabs.it/configuratori-3d.html → 301
- https://www.touchlabs.it/sitemap.xml
- https://www.touchlabs.it/assets/css/fonts.css
- POST https://www.touchlabs.it/api/contact.php

---

## Script di verifica

```bash
docker compose up -d
bash scripts/test-contact-form.sh http://localhost:8084
python3 scripts/p0-validate.py http://localhost:8084
```
