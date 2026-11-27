const buscador = document.querySelector("#buscador");
const filtros = document.querySelector("#filtros");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#Pedidos form");
const estadoPedido = document.querySelector("#estado-pedido");
const selectProducto = document.querySelector("#producto-pedido");
const inputFecha = document.querySelector("#fecha");

let categoriaActiva = "todos";
let textoBuscado = "";

if (inputFecha) {
  inputFecha.min = new Date().toISOString().slice(0, 10);
}

function mostrarEstadoPedido(texto, tipo = "ok") {
  if (!estadoPedido) return;
  estadoPedido.textContent = texto;
  estadoPedido.className = `mensaje-estado ${tipo}`;
  estadoPedido.hidden = !texto;
}

function poblarSelectProductos() {
  if (!selectProducto || typeof productos === "undefined") return;

  const valorPrevio = selectProducto.value;
  const etiquetasCat = {
    escolares: "📚 Escolares y Papelería",
    regalos: "🎁 Regalos y Novedades",
    cosmeticos: "💄 Cosméticos y Belleza",
    internet: "💻 Internet y Servicios",
  };

  const grupos = {};
  productos.forEach((p) => {
    const cat = p.categoria || "escolares";
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(p);
  });

  selectProducto.innerHTML = `
    <option value="">-- Elige un artículo del catálogo --</option>
    <option value="Pedido de varios productos (Bandeja)" id="opcion-bandeja">🛒 Pedido de varios productos (según Bandeja)</option>
  `;

  Object.keys(etiquetasCat).forEach((cat) => {
    const lista = grupos[cat];
    if (!lista || lista.length === 0) return;
    const og = document.createElement("optgroup");
    og.label = etiquetasCat[cat];

    lista.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.nombre;
      if (p.id) opt.dataset.id = String(p.id);
      opt.dataset.stock = String(p.stock);
      opt.disabled = p.stock <= 0;
      opt.textContent = p.stock > 0
        ? `${p.nombre} (Bs ${Number(p.precio).toFixed(2)} · Stock: ${p.stock})`
        : `${p.nombre} (Agotado)`;
      og.appendChild(opt);
    });
    selectProducto.appendChild(og);
  });

  if (valorPrevio) {
    selectProducto.value = valorPrevio;
  }
}

async function cargarCatalogoDesdeServidor() {
  try {
    const resp = await fetch("api/productos.php");
    if (!resp.ok) return;
    const datos = await resp.json();
    if (Array.isArray(datos.productos) && datos.productos.length > 0) {
      productos = datos.productos;
      poblarSelectProductos();
      actualizar();
      if (typeof sincronizarTableroConCatalogo === "function") {
        sincronizarTableroConCatalogo(productos);
      }
    }
  } catch {
    // Si se abre sin servidor PHP, se mantiene el catálogo estático de datos.js
  }
}

function actualizar() {
  if (typeof productos === "undefined" || typeof render !== "function") return;

  if (categoriaActiva === "todos" && !textoBuscado.trim()) {
    if (typeof renderCategorias === "function") renderCategorias();
    if (resultado) resultado.textContent = "Selecciona una categoría o busca para ver artículos.";
    return;
  }

  const visibles = productos
    .filter(p => categoriaActiva === "todos" || p.categoria === categoriaActiva)
    .filter(p => p.nombre.toLowerCase().includes(textoBuscado.toLowerCase()));

  const orden = (typeof preferencias !== "undefined" && preferencias.orden) || "nombre";
  visibles.sort((a, b) => {
    if (orden === "precio") return a.precio - b.precio;
    if (orden === "stock") return b.stock - a.stock;
    return a.nombre.localeCompare(b.nombre, "es");
  });

  render(visibles);
  if (resultado) resultado.textContent = `${visibles.length} de ${productos.length} productos`;
}

poblarSelectProductos();
actualizar();
cargarCatalogoDesdeServidor();

// Búsqueda en tiempo real
if (buscador) {
  buscador.addEventListener("input", (event) => {
    textoBuscado = event.target.value;
    actualizar();
  });
}

// Botones de filtro superiores
if (filtros) {
  filtros.addEventListener("click", (event) => {
    const boton = event.target.closest("button");
    if (!boton) return;

    categoriaActiva = boton.dataset.categoria;
    filtros.querySelectorAll("button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

    actualizar();
  });
}

// Al hacer clic en un cuadro de categoría, se activa su filtro correspondiente
const listaContenedor = document.querySelector("#lista-productos");
if (listaContenedor && filtros) {
  listaContenedor.addEventListener("click", (event) => {
    const cuadro = event.target.closest(".categoria-cuadro");
    if (!cuadro) return;

    const cat = cuadro.dataset.categoria;
    const botonFiltro = filtros.querySelector(`[data-categoria="${cat}"]`);
    if (botonFiltro) {
      botonFiltro.click();
    } else {
      categoriaActiva = cat;
      actualizar();
    }
  });
}

// Envío del formulario y registro real de reserva (RF-03, RF-04, RF-05, RNF-03)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();
    mostrarEstadoPedido("", "ok");

    if (!formulario.reportValidity()) return;

    const hoy = new Date().toISOString().slice(0, 10);
    if (inputFecha && inputFecha.value < hoy) {
      inputFecha.setCustomValidity("La fecha de retiro no puede ser anterior a hoy.");
      inputFecha.reportValidity();
      inputFecha.addEventListener("input", () => inputFecha.setCustomValidity(""), { once: true });
      return;
    }

    const datosForm = Object.fromEntries(new FormData(formulario));
    const nombreProducto = datosForm.Productos;
    const cantidad = Number(datosForm.cantidad || 1);
    const esBandeja = nombreProducto === "Pedido de varios productos (Bandeja)";

    let items = [];
    if (esBandeja) {
      if (typeof tablero === "undefined" || !Array.isArray(tablero.pedido) || tablero.pedido.length === 0) {
        mostrarEstadoPedido("Tu bandeja de compras está vacía. Agrega artículos antes de confirmar.", "error");
        return;
      }
      for (const itemBandeja of tablero.pedido) {
        const prodCatalogo = productos.find(p => p.nombre === itemBandeja.nombre);
        if (!prodCatalogo || !prodCatalogo.id) {
          mostrarEstadoPedido(`No se encontró "${itemBandeja.nombre}" en el catálogo del servidor.`, "error");
          return;
        }
        if (itemBandeja.cantidad > prodCatalogo.stock) {
          mostrarEstadoPedido(
            `Stock insuficiente para "${prodCatalogo.nombre}". Disponibles reales: ${prodCatalogo.stock}.`,
            "error"
          );
          return;
        }
        items.push({ producto_id: prodCatalogo.id, cantidad: itemBandeja.cantidad });
      }
    } else {
      const prodCatalogo = productos.find(p => p.nombre === nombreProducto);
      if (!prodCatalogo) {
        mostrarEstadoPedido("Selecciona un artículo válido del catálogo.", "error");
        return;
      }
      if (cantidad > prodCatalogo.stock) {
        mostrarEstadoPedido(
          `Stock insuficiente para "${prodCatalogo.nombre}". Disponibles reales: ${prodCatalogo.stock}.`,
          "error"
        );
        return;
      }
      if (prodCatalogo.id) {
        items.push({ producto_id: prodCatalogo.id, cantidad });
      }
    }

    let mensajeExito = "";
    if (items.length > 0) {
      try {
        const resp = await fetch("api/reservas.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_nombre: datosForm.nombre,
            cliente_celular: datosForm.telefono,
            fecha_retiro: datosForm.fecha,
            notas: datosForm.notas || "",
            items,
          }),
        });
        const respuesta = await resp.json();
        if (!resp.ok) {
          mostrarEstadoPedido(respuesta.error || "No se pudo registrar la reserva.", "error");
          return;
        }
        mensajeExito = respuesta.mensaje || `¡Gracias ${datosForm.nombre}! Reserva registrada correctamente.`;
        await cargarCatalogoDesdeServidor();
        if (esBandeja && typeof tablero !== "undefined" && typeof renderTablero === "function") {
          tablero.pedido = [];
          renderTablero();
        }
      } catch {
        mostrarEstadoPedido("No se pudo conectar con el servidor para guardar la reserva.", "error");
        return;
      }
    } else {
      const detallePedido = `${cantidad}x ${nombreProducto}`;
      mensajeExito = `¡Gracias ${datosForm.nombre}! Tu pedido de "${detallePedido}" para el ${datosForm.fecha} quedó registrado.`;
    }

    mostrarEstadoPedido(mensajeExito, "ok");
    if (resultado) resultado.textContent = mensajeExito;

    const detalleTexto = esBandeja ? "Pedido múltiple de Bandeja" : `${cantidad}x ${nombreProducto}`;
    const msgWsp = `¡Hola Level Up Store! Mi nombre es ${datosForm.nombre}. Deseo encargar: ${detalleTexto}. Fecha de retiro: ${datosForm.fecha}. Teléfono: ${datosForm.telefono}. Notas: ${datosForm.notas || "Ninguna"}.`;
    const urlWsp = `https://wa.me/59174090398?text=${encodeURIComponent(msgWsp)}`;

    if (confirm(`${mensajeExito}\n\n¿Deseas enviar también la confirmación por WhatsApp?`)) {
      window.open(urlWsp, "_blank");
    }

    formulario.reset();
    if (inputFecha) inputFecha.min = hoy;
  });
}
