// Runtime configuration for the static pages.
// api: base URL of the INVITALIA server. Empty string = same origin (when the Node server also serves the site).
// If the site is hosted on GitHub Pages and the server elsewhere, put the server URL here, e.g. "https://api.invitalia.co".
window.INVITALIA = window.INVITALIA || {};
window.INVITALIA.api = window.INVITALIA.api || '';
window.INVITALIA.defaultLang = 'es';
window.INVITALIA.languages = ['es', 'en', 'it', 'pt', 'fr', 'de', 'ru'];
