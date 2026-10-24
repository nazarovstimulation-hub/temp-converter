# INVITALIA.co

Invitaciones de boda digitales · Digital wedding invitations.
Interfaz en 7 idiomas: **español (principal)**, inglés, italiano, portugués, francés, alemán y ruso.

```
INVITALIA/
├── site/                      sitio estático (se puede abrir sin servidor)
│   ├── index.html             landing
│   ├── editor.html            editor con vista previa, guardado en la nube, publicación y pago
│   ├── guest.html             página pública de la invitación (RSVP de los invitados)
│   ├── 404.html
│   ├── CNAME                  dominio para GitHub Pages
│   └── assets/
│       ├── i18n.js            diccionarios de los 7 idiomas + motor de traducción
│       ├── invitation.js/.css renderizado compartido de la invitación (editor y página del invitado)
│       ├── config.js          URL de la API (vacía = mismo origen)
│       └── logo-*.jpg         logotipo: completo, símbolo, texto
├── server/                    backend Node.js sin dependencias (Node ≥ 22.13)
│   ├── server.js              API + sitio estático + SQLite + Stripe Checkout
│   ├── test.js                prueba de extremo a extremo de la API
│   ├── test-i18n.js           comprueba que todas las claves existen en los 7 idiomas
│   ├── .env.example           variables de entorno
│   └── Dockerfile
├── render.yaml                despliegue en Render.com con disco persistente
└── logos/                     10 conceptos iniciales de logotipo (SVG)
```

## Arrancar en local

```bash
cd INVITALIA/server
cp .env.example .env        # opcional
npm start                   # http://localhost:8787
npm test                    # pruebas de la API
node test-i18n.js           # cobertura de traducciones
```

Sin `STRIPE_SECRET_KEY` el servidor funciona en **modo de prueba**: «Pagar y publicar» publica al instante.

## Qué hace el backend

| Método | Ruta | Quién | Para qué |
|---|---|---|---|
| GET | `/api/health` | todos | estado, modo de pago, precio, idiomas |
| POST | `/api/invitations` | editor | crea un borrador y devuelve `id` + `editToken` (secreto del organizador) |
| GET / PUT | `/api/invitations/:id` | organizador (Bearer editToken) | leer / guardar el borrador |
| GET | `/api/invitations/:id/responses` | organizador | respuestas y recuento |
| GET | `/api/invitations/:id/responses.csv?lang=xx` | organizador | CSV para Excel (BOM UTF-8, `;`), cabeceras en el idioma elegido |
| POST | `/api/invitations/:id/checkout` | organizador | crea la sesión de Stripe Checkout y devuelve la URL de pago |
| POST | `/api/invitations/:id/checkout/verify` | organizador | confirma el pago al volver de Stripe (si el webhook no está configurado) |
| POST | `/api/stripe/webhook` | Stripe | `checkout.session.completed` → publica la invitación |
| GET | `/api/i/:slug` | invitados | datos públicos de una invitación publicada |
| POST | `/api/i/:slug/rsvp` | invitados | guarda la respuesta (límite 10 por IP y 10 min, valida plazo y campos) |
| GET | `/i/:slug` | invitados | página de la invitación |

Datos en SQLite (`DATABASE_PATH`), tablas `invitations`, `responses`, `payments`, `webhook_events`.
El `editToken` se guarda solo como hash; el editor lo conserva en el navegador y en el JSON exportado.

## Pagos con Stripe

1. En Stripe → Developers → API keys, copia la clave secreta a `STRIPE_SECRET_KEY`.
2. Developers → Webhooks → añade `https://TU-DOMINIO/api/stripe/webhook` con el evento `checkout.session.completed`
   y copia el `whsec_…` a `STRIPE_WEBHOOK_SECRET`.
3. Precio: `PRICE_AMOUNT` en céntimos (2900 = 29 €) y `PRICE_CURRENCY`.
   Stripe muestra el checkout en el idioma del cliente (`locale` se envía desde el editor).

## Despliegue

**Opción A, todo en un servidor (recomendada):** Render / Railway / Fly / cualquier VPS con Node 22.
`render.yaml` ya describe el servicio con disco persistente para SQLite. Pon `BASE_URL=https://invitalia.co`.

**Opción B, sitio en GitHub Pages + API aparte:** el workflow `.github/workflows/pages.yml` publica `site/`.
En `site/assets/config.js` escribe la URL del servidor en `window.INVITALIA.api` y añade el dominio del sitio a `CORS_ORIGINS` del servidor.
Las URLs bonitas `/i/slug` solo funcionan en el servidor; en Pages se usa `guest.html?slug=…`.

**Dominio en Wix:** Domains → invitalia.co → Manage DNS Records. Para Render añade el CNAME que te indique Render;
para GitHub Pages:

```
A      @     185.199.108.153
A      @     185.199.109.153
A      @     185.199.110.153
A      @     185.199.111.153
CNAME  www   nazarovstimulation-hub.github.io
```

## Idiomas

Todo el texto de la interfaz vive en `site/assets/i18n.js`. El idioma se detecta así: parámetro `?lang=`, elección guardada,
idioma del navegador, español. Cada invitación tiene su propio idioma por defecto para los invitados, que pueden cambiarlo
con un toque. Para añadir un idioma: copia el bloque `D.es`, tradúcelo, añade el código a `LANGS` y ejecuta `node server/test-i18n.js`.

## Pendiente antes del lanzamiento

- Precio definitivo y correo de contacto (ahora `hello@invitalia.co`).
- Subida del archivo de música (el editor guarda solo el título).
- Copias de seguridad de la base de datos SQLite (o migrar a Postgres si crece el volumen).
