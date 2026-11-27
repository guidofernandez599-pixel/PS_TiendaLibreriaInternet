<?php
/* ═══════════════════════════════════════════════════════════════════════════
   Conexión a la base de datos - Internet Librería Level Up Store
   ═══════════════════════════════════════════════════════════════════════════ */

date_default_timezone_set('America/La_Paz');

$host    = '127.0.0.1';
$base    = 'level_up_store';
$usuario = 'root';
$clave   = '';          // XAMPP viene sin contraseña para root

$dsn = "mysql:host=$host;dbname=$base;charset=utf8mb4";

$opciones = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $usuario, $clave, $opciones);
} catch (PDOException $e) {
    error_log('Error de conexión BD: ' . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No se pudo conectar a la base de datos'], JSON_UNESCAPED_UNICODE);
    exit;
}
