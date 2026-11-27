<?php
/**
 * API de reservas (RF-03 a RF-08, RF-11, RF-12, HU-01, HU-03, HU-04).
 * POST: registrar reserva pública y descontar stock en transacción.
 * GET: listar reservas (solo admin), conteo de hoy y filtro por nombre/celular.
 * PATCH: marcar como entregada, cancelar (reintegrando stock) o revertir estado (solo admin).
 */

require_once __DIR__ . '/conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = obtenerConexion();

    if ($metodo === 'POST') {
        $entrada = leerJsonEntrada();

        $nombre = trim((string)($entrada['cliente_nombre'] ?? $entrada['nombre'] ?? ''));
        $celular = trim((string)($entrada['cliente_celular'] ?? $entrada['telefono'] ?? ''));
        $fechaRetiro = trim((string)($entrada['fecha_retiro'] ?? $entrada['fecha'] ?? ''));
        $notas = trim((string)($entrada['notas'] ?? ''));

        $items = $entrada['items'] ?? [];
        if ((!is_array($items) || count($items) === 0) && !empty($entrada['producto_id'])) {
            $items = [[
                'producto_id' => (int)$entrada['producto_id'],
                'cantidad'    => (int)($entrada['cantidad'] ?? 1),
            ]];
        }

        // RF-04 & RNF-03: validar campos obligatorios
        if ($nombre === '' || $celular === '' || $fechaRetiro === '' || !is_array($items) || count($items) === 0) {
            responderJson([
                'error' => 'Completa los campos obligatorios: nombre, celular, producto, cantidad y fecha de retiro.'
            ], 400);
        }

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaRetiro)) {
            responderJson(['error' => 'Formato de fecha inválido.'], 400);
        }

        $hoy = date('Y-m-d');
        if ($fechaRetiro < $hoy) {
            responderJson(['error' => 'La fecha de retiro no puede ser anterior a hoy.'], 400);
        }

        // Agrupar por producto_id por si se repite en la lista
        $agrupados = [];
        foreach ($items as $it) {
            $pid = (int)($it['producto_id'] ?? 0);
            $cant = (int)($it['cantidad'] ?? 0);
            if ($pid <= 0 || $cant <= 0) {
                responderJson(['error' => 'Cada artículo debe tener un producto válido y cantidad mayor a 0.'], 400);
            }
            $agrupados[$pid] = ($agrupados[$pid] ?? 0) + $cant;
        }

        $pdo->beginTransaction();

        $stmtProd = $pdo->prepare('SELECT id, nombre, precio, stock FROM productos WHERE id = ? FOR UPDATE');
        $detallesValidados = [];

        foreach ($agrupados as $pid => $cant) {
            $stmtProd->execute([$pid]);
            $prod = $stmtProd->fetch();
            if (!$prod) {
                $pdo->rollBack();
                responderJson(['error' => "El producto #{$pid} no existe en el catálogo."], 404);
            }
            if ((int)$prod['stock'] < $cant) {
                $pdo->rollBack();
                responderJson([
                    'error' => "Stock insuficiente para \"{$prod['nombre']}\". Disponibles: {$prod['stock']}."
                ], 409);
            }
            $detallesValidados[] = [
                'producto_id'     => (int)$prod['id'],
                'cantidad'        => $cant,
                'precio_unitario' => (float)$prod['precio'],
            ];
        }

        $stmtRes = $pdo->prepare('
            INSERT INTO reservas (cliente_nombre, cliente_celular, fecha_retiro, notas, estado)
            VALUES (?, ?, ?, ?, "activa")
        ');
        $stmtRes->execute([$nombre, $celular, $fechaRetiro, $notas !== '' ? $notas : null]);
        $reservaId = (int)$pdo->lastInsertId();

        $stmtDet = $pdo->prepare('
            INSERT INTO reserva_detalle (reserva_id, producto_id, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)
        ');
        $stmtStock = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');

        foreach ($detallesValidados as $det) {
            $stmtDet->execute([$reservaId, $det['producto_id'], $det['cantidad'], $det['precio_unitario']]);
            $stmtStock->execute([$det['cantidad'], $det['producto_id']]);
        }

        $pdo->commit();

        responderJson([
            'ok'         => true,
            'reserva_id' => $reservaId,
            'mensaje'    => "Reserva #{$reservaId} registrada correctamente. El stock fue actualizado.",
        ], 201);
    }

    if ($metodo === 'GET') {
        requerirAdmin();

        $estado = trim((string)($_GET['estado'] ?? 'activa'));
        $q = trim((string)($_GET['q'] ?? ''));

        $reservasHoy = (int)$pdo
            ->query("SELECT COUNT(*) FROM reservas WHERE estado = 'activa' AND fecha_retiro = CURDATE()")
            ->fetchColumn();

        $condiciones = [];
        $params = [];

        if ($estado !== 'todas' && in_array($estado, ['activa', 'entregada', 'cancelada'], true)) {
            $condiciones[] = 'r.estado = ?';
            $params[] = $estado;
        }

        if ($q !== '') {
            $condiciones[] = '(r.cliente_nombre LIKE ? OR r.cliente_celular LIKE ?)';
            $like = '%' . $q . '%';
            $params[] = $like;
            $params[] = $like;
        }

        $where = count($condiciones) > 0 ? ('WHERE ' . implode(' AND ', $condiciones)) : '';

        $sql = "
            SELECT r.id, r.cliente_nombre, r.cliente_celular, r.fecha_retiro, r.notas, r.estado, r.creado
            FROM reservas r
            {$where}
            ORDER BY r.fecha_retiro ASC, r.id ASC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $reservas = $stmt->fetchAll();

        if (count($reservas) > 0) {
            $ids = array_column($reservas, 'id');
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $stmtDet = $pdo->prepare("
                SELECT d.reserva_id, d.producto_id, p.nombre AS producto_nombre, d.cantidad, d.precio_unitario
                FROM reserva_detalle d
                JOIN productos p ON p.id = d.producto_id
                WHERE d.reserva_id IN ({$placeholders})
                ORDER BY d.id
            ");
            $stmtDet->execute($ids);
            $detallesPorReserva = [];
            foreach ($stmtDet->fetchAll() as $d) {
                $rid = (int)$d['reserva_id'];
                $detallesPorReserva[$rid][] = [
                    'producto_id'     => (int)$d['producto_id'],
                    'producto_nombre' => $d['producto_nombre'],
                    'cantidad'        => (int)$d['cantidad'],
                    'precio_unitario' => (float)$d['precio_unitario'],
                ];
            }

            foreach ($reservas as &$r) {
                $rid = (int)$r['id'];
                $r['id'] = $rid;
                $r['items'] = $detallesPorReserva[$rid] ?? [];
                $total = 0.0;
                foreach ($r['items'] as $it) {
                    $total += $it['cantidad'] * $it['precio_unitario'];
                }
                $r['total'] = round($total, 2);
            }
            unset($r);
        }

        responderJson([
            'reservas_hoy' => $reservasHoy,
            'reservas'     => $reservas,
        ]);
    }

    if ($metodo === 'PATCH') {
        requerirAdmin();
        $entrada = leerJsonEntrada();

        $id = isset($entrada['id']) ? (int)$entrada['id'] : 0;
        $nuevoEstado = trim((string)($entrada['estado'] ?? ''));

        if ($id <= 0 || !in_array($nuevoEstado, ['activa', 'entregada', 'cancelada'], true)) {
            responderJson(['error' => 'Solicitud inválida.'], 400);
        }

        $pdo->beginTransaction();

        $stmtRes = $pdo->prepare('SELECT id, estado FROM reservas WHERE id = ? FOR UPDATE');
        $stmtRes->execute([$id]);
        $reserva = $stmtRes->fetch();

        if (!$reserva) {
            $pdo->rollBack();
            responderJson(['error' => 'Reserva no encontrada.'], 404);
        }

        $estadoActual = $reserva['estado'];
        if ($estadoActual === $nuevoEstado) {
            $pdo->commit();
            responderJson(['ok' => true, 'estado' => $nuevoEstado]);
        }

        $stmtDet = $pdo->prepare('SELECT producto_id, cantidad FROM reserva_detalle WHERE reserva_id = ?');
        $stmtDet->execute([$id]);
        $detalles = $stmtDet->fetchAll();

        // Si pasa a cancelada desde activa/entregada: reintegrar stock (RF-08)
        if ($nuevoEstado === 'cancelada' && $estadoActual !== 'cancelada') {
            $stmtSumar = $pdo->prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');
            foreach ($detalles as $d) {
                $stmtSumar->execute([(int)$d['cantidad'], (int)$d['producto_id']]);
            }
        }

        // Si se revierte desde cancelada a activa/entregada: validar y descontar stock (HU-04 #3)
        if ($estadoActual === 'cancelada' && $nuevoEstado !== 'cancelada') {
            $stmtCheck = $pdo->prepare('SELECT nombre, stock FROM productos WHERE id = ? FOR UPDATE');
            $stmtRestar = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');

            foreach ($detalles as $d) {
                $stmtCheck->execute([(int)$d['producto_id']]);
                $prod = $stmtCheck->fetch();
                if (!$prod || (int)$prod['stock'] < (int)$d['cantidad']) {
                    $pdo->rollBack();
                    $nombreProd = $prod ? $prod['nombre'] : '#' . $d['producto_id'];
                    $disp = $prod ? (int)$prod['stock'] : 0;
                    responderJson([
                        'error' => "No se puede reactivar: stock insuficiente para \"{$nombreProd}\" (disponibles: {$disp})."
                    ], 409);
                }
                $stmtRestar->execute([(int)$d['cantidad'], (int)$d['producto_id']]);
            }
        }

        $stmtUpd = $pdo->prepare('UPDATE reservas SET estado = ? WHERE id = ?');
        $stmtUpd->execute([$nuevoEstado, $id]);

        $pdo->commit();

        responderJson([
            'ok'      => true,
            'id'      => $id,
            'estado'  => $nuevoEstado,
            'mensaje' => "Reserva #{$id} actualizada a '{$nuevoEstado}'.",
        ]);
    }

    responderJson(['error' => 'Método no permitido.'], 405);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    responderJson(['error' => 'Error en el servidor: ' . $e->getMessage()], 500);
}
