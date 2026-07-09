# Visual & Responsive Audit — Touchlabs

**Agente:** Visual & Responsive QA  
**Data:** 9 luglio 2026  
**Scope:** `public/assets/css/style.css` + 16 HTML  
**Stato:** Solo analisi — nessuna modifica applicata

---

## Sintesi esecutiva

Il design system è coerente (token, card families, `--cta-actions-gap`). I problemi principali: **tre varianti Hero** con altezze diverse, **ritmo band portfolio** rotto, **token CSS mancante** (`--radius-xl`), **media inconsistenti** (video senza poster, img con classe video), **spacing CTA** su `project-closing`.

---

## Bloccanti

Nessun difetto layout confermato senza test browser live. Verificare manualmente su 375px / 768px / 1280px.

---

## Importanti

### Hero — uniformità

| ID | Pagine | Selettori | Problema |
|----|--------|-----------|----------|
| VR-I1 | Case study | `.page-hero--split` vs `.page-hero__inner` | Surgeree/br1ng: split hero; scattolini/LLG/labirinto: hero centrato + immagine sezione successiva |
| VR-I2 | Tutte | `.hero` (90vh) vs `.page-hero` (65vh) vs `.page-hero--split` (auto) | Altezze percepite molto diverse |
| VR-I3 | `chi-siamo.html` | `.page-hero__glow` | Unica hero senza `.section-layers` — look diverso dalle altre |

### Portfolio — band e separazione

| ID | Pagina | Sezione | Selettori | Problema |
|----|--------|---------|-----------|----------|
| VR-I4 | `portfolio.html` | Showcase list | `.portfolio-showcase.section--light` | Scattolini + LLG: **due band light consecutive** |
| VR-I5 | `portfolio.html` | ITM + Settori | `.portfolio-showcase--compact` + `.portfolio-sectors` | Entrambi `section--light` — manca alternanza |
| VR-I6 | `portfolio.html` | Video column | `.portfolio-showcase__video` min-height 420px | Colonna video più alta del testo su entry compatte |

### CSS — token e bug

| ID | File | Selettore | Problema |
|----|------|-----------|----------|
| VR-I7 | `style.css` ~L2709 | `.service-gateway__visual--immersive` | `border-radius: var(--radius-xl)` — **token non definito** in `:root` |

### Media — immagini e video

| ID | Pagina | Elemento | Problema |
|----|--------|----------|----------|
| VR-I8 | `portfolio.html` `#bring` | `<video>` senza `poster` | Frame vuoto fino al caricamento |
| VR-I9 | `br1ng.html` | Hero video | Autoplay senza poster né wrapper `spatial-case-video` |
| VR-I10 | `digital-experience.html` | Card Scattolini | `<img class="spatial-case-video__player">` — pattern video su still |
| VR-I11 | `luxury-living-group.html` | `gallery-fendi.gif` in `.project-gallery__item` (4/3) | GIF 2:1 con crop aggressivo |

### CTA — spaziatura

| ID | Pagine | Selettori | Problema |
|----|--------|-----------|----------|
| VR-I12 | `surgeree.html`, `br1ng.html` | `.project-closing` + `.cta-section__title` | Titolo dentro `.project-closing` non matcha `:has(+ .cta-section__actions)` — spacing irregolare vs altre CTA |
| VR-I13 | Site-wide | `.cta-section` | Etichette secondarie inconsistenti (“Parliamone” vs standard) |

### Responsive e densità

| ID | Pagina | Selettori | Rischio |
|----|--------|-----------|---------|
| VR-I14 | `index.html` | `.clients-bar__grid` | 24 loghi → scroll lungo su mobile |
| VR-I15 | Landing servizi | `.service-nav__list` overflow-x | Scroll orizzontale senza scrollbar visibile |
| VR-I16 | `spatial-computing.html` | page-wide | Pagina più densa del sito |

### Padding / margin

| ID | Pagina | Selettori | Nota |
|----|--------|-----------|------|
| VR-I17 | `portfolio.html` | `.portfolio-showcase` padding `calc(space-8 * 0.88)` | Leggermente più stretto di `.section` standard |
| VR-I18 | `portfolio.html` | `.section-intro--tight` sotto hero | Transizione hero→showreel più stretta che altre pagine |

---

## Opzionali

| ID | Problema | Selettori |
|----|----------|-----------|
| VR-O1 | Ordine tab service-nav diverso per landing | `.service-nav__list` |
| VR-O2 | `servizi.html` hero framed vs img piatte altre landing | `.page-hero__visual--contain` |
| VR-O3 | Shadow gateway non tokenizzate | `.service-gateway__visual--photo` |
| VR-O4 | Subtag portfolio `border-radius: 6px` hardcoded | `.portfolio-showcase__subtags li` |
| VR-O5 | `digital-experience.html`: due `section--light` consecutive (esempi + FAQ) | `.portfolio-examples`, `.faq-section` |

---

## Checklist test manuale viewport

1. `portfolio.html` — band alternation + video heights @ 1024 / 375  
2. `spatial-computing.html` — service-nav scroll + lunghezza pagina  
3. `br1ng.html` + `portfolio.html#bring` — video senza poster  
4. `luxury-living-group.html` — crop GIF galleria  
5. `digital-experience.html` — parità card Scattolini / ITM  
6. `surgeree.html` / `br1ng.html` — spacing CTA finale  
7. `chi-siamo.html` — hero vs section-layers altre pagine

---

## Coerenza positiva (da preservare)

- Token spaziatura sezioni (`--section-header-gap`, `--cta-actions-gap`)  
- Lazy loading + dimensioni img su gallerie  
- Pattern `spatial-case-video` con poster dove presente  
- Grid collapse consistente @ 1024px / 640px  
- `prefers-reduced-motion` su animazioni CSS
