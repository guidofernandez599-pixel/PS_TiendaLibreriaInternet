# Especificación de requerimientos de software

## Plataforma web de inventario y reservas - Internet Librería Level Up Store

Estándar de referencia: IEEE 830-1998
Revisión 1.0 · 24 de noviembre de 2026

---

## 1. Introducción

### 1.1 Propósito

Definir de manera clara y comprobable las funciones y condiciones de operación que debe cumplir la plataforma web de inventario y reservas de Internet Librería Level Up Store, permitiendo evaluar objetivamente el software mediante pruebas al finalizar su construcción.

### 1.2 Alcance

El software abarca la administración del catálogo dividido por rubros, la consulta inmediata de precios y existencias, y el registro de reservas para retiro en tienda. Quedan fuera de esta versión la emisión de facturas electrónicas, el bloqueo automático de tiempo en las computadoras de internet y el envío automatizado de mensajes por WhatsApp desde el servidor, según los límites definidos en la propuesta.

### 1.3 Definiciones

| Concepto | Interpretación en este proyecto |
|---|---|
| **Reserva** | solicitud anticipada de uno o varios artículos realizada por un comprador para retirarlos en el local en una fecha acordada |
| **Reserva activa** | solicitud cuya fecha programada de retiro aún no ha vencido y que todavía no figura como entregada o cancelada |
| **Administrador** | propietario o encargado del mostrador autorizado para modificar existencias, precios y estados de reserva |
| **Comprador** | usuario externo que revisa el catálogo desde su navegador y envía una solicitud de reserva |

### 1.4 Referencias

Consultar la sección de marco teórico y el anexo del instrumento de recolección de datos del presente documento.

---

## 2. Requerimientos funcionales

| Código | Descripción del requerimiento | Prioridad | Origen |
|---|---|---|---|
| RF-01 | El sistema **debe** desplegar el catálogo organizado en las cuatro líneas del negocio (útiles escolares, regalos, cosméticos y servicios de internet) indicando precio, unidad de venta y disponibilidad | alta | alcance y revisión de 3 cuadernos |
| RF-02 | El sistema **debe** filtrar los artículos por categoría y buscar coincidencias por nombre mostrando los resultados al instante | alta | observación 18/11: demora de 4 minutos buscando en cuadernos |
| RF-03 | El sistema **debe** registrar reservas desde el navegador capturando nombre del comprador, celular, artículos, cantidades y fecha de retiro | alta | entrevista 18/11 |
| RF-04 | El sistema **debe** impedir el guardado de una reserva si se omite el nombre, el teléfono, la fecha de retiro o si la cantidad solicitada supera el stock disponible | alta | observación 18/11: apuntes en hojas sueltas sin numero de celular |
| RF-05 | El sistema **debe** descontar automáticamente las unidades reservadas del stock disponible al confirmarse una reserva | alta | observación 18/11: salidas sin restar en el cuaderno |
| RF-06 | El sistema **debe** presentar al administrador un listado de las reservas activas ordenadas cronológicamente por fecha de retiro | alta | entrevista 18/11 |
| RF-07 | El sistema **debe** permitir al administrador marcar una reserva activa como entregada | alta | flujo operativo de reservas |
| RF-08 | El sistema **debe** permitir al administrador cancelar una reserva activa reintegrando automáticamente las unidades al stock disponible | alta | entrevista 18/11 |
| RF-09 | El sistema **debe** habilitar al administrador para registrar artículos nuevos en el catálogo asignando categoría, precio, unidad y stock inicial | alta | revisión documental: 24 productos sin control de stock |
| RF-10 | El sistema **debe** permitir al administrador editar el precio y actualizar el stock disponible de los artículos existentes | alta | entrevista 18/11 |
| RF-11 | El sistema **debe** mostrar en pantalla el conteo de reservas activas programadas para la jornada actual | media | entrevista 18/11 |
| RF-12 | El sistema **debería** permitir filtrar el listado de reservas por nombre del comprador o número telefónico | baja | entrevista 18/11 |

---

## 3. Requerimientos no funcionales

| Código | Condición o criterio exigido | Método de comprobación |
|---|---|---|
| RNF-01 | La consulta de precio y existencias mediante el buscador **debe** devolver coincidencias en menos de **2 segundos** | cronometrar la respuesta en el navegador con el catálogo completo cargado |
| RNF-02 | El registro de una reserva o ajuste de inventario en el local **debe** completarse en un máximo de **60 segundos** por un operador con inducción básica | medir el tiempo de tres registros consecutivos con la propietaria |
| RNF-03 | El formulario de solicitud de reserva **debe** solicitar únicamente **5 campos obligatorios** (nombre, celular, producto, cantidad y fecha de retiro) para facilitar su llenado desde móviles | contar los campos marcados como requeridos en el formulario |
| RNF-04 | La interfaz web **debe** visualizarse en pantallas móviles desde **360 px** de ancho sin generar desplazamiento horizontal | probar la vista responsiva en el inspector del navegador a 360 px |
| RNF-05 | Los botones y controles táctiles principales **deben** medir al menos **44 × 44 px** para operarlos con comodidad en el mostrador | medir las dimensiones de los elementos en el inspector del navegador |
| RNF-06 | Los datos de inventario y reservas **deben** permanecer almacenados en la base de datos tras cerrar el navegador o reiniciar el equipo | cerrar el navegador, volver a abrir y verificar que los registros persisten |
| RNF-07 | El acceso al panel de edición de inventario y gestión de reservas **debe** requerir usuario y contraseña validados en el servidor | intentar abrir las rutas de administración sin haber iniciado sesión |

---

## 4. Secciones omitidas de la norma IEEE 830

Conforme al alcance y naturaleza de una aplicación web de gestión comercial pequeña, se excluyen explícitamente los siguientes apartados contemplados en la norma original:

- **Interfaces de hardware:** el software no se enlaza con periféricos especializados como lectores de código de barras o ticketeras térmicas, operando únicamente con dispositivos estándar de entrada (teclado, ratón o pantalla táctil).
- **Rendimiento en tiempo real estricto:** la operación del mostrador no demanda respuestas críticas a nivel de milisegundos, siendo suficientes los umbrales de respuesta definidos en RNF-01 y RNF-02. 
- **Portabilidad entre sistemas operativos:** al ejecutarse íntegramente sobre navegadores web modernos, la compatibilidad entre celulares Android, iOS o computadoras con Windows queda cubierta sin requerir adaptaciones por plataforma.