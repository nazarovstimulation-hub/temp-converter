/*
 * Configuración de marca.
 * Cambia aquí el nombre, el eslogan y los datos de contacto:
 * todo el sitio se actualiza automáticamente (textos con data-brand,
 * <title>, meta description y pie de página).
 */
window.BRAND = {
  name: "FotoFiesta",            // ← nombre de tu marca
  tagline: "El álbum de tu evento, hecho por tus invitados",
  domain: "fotofiesta.es",       // ← tu dominio
  email: "hola@fotofiesta.es",   // ← correo de contacto
  whatsapp: "+34 600 000 000",   // ← teléfono / WhatsApp
  city: "Madrid, España",
  freePhotos: 50,                // fotos gratis por álbum
  // Precios en euros, pago único (IVA incluido). Ajusta a tu estrategia.
  plans: [
    { id: "gratis",      name: "Gratis",      price: 0,  photos: 50,   gb: 0.5, guests: 2,   liveWall: false, selfie: true,  months: 1  },
    { id: "basico",      name: "Básico",      price: 19, photos: 500,  gb: 5,   guests: 20,  liveWall: false, selfie: true,  months: 6  },
    { id: "celebracion", name: "Celebración", price: 39, photos: 1500, gb: 20,  guests: 60,  liveWall: true,  selfie: true,  months: 12, featured: true },
    { id: "gran-evento", name: "Gran evento", price: 69, photos: 5000, gb: 60,  guests: 200, liveWall: true,  selfie: true,  months: 24 }
  ],
  // Fotos estimadas por invitado (para el calculador de planes)
  photosPerGuest: 25
};
