/* INVITALIA template catalogue: one entry per cover photo in assets/covers/.
   Used by the landing gallery, the editor swatches and the invitation renderer (theme + cover).
   Works in the browser (window.INVITALIA_TEMPLATES) and in Node (module.exports) so tests can read it. */
(function (root, factory) {
  var T = factory();
  if (typeof module === 'object' && module.exports) module.exports = T;
  root.INVITALIA_TEMPLATES = T;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  // cat: classic | minimal | oldmoney | italia | papel | destinos    theme: a .t-<theme> class in invitation.css
  var LIST = [
    { id: 'felicidad', file: '01-felicidad', name: 'Felicidad', cat: 'classic',  theme: 'palazzo' },
    { id: 'anillos',   file: '02-anillos',   name: 'Anillos',   cat: 'minimal',  theme: 'blush' },
    { id: 'viaje',     file: '03-viaje',     name: 'Viaje',     cat: 'destinos', theme: 'amalfi' },
    { id: 'nuit',      file: '04-nuit',      name: 'Nuit',      cat: 'classic',  theme: 'azul' },
    { id: 'jardin',    file: '05-jardin',    name: 'Jardín',    cat: 'italia',   theme: 'botanica' },
    { id: 'oliva',     file: '06-oliva',     name: 'Oliva',     cat: 'italia',   theme: 'heritage' },
    { id: 'azur',      file: '07-azur',      name: 'Azur',      cat: 'papel',    theme: 'linea' },
    { id: 'sepia',     file: '08-sepia',     name: 'Sepia',     cat: 'papel',    theme: 'champagne' },
    { id: 'burdeos',   file: '09-burdeos',   name: 'Burdeos',   cat: 'oldmoney', theme: 'burdeos' },
    { id: 'rosal',     file: '10-rosal',     name: 'Rosal',     cat: 'oldmoney', theme: 'heritage' },
    { id: 'belair',    file: '11-belair',    name: 'Bel Air',   cat: 'papel',    theme: 'palazzo' },
    { id: 'cisnes',    file: '12-cisnes',    name: 'Cisnes',    cat: 'destinos', theme: 'azul' },
    { id: 'rubi',      file: '13-rubi',      name: 'Rubí',      cat: 'papel',    theme: 'burdeos' },
    { id: 'mutuo',     file: '14-mutuo',     name: 'Mutuo',     cat: 'oldmoney', theme: 'mono' },
    { id: 'salon',     file: '15-salon',     name: 'Salón',     cat: 'papel',    theme: 'palazzo' },
    { id: 'colores',   file: '16-colores',   name: 'Colores',   cat: 'destinos', theme: 'azul' },
    { id: 'lettera',   file: '17-lettera',   name: 'Lettera',   cat: 'minimal',  theme: 'linea' },
    { id: 'corazon',   file: '18-corazon',   name: 'Corazón',   cat: 'classic',  theme: 'botanica' },
    { id: 'promesa',   file: '19-promesa',   name: 'Promesa',   cat: 'minimal',  theme: 'champagne' },
    { id: 'sienna',    file: '20-sienna',    name: 'Sienna',    cat: 'minimal',  theme: 'mono' },
    { id: 'editorial', file: '21-editorial', name: 'Editorial', cat: 'minimal',  theme: 'linea' },
    { id: 'alibi',     file: '22-alibi',     name: 'Alibi',     cat: 'oldmoney', theme: 'champagne' },
    { id: 'como',      file: '23-como',      name: 'Como',      cat: 'destinos', theme: 'azul' },
    { id: 'provence',  file: '24-provence',  name: 'Provence',  cat: 'destinos', theme: 'lavanda' },
    { id: 'maison',    file: '25-maison',    name: 'Maison',    cat: 'oldmoney', theme: 'champagne' },
    { id: 'noir',      file: '26-noir',      name: 'Noir',      cat: 'destinos', theme: 'mono' },
    { id: 'riviera',   file: '27-riviera',   name: 'Riviera',   cat: 'italia',   theme: 'amalfi' },
    { id: 'luna',      file: '28-luna',      name: 'Luna',      cat: 'minimal',  theme: 'blush' },
    { id: 'roma',      file: '29-roma',      name: 'Roma',      cat: 'oldmoney', theme: 'burdeos' },
    { id: 'ivory',     file: '30-ivory',     name: 'Ivory',     cat: 'classic',  theme: 'palazzo' },
    { id: 'verona',    file: '31-verona',    name: 'Verona',    cat: 'italia',   theme: 'botanica' },
    { id: 'camelia',   file: '32-camelia',   name: 'Camelia',   cat: 'italia',   theme: 'amalfi' },
    { id: 'amalfi',    file: '33-amalfi',    name: 'Amalfi',    cat: 'oldmoney', theme: 'noir' },
    { id: 'intercambio', file: '34-intercambio', name: 'Intercambio de anillos', cat: 'classic', theme: 'acuarela' }
  ];
  var CATS = ['classic', 'minimal', 'oldmoney', 'italia', 'papel', 'destinos'];
  // Template ids from the first version of the site map to the same photo under its new name.
  var LEGACY = { palazzo: 'ivory', linea: 'luna', heritage: 'roma', botanica: 'verona' };
  var DEFAULT = 'intercambio';
  var byId = {};
  LIST.forEach(function (x) { x.cover = 'assets/covers/' + x.file + '.webp'; x.mini = 'assets/covers/' + x.file + '-mini.webp'; byId[x.id] = x; });
  function resolve(id) { id = LEGACY[id] || id; return byId[id] ? id : DEFAULT; }
  function get(id) { return byId[resolve(id)]; }
  return { list: LIST, cats: CATS, ids: LIST.map(function (x) { return x.id; }), legacy: LEGACY, default: DEFAULT, resolve: resolve, get: get };
});
