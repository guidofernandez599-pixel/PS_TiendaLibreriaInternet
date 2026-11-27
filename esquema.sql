
CREATE DATABASE IF NOT EXISTS level_up_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE level_up_store;

-- ── Categorías ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categorias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  clave       VARCHAR(30)  NOT NULL UNIQUE,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL,
  imagen      VARCHAR(255) NULL
) ENGINE=InnoDB;

-- ── Proveedores ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proveedores (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20)  NULL
) ENGINE=InnoDB;

-- ── Productos (RF-01, RF-02, RF-09, RF-10) ─────────────────────────────────
-- `disponible` no se almacena para evitar redundancia: se calcula con (stock > 0).
-- `proveedor_id` acepta NULL para servicios internos (internet, PC Gamer, copias).
CREATE TABLE IF NOT EXISTS productos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(150)  NOT NULL,
  categoria_id  INT           NOT NULL,
  proveedor_id  INT           NULL,
  precio        DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  unidad        VARCHAR(30)   NOT NULL,
  stock         INT           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen        VARCHAR(255)  NOT NULL DEFAULT 'imagenes/materiales.jfif',
  actualizado   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_productos_proveedor
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
    ON UPDATE CASCADE ON DELETE SET NULL,

  INDEX idx_productos_nombre (nombre),
  INDEX idx_productos_categoria (categoria_id)
) ENGINE=InnoDB;

-- ── Usuarios administradores (RNF-07) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(100) NOT NULL,
  creado          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Reservas (RF-03 a RF-08, RF-11, RF-12, RNF-03, RNF-06) ─────────────────
CREATE TABLE IF NOT EXISTS reservas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre  VARCHAR(100) NOT NULL,
  cliente_celular VARCHAR(20)  NOT NULL,
  fecha_retiro    DATE         NOT NULL,
  notas           TEXT         NULL,
  estado          ENUM('activa', 'entregada', 'cancelada') NOT NULL DEFAULT 'activa',
  creado          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_reserva_nombre CHECK (CHAR_LENGTH(TRIM(cliente_nombre)) > 0),
  CONSTRAINT chk_reserva_celular CHECK (CHAR_LENGTH(TRIM(cliente_celular)) > 0),

  INDEX idx_reservas_fecha_estado (fecha_retiro, estado),
  INDEX idx_reservas_cliente (cliente_nombre, cliente_celular)
) ENGINE=InnoDB;

-- ── Detalle de reservas (soporta artículo único y bandeja múltiple) ────────
CREATE TABLE IF NOT EXISTS reserva_detalle (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id      INT           NOT NULL,
  producto_id     INT           NOT NULL,
  cantidad        INT           NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),

  CONSTRAINT fk_detalle_reserva
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ═══════════════════════════════════════════════════════════════════════════
-- Datos iniciales (extraídos de `datos.json` y `datos.js`)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO categorias (clave, nombre, descripcion, imagen) VALUES
  ('escolares',  'Materiales Escolares y Papelería', 'Cuadernos, marcadores, hojas, bolígrafos y materiales de escritorio.',        'imagenes/utiles_escolares.jpg'),
  ('regalos',    'Tienda de Regalos y Novedades',    'Peluches gigantes, Stitch, Capibaras, portafotos y detalles únicos.',            'imagenes/peluches_stitch_capibara.jpg'),
  ('cosmeticos', 'Cosméticos y Belleza',             'Paletas de maquillaje, perfumes, labiales y collares dúo para parejas.',          'imagenes/cosmeticos_perfumes.jpg'),
  ('internet',   'Internet y Servicios Digitales',   'Computadoras rápidas, PC Gamer, impresiones, fotocopias y anillados.',           'imagenes/internet_gaming.jpg');

INSERT INTO proveedores (nombre, telefono) VALUES
  ('Proveedores La Paz - Escolares',  NULL),
  ('Proveedores La Paz - Regalos',    NULL),
  ('Proveedores La Paz - Cosméticos', NULL);

-- Usuario administrador por defecto:
-- Usuario: admin | Contraseña: levelup2026
INSERT INTO usuarios (usuario, password_hash, nombre_completo) VALUES
  ('admin', '$2y$10$Q80ChHY/x.61PkEeeSaMte09AqZLLL7/OxkKu62lJ4UEAHU5VFxRO', 'Propietarios Level Up Store');

-- 62 productos del catálogo (`datos.json` y `datos.js`)
INSERT INTO productos (id, nombre, categoria_id, proveedor_id, precio, unidad, stock, imagen) VALUES
  -- Escolares y Papelería (categoria_id = 1, proveedor_id = 1)
  (1,  'Bolígrafos Sabonis punta fina (Azul / Negro / Rojo)',      1, 1,   1.50, 'unidad',  65, 'imagenes/bolisabo.jpg'),
  (2,  'Bolígrafos Faber-Castell / Pilot / Monami / Orion',        1, 1,   2.50, 'unidad',  45, 'imagenes/bolifabel.jpg'),
  (3,  'Marcadores Sabonis x12 colores al agua',                   1, 1,  25.00, 'estuche', 15, 'imagenes/marcasabo.jpg'),
  (4,  'Marcadores gruesos de agua y de alcohol (Milcar)',         1, 1,  30.00, 'estuche', 12, 'imagenes/grueso.jpg'),
  (5,  'Marcadores doble punta para dibujo',                       1, 1,  32.00, 'estuche', 10, 'imagenes/alcol.jpg'),
  (6,  'Marcadores resaltadores fosforescentes',                   1, 1,  14.00, 'paquete', 18, 'imagenes/resarta.jpg'),
  (7,  'Caja de colores Faber-Castell x12',                        1, 1,  18.00, 'caja',    20, 'imagenes/colofa.jpg'),
  (8,  'Colores escolares Nataraj / Milcar x12',                   1, 1,  12.00, 'caja',    15, 'imagenes/colona.jpg'),
  (9,  'Cuadernos empastados tamaño carta',                        1, 1,  18.00, 'unidad',  30, 'imagenes/empasta.jpg'),
  (10, 'Cuadernos empastados tamaño oficio',                       1, 1,  24.00, 'unidad',  16, 'imagenes/empastao.jpg'),
  (11, 'Cuadernos normales tamaño cuaderno',                       1, 1,  10.00, 'unidad',  25, 'imagenes/cuaderno.jpg'),
  (12, 'Hojas Bond tamaño carta 75g (paquete 500 hjs)',            1, 1,  35.00, 'paquete', 14, 'imagenes/cartan.jpg'),
  (13, 'Hojas Bond tamaño oficio 75g (paquete 500 hjs)',           1, 1,  40.00, 'paquete',  8, 'imagenes/ofi.jpg'),
  (14, 'Hojas de color surtidas (carta y oficio)',                 1, 1,   0.50, 'hoja',   150, 'imagenes/hojcolo.jpg'),
  (15, 'Hojas cuadriculadas para carpeta (Líder / ABC)',           1, 1,  15.00, 'paquete', 22, 'imagenes/cuadricar.jpg'),
  (16, 'Hojas Trapper cuadriculadas carta y oficio',               1, 1,  16.50, 'paquete', 18, 'imagenes/traper.jpg'),
  (17, 'Archivadores de palanca tamaño carta y oficio',            1, 1,  22.00, 'unidad',  15, 'imagenes/archi.jpg'),
  (18, 'Tapas de carpeta plásticas y folders color crema',         1, 1,   3.50, 'unidad',  40, 'imagenes/folder.jpg'),
  (19, 'Tapas para anillado (plásticas transparentes/color)',      1, 1,   4.00, 'par',      0, 'imagenes/tapas.jpg'),
  (20, 'Pegamento UHU / Isocola / Merleto / Carpicola',            1, 1,   6.00, 'unidad',  25, 'imagenes/pega.jpg'),
  (21, 'Lápices de grafito HB, 2B y 8B (Faber-Castell)',           1, 1,   2.00, 'unidad',  50, 'imagenes/lapiz.jpg'),
  (22, 'Lápices rojos de chequeo',                                 1, 1,   2.50, 'unidad',  30, 'imagenes/rojo.jpg'),
  (23, 'Corrector líquido y en cinta Radex',                       1, 1,   5.00, 'unidad',  20, 'imagenes/radex.jpg'),
  (24, 'Notas adhesivas de colores (Post-its)',                    1, 1,   5.00, 'paquete', 25, 'imagenes/notas.jpg'),
  (25, 'Tijeras escolares punta roma y punta fina',                1, 1,   6.50, 'unidad',  20, 'imagenes/tijeras.jpg'),
  (26, 'Goma de borrar Sabonis y borrador miga de pan',            1, 1,   2.00, 'unidad',  45, 'imagenes/goma.jpg'),
  (27, 'Tajadores metálicos y tajadores con formas',               1, 1,   3.50, 'unidad',  35, 'imagenes/tajador.jpg'),
  (28, 'Papel lustroso, mosaicos, 3D y papel estañado',            1, 1,   1.50, 'pliego',  60, 'imagenes/lustroso.jpg'),
  (29, 'Papel de regalo y papel coreano para ramos',               1, 1,   3.00, 'pliego',  40, 'imagenes/koreano.jpg'),
  (30, 'Clips y sujeta papeles Flips',                             1, 1,   4.50, 'caja',    25, 'imagenes/flip.jpg'),

  -- Regalos y Novedades (categoria_id = 2, proveedor_id = 2)
  (31, 'Peluche tierno de Stitch',                                 2, 2,  45.00, 'unidad',   6, 'imagenes/stich.jpg'),
  (32, 'Peluche de Snoopy clásico',                                2, 2,  40.00, 'unidad',   5, 'imagenes/snoopy.jpg'),
  (33, 'Peluche de Capibara con mochilita',                        2, 2,  48.00, 'unidad',   7, 'imagenes/capibara.jpg'),
  (34, 'Peluches de Emojis divertidos',                            2, 2,  25.00, 'unidad',  12, 'imagenes/emoji.jpg'),
  (35, 'Osos de peluche gigantes con lazo (1 metro)',              2, 2, 180.00, 'unidad',   3, 'imagenes/osogrande.jpg'),
  (36, 'Peluches medianos y pequeños para regalo',                 2, 2,  20.00, 'unidad',  10, 'imagenes/osomedi.jpg'),
  (37, 'Portafotos decorativos de madera y vidrio',                2, 2,  15.00, 'unidad',   8, 'imagenes/portafoto.jpg'),
  (38, 'Tomatodos deportivos y juveniles',                         2, 2,  25.00, 'unidad',  14, 'imagenes/tomatodo.jpg'),
  (39, 'Tazas decoradas con diseños especiales',                   2, 2,  20.00, 'unidad',  16, 'imagenes/tazas.jpg'),
  (40, 'Adornos decorativos para habitación',                      2, 2,  18.00, 'unidad',   9, 'imagenes/decora.jpg'),
  (41, 'Billeteras para varón y para dama',                        2, 2,  30.00, 'unidad',  12, 'imagenes/bille.jpg'),
  (42, 'Relojes de mesa con formas y despertador',                 2, 2,  28.00, 'unidad',   8, 'imagenes/relojmesa.jpg'),
  (43, 'Relojes de mano (digitales y elegantes)',                  2, 2,  35.00, 'unidad',   7, 'imagenes/relojmano.jpg'),
  (44, 'Bolas de cristal con nieve y música',                      2, 2,  45.00, 'unidad',   6, 'imagenes/bola.jpg'),
  (45, 'Lámparas de mesa con formas decorativas',                  2, 2,  38.00, 'unidad',   8, 'imagenes/lampara.jpg'),

  -- Cosméticos y Belleza (categoria_id = 3, proveedor_id = 3)
  (46, 'Paletas de maquillaje y sombras de ojos',                  3, 3,  22.00, 'estuche', 10, 'imagenes/maquillaje.jpg'),
  (47, 'Delineadores de ojos líquidos y en lápiz',                 3, 3,  10.00, 'unidad',  18, 'imagenes/delinea.jpg'),
  (48, 'Brillos de colores y bálsamos hidratantes',                3, 3,   8.00, 'unidad',  25, 'imagenes/labios.jpg'),
  (49, 'Perfumes y fragancias seleccionadas',                      3, 3,  28.00, 'frasco',  11, 'imagenes/perfumes.jpg'),
  (50, 'Aretes decorativos de fantasía fina',                      3, 3,  12.00, 'par',     20, 'imagenes/aretes.jpg'),
  (51, 'Collares elegantes y gargantillas',                        3, 3,  16.00, 'unidad',  14, 'imagenes/collares.jpg'),
  (52, 'Collares dúo magnéticos de pareja',                        3, 3,  35.50, 'par',      8, 'imagenes/duo.jpg'),
  (53, 'Winchas para cabello decoradas',                           3, 3,   7.00, 'unidad',  20, 'imagenes/winchas.jpg'),
  (54, 'Ligas y colettes para cabello (pack)',                     3, 3,   4.00, 'paquete', 35, 'imagenes/ligas.jpg'),

  -- Internet y Servicios Digitales (categoria_id = 4, proveedor_id = NULL)
  (55, '1 hora de Internet de alta velocidad',                     4, NULL, 2.00, 'hora',    15, 'imagenes/internet_gaming.jpg'),
  (56, 'PC Gamer 1 hora (videojuegos en red)',                     4, NULL, 3.00, 'hora',     8, 'imagenes/internet_gaming.jpg'),
  (57, 'Impresiones a color (carta y oficio)',                     4, NULL, 2.00, 'hoja',   100, 'imagenes/internet_gaming.jpg'),
  (58, 'Impresiones a blanco y negro',                             4, NULL, 1.00, 'hoja',   200, 'imagenes/internet_gaming.jpg'),
  (59, 'Fotocopias blanco y negro',                                4, NULL, 0.50, 'hoja',   400, 'imagenes/internet_gaming.jpg'),
  (60, 'Fotocopias a full color',                                  4, NULL, 1.50, 'hoja',   150, 'imagenes/internet_gaming.jpg'),
  (61, 'Transcripciones de trabajos escolares',                    4, NULL, 4.00, 'hoja',    50, 'imagenes/internet_gaming.jpg'),
  (62, 'Anillados y plastificados de documentos',                  4, NULL, 6.00, 'trabajo', 20, 'imagenes/materiales.jfif');

-- Reservas iniciales de ejemplo usando CURDATE()
INSERT INTO reservas (id, cliente_nombre, cliente_celular, fecha_retiro, notas, estado) VALUES
  (1, 'María López',  '71234567', CURDATE(),                  'Para recoger en la tarde', 'activa'),
  (2, 'Juan Pérez',   '76543210', CURDATE() + INTERVAL 1 DAY, 'Lista escolar parcial',    'activa'),
  (3, 'Ana García',   '69876543', CURDATE() + INTERVAL 2 DAY, 'Envolver para regalo',     'activa');

INSERT INTO reserva_detalle (reserva_id, producto_id, cantidad, precio_unitario) VALUES
  (1, 9,  2, 18.00),
  (1, 1,  3,  1.50),
  (2, 12, 1, 35.00),
  (3, 31, 1, 45.00);

