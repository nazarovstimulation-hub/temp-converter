/* Interacciones de la landing */
(function () {
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () { links.classList.toggle("open"); });
    links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); }); });
  }

  // Enlaces de plantilla: abren la invitación de ejemplo con esa plantilla
  document.querySelectorAll("[data-template-link]").forEach(function (a) {
    var t = a.getAttribute("data-template-link");
    a.href = "invitacion.html?plantilla=" + encodeURIComponent(t);
  });

  // Solo un FAQ abierto a la vez
  document.querySelectorAll(".faq details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      document.querySelectorAll(".faq details").forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
