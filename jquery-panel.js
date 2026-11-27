/**
 * jquery-panel.js
 * Componentes interactivos con jQuery adaptados al contexto de "Level Up Store":
 * 1. Menú móvil interactivo (slideToggle y actualización de aria-expanded).
 * 2. Acordeón exclusivo de preguntas frecuentes (despliegue animado y accesibilidad).
 * 3. Tablón de avisos y novedades (animación escalonada con delay y alternancia mostrar/ocultar).
 * 4. Efecto de resaltado visual dinámico.
 */

$(function () {
  // ── 1. MENÚ MÓVIL DESPLEGABLE ──────────────────────────────────────────
  const $menuToggle = $("#menu-toggle");
  const $menuMovil = $("#menu-movil");

  $menuToggle.on("click", function () {
    $menuMovil.stop(true, true).slideToggle(200);

    const abierto = $(this).attr("aria-expanded") === "true";
    $(this).attr("aria-expanded", String(!abierto));
  });

  // Cerrar el menú automáticamente al hacer clic en un enlace (en pantallas móviles)
  $menuMovil.on("click", "a", function () {
    if (window.matchMedia("(max-width: 48rem)").matches) {
      $menuMovil.stop(true, true).slideUp(200);
      $menuToggle.attr("aria-expanded", "false");
    }
  });

  // ── 2. ACORDEÓN DE PREGUNTAS FRECUENTES ────────────────────────────────
  const $acordeon = $("#acordeon");

  $acordeon.on("click", ".titulo", function () {
    const $titulo = $(this);
    const $cuerpo = $titulo.next(".cuerpo");
    const estaAbierto = $titulo.attr("aria-expanded") === "true";

    // Cierra las demás secciones abiertas para mantener el acordeón exclusivo
    $acordeon.find(".cuerpo").not($cuerpo).stop(true, true).slideUp(200, function () {
      $(this).attr("hidden", true);
    });
    $acordeon.find(".titulo").not($titulo).attr("aria-expanded", "false");

    // Alterna la sección actual
    if (estaAbierto) {
      $cuerpo.stop(true, true).slideUp(200, function () {
        $cuerpo.attr("hidden", true);
      });
      $titulo.attr("aria-expanded", "false");
    } else {
      $cuerpo.removeAttr("hidden").hide().stop(true, true).slideDown(200);
      $titulo.attr("aria-expanded", "true");
    }
  });

  // ── 3. TABLÓN DE AVISOS Y NOVEDADES ───────────────────────────────────
  const $btnAvisos = $("#mostrar-avisos");
  const $itemsAvisos = $("#avisos li");
  let avisosVisibles = false;

  $btnAvisos.on("click", function () {
    if (!avisosVisibles) {
      // Aparición escalonada con delay() y fadeIn()
      $itemsAvisos.each(function (indice) {
        $(this)
          .removeAttr("hidden")
          .hide()
          .stop(true, true)
          .delay(indice * 120)
          .fadeIn(250);
      });
      $btnAvisos.text("Ocultar avisos");
      avisosVisibles = true;
    } else {
      // Ocultar avisos con fadeOut()
      $itemsAvisos.stop(true, true).fadeOut(200, function () {
        $(this).attr("hidden", true);
      });
      $btnAvisos.text("Mostrar avisos");
      avisosVisibles = false;
    }
  });

  // ── 4. FUNCIÓN Y EFECTO DE RESALTADO ──────────────────────────────────
  window.resaltar = function ($seleccion, milisegundos = 1400) {
    if (!$seleccion || !$seleccion.length) return $seleccion;
    $seleccion.addClass("resaltado");
    setTimeout(() => {
      $seleccion.removeClass("resaltado");
    }, milisegundos);
    return $seleccion;
  };

  // Resalta el título del panel al cargar la página
  window.resaltar($("#panel h2")).css("letter-spacing", "0.5px");
});
