const vistaLogin = document.querySelector("#vista-login");
const vistaPanel = document.querySelector("#vista-panel");
const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
const formLogin = document.querySelector("#form-login");
const loginError = document.querySelector("#login-error");
const adminSaludo = document.querySelector("#admin-saludo");

const conteoHoy = document.querySelector("#conteo-hoy");
const textoHoy = document.querySelector("#texto-hoy");
const filtroReservasQ = document.querySelector("#filtro-reservas-q");
const filtroReservasEstado = document.querySelector("#filtro-reservas-estado");
const estadoReservas = document.querySelector("#estado-reservas");
const listaReservas = document.querySelector("#lista-reservas");

const formNuevoProducto = document.querySelector("#form-nuevo-producto");
const estadoNuevoProducto = document.querySelector("#estado-nuevo-producto");
const filtroInventario = document.querySelector("#filtro-inventario");
const estadoInventario = document.querySelector("#estado-inventario");
const listaInventario = document.querySelector("#lista-inventario");

let catalogoAdmin = [];

function mostrarMensaje(el, texto, tipo = "ok") {
  if (!el) return;
  el.textContent = texto;
  el.className = `mensaje-estado ${tipo}`;
  el.hidden = !texto;
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

// ── SESIÓN ─────────────────────────────────────────────────────────────────
async function verificarSesion() {
  try {
    const resp = await fetch("api/auth.php");
    const datos = await resp.json();
    if (datos.autenticado) {
      activarVistaAutenticada(datos.nombre || datos.usuario);
    } else {
      activarVistaLogin();
    }
  } catch {
    activarVistaLogin();
    mostrarMensaje(loginError, "No se pudo conectar con el servidor PHP/MySQL.", "error");
  }
}

function activarVistaLogin() {
  vistaLogin.hidden = false;
  vistaPanel.hidden = true;
  btnCerrarSesion.hidden = true;
}

function activarVistaAutenticada(nombre) {
  vistaLogin.hidden = true;
  vistaPanel.hidden = false;
  btnCerrarSesion.hidden = false;
  adminSaludo.textContent = `Sesión iniciada como: ${nombre}`;
  cargarReservas();
  cargarInventario();
}

formLogin?.addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarMensaje(loginError, "", "error");

  const usuario = document.querySelector("#login-usuario").value.trim();
  const password = document.querySelector("#login-password").value;

  try {
    const resp = await fetch("api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });
    const datos = await resp.json();
    if (!resp.ok) {
      mostrarMensaje(loginError, datos.error || "Credenciales inválidas.", "error");
      return;
    }
    formLogin.reset();
    activarVistaAutenticada(datos.nombre || datos.usuario);
  } catch {
    mostrarMensaje(loginError, "Error de conexión con el servidor.", "error");
  }
});

btnCerrarSesion?.addEventListener("click", async () => {
  await fetch("api/auth.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accion: "logout" }),
  });
  activarVistaLogin();
});

// ── PESTAÑAS ───────────────────────────────────────────────────────────────
document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => {
      t.classList.remove("activo");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("activo");
    tab.setAttribute("aria-selected", "true");

    const destino = tab.dataset.tab;
    document.querySelector("#tab-reservas").hidden = destino !== "reservas";
    document.querySelector("#tab-inventario").hidden = destino !== "inventario";
  });
});

// ── RESERVAS ───────────────────────────────────────────────────────────────
async function cargarReservas() {
  const estado = filtroReservasEstado?.value || "activa";
  const q = filtroReservasQ?.value.trim() || "";
  const params = new URLSearchParams({ estado });
  if (q) params.set("q", q);

  try {
    const resp = await fetch(`api/reservas.php?${params.toString()}`);
    if (resp.status === 401) {
      activarVistaLogin();
      return;
    }
    const datos = await resp.json();

    const hoy = Number(datos.reservas_hoy || 0);
    conteoHoy.textContent = String(hoy);
    textoHoy.textContent = hoy === 0
      ? "No hay retiros pendientes para hoy"
      : `${hoy === 1 ? "reserva activa" : "reservas activas"} para hoy`;

    pintarReservas(datos.reservas || [], estado);
  } catch {
    mostrarMensaje(estadoReservas, "No se pudieron cargar las reservas.", "error");
  }
}

function pintarReservas(reservas, estadoFiltro) {
  if (!listaReservas) return;
  if (reservas.length === 0) {
    const msg = estadoFiltro === "activa"
      ? "No hay reservas activas con ese criterio."
      : "No hay reservas registradas en esta vista.";
    listaReservas.innerHTML = `<div class="admin-card"><p>${msg}</p></div>`;
    return;
  }

  listaReservas.innerHTML = reservas.map((r) => {
    const itemsHtml = (r.items || []).map((it) =>
      `<li>${it.cantidad}x ${escaparHtml(it.producto_nombre)} (Bs ${(it.cantidad * it.precio_unitario).toFixed(2)})</li>`
    ).join("");

    const notasHtml = r.notas
      ? `<p class="reserva-notas"><strong>Notas:</strong> ${escaparHtml(r.notas)}</p>`
      : "";

    let accionesHtml = "";
    if (r.estado === "activa") {
      accionesHtml = `
        <button type="button" class="btn-entregar" data-id="${r.id}" data-estado="entregada">✅ Marcar entregada</button>
        <button type="button" class="btn-cancelar" data-id="${r.id}" data-estado="cancelada">❌ Cancelar y reintegrar stock</button>
      `;
    } else {
      accionesHtml = `
        <button type="button" class="btn-revertir" data-id="${r.id}" data-estado="activa">↩️ Revertir a activa</button>
      `;
    }

    return `
      <article class="admin-card reserva-card estado-${r.estado}">
        <div class="reserva-cabecera">
          <div>
            <h3>Reserva #${r.id} · ${escaparHtml(r.cliente_nombre)}</h3>
            <p class="reserva-meta">📞 ${escaparHtml(r.cliente_celular)} · 📅 Retiro: <strong>${escaparHtml(r.fecha_retiro)}</strong></p>
          </div>
          <span class="badge-estado badge-${r.estado}">${r.estado.toUpperCase()}</span>
        </div>
        <ul class="reserva-items">${itemsHtml}</ul>
        ${notasHtml}
        <div class="reserva-pie">
          <strong>Total: Bs ${Number(r.total || 0).toFixed(2)}</strong>
          <div class="reserva-acciones">${accionesHtml}</div>
        </div>
      </article>
    `;
  }).join("");
}

listaReservas?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const estado = btn.dataset.estado;

  try {
    const resp = await fetch("api/reservas.php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado }),
    });
    const datos = await resp.json();
    if (!resp.ok) {
      mostrarMensaje(estadoReservas, datos.error || "No se pudo actualizar la reserva.", "error");
      return;
    }
    mostrarMensaje(estadoReservas, datos.mensaje || "Reserva actualizada.", "ok");
    cargarReservas();
    cargarInventario();
  } catch {
    mostrarMensaje(estadoReservas, "Error de conexión al actualizar la reserva.", "error");
  }
});

filtroReservasQ?.addEventListener("input", () => cargarReservas());
filtroReservasEstado?.addEventListener("change", () => cargarReservas());

// ── INVENTARIO ─────────────────────────────────────────────────────────────
async function cargarInventario() {
  try {
    const resp = await fetch("api/productos.php");
    const datos = await resp.json();
    catalogoAdmin = datos.productos || [];
    pintarInventario();
  } catch {
    mostrarMensaje(estadoInventario, "No se pudo cargar el inventario.", "error");
  }
}

function pintarInventario() {
  if (!listaInventario) return;
  const q = (filtroInventario?.value || "").trim().toLowerCase();
  const filtrados = catalogoAdmin.filter((p) =>
    p.nombre.toLowerCase().includes(q) || (p.categoria || "").toLowerCase().includes(q)
  );

  if (filtrados.length === 0) {
    listaInventario.innerHTML = `<div class="admin-card"><p>No hay artículos que coincidan con "${escaparHtml(q)}".</p></div>`;
    return;
  }

  listaInventario.innerHTML = filtrados.map((p) => {
    const alertaBajo = p.stock <= 5
      ? `<span class="badge-stock-bajo">${p.stock === 0 ? "Sin stock" : "Stock bajo"}</span>`
      : "";

    return `
      <div class="admin-card inventario-item" data-id="${p.id}">
        <div class="inventario-info">
          <strong>${escaparHtml(p.nombre)}</strong>
          <small>${escaparHtml(p.categoria_nombre || p.categoria)} · Unidad: ${escaparHtml(p.unidad)} ${alertaBajo}</small>
        </div>
        <div class="inventario-controles">
          <label>
            Precio (Bs)
            <input type="number" class="input-precio" step="0.50" min="0.50" value="${Number(p.precio).toFixed(2)}">
          </label>
          <label>
            Stock
            <input type="number" class="input-stock" min="0" value="${p.stock}">
          </label>
          <button type="button" class="btn-guardar-prod">Guardar</button>
        </div>
      </div>
    `;
  }).join("");
}

listaInventario?.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-guardar-prod");
  if (!btn) return;

  const fila = btn.closest(".inventario-item");
  const id = Number(fila.dataset.id);
  const precio = Number(fila.querySelector(".input-precio").value);
  const stock = Number(fila.querySelector(".input-stock").value);

  try {
    const resp = await fetch("api/productos.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, precio, stock }),
    });
    const datos = await resp.json();
    if (!resp.ok) {
      mostrarMensaje(estadoInventario, datos.error || "No se pudo guardar.", "error");
      return;
    }
    mostrarMensaje(estadoInventario, `Producto #${id} actualizado (Bs ${precio.toFixed(2)}, stock ${stock}).`, "ok");
    cargarInventario();
  } catch {
    mostrarMensaje(estadoInventario, "Error de conexión al guardar.", "error");
  }
});

filtroInventario?.addEventListener("input", () => pintarInventario());

formNuevoProducto?.addEventListener("submit", async (e) => {
  e.preventDefault();
  mostrarMensaje(estadoNuevoProducto, "", "ok");

  const payload = {
    nombre: document.querySelector("#nuevo-nombre").value.trim(),
    categoria: document.querySelector("#nuevo-categoria").value,
    precio: Number(document.querySelector("#nuevo-precio").value),
    unidad: document.querySelector("#nuevo-unidad").value.trim(),
    stock: Number(document.querySelector("#nuevo-stock").value),
    imagen: document.querySelector("#nuevo-imagen").value.trim(),
  };

  try {
    const resp = await fetch("api/productos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const datos = await resp.json();
    if (!resp.ok) {
      mostrarMensaje(estadoNuevoProducto, datos.error || "No se pudo registrar el producto.", "error");
      return;
    }
    formNuevoProducto.reset();
    document.querySelector("#nuevo-unidad").value = "unidad";
    document.querySelector("#nuevo-stock").value = "10";
    mostrarMensaje(estadoNuevoProducto, datos.mensaje || "Producto registrado.", "ok");
    cargarInventario();
  } catch {
    mostrarMensaje(estadoNuevoProducto, "Error de conexión al registrar.", "error");
  }
});

verificarSesion();
