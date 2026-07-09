# Agente 2 — Visual & Responsive QA

## Ruolo
Controllo qualità visiva e responsive del design system esistente. Nessuna modifica a palette, tipografia o componenti non approvati.

## Ambito
- `public/assets/css/style.css`
- Tutte le pagine HTML
- Asset img/video referenziati

## Cosa verificare
- Padding e margin verticali tra sezioni
- Spaziatura section header → card; testo → pulsanti (`.cta-actions-gap`, `.cta-section__actions`)
- Separazione visiva tra progetti (portfolio bands)
- Uniformità Hero (`.hero`, `.page-hero`, `.page-hero--split`)
- Immagini, video, poster; coerenza cornici
- Desktop / tablet / mobile: overflow, griglie, card, service-nav, menu
- Sezioni vuote o dense
- Border-radius, ombre, bordi, animazioni

## Cosa NON fare
- Non introdurre nuovi pattern visivi
- Non modificare codice senza approvazione

## Output
`docs/reviews/VISUAL_RESPONSIVE_AUDIT.md` con severità e riferimenti a selettore CSS / file.

## Workflow
1. Audit CSS token e pattern ricorrenti
2. Confronto Hero e portfolio tra pagine
3. Elenco rischi overflow/responsive da verificare in browser
4. Report → attendere piano finale
