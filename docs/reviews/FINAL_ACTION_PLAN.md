# Final Action Plan — Touchlabs

**Data aggiornamento:** 9 luglio 2026 (validazione P0)  
**Stato:** P0 implementato e verificato — **non pronto per P1**

---

## Esito validazione P0

Vedi report completo: **[P0_FINAL_VALIDATION.md](./P0_FINAL_VALIDATION.md)**  
Form test: **[CONTACT_FORM_TEST.md](./CONTACT_FORM_TEST.md)**

| Esito | N. |
|-------|-----|
| ✅ Completate e verificate | 8 |
| ⚠️ Parziali | 3 |
| 🔒 Bloccate (esterne) | 2 |

### Autorizzazione P1

**NON AUTORIZZATO** finché non sono risolti:
- SMTP + test invio reale form
- Validazione legale privacy/cookie
- Dati societari (`docs/TODO_COMPANY_DATA.md`)

---

## P0 — Stato aggiornato post-validazione

| ID | Attività | Stato | Note validazione |
|----|----------|-------|------------------|
| P0-1 | Form contatti | ⚠️ Parziale | API hardened; test 422/503/honeypot OK; **SMTP mancante** |
| P0-2 | Privacy Policy | 🔒 Bloccata | Pagina con marker validazione — non definitiva |
| P0-3 | Cookie policy | ✅ / 🔒 | Self-hosted fonts; marker legale ancora presente |
| P0-4 | sitemap.xml | ✅ | 18 URL, esclude configuratori-3d |
| P0-5 | robots.txt | ✅ | Disallow configuratori-3d |
| P0-6 | Redirect 301 | ✅ | Verificato HTTP 301; nginx fix applicato |
| P0-7 | Portfolio conteggi | ✅ | 6 case study + showcase ITM |
| P0-8 | Nottetempo case study | ✅ | `nottetempo.html` + CTA portfolio |
| P0-9 | No-JS reveal | ✅ | Progressive enhancement verificato |
| P0-10 | Menu mobile no-JS | ✅ | Fallback CSS presente |

---

## Hardening aggiuntivo (sessione validazione)

- Font Google → **self-hosted** (`public/assets/fonts/`, `fonts.css`)
- Form: IP proxy, From `@touchlabs.it`, errori SMTP generici, log senza PII
- Nginx: fix crash loop redirect; `$http_host` nel 301
- `configuratori-3d.html`: rimosso meta refresh
- Inventario tracking aggiornato (no Google Fonts esterni)

---

## Dati e accessi mancanti

| Elemento | Riferimento |
|----------|-------------|
| Credenziali SMTP | `api/.env` |
| Ragione sociale, P.IVA, DPO, ecc. | `docs/TODO_COMPANY_DATA.md` |
| Revisione legale privacy/cookie | Marker in `privacy.html`, `cookie.html` |
| Test invio email reale | `CONTACT_FORM_TEST.md` §5–6 |
| QA responsive 6 viewport | `P0_FINAL_VALIDATION.md` §6 |

---

## Problemi aperti minori (non bloccanti P1 ma consigliati)

- Poster mancanti video b-r1ng (`br1ng.html`, `portfolio.html#bring`)
- Asset video non referenziati in repo (72 MB showreel originale)
- 5 video autoplay su portfolio (performance)

---

## P1 / P2 / P3

**Non implementati.** Restano in backlog. Non procedere senza approvazione esplicita post-chiusura blocchi P0 sopra.

---

## Prossimi passi

1. Fornire dati `TODO_COMPANY_DATA.md`
2. Configurare `api/.env` e testare invio reale
3. Revisione legale privacy/cookie
4. QA browser sui 6 viewport
5. Deploy nginx produzione con redirect 301
6. **Solo allora:** approvare avvio P1
