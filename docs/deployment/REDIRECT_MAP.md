# Mappa redirect — touchlabs.it (legacy → nuovo sito)

Documento di lavoro per i redirect **301** in produzione (`docs/deployment/nginx-redirects.conf`).  
**Regola:** non inventare destinazioni. Ogni riga indica lo stato della verifica.

Ultimo aggiornamento: 2026-06-29 (Fase 1 P1-14).

---

## Fonti consultate

| Fonte | Esito |
|-------|--------|
| `docker/nginx.conf` / `docs/deployment/nginx-redirects.conf` | 1 redirect già implementato in dev |
| `public/configuratori-3d.html` | Pagina stub con canonical verso destinazione |
| `public/sitemap.xml` | Elenco URL nuovo sito (nessun legacy) |
| `public/robots.txt` | `Disallow: /configuratori-3d.html` |
| Sitemap live `https://www.touchlabs.it/sitemap.xml` | **404** (sito legacy Joomla ancora in produzione) |
| Wayback Machine (CDX, dominio touchlabs.it) | URL storici Joomla — vedi sezione «Legacy non mappati» |
| Link interni nel repository | Nessun altro path legacy referenziato |

---

## Redirect verificati (da applicare in produzione)

| URL precedente | Nuova destinazione | Verifica | Redirect | Note |
|----------------|-------------------|----------|----------|------|
| `/configuratori-3d.html` | `/digital-experience.html` | ✅ Verificato | **301** | Implementato in `docker/nginx.conf`; stub locale con `<link rel="canonical">`; 0 link interni al vecchio path; escluso da `sitemap.xml` |

**Snippet nginx (già presente):**

```nginx
location = /configuratori-3d.html {
    return 301 /digital-experience.html;
}
```

---

## URL nuovo sito (nessun redirect necessario)

Pagine pubblicate nel nuovo sito statico (`public/`):

| Path | Note |
|------|------|
| `/` | Home |
| `/chi-siamo.html` | |
| `/servizi.html` | |
| `/portfolio.html` | |
| `/contatti.html` | |
| `/innovation-hub.html` | Nuova pagina dedicata |
| `/spatial-computing.html` | |
| `/ai-applicata.html` | |
| `/software-custom.html` | |
| `/digital-experience.html` | |
| `/surgeree.html` | Case study |
| `/scattolini.html` | Case study |
| `/luxury-living-group.html` | Case study |
| `/nottetempo.html` | Case study |
| `/il-labirinto.html` | Case study |
| `/br1ng.html` | Case study |
| `/privacy.html` | Bozza — LB-3 |
| `/cookie.html` | Bozza — LB-3 |

---

## Legacy Joomla — candidati da verificare (NON applicare senza conferma)

URL recuperati da Wayback Machine (archivio storico). **Destinazione non verificata** nel nuovo IA — richiedono audit Search Console / log server prima del 301.

| URL precedente (esempi Wayback) | Destinazione ipotizzabile | Stato | Dubbi |
|----------------------------------|---------------------------|-------|-------|
| `/chi-siamo.html` | `/chi-siamo.html` | ⚠️ Stesso path, contenuto diverso | Il nuovo file sostituisce il vecchio; verificare che non esistano varianti (`/chi-siamo-2/...`) ancora indicizzate |
| `/chi-siamo-2/siti-web.html` | `/servizi.html` o `/digital-experience.html` | ❌ Non verificato | Struttura Joomla obsoleta; servizio non mappato 1:1 |
| `/chi-siamo-2/realta-aumentata.html` | `/spatial-computing.html` | ❌ Non verificato | |
| `/chi-siamo-2/realta-virtuale.html` | `/spatial-computing.html` | ❌ Non verificato | |
| `/chi-siamo-2/configuratori-di-prodotto.html` | `/digital-experience.html` | ❌ Non verificato | Prossimità semantica, non confermata |
| `/chi-siamo-2/modellazione-e-render-3d.html` | `/digital-experience.html` o `/servizi.html` | ❌ Non verificato | |
| `/chi-siamo-2/app-mobile.html` | `/software-custom.html` o `/servizi.html` | ❌ Non verificato | |
| `/app-per-smartphone-e-tablet` | `/servizi.html` | ❌ Non verificato | URL senza `.html` |
| `/article/item/10-slide-show/configuratori-3d-in-real-time/15` | `/digital-experience.html` | ❌ Non verificato | Articolo Joomla; traffico residuo da confermare |
| `/index.php` | `/` | ❌ Non verificato | Home Joomla legacy |

**Azione consigliata (post go-live):** esportare top URL da Google Search Console e log nginx; aggiornare questa tabella con redirect 301 solo dove il traffico o i backlink lo giustificano.

---

## Redirect esplicitamente esclusi

| URL | Motivo |
|-----|--------|
| Path `/administrator/`, `/cache/`, `/bin/`, `/cli/` | Backend Joomla — non reindirizzare verso il nuovo sito |
| Query string (`?format=feed`, UTM, ecc.) | Normalizzazione da valutare a parte |
| Pagine `itemlist`, `tmpl=component`, feed RSS | Contenuto Joomla non replicato |

---

## Riepilogo

| Categoria | Conteggio |
|-----------|-----------|
| Redirect pronti per produzione | **1** |
| Legacy da verificare con dati traffico | **10+** |
| Redirect inventati in questo documento | **0** |
