/*
 * Configuración de marca — Invitalia (invitalia.co)
 * Cambia aquí el nombre, contacto y colores: todo el sitio lo lee de este archivo.
 * (Настройки бренда: имя, контакты и цвета меняются только здесь.)
 */
window.BRAND = {
  name: "Invitalia",
  tagline: "Invitaciones digitales para cada celebración",
  domain: "invitalia.co",
  url: "https://invitalia.co",
  email: "hola@invitalia.co",
  whatsapp: "34600000000",        // solo dígitos, con prefijo de país — cambiar por el real
  instagram: "invitalia.co",
  city: "Madrid",
  year: new Date().getFullYear(),
  colors: {
    primary: "#6b7f5e",   // verde salvia
    accent: "#c4704f",    // terracota
    ink: "#2a2a28",
    paper: "#faf7f2",
    sand: "#efe7db"
  }
};

(function applyBrand() {
  var b = window.BRAND;
  var root = document.documentElement;
  Object.keys(b.colors).forEach(function (k) {
    root.style.setProperty("--" + k, b.colors[k]);
  });
  function fill() {
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      var key = el.getAttribute("data-brand");
      if (key === "name") el.textContent = b.name;
      else if (key === "tagline") el.textContent = b.tagline;
      else if (key === "domain") el.textContent = b.domain;
      else if (key === "email") { el.textContent = b.email; if (el.tagName === "A") el.href = "mailto:" + b.email; }
      else if (key === "instagram") { el.textContent = "@" + b.instagram; if (el.tagName === "A") el.href = "https://instagram.com/" + b.instagram; }
      else if (key === "whatsapp") { if (el.tagName === "A") el.href = "https://wa.me/" + b.whatsapp; }
      else if (key === "year") el.textContent = b.year;
    });
    if (document.title.indexOf("{brand}") !== -1) document.title = document.title.replace("{brand}", b.name);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
