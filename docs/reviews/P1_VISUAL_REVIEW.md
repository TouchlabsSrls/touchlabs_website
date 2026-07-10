# P1 — Visual Review (solo analisi)

**Data:** 10 luglio 2026  
**Ambiente analizzato:** `http://localhost:8084/`  
**Metodo:** Playwright headless (6 viewport × 8 pagine) + ispezione screenshot + test comportamento video portfolio  
**Screenshot:** `docs/reviews/screenshots/p1-visual/{pagina}/{viewport}/`

> **Nota metodologica:** gli screenshot `full-page.png` catturano elementi `.reveal` prima dello scroll senza classe `is-visible` (opacity 0). Possono mostrare **fasce bianche vuote** che **non** corrispondono all’esperienza reale dopo lo scroll. Per la review si sono usati `above-fold.png`, `section-XX.png` e capture con reveal forzato dove necessario.

---

## Sintesi esecutiva

| Pagina | Lunghezza percepita (desktop) | Ritmo | Impatto commerciale | Priorità intervento |
|--------|------------------------------|-------|---------------------|---------------------|
| Home | Media-alta (~8,9 viewport @1440) | Buono | Pilastri solidi; CTA servizi discreta | Rifiniture |
| Spatial Computing | Alta (~12 viewport) | Buono; mobile molto lunga | Autorevole; −22% **visivamente sufficiente** | Nessun taglio testo; mobile spacing |
| Portfolio | Alta ma giustificata | Buono desktop; overflow mobile | Case study / ITM distinguibili | **Bug responsive** |
| Chi siamo | Media | Buono | Identità chiara | Opzionale |
| Innovation Hub | Media-alta | Buono | Coerente come fonte principale | Opzionale |
| Surgeree | Alta (case study) | Buono | Hero split efficace | Opzionale |
| b-r1ng | Media-alta | Buono | Poster/video hero ok | Opzionale |
| Nottetempo | Compatta | Buono | Hero centrata leggibile | Nessuna |

**Spatial Computing:** non si raccomandano ulteriori tagli al copy. La riduzione attuale è **già sufficiente** sul piano visivo desktop; su mobile la pagina resta lunga per natura (6 applicazioni + settori + demo + portfolio + metodo + FAQ).

**Video portfolio (P1-2):** comportamento conforme ai requisiti (vedi § Portfolio).

---

## Verifiche P1 confermate (localhost)

| Controllo | Esito |
|-----------|--------|
| Home: 9 service card rimosse | ✅ |
| Home: «Scopri tutti i servizi» presente | ✅ (link testuale sotto pilastri) |
| Spatial: sezione «Perché oggi conviene investire…» | ✅ assente |
| Spatial: blocco narrativo esteso Nottetempo | ✅ assente |
| Portfolio: `data-portfolio-video` | ✅ 5 video |
| b-r1ng: poster | ✅ |
| Overflow orizzontale globale | ⚠️ solo Portfolio @390/360 |

---

## Test video Portfolio (automated)

| Scenario | Risultato |
|----------|-----------|
| Desktop @1440 — video in cima pagina | 0 in riproduzione ✅ |
| Desktop — scroll a `#bring` | 1 solo video (b-r1ng) in play ✅ |
| Desktop — ritorno in cima | 0 in riproduzione ✅ |
| Mobile @390 — caricamento | 0 autoplay ✅ |
| Mobile — tap su b-r1ng | `paused: false`, `playsInline: true`, poster ok ✅ |

---

## Altezze scroll (proxy lunghezza percepita)

| Pagina | 1440×900 | 390×844 |
|--------|----------|---------|
| index | 7 914 px (~8,8× viewport) | 11 131 px |
| spatial-computing | 10 880 px (~12×) | 15 589 px |
| portfolio | 7 924 px | 10 208 px |
| chi-siamo | 6 503 px | 9 341 px |
| innovation-hub | 7 650 px | 13 733 px |
| surgeree | 10 643 px | 13 785 px |
| br1ng | 9 812 px | 11 599 px |
| nottetempo | 6 120 px | 6 042 px |

---

# Bug evidenti

### V-001 — Portfolio: overflow orizzontale mobile — **RISOLTO** (10 lug 2026)

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `portfolio.html` |
| **Viewport** | 390×844, 360×800 |
| **Causa** | `min-height` su `.portfolio-showcase__video` (280–420px) con `aspect-ratio: 16/9` forzava larghezza ~498px in colonna singola |
| **Fix** | Regole localizzate: `min-width: 0`, `max-width: 100%`, `min-height: unset` sotto 1024px; aspect-ratio sul wrapper |
| **Verifica** | `scrollWidth === clientWidth` su 390 e 360 — vedi `portfolio/verify-v001-v016.json` |
| **Screenshot** | `portfolio/390x844/verify-full.png`, `portfolio/360x800/verify-full.png` |

---

# Problemi responsive

### V-002 — Spatial Computing: lunghezza eccessiva su mobile

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `spatial-computing.html` |
| **Viewport** | 390×844, 360×800 |
| **Sezione** | Pagina intera |
| **Problema** | ~15,6k px di scroll (~18× viewport). Non è un bug di layout, ma la **percezione di lunghezza** su mobile è elevata (applicazioni 3×2 + settori 3×2 + demo video + portfolio + metodo + FAQ) |
| **Gravità** | **Media** |
| **Correzione consigliata** | **Nessun taglio testo** per ora. Valutare solo rifiniture spacing (padding sezioni, gap card) o accordion FAQ su mobile in fase estetica successiva |
| **Screenshot** | `spatial-computing/390x844/full-page.png` |
| **Rischio modifica** | Medio se si taglia copy; basso se solo spacing |

### V-003 — Index / pagine lunghe: stacking mobile dei pilastri

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `index.html` |
| **Viewport** | 390×844 |
| **Sezione** | Quattro pilastri |
| **Problema** | I 4 pilastri in colonna aumentano lo scroll (~11k px totali). Comportamento atteso; peso commerciale ok ma sequenza lunga prima di Surgeree/Innovation Hub |
| **Gravità** | **Bassa** |
| **Correzione consigliata** | Nessuna obbligatoria; opzionale riduzione padding `feature-grid` su mobile |
| **Screenshot** | `index/390x844/section-05.png` |
| **Rischio modifica** | Basso |

---

# Problemi di spaziatura

### V-004 — Home: CTA «Scopri tutti i servizi» poco prominente

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `index.html` |
| **Viewport** | 1440×900, 1024×768 |
| **Sezione** | Pilastri → `.section-footer` |
| **Problema** | La CTA è un solo `link-arrow` centrato sotto le card, senza bottone né separatore visivo forte. Funzionale ma **visivamente timida** rispetto ai quattro «Approfondisci» nelle card |
| **Gravità** | **Media** |
| **Correzione consigliata** | Aggiungere `margin-top` più marcato o secondo stile (es. `btn btn--secondary` compatto) — **solo in fase estetica approvata** |
| **Screenshot** | `index/1440x900/section-05.png`, `index/1440x900/section-06.png` |
| **Rischio modifica** | Basso |

### V-005 — Home: doppia CTA in hero ravvicinata

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `index.html` |
| **Viewport** | Tutti desktop |
| **Sezione** | Hero |
| **Problema** | «Scopri i nostri servizi» (primary) + «Parliamo del tuo progetto» (secondary) affiancati; navbar ha già «Parliamo del tuo progetto» |
| **Gravità** | **Bassa** |
| **Correzione consigliata** | Valutare se hero secondario può restare solo «Parliamo…» o invertire gerarchia — coerenza ruoli P1-7 già rispettata |
| **Screenshot** | `index/1440x900/above-fold.png` |
| **Rischio modifica** | Basso |

### V-006 — Spatial: gap tra service-nav e intro

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `spatial-computing.html` |
| **Viewport** | 1440×900 |
| **Sezione** | Hero split → service-nav → intro panel |
| **Problema** | Transizione netta dark → white; service-nav sticky ok; intro panel ben bilanciato |
| **Gravità** | **Nessuna** (osservazione positiva) |
| **Screenshot** | `spatial-computing/1440x900/above-fold.png`, `spatial-computing/1440x900/settori.png` |

---

# Problemi di lunghezza percepita

### V-007 — Home: fascia clienti alta

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `index.html` |
| **Viewport** | 1440×900 |
| **Sezione** | `.clients-bar` |
| **Problema** | Blocco ~982 px (logo grid + copy). Non ridondante commercialmente ma **allunga** la prima metà pagina prima dei pilastri |
| **Gravità** | **Bassa** |
| **Correzione consigliata** | Nessun taglio senza brief; opzionale logo grid più compatto |
| **Screenshot** | `index/1440x900/section-04.png` |
| **Rischio modifica** | Medio (impatto social proof) |

### V-008 — Spatial: settori vs applicazioni (sovrapposizione semantica)

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `spatial-computing.html` |
| **Viewport** | 1440×900 |
| **Sezione** | «Dove crea valore» → «Dove lo applichiamo» |
| **Problema** | Leggendo in sequenza, medicale/industria/configuratori compaiono in entrambe le sezioni con angolazioni diverse (uso vs settore). **Non appare ripetitivo visivamente** (layout diverso: card 3×2 vs settori + immagine), ma il lettore attento nota overlap |
| **Gravità** | **Bassa** |
| **Correzione consigliata** | **Nessun taglio** richiesto ora. Solo se in navigazione reale risultasse faticoso → accorciare intro settori, non rimuovere blocchi |
| **Screenshot** | `spatial-computing/1440x900/section-03.png`, `spatial-computing/1440x900/settori.png` |
| **Rischio modifica** | Medio se si elimina settori |

### V-009 — Spatial: Metodo + FAQ tardivi ma accettabili

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `spatial-computing.html` |
| **Viewport** | 1440×900 |
| **Sezione** | Metodo, FAQ |
| **Problema** | Dopo demo Labirinto e portfolio teaser, metodo (4 step) e 6 FAQ aggiungono ~3–4 viewport. Standard per landing servizio B2B |
| **Gravità** | **Nessuna** |
| **Correzione consigliata** | Mantenere |
| **Screenshot** | `spatial-computing/1440x900/full-page.png` (con caveat reveal) |

### V-010 — Spatial: gerarchia portfolio inline

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `spatial-computing.html` |
| **Viewport** | 1440×900 |
| **Sezione** | Portfolio progetti |
| **Problema** | Surgeree featured (immagine grande + 2 paragrafi) vs 3 teaser compatti — **gerarchia corretta** |
| **Gravità** | **Nessuna** (positivo) |
| **Screenshot** | `spatial-computing/1440x900/section-05.png` |

### V-011 — Portfolio: scroll cumulativo 6 showcase

| Campo | Dettaglio |
|-------|-----------|
| **Pagina** | `portfolio.html` |
| **Viewport** | 1440×900 |
| **Sezione** | Lista showcase |
| **Problema** | ~900 px per progetto × 7 blocchi = scroll lungo ma **ritmo uniforme**; poster statico in cima al posto dello showreel alleggerisce |
| **Gravità** | **Nessuna** |
| **Correzione consigliata** | Mantenere |

### V-012 — Innovation Hub / Chi siamo: teaser P1-6 ok

| Campo | Dettaglio |
|-------|-----------|
| **Pagine** | `index.html`, `chi-siamo.html` |
| **Sezione** | Innovation Hub teaser |
| **Problema** | Teaser sintetici con link; hub resta fonte completa — **nessuna ridondanza eccessiva** |
| **Gravità** | **Nessuna** |
| **Screenshot** | `innovation-hub/1440x900/above-fold.png`, `chi-siamo/1440x900/section-03.png` |

---

# Rifiniture opzionali

| ID | Pagina | Viewport | Nota | Gravità |
|----|--------|----------|------|---------|
| V-013 | `index.html` | 390×844 | Frase about-brief + pilastri ripetono «problemi reali» | Bassa |
| V-014 | `br1ng.html` | 390×844 | Hero video crop stretto su mobile (solo dettaglio prodotto) | Bassa |
| V-015 | `surgeree.html` | 1440×900 | Case study lungo (~10,6k px) — coerente con profondità progetto | Bassa |
| V-016 | `portfolio.html` | 390×844 | Tap target video mobile | **RISOLTO** — overlay `.portfolio-video-play` centrato; visibile solo a video fermo | `portfolio/390x844/verify-bring.png` |
| V-017 | Tutte | — | Footer e CTA finale coerenti; transizione a footer pulita | Nessuna |

---

## Portfolio — checklist richiesta

| Requisito | Esito |
|-----------|--------|
| Desktop: autoplay solo in viewport | ✅ |
| Desktop: max 1 video | ✅ |
| Desktop: pausa fuori viewport | ✅ |
| Desktop: preload none | ✅ (nessun burst simultaneo osservato) |
| Mobile: poster iniziale | ✅ |
| Mobile: play su tap | ✅ |
| Mobile: playsinline | ✅ |
| Mobile: no layout shift poster→video | ✅ (nessun salto misurato; poster stesse proporzioni) |
| Poster b-r1ng | ✅ |
| CTA «Leggi il case study» | ✅ |
| ITM distinto (showcase, link «Scopri il progetto») | ✅ |

---

## Spatial Computing — checklist richiesta

| Requisito | Esito |
|-----------|--------|
| −22% sufficiente **visivamente** (desktop) | ✅ Sì — non proporre tagli per percentuale |
| 6 applicazioni troppo dense | ❌ No su desktop; su mobile colonne singole leggibili |
| Settori ripetitivi | ⚠️ Leggero overlap semantico, non visivo |
| 4 aree tecnologiche compatte | ✅ |
| Gerarchia Surgeree + teaser | ✅ |
| Metodo/FAQ troppo tardi | ⚠️ Tardi ma normali per landing |
| Sezione invest rimossa | ✅ |
| Nottetempo esteso rimosso | ✅ |

---

## Home — checklist richiesta

| Requisito | Esito |
|-----------|--------|
| 9 service card rimosse | ✅ |
| 4 pilastri peso commerciale | ✅ |
| CTA «Scopri tutti i servizi» | ✅ presente; ⚠️ poco prominente (V-004) |
| Lunghezza complessiva | ⚠️ Media-alta; ritmo naturale dark/light alternato |
| Surgeree + Innovation Hub | ✅ non eccessivi come blocchi singoli |

---

# FASE 2 — Confronto `newtl.touchlabs.it` vs localhost

## Diagnosi

Il sito pubblico **non ha ricevuto il deploy P1**. Evidenze:

| Indicatore | localhost:8084 | newtl.touchlabs.it |
|------------|----------------|---------------------|
| `index.html` size | ~29 KB | ~35 KB |
| `Last-Modified` index | 9 lug 2026 (container locale) | **2 lug 2026 14:26 GMT** |
| «Cosa costruiamo per le aziende» | Assente | **Presente** |
| «Scopri tutti i servizi» | Presente | Assente |
| `og-image.jpg` | Presente | `og-image.svg` |
| `streetAddress` JSON-LD | Presente | Assente |
| Spatial invest section | Assente | **Presente** |
| `main.js` → `data-portfolio-video` | Presente | **Assente** (`Last-Modified` 2 lug) |
| `style.css` size | ~105 KB (modificato 9 lug) | ~105 KB (`Last-Modified` **2 lug**) |

**Server:** nginx + PleskLin (`x-powered-by: PleskLin`). Nessuna CDN esplicita negli header; la causa principale è **document root non aggiornato**, non cache browser.

**Cache:** possibile cache Plesk/nginx su asset statici, ma anche bypassando cache il contenuto HTML è quello del 2 luglio.

**Git locale:** modifiche P1 **non committate** (working tree dirty) — il deploy non è stato eseguito dal repository.

---

## File da sincronizzare per deploy P1

### HTML (obbligatori)

```
public/index.html
public/chi-siamo.html
public/contatti.html
public/innovation-hub.html
public/portfolio.html
public/servizi.html
public/spatial-computing.html
public/br1ng.html
```

### Asset (obbligatori)

```
public/assets/css/style.css
public/assets/js/main.js
public/assets/img/brand/og-image.jpg   (NUOVO)
```

### Asset (operazioni)

```
public/assets/video/touchlabs-showreel.mp4   → RIMUOVERE dal server se presente (master 72 MB, ora in assets-source/)
```

### Non sincronizzare su document root pubblico

```
assets-source/                    (master video, fuori web root)
docs/                             (documentazione)
node_modules/                     (tooling locale)
scripts/p1-visual-review.mjs      (tooling)
```

### Documentazione deploy (ops, non web root)

```
docs/deployment/REDIRECT_MAP.md
docs/reviews/HERO_LAYOUT_EXCEPTIONS.md
docs/reviews/P1_SMOKE_TEST.md
docs/reviews/P1_VISUAL_REVIEW.md
docs/reviews/FINAL_ACTION_PLAN.md
```

---

## Operazioni deploy consigliate (richiedono conferma)

1. **Commit** delle modifiche P1 nel repository (se policy team lo richiede prima del deploy).
2. **Rsync/scp/Git pull** di `public/` verso document root di `newtl.touchlabs.it` (verificare path Plesk, tipicamente `httpdocs/` o sottocartella).
3. **Upload** `og-image.jpg`; opzionale mantenere `og-image.svg` come fallback legacy.
4. **Rimuovere** `public/assets/video/touchlabs-showreel.mp4` dal server se esiste.
5. **Purge cache** Plesk / nginx (`proxy_cache`, `expires`) se abilitata.
6. **Verifica post-deploy:** curl grep su marker P1 (`Scopri tutti i servizi`, assenza `Cosa costruiamo`, `data-portfolio-video`).
7. **Non** modificare `api/`, form, SMTP, nginx redirect produzione senza LB-5.

---

## Stato approvazioni (agg. 10 lug 2026)

- [x] V-001 overflow portfolio mobile
- [x] V-016 icona play mobile
- [ ] Tagliare ulteriormente Spatial Computing
- [ ] Correggere V-004 (CTA pilastri)
- [ ] Avviare P2 / P3

**Deploy `newtl.touchlabs.it`:** commit preparato; richiede accesso SSH/rsync al document root Plesk (non configurato in ambiente locale).

---

## Riferimenti screenshot

| Percorso | Contenuto |
|----------|-----------|
| `index/1440x900/above-fold.png` | Hero home |
| `index/1440x900/section-05.png` | Pilastri |
| `spatial-computing/1440x900/above-fold.png` | Hero split |
| `spatial-computing/1440x900/section-03.png` | 6 applicazioni |
| `spatial-computing/1440x900/settori.png` | Settori |
| `portfolio/390x844/above-fold.png` | Hero portfolio mobile |
| `portfolio/390x844/verify-full.png` | Post-fix V-001 @390 |
| `portfolio/390x844/verify-bring.png` | Post-fix V-016 play overlay |
| `portfolio/verify-v001-v016.json` | Test automatici overflow + play |
| `surgeree/1440x900/above-fold.png` | Hero split case study |
| `nottetempo/390x844/above-fold.png` | Hero centrata mobile |
| `metrics.json` | Metriche automatiche + test video |

Script rigenerazione: `node scripts/p1-visual-review.mjs`
