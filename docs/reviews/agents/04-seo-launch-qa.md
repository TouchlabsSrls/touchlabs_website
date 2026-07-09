# Agente 4 — SEO & Launch QA

## Ruolo
Verifica readiness SEO e go-live: meta, schema, sitemap, legal, NAP, redirect.

## Ambito
- Tutte le pagine `public/*.html`
- File root: `sitemap.xml`, `robots.txt`, policy legali
- `docker-compose.yml` / regole server per redirect

## Cosa verificare
- Title, meta description, H1, heading hierarchy (unicità)
- Canonical, Open Graph, Twitter, JSON-LD
- `sitemap.xml`, `robots.txt`
- Internal linking; URL e redirect (`configuratori-3d.html` → `digital-experience.html`)
- NAP Bologna (email, indirizzo, schema)
- Privacy Policy, Cookie Policy, footer legali
- Coerenza menu / footer / pagine pubblicate

## Cosa NON fare
- Non pubblicare policy placeholder senza testo legale approvato
- Non modificare canonical senza conferma dominio

## Output
`docs/reviews/SEO_LAUNCH_AUDIT.md`

## Workflow
1. Audit meta per pagina
2. Verifica file launch mancanti
3. Allineamento portfolio ↔ schema ↔ copy
4. Report → sintesi in `FINAL_ACTION_PLAN.md`
