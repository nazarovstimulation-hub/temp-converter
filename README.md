# Álbum QR para eventos — sitio web en español

Landing page estática (HTML + CSS + JS, sin dependencias) de un servicio de álbum de fotos por código QR para bodas y eventos: los invitados escanean, suben fotos y vídeos sin app, con búsqueda por selfie, pantalla en directo (Live Wall) y descarga en ZIP.

## Estructura

```
site/
  index.html   # página completa en español
  styles.css   # estilos (tokens de color en :root)
  app.js       # calculador de planes, mockups animados, menú, FAQ
  brand.js     # ← nombre de marca, contacto, precios y planes
  assets/      # logo.png, mark.png, favicon.png, apple-touch-icon.png
docs/
  analisis-mercado-es.md   # análisis del mercado español y competidores (en ruso)
```

## Personalizar la marca

Edita `site/brand.js`: nombre, eslogan, dominio, correo, WhatsApp, ciudad, fotos gratis y la lista de planes (precio, fotos, GB, meses, Live Wall). Toda la página se actualiza sola. El tema de color se elige con `theme` en `site/brand.js` (por defecto `burdeos`: burdeos, champán y oro; también `fiesta`, `oro`, `noche`, `rosa`, `negro`, `esmeralda`, `medianoche`). Para previsualizar otro sin cambiar el archivo: `index.html?theme=oro`. Los tokens de cada tema están al final de `site/styles.css`.

## Ver en local

```bash
cd site && python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar

Es un sitio estático: sirve la carpeta `site/` en GitHub Pages, Netlify, Vercel o cualquier hosting. Para GitHub Pages, configura la publicación desde la carpeta `/site` de la rama principal (o copia su contenido a `/docs`).

## Pendiente antes de lanzar

- Conectar los botones «Crear álbum» / «Elegir plan» al backend o a la pasarela de pago.
- Sustituir las opiniones de ejemplo por testimonios reales.
- Redactar aviso legal, política de privacidad (incluida la base jurídica del reconocimiento facial, RGPD art. 9) y cookies; hoy son enlaces vacíos.

---

El repositorio conserva además la utilidad original `temp_converter.py` (conversión Celsius/Fahrenheit) con sus tests: `pip install -r requirements.txt && pytest`.
