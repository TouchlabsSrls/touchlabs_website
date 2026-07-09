# UX & Content Audit — Touchlabs

**Agente:** UX & Content Editor  
**Data:** 9 luglio 2026  
**Scope:** 16 file HTML in `public/`  
**Stato:** Solo analisi — nessuna modifica applicata

---

## Inventario pagine

| File | Ruolo |
|------|--------|
| `index.html` | Home hub |
| `chi-siamo.html` | About hub |
| `servizi.html` | Services hub |
| `portfolio.html` | Portfolio hub |
| `contatti.html` | Conversione |
| `innovation-hub.html` | Innovation hub |
| `spatial-computing.html` | Landing servizio |
| `ai-applicata.html` | Landing servizio |
| `software-custom.html` | Landing servizio |
| `digital-experience.html` | Landing servizio |
| `configuratori-3d.html` | Redirect → digital-experience |
| `surgeree.html` | Case study |
| `scattolini.html` | Case study |
| `luxury-living-group.html` | Case study |
| `br1ng.html` | Case study |
| `il-labirinto.html` | Case study |

**Gap contenuto:** Nottetempo senza case study dedicato; ITM Monoblock senza pagina dettaglio.

---

## Sintesi esecutiva

Il percorso hub → landing → case study → contatti è definito ma **non rispettato in pratica**: Home e `spatial-computing.html` ripetono troppo contenuto già presente altrove. Surgeree, Scattolini e Il Labirinto compaiono fino a 5 volte con copy sovrapposto. Le CTA competono tra navbar, hero e footer con etichette non uniformi. Il portfolio presenta **incoerenze numeriche e di etichetta** (6 vs 7 progetti; “Leggi il case study” per Nottetempo).

**Intervento consigliato:** tagli e accorpamenti, non nuovi testi.

---

## Bloccanti

| ID | Pagina | Sezione | File | Problema | Proposta |
|----|--------|---------|------|----------|----------|
| UX-B1 | `portfolio.html` | Hero | `portfolio.html` L135 | Copy: **“Sei case study”** ma la pagina ne elenca **7** (aggiunto ITM) | Allineare copy a “Sette progetti” oppure escludere ITM dal conteggio hero |
| UX-B2 | `portfolio.html` | Nottetempo `#nottetempo` | `portfolio.html` L316 | CTA **“Leggi il case study”** → `spatial-computing.html#nottetempo` (non è un case study) | Rinominare CTA (“Scopri su Spatial Computing”) o creare case study dedicato |
| UX-B3 | `index.html` | Hero `.hero__actions` | `index.html` | Primaria hero “Scopri i nostri servizi” vs navbar “Parliamo del tuo progetto” | Una sola CTA primaria above-the-fold; allineare a contatti o servizi |
| UX-B4 | `spatial-computing.html` | Intera pagina | `spatial-computing.html` (~698 righe) | Pagina più lunga del sito; duplica portfolio + value prop | Tagliare 3–4 sezioni (vedi UX-I4, UX-I5) |

---

## Importanti

### Ripetizioni cross-page

| ID | Pagine | Sezione | Proposta |
|----|--------|---------|----------|
| UX-I1 | `index.html` + `chi-siamo.html` | About brief / Identità | Paragrafo identico su Touchlabs “persone curiose…” — **tenere solo su chi-siamo**; home: 1 frase + link |
| UX-I2 | `index.html` | “Servizi principali” `#services-title` | **Rimuovere griglia 9 card**; i 4 pilastri + link “Tutti i servizi” bastano |
| UX-I3 | Home + chi-siamo + innovation-hub | Innovation Lab / tag tecnologici | Stessa storia lab + stessi tag — **dettaglio solo su innovation-hub** |
| UX-I4 | `spatial-computing.html` | “Dove crea valore” + “Perché investire” | Sezioni ridondanti — **eliminare “Perché investire”** |
| UX-I5 | `spatial-computing.html` | Portfolio embedded `#cases-title` | Secondo portfolio inline — **1 teaser Surgeree** + link; tagliare blocco Nottetempo narrativo |
| UX-I6 | Site-wide | Surgeree | Compare 5× con copy sovrapposto — **profondità solo su `surgeree.html`** |
| UX-I7 | Site-wide | Scattolini | Storia SAP/Three.js **4×** — teaser su portfolio/servizi, dettaglio su `scattolini.html` |
| UX-I8 | Site-wide | Il Labirinto | **5×** — ridurre a demo video + link case study |
| UX-I9 | `index.html` | “Come lavoriamo” `.quote-block` | 2 paragrafi UX densi — **tagliare**; link a chi-siamo o digital-experience |
| UX-I10 | `portfolio.html` | Settori `#sectors-title` | Ripete tag già sulle card showcase — **rimuovere sezione** |
| UX-I11 | `portfolio.html` | Showreel `portfolio-showreel` | Stesso video della home hero — **una sola istanza** (portfolio o home) |

### CTA e gerarchia link

| ID | Pagina | Sezione | Proposta |
|----|--------|---------|----------|
| UX-I12 | Tutte | `navbar__cta` su `contatti.html` | “Parliamo del tuo progetto” su pagina contatti — nascondere o ancorare al form |
| UX-I13 | Landing servizi | Hero + navbar | Doppia CTA contatto above-the-fold — tenere solo navbar o solo hero |
| UX-I14 | Site-wide | `cta-section` | Etichette miste: “Parliamone” / “Parliamo del tuo progetto” — **standardizzare** |
| UX-I15 | Home, chi-siamo, portfolio | CTA secondaria “Scopri servizi” | Ridondante con nav — **opzionale rimuovere** |
| UX-I16 | `servizi.html` | Gateway Digital Experience | Secondario Scattolini duplicato su gateway 03 e 04 — variare (es. LLG) |

### Paragrafi densi (tagli)

| ID | Pagina | Sezione | Proposta |
|----|--------|---------|----------|
| UX-I17 | `surgeree.html` | Sfida / Analisi / Soluzione | Max **2 paragrafi** per sezione |
| UX-I18 | `br1ng.html` | Narrative 3×3 | Stesso schema Surgeree — cap a 2 paragrafi |
| UX-I19 | `il-labirinto.html` | `#story-title` body | 4 paragrafi → **2** |
| UX-I20 | `spatial-computing.html` | Research cards | Tagliare blocco “Perché è rilevante” (resta su innovation-hub) |

---

## Opzionali

| ID | Pagina | Proposta |
|----|--------|----------|
| UX-O1 | `index.html` clients-bar | Tagliare frase descrittiva sotto i loghi |
| UX-O2 | `index.html` editorial-video | Tagliare paragrafo (ripete servizi) |
| UX-O3 | `chi-siamo.html` marquee | Tenere solo lista statica o rimuovere banda |
| UX-O4 | `digital-experience.html` | Card ITM duplica portfolio — tenere una sola istanza |
| UX-O5 | `innovation-hub.html` | Accorpare observation cards con research areas |

---

## Mappa consolidamento (riferimento rapido)

```
TAGLIARE DA HOME          → MANTENERE SU
────────────────────────────────────────
Paragrafo chi-siamo       → chi-siamo.html
9 service cards           → servizi.html
Dettaglio Innovation Lab  → innovation-hub.html
Quote UX in “Come lavoriamo” → chi-siamo / digital-experience
Corpo Surgeree            → surgeree.html

TAGLIARE DA spatial-computing → MANTENERE SU
────────────────────────────────────────
Perché investire          → (assorbito in Dove crea valore)
Portfolio/Nottetempo      → portfolio.html
```

---

## Priorità editing (se approvato)

1. UX-B1, UX-B2 — integrità portfolio  
2. Rimuovere “Servizi principali” da home (UX-I2)  
3. Snellire `spatial-computing.html` (UX-I4, UX-I5)  
4. Deduplicare identità / innovation (UX-I1, UX-I3)  
5. Standardizzare CTA (UX-I14)  
6. Rimuovere Settori + showreel duplicato su portfolio (UX-I10, UX-I11)

**Stima riduzione scroll:** Home ~25–30%; spatial-computing ~35–40%; portfolio ~20%.
