const CLAVE = "levelupstore:preferencias";
const PREFERENCIAS_POR_DEFECTO = { tema: "claro", orden: "nombre" };

function leerPreferencias() {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (!texto) return { ...PREFERENCIAS_POR_DEFECTO };
    const guardado = JSON.parse(texto);
    return { ...PREFERENCIAS_POR_DEFECTO, ...guardado };
  } catch (error) {
    console.warn("Preferencias corruptas, se usan las por defecto:", error.message);
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}

function guardarPreferencias(prefs) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.warn("No se pudo guardar:", error.message);
    return false;
  }
}

let preferencias = leerPreferencias();

function aplicarPreferencias() {
  const oscuro = preferencias.tema === "oscuro";
  document.body.classList.toggle("tema-oscuro", oscuro);

  const botonCabecera = document.querySelector("#header-tema-toggle");
  if (botonCabecera) {
    botonCabecera.setAttribute("aria-pressed", String(oscuro));
    botonCabecera.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
  }

  const orden = document.querySelector("#orden");
  if (orden) orden.value = preferencias.orden;

  const estado = document.querySelector("#estado-prefs");
  if (estado) estado.textContent = `(${preferencias.tema})`;

  if (typeof dibujarGrafico === "function") {
    dibujarGrafico();
  }
}

aplicarPreferencias();

function alternarTema() {
  preferencias.tema = preferencias.tema === "oscuro" ? "claro" : "oscuro";
  guardarPreferencias(preferencias);
  aplicarPreferencias();
}

document.querySelector("#header-tema-toggle")?.addEventListener("click", alternarTema);

document.querySelector("#orden")?.addEventListener("change", (event) => {
  preferencias.orden = event.target.value;
  guardarPreferencias(preferencias);
  aplicarPreferencias();
  if (typeof actualizar === "function") actualizar();
});

document.querySelector("#header-olvidar")?.addEventListener("click", () => {
  localStorage.removeItem(CLAVE);
  preferencias = { ...PREFERENCIAS_POR_DEFECTO };
  aplicarPreferencias();
  if (typeof actualizar === "function") actualizar();
});

// ── GEOLOCALIZACIÓN Y DISTANCIA AL LOCAL (UBICADO EN ASIDE) ──────────────
const LOCAL = { lat: -16.9388, lng: -68.2435 }; // Colquencha, La Paz

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const aRad = (g) => (g * Math.PI) / 180;
  const dLat = aRad(lat2 - lat1);
  const dLng = aRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const $ubic = document.querySelector("#estado-ubicacion");

document.querySelector("#ubicarme")?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    if ($ubic) {
      $ubic.textContent = "Tu navegador no soporta geolocalización.";
      $ubic.className = "error";
    }
    return;
  }

  if ($ubic) {
    $ubic.textContent = "Obteniendo ubicación...";
    $ubic.className = "cargando";
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const km = distanciaKm(latitude, longitude, LOCAL.lat, LOCAL.lng);
      if ($ubic) {
        $ubic.textContent = `Estás a ~${km.toFixed(1)} km del local (precisión: ±${Math.round(accuracy)} m).`;
        $ubic.className = "ok";
      }
    },
    (error) => {
      const mensajes = {
        [error.PERMISSION_DENIED]: "Permiso denegado por el usuario.",
        [error.POSITION_UNAVAILABLE]: "Ubicación no disponible.",
        [error.TIMEOUT]: "Tiempo de espera agotado.",
      };
      if ($ubic) {
        $ubic.textContent = mensajes[error.code] || "Error al obtener ubicación.";
        $ubic.className = "error";
      }
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
});