# Contact Form — Test Report

**Data:** 9 luglio 2026  
**Ambiente:** Docker locale (`localhost:8084`) — nginx + PHP 8.2-FPM  
**Endpoint:** `POST /api/contact.php`  
**SMTP:** non configurato (`api/.env` vuoto)

---

## Hardening applicato (pre-test)

| Controllo | Stato |
|-----------|--------|
| `api/.env` fuori da `public/` | ✅ |
| `api/.env` in `.gitignore` | ✅ |
| Credenziali non nel codice versionato | ✅ (solo placeholder in `.env.example`) |
| `SMTP_FROM_EMAIL` deve essere `@touchlabs.it` | ✅ validazione server-side |
| Reply-To = email utente, From = dominio Touchlabs | ✅ (`SmtpMailer`) |
| Validazione/sanitizzazione server-side | ✅ |
| Successo solo dopo `sendMail()` riuscito | ✅ |
| Errori SMTP generici all'utente | ✅ (no dettagli tecnici) |
| Honeypot `website` | ✅ |
| Rate limit post-invio riuscito | ✅ |
| IP da `X-Forwarded-For` / `X-Real-IP` / `REMOTE_ADDR` | ✅ |
| Log senza contenuto messaggi | ✅ (`error_log` generico) |
| Nginx: deny `location ~ /\.` | ✅ |
| `GET /api/.env` | 404 ✅ |

---

## Test eseguiti

### 1. Campi obbligatori mancanti

**Request:** `name=&email=&message=&privacy_consent=`  
**Risultato:** `HTTP 422`  
**Body:** `errors` su name, email, message, privacy_consent  
**Esito:** ✅ PASS

### 2. Email non valida

**Request:** `name=Test&email=bad&message=Hi&privacy_consent=1`  
**Risultato:** `HTTP 422`  
**Body:** `errors.email`  
**Esito:** ✅ PASS

### 3. Honeypot compilato

**Request:** include `website=http://spam.com`  
**Risultato:** `HTTP 200`, `{"ok":true,...}` (nessun invio SMTP)  
**Esito:** ✅ PASS — risposta silenziosa anti-bot

### 4. Payload valido senza SMTP

**Request:** `name=Test&email=test@example.com&message=Valid+test&privacy_consent=1`  
**Risultato:** `HTTP 503`  
**Body:** `Servizio email non configurato. Contattaci a info@touchlabs.it.`  
**Esito:** ✅ PASS — nessun falso successo

### 5. Invio valido reale (SMTP)

**Stato:** ⏳ **NON ESEGUITO** — richiede `api/.env` con credenziali SMTP valide.  
**Azione:** compilare `.env` e ripetere test; verificare ricezione su `CONTACT_TO_EMAIL` e header Reply-To.

### 6. Invii consecutivi (rate limit)

**Stato:** ⏳ **NON ESEGUITO** — il rate limit si attiva solo dopo un invio **riuscito** (`markRateLimit` post-`sendMail`). Con SMTP assente entrambe le richieste restituiscono 503.  
**Azione:** ripetere dopo configurazione SMTP: secondo invio entro 60s → atteso `HTTP 429`.

### 7. SMTP non disponibile / errore connessione

**Stato:** ✅ simulato (host vuoto) → `503` messaggio generico, nessun dettaglio SMTP in risposta.

### 8. Dominio mittente errato

**Stato:** ✅ validato in codice — `SMTP_FROM_EMAIL` non `@touchlabs.it` → errore configurazione generico (non testato live senza .env).

---

## Test client-side (contatti.html)

| Controllo | Stato |
|-----------|--------|
| Validazione client prima del fetch | ✅ implementata |
| Stato "Invio in corso…" | ✅ |
| Successo solo se `result.data.ok` | ✅ |
| Errore rete / 503 mostrato | ✅ |
| Doppio submit bloccato (`disabled` su button) | ✅ |

---

## Configurazione manuale richiesta

```bash
cp api/.env.example api/.env
# Compilare SMTP_HOST, SMTP_USER, SMTP_PASS, ecc.
docker compose up -d
```

Vedi `docs/deployment/CONTACT_FORM_SETUP.md`.

---

## Conclusione

Il form è **pronto tecnicamente** ma **non operativo in produzione** finché SMTP non è configurato e non viene eseguito almeno un invio reale di prova.
