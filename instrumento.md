
# Instrumento de recolección - Internet Librería Level Up Store

Proyecto: Sistema de gestión de inventario y pedidos 
Fecha de aplicación: 18 de noviembre de 2026

---
## Propósito

El presente instrumento tiene como propósito recopilar información detallada y verificable sobre la forma en que se administran los precios, las existencias y las reservas en la Tienda, Internet Librería Level Up. A diferencia de la entrevista inicial, esta herramienta permite observar el trabajo diario en mostrador y revisar los apuntes físicos para confirmar datos reales sobre demoras, desorden en los cuadernos y errores de registro. Los datos  obtenidos sirven de base para respaldar la formulación del problema y definir los requerimientos funcionales y no funcionales del sistema web

## Técnicas seleccionadas

| Técnica | A quién | Qué se busca | Por qué esta técnica |
|---|---|---|---|
| Entrevista semiestructurada | propietaria (Lucy Gladys Fernandez) | como se controlan precios, stock y reservas en las 3 categorias | requiere profundidad, y es quien administra el inventario |
| Observación directa | mostrador y área de internet, 2 horas | cómo se consultan precios y se anotan las reservas **de verdad** | lo que se hace en horas pico no siempre es lo que se dice |
| Revisión documental | 3 cuadernos de inventario (regalos, materiales escolares, cosméticos) | cantidad de productos sin stock y desorden en los apuntes | el dato ya existe, solo hay que revisarlo y contarlo |

No se aplica encuesta: el personal que atiende el negocio son los propietarios y quien trabaja en mostrador.
---

## Guía de entrevista



**Apertura**

1. Cuénteme cómo es una tarde normal en la tienda Level Up, desde que abren.
2. ¿En qué momentos del día se junta más gente en la tienda?

**El proceso actual**

3. Muestreme cómo busca el precio o si el producto esta disponible de un producto cuando un cliente pregunta. *(observar, sin interrumpir)*
4. ¿Cómo anota los productos nuevos cuando llega mercadería para regalos, escolares o cosméticos?
5. ¿Cómo registra cuando un cliente hace una reserva?
6. ¿Qué hacen cuando la persona que atiende no se acuerda del precio y donde estan los cuadernos guardados?

**Los problemas**

7. ¿Cuándo fue la última vez que se fue un cliente por no encontrar el precio o no saber si había stock? ¿Qué pasó?
8. ¿Con qué frecuencia pasa que se acaba un producto sin haberse dado cuenta antes?
9. ¿Qué hacen cuando se pierde o se daña una hoja con encargos y reservas?

**El contexto de uso**

10. ¿Qué hacen en el mostrador cuando entra un cliente a preguntar y estan ocupados?
11. ¿Quiénes pueden entrar a revisar stock, actualizar cantidades o ver las reservas?
12. ¿Usa el celular o la computadora durante la atención?

**Cierre**

13. Si pudiera cambiar algo de cómo llevan el inventario, los encargos y las reservas hoy, ¿cuál sería?
14. ¿Hay algo que no le pregunté sobre el movimiento de la tienda y que debería saber?

---

## Registro de la observación

| Momento | Qué se observó | Qué contradice o confirma |
|---|---|---|
| 16:20 | un cliente preguntó por el precio de un estuche; el que atiende buscó en 2 cuadernos durante 4 minutos | confirma la demora de 3 a 10 minutos declarada en la entrevista |
| 17:45 | se vendió el último peluche capibara y no se anotó la salida en ningun cuaderno | confirma que el stock no siempre se anota |
| 18:30 | un cliente pidió reservar un artículo por WhatsApp y se anotó en una hoja suelta junto al monitor | contradice "todo se anota en los cuadernos" y explica pérdidas de datos |

---

## Resultados que alimentan el documento

| Hallazgo | Dónde se usa |
|---|---|
| los productos se buscan hoja por hoja en 3 cuadernos distintos | formulación del problema (causa) y buscador en tiempo real |
| las ventas de mostrador no se descuentan al momento en el papel | requerimiento funcional de actualización automática de stock |
| las reservas que llegan por WhatsApp quedan en hojas sueltas sin teléfono o fecha | validación de campos obligatorios en el formulario de reservas |
| quien atiende alterna entre las máquinas de internet y el mostrador | requerimiento **no funcional**: búsqueda rápida, pocos clics y uso desde celular o PC |