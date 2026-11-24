# Instrumento de recolección - Internet Librería Level Up Store

Proyecto: Sistema de gestión de inventario y reservas
Fecha de aplicación: 18 de noviembre de 2026
Responsable: Guido Fernandez Ajno

---

## Propósito

El presente instrumento tiene como propósito recopilar información detallada y verificable sobre la forma en que se administran los precios, las existencias y las reservas en Internet Librería Level Up Store. A diferencia de la entrevista inicial, esta herramienta permite observar el trabajo diario en mostrador y revisar los apuntes físicos para confirmar datos reales sobre demoras, desorden en los cuadernos y errores de registro. Los datos obtenidos sirven de base para respaldar la formulación del problema y definir los requerimientos funcionales y no funcionales del sistema web.

## Técnicas seleccionadas

| Técnica | A quién | Qué se busca | Por qué esta técnica |
|---|---|---|---|
| Entrevista semiestructurada | Propietaria (Lucy Gladys Fernandez Ajno) | Cómo se controlan precios, stock y reservas en las 3 categorías | Requiere profundidad y es quien administra el inventario |
| Observación directa | Mostrador y área de internet, 2 horas | Cómo se consultan precios y se anotan las reservas **de verdad** | Lo que se hace en horas pico no siempre es lo que se dice |
| Revisión documental | 3 cuadernos de inventario (regalos, materiales escolares, cosméticos) | Cantidad de productos sin stock y desorden en los apuntes | El dato ya existe, solo hay que revisarlo y contarlo |

No se aplica encuesta: el personal que atiende el negocio son los propietarios y quien trabaja en mostrador. Aplicar una encuesta a dos o tres personas daría menos información que una entrevista.

---

## Guía de entrevista

**Apertura**

1. Cuénteme cómo es una tarde normal en la tienda Level Up, desde que abren.
2. ¿En qué momentos del día se junta más gente en la tienda?

**El proceso actual**

3. Muéstreme cómo busca el precio o si el producto está disponible cuando un cliente pregunta. 
4. ¿Cómo anota los productos nuevos cuando llega mercadería para regalos, escolares o cosméticos?
5. ¿Cómo registra cuando un cliente hace una reserva?
6. ¿Qué hacen cuando la persona que atiende no se acuerda del precio y dónde están los cuadernos guardados?

**Los problemas**

7. ¿Cuándo fue la última vez que se fue un cliente por no encontrar el precio o no saber si había stock? ¿Qué pasó?
8. ¿Con qué frecuencia pasa que se acaba un producto sin haberse dado cuenta antes?
9. ¿Qué hacen cuando se pierde o se daña una hoja con encargos y reservas?

**El contexto de uso**

10. ¿Qué hacen en el mostrador cuando entra un cliente a preguntar y están ocupados?
11. ¿Quiénes pueden entrar a revisar stock, actualizar cantidades o ver las reservas?
12. ¿Usa el celular o la computadora durante la atención?

**Cierre**

13. Si pudiera cambiar algo de cómo llevan el inventario, los encargos y las reservas hoy, ¿cuál sería?
14. ¿Hay algo que no le pregunté sobre el movimiento de la tienda y que debería saber?

---

## Registro de la observación

| Momento | Qué se observó | Qué contradice o confirma |
|---|---|---|
| 16:20 | Un cliente preguntó por el precio de un estuche; el que atiende buscó en 2 cuadernos durante 4 minutos | Confirma la demora de 3 a 10 minutos declarada en la entrevista |
| 17:45 | Se vendió el último peluche capibara y no se anotó la salida en ningún cuaderno | Confirma que el stock no siempre se anota |
| 18:30 | Un cliente pidió reservar un artículo por WhatsApp y se anotó en una hoja suelta junto al monitor | Contradice "todo se anota en los cuadernos" y explica pérdidas de datos |

---

## Registro de la revisión documental

| Documento revisado | Hallazgo cuantificado | Evidencia para el sistema |
|---|---|---|
| Cuadernos empastados de regalos, útiles escolares y cosméticos | Se contabilizaron 24 artículos sin saldo actualizado y apuntes anotados por fecha de compra sin orden por categoría o nombre | Respalda la creación del catálogo digital por categorías y el registro inicial de stock (RF-01 y RF-09) |

---

## Resultados que alimentan el documento

| Hallazgo | Dónde se usa |
|---|---|
| Los productos se buscan hoja por hoja en 3 cuadernos distintos | Formulación del problema (causa) y buscador en tiempo real |
| Las ventas de mostrador no se descuentan al momento en el papel | Requerimiento funcional de actualización automática de stock |
| Las reservas que llegan por WhatsApp quedan en hojas sueltas sin teléfono o fecha | Validación de campos obligatorios en el formulario de reservas |
| Quien atiende alterna entre las máquinas de internet y el mostrador | Requerimiento **no funcional**: búsqueda rápida, pocos clics y uso desde celular o PC |

---

## Transcripción de la entrevista

**Entrevistada:** Lucy Gladys Fernandez Ajno (Propietaria de Internet Librería Level Up Store)
**Entrevistador:** Guido Fernandez Ajno
**Fecha:** 18 de noviembre de 2026, 15:30 horas
**Lugar:** Mostrador de atención de Internet Librería Level Up Store, Colquencha

**1. Entrevistador:** Cuénteme cómo es una tarde normal en la tienda Level Up, desde que abren.
**Propietaria:** Abrimos a las 14:00 de la tarde de domingo a jueves, y los viernes y sábados desde las 17:00. Al principio llegan los jovenes a usar las computadoras de para jugar, ver videos y hacer sus tareas o a pedir impresiones. Más tarde empieza a entrar gente a buscar útiles escolares, regalos o cosméticos. Como somos un negocio familiar, nos turnamos entre, imprimir y atender el mostrador.

**2. Entrevistador:** ¿En qué momentos del día se junta más gente en la tienda?
**Propietaria:** Entre las cinco de la tarde y las ocho de la noche es cuando más se llena. Se juntan los estudiantes que salen del colegio buscando material escolar con los que vienen a jugar en red o a imprimir trabajos. En esas horas todo es rápido.

**3. Entrevistador:** Muéstreme cómo busca el precio o si el producto está disponible cuando un cliente pregunta. *(Se observa cómo busca el precio de una caja de colores y un juego de cosméticos)*
**Propietaria:** *(Detrás del mostrador, abre un estante y saca tres cuadernos empastados)*. Aquí tengo uno para regalos, otro para material escolar y otro para cosméticos. Como anotamos según va llegando la mercadería, tengo que pasar hoja por hoja desde atrás hacia adelante hasta encontrar la factura o el apunte del día que llegó. Tarda unos cuatro o cinco minutos cuando no me acuerdo.

**4. Entrevistador:** ¿Cómo anota los productos nuevos cuando llega mercadería para regalos, escolares o cosméticos?
**Propietaria:** Cuando traemos mercadería de La Paz, agarramos el cuaderno que corresponde a esa categoría y anotamos en la siguiente hoja en blanco la fecha, el nombre del producto y cuánto nos costó o a cuánto va a salir. No está ordenado alfabéticamente ni separado por subtipos, todo va en orden de llegada.

**5. Entrevistador:** ¿Cómo registra cuando un cliente hace una reserva?
**Propietaria:** Si vienen al mostrador y dejan adelanto o piden que se les guarde algo para recoger después, lo anotamos en una esquina del cuaderno o en una libreta de notas junto a la computadora. Cuando escriben por WhatsApp para reservar un regalo o un material, a veces lo apuntamos rápido en un papel suelto mientras atendemos internet, con la idea de pasarlo después al cuaderno.

**6. Entrevistador:** ¿Qué hacen cuando la persona que atiende no se acuerda del precio y dónde están los cuadernos guardados?
**Propietaria:** Los cuadernos los guardamos en un estante interior o a veces mi esposo se los lleva un rato cuando hace cuentas de compras. Si el que está en el mostrador no se acuerda del precio y no encuentra el cuaderno a mano, tiene que ir a buscarlo adentro o llamarme por teléfono para preguntarme.

**7. Entrevistador:** ¿Cuándo fue la última vez que se fue un cliente por no encontrar el precio o no saber si había stock? ¿Qué pasó?
**Propietaria:** Ayer mismo vino una señora buscando un estuche geometrico y unas hojas cuadriculadas. Como había tres personas esperando impresiones, tardamos casi ocho minutos revisando el cuaderno escolar para ver si quedaba en depósito y cuánto costaba. La señora se cansó de esperar y se fue a buscar a otra librería. De cada diez clientes que preguntan cosas así, fácil unos dos o tres se terminan yendo sin comprar.

**8. Entrevistador:** ¿Con qué frecuencia pasa que se acaba un producto sin haberse dado cuenta antes?
**Propietaria:** Pasa seguido, casi todas las semanas. Como en el mostrador vendemos rápido y no vamos restando uno por uno en el cuaderno cada vez que sale un lapicero o un peluche, recién nos damos cuenta cuando el cliente pide y vamos a buscar al estante y ya no hay. Por ejemplo, en agosto revisamos y teníamos como 24 productos que ni figuraban con cantidad real en los cuadernos, y nos tocó decirle al cliente que vuelva la siguiente semana.

**9. Entrevistador:** ¿Qué hacen cuando se pierde o se daña una hoja con encargos y reservas?
**Propietaria:** Es un problema serio porque no tenemos copia de nada. En diciembre del año pasado se derramó agua sobre el cuaderno donde estaban anotados los encargos y reservas de esa semana; se borró casi toda la tinta. Tuvimos que revisar los mensajes antiguos del celular y llamar uno por uno a los clientes conocidos para confirmar qué cosas habían pedido y para qué día.

**10. Entrevistador:** ¿Qué hacen en el mostrador cuando entra un cliente a preguntar y están ocupados?
**Propietaria:** Si estamos cobrando una hora de internet o imprimiendo un documento, le pedimos que espere un momento. No podemos ponernos a llenar formularios largos ni buscar en tres cuadernos distintos mientras hay fila, necesitamos ver el precio y si hay stock en segundos.

**11. Entrevistador:** ¿Quiénes pueden entrar a revisar stock, actualizar cantidades o ver las reservas?
**Propietaria:** Solo nosotros como dueños y la persona encargada de atender el mostrador deberíamos poder cambiar precios, aumentar mercadería nueva o marcar una reserva como entregada. Los clientes solo deberían ver el catálogo con los precios y mandar su reserva desde su celular para venir a recoger a la tienda.

**12. Entrevistador:** ¿Usa el celular o la computadora durante la atención?
**Propietaria:** Uso los dos todo el tiempo. Cuando estoy sentada cerca de las máquinas uso la computadora principal para controlar el internet y el WhatsApp Web, y cuando me muevo al mostrador o al depósito estoy con el celular en la mano.

**13. Entrevistador:** Si pudiera cambiar algo de cómo llevan el inventario, los encargos y las reservas hoy, ¿cuál sería?
**Propietaria:** Dejar de depender de esos tres cuadernos para buscar precios y saber qué hay. Quisiera escribir el nombre del producto en el celular o en la computadora y que al instante me salga cuánto cuesta, cuántos quedan y qué reservas tengo pendientes para entregar, sin miedo a que se pierda una hoja.

**14. Entrevistador:** ¿Hay algo que no le pregunté sobre el movimiento de la tienda y que debería saber?
**Propietaria:** Sí, que aquí en Colquencha a veces la señal de internet baja o se corta un rato. Por eso, aunque tengamos el sistema en la página web, igual vamos a dejar un cuaderno pequeño de emergencia en el mostrador por si algún día se va la señal, y cuando vuelva ya lo pasamos al sistema. Además, las reservas son siempre para que el cliente pase a recoger aquí al local, no hacemos envíos a domicilio. 