# Historias de usuario y criterios de aceptación

## Sistema de gestión de inventario y reservas - Internet Librería Level Up Store

---

## HU-01 · Registrar una reserva desde el catálogo

> **Como** comprador
> **quiero** registrar una reserva de productos indicando mis datos y la fecha de recojo en tienda
> **para** asegurar la disponibilidad de los artículos antes de ir hasta el local

**Requerimientos relacionados:** RF-01, RF-03, RF-04, RF-05, RNF-03

### Criterios de aceptación

| # | Dado que... | Cuando... | Entonces... |
|---|---|---|---|
| 1 | reviso el catálogo y selecciono artículos con stock disponible | completo nombre, teléfono, cantidad y fecha de recojo y confirmo | la reserva queda registrada, se descuenta el stock y se muestra un mensaje de confirmación |
| 2 | dejo vacío el nombre, el teléfono o la fecha de recojo | intento enviar el formulario de reserva | el sistema impide el guardado e indica qué campo obligatorio falta |
| 3 | solicito una cantidad mayor al stock disponible del producto | intento confirmar la reserva | el sistema rechaza la operación y muestra las unidades reales disponibles |
| 4 | elijo una fecha de recojo anterior al día actual | intento confirmar la reserva | el sistema no registra la solicitud y pide ingresar una fecha válida |

---

## HU-02 · Consultar precios y stock en mostrador en segundos

> **Como** administrador
> **quiero** buscar un producto por su nombre o filtrarlo por categoría desde el celular o la computadora
> **para** responder el precio y las unidades disponibles al cliente sin revisar los cuadernos físicos

**Requerimientos relacionados:** RF-01, RF-02, RNF-01, RNF-04, RNF-05

### Criterios de aceptación

| # | Dado que... | Cuando... | Entonces... |
|---|---|---|---|
| 1 | estoy en la vista del catálogo del local | escribo las primeras letras de un artículo o elijo una categoría | el sistema filtra y muestra el precio, la unidad y el stock actualizado en menos de 2 segundos |
| 2 | escribo el nombre de un artículo que no existe en el registro | espero los resultados de búsqueda | la pantalla muestra un aviso indicando que no hay coincidencias en lugar de quedar vacía |
| 3 | abro el sistema desde un teléfono móvil en el mostrador | navego por el buscador y los filtros | los elementos se adaptan al ancho de pantalla sin desplazarse hacia los costados |

---

## HU-03 · Revisar las reservas pendientes del día

> **Como** administrador
> **quiero** ver en una sola pantalla las reservas activas ordenadas por fecha de recojo y el total del día
> **para** preparar los artículos con anticipación mientras atiendo las máquinas de internet y el mostrador

**Requerimientos relacionados:** RF-06, RF-11, RF-12, RNF-07

### Criterios de aceptación

| # | Dado que... | Cuando... | Entonces... |
|---|---|---|---|
| 1 | inicié sesión en el panel de administración | abro la sección de reservas activas | visualizo el conteo de reservas de hoy y la lista ordenada desde la fecha de recojo más próxima |
| 2 | no existen reservas programadas para la jornada actual | ingreso al listado de reservas | el panel muestra un mensaje informando que no hay retiros pendientes para hoy |
| 3 | un cliente llama o escribe para consultar su reserva | escribo su nombre o número telefónico en el filtro | el sistema muestra únicamente las reservas asociadas a ese dato |

---

## HU-04 · Cerrar o cancelar una reserva en mostrador

> **Como** administrador
> **quiero** marcar una reserva como entregada cuando el cliente la recoge o cancelarla si desiste
> **para** mantener actualizada la lista de pendientes y liberar el stock si no se concreta el retiro

**Requerimientos relacionados:** RF-07, RF-08, RNF-02, RNF-06

### Criterios de aceptación

| # | Dado que... | Cuando... | Entonces... |
|---|---|---|---|
| 1 | el cliente acude a la tienda y retira sus productos | marco la reserva activa como entregada | la solicitud sale de la lista de pendientes y queda registrada como completada |
| 2 | un cliente cancela su solicitud antes de recogerla | cambio el estado de la reserva a cancelada | el sistema la retira de pendientes y devuelve automáticamente las unidades al stock del producto |
| 3 | cerré o cancelé una reserva por error en el mostrador | busco el registro en el historial de reservas | puedo ubicar la solicitud y revertir su estado verificando el saldo de stock |

---

## HU-05 · Actualizar precios y mercadería nueva en el inventario

> **Como** administrador
> **quiero** registrar artículos nuevos y modificar precios o cantidades disponibles desde el navegador
> **para** evitar que el inventario quede desactualizado cuando llega mercadería de La Paz

**Requerimientos relacionados:** RF-09, RF-10, RNF-02, RNF-06, RNF-07

### Criterios de aceptación

| # | Dado que... | Cuando... | Entonces... |
|---|---|---|---|
| 1 | llega mercadería nueva para librería, regalos o cosméticos | ingreso nombre, categoría, precio, unidad y stock inicial y guardo | el producto queda almacenado en la base de datos y aparece de inmediato en el catálogo |
| 2 | se vende mercadería directamente en mostrador o cambia un precio | edito el stock o la tarifa del artículo existente y confirmo | los cambios se guardan en la base de datos y persisten aunque se cierre el navegador |
| 3 | una persona sin sesión iniciada intenta abrir la ruta de edición | accede a la dirección del panel administrativo | el sistema bloquea el acceso y redirige al formulario de inicio de sesión |

---

## Mapa de historias

El mapa organiza el recorrido real del sistema desde que el cliente consulta y reserva hasta que el administrador gestiona el inventario y entrega el pedido en el local. La primera fila constituye el producto mínimo funcional que resuelve el problema principal de la tienda.

FLUJO →    Consultar y reservar    Controlar inventario     Gestionar y entregar

MÍNIMO     HU-01 registrar         HU-02 buscar precio      HU-03 ver reservas
reserva (5 campos)      y stock al instante      activas por fecha
────────────────────────────────────────────────────────────
MEJORAS    validación de stock     HU-05 alta y edición     HU-04 marcar entregada
en tiempo real          de productos y stock     o cancelar (reintegro)
────────────────────────────────────────────────────────────
DESPUÉS    bandeja múltiple        alerta visual de         filtro rápido por
desde el catálogo       stock bajo en panel      teléfono o cliente

La fila **Mínimo** cubre el núcleo operativo que sustituye la búsqueda lenta en los tres cuadernos físicos y las anotaciones en hojas sueltas. Las filas de **Mejoras** y **Después** completan el control de existencias y la gestión ante cancelaciones o errores de mostrador dentro del alcance definido para el proyecto.