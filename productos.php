<?php
/* ═══════════════════════════════════════════════════════════════════════════
   Endpoint: devuelve los productos en JSON - Level Up Store

   Usos:
       GET productos.php                      devuelve todo el catálogo
       GET productos.php?categoria=1          filtra por categoria_id
       GET productos.php?categoria=escolares  filtra por clave de categoría
   ═══════════════════════════════════════════════════════════════════════════ */

require 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

$categoria = $_GET['categoria'] ?? null;

$sql = "
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
";

$esId = false;
if ($categoria !== null && $categoria !== '') {
    $esId = ctype_digit((string) $categoria);
    $sql .= $esId ? " WHERE p.categoria_id = :categoria" : " WHERE c.clave = :categoria";
}

$sql .= " ORDER BY p.id";

$consulta = $pdo->prepare($sql);

if ($categoria !== null && $categoria !== '') {
    if ($esId) {
        $consulta->bindValue(':categoria', (int) $categoria, PDO::PARAM_INT);
    } else {
        $consulta->bindValue(':categoria', (string) $categoria, PDO::PARAM_STR);
    }
}

$consulta->execute();
$filas = $consulta->fetchAll();

foreach ($filas as &$fila) {
    $fila['id']           = (int)   $fila['id'];
    $fila['categoria_id'] = (int)   $fila['categoria_id'];
    $fila['precio']       = (float) $fila['precio'];
    $fila['stock']        = (int)   $fila['stock'];
    $fila['disponible']   = (bool)  $fila['disponible'];
}
unset($fila);

echo json_encode($filas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
