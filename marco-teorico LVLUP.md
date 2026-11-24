# Marco teórico

## Sistema de gestión de inventario y reservas para Internet Librería Level Up Store

---

## Introducción

El control de inventario y el registro de reservas de productos cuentan con varias alternativas en el mercado, desde hojas de cálculo gratuitas hasta paquetes comerciales completos. Conforme a la metodología de investigación aplicada al desarrollo de software, revisar los antecedentes permite identificar qué soluciones existen y qué limitaciones presentan frente a un caso específico (Hernández Sampieri et al., 2014). En esta sección se revisan cuatro opciones existentes y se analiza por qué ninguna se adapta a la forma de trabajo de Internet Librería Level Up Store en Colquencha, lo que justifica desarrollar una aplicación web propia.

---

## Estado del arte

### Alternativas existentes

| Solución | Costo | Sin internet | Uso en celular y PC | Consulta rápida y catálogo de reservas |
|---|---|---|---|---|
| **Tres cuadernos físicos** *(actual)* | Bs 0 | sí | no aplica | **no** (toma de 3 a 10 minutos) |
| **Planilla en Google Sheets** | Bs 0 | no | incómodo en celular | sí, con filtros, pero sin catálogo público |
| **Sistemas POS en la nube** *(como Loyverse o Eleventa)* | Bs 0 básico / Bs 150 a 250/mes avanzado | parcial | sí | sí en caja, pero sin catálogo web de reservas |
| **Desarrollo externo a medida** | alrededor de Bs 2.800 inicial | sí | sí | sí|
| **Solución propuesta** | Bs 600/año | no *(requiere conexión)* | sí | sí, por nombre, categoría y reservas en línea |

### Análisis

**Los cuadernos físicos** no tienen costo y funcionan aunque se corte la luz o el internet. Su falla principal es la lentitud: al tener tres cuadernos distintos (regalos, útiles escolares y cosméticos) anotados en orden de llegada y guardados fuera del mostrador (L. G. Fernandez, entrevista personal, 14 y 18 de noviembre de 2026), buscar un precio demora entre 3 y 10 minutos y hace que 2 de cada 10 clientes se vayan sin comprar. Se mantienen solo como respaldo de emergencia.

**La planilla en Google Sheets** permite filtrar productos sin pagar licencias, pero exige conexión estable y editar celdas desde el celular en horas pico resulta poco práctico. En la observación realizada el 18 de noviembre se verificó que quien atiende alterna entre el área de internet y el mostrador con las manos ocupadas, por lo que necesita una interfaz web con respuestas inmediatas (Duckett, 2014). Además, una hoja de cálculo no ofrece un catálogo visual donde los clientes puedan armar sus reservas.

**Los sistemas POS en la nube** (como Loyverse POS en dispositivos móviles o Eleventa en computadora) resuelven el control de caja, pero están pensados para minimarkets o supermercados con lector de código de barras. Sus planes con gestión completa de inventario rondan entre Bs 150 y Bs 250 al mes, cobran extra por módulos que una tienda familiar de Colquencha no necesita y obligarían a descartar el catálogo web que el negocio ya tiene publicado.

**El desarrollo externo a medida** contratado a un programador independiente cubre todas las funciones, pero ronda los Bs 2.800 solo por la programación inicial, sin contar el hosting anual. Ese monto está fuera del presupuesto de la tienda y duplicaría el trabajo de interfaz web realizado en el módulo anterior.

### Conclusión del estado del arte

Ninguna de las opciones revisadas reúne las condiciones que pide este caso: un costo anual bajo de Bs 600, acceso rápido desde el celular o la computadora del mostrador, búsqueda inmediata por nombre o categoría, registro de reservas para recojo en tienda y aprovechamiento del catálogo web que ya existe.

La solución propuesta asume una desventaja clara frente a los cuadernos de papel: depende de tener conexión a internet para consultar o actualizar la base de datos en línea. Esta limitación se declara en el proyecto y se cubre manteniendo un cuaderno de contingencia en el mostrador cuando falle la señal en la zona, para luego pasar los movimientos al sistema.

---

## Metodología de desarrollo

Se utiliza un **enfoque incremental**, organizando el trabajo en entregas semanales. Según Sommerville (2011), el desarrollo incremental permite entregar funcionalidad útil en etapas cortas y validar cada avance con el cliente antes de pasar al siguiente componente.

No se aplica la metodología Scrum porque exige roles definidos y reuniones diarias que no tienen sentido en un proyecto desarrollado por una sola persona en cuatro semanas. De ese marco solo se conservan dos prácticas útiles: construir incrementos funcionales cada semana y validar cada entrega contra los requerimientos de la tienda (Patton, 2014).

| Herramienta | Uso | Por qué |
|---|---|---|
| Git y GitHub | Control de versiones del código y la documentación | Ya se viene usando desde el módulo de Programación Web |
| XAMPP | Servidor local de pruebas con Apache, PHP y MariaDB | Permite programar y probar sin depender de internet en el aula o en casa |
| PHP 8 y MySQL | Lógica del servidor y base de datos relacional | Funcionan en hosting compartido económico (Nixon, 2024) y garantizan integridad de datos mediante relaciones (Silberschatz et al., 2014) |
| Matriz de casos de prueba | Verificación del sistema antes de entregar | Permite comprobar paso a paso el registro de productos, las reservas, el descuento de stock y los errores según estándares de especificación (IEEE, 1998; ISO/IEC/IEEE, 2018) |

---

## Referencias bibliográficas

Duckett, J. (2014). *JavaScript and JQuery: Interactive Front-End Web Development*. John Wiley & Sons.

Hernández Sampieri, R., Fernández Collado, C., y Baptista Lucio, P. (2014). *Metodología de la investigación* (6ª ed.). McGraw-Hill.

IEEE. (1998). *IEEE Recommended Practice for Software Requirements Specifications* (IEEE Std 830-1998). Institute of Electrical and Electronics Engineers.

ISO/IEC/IEEE. (2018). *Systems and software engineering - Life cycle processes - Requirements engineering* (ISO/IEC/IEEE 29148:2018). ISO.

Nixon, R. (2024). *Learning PHP, MySQL & JavaScript* (7th ed.). O'Reilly Media.

Patton, J. (2014). *User Story Mapping: Discover the Whole Story, Build the Right Product*. O'Reilly Media.

Silberschatz, A., Korth, H. F., y Sudarshan, S. (2014). *Fundamentos de bases de datos* (6ª ed.). McGraw-Hill.

Sommerville, I. (2011). *Ingeniería de software* (9ª ed.). Pearson Educación.

### Fuentes no bibliográficas

La información sobre el proceso actual de Internet Librería Level Up Store proviene de:

- entrevistas con la propietaria, Lucy Gladys Fernandez Ajno, realizadas el 14 y 18 de noviembre de 2026
- observación directa en el local, 18 de noviembre de 2026, de 16:00 a 18:45
- revisión documental de los tres cuadernos físicos de inventario (regalos, útiles escolares y cosméticos)

Estas fuentes se citan en el texto como comunicación personal y no se listan en las referencias bibliográficas, conforme a la norma APA.

## Nota sobre integridad académica

Las fuentes teóricas y normativas utilizadas en este apartado se encuentran citadas según la norma APA. El análisis comparativo y las decisiones técnicas responden exclusivamente a las condiciones observadas en Internet Librería Level Up Store.