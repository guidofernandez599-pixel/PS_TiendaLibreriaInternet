// ── 1. OBJETO LITERAL ───────────────────────────────────────────────────
const productoDestacado = {
  nombre: "Cuaderno Anillado T. Carta",
  precio: 15.0,
  categoria: "escolares",
  stock: 40,
  disponible: true,
};

console.log(productoDestacado.nombre);

const propiedad = "precio";
console.log(productoDestacado[propiedad]);

productoDestacado.stock = 35;
productoDestacado.tapaDura = true;
delete productoDestacado.tapaDura;

// ── 2. DESTRUCTURING ────────────────────────────────────────────────────
const { nombre, precio } = productoDestacado;
console.log(`${nombre} cuesta Bs ${precio}`);

const productoOferta = { ...productoDestacado, precio: 12.0, nombre: "Cuaderno Anillado (Oferta)" };
console.log(productoOferta);

// ── 3. ARREGLO DE OBJETOS CATEGORIZADOS ─────────────────────────────────
let productos = [
  // ── ESCOLARES Y LIBRERÍA ─────────────────────────────────────────────────
  { nombre: "Bolígrafos Sabonis punta fina (Azul / Negro / Rojo)", precio: 1.5, categoria: "escolares", stock: 65, disponible: true, imagen: "imagenes/bolisabo.jpg", unidad: "unidad" },
  { nombre: "Bolígrafos Faber-Castell / Pilot / Monami / Orion", precio: 2.5, categoria: "escolares", stock: 45, disponible: true, imagen: "imagenes/bolifabel.jpg", unidad: "unidad" },
  { nombre: "Marcadores Sabonis x12 colores al agua", precio: 25.0, categoria: "escolares", stock: 15, disponible: true, imagen: "imagenes/marcasabo.jpg", unidad: "estuche" },
  { nombre: "Marcadores gruesos de agua y de alcohol (Milcar)", precio: 30.0, categoria: "escolares", stock: 12, disponible: true, imagen: "imagenes/grueso.jpg", unidad: "estuche" },
  { nombre: "Marcadores doble punta para dibujo", precio: 32.0, categoria: "escolares", stock: 10, disponible: true, imagen: "imagenes/alcol.jpg", unidad: "estuche" },
  { nombre: "Marcadores resaltadores fosforescentes", precio: 14.0, categoria: "escolares", stock: 18, disponible: true, imagen: "imagenes/resarta.jpg", unidad: "paquete" },
  { nombre: "Caja de colores Faber-Castell x12", precio: 18.0, categoria: "escolares", stock: 20, disponible: true, imagen: "imagenes/colofa.jpg", unidad: "caja" },
  { nombre: "Colores escolares Nataraj / Milcar x12", precio: 12.0, categoria: "escolares", stock: 15, disponible: true, imagen: "imagenes/colona.jpg", unidad: "caja" },
  { nombre: "Cuadernos empastados tamaño carta", precio: 18.0, categoria: "escolares", stock: 30, disponible: true, imagen: "imagenes/empasta.jpg", unidad: "unidad" },
  { nombre: "Cuadernos empastados tamaño oficio", precio: 24.0, categoria: "escolares", stock: 16, disponible: true, imagen: "imagenes/empastao.jpg", unidad: "unidad" },
  { nombre: "Cuadernos normales tamaño cuaderno", precio: 10.0, categoria: "escolares", stock: 25, disponible: true, imagen: "imagenes/cuaderno.jpg", unidad: "unidad" },
  { nombre: "Hojas Bond tamaño carta 75g (paquete 500 hjs)", precio: 35.0, categoria: "escolares", stock: 14, disponible: true, imagen: "imagenes/cartan.jpg", unidad: "paquete" },
  { nombre: "Hojas Bond tamaño oficio 75g (paquete 500 hjs)", precio: 40.0, categoria: "escolares", stock: 8, disponible: true, imagen: "imagenes/ofi.jpg", unidad: "paquete" },
  { nombre: "Hojas de color surtidas (carta y oficio)", precio: 0.5, categoria: "escolares", stock: 150, disponible: true, imagen: "imagenes/hojcolo.jpg", unidad: "hoja" },
  { nombre: "Hojas cuadriculadas para carpeta (Líder / ABC)", precio: 15.0, categoria: "escolares", stock: 22, disponible: true, imagen: "imagenes/cuadricar.jpg", unidad: "paquete" },
  { nombre: "Hojas Trapper cuadriculadas carta y oficio", precio: 16.5, categoria: "escolares", stock: 18, disponible: true, imagen: "imagenes/traper.jpg", unidad: "paquete" },
  { nombre: "Archivadores de palanca tamaño carta y oficio", precio: 22.0, categoria: "escolares", stock: 15, disponible: true, imagen: "imagenes/archi.jpg", unidad: "unidad" },
  { nombre: "Tapas de carpeta plásticas y folders color crema", precio: 3.5, categoria: "escolares", stock: 40, disponible: true, imagen: "imagenes/folder.jpg", unidad: "unidad" },
  { nombre: "Tapas para anillado (plásticas transparentes/color)", precio: 4.0, categoria: "escolares", stock: 0, disponible: false, imagen: "imagenes/tapas.jpg", unidad: "par" },
  { nombre: "Pegamento UHU / Isocola / Merleto / Carpicola", precio: 6.0, categoria: "escolares", stock: 25, disponible: true, imagen: "imagenes/pega.jpg", unidad: "unidad" },
  { nombre: "Lápices de grafito HB, 2B y 8B (Faber-Castell)", precio: 2.0, categoria: "escolares", stock: 50, disponible: true, imagen: "imagenes/lapiz.jpg", unidad: "unidad" },
  { nombre: "Lápices rojos de chequeo", precio: 2.5, categoria: "escolares", stock: 30, disponible: true, imagen: "imagenes/rojo.jpg", unidad: "unidad" },
  { nombre: "Corrector líquido y en cinta Radex", precio: 5.0, categoria: "escolares", stock: 20, disponible: true, imagen: "imagenes/radex.jpg", unidad: "unidad" },
  { nombre: "Notas adhesivas de colores (Post-its)", precio: 5.0, categoria: "escolares", stock: 25, disponible: true, imagen: "imagenes/notas.jpg", unidad: "paquete" },
  { nombre: "Tijeras escolares punta roma y punta fina", precio: 6.5, categoria: "escolares", stock: 20, disponible: true, imagen: "imagenes/tijeras.jpg", unidad: "unidad" },
  { nombre: "Goma de borrar Sabonis y borrador miga de pan", precio: 2.0, categoria: "escolares", stock: 45, disponible: true, imagen: "imagenes/goma.jpg", unidad: "unidad" },
  { nombre: "Tajadores metálicos y tajadores con formas", precio: 3.5, categoria: "escolares", stock: 35, disponible: true, imagen: "imagenes/tajador.jpg", unidad: "unidad" },
  { nombre: "Papel lustroso, mosaicos, 3D y papel estañado", precio: 1.5, categoria: "escolares", stock: 60, disponible: true, imagen: "imagenes/lustroso.jpg", unidad: "pliego" },
  { nombre: "Papel de regalo y papel coreano para ramos", precio: 3.0, categoria: "escolares", stock: 40, disponible: true, imagen: "imagenes/koreano.jpg", unidad: "pliego" },
  { nombre: "Clips y sujeta papeles Flips", precio: 4.5, categoria: "escolares", stock: 25, disponible: true, imagen: "imagenes/flip.jpg", unidad: "caja" },

  // ── REGALOS Y NOVEDADES ─────────────────────────────────────────────────
  { nombre: "Peluche tierno de Stitch", precio: 45.0, categoria: "regalos", stock: 6, disponible: true, imagen: "imagenes/stich.jpg", unidad: "unidad" },
  { nombre: "Peluche de Snoopy clásico", precio: 40.0, categoria: "regalos", stock: 5, disponible: true, imagen: "imagenes/snoopy.jpg", unidad: "unidad" },
  { nombre: "Peluche de Capibara con mochilita", precio: 48.0, categoria: "regalos", stock: 7, disponible: true, imagen: "imagenes/capibara.jpg", unidad: "unidad" },
  { nombre: "Peluches de Emojis divertidos", precio: 25.0, categoria: "regalos", stock: 12, disponible: true, imagen: "imagenes/emoji.jpg", unidad: "unidad" },
  { nombre: "Osos de peluche gigantes con lazo (1 metro)", precio: 180.0, categoria: "regalos", stock: 3, disponible: true, imagen: "imagenes/osogrande.jpg", unidad: "unidad" },
  { nombre: "Peluches medianos y pequeños para regalo", precio: 20.0, categoria: "regalos", stock: 10, disponible: true, imagen: "imagenes/osomedi.jpg", unidad: "unidad" },
  { nombre: "Portafotos decorativos de madera y vidrio", precio: 15.0, categoria: "regalos", stock: 8, disponible: true, imagen: "imagenes/portafoto.jpg", unidad: "unidad" },
  { nombre: "Tomatodos deportivos y juveniles", precio: 25.0, categoria: "regalos", stock: 14, disponible: true, imagen: "imagenes/tomatodo.jpg", unidad: "unidad" },
  { nombre: "Tazas decoradas con diseños especiales", precio: 20.0, categoria: "regalos", stock: 16, disponible: true, imagen: "imagenes/tazas.jpg", unidad: "unidad" },
  { nombre: "Adornos decorativos para habitación", precio: 18.0, categoria: "regalos", stock: 9, disponible: true, imagen: "imagenes/decora.jpg", unidad: "unidad" },
  { nombre: "Billeteras para varón y para dama", precio: 30.0, categoria: "regalos", stock: 12, disponible: true, imagen: "imagenes/bille.jpg", unidad: "unidad" },
  { nombre: "Relojes de mesa con formas y despertador", precio: 28.0, categoria: "regalos", stock: 8, disponible: true, imagen: "imagenes/relojmesa.jpg", unidad: "unidad" },
  { nombre: "Relojes de mano (digitales y elegantes)", precio: 35.0, categoria: "regalos", stock: 7, disponible: true, imagen: "imagenes/relojmano.jpg", unidad: "unidad" },
  { nombre: "Bolas de cristal con nieve y música", precio: 45.0, categoria: "regalos", stock: 6, disponible: true, imagen: "imagenes/bola.jpg", unidad: "unidad" },
  { nombre: "Lámparas de mesa con formas decorativas", precio: 38.0, categoria: "regalos", stock: 8, disponible: true, imagen: "imagenes/lampara.jpg", unidad: "unidad" },

  // ── COSMÉTICOS Y BELLEZA ─────────────────────────────────────────────────
  { nombre: "Paletas de maquillaje y sombras de ojos", precio: 22.0, categoria: "cosmeticos", stock: 10, disponible: true, imagen: "imagenes/maquillaje.jpg", unidad: "estuche" },
  { nombre: "Delineadores de ojos líquidos y en lápiz", precio: 10.0, categoria: "cosmeticos", stock: 18, disponible: true, imagen: "imagenes/delinea.jpg", unidad: "unidad" },
  { nombre: "Brillos de colores y bálsamos hidratantes", precio: 8.0, categoria: "cosmeticos", stock: 25, disponible: true, imagen: "imagenes/labios.jpg", unidad: "unidad" },
  { nombre: "Perfumes y fragancias seleccionadas", precio: 28.0, categoria: "cosmeticos", stock: 11, disponible: true, imagen: "imagenes/perfumes.jpg", unidad: "frasco" },
  { nombre: "Aretes decorativos de fantasía fina", precio: 12.0, categoria: "cosmeticos", stock: 20, disponible: true, imagen: "imagenes/aretes.jpg", unidad: "par" },
  { nombre: "Collares elegantes y gargantillas", precio: 16.0, categoria: "cosmeticos", stock: 14, disponible: true, imagen: "imagenes/collares.jpg", unidad: "unidad" },
  { nombre: "Collares dúo magnéticos de pareja", precio: 35.5, categoria: "cosmeticos", stock: 8, disponible: true, imagen: "imagenes/duo.jpg", unidad: "par" },
  { nombre: "Winchas para cabello decoradas", precio: 7.0, categoria: "cosmeticos", stock: 20, disponible: true, imagen: "imagenes/winchas.jpg", unidad: "unidad" },
  { nombre: "Ligas y colettes para cabello (pack)", precio: 4.0, categoria: "cosmeticos", stock: 35, disponible: true, imagen: "imagenes/ligas.jpg", unidad: "paquete" },

  // ── INTERNET Y SERVICIOS DIGITALES ───────────────────────────────────────
  { nombre: "1 hora de Internet de alta velocidad", precio: 2.0, categoria: "internet", stock: 15, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hora" },
  { nombre: "PC Gamer 1 hora (videojuegos en red)", precio: 3.0, categoria: "internet", stock: 8, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hora" },
  { nombre: "Impresiones a color (carta y oficio)", precio: 2.0, categoria: "internet", stock: 100, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hoja" },
  { nombre: "Impresiones a blanco y negro", precio: 1.0, categoria: "internet", stock: 200, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hoja" },
  { nombre: "Fotocopias blanco y negro", precio: 0.5, categoria: "internet", stock: 400, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hoja" },
  { nombre: "Fotocopias a full color", precio: 1.5, categoria: "internet", stock: 150, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hoja" },
  { nombre: "Transcripciones de trabajos escolares", precio: 4.0, categoria: "internet", stock: 50, disponible: true, imagen: "imagenes/internet_gaming.jpg", unidad: "hoja" },
  { nombre: "Anillados y plastificados de documentos", precio: 6.0, categoria: "internet", stock: 20, disponible: true, imagen: "imagenes/materiales.jfif", unidad: "trabajo" }
];

// ── 4. LOS MÉTODOS QUE IMPORTAN ─────────────────────────────────────────
productos.forEach(p => console.log(p.nombre));

const nombres = productos.map(p => p.nombre);
console.log(nombres);

const disponibles = productos.filter(p => p.disponible);
console.log(disponibles.length, "de", productos.length, "disponibles");

const caro = productos.find(p => p.precio > 40);
console.log(caro);

console.log(nombres.includes("marcadores sabonis"));
console.log(productos.some(p => p.stock === 0));
console.log(productos.every(p => p.precio > 0));

const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
console.log(porPrecio.map(p => p.nombre));

const valorInventario = productos.reduce((acumulador, p) => acumulador + p.precio * p.stock, 0);
console.log("Valor del inventario: Bs", valorInventario.toFixed(2));

// ── 5. ENCADENAR ────────────────────────────────────────────────────────
const nombresDisponibles = productos
  .filter(p => p.disponible)
  .map(p => p.nombre);
console.log(nombresDisponibles);

const totalEscolaresEnStock = productos
  .filter(p => p.categoria === "escolares" && p.disponible)
  .reduce((total, p) => total + p.precio * p.stock, 0);
console.log("Escolares en stock: Bs", totalEscolaresEnStock.toFixed(2));

const porCategoria = productos.reduce((grupos, p) => {
  if (!grupos[p.categoria]) grupos[p.categoria] = [];
  grupos[p.categoria].push(p.nombre);
  return grupos;
}, {});
console.log(porCategoria);

// ── 6. CLASES ───────────────────────────────────────────────────────────
class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  estaDisponible() {
    return this.stock > 0;
  }

  valorEnStock() {
    return this.precio * this.stock;
  }
}

const archivador = new Producto("Archivador de Palanca", 22.0, 15);
console.log(archivador.nombre, archivador.estaDisponible(), archivador.valorEnStock());

class ProductoConDescuento extends Producto {
  constructor(nombre, precio, stock, descuento) {
    super(nombre, precio, stock);
    this.descuento = descuento;
  }

  precioFinal() {
    return this.precio * (1 - this.descuento / 100);
  }
}

const mochila = new ProductoConDescuento("Mochila Escolar", 85.0, 10, 20);
console.log("Precio final con descuento:", mochila.precioFinal(), "| Disponible:", mochila.estaDisponible());


