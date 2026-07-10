# Hero layout — famiglie e eccezioni intenzionali

Due famiglie condivise (token in `style.css` `:root`). **Non** convertire split ↔ centrata.

## Famiglia A — Hero centrata (`.page-hero`)

Pagine: Portfolio, Chi siamo, Contatti, Innovation Hub, case study con hero testuale centrata (Nottetempo, Scattolini, Luxury Living Group, Il Labirinto).

Token: `--hero-centered-min-height`, `--hero-centered-text-max`, `--hero-centered-padding-bottom`.

## Famiglia B — Hero split (`.page-hero.page-hero--split`)

Pagine: Servizi, Software custom, AI applicata, Digital Experience, Spatial Computing, Surgeree, b-r1ng.

Token: `--hero-split-padding-top`, `--hero-split-padding-bottom`, `--hero-split-gap`, `--hero-split-content-max`.

## Eccezioni intenzionali

| Pagina | Eccezione | Motivo |
|--------|-----------|--------|
| `br1ng.html` | Split con video hero autoplay | Il movimento è parte della presentazione prodotto |
| `surgeree.html` | Split con visual contain (`.page-hero__visual--contain`) | Aspect ratio landscape dello screenshot clinico |
| Case study centrati | Breadcrumb assente; tag in hero o sezione successiva | Pattern case study preesistente |
| Landing servizi split | `service-nav` sticky sotto hero | Navigazione interna al servizio |

## Non modificare

- Struttura HTML split vs centrata per pagina
- Proporzioni video/immagine nelle hero split (gestite da `.page-hero__visual--contain` dove presente)
