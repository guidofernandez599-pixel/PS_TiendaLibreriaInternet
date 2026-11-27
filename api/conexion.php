<?php
/**
 * Conexión PDO a MySQL y utilidades JSON/sesión para Level Up Store.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

date_default_timezone_set('America/La_Paz');

const DB_HOST = '127.0.0.1';
const DB_NAME = 'level_up_store';
const DB_USER = 'root';
const DB_PASS = '';

function obtenerConexion(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $opciones = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $opciones);
    return $pdo;
}

function responderJson(array $datos, int $codigo = 200): void
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function leerJsonEntrada(): array
{
    $crudo = file_get_contents('php://input');
    if ($crudo !== false && trim($crudo) !== '') {
        $decodificado = json_decode($crudo, true);
        if (is_array($decodificado)) {
            return $decodificado;
        }
    }
    return $_POST;
}

function requerirAdmin(): void
{
    if (empty($_SESSION['admin_id'])) {
        responderJson([
            'error' => 'Acceso restringido. Inicia sesión como administrador.'
        ], 401);
    }
}
