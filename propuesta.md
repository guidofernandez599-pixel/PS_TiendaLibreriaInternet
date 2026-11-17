# Sistema de gestión de inventario y pedidos para Internet Libreria Level Up Store

**Propuesta de Proyecto Integrador**
Programa Académico Desconcentrado "Técnico Superior en Informática"
UMSA · Sede Colquencha

Autor: Guido Fernandez Ajno
Fecha: noviembre de 2026

---

## Tipo de proyecto

**Proyecto integrador.** Se resuelve un problema concreto de un cliente real
construyendo un producto de software funcional, acompañado de la documentación
de ingeniería que respalda las decisiones tomadas.

No es una monografía: no se estudia el estado del arte de los sistemas de
pedidos, se construye uno. No es una investigación: no se responde una pregunta
abierta, se resuelve un problema conocido.

---

## El punto de partida

Este proyecto continúa el trabajo del módulo de Programación Web, en el que se
construyó el frontend: una página funcional, publicada, con los datos del
cliente en un archivo JSON.

Para completar el proyecto falta lo siguiente:

| Ya existe | Se construye este módulo |
|---|---|
| el frontend funcionando y publicado | la propuesta que lo justifica |
| los datos en un archivo JSON | una base de datos real |
| "funciona en mi máquina" | requerimientos, pruebas, costos y *deploy* (puesta en producción) |



## El cliente

**Level Up**, Colquencha. Negocio familiar, en funcionamiento desde 2016. Atiende Internet, Libreria y tambien Tienda de regalos al público y por encargo.

**Cómo trabaja hoy:** El inventario de los productos se anotan en un cuaderno.
Quien atiende escribe y memoriza los precios uno por uno, pero son muchos.
No hay un registro de inventario que indique que productos tienen stock, simplemente
se ve cuando no hay.

**Fuente de esta información:** entrevista con la propietaria, 14 de noviembre de
2026, en la tienda. Se registró en notas y se validó de forma verbal con ella al día siguiente.

---

## Formulación del problema

La Tienda Level Up registra el inventario en 3 cuadernos físicos, 1 para los regalos, 
1 para los materiales escolares y 1 para los cosmeticos. todo eso lo guarda el dueño 
donde el acceso no es facil.
Quien atiende las ventas aveces se olvida del precio y stocks de algunos productos, 
y consultar los cuadernos de los inventarios es complicado ya que aveces el cuaderno 
no esta en la tienda.

Este registro presenta tres dificultades documentadas durante la entrevista del
14 de noviembre de 2026:

**Inventario Manual** Entre el 1 y el 31 de agosto de 2026 se registraron 24
productos que no fueron registrados si tienen stocks hasta la fecha, un total
aproximado de 5 clientes por dia preguntaron precios y si hay disponibles, 
pero la respuesta suele ser tardar y si no hay la respuesta sueles ser
"para la siguiente semana". 
La propietaria indica que 2 de 10 clientes suelen irse sin llevarse su producto. 

**Lentitud de consulta** Para verificar precios, stocks o productos nuevos, 
es necesario revisar los cuadernos hoja por hoja, los productos nuevos se anotan 
en orden de llegada pero eso hace dificil el guardado en sus categorias de búsqueda.
Quien atiende pierde entre 3 y 10 minutos buscando el cuaderno correcto y revisando los apuntes,
lo que causa demoras cuando la tienda tiene varios clientes esperando ser atendidos tambien.

**Ausencia de respaldo** Los cuadernos físicos son el único registro del negocio. 
En diciembre del 2025, uno de los cuadernos se mojó y se perdieron los datos de los 
encargos de toda una semana, obligando a reconstruir la información llamando manualmente a los clientes.


### Árbol de problemas

```
   EFECTOS     Perdida de ventas porque 2 de cada 10 clientes se retiran sin comprar
               Demoras en la atención al público es entre 3 y 10 minutos por consulta
               cuando el que atiende ve un nuevo producto o si se olvida
               Tiempo dedicado a reconstruir información perdida
                          ↑
   PROBLEMA    El registro manual del inventario y las ventas de la tienda
   CENTRAL     no permite consultar precios ni stocks en tiempo real
                          ↑
   CAUSAS      Los productos se anotan por orden de llegada en 3 cuadernos distintos
               Los cuadernos aveces son guardados fuera del alcance del mostrador
               El registro físico es único y no tiene copias de seguridad
```

### Problema central

El registro manual del inventario y las ventas de la tienda que no permite consultar de 
forma rápida y confiable los precios ni los stoks disponibles, lo que ocasiona demoras 
en la atención, pérdida de ventas y riesgo de pérdida de información física.

---

## Objetivos

### Objetivo general

Desarrollar un sistema web de gestión de inventario y reservas para la tienda Level Up,
que permita consultar precios y stoks en tiempo real tanto desde el punto de atención 
como de los clientes y conservar los registros con respaldo en una base de datos.

### Objetivos específicos

1. Diseñar una base de datos relacional que centralice el catálogo de productos 
(regalos, útiles escolares y cosméticos), sus precios, el stock disponible y el
 registro de reservas.
2. Implementar el registro de reservas nuevo desde el navegador, con validación
 de los datos obligatorios.
3. Implementar un buscador y filtro de consulta rápida que permita verificar precios,
 stock disponible y estado de los productos y reservas en tiempo real.
4. Verificar el funcionamiento del sistema mediante una matriz de casos de prueba
 que evalúe el registro de productos, el descuento de stock, las consultas y el manejo de errores.

   

## Justificación

**Práctica.** Las tres dificultades identificadas en la tienda tienen solución directa
al sustituir los cuadernos dispersos por un registro digital consultable. El tiempo de 
búsqueda en mostrador, que actualmente toma entre 3 y 10 minutos por cliente, se reduce 
a una búsqueda instantánea por nombre o categoría, evitando que clientes 
abandonen el local por falta de respuesta sobre precios o disponibilidad.

**Técnica.** Se opta por una aplicación web porque el negocio ya cuenta con un frontend 
desarrollado y publicado en el anterior modulo, lo que permite aprovechar el trabajo 
realizado migrando de los datos del archivo JSON hacia una base de datos real. Se usa PHP
y MySQL porque funcionan sobre hosting compartido de bajo costo, Además, al ser web, 
el personal y los clientes puede consultar el inventario desde el celular o la computadora
del mostrador sin necesidad de instalar software adicional.

**Social.** El Registro de los datos con respaldo en servidor elimina el riesgo
de pérdida de datos por accidentes, como ocurrió en diciembre de 2025 al mojarse el
cuaderno de encargos, protegiendo tanto el capital de trabajo de la familia propietaria
como la confianza de los clientes de Colquencha que realizan reservas y pedidos.

---

## Factibilidad

**Técnica.** El sistema requiere un servidor con PHP 8 y MySQL, que es la 
configuración estándar de cualquier hosting compartido. El desarrollo se 
realiza de forma local con XAMPP, lo que permite trabajar sin depender de 
conexión a internet constante. El frontend ya está construido y funcionando 
con HTML, CSS, JavaScript, con el buscador en tiempo real, filtros por
categoría y la bandeja de compras.

**Operativa.** El sistema lo van a usar los propietarios y la persona que atiende
en el mostrador, Además, los clientes de Colquencha ya pueden revisar el catálogo
y armar sus reservas desde su propio celular. En el día a día, la operación del
mostrador se reduce a consultar precios o stock en el buscador, registrar las 
reservas anticipadas y actualizar las cantidades cuando llega mercadería nueva.

*Riesgo identificado:* el control de inventario depende de que se registren las
salidas y los nuevos productos en el sistema en ese momento. Si se sigue anotando
en los 3 cuadernos físicos "para pasarlo después", el stock en la página quedará 
desactualizado. Este riesgo se reduce dejando el panel de administración accesible
desde el celular y desde la computadora del área de internet de la tienda, sin instalar
ningún programa.

**Económica.** El desarrollo se realiza como parte del módulo, sin costo para
el cliente. La operación anual estimada es:

| Concepto | Costo anual (Bs) |
|---|---|
| Hosting compartido con PHP y MySQL | 350 |
| Dominio .bo | 250 |
| **Total** | **600** |

Frente a ese gasto anual de Bs 600 (equivalente a Bs 50 al mes), en el mes de agosto
de 2026 se identificaron 24 productos sin registro claro de stock y un promedio 
de 2 de cada 10 clientes diarios que se van sin comprar por falta de confirmación 
de precio o disponibilidad. Con recuperar apenas unas cuantas ventas perdidas al 
mes en útiles escolares, peluches o cosméticos, el costo del servicio queda cubierto.

## Alcances y límites

### Alcance

El sistema entregado incluye:

- catálogo web con las 4 categorías del negocio: útiles escolares, regalos, 
  cosméticos, y servicios de internet.   
- consulta rápida en tiempo real de precios y stock disponibles mediante el
  buscador y los filtros por categoría
- registro de reservas anticipadas desde el navegador tanto por artículo 
  individual como desde la bandeja de compras con validación de datos del cliente,
  cantidad y fecha de entrega.   
- panel básico de administración para agregar productos nuevos, editar precios, 
  actualizar el stock y marcar pedidos como entregados
- respaldo del registro mediante exportación de la base de datos

### Límites

El sistema **no** incluye, y en cada caso se indica por qué:

- **Facturación electrónica ni de pagos en línea.** El negocio opera con ventas
  al detalle en mostrador y cobros en efectivo o mediante código QR bancario; 
  integrar facturación en línea con el Servicio de Impuestos Nacionales (SIN) 
  o pasarelas de pago excede el tiempo y el alcance de un módulo de cuatro semanas.   
- **Control automatizado de tiempo en las máquinas de internet.** Aunque los servicios
  de internet, PC Gamer e impresiones figuran en el catálogo con sus tarifas por hora
  y hojas, el bloqueo automático de las computadoras requiere software de red local (tipo cibercontrol) que es ajeno al sistema web de inventario y pedidos.
- **Notificaciones automáticas por WhatsApp desde el servidor.** El frontend actual
  permite abrir un mensaje prellenado hacia el número de WhatsApp de la tienda, pero
  el envío automático de mensajes desde el backend requiere contratar una API oficial de pago. 
  Queda planteado como mejora futura.
- **Múltiples sucursales.** Level Up Store cuenta con un único local en Colquencha. 
  El diseño de la base de datos permite escalar a futuro si abren otro punto de venta,
  pero en esta versión se gestiona un solo inventario.

---
