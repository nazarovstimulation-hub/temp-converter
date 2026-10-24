# Invitalia (invitalia.co) + temp converter

Este repositorio contiene dos cosas:

1. **`temp_converter.py`** — utilidad Python para convertir temperaturas (ver abajo).
2. **`site/`** — sitio estático en español de **Invitalia**, invitaciones digitales para bodas, cumpleaños, eventos de empresa y cualquier celebración (landing + constructor + invitación de ejemplo).

## Sitio Invitalia (`site/`)

| Página | Qué es |
|---|---|
| `site/index.html` | Landing: cómo funciona, funciones, plantillas, precios, FAQ |
| `site/crear.html` | Constructor con vista previa en vivo y enlace para compartir |
| `site/invitacion.html` | La invitación que ven los invitados (acepta parámetros en la URL) |

Para verlo en local:

```bash
cd site && python3 -m http.server 8080
# abrir http://localhost:8080
```

**Marca:** nombre, dominio, email, WhatsApp e Instagram están en `site/assets/js/brand.js`. Logo y favicon en `site/assets/img/logo.svg` y `site/assets/img/mark.svg`.

**Tipos de evento:** `?tipo=boda|cumple|empresa|comunion|despedida|fiesta` en `crear.html` e `invitacion.html`. Cada tipo cambia textos, programa del día y qué secciones se muestran (ceremonia, dress code, autobús, regalos).

**Plantillas:** `botanica`, `clasica`, `minimal`, `mediterranea`, `boho`, `nocturna` — se eligen con `?plantilla=...` en `invitacion.html`.

El sitio no tiene backend: las confirmaciones de asistencia se guardan en `localStorage` como demo. Para producción hace falta conectar el formulario RSVP a una base de datos y añadir pasarela de pago.

Análisis del mercado español y posicionamiento: [`docs/analisis-mercado-es.md`](docs/analisis-mercado-es.md).

Se puede publicar directamente en GitHub Pages (carpeta `site/`), Netlify o Vercel sin build.

## Temp converter

```python
from temp_converter import celsius_to_fahrenheit, fahrenheit_to_celsius

celsius_to_fahrenheit(0)    # 32.0
fahrenheit_to_celsius(212)  # 100.0
```

Tests:

```bash
pip install -r requirements.txt
pytest
```
