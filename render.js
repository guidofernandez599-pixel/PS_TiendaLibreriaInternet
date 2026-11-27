// Definición de las categorías con imagen representativa para los cuadros
const METADATA_CATEGORIAS = {
  escolares: {
    nombre: "📚 Escolares y Papelería",
    descripcion: "Cuadernos, marcadores, hojas, bolígrafos y materiales de escritorio.",
    imagen: "imagenes/utiles_escolares.jpg"
  },
  regalos: {
    nombre: "🎁 Regalos y Novedades",
    descripcion: "Peluches gigantes, Stitch, Capibaras, portafotos y detalles únicos.",
    imagen: "imagenes/peluches_stitch_capibara.jpg"
  },
  cosmeticos: {
    nombre: "💄 Cosméticos y Belleza",
    descripcion: "Paletas de maquillaje, perfumes, labiales y collares dúo para parejas.",
    imagen: "imagenes/cosmeticos_perfumes.jpg"
  },
  internet: {
    nombre: "💻 Internet y Servicios",
    descripcion: "Computadoras rápidas, PC Gamer, impresiones, fotocopias y anillados.",
    imagen: "imagenes/internet_gaming.jpg"
  }
};

/**
 * Renderiza la vista principal de categorías en cuadros/tarjetas con imagen
 */
function renderCategorias() {
  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  const claves = Object.keys(METADATA_CATEGORIAS);
  const tarjetasHTML = claves.map(clave => {
    const info = METADATA_CATEGORIAS[clave];
    const conteo = typeof productos !== "undefined"
      ? productos.filter(p => p.categoria === clave).length
      : 0;

    return `
      <div class="categoria-cuadro" data-categoria="${clave}">
        <div class="categoria-cuadro-img-wrap">
          <img src="${info.imagen}" alt="${info.nombre}" loading="lazy">
        </div>
        <div class="categoria-cuadro-cuerpo">
          <h3>${info.nombre}</h3>
          <p>${info.descripcion}</p>
          <span class="categoria-cuadro-badge">${conteo} artículos</span>
        </div>
      </div>
    `;
  }).join("");

  contenedor.innerHTML = `
    <div class="grid-cuadros-categorias">
      ${tarjetasHTML}
    </div>
  `;
}

/**
 * Renderiza el listado de productos de forma plana (al buscar o filtrar una categoría)
 */
function render(lista) {
  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `
      <div class="estado-vacio">
        <p class="icono-vacio">🔍</p>
        <p>No se encontraron productos con ese criterio de búsqueda.</p>
      </div>
    `;
    return;
  }

  const html = `
    <div class="grid-productos-categoria">
      ${lista.map(p => crearTarjetaProducto(p)).join("")}
    </div>
  `;
  contenedor.innerHTML = html;
}

/**
 * Genera el HTML de una tarjeta individual de producto
 */
function crearTarjetaProducto(p) {
  const badgeClase = p.disponible ? "badge-disponible" : "badge-agotado";
  const badgeTexto = p.disponible ? "En stock" : "Agotado";
  const tarjetaClase = p.disponible ? "tarjeta" : "tarjeta agotado";

  return `
    <div class="${tarjetaClase}">
      <div class="tarjeta-img-wrap">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <span class="badge-stock ${badgeClase}">${badgeTexto}</span>
      </div>
      <div class="tarjeta-cuerpo">
        <span class="categoria-etiqueta">${p.categoria}</span>
        <h3 class="tarjeta-titulo">${p.nombre}</h3>
        <div class="tarjeta-precio-fila">
          <span class="precio">Bs ${p.precio.toFixed(2)}</span>
          <span class="unidad-medida">/ ${p.unidad || "unidad"}</span>
        </div>
        <p class="stock">Disponibles: ${p.stock}</p>
        <button type="button" class="btn-pedir" onclick="seleccionarProductoPedido('${p.nombre.replace(/'/g, "\\'")}')">
          🛒 Pedir este artículo
        </button>
      </div>
    </div>
  `;
}

/**
 * Permite seleccionar un producto y llevar al usuario directo al formulario de pedidos
 */
function seleccionarProductoPedido(nombreProducto) {
  const select = document.querySelector("#producto-pedido");
  if (select) {
    let encontrado = false;
    for (const opt of select.options) {
      if (opt.value === nombreProducto) {
        select.value = nombreProducto;
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      const opt = new Option(nombreProducto, nombreProducto, true, true);
      select.add(opt);
    }
  }

  const seccion = document.querySelector("#Pedidos");
  if (seccion) {
    seccion.scrollIntoView({ behavior: "smooth" });
  }
}