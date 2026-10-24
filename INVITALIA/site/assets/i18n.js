/* INVITALIA i18n — es (primary), en, it, pt, fr, de, ru.
   Usage: elements carry data-i18n="key" (textContent), data-i18n-html="key" (innerHTML, trusted strings only),
   data-i18n-placeholder, data-i18n-aria, data-i18n-title. Call I18N.apply() after DOM changes.
   I18N.t(key, vars) → string with {var} substitution. I18N.n(key, n) → plural form (key.one / key.few / key.many / key.other). */
(function (global) {
  'use strict';
  var LANGS = ['es', 'en', 'it', 'pt', 'fr', 'de', 'ru'];
  var NAMES = { es: 'Español', en: 'English', it: 'Italiano', pt: 'Português', fr: 'Français', de: 'Deutsch', ru: 'Русский' };
  var LOCALE = { es: 'es-ES', en: 'en-GB', it: 'it-IT', pt: 'pt-PT', fr: 'fr-FR', de: 'de-DE', ru: 'ru-RU' };

  var D = {};

  D.es = {
    'meta.title': 'Invitalia.co — Invitaciones de boda digitales', 'meta.editor': 'Editor de invitación · Invitalia.co', 'meta.guest': 'Invitación · Invitalia.co',
    'lang.label': 'Idioma',
    'nav.templates': 'Plantillas', 'nav.features': 'Funciones', 'nav.dashboard': 'Panel', 'nav.how': 'Cómo funciona', 'nav.pricing': 'Precio', 'nav.faq': 'Preguntas', 'nav.editor': 'Editor', 'nav.cta': 'Crear invitación',
    'hero.eyebrow': 'Invitaciones de boda digitales', 'hero.title': 'La invitación que tus invitados <em>abren en el móvil</em> y responden al instante',
    'hero.lead': 'Elige una plantilla, escribe los nombres y la fecha, añade el mapa, la música y el código QR. Las respuestas de los invitados llegan solas a tu panel.',
    'hero.cta1': 'Crear gratis', 'hero.cta2': 'Ver plantillas', 'hero.note': '<b>Crear y editar es gratis.</b> Pagas una sola vez cuando la invitación está lista y publicas el enlace.',
    'hero.trust1': 'Lista en 15 minutos', 'hero.trust2': 'Sin diseñador ni imprenta', 'hero.trust3': 'Se abre con enlace y QR',
    'inv.place': 'Villa del Balbianello, lago de Como', 'inv.chip.map': 'Mapa', 'inv.chip.music': 'Música', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Ceremonia', 'inv.sched2': 'Aperitivo en el jardín', 'inv.sched3': 'Cena y baile',
    'inv.rsvp.q': '¿Vendrás? Responde, por favor, antes del 1 de agosto', 'inv.rsvp.yes': 'Con mucho gusto', 'inv.rsvp.no': 'No podré', 'inv.rsvp.doneYes': '¡Gracias! Tu respuesta ha llegado a los novios.', 'inv.rsvp.doneNo': 'Qué pena. Tu respuesta ha sido enviada.',
    'tpl.eyebrow': 'Plantillas listas', 'tpl.title': 'El estilo de tu boda ya está dibujado', 'tpl.lead': 'Cada plantilla se adapta al móvil, la tableta y el ordenador. Colores, tipografías y fotos se cambian en el editor.',
    'tpl.filter.all': 'Todas', 'tpl.filter.classic': 'Clásica', 'tpl.filter.minimal': 'Minimalista', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Estilo italiano', 'tpl.filter.other': 'Más',
    'tpl.palazzo.desc': 'Clásica: serifa, doble marco, marfil y oro.', 'tpl.linea.desc': 'Minimalista: fondo blanco, sans fina, nada más.', 'tpl.heritage.desc': 'Old money: verde profundo, cursiva crema, lujo silencioso.', 'tpl.amalfi.desc': 'Estilo italiano: terracota, luz de limón y rayas de sombrilla.', 'tpl.botanica.desc': 'Verde y aire para una boda en un jardín o una bodega.', 'tpl.noir.desc': 'Boda de noche: negro, champán y destellos de oro.',
    'feat.eyebrow': 'Interactividad dentro de la invitación', 'feat.title': 'No es una postal, es un asistente para tus invitados', 'feat.lead': 'Todo lo que normalmente se envía en mensajes sueltos ya está dentro de la invitación.',
    'feat.rsvp.t': 'Formulario RSVP', 'feat.rsvp.d': 'El invitado confirma su asistencia, indica acompañante, preferencias de menú y deseos. Las preguntas las decides tú.',
    'feat.map.t': 'Mapa interactivo', 'feat.map.d': 'La ceremonia y el banquete en el mapa; la ruta se abre con un toque en el navegador habitual.',
    'feat.music.t': 'Música de fondo', 'feat.music.d': 'Tu melodía suena al abrir la invitación y marca el tono antes de la fiesta.',
    'feat.qr.t': 'Código QR', 'feat.qr.d': 'Un código listo para tarjetas impresas, marcasitios y stories. Lo escanean y entran directamente en la invitación.',
    'dash.eyebrow': 'Panel del organizador', 'dash.title': 'Todas las respuestas se recogen solas', 'dash.lead': 'Deja de contar confirmaciones en los chats. Cada respuesta aparece en el panel con nombre, hora y comentario. La lista se exporta a Excel para el restaurante, la distribución de mesas y los proveedores.',
    'dash.invited': 'invitados', 'dash.yes': 'vendrán', 'dash.no': 'no podrán', 'dash.wait': 'sin respuesta', 'dash.open': 'Abrir el panel', 'dash.tableTitle': 'Respuestas · Alessandro y María', 'dash.export': 'Exportar a Excel', 'dash.exportDone': 'Archivo listo (demo)',
    'dash.th.guest': 'Invitado', 'dash.th.answer': 'Respuesta', 'dash.th.plus': 'Acomp.', 'dash.th.menu': 'Menú', 'dash.th.received': 'Recibida',
    'dash.pill.yes': 'Vendrá', 'dash.pill.yesPl': 'Vendrán', 'dash.pill.no': 'No podrá', 'dash.pill.wait': 'Pendiente',
    'dash.menu1': 'Pescado', 'dash.menu2': 'Vegetariano', 'dash.menu4': 'Carne, infantil', 'dash.time1': 'ayer, 21:14', 'dash.time2': 'ayer, 18:02', 'dash.time3': 'hace 2 días', 'dash.time4': 'hace 3 días', 'dash.remind': 'recordar', 'dash.family': 'Familia López',
    'how.eyebrow': 'Cómo funciona', 'how.title': 'Tres pasos hasta el enlace listo',
    'how.s1.t': 'Elige una plantilla', 'how.s1.d': 'Abre cualquier diseño y empieza a editar al momento, sin registrar una tarjeta.', 'how.s2.t': 'Rellena los detalles', 'how.s2.d': 'Nombres, fecha, lugar, programa del día, dress code, preguntas del formulario, música y fotos.', 'how.s3.t': 'Publica el enlace', 'how.s3.d': 'Paga la publicación, recibe el enlace corto y el QR. Envíalo a tus invitados y sigue las respuestas.',
    'price.eyebrow': 'Precio', 'price.title': 'Pagas una vez, y solo por el resultado', 'price.lead': 'Crea y rehaz la invitación tantas veces como quieras. El pago se hace al publicar el enlace definitivo.',
    'price.free.tag': 'Creación', 'price.free.sum': '0 €', 'price.free.1': 'Todas las plantillas y el editor sin límites', 'price.free.2': 'Vista previa en móvil y ordenador', 'price.free.3': 'El borrador se guarda en tu panel', 'price.free.4': 'Vuelve y termina cuando quieras', 'price.free.cta': 'Empezar gratis',
    'price.pub.tag': 'Publicación', 'price.pub.sum': '29 €', 'price.pub.unit': 'pago único por invitación', 'price.pub.1': 'Enlace corto y código QR', 'price.pub.2': 'Formulario RSVP, mapa, música', 'price.pub.3': 'Panel con respuestas y exportación a Excel', 'price.pub.4': 'Cambios después de publicar sin coste', 'price.pub.5': 'Disponible para los invitados hasta la boda y 6 meses después', 'price.pub.cta': 'Crear invitación', 'price.pub.fine': 'Precio orientativo, se ajusta antes del lanzamiento.',
    'faq.eyebrow': 'Preguntas frecuentes', 'faq.title': 'Lo que también preguntan las parejas',
    'faq.q1': '¿Los invitados tienen que instalar algo?', 'faq.a1': 'No. La invitación se abre con un enlace o un código QR en cualquier navegador, en el móvil o en el ordenador. Se puede responder sin registrarse.',
    'faq.q2': '¿Se puede cambiar la invitación después de publicarla?', 'faq.a2': 'Sí. Texto, hora, fotos y preguntas se cambian en el editor; el enlace no cambia y los invitados ven la versión actualizada.',
    'faq.q3': '¿Cómo se envía la invitación?', 'faq.a3': 'Como prefieras: con el enlace por WhatsApp o correo, con el QR en tarjetas impresas, o con enlaces personales para cada invitado y que su nombre aparezca automáticamente.',
    'faq.q4': '¿Qué incluye el Excel?', 'faq.a4': 'Nombre del invitado, respuesta, número de acompañantes, menú elegido, comentario y hora de la respuesta. El archivo se puede enviar al restaurante o al wedding planner sin retoques.',
    'faq.q5': '¿Se puede hacer la invitación en varios idiomas?', 'faq.a5': 'Sí. La invitación se muestra en el idioma del invitado: español, inglés, italiano, portugués, francés, alemán o ruso, y además puede cambiarlo con un toque.',
    'final.title': 'Empieza con una plantilla, el resto ya está pensado', 'final.lead': 'Crear es gratis. Pagas solo al publicar el enlace definitivo.', 'final.cta': 'Crear invitación',
    'footer.copy': 'Copiar', 'footer.copied': 'Copiado', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Editor de invitación', 'ed.status.unsaved': 'Borrador sin guardar', 'ed.status.saving': 'Guardando…', 'ed.status.saved': 'Guardado {time}', 'ed.status.savedCloud': 'Guardado en la nube {time}', 'ed.status.offline': 'Sin servidor: se guarda en este navegador', 'ed.status.error': 'No se pudo guardar',
    'ed.import': 'Importar', 'ed.export': 'Exportar', 'ed.save': 'Guardar', 'ed.publish': 'Publicar', 'ed.published': 'Publicada', 'ed.openGuest': 'Ver como invitado',
    'ed.sec.template': 'Plantilla', 'ed.sec.couple': 'Pareja', 'ed.sec.couple.sub': 'Nombres', 'ed.sec.when': 'Fecha y lugar', 'ed.sec.when.sub': 'Cuándo y dónde', 'ed.sec.program': 'Programa del día', 'ed.sec.rsvp': 'Formulario RSVP', 'ed.sec.rsvp.sub': 'Respuestas', 'ed.sec.music': 'Música', 'ed.sec.music.sub': 'Ambiente', 'ed.sec.link': 'Enlace', 'ed.sec.link.sub': 'Dirección de la invitación', 'ed.sec.responses': 'Respuestas de los invitados', 'ed.sec.lang': 'Idioma de la invitación', 'ed.sec.lang.sub': 'Por defecto para los invitados',
    'ed.lang.hint': 'Los invitados ven la invitación en este idioma y pueden cambiarlo con un toque.',
    'ed.f.name1': 'Primer nombre', 'ed.f.name2': 'Segundo nombre', 'ed.f.greeting': 'Saludo', 'ed.f.date': 'Fecha', 'ed.f.time': 'Hora de inicio', 'ed.f.venue': 'Lugar', 'ed.f.address': 'Dirección', 'ed.f.map': 'Enlace del mapa', 'ed.f.map.hint': 'El botón «Cómo llegar» abrirá este enlace en el navegador del invitado.', 'ed.f.dress': 'Dress code',
    'ed.prog.add': '+ Añadir punto', 'ed.prog.time': 'Hora', 'ed.prog.what': 'Qué ocurre', 'ed.prog.del': 'Eliminar', 'ed.prog.count.one': '{n} punto', 'ed.prog.count.other': '{n} puntos',
    'ed.f.q': 'Pregunta', 'ed.f.deadline': 'Responder antes del', 'ed.t.plusone': 'Preguntar por acompañantes', 'ed.t.menu': 'Elección de menú', 'ed.f.menu': 'Opciones de menú separadas por comas', 'ed.t.comment': 'Campo para comentarios',
    'ed.t.music': 'Reproducir música al abrir', 'ed.f.track': 'Nombre de la canción', 'ed.music.hint': 'El archivo de audio se sube al publicar. En el borrador solo se muestra el nombre.',
    'ed.f.slug': 'Enlace corto', 'ed.slug.hint': 'Solo letras latinas, números y guiones. El enlace y el QR se activan al publicar.',
    'ed.resp.hint': 'Aquí llegan las respuestas reales de los invitados después de publicar. Las de la vista previa se guardan como prueba.', 'ed.resp.csv': 'Copiar como CSV', 'ed.resp.excel': 'Descargar Excel (CSV)', 'ed.resp.clear': 'Borrar pruebas', 'ed.resp.refresh': 'Actualizar', 'ed.resp.empty': 'Todavía no hay respuestas. Envía una respuesta de prueba desde la vista previa.', 'ed.resp.count.one': '{n} respuesta', 'ed.resp.count.other': '{n} respuestas', 'ed.resp.test': 'prueba',
    'ed.footnote': 'El borrador se guarda automáticamente. Con un servidor conectado se guarda también en la nube; «Exportar» descarga todos los datos en JSON para guardarlos en la carpeta INVITALIA.',
    'ed.preview.label': 'Así lo verán los invitados', 'ed.dev.phone': 'Móvil', 'ed.dev.tablet': 'Tableta',
    'ed.def.greeting': 'Nos hará muy felices compartir este día con vosotros', 'ed.def.prog1': 'Ceremonia', 'ed.def.prog2': 'Aperitivo en el jardín', 'ed.def.prog3': 'Cena y baile', 'ed.def.dress': 'Elegante de noche, tonos pastel', 'ed.def.q': '¿Vendrás?', 'ed.def.menu': 'Carne, Pescado, Vegetariano',
    'pub.title': 'Publicar la invitación', 'pub.lead': 'Revisa el enlace. Tras el pago se activa y podrás descargar el QR para las tarjetas impresas.', 'pub.copy': 'Copiar', 'pub.copyQr': 'Descargar QR',
    'pub.f1': 'Formulario RSVP, mapa, música', 'pub.f2': 'Respuestas en el panel y exportación a Excel', 'pub.f3': 'Cambios después de publicar sin coste', 'pub.f4': 'Disponible hasta la boda y 6 meses después',
    'pub.unit': 'pago único por invitación', 'pub.back': 'Volver', 'pub.pay': 'Pagar y publicar', 'pub.update': 'Guardar cambios', 'pub.redirect': 'Abriendo el pago seguro…',
    'pub.noteMock': 'Modo de prueba: el pago no está conectado, la invitación se publica al instante.', 'pub.notePublished': 'La invitación ya está publicada ({date}). Los cambios se aplican al guardar, sin volver a pagar.', 'pub.noteOffline': 'Sin servidor conectado: la publicación real y el pago requieren el servidor INVITALIA.', 'pub.qrLater': 'El QR aparecerá después de publicar', 'pub.stripe': 'Pago seguro con tarjeta a través de Stripe.',
    'io.exportTitle': 'Exportar datos', 'io.importTitle': 'Importar datos', 'io.exportText': 'Todos los datos de la invitación en JSON. Descarga el archivo o copia el texto y guárdalo en la carpeta INVITALIA.', 'io.importText': 'Pega el JSON guardado o elige el archivo invitalia-….json.',
    'io.close': 'Cerrar', 'io.copy': 'Copiar JSON', 'io.pick': 'Elegir archivo…', 'io.apply': 'Cargar en el editor', 'io.download': 'Descargar archivo',
    'toast.saved': 'Borrador guardado', 'toast.copied': 'Copiado', 'toast.csv': 'CSV copiado', 'toast.json': 'JSON copiado', 'toast.loaded': 'Datos cargados', 'toast.badJson': 'No se pudo leer el JSON', 'toast.fill': 'Completa: {fields}', 'toast.published': 'Invitación publicada', 'toast.copyFail': 'Copia el texto manualmente', 'toast.serverError': 'Error del servidor, inténtalo de nuevo', 'toast.paymentOk': 'Pago confirmado, la invitación está publicada', 'toast.paymentPending': 'El pago aún no está confirmado', 'toast.paymentCanceled': 'Pago cancelado', 'toast.linkCopied': 'Enlace copiado',
    'fill.names': 'los nombres', 'fill.date': 'la fecha', 'fill.slug': 'el enlace',
    'g.directions': 'Cómo llegar', 'g.dress': 'Dress code', 'g.deadline': 'Responde, por favor, antes del {date}', 'g.yes': 'Con mucho gusto', 'g.no': 'No podré', 'g.name': 'Tu nombre', 'g.alone': 'Voy solo / sola', 'g.plus1': 'Con acompañante', 'g.plus2': 'Seremos tres', 'g.menuPick': 'Elige el menú', 'g.comment': 'Deseos o alergias', 'g.send': 'Enviar respuesta', 'g.thanksYes': '¡Gracias! Tu respuesta ha llegado a los novios.', 'g.thanksNo': 'Qué pena que no puedas venir. Tu respuesta ha sido enviada.', 'g.rsvpDefault': '¿Vendrás?', 'g.music': 'Música',
    'g.loading': 'Abriendo la invitación…', 'g.notFound': 'No encontramos esta invitación. Comprueba el enlace.', 'g.notPublished': 'Esta invitación todavía no está publicada.', 'g.closed': 'El plazo para responder ha terminado. Escribe a los novios directamente.', 'g.error': 'No se pudo enviar la respuesta. Inténtalo de nuevo.', 'g.nameRequired': 'Escribe tu nombre, por favor', 'g.poweredBy': 'Creado con Invitalia.co', 'g.play': 'Reproducir música', 'g.pause': 'Pausar música'
  };

  D.en = {
    'meta.title': 'Invitalia.co — Digital wedding invitations', 'meta.editor': 'Invitation editor · Invitalia.co', 'meta.guest': 'Invitation · Invitalia.co',
    'lang.label': 'Language',
    'nav.templates': 'Templates', 'nav.features': 'Features', 'nav.dashboard': 'Dashboard', 'nav.how': 'How it works', 'nav.pricing': 'Pricing', 'nav.faq': 'FAQ', 'nav.editor': 'Editor', 'nav.cta': 'Create invitation',
    'hero.eyebrow': 'Digital wedding invitations', 'hero.title': 'The invitation your guests <em>open on their phone</em> and answer right away',
    'hero.lead': 'Pick a template, type the names and the date, add the map, the music and the QR code. Guest replies land in your dashboard by themselves.',
    'hero.cta1': 'Create for free', 'hero.cta2': 'See templates', 'hero.note': '<b>Creating and editing is free.</b> You pay once, when the invitation is ready and you publish the link.',
    'hero.trust1': 'Ready in 15 minutes', 'hero.trust2': 'No designer, no print shop', 'hero.trust3': 'Opens via link and QR',
    'inv.place': 'Villa del Balbianello, Lake Como', 'inv.chip.map': 'Map', 'inv.chip.music': 'Music', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Ceremony', 'inv.sched2': 'Garden aperitivo', 'inv.sched3': 'Dinner and dancing',
    'inv.rsvp.q': 'Will you join us? Please reply by 1 August', 'inv.rsvp.yes': 'Gladly', 'inv.rsvp.no': "Can't make it", 'inv.rsvp.doneYes': 'Thank you! Your reply has reached the couple.', 'inv.rsvp.doneNo': 'Sorry to miss you. Your reply has been sent.',
    'tpl.eyebrow': 'Ready-made templates', 'tpl.title': 'Your wedding style is already drawn', 'tpl.lead': 'Every template adapts to phone, tablet and desktop. Colours, type and photos change in the editor.',
    'tpl.filter.all': 'All', 'tpl.filter.classic': 'Classic', 'tpl.filter.minimal': 'Minimal', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Italian style', 'tpl.filter.other': 'More',
    'tpl.palazzo.desc': 'Classic: serif, double frame, ivory and gold.', 'tpl.linea.desc': 'Minimal: white space, thin sans, nothing else.', 'tpl.heritage.desc': 'Old money: deep green, cream italics, quiet luxury.', 'tpl.amalfi.desc': 'Italian style: terracotta, lemon light and beach-umbrella stripes.', 'tpl.botanica.desc': 'Greenery and air for a garden or winery wedding.', 'tpl.noir.desc': 'Evening wedding: black, champagne and a shimmer of gold.',
    'feat.eyebrow': 'Interactive inside the invitation', 'feat.title': 'Not a card, a helper for your guests', 'feat.lead': 'Everything usually sent as separate messages is already built into the invitation.',
    'feat.rsvp.t': 'RSVP form', 'feat.rsvp.d': 'Guests confirm attendance, add a plus-one, pick a menu and leave wishes. You choose the questions.',
    'feat.map.t': 'Interactive map', 'feat.map.d': 'Ceremony and reception on the map; directions open with one tap in the guest’s usual navigation app.',
    'feat.music.t': 'Background music', 'feat.music.d': 'Your song plays when the invitation opens and sets the mood before the party.',
    'feat.qr.t': 'QR code', 'feat.qr.d': 'A ready code for printed cards, place cards and stories. Guests scan and land straight in the invitation.',
    'dash.eyebrow': 'Organiser dashboard', 'dash.title': 'All replies collect themselves', 'dash.lead': 'No more counting confirmations in chats. Every reply shows up with name, time and comment. Export the list to Excel for the venue, the seating plan and your vendors.',
    'dash.invited': 'invited', 'dash.yes': 'attending', 'dash.no': 'declined', 'dash.wait': 'awaiting', 'dash.open': 'Open dashboard', 'dash.tableTitle': 'Replies · Alessandro & María', 'dash.export': 'Export to Excel', 'dash.exportDone': 'File ready (demo)',
    'dash.th.guest': 'Guest', 'dash.th.answer': 'Reply', 'dash.th.plus': 'Plus', 'dash.th.menu': 'Menu', 'dash.th.received': 'Received',
    'dash.pill.yes': 'Attending', 'dash.pill.yesPl': 'Attending', 'dash.pill.no': 'Declined', 'dash.pill.wait': 'Pending',
    'dash.menu1': 'Fish', 'dash.menu2': 'Vegetarian', 'dash.menu4': 'Meat, kids', 'dash.time1': 'yesterday, 21:14', 'dash.time2': 'yesterday, 18:02', 'dash.time3': '2 days ago', 'dash.time4': '3 days ago', 'dash.remind': 'remind', 'dash.family': 'The López family',
    'how.eyebrow': 'How it works', 'how.title': 'Three steps to a ready link',
    'how.s1.t': 'Pick a template', 'how.s1.d': 'Open any design and start editing right away, no card required.', 'how.s2.t': 'Fill in the details', 'how.s2.d': 'Names, date, venue, the day’s programme, dress code, RSVP questions, music and photos.', 'how.s3.t': 'Publish the link', 'how.s3.d': 'Pay for publishing, get a short link and a QR code. Send it to your guests and watch the replies arrive.',
    'price.eyebrow': 'Pricing', 'price.title': 'Pay once, and only for the result', 'price.lead': 'Build and rebuild the invitation as much as you like. Payment is due when you publish the final link.',
    'price.free.tag': 'Creating', 'price.free.sum': '€0', 'price.free.1': 'All templates and the editor without limits', 'price.free.2': 'Preview on phone and desktop', 'price.free.3': 'Draft saved in your dashboard', 'price.free.4': 'Come back and finish any time', 'price.free.cta': 'Start for free',
    'price.pub.tag': 'Publishing', 'price.pub.sum': '€29', 'price.pub.unit': 'one-time, per invitation', 'price.pub.1': 'Short link and QR code', 'price.pub.2': 'RSVP form, map, music', 'price.pub.3': 'Dashboard with replies and Excel export', 'price.pub.4': 'Edits after publishing at no extra cost', 'price.pub.5': 'Available to guests until the wedding and 6 months after', 'price.pub.cta': 'Create invitation', 'price.pub.fine': 'Indicative price, adjusted before launch.',
    'faq.eyebrow': 'Frequently asked', 'faq.title': 'What couples also ask',
    'faq.q1': 'Do guests need to install anything?', 'faq.a1': 'No. The invitation opens from a link or QR code in any browser, on a phone or a computer. Replying needs no sign-up.',
    'faq.q2': 'Can I change the invitation after publishing?', 'faq.a2': 'Yes. Text, time, photos and questions change in the editor; the link stays the same and guests see the updated version.',
    'faq.q3': 'How do I send the invitation?', 'faq.a3': 'Any way you like: the link via WhatsApp or email, the QR on printed cards, or personal links per guest so their name appears automatically.',
    'faq.q4': 'What goes into the Excel file?', 'faq.a4': 'Guest name, reply, number of plus-ones, menu choice, comment and reply time. Send it to the venue or the planner as is.',
    'faq.q5': 'Can the invitation be in several languages?', 'faq.a5': 'Yes. The invitation shows in the guest’s language: Spanish, English, Italian, Portuguese, French, German or Russian, and they can switch with one tap.',
    'final.title': 'Start with a template, the rest is already thought through', 'final.lead': 'Creating is free. You pay only when publishing the final link.', 'final.cta': 'Create invitation',
    'footer.copy': 'Copy', 'footer.copied': 'Copied', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Invitation editor', 'ed.status.unsaved': 'Draft not saved', 'ed.status.saving': 'Saving…', 'ed.status.saved': 'Saved {time}', 'ed.status.savedCloud': 'Saved to the cloud {time}', 'ed.status.offline': 'No server: saved in this browser', 'ed.status.error': 'Could not save',
    'ed.import': 'Import', 'ed.export': 'Export', 'ed.save': 'Save', 'ed.publish': 'Publish', 'ed.published': 'Published', 'ed.openGuest': 'View as guest',
    'ed.sec.template': 'Template', 'ed.sec.couple': 'Couple', 'ed.sec.couple.sub': 'Names', 'ed.sec.when': 'Date and venue', 'ed.sec.when.sub': 'When and where', 'ed.sec.program': 'Programme', 'ed.sec.rsvp': 'RSVP form', 'ed.sec.rsvp.sub': 'Replies', 'ed.sec.music': 'Music', 'ed.sec.music.sub': 'Mood', 'ed.sec.link': 'Link', 'ed.sec.link.sub': 'Invitation address', 'ed.sec.responses': 'Guest replies', 'ed.sec.lang': 'Invitation language', 'ed.sec.lang.sub': 'Default for guests',
    'ed.lang.hint': 'Guests see the invitation in this language and can switch with one tap.',
    'ed.f.name1': 'First name', 'ed.f.name2': 'Second name', 'ed.f.greeting': 'Greeting', 'ed.f.date': 'Date', 'ed.f.time': 'Start time', 'ed.f.venue': 'Venue', 'ed.f.address': 'Address', 'ed.f.map': 'Map link', 'ed.f.map.hint': 'The “Directions” button opens this link in the guest’s navigation app.', 'ed.f.dress': 'Dress code',
    'ed.prog.add': '+ Add item', 'ed.prog.time': 'Time', 'ed.prog.what': 'What happens', 'ed.prog.del': 'Remove', 'ed.prog.count.one': '{n} item', 'ed.prog.count.other': '{n} items',
    'ed.f.q': 'Question', 'ed.f.deadline': 'Reply by', 'ed.t.plusone': 'Ask about plus-ones', 'ed.t.menu': 'Menu choice', 'ed.f.menu': 'Menu options, comma-separated', 'ed.t.comment': 'Comment field',
    'ed.t.music': 'Play music on open', 'ed.f.track': 'Track name', 'ed.music.hint': 'The audio file is uploaded on publishing. The draft shows only the title.',
    'ed.f.slug': 'Short link', 'ed.slug.hint': 'Latin letters, digits and hyphens only. Link and QR go live on publishing.',
    'ed.resp.hint': 'Real guest replies arrive here after publishing. Replies from the preview are stored as tests.', 'ed.resp.csv': 'Copy as CSV', 'ed.resp.excel': 'Download Excel (CSV)', 'ed.resp.clear': 'Clear tests', 'ed.resp.refresh': 'Refresh', 'ed.resp.empty': 'No replies yet. Send a test reply from the preview.', 'ed.resp.count.one': '{n} reply', 'ed.resp.count.other': '{n} replies', 'ed.resp.test': 'test',
    'ed.footnote': 'The draft saves automatically. With a server connected it is also saved to the cloud; “Export” downloads all data as JSON for the INVITALIA folder.',
    'ed.preview.label': 'What guests will see', 'ed.dev.phone': 'Phone', 'ed.dev.tablet': 'Tablet',
    'ed.def.greeting': 'We would be delighted to share this day with you', 'ed.def.prog1': 'Ceremony', 'ed.def.prog2': 'Garden aperitivo', 'ed.def.prog3': 'Dinner and dancing', 'ed.def.dress': 'Evening elegant, pastel shades', 'ed.def.q': 'Will you join us?', 'ed.def.menu': 'Meat, Fish, Vegetarian',
    'pub.title': 'Publish the invitation', 'pub.lead': 'Check the link. After payment it goes live and you can download the QR for printed cards.', 'pub.copy': 'Copy', 'pub.copyQr': 'Download QR',
    'pub.f1': 'RSVP form, map, music', 'pub.f2': 'Replies in the dashboard and Excel export', 'pub.f3': 'Edits after publishing at no extra cost', 'pub.f4': 'Available until the wedding and 6 months after',
    'pub.unit': 'one-time, per invitation', 'pub.back': 'Back', 'pub.pay': 'Pay and publish', 'pub.update': 'Save changes', 'pub.redirect': 'Opening secure payment…',
    'pub.noteMock': 'Test mode: payment is not connected, the invitation publishes instantly.', 'pub.notePublished': 'The invitation is already published ({date}). Changes apply on save, no new payment.', 'pub.noteOffline': 'No server connected: real publishing and payment need the INVITALIA server.', 'pub.qrLater': 'The QR appears after publishing', 'pub.stripe': 'Secure card payment via Stripe.',
    'io.exportTitle': 'Export data', 'io.importTitle': 'Import data', 'io.exportText': 'All invitation data as JSON. Download the file or copy the text and keep it in the INVITALIA folder.', 'io.importText': 'Paste the saved JSON or choose the invitalia-….json file.',
    'io.close': 'Close', 'io.copy': 'Copy JSON', 'io.pick': 'Choose file…', 'io.apply': 'Load into editor', 'io.download': 'Download file',
    'toast.saved': 'Draft saved', 'toast.copied': 'Copied', 'toast.csv': 'CSV copied', 'toast.json': 'JSON copied', 'toast.loaded': 'Data loaded', 'toast.badJson': 'Could not read the JSON', 'toast.fill': 'Please fill in {fields}', 'toast.published': 'Invitation published', 'toast.copyFail': 'Copy the text manually', 'toast.serverError': 'Server error, please try again', 'toast.paymentOk': 'Payment confirmed, the invitation is live', 'toast.paymentPending': 'Payment not confirmed yet', 'toast.paymentCanceled': 'Payment cancelled', 'toast.linkCopied': 'Link copied',
    'fill.names': 'the names', 'fill.date': 'the date', 'fill.slug': 'the link',
    'g.directions': 'Directions', 'g.dress': 'Dress code', 'g.deadline': 'Please reply by {date}', 'g.yes': 'Gladly', 'g.no': "Can't make it", 'g.name': 'Your name', 'g.alone': 'Coming alone', 'g.plus1': 'With a plus-one', 'g.plus2': 'There will be three of us', 'g.menuPick': 'Choose a menu', 'g.comment': 'Wishes or allergies', 'g.send': 'Send reply', 'g.thanksYes': 'Thank you! Your reply has reached the couple.', 'g.thanksNo': 'Sorry you can’t make it. Your reply has been sent.', 'g.rsvpDefault': 'Will you join us?', 'g.music': 'Music',
    'g.loading': 'Opening the invitation…', 'g.notFound': 'We could not find this invitation. Check the link.', 'g.notPublished': 'This invitation is not published yet.', 'g.closed': 'The reply deadline has passed. Please contact the couple directly.', 'g.error': 'Could not send the reply. Please try again.', 'g.nameRequired': 'Please enter your name', 'g.poweredBy': 'Made with Invitalia.co', 'g.play': 'Play music', 'g.pause': 'Pause music'
  };

  D.it = {
    'meta.title': 'Invitalia.co — Inviti di nozze digitali', 'meta.editor': 'Editor dell’invito · Invitalia.co', 'meta.guest': 'Invito · Invitalia.co',
    'lang.label': 'Lingua',
    'nav.templates': 'Modelli', 'nav.features': 'Funzioni', 'nav.dashboard': 'Pannello', 'nav.how': 'Come funziona', 'nav.pricing': 'Prezzo', 'nav.faq': 'Domande', 'nav.editor': 'Editor', 'nav.cta': 'Crea invito',
    'hero.eyebrow': 'Inviti di nozze digitali', 'hero.title': 'L’invito che gli ospiti <em>aprono sul telefono</em> e a cui rispondono subito',
    'hero.lead': 'Scegli un modello, scrivi i nomi e la data, aggiungi mappa, musica e codice QR. Le risposte degli ospiti arrivano da sole nel tuo pannello.',
    'hero.cta1': 'Crea gratis', 'hero.cta2': 'Vedi i modelli', 'hero.note': '<b>Creare e modificare è gratis.</b> Paghi una sola volta, quando l’invito è pronto e pubblichi il link.',
    'hero.trust1': 'Pronto in 15 minuti', 'hero.trust2': 'Senza grafico né tipografia', 'hero.trust3': 'Si apre con link e QR',
    'inv.place': 'Villa del Balbianello, lago di Como', 'inv.chip.map': 'Mappa', 'inv.chip.music': 'Musica', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Cerimonia', 'inv.sched2': 'Aperitivo in giardino', 'inv.sched3': 'Cena e balli',
    'inv.rsvp.q': 'Ci sarai? Rispondi, per favore, entro il 1º agosto', 'inv.rsvp.yes': 'Con piacere', 'inv.rsvp.no': 'Non potrò', 'inv.rsvp.doneYes': 'Grazie! La tua risposta è arrivata agli sposi.', 'inv.rsvp.doneNo': 'Peccato. La tua risposta è stata inviata.',
    'tpl.eyebrow': 'Modelli pronti', 'tpl.title': 'Lo stile del tuo matrimonio è già disegnato', 'tpl.lead': 'Ogni modello si adatta a telefono, tablet e computer. Colori, caratteri e foto si cambiano nell’editor.',
    'tpl.filter.all': 'Tutti', 'tpl.filter.classic': 'Classico', 'tpl.filter.minimal': 'Minimal', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Stile italiano', 'tpl.filter.other': 'Altri',
    'tpl.palazzo.desc': 'Classico: graziato, doppia cornice, avorio e oro.', 'tpl.linea.desc': 'Minimal: campo bianco, sans sottile, nient’altro.', 'tpl.heritage.desc': 'Old money: verde profondo, corsivo crema, lusso silenzioso.', 'tpl.amalfi.desc': 'Stile italiano: terracotta, luce di limone e righe da ombrellone.', 'tpl.botanica.desc': 'Verde e aria per un matrimonio in giardino o in cantina.', 'tpl.noir.desc': 'Matrimonio serale: nero, champagne e riflessi d’oro.',
    'feat.eyebrow': 'Interattività dentro l’invito', 'feat.title': 'Non una cartolina, un assistente per gli ospiti', 'feat.lead': 'Tutto ciò che di solito si manda in messaggi separati è già dentro l’invito.',
    'feat.rsvp.t': 'Modulo RSVP', 'feat.rsvp.d': 'L’ospite conferma la presenza, indica l’accompagnatore, le preferenze di menù e i desideri. Le domande le decidi tu.',
    'feat.map.t': 'Mappa interattiva', 'feat.map.d': 'Cerimonia e ricevimento sulla mappa; il percorso si apre con un tocco nel navigatore abituale.',
    'feat.music.t': 'Musica di sottofondo', 'feat.music.d': 'La vostra melodia suona all’apertura dell’invito e dà il tono prima della festa.',
    'feat.qr.t': 'Codice QR', 'feat.qr.d': 'Un codice pronto per cartoncini stampati, segnaposto e stories. Si scansiona e si entra subito nell’invito.',
    'dash.eyebrow': 'Pannello dell’organizzatore', 'dash.title': 'Tutte le risposte si raccolgono da sole', 'dash.lead': 'Basta contare le conferme nelle chat. Ogni risposta compare nel pannello con nome, ora e commento. L’elenco si esporta in Excel per il ristorante, i tavoli e i fornitori.',
    'dash.invited': 'invitati', 'dash.yes': 'presenti', 'dash.no': 'assenti', 'dash.wait': 'in attesa', 'dash.open': 'Apri il pannello', 'dash.tableTitle': 'Risposte · Alessandro e María', 'dash.export': 'Esporta in Excel', 'dash.exportDone': 'File pronto (demo)',
    'dash.th.guest': 'Ospite', 'dash.th.answer': 'Risposta', 'dash.th.plus': 'Accomp.', 'dash.th.menu': 'Menù', 'dash.th.received': 'Ricevuta',
    'dash.pill.yes': 'Ci sarà', 'dash.pill.yesPl': 'Ci saranno', 'dash.pill.no': 'Non potrà', 'dash.pill.wait': 'In attesa',
    'dash.menu1': 'Pesce', 'dash.menu2': 'Vegetariano', 'dash.menu4': 'Carne, bambini', 'dash.time1': 'ieri, 21:14', 'dash.time2': 'ieri, 18:02', 'dash.time3': '2 giorni fa', 'dash.time4': '3 giorni fa', 'dash.remind': 'ricordare', 'dash.family': 'Famiglia López',
    'how.eyebrow': 'Come funziona', 'how.title': 'Tre passi fino al link pronto',
    'how.s1.t': 'Scegli un modello', 'how.s1.d': 'Apri un design qualsiasi e inizia subito a modificare, senza registrare una carta.', 'how.s2.t': 'Compila i dettagli', 'how.s2.d': 'Nomi, data, luogo, programma della giornata, dress code, domande del modulo, musica e foto.', 'how.s3.t': 'Pubblica il link', 'how.s3.d': 'Paga la pubblicazione, ricevi il link breve e il QR. Invialo agli ospiti e segui le risposte.',
    'price.eyebrow': 'Prezzo', 'price.title': 'Paghi una volta, e solo per il risultato', 'price.lead': 'Crea e rifai l’invito quanto vuoi. Il pagamento serve al momento di pubblicare il link definitivo.',
    'price.free.tag': 'Creazione', 'price.free.sum': '0 €', 'price.free.1': 'Tutti i modelli e l’editor senza limiti', 'price.free.2': 'Anteprima su telefono e computer', 'price.free.3': 'La bozza resta nel tuo pannello', 'price.free.4': 'Torna e finisci quando vuoi', 'price.free.cta': 'Inizia gratis',
    'price.pub.tag': 'Pubblicazione', 'price.pub.sum': '29 €', 'price.pub.unit': 'una tantum, per invito', 'price.pub.1': 'Link breve e codice QR', 'price.pub.2': 'Modulo RSVP, mappa, musica', 'price.pub.3': 'Pannello con risposte ed esportazione in Excel', 'price.pub.4': 'Modifiche dopo la pubblicazione senza costi', 'price.pub.5': 'Disponibile per gli ospiti fino al matrimonio e 6 mesi dopo', 'price.pub.cta': 'Crea invito', 'price.pub.fine': 'Prezzo indicativo, da definire prima del lancio.',
    'faq.eyebrow': 'Domande frequenti', 'faq.title': 'Cosa chiedono anche le coppie',
    'faq.q1': 'Gli ospiti devono installare qualcosa?', 'faq.a1': 'No. L’invito si apre da link o codice QR in qualsiasi browser, su telefono o computer. Si risponde senza registrazione.',
    'faq.q2': 'Si può modificare l’invito dopo la pubblicazione?', 'faq.a2': 'Sì. Testo, orario, foto e domande si cambiano nell’editor; il link resta lo stesso e gli ospiti vedono la versione aggiornata.',
    'faq.q3': 'Come si invia l’invito?', 'faq.a3': 'Come preferisci: il link su WhatsApp o via e-mail, il QR sui cartoncini stampati, oppure link personali per ogni ospite con il nome che compare automaticamente.',
    'faq.q4': 'Cosa contiene il file Excel?', 'faq.a4': 'Nome dell’ospite, risposta, numero di accompagnatori, menù scelto, commento e ora della risposta. Si può inviare al ristorante o al wedding planner così com’è.',
    'faq.q5': 'Si può fare l’invito in più lingue?', 'faq.a5': 'Sì. L’invito si mostra nella lingua dell’ospite: spagnolo, inglese, italiano, portoghese, francese, tedesco o russo, e si cambia con un tocco.',
    'final.title': 'Parti da un modello, al resto abbiamo già pensato', 'final.lead': 'Creare è gratis. Paghi solo quando pubblichi il link definitivo.', 'final.cta': 'Crea invito',
    'footer.copy': 'Copia', 'footer.copied': 'Copiato', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Editor dell’invito', 'ed.status.unsaved': 'Bozza non salvata', 'ed.status.saving': 'Salvataggio…', 'ed.status.saved': 'Salvato {time}', 'ed.status.savedCloud': 'Salvato nel cloud {time}', 'ed.status.offline': 'Nessun server: salvato in questo browser', 'ed.status.error': 'Salvataggio non riuscito',
    'ed.import': 'Importa', 'ed.export': 'Esporta', 'ed.save': 'Salva', 'ed.publish': 'Pubblica', 'ed.published': 'Pubblicato', 'ed.openGuest': 'Vedi come ospite',
    'ed.sec.template': 'Modello', 'ed.sec.couple': 'Coppia', 'ed.sec.couple.sub': 'Nomi', 'ed.sec.when': 'Data e luogo', 'ed.sec.when.sub': 'Quando e dove', 'ed.sec.program': 'Programma della giornata', 'ed.sec.rsvp': 'Modulo RSVP', 'ed.sec.rsvp.sub': 'Risposte', 'ed.sec.music': 'Musica', 'ed.sec.music.sub': 'Atmosfera', 'ed.sec.link': 'Link', 'ed.sec.link.sub': 'Indirizzo dell’invito', 'ed.sec.responses': 'Risposte degli ospiti', 'ed.sec.lang': 'Lingua dell’invito', 'ed.sec.lang.sub': 'Predefinita per gli ospiti',
    'ed.lang.hint': 'Gli ospiti vedono l’invito in questa lingua e possono cambiarla con un tocco.',
    'ed.f.name1': 'Primo nome', 'ed.f.name2': 'Secondo nome', 'ed.f.greeting': 'Saluto', 'ed.f.date': 'Data', 'ed.f.time': 'Ora di inizio', 'ed.f.venue': 'Luogo', 'ed.f.address': 'Indirizzo', 'ed.f.map': 'Link della mappa', 'ed.f.map.hint': 'Il pulsante «Come arrivare» aprirà questo link nel navigatore dell’ospite.', 'ed.f.dress': 'Dress code',
    'ed.prog.add': '+ Aggiungi voce', 'ed.prog.time': 'Ora', 'ed.prog.what': 'Cosa succede', 'ed.prog.del': 'Elimina', 'ed.prog.count.one': '{n} voce', 'ed.prog.count.other': '{n} voci',
    'ed.f.q': 'Domanda', 'ed.f.deadline': 'Rispondere entro il', 'ed.t.plusone': 'Chiedere degli accompagnatori', 'ed.t.menu': 'Scelta del menù', 'ed.f.menu': 'Opzioni di menù separate da virgola', 'ed.t.comment': 'Campo per commenti',
    'ed.t.music': 'Riprodurre musica all’apertura', 'ed.f.track': 'Titolo del brano', 'ed.music.hint': 'Il file audio si carica alla pubblicazione. Nella bozza si vede solo il titolo.',
    'ed.f.slug': 'Link breve', 'ed.slug.hint': 'Solo lettere latine, cifre e trattini. Link e QR si attivano alla pubblicazione.',
    'ed.resp.hint': 'Qui arrivano le risposte reali degli ospiti dopo la pubblicazione. Quelle dall’anteprima sono salvate come prova.', 'ed.resp.csv': 'Copia come CSV', 'ed.resp.excel': 'Scarica Excel (CSV)', 'ed.resp.clear': 'Cancella prove', 'ed.resp.refresh': 'Aggiorna', 'ed.resp.empty': 'Ancora nessuna risposta. Invia una risposta di prova dall’anteprima.', 'ed.resp.count.one': '{n} risposta', 'ed.resp.count.other': '{n} risposte', 'ed.resp.test': 'prova',
    'ed.footnote': 'La bozza si salva automaticamente. Con un server collegato si salva anche nel cloud; «Esporta» scarica tutti i dati in JSON per la cartella INVITALIA.',
    'ed.preview.label': 'Così lo vedranno gli ospiti', 'ed.dev.phone': 'Telefono', 'ed.dev.tablet': 'Tablet',
    'ed.def.greeting': 'Saremo felici di condividere questo giorno con voi', 'ed.def.prog1': 'Cerimonia', 'ed.def.prog2': 'Aperitivo in giardino', 'ed.def.prog3': 'Cena e balli', 'ed.def.dress': 'Elegante da sera, toni pastello', 'ed.def.q': 'Ci sarai?', 'ed.def.menu': 'Carne, Pesce, Vegetariano',
    'pub.title': 'Pubblicare l’invito', 'pub.lead': 'Controlla il link. Dopo il pagamento diventa attivo e potrai scaricare il QR per i cartoncini stampati.', 'pub.copy': 'Copia', 'pub.copyQr': 'Scarica QR',
    'pub.f1': 'Modulo RSVP, mappa, musica', 'pub.f2': 'Risposte nel pannello ed esportazione in Excel', 'pub.f3': 'Modifiche dopo la pubblicazione senza costi', 'pub.f4': 'Disponibile fino al matrimonio e 6 mesi dopo',
    'pub.unit': 'una tantum, per invito', 'pub.back': 'Indietro', 'pub.pay': 'Paga e pubblica', 'pub.update': 'Salva modifiche', 'pub.redirect': 'Apertura del pagamento sicuro…',
    'pub.noteMock': 'Modalità di prova: il pagamento non è collegato, l’invito si pubblica subito.', 'pub.notePublished': 'L’invito è già pubblicato ({date}). Le modifiche si applicano al salvataggio, senza nuovo pagamento.', 'pub.noteOffline': 'Nessun server collegato: pubblicazione e pagamento reali richiedono il server INVITALIA.', 'pub.qrLater': 'Il QR apparirà dopo la pubblicazione', 'pub.stripe': 'Pagamento sicuro con carta tramite Stripe.',
    'io.exportTitle': 'Esporta dati', 'io.importTitle': 'Importa dati', 'io.exportText': 'Tutti i dati dell’invito in JSON. Scarica il file o copia il testo e conservalo nella cartella INVITALIA.', 'io.importText': 'Incolla il JSON salvato o scegli il file invitalia-….json.',
    'io.close': 'Chiudi', 'io.copy': 'Copia JSON', 'io.pick': 'Scegli file…', 'io.apply': 'Carica nell’editor', 'io.download': 'Scarica file',
    'toast.saved': 'Bozza salvata', 'toast.copied': 'Copiato', 'toast.csv': 'CSV copiato', 'toast.json': 'JSON copiato', 'toast.loaded': 'Dati caricati', 'toast.badJson': 'Impossibile leggere il JSON', 'toast.fill': 'Compila: {fields}', 'toast.published': 'Invito pubblicato', 'toast.copyFail': 'Copia il testo manualmente', 'toast.serverError': 'Errore del server, riprova', 'toast.paymentOk': 'Pagamento confermato, l’invito è pubblicato', 'toast.paymentPending': 'Pagamento non ancora confermato', 'toast.paymentCanceled': 'Pagamento annullato', 'toast.linkCopied': 'Link copiato',
    'fill.names': 'i nomi', 'fill.date': 'la data', 'fill.slug': 'il link',
    'g.directions': 'Come arrivare', 'g.dress': 'Dress code', 'g.deadline': 'Rispondi, per favore, entro il {date}', 'g.yes': 'Con piacere', 'g.no': 'Non potrò', 'g.name': 'Il tuo nome', 'g.alone': 'Vengo da solo / sola', 'g.plus1': 'Con accompagnatore', 'g.plus2': 'Saremo in tre', 'g.menuPick': 'Scegli il menù', 'g.comment': 'Desideri o allergie', 'g.send': 'Invia risposta', 'g.thanksYes': 'Grazie! La tua risposta è arrivata agli sposi.', 'g.thanksNo': 'Peccato che tu non possa venire. La tua risposta è stata inviata.', 'g.rsvpDefault': 'Ci sarai?', 'g.music': 'Musica',
    'g.loading': 'Apertura dell’invito…', 'g.notFound': 'Non troviamo questo invito. Controlla il link.', 'g.notPublished': 'Questo invito non è ancora pubblicato.', 'g.closed': 'Il termine per rispondere è scaduto. Scrivi direttamente agli sposi.', 'g.error': 'Impossibile inviare la risposta. Riprova.', 'g.nameRequired': 'Scrivi il tuo nome, per favore', 'g.poweredBy': 'Creato con Invitalia.co', 'g.play': 'Riproduci musica', 'g.pause': 'Metti in pausa'
  };

  D.pt = {
    'meta.title': 'Invitalia.co — Convites de casamento digitais', 'meta.editor': 'Editor do convite · Invitalia.co', 'meta.guest': 'Convite · Invitalia.co',
    'lang.label': 'Idioma',
    'nav.templates': 'Modelos', 'nav.features': 'Funções', 'nav.dashboard': 'Painel', 'nav.how': 'Como funciona', 'nav.pricing': 'Preço', 'nav.faq': 'Perguntas', 'nav.editor': 'Editor', 'nav.cta': 'Criar convite',
    'hero.eyebrow': 'Convites de casamento digitais', 'hero.title': 'O convite que os convidados <em>abrem no telemóvel</em> e respondem na hora',
    'hero.lead': 'Escolha um modelo, escreva os nomes e a data, junte o mapa, a música e o código QR. As respostas dos convidados chegam sozinhas ao seu painel.',
    'hero.cta1': 'Criar grátis', 'hero.cta2': 'Ver modelos', 'hero.note': '<b>Criar e editar é grátis.</b> Paga uma só vez, quando o convite está pronto e publica a ligação.',
    'hero.trust1': 'Pronto em 15 minutos', 'hero.trust2': 'Sem designer nem gráfica', 'hero.trust3': 'Abre por ligação e QR',
    'inv.place': 'Villa del Balbianello, lago de Como', 'inv.chip.map': 'Mapa', 'inv.chip.music': 'Música', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Cerimónia', 'inv.sched2': 'Aperitivo no jardim', 'inv.sched3': 'Jantar e baile',
    'inv.rsvp.q': 'Vai estar connosco? Responda, por favor, até 1 de agosto', 'inv.rsvp.yes': 'Com todo o gosto', 'inv.rsvp.no': 'Não vou poder', 'inv.rsvp.doneYes': 'Obrigado! A sua resposta chegou aos noivos.', 'inv.rsvp.doneNo': 'Que pena. A sua resposta foi enviada.',
    'tpl.eyebrow': 'Modelos prontos', 'tpl.title': 'O estilo do seu casamento já está desenhado', 'tpl.lead': 'Cada modelo adapta-se ao telemóvel, ao tablet e ao computador. Cores, tipos de letra e fotos mudam-se no editor.',
    'tpl.filter.all': 'Todos', 'tpl.filter.classic': 'Clássico', 'tpl.filter.minimal': 'Minimalista', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Estilo italiano', 'tpl.filter.other': 'Mais',
    'tpl.palazzo.desc': 'Clássico: serifa, moldura dupla, marfim e ouro.', 'tpl.linea.desc': 'Minimalista: fundo branco, sans fina, nada mais.', 'tpl.heritage.desc': 'Old money: verde profundo, itálico creme, luxo discreto.', 'tpl.amalfi.desc': 'Estilo italiano: terracota, luz de limão e riscas de chapéu de sol.', 'tpl.botanica.desc': 'Verde e ar para um casamento num jardim ou numa adega.', 'tpl.noir.desc': 'Casamento à noite: preto, champanhe e brilho dourado.',
    'feat.eyebrow': 'Interatividade dentro do convite', 'feat.title': 'Não é um postal, é um assistente para os convidados', 'feat.lead': 'Tudo o que normalmente se envia em mensagens separadas já está dentro do convite.',
    'feat.rsvp.t': 'Formulário RSVP', 'feat.rsvp.d': 'O convidado confirma a presença, indica acompanhante, preferências de menu e desejos. As perguntas são decididas por si.',
    'feat.map.t': 'Mapa interativo', 'feat.map.d': 'Cerimónia e copo-d’água no mapa; o percurso abre com um toque na aplicação de navegação habitual.',
    'feat.music.t': 'Música de fundo', 'feat.music.d': 'A vossa melodia toca ao abrir o convite e dá o tom antes da festa.',
    'feat.qr.t': 'Código QR', 'feat.qr.d': 'Um código pronto para cartões impressos, marcadores de lugar e stories. Lê-se e entra-se diretamente no convite.',
    'dash.eyebrow': 'Painel do organizador', 'dash.title': 'Todas as respostas reúnem-se sozinhas', 'dash.lead': 'Chega de contar confirmações nos chats. Cada resposta aparece no painel com nome, hora e comentário. A lista exporta-se para Excel para o restaurante, a disposição das mesas e os fornecedores.',
    'dash.invited': 'convidados', 'dash.yes': 'vão', 'dash.no': 'não vão', 'dash.wait': 'sem resposta', 'dash.open': 'Abrir o painel', 'dash.tableTitle': 'Respostas · Alessandro e María', 'dash.export': 'Exportar para Excel', 'dash.exportDone': 'Ficheiro pronto (demo)',
    'dash.th.guest': 'Convidado', 'dash.th.answer': 'Resposta', 'dash.th.plus': 'Acomp.', 'dash.th.menu': 'Menu', 'dash.th.received': 'Recebida',
    'dash.pill.yes': 'Vai', 'dash.pill.yesPl': 'Vão', 'dash.pill.no': 'Não vai', 'dash.pill.wait': 'Pendente',
    'dash.menu1': 'Peixe', 'dash.menu2': 'Vegetariano', 'dash.menu4': 'Carne, infantil', 'dash.time1': 'ontem, 21:14', 'dash.time2': 'ontem, 18:02', 'dash.time3': 'há 2 dias', 'dash.time4': 'há 3 dias', 'dash.remind': 'lembrar', 'dash.family': 'Família López',
    'how.eyebrow': 'Como funciona', 'how.title': 'Três passos até à ligação pronta',
    'how.s1.t': 'Escolha um modelo', 'how.s1.d': 'Abra qualquer design e comece a editar de imediato, sem registar um cartão.', 'how.s2.t': 'Preencha os detalhes', 'how.s2.d': 'Nomes, data, local, programa do dia, dress code, perguntas do formulário, música e fotos.', 'how.s3.t': 'Publique a ligação', 'how.s3.d': 'Pague a publicação, receba a ligação curta e o QR. Envie aos convidados e acompanhe as respostas.',
    'price.eyebrow': 'Preço', 'price.title': 'Paga uma vez, e só pelo resultado', 'price.lead': 'Crie e refaça o convite as vezes que quiser. O pagamento é feito ao publicar a ligação definitiva.',
    'price.free.tag': 'Criação', 'price.free.sum': '0 €', 'price.free.1': 'Todos os modelos e o editor sem limites', 'price.free.2': 'Pré-visualização no telemóvel e no computador', 'price.free.3': 'O rascunho fica guardado no seu painel', 'price.free.4': 'Volte e termine quando quiser', 'price.free.cta': 'Começar grátis',
    'price.pub.tag': 'Publicação', 'price.pub.sum': '29 €', 'price.pub.unit': 'pagamento único por convite', 'price.pub.1': 'Ligação curta e código QR', 'price.pub.2': 'Formulário RSVP, mapa, música', 'price.pub.3': 'Painel com respostas e exportação para Excel', 'price.pub.4': 'Alterações depois de publicar sem custos', 'price.pub.5': 'Disponível para os convidados até ao casamento e 6 meses depois', 'price.pub.cta': 'Criar convite', 'price.pub.fine': 'Preço indicativo, ajustado antes do lançamento.',
    'faq.eyebrow': 'Perguntas frequentes', 'faq.title': 'O que os casais também perguntam',
    'faq.q1': 'Os convidados precisam de instalar alguma coisa?', 'faq.a1': 'Não. O convite abre por ligação ou código QR em qualquer navegador, no telemóvel ou no computador. Responde-se sem registo.',
    'faq.q2': 'É possível alterar o convite depois de publicado?', 'faq.a2': 'Sim. Texto, hora, fotos e perguntas alteram-se no editor; a ligação mantém-se e os convidados veem a versão atualizada.',
    'faq.q3': 'Como se envia o convite?', 'faq.a3': 'Como preferir: a ligação por WhatsApp ou e-mail, o QR em cartões impressos, ou ligações pessoais para cada convidado com o nome a aparecer automaticamente.',
    'faq.q4': 'O que vai para o Excel?', 'faq.a4': 'Nome do convidado, resposta, número de acompanhantes, menu escolhido, comentário e hora da resposta. Pode enviar-se ao restaurante ou ao wedding planner tal como está.',
    'faq.q5': 'O convite pode estar em vários idiomas?', 'faq.a5': 'Sim. O convite aparece no idioma do convidado: espanhol, inglês, italiano, português, francês, alemão ou russo, e muda-se com um toque.',
    'final.title': 'Comece por um modelo, o resto já está pensado', 'final.lead': 'Criar é grátis. Paga apenas ao publicar a ligação definitiva.', 'final.cta': 'Criar convite',
    'footer.copy': 'Copiar', 'footer.copied': 'Copiado', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Editor do convite', 'ed.status.unsaved': 'Rascunho por guardar', 'ed.status.saving': 'A guardar…', 'ed.status.saved': 'Guardado {time}', 'ed.status.savedCloud': 'Guardado na nuvem {time}', 'ed.status.offline': 'Sem servidor: guardado neste navegador', 'ed.status.error': 'Não foi possível guardar',
    'ed.import': 'Importar', 'ed.export': 'Exportar', 'ed.save': 'Guardar', 'ed.publish': 'Publicar', 'ed.published': 'Publicado', 'ed.openGuest': 'Ver como convidado',
    'ed.sec.template': 'Modelo', 'ed.sec.couple': 'Casal', 'ed.sec.couple.sub': 'Nomes', 'ed.sec.when': 'Data e local', 'ed.sec.when.sub': 'Quando e onde', 'ed.sec.program': 'Programa do dia', 'ed.sec.rsvp': 'Formulário RSVP', 'ed.sec.rsvp.sub': 'Respostas', 'ed.sec.music': 'Música', 'ed.sec.music.sub': 'Ambiente', 'ed.sec.link': 'Ligação', 'ed.sec.link.sub': 'Endereço do convite', 'ed.sec.responses': 'Respostas dos convidados', 'ed.sec.lang': 'Idioma do convite', 'ed.sec.lang.sub': 'Predefinido para os convidados',
    'ed.lang.hint': 'Os convidados veem o convite neste idioma e podem mudá-lo com um toque.',
    'ed.f.name1': 'Primeiro nome', 'ed.f.name2': 'Segundo nome', 'ed.f.greeting': 'Saudação', 'ed.f.date': 'Data', 'ed.f.time': 'Hora de início', 'ed.f.venue': 'Local', 'ed.f.address': 'Morada', 'ed.f.map': 'Ligação do mapa', 'ed.f.map.hint': 'O botão «Como chegar» abre esta ligação na aplicação de navegação do convidado.', 'ed.f.dress': 'Dress code',
    'ed.prog.add': '+ Adicionar ponto', 'ed.prog.time': 'Hora', 'ed.prog.what': 'O que acontece', 'ed.prog.del': 'Remover', 'ed.prog.count.one': '{n} ponto', 'ed.prog.count.other': '{n} pontos',
    'ed.f.q': 'Pergunta', 'ed.f.deadline': 'Responder até', 'ed.t.plusone': 'Perguntar por acompanhantes', 'ed.t.menu': 'Escolha de menu', 'ed.f.menu': 'Opções de menu separadas por vírgulas', 'ed.t.comment': 'Campo para comentários',
    'ed.t.music': 'Tocar música ao abrir', 'ed.f.track': 'Nome da música', 'ed.music.hint': 'O ficheiro de áudio é carregado ao publicar. No rascunho aparece só o título.',
    'ed.f.slug': 'Ligação curta', 'ed.slug.hint': 'Apenas letras latinas, algarismos e hífenes. A ligação e o QR ficam ativos ao publicar.',
    'ed.resp.hint': 'As respostas reais dos convidados chegam aqui depois de publicar. As da pré-visualização ficam guardadas como teste.', 'ed.resp.csv': 'Copiar como CSV', 'ed.resp.excel': 'Transferir Excel (CSV)', 'ed.resp.clear': 'Apagar testes', 'ed.resp.refresh': 'Atualizar', 'ed.resp.empty': 'Ainda não há respostas. Envie uma resposta de teste a partir da pré-visualização.', 'ed.resp.count.one': '{n} resposta', 'ed.resp.count.other': '{n} respostas', 'ed.resp.test': 'teste',
    'ed.footnote': 'O rascunho é guardado automaticamente. Com um servidor ligado é também guardado na nuvem; «Exportar» transfere todos os dados em JSON para a pasta INVITALIA.',
    'ed.preview.label': 'Assim o verão os convidados', 'ed.dev.phone': 'Telemóvel', 'ed.dev.tablet': 'Tablet',
    'ed.def.greeting': 'Será uma alegria partilhar este dia convosco', 'ed.def.prog1': 'Cerimónia', 'ed.def.prog2': 'Aperitivo no jardim', 'ed.def.prog3': 'Jantar e baile', 'ed.def.dress': 'Elegante de noite, tons pastel', 'ed.def.q': 'Vai estar connosco?', 'ed.def.menu': 'Carne, Peixe, Vegetariano',
    'pub.title': 'Publicar o convite', 'pub.lead': 'Verifique a ligação. Após o pagamento fica ativa e pode transferir o QR para os cartões impressos.', 'pub.copy': 'Copiar', 'pub.copyQr': 'Transferir QR',
    'pub.f1': 'Formulário RSVP, mapa, música', 'pub.f2': 'Respostas no painel e exportação para Excel', 'pub.f3': 'Alterações depois de publicar sem custos', 'pub.f4': 'Disponível até ao casamento e 6 meses depois',
    'pub.unit': 'pagamento único por convite', 'pub.back': 'Voltar', 'pub.pay': 'Pagar e publicar', 'pub.update': 'Guardar alterações', 'pub.redirect': 'A abrir o pagamento seguro…',
    'pub.noteMock': 'Modo de teste: o pagamento não está ligado, o convite publica-se de imediato.', 'pub.notePublished': 'O convite já está publicado ({date}). As alterações aplicam-se ao guardar, sem novo pagamento.', 'pub.noteOffline': 'Sem servidor ligado: a publicação real e o pagamento precisam do servidor INVITALIA.', 'pub.qrLater': 'O QR aparece depois de publicar', 'pub.stripe': 'Pagamento seguro com cartão através da Stripe.',
    'io.exportTitle': 'Exportar dados', 'io.importTitle': 'Importar dados', 'io.exportText': 'Todos os dados do convite em JSON. Transfira o ficheiro ou copie o texto e guarde-o na pasta INVITALIA.', 'io.importText': 'Cole o JSON guardado ou escolha o ficheiro invitalia-….json.',
    'io.close': 'Fechar', 'io.copy': 'Copiar JSON', 'io.pick': 'Escolher ficheiro…', 'io.apply': 'Carregar no editor', 'io.download': 'Transferir ficheiro',
    'toast.saved': 'Rascunho guardado', 'toast.copied': 'Copiado', 'toast.csv': 'CSV copiado', 'toast.json': 'JSON copiado', 'toast.loaded': 'Dados carregados', 'toast.badJson': 'Não foi possível ler o JSON', 'toast.fill': 'Preencha: {fields}', 'toast.published': 'Convite publicado', 'toast.copyFail': 'Copie o texto manualmente', 'toast.serverError': 'Erro do servidor, tente de novo', 'toast.paymentOk': 'Pagamento confirmado, o convite está publicado', 'toast.paymentPending': 'O pagamento ainda não foi confirmado', 'toast.paymentCanceled': 'Pagamento cancelado', 'toast.linkCopied': 'Ligação copiada',
    'fill.names': 'os nomes', 'fill.date': 'a data', 'fill.slug': 'a ligação',
    'g.directions': 'Como chegar', 'g.dress': 'Dress code', 'g.deadline': 'Responda, por favor, até {date}', 'g.yes': 'Com todo o gosto', 'g.no': 'Não vou poder', 'g.name': 'O seu nome', 'g.alone': 'Vou sozinho / sozinha', 'g.plus1': 'Com acompanhante', 'g.plus2': 'Seremos três', 'g.menuPick': 'Escolha o menu', 'g.comment': 'Desejos ou alergias', 'g.send': 'Enviar resposta', 'g.thanksYes': 'Obrigado! A sua resposta chegou aos noivos.', 'g.thanksNo': 'Que pena não poder vir. A sua resposta foi enviada.', 'g.rsvpDefault': 'Vai estar connosco?', 'g.music': 'Música',
    'g.loading': 'A abrir o convite…', 'g.notFound': 'Não encontrámos este convite. Verifique a ligação.', 'g.notPublished': 'Este convite ainda não está publicado.', 'g.closed': 'O prazo para responder terminou. Fale diretamente com os noivos.', 'g.error': 'Não foi possível enviar a resposta. Tente de novo.', 'g.nameRequired': 'Escreva o seu nome, por favor', 'g.poweredBy': 'Criado com Invitalia.co', 'g.play': 'Reproduzir música', 'g.pause': 'Pausar música'
  };

  D.fr = {
    'meta.title': 'Invitalia.co — Faire-part de mariage numériques', 'meta.editor': 'Éditeur du faire-part · Invitalia.co', 'meta.guest': 'Invitation · Invitalia.co',
    'lang.label': 'Langue',
    'nav.templates': 'Modèles', 'nav.features': 'Fonctions', 'nav.dashboard': 'Tableau de bord', 'nav.how': 'Comment ça marche', 'nav.pricing': 'Tarif', 'nav.faq': 'Questions', 'nav.editor': 'Éditeur', 'nav.cta': 'Créer un faire-part',
    'hero.eyebrow': 'Faire-part de mariage numériques', 'hero.title': 'Le faire-part que vos invités <em>ouvrent sur leur téléphone</em> et auquel ils répondent aussitôt',
    'hero.lead': 'Choisissez un modèle, saisissez les prénoms et la date, ajoutez le plan, la musique et le QR code. Les réponses des invités arrivent d’elles-mêmes dans votre tableau de bord.',
    'hero.cta1': 'Créer gratuitement', 'hero.cta2': 'Voir les modèles', 'hero.note': '<b>Créer et modifier est gratuit.</b> Vous payez une seule fois, lorsque le faire-part est prêt et que vous publiez le lien.',
    'hero.trust1': 'Prêt en 15 minutes', 'hero.trust2': 'Sans graphiste ni imprimeur', 'hero.trust3': 'S’ouvre par lien et QR',
    'inv.place': 'Villa del Balbianello, lac de Côme', 'inv.chip.map': 'Plan', 'inv.chip.music': 'Musique', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Cérémonie', 'inv.sched2': 'Apéritif au jardin', 'inv.sched3': 'Dîner et bal',
    'inv.rsvp.q': 'Serez-vous des nôtres ? Merci de répondre avant le 1er août', 'inv.rsvp.yes': 'Avec plaisir', 'inv.rsvp.no': 'Je ne pourrai pas', 'inv.rsvp.doneYes': 'Merci ! Votre réponse est arrivée aux mariés.', 'inv.rsvp.doneNo': 'Quel dommage. Votre réponse a été envoyée.',
    'tpl.eyebrow': 'Modèles prêts', 'tpl.title': 'Le style de votre mariage est déjà dessiné', 'tpl.lead': 'Chaque modèle s’adapte au téléphone, à la tablette et à l’ordinateur. Couleurs, polices et photos se modifient dans l’éditeur.',
    'tpl.filter.all': 'Tous', 'tpl.filter.classic': 'Classique', 'tpl.filter.minimal': 'Minimaliste', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Style italien', 'tpl.filter.other': 'Autres',
    'tpl.palazzo.desc': 'Classique : empattements, double cadre, ivoire et or.', 'tpl.linea.desc': 'Minimaliste : fond blanc, linéale fine, rien d’autre.', 'tpl.heritage.desc': 'Old money : vert profond, italique crème, luxe discret.', 'tpl.amalfi.desc': 'Style italien : terre cuite, lumière de citron et rayures de parasol.', 'tpl.botanica.desc': 'Verdure et air pour un mariage au jardin ou au domaine.', 'tpl.noir.desc': 'Mariage du soir : noir, champagne et éclats d’or.',
    'feat.eyebrow': 'Interactif dans le faire-part', 'feat.title': 'Pas une carte, un assistant pour vos invités', 'feat.lead': 'Tout ce qu’on envoie d’habitude en messages séparés est déjà dans le faire-part.',
    'feat.rsvp.t': 'Formulaire RSVP', 'feat.rsvp.d': 'L’invité confirme sa présence, indique un accompagnant, ses préférences de menu et ses vœux. Vous choisissez les questions.',
    'feat.map.t': 'Plan interactif', 'feat.map.d': 'Cérémonie et réception sur le plan ; l’itinéraire s’ouvre d’un geste dans l’application GPS habituelle.',
    'feat.music.t': 'Musique d’ambiance', 'feat.music.d': 'Votre mélodie joue à l’ouverture du faire-part et donne le ton avant la fête.',
    'feat.qr.t': 'QR code', 'feat.qr.d': 'Un code prêt pour les cartons imprimés, les marque-places et les stories. On le scanne et on arrive directement sur le faire-part.',
    'dash.eyebrow': 'Tableau de bord', 'dash.title': 'Toutes les réponses se rassemblent d’elles-mêmes', 'dash.lead': 'Fini de compter les confirmations dans les messageries. Chaque réponse apparaît avec le nom, l’heure et le commentaire. La liste s’exporte vers Excel pour le traiteur, le plan de table et les prestataires.',
    'dash.invited': 'invités', 'dash.yes': 'présents', 'dash.no': 'absents', 'dash.wait': 'en attente', 'dash.open': 'Ouvrir le tableau de bord', 'dash.tableTitle': 'Réponses · Alessandro et María', 'dash.export': 'Exporter vers Excel', 'dash.exportDone': 'Fichier prêt (démo)',
    'dash.th.guest': 'Invité', 'dash.th.answer': 'Réponse', 'dash.th.plus': 'Accomp.', 'dash.th.menu': 'Menu', 'dash.th.received': 'Reçue',
    'dash.pill.yes': 'Présent', 'dash.pill.yesPl': 'Présents', 'dash.pill.no': 'Absent', 'dash.pill.wait': 'En attente',
    'dash.menu1': 'Poisson', 'dash.menu2': 'Végétarien', 'dash.menu4': 'Viande, enfant', 'dash.time1': 'hier, 21:14', 'dash.time2': 'hier, 18:02', 'dash.time3': 'il y a 2 jours', 'dash.time4': 'il y a 3 jours', 'dash.remind': 'relancer', 'dash.family': 'Famille López',
    'how.eyebrow': 'Comment ça marche', 'how.title': 'Trois étapes jusqu’au lien prêt',
    'how.s1.t': 'Choisissez un modèle', 'how.s1.d': 'Ouvrez n’importe quel design et commencez à modifier tout de suite, sans carte bancaire.', 'how.s2.t': 'Remplissez les détails', 'how.s2.d': 'Prénoms, date, lieu, programme de la journée, dress code, questions du formulaire, musique et photos.', 'how.s3.t': 'Publiez le lien', 'how.s3.d': 'Payez la publication, recevez le lien court et le QR. Envoyez-le à vos invités et suivez les réponses.',
    'price.eyebrow': 'Tarif', 'price.title': 'Vous payez une fois, et seulement le résultat', 'price.lead': 'Créez et refaites le faire-part autant que vous voulez. Le paiement intervient au moment de publier le lien définitif.',
    'price.free.tag': 'Création', 'price.free.sum': '0 €', 'price.free.1': 'Tous les modèles et l’éditeur sans limite', 'price.free.2': 'Aperçu sur téléphone et ordinateur', 'price.free.3': 'Le brouillon reste dans votre tableau de bord', 'price.free.4': 'Revenez le terminer quand vous voulez', 'price.free.cta': 'Commencer gratuitement',
    'price.pub.tag': 'Publication', 'price.pub.sum': '29 €', 'price.pub.unit': 'paiement unique par faire-part', 'price.pub.1': 'Lien court et QR code', 'price.pub.2': 'Formulaire RSVP, plan, musique', 'price.pub.3': 'Tableau de bord avec réponses et export Excel', 'price.pub.4': 'Modifications après publication sans frais', 'price.pub.5': 'Accessible aux invités jusqu’au mariage et 6 mois après', 'price.pub.cta': 'Créer un faire-part', 'price.pub.fine': 'Tarif indicatif, ajusté avant le lancement.',
    'faq.eyebrow': 'Questions fréquentes', 'faq.title': 'Ce que les couples demandent aussi',
    'faq.q1': 'Les invités doivent-ils installer quelque chose ?', 'faq.a1': 'Non. Le faire-part s’ouvre par lien ou QR code dans n’importe quel navigateur, sur téléphone ou ordinateur. On répond sans inscription.',
    'faq.q2': 'Peut-on modifier le faire-part après publication ?', 'faq.a2': 'Oui. Texte, horaire, photos et questions se modifient dans l’éditeur ; le lien reste le même et les invités voient la version à jour.',
    'faq.q3': 'Comment envoyer le faire-part ?', 'faq.a3': 'Comme vous voulez : le lien par WhatsApp ou e-mail, le QR sur des cartons imprimés, ou des liens personnels par invité pour que son nom apparaisse automatiquement.',
    'faq.q4': 'Que contient le fichier Excel ?', 'faq.a4': 'Nom de l’invité, réponse, nombre d’accompagnants, menu choisi, commentaire et heure de la réponse. Vous pouvez l’envoyer tel quel au traiteur ou au wedding planner.',
    'faq.q5': 'Le faire-part peut-il être en plusieurs langues ?', 'faq.a5': 'Oui. Le faire-part s’affiche dans la langue de l’invité : espagnol, anglais, italien, portugais, français, allemand ou russe, et il peut en changer d’un geste.',
    'final.title': 'Partez d’un modèle, le reste est déjà pensé', 'final.lead': 'Créer est gratuit. Vous ne payez qu’en publiant le lien définitif.', 'final.cta': 'Créer un faire-part',
    'footer.copy': 'Copier', 'footer.copied': 'Copié', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Éditeur du faire-part', 'ed.status.unsaved': 'Brouillon non enregistré', 'ed.status.saving': 'Enregistrement…', 'ed.status.saved': 'Enregistré {time}', 'ed.status.savedCloud': 'Enregistré dans le cloud {time}', 'ed.status.offline': 'Pas de serveur : enregistré dans ce navigateur', 'ed.status.error': 'Enregistrement impossible',
    'ed.import': 'Importer', 'ed.export': 'Exporter', 'ed.save': 'Enregistrer', 'ed.publish': 'Publier', 'ed.published': 'Publié', 'ed.openGuest': 'Voir côté invité',
    'ed.sec.template': 'Modèle', 'ed.sec.couple': 'Couple', 'ed.sec.couple.sub': 'Prénoms', 'ed.sec.when': 'Date et lieu', 'ed.sec.when.sub': 'Quand et où', 'ed.sec.program': 'Programme de la journée', 'ed.sec.rsvp': 'Formulaire RSVP', 'ed.sec.rsvp.sub': 'Réponses', 'ed.sec.music': 'Musique', 'ed.sec.music.sub': 'Ambiance', 'ed.sec.link': 'Lien', 'ed.sec.link.sub': 'Adresse du faire-part', 'ed.sec.responses': 'Réponses des invités', 'ed.sec.lang': 'Langue du faire-part', 'ed.sec.lang.sub': 'Par défaut pour les invités',
    'ed.lang.hint': 'Les invités voient le faire-part dans cette langue et peuvent en changer d’un geste.',
    'ed.f.name1': 'Premier prénom', 'ed.f.name2': 'Second prénom', 'ed.f.greeting': 'Mot d’accueil', 'ed.f.date': 'Date', 'ed.f.time': 'Heure de début', 'ed.f.venue': 'Lieu', 'ed.f.address': 'Adresse', 'ed.f.map': 'Lien du plan', 'ed.f.map.hint': 'Le bouton « Itinéraire » ouvrira ce lien dans l’application GPS de l’invité.', 'ed.f.dress': 'Dress code',
    'ed.prog.add': '+ Ajouter une étape', 'ed.prog.time': 'Heure', 'ed.prog.what': 'Ce qui se passe', 'ed.prog.del': 'Supprimer', 'ed.prog.count.one': '{n} étape', 'ed.prog.count.other': '{n} étapes',
    'ed.f.q': 'Question', 'ed.f.deadline': 'Répondre avant le', 'ed.t.plusone': 'Demander les accompagnants', 'ed.t.menu': 'Choix du menu', 'ed.f.menu': 'Options de menu séparées par des virgules', 'ed.t.comment': 'Champ de commentaire',
    'ed.t.music': 'Jouer la musique à l’ouverture', 'ed.f.track': 'Titre du morceau', 'ed.music.hint': 'Le fichier audio est ajouté à la publication. Le brouillon n’affiche que le titre.',
    'ed.f.slug': 'Lien court', 'ed.slug.hint': 'Lettres latines, chiffres et tirets uniquement. Le lien et le QR s’activent à la publication.',
    'ed.resp.hint': 'Les vraies réponses des invités arrivent ici après publication. Celles de l’aperçu sont conservées comme tests.', 'ed.resp.csv': 'Copier en CSV', 'ed.resp.excel': 'Télécharger Excel (CSV)', 'ed.resp.clear': 'Effacer les tests', 'ed.resp.refresh': 'Actualiser', 'ed.resp.empty': 'Pas encore de réponse. Envoyez une réponse test depuis l’aperçu.', 'ed.resp.count.one': '{n} réponse', 'ed.resp.count.other': '{n} réponses', 'ed.resp.test': 'test',
    'ed.footnote': 'Le brouillon s’enregistre automatiquement. Avec un serveur connecté, il est aussi enregistré dans le cloud ; « Exporter » télécharge toutes les données en JSON pour le dossier INVITALIA.',
    'ed.preview.label': 'Ce que verront les invités', 'ed.dev.phone': 'Téléphone', 'ed.dev.tablet': 'Tablette',
    'ed.def.greeting': 'Nous serons heureux de partager ce jour avec vous', 'ed.def.prog1': 'Cérémonie', 'ed.def.prog2': 'Apéritif au jardin', 'ed.def.prog3': 'Dîner et bal', 'ed.def.dress': 'Tenue de soirée élégante, tons pastel', 'ed.def.q': 'Serez-vous des nôtres ?', 'ed.def.menu': 'Viande, Poisson, Végétarien',
    'pub.title': 'Publier le faire-part', 'pub.lead': 'Vérifiez le lien. Après le paiement, il devient actif et vous pourrez télécharger le QR pour les cartons imprimés.', 'pub.copy': 'Copier', 'pub.copyQr': 'Télécharger le QR',
    'pub.f1': 'Formulaire RSVP, plan, musique', 'pub.f2': 'Réponses dans le tableau de bord et export Excel', 'pub.f3': 'Modifications après publication sans frais', 'pub.f4': 'Accessible jusqu’au mariage et 6 mois après',
    'pub.unit': 'paiement unique par faire-part', 'pub.back': 'Retour', 'pub.pay': 'Payer et publier', 'pub.update': 'Enregistrer les modifications', 'pub.redirect': 'Ouverture du paiement sécurisé…',
    'pub.noteMock': 'Mode test : le paiement n’est pas connecté, le faire-part est publié immédiatement.', 'pub.notePublished': 'Le faire-part est déjà publié ({date}). Les modifications s’appliquent à l’enregistrement, sans nouveau paiement.', 'pub.noteOffline': 'Aucun serveur connecté : la publication réelle et le paiement nécessitent le serveur INVITALIA.', 'pub.qrLater': 'Le QR apparaîtra après la publication', 'pub.stripe': 'Paiement sécurisé par carte via Stripe.',
    'io.exportTitle': 'Exporter les données', 'io.importTitle': 'Importer des données', 'io.exportText': 'Toutes les données du faire-part en JSON. Téléchargez le fichier ou copiez le texte et conservez-le dans le dossier INVITALIA.', 'io.importText': 'Collez le JSON enregistré ou choisissez le fichier invitalia-….json.',
    'io.close': 'Fermer', 'io.copy': 'Copier le JSON', 'io.pick': 'Choisir un fichier…', 'io.apply': 'Charger dans l’éditeur', 'io.download': 'Télécharger le fichier',
    'toast.saved': 'Brouillon enregistré', 'toast.copied': 'Copié', 'toast.csv': 'CSV copié', 'toast.json': 'JSON copié', 'toast.loaded': 'Données chargées', 'toast.badJson': 'Impossible de lire le JSON', 'toast.fill': 'Renseignez {fields}', 'toast.published': 'Faire-part publié', 'toast.copyFail': 'Copiez le texte manuellement', 'toast.serverError': 'Erreur du serveur, réessayez', 'toast.paymentOk': 'Paiement confirmé, le faire-part est en ligne', 'toast.paymentPending': 'Paiement pas encore confirmé', 'toast.paymentCanceled': 'Paiement annulé', 'toast.linkCopied': 'Lien copié',
    'fill.names': 'les prénoms', 'fill.date': 'la date', 'fill.slug': 'le lien',
    'g.directions': 'Itinéraire', 'g.dress': 'Dress code', 'g.deadline': 'Merci de répondre avant le {date}', 'g.yes': 'Avec plaisir', 'g.no': 'Je ne pourrai pas', 'g.name': 'Votre nom', 'g.alone': 'Je viens seul(e)', 'g.plus1': 'Avec un accompagnant', 'g.plus2': 'Nous serons trois', 'g.menuPick': 'Choisissez le menu', 'g.comment': 'Vœux ou allergies', 'g.send': 'Envoyer la réponse', 'g.thanksYes': 'Merci ! Votre réponse est arrivée aux mariés.', 'g.thanksNo': 'Dommage que vous ne puissiez pas venir. Votre réponse a été envoyée.', 'g.rsvpDefault': 'Serez-vous des nôtres ?', 'g.music': 'Musique',
    'g.loading': 'Ouverture du faire-part…', 'g.notFound': 'Nous ne trouvons pas ce faire-part. Vérifiez le lien.', 'g.notPublished': 'Ce faire-part n’est pas encore publié.', 'g.closed': 'Le délai de réponse est passé. Contactez directement les mariés.', 'g.error': 'Impossible d’envoyer la réponse. Réessayez.', 'g.nameRequired': 'Indiquez votre nom, s’il vous plaît', 'g.poweredBy': 'Créé avec Invitalia.co', 'g.play': 'Lancer la musique', 'g.pause': 'Mettre en pause'
  };

  D.de = {
    'meta.title': 'Invitalia.co — Digitale Hochzeitseinladungen', 'meta.editor': 'Einladungs-Editor · Invitalia.co', 'meta.guest': 'Einladung · Invitalia.co',
    'lang.label': 'Sprache',
    'nav.templates': 'Vorlagen', 'nav.features': 'Funktionen', 'nav.dashboard': 'Übersicht', 'nav.how': 'So funktioniert’s', 'nav.pricing': 'Preis', 'nav.faq': 'Fragen', 'nav.editor': 'Editor', 'nav.cta': 'Einladung erstellen',
    'hero.eyebrow': 'Digitale Hochzeitseinladungen', 'hero.title': 'Die Einladung, die Ihre Gäste <em>am Handy öffnen</em> und sofort beantworten',
    'hero.lead': 'Vorlage wählen, Namen und Datum eintragen, Karte, Musik und QR-Code hinzufügen. Die Antworten der Gäste landen von selbst in Ihrer Übersicht.',
    'hero.cta1': 'Kostenlos erstellen', 'hero.cta2': 'Vorlagen ansehen', 'hero.note': '<b>Erstellen und Bearbeiten ist kostenlos.</b> Sie zahlen einmal, wenn die Einladung fertig ist und Sie den Link veröffentlichen.',
    'hero.trust1': 'In 15 Minuten fertig', 'hero.trust2': 'Ohne Designer und Druckerei', 'hero.trust3': 'Öffnet sich per Link und QR',
    'inv.place': 'Villa del Balbianello, Comer See', 'inv.chip.map': 'Karte', 'inv.chip.music': 'Musik', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Trauung', 'inv.sched2': 'Aperitif im Garten', 'inv.sched3': 'Dinner und Tanz',
    'inv.rsvp.q': 'Sind Sie dabei? Bitte antworten Sie bis zum 1. August', 'inv.rsvp.yes': 'Sehr gern', 'inv.rsvp.no': 'Leider nicht', 'inv.rsvp.doneYes': 'Danke! Ihre Antwort ist beim Brautpaar angekommen.', 'inv.rsvp.doneNo': 'Schade. Ihre Antwort wurde gesendet.',
    'tpl.eyebrow': 'Fertige Vorlagen', 'tpl.title': 'Der Stil Ihrer Hochzeit ist schon gezeichnet', 'tpl.lead': 'Jede Vorlage passt sich an Handy, Tablet und Computer an. Farben, Schriften und Fotos ändern Sie im Editor.',
    'tpl.filter.all': 'Alle', 'tpl.filter.classic': 'Klassisch', 'tpl.filter.minimal': 'Minimalistisch', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Italienischer Stil', 'tpl.filter.other': 'Weitere',
    'tpl.palazzo.desc': 'Klassisch: Serifen, Doppelrahmen, Elfenbein und Gold.', 'tpl.linea.desc': 'Minimalistisch: weiße Fläche, feine Grotesk, sonst nichts.', 'tpl.heritage.desc': 'Old money: tiefes Grün, cremefarbene Kursive, leiser Luxus.', 'tpl.amalfi.desc': 'Italienischer Stil: Terrakotta, Zitronenlicht und Sonnenschirm-Streifen.', 'tpl.botanica.desc': 'Grün und Luft für eine Hochzeit im Garten oder Weingut.', 'tpl.noir.desc': 'Abendhochzeit: Schwarz, Champagner und Goldschimmer.',
    'feat.eyebrow': 'Interaktiv in der Einladung', 'feat.title': 'Keine Karte, sondern ein Helfer für Ihre Gäste', 'feat.lead': 'Alles, was sonst in einzelnen Nachrichten verschickt wird, steckt schon in der Einladung.',
    'feat.rsvp.t': 'RSVP-Formular', 'feat.rsvp.d': 'Gäste sagen zu, nennen ihre Begleitung, Menüwünsche und Grüße. Die Fragen bestimmen Sie.',
    'feat.map.t': 'Interaktive Karte', 'feat.map.d': 'Trauung und Feier auf der Karte; die Route öffnet sich mit einem Tipp in der gewohnten Navigations-App.',
    'feat.music.t': 'Hintergrundmusik', 'feat.music.d': 'Ihr Lied spielt beim Öffnen der Einladung und stimmt auf das Fest ein.',
    'feat.qr.t': 'QR-Code', 'feat.qr.d': 'Ein fertiger Code für gedruckte Karten, Tischkarten und Stories. Scannen und direkt in der Einladung landen.',
    'dash.eyebrow': 'Übersicht für Gastgeber', 'dash.title': 'Alle Antworten sammeln sich von selbst', 'dash.lead': 'Schluss mit dem Zählen von Zusagen in Chats. Jede Antwort erscheint mit Name, Uhrzeit und Kommentar. Die Liste exportieren Sie als Excel für Location, Sitzplan und Dienstleister.',
    'dash.invited': 'eingeladen', 'dash.yes': 'kommen', 'dash.no': 'absagen', 'dash.wait': 'offen', 'dash.open': 'Übersicht öffnen', 'dash.tableTitle': 'Antworten · Alessandro und María', 'dash.export': 'Als Excel exportieren', 'dash.exportDone': 'Datei bereit (Demo)',
    'dash.th.guest': 'Gast', 'dash.th.answer': 'Antwort', 'dash.th.plus': 'Begl.', 'dash.th.menu': 'Menü', 'dash.th.received': 'Eingegangen',
    'dash.pill.yes': 'Kommt', 'dash.pill.yesPl': 'Kommen', 'dash.pill.no': 'Kommt nicht', 'dash.pill.wait': 'Offen',
    'dash.menu1': 'Fisch', 'dash.menu2': 'Vegetarisch', 'dash.menu4': 'Fleisch, Kinder', 'dash.time1': 'gestern, 21:14', 'dash.time2': 'gestern, 18:02', 'dash.time3': 'vor 2 Tagen', 'dash.time4': 'vor 3 Tagen', 'dash.remind': 'erinnern', 'dash.family': 'Familie López',
    'how.eyebrow': 'So funktioniert’s', 'how.title': 'Drei Schritte bis zum fertigen Link',
    'how.s1.t': 'Vorlage wählen', 'how.s1.d': 'Öffnen Sie ein beliebiges Design und bearbeiten Sie es sofort, ohne Karte zu hinterlegen.', 'how.s2.t': 'Details eintragen', 'how.s2.d': 'Namen, Datum, Ort, Tagesablauf, Dresscode, Fragen im Formular, Musik und Fotos.', 'how.s3.t': 'Link veröffentlichen', 'how.s3.d': 'Veröffentlichung bezahlen, Kurzlink und QR erhalten. An die Gäste senden und die Antworten verfolgen.',
    'price.eyebrow': 'Preis', 'price.title': 'Einmal zahlen, und nur für das Ergebnis', 'price.lead': 'Gestalten und ändern Sie die Einladung so oft Sie wollen. Bezahlt wird erst beim Veröffentlichen des endgültigen Links.',
    'price.free.tag': 'Erstellen', 'price.free.sum': '0 €', 'price.free.1': 'Alle Vorlagen und der Editor ohne Limit', 'price.free.2': 'Vorschau auf Handy und Computer', 'price.free.3': 'Der Entwurf bleibt in Ihrer Übersicht', 'price.free.4': 'Jederzeit zurückkommen und fertigstellen', 'price.free.cta': 'Kostenlos starten',
    'price.pub.tag': 'Veröffentlichen', 'price.pub.sum': '29 €', 'price.pub.unit': 'einmalig, pro Einladung', 'price.pub.1': 'Kurzlink und QR-Code', 'price.pub.2': 'RSVP-Formular, Karte, Musik', 'price.pub.3': 'Übersicht mit Antworten und Excel-Export', 'price.pub.4': 'Änderungen nach dem Veröffentlichen ohne Aufpreis', 'price.pub.5': 'Für Gäste erreichbar bis zur Hochzeit und 6 Monate danach', 'price.pub.cta': 'Einladung erstellen', 'price.pub.fine': 'Richtpreis, wird vor dem Start festgelegt.',
    'faq.eyebrow': 'Häufige Fragen', 'faq.title': 'Was Paare außerdem fragen',
    'faq.q1': 'Müssen Gäste etwas installieren?', 'faq.a1': 'Nein. Die Einladung öffnet sich per Link oder QR-Code in jedem Browser, am Handy oder Computer. Antworten geht ohne Registrierung.',
    'faq.q2': 'Kann ich die Einladung nach dem Veröffentlichen ändern?', 'faq.a2': 'Ja. Text, Uhrzeit, Fotos und Fragen ändern Sie im Editor; der Link bleibt gleich und Gäste sehen die aktuelle Version.',
    'faq.q3': 'Wie verschicke ich die Einladung?', 'faq.a3': 'Wie Sie möchten: den Link per WhatsApp oder E-Mail, den QR auf gedruckten Karten oder persönliche Links pro Gast, damit der Name automatisch erscheint.',
    'faq.q4': 'Was steht in der Excel-Datei?', 'faq.a4': 'Name des Gastes, Antwort, Anzahl der Begleitpersonen, Menüwahl, Kommentar und Zeitpunkt der Antwort. Die Datei können Sie so an Location oder Planer weitergeben.',
    'faq.q5': 'Geht die Einladung in mehreren Sprachen?', 'faq.a5': 'Ja. Die Einladung erscheint in der Sprache des Gastes: Spanisch, Englisch, Italienisch, Portugiesisch, Französisch, Deutsch oder Russisch, umschaltbar mit einem Tipp.',
    'final.title': 'Beginnen Sie mit einer Vorlage, der Rest ist schon durchdacht', 'final.lead': 'Erstellen ist kostenlos. Sie zahlen nur beim Veröffentlichen des endgültigen Links.', 'final.cta': 'Einladung erstellen',
    'footer.copy': 'Kopieren', 'footer.copied': 'Kopiert', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Einladungs-Editor', 'ed.status.unsaved': 'Entwurf nicht gespeichert', 'ed.status.saving': 'Speichern…', 'ed.status.saved': 'Gespeichert {time}', 'ed.status.savedCloud': 'In der Cloud gespeichert {time}', 'ed.status.offline': 'Kein Server: in diesem Browser gespeichert', 'ed.status.error': 'Speichern fehlgeschlagen',
    'ed.import': 'Importieren', 'ed.export': 'Exportieren', 'ed.save': 'Speichern', 'ed.publish': 'Veröffentlichen', 'ed.published': 'Veröffentlicht', 'ed.openGuest': 'Als Gast ansehen',
    'ed.sec.template': 'Vorlage', 'ed.sec.couple': 'Paar', 'ed.sec.couple.sub': 'Namen', 'ed.sec.when': 'Datum und Ort', 'ed.sec.when.sub': 'Wann und wo', 'ed.sec.program': 'Tagesablauf', 'ed.sec.rsvp': 'RSVP-Formular', 'ed.sec.rsvp.sub': 'Antworten', 'ed.sec.music': 'Musik', 'ed.sec.music.sub': 'Stimmung', 'ed.sec.link': 'Link', 'ed.sec.link.sub': 'Adresse der Einladung', 'ed.sec.responses': 'Antworten der Gäste', 'ed.sec.lang': 'Sprache der Einladung', 'ed.sec.lang.sub': 'Standard für Gäste',
    'ed.lang.hint': 'Gäste sehen die Einladung in dieser Sprache und können sie mit einem Tipp wechseln.',
    'ed.f.name1': 'Erster Name', 'ed.f.name2': 'Zweiter Name', 'ed.f.greeting': 'Begrüßung', 'ed.f.date': 'Datum', 'ed.f.time': 'Beginn', 'ed.f.venue': 'Ort', 'ed.f.address': 'Adresse', 'ed.f.map': 'Kartenlink', 'ed.f.map.hint': 'Der Button „Anfahrt“ öffnet diesen Link in der Navigations-App des Gastes.', 'ed.f.dress': 'Dresscode',
    'ed.prog.add': '+ Punkt hinzufügen', 'ed.prog.time': 'Uhrzeit', 'ed.prog.what': 'Was passiert', 'ed.prog.del': 'Entfernen', 'ed.prog.count.one': '{n} Punkt', 'ed.prog.count.other': '{n} Punkte',
    'ed.f.q': 'Frage', 'ed.f.deadline': 'Antworten bis', 'ed.t.plusone': 'Nach Begleitung fragen', 'ed.t.menu': 'Menüwahl', 'ed.f.menu': 'Menüoptionen, durch Komma getrennt', 'ed.t.comment': 'Kommentarfeld',
    'ed.t.music': 'Musik beim Öffnen abspielen', 'ed.f.track': 'Titel des Stücks', 'ed.music.hint': 'Die Audiodatei wird beim Veröffentlichen hochgeladen. Im Entwurf erscheint nur der Titel.',
    'ed.f.slug': 'Kurzlink', 'ed.slug.hint': 'Nur lateinische Buchstaben, Ziffern und Bindestriche. Link und QR werden beim Veröffentlichen aktiv.',
    'ed.resp.hint': 'Echte Antworten der Gäste erscheinen hier nach dem Veröffentlichen. Antworten aus der Vorschau werden als Test gespeichert.', 'ed.resp.csv': 'Als CSV kopieren', 'ed.resp.excel': 'Excel (CSV) herunterladen', 'ed.resp.clear': 'Tests löschen', 'ed.resp.refresh': 'Aktualisieren', 'ed.resp.empty': 'Noch keine Antworten. Senden Sie eine Testantwort aus der Vorschau.', 'ed.resp.count.one': '{n} Antwort', 'ed.resp.count.other': '{n} Antworten', 'ed.resp.test': 'Test',
    'ed.footnote': 'Der Entwurf wird automatisch gespeichert. Mit verbundenem Server auch in der Cloud; „Exportieren“ lädt alle Daten als JSON für den Ordner INVITALIA herunter.',
    'ed.preview.label': 'So sehen es die Gäste', 'ed.dev.phone': 'Handy', 'ed.dev.tablet': 'Tablet',
    'ed.def.greeting': 'Wir freuen uns, diesen Tag mit euch zu teilen', 'ed.def.prog1': 'Trauung', 'ed.def.prog2': 'Aperitif im Garten', 'ed.def.prog3': 'Dinner und Tanz', 'ed.def.dress': 'Elegante Abendgarderobe, Pastelltöne', 'ed.def.q': 'Seid ihr dabei?', 'ed.def.menu': 'Fleisch, Fisch, Vegetarisch',
    'pub.title': 'Einladung veröffentlichen', 'pub.lead': 'Prüfen Sie den Link. Nach der Zahlung wird er aktiv, und Sie können den QR für gedruckte Karten herunterladen.', 'pub.copy': 'Kopieren', 'pub.copyQr': 'QR herunterladen',
    'pub.f1': 'RSVP-Formular, Karte, Musik', 'pub.f2': 'Antworten in der Übersicht und Excel-Export', 'pub.f3': 'Änderungen nach dem Veröffentlichen ohne Aufpreis', 'pub.f4': 'Erreichbar bis zur Hochzeit und 6 Monate danach',
    'pub.unit': 'einmalig, pro Einladung', 'pub.back': 'Zurück', 'pub.pay': 'Bezahlen und veröffentlichen', 'pub.update': 'Änderungen speichern', 'pub.redirect': 'Sichere Zahlung wird geöffnet…',
    'pub.noteMock': 'Testmodus: Zahlung nicht verbunden, die Einladung wird sofort veröffentlicht.', 'pub.notePublished': 'Die Einladung ist bereits veröffentlicht ({date}). Änderungen gelten beim Speichern, ohne neue Zahlung.', 'pub.noteOffline': 'Kein Server verbunden: echte Veröffentlichung und Zahlung brauchen den INVITALIA-Server.', 'pub.qrLater': 'Der QR erscheint nach dem Veröffentlichen', 'pub.stripe': 'Sichere Kartenzahlung über Stripe.',
    'io.exportTitle': 'Daten exportieren', 'io.importTitle': 'Daten importieren', 'io.exportText': 'Alle Daten der Einladung als JSON. Laden Sie die Datei herunter oder kopieren Sie den Text in den Ordner INVITALIA.', 'io.importText': 'Fügen Sie das gespeicherte JSON ein oder wählen Sie die Datei invitalia-….json.',
    'io.close': 'Schließen', 'io.copy': 'JSON kopieren', 'io.pick': 'Datei wählen…', 'io.apply': 'In den Editor laden', 'io.download': 'Datei herunterladen',
    'toast.saved': 'Entwurf gespeichert', 'toast.copied': 'Kopiert', 'toast.csv': 'CSV kopiert', 'toast.json': 'JSON kopiert', 'toast.loaded': 'Daten geladen', 'toast.badJson': 'JSON konnte nicht gelesen werden', 'toast.fill': 'Bitte ausfüllen: {fields}', 'toast.published': 'Einladung veröffentlicht', 'toast.copyFail': 'Bitte Text manuell kopieren', 'toast.serverError': 'Serverfehler, bitte erneut versuchen', 'toast.paymentOk': 'Zahlung bestätigt, die Einladung ist online', 'toast.paymentPending': 'Zahlung noch nicht bestätigt', 'toast.paymentCanceled': 'Zahlung abgebrochen', 'toast.linkCopied': 'Link kopiert',
    'fill.names': 'die Namen', 'fill.date': 'das Datum', 'fill.slug': 'den Link',
    'g.directions': 'Anfahrt', 'g.dress': 'Dresscode', 'g.deadline': 'Bitte antworten Sie bis zum {date}', 'g.yes': 'Sehr gern', 'g.no': 'Leider nicht', 'g.name': 'Ihr Name', 'g.alone': 'Ich komme allein', 'g.plus1': 'Mit Begleitung', 'g.plus2': 'Wir kommen zu dritt', 'g.menuPick': 'Menü wählen', 'g.comment': 'Wünsche oder Allergien', 'g.send': 'Antwort senden', 'g.thanksYes': 'Danke! Ihre Antwort ist beim Brautpaar angekommen.', 'g.thanksNo': 'Schade, dass Sie nicht kommen können. Ihre Antwort wurde gesendet.', 'g.rsvpDefault': 'Sind Sie dabei?', 'g.music': 'Musik',
    'g.loading': 'Einladung wird geöffnet…', 'g.notFound': 'Diese Einladung wurde nicht gefunden. Bitte prüfen Sie den Link.', 'g.notPublished': 'Diese Einladung ist noch nicht veröffentlicht.', 'g.closed': 'Die Antwortfrist ist abgelaufen. Bitte wenden Sie sich direkt an das Brautpaar.', 'g.error': 'Antwort konnte nicht gesendet werden. Bitte erneut versuchen.', 'g.nameRequired': 'Bitte geben Sie Ihren Namen ein', 'g.poweredBy': 'Erstellt mit Invitalia.co', 'g.play': 'Musik abspielen', 'g.pause': 'Musik pausieren'
  };

  D.ru = {
    'meta.title': 'Invitalia.co — Электронные свадебные приглашения', 'meta.editor': 'Редактор приглашения · Invitalia.co', 'meta.guest': 'Приглашение · Invitalia.co',
    'lang.label': 'Язык',
    'nav.templates': 'Шаблоны', 'nav.features': 'Возможности', 'nav.dashboard': 'Кабинет', 'nav.how': 'Как это работает', 'nav.pricing': 'Цена', 'nav.faq': 'Вопросы', 'nav.editor': 'Редактор', 'nav.cta': 'Создать приглашение',
    'hero.eyebrow': 'Электронные свадебные приглашения', 'hero.title': 'Приглашение, которое гости <em>откроют с телефона</em> и сразу ответят',
    'hero.lead': 'Выберите шаблон, впишите имена и дату, добавьте карту проезда, музыку и QR-код. Ответы гостей соберутся в личном кабинете сами.',
    'hero.cta1': 'Создать бесплатно', 'hero.cta2': 'Смотреть шаблоны', 'hero.note': '<b>Создание и редактирование бесплатны.</b> Платите один раз, когда приглашение готово и вы публикуете ссылку.',
    'hero.trust1': 'Готово за 15 минут', 'hero.trust2': 'Без дизайнера и типографии', 'hero.trust3': 'Открывается по ссылке и QR',
    'inv.place': 'Вилла Бальбьянелло, озеро Комо', 'inv.chip.map': 'Карта', 'inv.chip.music': 'Музыка', 'inv.chip.qr': 'QR',
    'inv.sched1': 'Церемония', 'inv.sched2': 'Аперитив в саду', 'inv.sched3': 'Ужин и танцы',
    'inv.rsvp.q': 'Вы придёте? Ответьте, пожалуйста, до 1 августа', 'inv.rsvp.yes': 'С радостью', 'inv.rsvp.no': 'Не смогу', 'inv.rsvp.doneYes': 'Спасибо! Ответ отправлен паре.', 'inv.rsvp.doneNo': 'Жаль! Ответ отправлен.',
    'tpl.eyebrow': 'Готовые шаблоны', 'tpl.title': 'Стиль вашей свадьбы уже нарисован', 'tpl.lead': 'Каждый шаблон адаптирован под телефон, планшет и компьютер. Цвета, шрифты и фотографии меняются в редакторе.',
    'tpl.filter.all': 'Все', 'tpl.filter.classic': 'Классика', 'tpl.filter.minimal': 'Минимализм', 'tpl.filter.oldmoney': 'Old money', 'tpl.filter.italia': 'Итальянский стиль', 'tpl.filter.other': 'Ещё',
    'tpl.palazzo.desc': 'Классика: антиква, двойная рамка, слоновая кость и золото.', 'tpl.linea.desc': 'Минимализм: белое поле, тонкий гротеск, ничего лишнего.', 'tpl.heritage.desc': 'Old money: глубокий зелёный, кремовый курсив, тихая роскошь.', 'tpl.amalfi.desc': 'Итальянский стиль: терракота, лимонный свет и полосы пляжных зонтов.', 'tpl.botanica.desc': 'Зелень и воздух для свадьбы в саду или на винодельне.', 'tpl.noir.desc': 'Вечерняя свадьба: чёрный, шампань и мерцание золота.',
    'feat.eyebrow': 'Интерактив внутри приглашения', 'feat.title': 'Не открытка, а помощник для гостей', 'feat.lead': 'Всё, что обычно рассылают отдельными сообщениями, уже встроено в приглашение.',
    'feat.rsvp.t': 'RSVP-анкета', 'feat.rsvp.d': 'Гость подтверждает присутствие, указывает спутника, предпочтения в еде и пожелания. Вопросы настраиваете вы.',
    'feat.map.t': 'Интерактивная карта проезда', 'feat.map.d': 'Место церемонии и банкета на карте, маршрут открывается одним касанием в привычном навигаторе.',
    'feat.music.t': 'Музыкальное сопровождение', 'feat.music.d': 'Ваша мелодия звучит при открытии приглашения и задаёт настроение ещё до праздника.',
    'feat.qr.t': 'QR-код', 'feat.qr.d': 'Готовый код для печатных карточек, рассадочных табличек и сторис. Сканируют и сразу попадают в приглашение.',
    'dash.eyebrow': 'Личный кабинет', 'dash.title': 'Все ответы гостей собираются сами', 'dash.lead': 'Больше не нужно считать подтверждения в переписках. Каждый ответ появляется в кабинете с именем, временем и комментарием. Список выгружается в Excel для ресторана, рассадки и подрядчиков.',
    'dash.invited': 'приглашено', 'dash.yes': 'придут', 'dash.no': 'не смогут', 'dash.wait': 'ждём ответа', 'dash.open': 'Открыть кабинет', 'dash.tableTitle': 'Ответы гостей · Алессандро и Мария', 'dash.export': 'Выгрузить в Excel', 'dash.exportDone': 'Файл готов (демо)',
    'dash.th.guest': 'Гость', 'dash.th.answer': 'Ответ', 'dash.th.plus': 'Спутник', 'dash.th.menu': 'Меню', 'dash.th.received': 'Получен',
    'dash.pill.yes': 'Придёт', 'dash.pill.yesPl': 'Придут', 'dash.pill.no': 'Не сможет', 'dash.pill.wait': 'Ждём',
    'dash.menu1': 'Рыба', 'dash.menu2': 'Вегетарианское', 'dash.menu4': 'Мясо, детское', 'dash.time1': 'вчера, 21:14', 'dash.time2': 'вчера, 18:02', 'dash.time3': '2 дня назад', 'dash.time4': '3 дня назад', 'dash.remind': 'напомнить', 'dash.family': 'Семья Лопес',
    'how.eyebrow': 'Как это работает', 'how.title': 'Три шага до готовой ссылки',
    'how.s1.t': 'Выберите шаблон', 'how.s1.d': 'Откройте любой дизайн и начните редактировать сразу, без привязки карты.', 'how.s2.t': 'Заполните детали', 'how.s2.d': 'Имена, дата, место, расписание дня, дресс-код, вопросы анкеты, музыка и фотографии.', 'how.s3.t': 'Опубликуйте ссылку', 'how.s3.d': 'Оплатите публикацию, получите короткую ссылку и QR-код. Отправляйте гостям и следите за ответами.',
    'price.eyebrow': 'Стоимость', 'price.title': 'Платите один раз, и только за результат', 'price.lead': 'Собирайте и переделывайте приглашение сколько угодно. Оплата нужна в момент публикации готовой ссылки.',
    'price.free.tag': 'Создание', 'price.free.sum': '0 €', 'price.free.1': 'Все шаблоны и редактор без ограничений', 'price.free.2': 'Предпросмотр на телефоне и компьютере', 'price.free.3': 'Черновик хранится в личном кабинете', 'price.free.4': 'Можно вернуться и доделать в любой момент', 'price.free.cta': 'Начать бесплатно',
    'price.pub.tag': 'Публикация', 'price.pub.sum': '29 €', 'price.pub.unit': 'разово, за одно приглашение', 'price.pub.1': 'Короткая ссылка и QR-код', 'price.pub.2': 'RSVP-анкета, карта, музыка', 'price.pub.3': 'Личный кабинет с ответами и выгрузкой в Excel', 'price.pub.4': 'Правки после публикации без доплат', 'price.pub.5': 'Приглашение доступно гостям до самой свадьбы и 6 месяцев после', 'price.pub.cta': 'Создать приглашение', 'price.pub.fine': 'Цена указана ориентировочно и настраивается перед запуском.',
    'faq.eyebrow': 'Частые вопросы', 'faq.title': 'Что ещё спрашивают пары',
    'faq.q1': 'Нужно ли гостям что-то устанавливать?', 'faq.a1': 'Нет. Приглашение открывается по ссылке или QR-коду в любом браузере на телефоне и компьютере. Ответить на анкету можно без регистрации.',
    'faq.q2': 'Можно ли изменить приглашение после публикации?', 'faq.a2': 'Да. Текст, время, фотографии и вопросы анкеты меняются в редакторе, ссылка остаётся прежней, гости увидят обновлённую версию.',
    'faq.q3': 'Как отправлять приглашение?', 'faq.a3': 'Как удобно: ссылкой в мессенджерах и по почте, QR-кодом на печатных карточках или персональными ссылками для каждого гостя, чтобы имя подставлялось автоматически.',
    'faq.q4': 'Что попадает в Excel?', 'faq.a4': 'Имя гостя, ответ, количество спутников, выбор меню, комментарий и время ответа. Файл можно отправить ресторану или ведущему без правок.',
    'faq.q5': 'Можно ли сделать приглашение на нескольких языках?', 'faq.a5': 'Да. Приглашение показывается на языке гостя: испанском, английском, итальянском, португальском, французском, немецком или русском, и переключается одним касанием.',
    'final.title': 'Начните с шаблона, остальное мы уже продумали', 'final.lead': 'Создание бесплатно. Оплата только при публикации готовой ссылки.', 'final.cta': 'Создать приглашение',
    'footer.copy': 'Копировать', 'footer.copied': 'Скопировано', 'footer.rights': '© 2026 Invitalia.co · Smart Invitations',

    'ed.title': 'Редактор приглашения', 'ed.status.unsaved': 'Черновик не сохранён', 'ed.status.saving': 'Сохраняю…', 'ed.status.saved': 'Сохранено {time}', 'ed.status.savedCloud': 'Сохранено в облаке {time}', 'ed.status.offline': 'Сервер не подключён: сохраняется в этом браузере', 'ed.status.error': 'Не удалось сохранить',
    'ed.import': 'Импорт', 'ed.export': 'Экспорт', 'ed.save': 'Сохранить', 'ed.publish': 'Опубликовать', 'ed.published': 'Опубликовано', 'ed.openGuest': 'Открыть как гость',
    'ed.sec.template': 'Шаблон', 'ed.sec.couple': 'Пара', 'ed.sec.couple.sub': 'Имена', 'ed.sec.when': 'Дата и место', 'ed.sec.when.sub': 'Когда и где', 'ed.sec.program': 'Программа дня', 'ed.sec.rsvp': 'RSVP-анкета', 'ed.sec.rsvp.sub': 'Ответы', 'ed.sec.music': 'Музыка', 'ed.sec.music.sub': 'Настроение', 'ed.sec.link': 'Ссылка', 'ed.sec.link.sub': 'Адрес приглашения', 'ed.sec.responses': 'Ответы гостей', 'ed.sec.lang': 'Язык приглашения', 'ed.sec.lang.sub': 'По умолчанию для гостей',
    'ed.lang.hint': 'Гости видят приглашение на этом языке и могут переключить его одним касанием.',
    'ed.f.name1': 'Первое имя', 'ed.f.name2': 'Второе имя', 'ed.f.greeting': 'Приветствие', 'ed.f.date': 'Дата', 'ed.f.time': 'Начало', 'ed.f.venue': 'Место', 'ed.f.address': 'Адрес', 'ed.f.map': 'Ссылка на карту', 'ed.f.map.hint': 'Кнопка «Как добраться» откроет эту ссылку в навигаторе гостя.', 'ed.f.dress': 'Дресс-код',
    'ed.prog.add': '+ Добавить пункт', 'ed.prog.time': 'Время', 'ed.prog.what': 'Что происходит', 'ed.prog.del': 'Удалить', 'ed.prog.count.one': '{n} пункт', 'ed.prog.count.few': '{n} пункта', 'ed.prog.count.many': '{n} пунктов', 'ed.prog.count.other': '{n} пунктов',
    'ed.f.q': 'Вопрос', 'ed.f.deadline': 'Ответить до', 'ed.t.plusone': 'Спросить о спутнике', 'ed.t.menu': 'Выбор меню', 'ed.f.menu': 'Варианты меню через запятую', 'ed.t.comment': 'Поле для пожеланий',
    'ed.t.music': 'Включать музыку при открытии', 'ed.f.track': 'Название композиции', 'ed.music.hint': 'Файл мелодии загружается при публикации. В черновике показывается только название.',
    'ed.f.slug': 'Короткая ссылка', 'ed.slug.hint': 'Только латиница, цифры и дефис. Ссылка и QR-код станут активны после публикации.',
    'ed.resp.hint': 'Сюда приходят настоящие ответы гостей после публикации. Ответы из предпросмотра сохраняются как тестовые.', 'ed.resp.csv': 'Скопировать как CSV', 'ed.resp.excel': 'Скачать Excel (CSV)', 'ed.resp.clear': 'Очистить тестовые', 'ed.resp.refresh': 'Обновить', 'ed.resp.empty': 'Пока нет ответов. Отправьте тестовый ответ из предпросмотра.', 'ed.resp.count.one': '{n} ответ', 'ed.resp.count.few': '{n} ответа', 'ed.resp.count.many': '{n} ответов', 'ed.resp.count.other': '{n} ответов', 'ed.resp.test': 'тест',
    'ed.footnote': 'Черновик сохраняется автоматически. При подключённом сервере он сохраняется и в облаке; «Экспорт» выгружает все данные в JSON для папки INVITALIA.',
    'ed.preview.label': 'Так увидят гости', 'ed.dev.phone': 'Телефон', 'ed.dev.tablet': 'Планшет',
    'ed.def.greeting': 'Мы будем счастливы разделить этот день с вами', 'ed.def.prog1': 'Церемония', 'ed.def.prog2': 'Аперитив в саду', 'ed.def.prog3': 'Ужин и танцы', 'ed.def.dress': 'Элегантный вечерний, пастельные оттенки', 'ed.def.q': 'Вы придёте?', 'ed.def.menu': 'Мясо, Рыба, Вегетарианское',
    'pub.title': 'Публикация приглашения', 'pub.lead': 'Проверьте ссылку. После оплаты она станет активной, а QR-код можно будет скачать для печатных карточек.', 'pub.copy': 'Копировать', 'pub.copyQr': 'Скачать QR',
    'pub.f1': 'RSVP-анкета, карта проезда, музыка', 'pub.f2': 'Ответы в личном кабинете и выгрузка в Excel', 'pub.f3': 'Правки после публикации без доплат', 'pub.f4': 'Доступ гостям до свадьбы и 6 месяцев после',
    'pub.unit': 'разово, за одно приглашение', 'pub.back': 'Вернуться', 'pub.pay': 'Оплатить и опубликовать', 'pub.update': 'Сохранить изменения', 'pub.redirect': 'Открываю безопасную оплату…',
    'pub.noteMock': 'Тестовый режим: оплата не подключена, приглашение публикуется сразу.', 'pub.notePublished': 'Приглашение уже опубликовано ({date}). Изменения применяются при сохранении, без повторной оплаты.', 'pub.noteOffline': 'Сервер не подключён: настоящая публикация и оплата требуют сервера INVITALIA.', 'pub.qrLater': 'QR появится после публикации', 'pub.stripe': 'Безопасная оплата картой через Stripe.',
    'io.exportTitle': 'Экспорт данных', 'io.importTitle': 'Импорт данных', 'io.exportText': 'Все данные приглашения в формате JSON. Скачайте файл или скопируйте текст и сохраните в папку INVITALIA.', 'io.importText': 'Вставьте сохранённый JSON или выберите файл invitalia-….json.',
    'io.close': 'Закрыть', 'io.copy': 'Копировать JSON', 'io.pick': 'Выбрать файл…', 'io.apply': 'Загрузить в редактор', 'io.download': 'Скачать файл',
    'toast.saved': 'Черновик сохранён', 'toast.copied': 'Скопировано', 'toast.csv': 'CSV скопирован', 'toast.json': 'JSON скопирован', 'toast.loaded': 'Данные загружены', 'toast.badJson': 'Не удалось прочитать JSON', 'toast.fill': 'Заполните {fields}', 'toast.published': 'Приглашение опубликовано', 'toast.copyFail': 'Скопируйте текст вручную', 'toast.serverError': 'Ошибка сервера, попробуйте ещё раз', 'toast.paymentOk': 'Оплата подтверждена, приглашение опубликовано', 'toast.paymentPending': 'Оплата пока не подтверждена', 'toast.paymentCanceled': 'Оплата отменена', 'toast.linkCopied': 'Ссылка скопирована',
    'fill.names': 'имена', 'fill.date': 'дату', 'fill.slug': 'ссылку',
    'g.directions': 'Как добраться', 'g.dress': 'Дресс-код', 'g.deadline': 'Ответьте, пожалуйста, до {date}', 'g.yes': 'С радостью', 'g.no': 'Не смогу', 'g.name': 'Ваше имя', 'g.alone': 'Приду один / одна', 'g.plus1': 'Со спутником', 'g.plus2': 'Нас будет трое', 'g.menuPick': 'Выберите меню', 'g.comment': 'Пожелания или аллергии', 'g.send': 'Отправить ответ', 'g.thanksYes': 'Спасибо! Ваш ответ отправлен паре.', 'g.thanksNo': 'Жаль, что не получится. Ответ отправлен.', 'g.rsvpDefault': 'Вы придёте?', 'g.music': 'Музыка',
    'g.loading': 'Открываю приглашение…', 'g.notFound': 'Приглашение не найдено. Проверьте ссылку.', 'g.notPublished': 'Это приглашение ещё не опубликовано.', 'g.closed': 'Срок ответа истёк. Напишите паре напрямую.', 'g.error': 'Не удалось отправить ответ. Попробуйте ещё раз.', 'g.nameRequired': 'Напишите, пожалуйста, ваше имя', 'g.poweredBy': 'Создано в Invitalia.co', 'g.play': 'Включить музыку', 'g.pause': 'Пауза'
  };

  // ---------- engine ----------
  var current = detect();
  function detect() {
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    var stored = null; try { stored = localStorage.getItem('invitalia-lang'); } catch (e) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    var cand = [fromUrl, stored, nav.slice(0, 2).toLowerCase(), 'es'];
    for (var i = 0; i < cand.length; i++) if (cand[i] && LANGS.indexOf(cand[i]) >= 0) return cand[i];
    return 'es';
  }
  function t(key, vars) {
    var s = (D[current] && D[current][key]) || (D.es && D.es[key]);
    if (s == null) return key;
    if (vars) for (var k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }
  function pluralCat(n, lang) {
    n = Math.abs(Number(n) || 0);
    if (lang === 'ru') { var m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return 'one'; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'few'; return 'many'; }
    if (lang === 'fr' || lang === 'pt') return n === 0 || n === 1 ? 'one' : 'other';
    return n === 1 ? 'one' : 'other';
  }
  function nf(key, n) {
    var cat = pluralCat(n, current);
    var dict = D[current] || D.es;
    var s = dict[key + '.' + cat] || dict[key + '.other'] || D.es[key + '.other'] || key;
    return s.split('{n}').join(n);
  }
  function apply(root) {
    root = root || document;
    var sel = function (attr) { return root.querySelectorAll('[' + attr + ']'); };
    sel('data-i18n').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    sel('data-i18n-html').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    sel('data-i18n-placeholder').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'))); });
    sel('data-i18n-aria').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    sel('data-i18n-title').forEach(function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
    var titleKey = document.documentElement.getAttribute('data-title-key');
    if (titleKey) document.title = t(titleKey);
    document.documentElement.lang = current;
    sel('data-lang-switch').forEach(function (s) { if (s.tagName === 'SELECT') { if (!s.options.length) LANGS.forEach(function (l) { var o = document.createElement('option'); o.value = l; o.textContent = NAMES[l]; s.appendChild(o); }); s.value = current; s.setAttribute('aria-label', t('lang.label')); } });
    document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang: current } }));
  }
  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem('invitalia-lang', lang); } catch (e) {}
    apply();
  }
  function fmtDate(iso, opts) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(LOCALE[current] || 'es-ES', opts || { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function fmtTime(d) { return new Date(d).toLocaleTimeString(LOCALE[current] || 'es-ES', { hour: '2-digit', minute: '2-digit' }); }
  function fmtDateTime(d) { return new Date(d).toLocaleString(LOCALE[current] || 'es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  function money(amount, currency) { try { return new Intl.NumberFormat(LOCALE[current] || 'es-ES', { style: 'currency', currency: (currency || 'EUR').toUpperCase(), maximumFractionDigits: amount % 100 ? 2 : 0 }).format(amount / 100); } catch (e) { return (amount / 100) + ' ' + (currency || 'EUR').toUpperCase(); } }

  document.addEventListener('change', function (e) { if (e.target && e.target.matches && e.target.matches('[data-lang-switch]')) set(e.target.value); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { apply(); }); else apply();

  global.I18N = { t: t, n: nf, apply: apply, set: set, get lang() { return current; }, langs: LANGS, names: NAMES, locale: function () { return LOCALE[current]; }, fmtDate: fmtDate, fmtTime: fmtTime, fmtDateTime: fmtDateTime, money: money, dict: D };
})(window);
