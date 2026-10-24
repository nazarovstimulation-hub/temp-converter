# Despliegue en Render y dominio invitalia.co (Wix)

Tiempo estimado: 10 minutos de clics, más la propagación DNS (de 10 minutos a unas horas).

## 1. Crear el servicio en Render

1. Entra en https://render.com con tu cuenta (o crea una, el plan Starter cuesta unos 7 $/mes; el plan gratuito no permite disco persistente y perdería la base de datos en cada reinicio).
2. Abre el enlace de despliegue con el Blueprint del repositorio:

   **https://render.com/deploy?repo=https://github.com/nazarovstimulation-hub/temp-converter**

   La primera vez Render pedirá conectar tu cuenta de GitHub y dar acceso al repositorio `temp-converter`.
3. Render lee `render.yaml` de la raíz del repositorio y muestra el servicio **invitalia**. Te pedirá dos valores:
   - `STRIPE_SECRET_KEY`: déjalo vacío por ahora si quieres probar en modo de prueba, o pega la clave de Stripe (paso 3).
   - `STRIPE_WEBHOOK_SECRET`: vacío por ahora; se rellena en el paso 3.
4. Pulsa **Apply**. Render construye la imagen Docker (2–4 minutos) y arranca el servidor.
   Comprueba que `https://invitalia.onrender.com/api/health` responde `{"ok":true,...}`
   (si el nombre `invitalia` estaba ocupado, Render habrá añadido un sufijo; usa la URL que muestre el panel).

> El Blueprint despliega la rama `claude/invitalia-logo-concepts-jukw3p`. Cuando esa rama se fusione en `main`,
> cambia `branch: main` en `render.yaml` (o en Settings → Build & Deploy del servicio).

## 2. Conectar el dominio

### En Render

1. Servicio **invitalia** → **Settings** → **Custom Domains** → **Add Custom Domain**.
2. Añade `invitalia.co` y después `www.invitalia.co`.
3. Render muestra los registros DNS que necesita. Normalmente son:

   | Tipo | Nombre | Valor |
   |---|---|---|
   | A | `@` | `216.24.57.1` |
   | CNAME | `www` | `invitalia.onrender.com` |

   Usa siempre los valores que muestre tu panel de Render; si difieren de esta tabla, mandan los del panel.

### En Wix

1. https://manage.wix.com → **Domains** → `invitalia.co` → menú **⋯** → **Manage DNS Records**.
2. Si el dominio tiene conectado un sitio de Wix, desconéctalo primero (Domains → ⋯ → *Disconnect from site*); si no, Wix mantendrá sus propios registros A y el dominio seguirá apuntando a Wix.
3. En la sección **A (Host)** borra los registros existentes de `@` y añade uno con el valor `216.24.57.1`.
4. En **CNAME (Aliases)** borra el registro `www` existente y añade `www` → `invitalia.onrender.com`.
5. Guarda. Wix tarda entre minutos y un par de horas en propagar.

### Comprobar

En Render, Custom Domains pasará de *Pending* a *Verified* y emitirá el certificado HTTPS automáticamente.
Desde tu ordenador (con Node 22 instalado):

```bash
cd INVITALIA/server
node check-deploy.js invitalia.co
```

El script comprueba los registros DNS, el certificado, la API y la página del invitado, y te dice qué falta.

## 3. Activar los pagos con Stripe

1. https://dashboard.stripe.com → **Developers** → **API keys** → copia la **Secret key** (`sk_live_…`, o `sk_test_…` para probar).
2. En Render → servicio invitalia → **Environment** → `STRIPE_SECRET_KEY` = la clave → **Save**. El servicio se reinicia.
3. Stripe → **Developers** → **Webhooks** → **Add endpoint**:
   - URL: `https://invitalia.co/api/stripe/webhook`
   - Eventos: `checkout.session.completed` y `checkout.session.async_payment_succeeded`
4. Copia el **Signing secret** (`whsec_…`) a `STRIPE_WEBHOOK_SECRET` en Render → Save.
5. Precio: `PRICE_AMOUNT` (céntimos) y `PRICE_CURRENCY` en Environment. Por defecto 2900 = 29 €.
6. Prueba: abre `https://invitalia.co/editor.html`, pulsa **Publicar** → **Pagar y publicar**; con una clave de prueba usa la tarjeta `4242 4242 4242 4242`.

## 4. Después del lanzamiento

- Copias de seguridad: Render → servicio → **Disks** permite instantáneas del disco; o descarga `/data/invitalia.db` periódicamente desde la Shell del servicio.
- Logs: pestaña **Logs** del servicio. Cada error se registra con fecha, método y ruta.
- Para cambiar textos o plantillas basta con hacer `git push`: Render redespliega solo (`autoDeploy: true`).
