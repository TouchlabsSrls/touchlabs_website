# Touchlabs
# Cursor Workflow

---

# Obiettivo

Cursor non deve essere utilizzato come un semplice generatore di codice.

Deve comportarsi come un membro del team Touchlabs.

Ogni decisione deve essere presa pensando alla qualità finale del progetto.

La velocità non è l'obiettivo.

L'obiettivo è costruire il miglior sito possibile.

---

# Regola numero uno

Mai generare l'intero sito in una sola richiesta.

Il progetto viene costruito progressivamente.

Ogni pagina viene rifinita prima di iniziare la successiva.

---

# Workflow

Ogni nuova funzionalità segue questo ordine.

Analisi

↓

Progettazione

↓

Implementazione

↓

Responsive

↓

Animazioni

↓

Performance

↓

Refactoring

↓

Verifica finale

Mai saltare uno step.

---

# Prima di scrivere codice

Prima di creare qualsiasi componente Cursor deve chiedersi:

Esiste già qualcosa di simile?

Posso riutilizzare un componente?

Sto rispettando il Design System?

Sto rispettando il Brand?

Sto rispettando la Creative Direction?

---

# Component First

Mai creare HTML duplicato.

Ogni elemento deve diventare un componente riutilizzabile.

Ad esempio.

Hero

Navbar

Footer

CTA

Service Card

Portfolio Card

Statistic

Timeline

Accordion

Contact Form

Feature Block

Quote

Team Card

News Card

---

# Home Page

La Home rappresenta il Design System.

Prima di creare qualsiasi altra pagina la Home deve essere completata.

Solo dopo si passa alle pagine interne.

---

# Una pagina alla volta

Mai creare:

Home

Chi siamo

Servizi

Portfolio

tutte insieme.

Procedere sempre così.

Home

↓

Revisione

↓

Chi siamo

↓

Revisione

↓

Servizi

↓

Revisione

↓

Portfolio

↓

Revisione

---

# Revisione continua

Ogni pagina deve essere migliorata prima di passare alla successiva.

Mai accumulare debito grafico.

---

# CSS

Preferire CSS ordinato.

Organizzare il file in sezioni.

Variables

Reset

Typography

Layout

Components

Utilities

Animations

Responsive

Mai CSS casuale.

---

# Naming

Utilizzare nomi descrittivi.

Mai:

box1

box2

left

right

Utilizzare:

hero

hero-title

service-card

portfolio-grid

cta-section

---

# JavaScript

Solo se necessario.

Preferire CSS.

Mai utilizzare JavaScript per effetti ottenibili con CSS.

---

# Responsive

Desktop First.

Tablet.

Mobile.

Ogni breakpoint deve essere verificato.

Mai assumere che funzioni.

---

# Performance

Prima di considerare completata una pagina verificare:

immagini ottimizzate

lazy loading

animazioni GPU

assenza di layout shift

---

# Accessibilità

Ogni pagina deve avere:

alt text

focus states

contrasto corretto

heading ordinati

label corrette

tab navigation

---

# SEO

Ogni pagina deve avere.

Title

Description

Open Graph

Heading corretti

Schema quando necessario

---

# Lighthouse

Ogni pagina dovrebbe raggiungere.

Performance

95+

Accessibility

100

Best Practices

100

SEO

100

---

# Motion

Prima di aggiungere un'animazione chiedersi.

Serve davvero?

Se la risposta è no.

Eliminarla.

---

# Immagini

Mai utilizzare immagini casuali.

Ogni immagine deve rafforzare il messaggio della sezione.

---

# Tipografia

Mai utilizzare dimensioni casuali.

Seguire una scala tipografica.

---

# Refactoring

Dopo ogni nuova funzionalità.

Ripulire.

Semplificare.

Ridurre duplicazioni.

---

# Qualità

Ogni pagina deve sembrare progettata da un designer.

Non da uno sviluppatore.

---

# Quando fermarsi

Se una modifica aggiunge complessità senza aumentare la qualità.

Non implementarla.

---

# Regola Touchlabs

Eleganza prima della quantità.

Ordine prima della creatività.

Semplicità prima della tecnologia.

Esperienza utente prima del codice.

---

# Checklist prima del commit

✔ Design coerente

✔ Responsive

✔ Performance

✔ Accessibilità

✔ SEO

✔ Componenti riutilizzati

✔ Nessuna duplicazione

✔ Nessun codice inutile

✔ Animazioni fluide

✔ Design premium

---

# Regola finale

Ogni volta che completi una sezione del sito chiediti:

"Se questo fosse il sito di Apple, lo lascerei così?"

Se la risposta è no.

Continua a migliorarlo.
