# Configurazione form contatti — Touchlabs

## Requisiti

- **PHP 8.1+** con estensioni `openssl`, `mbstring`
- **PHP-FPM** dietro nginx
- **Server SMTP** accessibile (TLS consigliato, porta 587)
- File configurazione `api/.env` (non versionato)

## Setup locale (Docker)

```bash
cp api/.env.example api/.env
# Modificare api/.env con credenziali SMTP reali

docker compose up -d --build
```

Il form invia POST a `http://localhost:8084/api/contact.php`.

## Variabili `api/.env`

| Variabile | Descrizione |
|-----------|-------------|
| `SMTP_HOST` | Host SMTP |
| `SMTP_PORT` | Porta (587 TLS, 465 SSL) |
| `SMTP_USER` | Username SMTP |
| `SMTP_PASS` | Password SMTP |
| `SMTP_SECURE` | `tls` o `ssl` |
| `SMTP_FROM_EMAIL` | Mittente (es. noreply@touchlabs.it) |
| `SMTP_FROM_NAME` | Nome mittente |
| `CONTACT_TO_EMAIL` | Destinatario (es. info@touchlabs.it) |
| `CONTACT_RATE_LIMIT_SECONDS` | Limite anti-spam per IP (default 60) |

## Deploy produzione

1. Copiare cartella `api/` sul server
2. Creare `api/.env` con credenziali produzione
3. Includere `docs/deployment/nginx-redirects.conf` nel server block
4. Configurare `location ~ ^/api/contact\.php$` verso PHP-FPM (vedi `docker/nginx.conf`)

## Sicurezza implementata

- Honeypot (`website`)
- Rate limit per IP
- Sanitizzazione input
- Validazione server-side
- Consenso privacy obbligatorio
- Risposte JSON senza dettagli interni

## Stato senza SMTP

Se `SMTP_HOST` è vuoto, l'API risponde **503** con messaggio per contattare info@touchlabs.it.
