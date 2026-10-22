/* Rellena la invitación con los parámetros de la URL (o los datos de ejemplo) */
(function () {
  var q = new URLSearchParams(location.search);
  var get = function (k, d) { var v = q.get(k); return v !== null && v !== "" ? v : d; };

  var data = {
    tpl: get("plantilla", "botanica"),
    n1: get("n1", "Lucía"),
    n2: get("n2", "Pablo"),
    fecha: get("fecha", "2027-06-12"),
    hora: get("hora", "13:00"),
    ciudad: get("ciudad", "Sevilla"),
    intro: get("intro", "¡Nos casamos!"),
    historia: get("historia", "Nos conocimos en una feria de abril, bailando sevillanas sin saber bailar. Ocho años, dos gatos y un viaje a Lisboa después, queremos celebrarlo con la gente que más queremos: vosotros."),
    cerLugar: get("cer_lugar", "Iglesia de Santa Ana"),
    cerDir: get("cer_dir", "Calle Vázquez de Leca, 1, Triana, Sevilla"),
    celLugar: get("cel_lugar", "Hacienda La Alquería"),
    celDir: get("cel_dir", "Carretera de Utrera km 4, Alcalá de Guadaíra"),
    celHora: get("cel_hora", "15:00"),
    dress: get("dress", "Formal con aire de verano. Ellas: vestido largo o midi, nada de blanco. Ellos: traje claro, corbata opcional. Habrá césped: mejor evitar tacón fino."),
    iban: get("iban", "ES12 3456 7890 1234 5678 9012"),
    bizum: get("bizum", "600 000 000"),
    regaloTxt: get("regalo_txt", "Vuestra presencia es el mejor regalo. Si además queréis ayudarnos con nuestra luna de miel en Japón, aquí tenéis cómo."),
    bus: get("bus", "Autobús gratuito desde Plaza de Armas a las 12:15 y regreso a las 02:00 y 04:00."),
    whatsapp: get("whatsapp", ""),
    deadline: get("plazo", "2027-05-12"),
    embed: q.get("embed") === "1"
  };

  document.documentElement.setAttribute("data-tpl", data.tpl);
  if (data.embed) document.body.classList.add("embed");

  var set = function (sel, val) { document.querySelectorAll(sel).forEach(function (el) { el.textContent = val; }); };

  // Fecha
  var d = new Date(data.fecha + "T" + data.hora + ":00");
  var fmtLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fmtShort = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });
  var fechaLarga = isNaN(d) ? data.fecha : fmtLong.format(d);
  fechaLarga = fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1);

  document.title = data.n1 + " & " + data.n2 + " · " + (isNaN(d) ? data.fecha : fmtShort.format(d));
  set("[data-n1]", data.n1); set("[data-n2]", data.n2);
  set("[data-intro]", data.intro);
  set("[data-fecha-larga]", fechaLarga);
  set("[data-ciudad]", data.ciudad);
  set("[data-historia]", data.historia);
  set("[data-cer-lugar]", data.cerLugar); set("[data-cer-dir]", data.cerDir); set("[data-cer-hora]", data.hora);
  set("[data-cel-lugar]", data.celLugar); set("[data-cel-dir]", data.celDir); set("[data-cel-hora]", data.celHora);
  set("[data-dress]", data.dress);
  set("[data-iban]", data.iban); set("[data-bizum]", data.bizum); set("[data-regalo-txt]", data.regaloTxt);
  set("[data-bus]", data.bus);
  var plazo = new Date(data.deadline + "T00:00:00");
  set("[data-plazo]", isNaN(plazo) ? data.deadline : fmtShort.format(plazo));

  // Mapas
  var maps = function (q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); };
  document.querySelectorAll("[data-map-cer]").forEach(function (a) { a.href = maps(data.cerLugar + ", " + data.cerDir); });
  document.querySelectorAll("[data-map-cel]").forEach(function (a) { a.href = maps(data.celLugar + ", " + data.celDir); });

  // Programa del día: derivado de la hora de la ceremonia
  var addMin = function (date, m) { return new Date(date.getTime() + m * 60000); };
  var hm = function (x) { return x.toTimeString().slice(0, 5); };
  if (!isNaN(d)) {
    var cel = new Date(data.fecha + "T" + data.celHora + ":00");
    if (isNaN(cel)) cel = addMin(d, 120);
    var prog = [
      [d, "Ceremonia", data.cerLugar],
      [cel, "Cóctel de bienvenida", data.celLugar],
      [addMin(cel, 120), "Banquete", "Menú con opción vegetariana"],
      [addMin(cel, 300), "Primer baile y barra libre", "¡Hasta que el cuerpo aguante!"],
      [addMin(cel, 540), "Recena", "Para reponer fuerzas"]
    ];
    var ul = document.querySelector("[data-programa]");
    if (ul) {
      ul.innerHTML = "";
      prog.forEach(function (p) {
        var li = document.createElement("li");
        li.innerHTML = "<time>" + hm(p[0]) + "</time><span class=\"dot\"></span><div><b></b><small></small></div>";
        li.querySelector("b").textContent = p[1];
        li.querySelector("small").textContent = p[2];
        ul.appendChild(li);
      });
    }
  }

  // Cuenta atrás
  var cd = document.querySelector("[data-countdown]");
  function tick() {
    if (!cd || isNaN(d)) return;
    var diff = Math.max(0, d - new Date());
    var days = Math.floor(diff / 864e5), hrs = Math.floor(diff / 36e5) % 24, mins = Math.floor(diff / 6e4) % 60, secs = Math.floor(diff / 1e3) % 60;
    cd.querySelector("[data-d]").textContent = days;
    cd.querySelector("[data-h]").textContent = String(hrs).padStart(2, "0");
    cd.querySelector("[data-m]").textContent = String(mins).padStart(2, "0");
    cd.querySelector("[data-s]").textContent = String(secs).padStart(2, "0");
  }
  tick(); setInterval(tick, 1000);

  // Añadir al calendario (.ics)
  var ics = document.querySelector("[data-ics]");
  if (ics && !isNaN(d)) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var stamp = function (x) { return x.getFullYear() + pad(x.getMonth() + 1) + pad(x.getDate()) + "T" + pad(x.getHours()) + pad(x.getMinutes()) + "00"; };
    var body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//invitacion//ES", "BEGIN:VEVENT",
      "DTSTART:" + stamp(d), "DTEND:" + stamp(addMin(d, 600)),
      "SUMMARY:Boda de " + data.n1 + " y " + data.n2,
      "LOCATION:" + data.cerLugar + ", " + data.cerDir, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    ics.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
    ics.download = "boda-" + data.n1.toLowerCase() + "-" + data.n2.toLowerCase() + ".ics";
  }

  // Copiar IBAN / Bizum
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = document.querySelector(b.getAttribute("data-copy")).textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      b.textContent = "Copiado ✓"; setTimeout(function () { b.textContent = "Copiar"; }, 1600);
    });
  });

  // WhatsApp de los novios
  var wa = document.querySelector("[data-wa]");
  if (wa) { if (data.whatsapp) wa.href = "https://wa.me/" + data.whatsapp.replace(/\D/g, ""); else wa.style.display = "none"; }

  // RSVP (demo: guarda en localStorage; en producción se envía al panel)
  var rsvp = document.querySelector(".rsvp");
  var form = rsvp && rsvp.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form), rec = {};
      fd.forEach(function (v, k) { rec[k] = v; });
      rec.ts = new Date().toISOString();
      try {
        var key = "rsvp:" + data.n1 + "-" + data.n2 + "-" + data.fecha;
        var list = JSON.parse(localStorage.getItem(key) || "[]"); list.push(rec); localStorage.setItem(key, JSON.stringify(list));
      } catch (_) {}
      rsvp.querySelector("[data-thanks-name]").textContent = rec.nombre || "";
      rsvp.querySelector("[data-thanks-msg]").textContent = rec.asiste === "no"
        ? "Os echaremos de menos. Gracias por avisarnos."
        : "¡Qué alegría! Os esperamos el " + fechaLarga.toLowerCase() + ".";
      rsvp.classList.add("sent");
      rsvp.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Música (tono generado con WebAudio para no depender de archivos externos)
  var musicBtn = document.querySelector(".music");
  var ctx, osc, gain;
  if (musicBtn) {
    musicBtn.addEventListener("click", function () {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        gain = ctx.createGain(); gain.gain.value = 0.04; gain.connect(ctx.destination);
        var notes = [392, 440, 494, 587, 494, 440, 392, 330], i = 0;
        osc = ctx.createOscillator(); osc.type = "sine"; osc.connect(gain); osc.start();
        setInterval(function () { if (musicBtn.classList.contains("on")) { osc.frequency.setTargetAtTime(notes[i++ % notes.length], ctx.currentTime, 0.05); } }, 500);
      }
      var on = musicBtn.classList.toggle("on");
      gain.gain.setTargetAtTime(on ? 0.04 : 0, ctx.currentTime, 0.05);
      musicBtn.setAttribute("aria-pressed", on);
    });
  }

  // Marca en el pie
  if (window.BRAND) {
    document.querySelectorAll("[data-brand-name]").forEach(function (el) { el.textContent = window.BRAND.name; });
  }
})();
