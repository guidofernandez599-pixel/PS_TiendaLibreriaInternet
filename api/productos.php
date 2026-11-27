<?php
/**
 * API de catálogo e inventario (RF-01, RF-02, RF-09, RF-10).
 * GET: catálogo público con disponibilidad calculada (stock > 0).
 * POST: registrar producto nuevo (solo admin).
 * PUT / PATCH: actualizar precio y stock de producto existente (solo admin).
 */

require_once __DIR__ . '/conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = obtenerConexion();

    if ($metodo === 'GET') {
        $categorias = $pdo->query('SELECT id, clave, nombre, descripcion, imagen FROM categorias ORDER BY id')->fetchAll();

        $sql = '
            SELECT
                p.id,
                p.nombre,
                p.categoria_id,
                c.clave AS categoria,
                c.nombre AS categoria_nombre,
                p.precio,
                p.unidad,
                p.stock,
                (p.stock > 0) AS disponible,
                p.imagen,
                v.nombre AS proveedor
            FROM productos p
            JOIN categorias c ON c.id = p.categoria_id
            LEFT JOIN proveedores v ON v.id = p.proveedor_id
            ORDER BY p.id
        ';
        $filas = $pdo->query($sql)->fetchAll();

        $productos = array_map(static function (array $p): array {
            return [
                'id'               => (int)$p['id'],
                'nombre'           => $p['nombre'],
                'categoria_id'     => (int)$p['categoria_id'],
                'categoria'        => $p['categoria'],
                'categoria_nombre' => $p['categoria_nombre'],
                'precio'           => (float)$p['precio'],
                'unidad'           => $p['unidad'],
                'stock'            => (int)$p['stock'],
                'disponible'       => (bool)$p['disponible'],
                'imagen'           => $p['imagen'],
                'proveedor'        => $p['proveedor'],
            ];
        }, $filas);

        responderJson([
            'categorias' => $categorias,
            'productos'  => $productos,
        ]);
    }

    if ($metodo === 'POST') {
        requerirAdmin();
        $entrada = leerJsonEntrada();

        $nombre = trim((string)($entrada['nombre'] ?? ''));
        $categoriaClave = trim((string)($entrada['categoria'] ?? ''));
        $categoriaId = isset($entrada['categoria_id']) ? (int)$entrada['categoria_id'] : 0;
        $precio = isset($entrada['precio']) ? (float)$entrada['precio'] : -1;
        $unidad = trim((string)($entrada['unidad'] ?? 'unidad'));
        $stock = isset($entrada['stock']) ? (int)$entrada['stock'] : -1;
        $imagen = trim((string)($entrada['imagen'] ?? 'imagenes/materiales.jfif'));

        if ($imagen === '') {
            $imagen = 'imagenes/materiales.jfif';
        }

        if ($categoriaId <= 0 && $categoriaClave !== '') {
            $stmtCat = $pdo->prepare('SELECT id FROM categorias WHERE clave = ? LIMIT 1');
            $stmtCat->execute([$categoriaClave]);
            $cat = $stmtCat->fetch();
            if ($cat) {
                $categoriaId = (int)$cat['id'];
            }
        }

        if ($nombre === '' || $categoriaId <= 0 || $precio <= 0 || $unidad === '' || $stock < 0) {
            responderJson([
                'error' => 'Datos inválidos. Verifica nombre, categoría, precio mayor a 0, unidad y stock >= 0.'
            ], 400);
        }

        $stmt = $pdo->prepare('
            INSERT INTO productos (nombre, categoria_id, precio, unidad, stock, imagen)
            VALUES (?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([$nombre, $categoriaId, $precio, $unidad, $stock, $imagen]);
        $nuevoId = (int)$pdo->lastInsertId();

        responderJson([
            'ok'      => true,
            'id'      => $nuevoId,
            'mensaje' => 'Producto registrado correctamente.',
        ], 201);
    }

    if ($metodo === 'PUT' || $metodo === 'PATCH') {
        requerirAdmin();
        $entrada = leerJsonEntrada();

        $id = isset($entrada['id']) ? (int)$entrada['id'] : 0;
        $precio = isset($entrada['precio']) ? (float)$entrada['precio'] : -1;
        $stock = isset($entrada['stock']) ? (int)$entrada['stock'] : -1;

        if ($id <= 0 || $precio <= 0 || $stock < 0) {
            responderJson([
                'error' => 'Datos inválidos. Se requiere id, precio mayor a 0 y stock >= 0.'
            ], 400);
        }

        $stmt = $pdo->prepare('UPDATE productos SET precio = ?, stock = ? WHERE id = ?');
        $stmt->execute([$precio, $stock, $id]);

        if ($stmt->rowCount() === 0) {
            $check = $pdo->prepare('SELECT id FROM productos WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetch()) {
                responderJson(['error' => 'Producto no encontrado.'], 404);
            }
        }

        responderJson([
            'ok'      => true,
            'id'      => $id,
            'precio'  => $precio,
            'stock'   => $stock,
            'mensaje' => 'Inventario actualizado correctamente.',
        ]);
    }

    responderJson(['error' => 'Método no permitido.'], 405);
} catch (Throwable $e) {
    responderJson(['error' => 'Error en el servidor: ' . $e->getMessage()], 500);
}
