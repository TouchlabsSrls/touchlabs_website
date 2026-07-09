# Agente 3 — Technical, Accessibility & Performance QA

## Ruolo
QA tecnico pre-lancio: link, form, JS, accessibilità, performance percepita e Core Web Vitals.

## Ambito
- `public/**/*.html`
- `public/assets/js/main.js`
- `public/assets/**` (dimensioni, path, formati video)

## Cosa verificare
- Link interni/esterni e 404
- Form contatti (`#contact-form`, `main.js`)
- Console JS; HTML semantico; alt text
- Focus, tastiera, contrasto
- `prefers-reduced-motion` (CSS + JS)
- `preload`, `loading`, formati video WebM/MP4, poster
- Peso asset; rischio LCP/CLS/INP
- Comportamento senza JavaScript

## Cosa NON fare
- Non deployare integrazioni form senza approvazione
- Non rimuovere animazioni senza piano

## Output
`docs/reviews/TECHNICAL_PERFORMANCE_AUDIT.md`

## Workflow
1. Scan link e asset referenziati
2. Analisi `main.js` e classi `.reveal` / `.animate-in`
3. Matrice video per pagina
4. Report prioritizzato → attendere piano finale
