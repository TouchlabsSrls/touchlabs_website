<?php

declare(strict_types=1);

final class ContactHandler
{
    private array $config;

    public function __construct(string $baseDir)
    {
        $this->config = $this->loadConfig($baseDir);
    }

    public function handle(array $post, array $server): array
    {
        if ($this->isHoneypotTriggered($post)) {
            return ['ok' => true, 'message' => 'Richiesta inviata. Ti risponderemo al più presto.'];
        }

        $clientIp = $this->resolveClientIp($server);

        $this->checkRateLimit($clientIp);

        $data = $this->validate($post);

        $this->assertFromEmailDomain();

        $this->sendMail($data);

        $this->markRateLimit($clientIp);

        return ['ok' => true, 'message' => 'Richiesta inviata. Ti risponderemo entro un giorno lavorativo.'];
    }

    private function loadConfig(string $baseDir): array
    {
        $envPath = $baseDir . '/.env';
        $vars = [];

        if (is_readable($envPath)) {
            foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) {
                    continue;
                }
                [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
                $vars[trim($key)] = trim($value, " \t\"'");
            }
        }

        return [
            'smtp_host' => $vars['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: '',
            'smtp_port' => (int) ($vars['SMTP_PORT'] ?? getenv('SMTP_PORT') ?: 587),
            'smtp_user' => $vars['SMTP_USER'] ?? getenv('SMTP_USER') ?: '',
            'smtp_pass' => $vars['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: '',
            'smtp_secure' => $vars['SMTP_SECURE'] ?? getenv('SMTP_SECURE') ?: 'tls',
            'from_email' => $vars['SMTP_FROM_EMAIL'] ?? getenv('SMTP_FROM_EMAIL') ?: 'noreply@touchlabs.it',
            'from_name' => $vars['SMTP_FROM_NAME'] ?? getenv('SMTP_FROM_NAME') ?: 'Touchlabs Sito Web',
            'to_email' => $vars['CONTACT_TO_EMAIL'] ?? getenv('CONTACT_TO_EMAIL') ?: 'info@touchlabs.it',
            'rate_limit' => (int) ($vars['CONTACT_RATE_LIMIT_SECONDS'] ?? getenv('CONTACT_RATE_LIMIT_SECONDS') ?: 60),
        ];
    }

    private function resolveClientIp(array $server): string
    {
        $sources = [
            $server['HTTP_X_FORWARDED_FOR'] ?? '',
            $server['HTTP_X_REAL_IP'] ?? '',
            $server['REMOTE_ADDR'] ?? '',
        ];

        foreach ($sources as $raw) {
            if ($raw === '') {
                continue;
            }
            $ip = trim(explode(',', (string) $raw)[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        return 'unknown';
    }

    private function assertFromEmailDomain(): void
    {
        $from = strtolower($this->config['from_email']);
        if (!preg_match('/@touchlabs\.it$/', $from)) {
            error_log('Contact form: SMTP_FROM_EMAIL must use @touchlabs.it domain.');
            throw new RuntimeException(json_encode([
                'ok' => false,
                'error' => 'Servizio email non configurato correttamente. Contattaci a info@touchlabs.it.',
            ]));
        }
    }

    private function isHoneypotTriggered(array $post): bool
    {
        return trim((string) ($post['website'] ?? '')) !== '';
    }

    private function checkRateLimit(string $ip): void
    {
        $file = sys_get_temp_dir() . '/touchlabs_contact_' . md5($ip);
        if (!is_readable($file)) {
            return;
        }
        $last = (int) file_get_contents($file);
        if (time() - $last < $this->config['rate_limit']) {
            throw new RuntimeException(json_encode([
                'ok' => false,
                'error' => 'Troppe richieste. Attendi un minuto prima di riprovare.',
            ]));
        }
    }

    private function markRateLimit(string $ip): void
    {
        $file = sys_get_temp_dir() . '/touchlabs_contact_' . md5($ip);
        file_put_contents($file, (string) time());
    }

    private function validate(array $post): array
    {
        $name = $this->sanitizeText($post['name'] ?? '', 120);
        $email = filter_var(trim((string) ($post['email'] ?? '')), FILTER_VALIDATE_EMAIL);
        $company = $this->sanitizeText($post['company'] ?? '', 160);
        $phone = $this->sanitizeText($post['phone'] ?? '', 40);
        $interest = $this->sanitizeText($post['interest'] ?? '', 80);
        $message = $this->sanitizeText($post['message'] ?? '', 5000);
        $consent = ($post['privacy_consent'] ?? '') === '1' || ($post['privacy_consent'] ?? '') === 'on';

        $errors = [];
        if ($name === '') {
            $errors['name'] = 'Inserisci il nome.';
        }
        if (!$email) {
            $errors['email'] = 'Inserisci un indirizzo email valido.';
        }
        if ($message === '') {
            $errors['message'] = 'Inserisci un messaggio.';
        }
        if (!$consent) {
            $errors['privacy_consent'] = 'È necessario accettare l\'informativa privacy.';
        }

        if ($errors) {
            throw new RuntimeException(json_encode(['ok' => false, 'errors' => $errors]));
        }

        return compact('name', 'email', 'company', 'phone', 'interest', 'message');
    }

    private function sanitizeText(string $value, int $max): string
    {
        $value = trim(strip_tags($value));
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '';
        if (mb_strlen($value) > $max) {
            $value = mb_substr($value, 0, $max);
        }
        return $value;
    }

    private function sendMail(array $data): void
    {
        if ($this->config['smtp_host'] === '') {
            throw new RuntimeException(json_encode([
                'ok' => false,
                'error' => 'Servizio email non configurato. Contattaci a info@touchlabs.it.',
            ]));
        }

        $interestLabels = [
            'software-engineering' => 'Software Engineering',
            'software-custom' => 'Software Engineering',
            'intelligenza-artificiale' => 'Intelligenza Artificiale',
            'ai-applicata' => 'Intelligenza Artificiale',
            'spatial-computing' => 'Spatial Computing',
            'digital-experience' => 'Digital Experience',
            'sito-piattaforma' => 'Sito / piattaforma web',
            'altro' => 'Altro',
        ];

        $interestLabel = $interestLabels[$data['interest']] ?? ($data['interest'] ?: '—');

        $subject = 'Nuova richiesta da ' . $data['name'] . ' — Touchlabs';
        $body = "Nuova richiesta dal form contatti\n\n"
            . "Nome: {$data['name']}\n"
            . "Email: {$data['email']}\n"
            . "Azienda: " . ($data['company'] ?: '—') . "\n"
            . "Telefono: " . ($data['phone'] ?: '—') . "\n"
            . "Area di interesse: {$interestLabel}\n\n"
            . "Messaggio:\n{$data['message']}\n";

        $mailer = new SmtpMailer($this->config);
        try {
            $mailer->send($this->config['to_email'], $subject, $body, (string) $data['email'], $data['name']);
        } catch (RuntimeException $e) {
            error_log('Contact form SMTP failure.');
            throw new RuntimeException(json_encode([
                'ok' => false,
                'error' => 'Invio non riuscito. Riprova più tardi o scrivi a info@touchlabs.it.',
            ]));
        }
    }
}

final class SmtpMailer
{
    public function __construct(private array $config) {}

    public function send(string $to, string $subject, string $body, string $replyTo, string $replyName): void
    {
        $host = $this->config['smtp_host'];
        $port = $this->config['smtp_port'];
        $secure = $this->config['smtp_secure'];
        $prefix = $secure === 'ssl' ? 'ssl://' : '';

        $socket = @stream_socket_client(
            $prefix . $host . ':' . $port,
            $errno,
            $errstr,
            15,
            STREAM_CLIENT_CONNECT
        );

        if (!$socket) {
            error_log('Contact form: SMTP connection failed.');
            throw new RuntimeException('smtp_connection_failed');
        }

        stream_set_timeout($socket, 15);
        $this->expect($socket, [220]);
        $this->cmd($socket, 'EHLO touchlabs.it');
        $this->expect($socket, [250]);

        if ($secure === 'tls') {
            $this->cmd($socket, 'STARTTLS');
            $this->expect($socket, [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                error_log('Contact form: SMTP TLS negotiation failed.');
                throw new RuntimeException('smtp_tls_failed');
            }
            $this->cmd($socket, 'EHLO touchlabs.it');
            $this->expect($socket, [250]);
        }

        if ($this->config['smtp_user'] !== '') {
            $this->cmd($socket, 'AUTH LOGIN');
            $this->expect($socket, [334]);
            $this->cmd($socket, base64_encode($this->config['smtp_user']));
            $this->expect($socket, [334]);
            $this->cmd($socket, base64_encode($this->config['smtp_pass']));
            $this->expect($socket, [235]);
        }

        $from = $this->config['from_email'];
        $this->cmd($socket, 'MAIL FROM:<' . $from . '>');
        $this->expect($socket, [250]);
        $this->cmd($socket, 'RCPT TO:<' . $to . '>');
        $this->expect($socket, [250, 251]);
        $this->cmd($socket, 'DATA');
        $this->expect($socket, [354]);

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $headers = "From: {$this->config['from_name']} <{$from}>\r\n"
            . "Reply-To: {$replyName} <{$replyTo}>\r\n"
            . "MIME-Version: 1.0\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . "Content-Transfer-Encoding: 8bit\r\n"
            . "Subject: {$encodedSubject}\r\n\r\n"
            . $body . "\r\n.";

        fwrite($socket, $headers . "\r\n");
        $this->expect($socket, [250]);
        $this->cmd($socket, 'QUIT');
        fclose($socket);
    }

    private function cmd($socket, string $cmd): void
    {
        fwrite($socket, $cmd . "\r\n");
    }

    private function expect($socket, array $codes): void
    {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $codes, true)) {
            error_log('Contact form: unexpected SMTP response code ' . $code);
            throw new RuntimeException('smtp_unexpected_response');
        }
    }
}
