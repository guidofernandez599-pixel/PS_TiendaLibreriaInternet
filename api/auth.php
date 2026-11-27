<?php
/**
 * Autenticación de administrador (RNF-07).
 * GET: verifica estado de sesión.
 * POST: inicia sesión o cierra sesión.
 */

require_once __DIR__ . '/conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    responderJson([
        'autenticado' => !empty($_SESSION['admin_id']),
        'usuario'     => $_SESSION['admin_usuario'] ?? null,
        'nombre'      => $_SESSION['admin_nombre'] ?? null,
    ]);
}

if ($metodo === 'POST') {
    $entrada = leerJsonEntrada();
    $accion = $entrada['accion'] ?? 'login';

    if ($accion === 'logout') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }
        session_destroy();
        responderJson(['autenticado' => false, 'mensaje' => 'Sesión cerrada.']);
    }

    $usuario = trim((string)($entrada['usuario'] ?? ''));
    $password = (string)($entrada['password'] ?? '');

    if ($usuario === '' || $password === '') {
        responderJson(['error' => 'Ingresa usuario y contraseña.'], 400);
    }

    try {
        $pdo = obtenerConexion();
        $stmt = $pdo->prepare('SELECT id, usuario, password_hash, nombre_completo FROM usuarios WHERE usuario = ? LIMIT 1');
        $stmt->execute([$usuario]);
        $fila = $stmt->fetch();

        if (!$fila || !password_verify($password, $fila['password_hash'])) {
            responderJson(['error' => 'Usuario o contraseña incorrectos.'], 401);
        }

        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int)$fila['id'];
        $_SESSION['admin_usuario'] = $fila['usuario'];
        $_SESSION['admin_nombre'] = $fila['nombre_completo'];

        responderJson([
            'autenticado' => true,
            'usuario'     => $fila['usuario'],
            'nombre'      => $fila['nombre_completo'],
        ]);
    } catch (Throwable $e) {
        responderJson(['error' => 'Error al validar credenciales: ' . $e->getMessage()], 500);
    }
}

responderJson(['error' => 'Método no permitido.'], 405);
