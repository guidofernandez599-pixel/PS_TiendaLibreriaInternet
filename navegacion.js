/**
 * navegacion.js
 * Control de navegación accesible y diálogo nativo para Level Up Store.
 */

// ── 1. MENÚ DESPLEGABLE ACCESIBLE ────────────────────────────────────────
const botonMenu = document.querySelector("#menu-toggle");
const navMovil = document.querySelector("#menu-movil");

function abrirMenu() {
  if (!navMovil || !botonMenu) return;
  navMovil.style.display = "block";
  botonMenu.setAttribute("aria-expanded", "true");
}

function cerrarMenu({ devolverFoco = false } = {}) {
  if (!navMovil || !botonMenu) return;
  // En pantallas de escritorio mantenemos la navegación visible si aplica
  if (window.matchMedia("(max-width: 48rem)").matches) {
    navMovil.style.display = "none";
  }
  botonMenu.setAttribute("aria-expanded", "false");

  if (devolverFoco) botonMenu.focus();
}

if (botonMenu && navMovil) {
  botonMenu.addEventListener("click", () => {
    const estaAbierto = botonMenu.getAttribute("aria-expanded") === "true";
    estaAbierto ? cerrarMenu() : abrirMenu();
  });

  // Cerrar menú con la tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && botonMenu.getAttribute("aria-expanded") === "true") {
      cerrarMenu({ devolverFoco: true });
    }
  });

  // Cerrar menú al presionar cualquier enlace de navegación
  navMovil.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      cerrarMenu();
    }
  });

  // Reajuste al redimensionar la ventana
  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 48rem)").matches) {
      navMovil.style.display = "";
      botonMenu.setAttribute("aria-expanded", "false");
    }
  });
}

// ── 2. <dialog> NATIVO DE HORARIOS Y CONTACTO RÁPIDO ─────────────────────
const dialogoHorarios = document.querySelector("#dialogo-horarios");
const btnAbrirDialogo = document.querySelector("#abrir-dialogo-horarios");
const btnCerrarDialogo = document.querySelector("#cerrar-dialogo-horarios");

if (dialogoHorarios && btnAbrirDialogo) {
  btnAbrirDialogo.addEventListener("click", () => {
    dialogoHorarios.showModal();
  });

  btnCerrarDialogo?.addEventListener("click", () => {
    dialogoHorarios.close();
  });

  // Cerrar al hacer clic en el backdrop (fondo oscuro exterior)
  dialogoHorarios.addEventListener("click", (event) => {
    if (event.target === dialogoHorarios) {
      dialogoHorarios.close();
    }
  });
}

// ── 3. DETECCIÓN DE CAMPOS PARA EVITAR ZOOM EN DISPOSITIVOS MÓVILES ──────
const camposChicos = [...document.querySelectorAll("input, select, textarea")]
  .filter(el => parseFloat(window.getComputedStyle(el).fontSize) < 16);

console.log(
  camposChicos.length === 0
    ? "✅ [Level Up Store]: Todos los campos tienen 16px o más. iOS no forzará zoom indeseado."
    : `⚠️ [Level Up Store]: ${camposChicos.length} campos tienen menos de 16px.`
);