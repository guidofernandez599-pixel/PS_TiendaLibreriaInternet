<?php
/* ═══════════════════════════════════════════════════════════════════════════
   Endpoint de reservas/pedidos - Internet Librería Level Up Store

   Usos:
       GET  pedidos.php                          reservas activas de hoy
       GET  pedidos.php?fecha=2026-11-27         reservas activas de ese día
       GET  pedidos.php?cliente=maria            buscar por nombre o celular
       GET  pedidos.php?estado=activa            listar por estado (activa|entregada|cancelada|todas)
       POST pedidos.php                          registrar una reserva (JSON)
       POST pedidos.php?accion=entregar&id=3     marcar reserva como entregada
       POST pedidos.php?accion=cancelar&id=3     cancelar reserva y reintegrar stock
   ═══════════════════════════════════════════════════════════════════════════ */

require 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function fecha_valida(string $texto): bool
{
    if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $texto, $partes)) {
        return false;
    }
    return checkdate((int) $partes[2], (int) $partes[3], (int) $partes[1]);
}

function adjuntar_detalles(PDO $pdo, array $reservas): array
{
    if (count($reservas) === 0) {
        return [];
    }

    $ids = array_column($reservas, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmtDet = $pdo->prepare("
        SELECT d.reserva_id, d.producto_id, p.nombre AS producto, d.cantidad, d.precio_unitario
        FROM reserva_detalle d
        JOIN productos p ON p.id = d.producto_id
        WHERE d.reserva_id IN ({$placeholders})
        ORDER BY d.id
    ");
    $stmtDet->execute($ids);

    $porReserva = [];
    foreach ($stmtDet->fetchAll() as $d) {
        $rid = (int) $d['reserva_id'];
        $porReserva[$rid][] = [
            'producto_id'     => (int)   $d['producto_id'],
            'producto'        => $d['producto'],
            'cantidad'        => (int)   $d['cantidad'],
            'precio_unitario' => (float) $d['precio_unitario'],
        ];
    }

    foreach ($reservas as &$r) {
        $rid = (int) $r['id'];
        $r['id'] = $rid;
        $r['items'] = $porReserva[$rid] ?? [];
        $total = 0.0;
        foreach ($r['items'] as $it) {
            $total += $it['cantidad'] * $it['precio_unitario'];
        }
        $r['total'] = round($total, 2);
    }
    unset($r);

    return $reservas;
}

$metodo = $_SERVER['REQUEST_METHOD'];

/* ── GET: listar reservas ─────────────────────────────────────────────────── */

if ($metodo === 'GET') {
    $base = "
        SELECT r.id, r.cliente_nombre, r.cliente_celular,
               r.fecha_retiro, r.notas, r.estado, r.creado
        FROM reservas r
    ";

    if (isset($_GET['cliente'])) {
        $termino = '%' . trim((string) $_GET['cliente']) . '%';
        $consulta = $pdo->prepare($base . "
            WHERE r.cliente_nombre LIKE :nombre OR r.cliente_celular LIKE :celular
            ORDER BY r.fecha_retiro ASC, r.id ASC
        ");
        $consulta->bindValue(':nombre', $termino);
        $consulta->bindValue(':celular', $termino);
    } elseif (isset($_GET['estado'])) {
        $estado = (string) $_GET['estado'];
        if ($estado === 'todas') {
            $consulta = $pdo->prepare($base . " ORDER BY r.fecha_retiro ASC, r.id ASC");
        } elseif (in_array($estado, ['activa', 'entregada', 'cancelada'], true)) {
            $consulta = $pdo->prepare($base . "
                WHERE r.estado = :estado
                ORDER BY r.fecha_retiro ASC, r.id ASC
            ");
            $consulta->bindValue(':estado', $estado);
        } else {
            responder(400, ['error' => 'Estado inválido. Usa activa, entregada, cancelada o todas']);
        }
    } else {
        $fecha = $_GET['fecha'] ?? null;
        if ($fecha !== null && !fecha_valida($fecha)) {
            responder(400, ['error' => 'La fecha tiene que tener la forma AAAA-MM-DD']);
        }
        $consulta = $pdo->prepare($base . "
            WHERE r.fecha_retiro = COALESCE(:fecha, CURDATE())
              AND r.estado = 'activa'
            ORDER BY r.id ASC
        ");
        $consulta->bindValue(':fecha', $fecha, $fecha === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    }

    $consulta->execute();
    $reservas = adjuntar_detalles($pdo, $consulta->fetchAll());
    responder(200, $reservas);
}

/* ── POST ?accion=entregar: marcar como entregada ─────────────────────────── */

if ($metodo === 'POST' && ($_GET['accion'] ?? '') === 'entregar') {
    $id = filter_var($_GET['id'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        responder(400, ['error' => 'Falta el número de reserva']);
    }

    $consulta = $pdo->prepare("UPDATE reservas SET estado = 'entregada' WHERE id = :id AND estado = 'activa'");
    $consulta->bindValue(':id', $id, PDO::PARAM_INT);
    $consulta->execute();

    if ($consulta->rowCount() === 0) {
        responder(404, ['error' => 'Esa reserva no existe o ya no está activa']);
    }
    responder(200, ['ok' => true, 'estado' => 'entregada']);
}

/* ── POST ?accion=cancelar: cancelar y reintegrar stock ───────────────────── */

if ($metodo === 'POST' && ($_GET['accion'] ?? '') === 'cancelar') {
    $id = filter_var($_GET['id'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        responder(400, ['error' => 'Falta el número de reserva']);
    }

    try {
        $pdo->beginTransaction();

        $stmtRes = $pdo->prepare('SELECT id, estado FROM reservas WHERE id = ? FOR UPDATE');
        $stmtRes->execute([$id]);
        $reserva = $stmtRes->fetch();

        if (!$reserva) {
            $pdo->rollBack();
            responder(404, ['error' => 'Esa reserva no existe']);
        }
        if ($reserva['estado'] === 'cancelada') {
            $pdo->rollBack();
            responder(400, ['error' => 'La reserva ya estaba cancelada']);
        }

        $stmtDet = $pdo->prepare('SELECT producto_id, cantidad FROM reserva_detalle WHERE reserva_id = ?');
        $stmtDet->execute([$id]);
        $stmtSumar = $pdo->prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');

        foreach ($stmtDet->fetchAll() as $det) {
            $stmtSumar->execute([(int) $det['cantidad'], (int) $det['producto_id']]);
        }

        $pdo->prepare("UPDATE reservas SET estado = 'cancelada' WHERE id = ?")->execute([$id]);
        $pdo->commit();

        responder(200, ['ok' => true, 'estado' => 'cancelada']);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log($e->getMessage());
        responder(500, ['error' => 'No se pudo cancelar la reserva']);
    }
}

/* ── POST: registrar una reserva nueva ────────────────────────────────────── */

if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    if (!is_array($datos)) {
        responder(400, ['error' => 'Los datos no llegaron como JSON']);
    }

    $clienteRaw = $datos['cliente_nombre'] ?? $datos['cliente'] ?? $datos['nombre'] ?? null;
    $celularRaw = $datos['cliente_celular'] ?? $datos['celular'] ?? $datos['telefono'] ?? null;
    $fechaRaw   = $datos['fecha_retiro'] ?? $datos['fecha_entrega'] ?? $datos['fecha'] ?? null;
    $notasRaw   = $datos['notas'] ?? '';

    $cliente = is_string($clienteRaw) ? trim($clienteRaw) : '';
    $celular = is_string($celularRaw) ? trim($celularRaw) : '';
    $fecha   = is_string($fechaRaw)   ? trim($fechaRaw)   : '';
    $notas   = is_string($notasRaw)   ? trim($notasRaw)   : '';

    if ($cliente === '') {
        responder(400, ['error' => 'Falta el nombre del comprador', 'campo' => 'cliente_nombre']);
    }
    if ($celular === '') {
        responder(400, ['error' => 'Falta el número de celular', 'campo' => 'cliente_celular']);
    }
    if (!fecha_valida($fecha)) {
        responder(400, ['error' => 'Falta una fecha de retiro válida (AAAA-MM-DD)', 'campo' => 'fecha_retiro']);
    }
    if ($fecha < date('Y-m-d')) {
        responder(400, ['error' => 'La fecha de retiro no puede ser anterior a hoy', 'campo' => 'fecha_retiro']);
    }

    $itemsEntrada = $datos['items'] ?? null;
    if (!is_array($itemsEntrada) || count($itemsEntrada) === 0) {
        $productoId = filter_var($datos['producto_id'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        $cantidad   = filter_var($datos['cantidad'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($productoId === false) {
            responder(400, ['error' => 'Falta elegir el producto', 'campo' => 'producto_id']);
        }
        if ($cantidad === false) {
            responder(400, ['error' => 'La cantidad tiene que ser un número entero, al menos 1', 'campo' => 'cantidad']);
        }
        $itemsEntrada = [['producto_id' => $productoId, 'cantidad' => $cantidad]];
    }

    $agrupados = [];
    foreach ($itemsEntrada as $it) {
        $pid  = filter_var($it['producto_id'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        $cant = filter_var($it['cantidad'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($pid === false || $cant === false) {
            responder(400, ['error' => 'Cada artículo debe incluir un producto_id válido y cantidad mayor o igual a 1']);
        }
        $agrupados[$pid] = ($agrupados[$pid] ?? 0) + $cant;
    }

    $aviso  = null;
    $letras = preg_split('//u', $cliente, -1, PREG_SPLIT_NO_EMPTY);
    if (count($letras) > 100) {
        $cliente = implode('', array_slice($letras, 0, 100));
        $aviso   = 'El nombre era muy largo y se guardó cortado a 100 letras.';
    }

    try {
        $pdo->beginTransaction();

        $stmtProd = $pdo->prepare('SELECT id, nombre, precio, stock FROM productos WHERE id = ? FOR UPDATE');
        $detalles = [];

        foreach ($agrupados as $pid => $cant) {
            $stmtProd->execute([$pid]);
            $prod = $stmtProd->fetch();
            if (!$prod) {
                $pdo->rollBack();
                responder(400, ['error' => "El producto #{$pid} no existe", 'campo' => 'producto_id']);
            }
            if ((int) $prod['stock'] < $cant) {
                $pdo->rollBack();
                responder(409, [
                    'error' => "Stock insuficiente para \"{$prod['nombre']}\". Disponibles: {$prod['stock']}.",
                    'campo' => 'cantidad',
                ]);
            }
            $detalles[] = [
                'producto_id'     => (int) $prod['id'],
                'cantidad'        => $cant,
                'precio_unitario' => (float) $prod['precio'],
            ];
        }

        $stmtRes = $pdo->prepare("
            INSERT INTO reservas (cliente_nombre, cliente_celular, fecha_retiro, notas, estado)
            VALUES (:cliente, :celular, :fecha, :notas, 'activa')
        ");
        $stmtRes->bindValue(':cliente', $cliente);
        $stmtRes->bindValue(':celular', $celular);
        $stmtRes->bindValue(':fecha',   $fecha);
        $stmtRes->bindValue(':notas',   $notas !== '' ? $notas : null, $notas !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmtRes->execute();

        $reservaId = (int) $pdo->lastInsertId();

        $stmtDet   = $pdo->prepare('INSERT INTO reserva_detalle (reserva_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)');
        $stmtStock = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');

        foreach ($detalles as $d) {
            $stmtDet->execute([$reservaId, $d['producto_id'], $d['cantidad'], $d['precio_unitario']]);
            $stmtStock->execute([$d['cantidad'], $d['producto_id']]);
        }

        $pdo->commit();

        $respuesta = ['ok' => true, 'id' => $reservaId];
        if ($aviso !== null) {
            $respuesta['aviso'] = $aviso;
        }
        responder(201, $respuesta);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log($e->getMessage());
        responder(500, ['error' => 'No se pudo guardar la reserva']);
    }
}

responder(405, ['error' => 'Método no permitido']);
