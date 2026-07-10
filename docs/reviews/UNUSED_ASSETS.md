# Asset non referenziati — inventario locale

**Data:** 10 luglio 2026  
**Scope:** `public/assets/`  
**Azione:** nessun file cancellato automaticamente

---

## Riepilogo

| Categoria | File | Peso totale stimato |
|-----------|------|---------------------|
| Master video non usati in HTML | 3 | ~18,5 MB |
| Preview ITM Monoblock | 4 | ~0,74 MB |
| Gallery Nottetempo (non in pagina) | 4 | ~0,45 MB |
| Placeholder SVG | 5 | ~2 KB |
| OG SVG legacy | 1 | 0,6 KB |

---

## Master video in `public/` (candidati a spostamento in `assets-source/`)

Questi file hanno versioni compresse/WebM referenziate nelle pagine HTML.

| Percorso | Dimensione | Note |
|----------|------------|------|
| `/assets/video/haier/haier.mp4` | 9,5 MB | HTML usa `haier.webm` + `haier-compressed.mp4` |
| `/assets/video/surgeree/surgeree-demo.mp4` | 5,8 MB | HTML usa `.webm` + `-compressed.mp4` |
| `/assets/video/itm-monoblock/itm-monoblock.mp4` | 3,2 MB | HTML usa `.webm` + `-compressed.mp4` |

**Azione consigliata (pre-deploy):** spostare in `assets-source/video/` come già fatto per lo showreel master. Non rimuovere finché non si verifica che i file compressi siano sufficienti per tutti i browser target.

---

## Immagini non referenziate

### ITM Monoblock — preview gallery

| Percorso | Dimensione |
|----------|------------|
| `/assets/img/projects/itm-monoblock/preview-1.jpg` | 157 KB |
| `/assets/img/projects/itm-monoblock/preview-2.jpg` | 162 KB |
| `/assets/img/projects/itm-monoblock/preview-3.jpg` | 212 KB |
| `/assets/img/projects/itm-monoblock/preview-4.jpg` | 210 KB |

Possibili bozze o asset per futura gallery — non presenti in `digital-experience.html`.

### Nottetempo — gallery extra

| Percorso | Dimensione |
|----------|------------|
| `/assets/img/projects/nottetempo/gallery-04.jpg` | 119 KB |
| `/assets/img/projects/nottetempo/gallery-07.jpg` | 73 KB |
| `/assets/img/projects/nottetempo/gallery-08.jpg` | 138 KB |
| `/assets/img/projects/nottetempo/gallery-09.jpg` | 109 KB |

La pagina `nottetempo.html` usa altre immagini gallery; queste 4 non sono linkate.

---

## Placeholder e legacy

| Percorso | Dimensione | Note |
|----------|------------|------|
| `/assets/img/brand/og-image.svg` | 647 B | Sostituito da `og-image.jpg` (P1-8) |
| `/assets/img/brand/placeholder.svg` | 247 B | Slot asset generico |
| `/assets/img/backgrounds/placeholder.svg` | 203 B | Slot asset generico |
| `/assets/img/lights/placeholder.svg` | 329 B | Slot asset generico |
| `/assets/img/projects/placeholder.svg` | 248 B | Slot asset generico |
| `/assets/img/textures/placeholder.svg` | 440 B | Slot asset generico |

I placeholder possono restare per sviluppo futuro; `og-image.svg` è obsoleto.

---

## Video fuori convenzione cartelle

| Percorso | Referenziato da | Nota |
|----------|-----------------|------|
| `/assets/img/projects/labirinto/labirinto.mp4` | `il-labirinto.html`, `spatial-computing.html` | 13,7 MB — path `img/` invece di `video/` |

Non è «non referenziato», ma il percorso è incoerente. Valutare spostamento in `assets/video/labirinto/` prima del deploy (con aggiornamento HTML).

---

## Master già fuori da `public/`

| Percorso | Dimensione | Note |
|----------|------------|------|
| `assets-source/video/touchlabs-showreel-original.mp4` | ~72 MB | Non deployato (P1-1) |

---

## Duplicati funzionali (non errori)

| File | Usato in |
|------|----------|
| `/assets/video/configuratore.mp4` | `luxury-living-group.html`, `portfolio.html` |
| `/assets/video/br1ng/br1ng.mp4` | `br1ng.html` (×2), `portfolio.html` |
| `/assets/video/nottetempo/nottetempo.mp4` | `nottetempo.html`, `portfolio.html` |

Duplicazione intenzionale per riuso cross-pagina.

---

## Metodo

Scansione automatica: `scripts/local-qa-audit.mjs` → campo `unreferencedAssets` in `local-qa-audit.json`, verificata manualmente.
