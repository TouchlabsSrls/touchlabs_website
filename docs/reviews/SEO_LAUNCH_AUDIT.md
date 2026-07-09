# SEO & Launch Audit — Touchlabs

**Agente:** SEO & Launch QA  
**Data:** 9 luglio 2026  
**Scope:** 16 HTML, `docker-compose.yml`, assenza file root SEO/legal  
**Stato:** Solo analisi — nessuna modifica applicata

---

## Sintesi esecutiva

Meta title e description sono **unici e ben scritti** su tutte le pagine contenuto. Canonical e Open Graph sono presenti. Mancano però **elementi obbligatori per il go-live**: Privacy Policy, Cookie Policy, banner cookie, `sitemap.xml`, `robots.txt`, redirect server-side da URL legacy, e **allineamento dati strutturati** (portfolio 6 vs 7 progetti, NAP incompleto su home). Il form contatti non invia dati — impatto diretto sulla conversione e sulla compliance del consenso.

---

## Bloccanti

| ID | Elemento | File / path | Problema | Proposta |
|----|----------|-------------|----------|----------|
| SL-B1 | Privacy Policy | — | **Pagina assente**; commento placeholder in `contatti.html` L210 | Creare `privacy.html` + link nel form e footer |
| SL-B2 | Cookie Policy | — | **Pagina assente** | Creare `cookie.html` + link footer |
| SL-B3 | Cookie banner | — | **Assente** — necessario se si usano analytics/embed (es. Google Maps su contatti) | Implementare banner con consenso granulare |
| SL-B4 | `sitemap.xml` | `public/sitemap.xml` | **File mancante** | Generare con tutte le URL indicizzabili (escludere redirect) |
| SL-B5 | `robots.txt` | `public/robots.txt` | **File mancante** | `Allow: /` + `Sitemap: https://www.touchlabs.it/sitemap.xml` |
| SL-B6 | Form contatti | `contatti.html`, `main.js` | Form non funzionante — **nessuna lead** | Integrazione backend (stesso item TP-B1) |
| SL-B7 | Redirect legacy | `configuratori-3d.html` | Solo meta refresh + JS; canonical punta a destinazione | **301 nginx** da `/configuratori-3d.html` → `/digital-experience.html` |

---

## Importanti

### Title e meta description

| Pagina | Title | Stato |
|--------|-------|-------|
| `index.html` | Touchlabs — Software house Bologna \| … | ✓ Unico |
| `chi-siamo.html` | Chi siamo — Touchlabs \| … | ✓ |
| `servizi.html` | Servizi — Touchlabs \| … | ✓ |
| `portfolio.html` | Portfolio — Touchlabs \| … | ✓ |
| `contatti.html` | Contatti — Touchlabs \| … | ✓ |
| `innovation-hub.html` | Innovation Hub — Touchlabs \| … | ✓ |
| 4 landing servizi | Distinti | ✓ |
| 5 case study | Distinti | ✓ |
| `configuratori-3d.html` | Reindirizzamento — Digital Experience | Da non indicizzare (noindex o 301) |

| ID | Pagina | Problema | Proposta |
|----|--------|----------|----------|
| SL-I1 | `portfolio.html` | Meta description elenca **6 progetti** (manca ITM Monoblock) | Aggiornare testo meta + OG description (“Sette progetti…”) |
| SL-I2 | `portfolio.html` | OG description: “Sei progetti reali” | Allineare a 7 o ridefinire conteggio |
| SL-I3 | `portfolio.html` L135 | Hero subtitle: “Sei case study” vs 7 entry | Allineare copy (UX-B1) |

### H1 e gerarchia heading

| ID | Esito |
|----|-------|
| SL-I4 | **Un solo H1 per pagina** su tutte le pagine contenuto ✓ |
| SL-I5 | `configuratori-3d.html` senza H1 — irrilevante se 301 |
| SL-I6 | Gerarchia H2/H3 coerente su hub e case study — nessun salto critico rilevato |

### Canonical

| ID | Esito |
|----|-------|
| SL-I7 | Canonical presente su tutte le pagine con `https://www.touchlabs.it/...` ✓ |
| SL-I8 | `configuratori-3d.html` canonical → `digital-experience.html` ✓ (corretto) |
| SL-I9 | Home canonical `https://www.touchlabs.it/` — verificare redirect www/non-www e trailing slash in produzione |

### Open Graph

| ID | Problema | Proposta |
|----|----------|----------|
| SL-I10 | Hub (`index`, `portfolio`, `servizi`, ecc.) usano `og-image.svg` | Sostituire con **raster 1200×630** (JPG/PNG) per compatibilità social |
| SL-I11 | Case study hanno immagini progetto dedicate | ✓ Buona pratica |
| SL-I12 | `digital-experience.html` OG image = Surgeree gallery | Usare asset più pertinente (Scattolini o hero DE) |
| SL-I13 | Twitter Card: solo `twitter:card` su molte pagine | Aggiungere `twitter:title`, `twitter:description`, `twitter:image` come su `index.html` |

### JSON-LD

| Pagina | Tipo | Note |
|--------|------|------|
| `index.html` | Organization | Manca `streetAddress` (solo locality) |
| `contatti.html` | ContactPage + Organization | **NAP completo** (Via Capo di Lucca 12) ✓ |
| `portfolio.html` | CollectionPage + ItemList | **6 item** — manca ITM Monoblock |
| Case study | Organization (publisher) + CreativeWork | Presente |
| Landing servizi | Service / WebPage | Presente dove verificato |

| ID | Problema | Proposta |
|----|----------|----------|
| SL-I14 | Organization su home senza indirizzo completo | Allineare a `contatti.html` (streetAddress, postalCode se disponibile) |
| SL-I15 | Portfolio ItemList 6 posizioni | Aggiungere ITM Monoblock come position 7 |
| SL-I16 | Nessun `telephone` in schema | Aggiungere se esiste numero aziendale; altrimenti omettere consapevolmente |
| SL-I17 | Nessun `LocalBusiness` / `ProfessionalService` | Valutare tipo più specifico per local SEO Bologna |

### Internal linking

| ID | Esito / problema |
|----|------------------|
| SL-I18 | Menu e footer coerenti su tutte le pagine ✓ |
| SL-I19 | Footer “Integrazioni ERP” e “Supporto” → `servizi.html` (non anchor specifici) | Accettabile; opzionale anchor `#` su servizi |
| SL-I20 | Portfolio → case study con link diretti ✓ |
| SL-I21 | Nottetempo CTA → `spatial-computing.html#nottetempo` (non case study) | Confonde IA e snippet — rinominare o creare pagina |
| SL-I22 | ITM senza pagina dedicata — solo showcase portfolio | OK se voluto; JSON-LD e meta devono rifletterlo |

### URL e redirect dal vecchio sito

| ID | Problema | Proposta |
|----|----------|----------|
| SL-I23 | Solo `configuratori-3d.html` → `digital-experience.html` documentato | **Mappatura redirect 301** da vecchie URL touchlabs.it (audit log server / Search Console) |
| SL-I24 | Deploy nginx (`docker-compose.yml`) serve solo static files | Aggiungere `nginx.conf` con regole redirect e gzip/brotli |
| SL-I25 | Nessun `hreflang` | Sito solo IT — non necessario |

### Local SEO Bologna

| ID | Elemento | Stato |
|----|----------|-------|
| SL-I26 | “Bologna” in title home, eyebrow, subtitle | ✓ |
| SL-I27 | Footer: “Bologna, Italia” su tutte le pagine | ✓ |
| SL-I28 | Indirizzo completo visibile | Solo su **`contatti.html`** |
| SL-I29 | Google Maps embed su contatti | Presente — verificare caricamento solo post-consenso cookie |
| SL-I30 | Schema address completo | Solo contatti + parziale home |

### Pagine legali e footer

| ID | Problema | Proposta |
|----|----------|----------|
| SL-I31 | Footer: solo copyright, **nessun link Privacy/Cookie** | Aggiungere riga legale in `.footer__bottom` |
| SL-I32 | Form: testo privacy senza link | Collegare a `privacy.html` + checkbox consenso se richiesto dal DPO |
| SL-I33 | P.IVA / ragione sociale in footer | **Assente** — aggiungere se obbligatorio per società IT |

### Coerenza menu / footer / pagine pubblicate

| Voce menu | Pagina esiste | Footer |
|-----------|---------------|--------|
| Home | ✓ | — |
| Chi siamo | ✓ | ✓ |
| Servizi | ✓ | ✓ (sotto-voci) |
| Portfolio | ✓ | ✓ |
| Innovation Hub | ✓ | ✓ |
| Contatti | ✓ | ✓ |
| Privacy / Cookie | ✗ | ✗ |

---

## Opzionali

| ID | Proposta |
|----|----------|
| SL-O1 | `og:site_name` già presente — aggiungere `og:image:secure_url` se HTTPS |
| SL-O2 | BreadcrumbList JSON-LD su case study e landing |
| SL-O3 | `FAQPage` schema dove esistono FAQ (landing servizi) |
| SL-O4 | Registrare proprietà Google Search Console pre-lancio |
| SL-O5 | File `humans.txt` o `security.txt` — non necessari |

---

## Inventario URL per sitemap (bozza)

Indicizzabili (15):
- `/` (index.html)
- `/chi-siamo.html`
- `/servizi.html`
- `/portfolio.html`
- `/contatti.html`
- `/innovation-hub.html`
- `/spatial-computing.html`
- `/ai-applicata.html`
- `/software-custom.html`
- `/digital-experience.html`
- `/surgeree.html`
- `/scattolini.html`
- `/luxury-living-group.html`
- `/il-labirinto.html`
- `/br1ng.html`

Escludere:
- `/configuratori-3d.html` (redirect)

---

## Checklist pre-lancio SEO

- [ ] Privacy + Cookie policy pubblicate e linkate
- [ ] Banner cookie operativo
- [ ] sitemap.xml + robots.txt
- [ ] 301 server-side URL legacy
- [ ] Form contatti funzionante
- [ ] Meta portfolio allineati a 7 progetti
- [ ] JSON-LD portfolio + Organization NAP
- [ ] OG image raster per hub
- [ ] Verifica Search Console post-deploy
