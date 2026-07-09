<?php
/**
 * Touchlabs — Contact form API
 * POST /api/contact.php
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metodo non consentito.']);
    exit;
}

require_once __DIR__ . '/lib/ContactHandler.php';

try {
    $handler = new ContactHandler(__DIR__);
    $result = $handler->handle($_POST, $_SERVER);
    echo json_encode($result);
} catch (RuntimeException $e) {
    $decoded = json_decode($e->getMessage(), true);
    if (is_array($decoded)) {
        if (!empty($decoded['errors'])) {
            http_response_code(422);
        } elseif (!empty($decoded['error'])) {
            if (str_contains($decoded['error'], 'Troppe richieste')) {
                http_response_code(429);
            } elseif (str_contains($decoded['error'], 'non configurato')) {
                http_response_code(503);
            } else {
                http_response_code(400);
            }
        }
        echo json_encode($decoded);
        exit;
    }
    if (http_response_code() < 400) {
        http_response_code(500);
    }
    error_log('Contact form: unhandled runtime error.');
    echo json_encode(['ok' => false, 'error' => 'Errore interno. Riprova più tardi o scrivi a info@touchlabs.it.']);
} catch (Throwable $e) {
    error_log('Contact form: internal error.');
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Errore interno. Riprova più tardi o scrivi a info@touchlabs.it.']);
}
