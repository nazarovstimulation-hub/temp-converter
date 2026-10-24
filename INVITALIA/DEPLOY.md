# Despliegue gratuito en Cloudflare y dominio invitalia.co (comprado en Wix)

Todo el servicio (sitio, editor, página del invitado, API y base de datos) corre en **un Worker de Cloudflare** con base **D1**.
Plan gratuito: 100 000 peticiones al día, sin suspensión por inactividad, HTTPS y dominio propio incluidos.

Tiempo: unos 15 minutos de clics + propagación DNS (de minutos a unas horas).

## 1. Dar acceso a GitHub para que despliegue solo

El repositorio ya tiene el workflow `.github/workflows/cloudflare.yml`: en cada `git push` ejecuta las pruebas y despliega.
Solo necesita dos secretos.

1. **Account ID.** En https://dash.cloudflare.com → menú **Workers & Pages** → a la derecha aparece *Account ID*. Cópialo.
2. **API token.** Menú de usuario (arriba a la derecha) → **My Profile** → **API Tokens** → **Create Token** →
   **Create Custom Token**. Nombre `invitalia-deploy`, permisos:
   - Account → **Workers Scripts** → Edit
   - Account → **D1** → Edit
   - Account → **Account Settings** → Read
   - Account → **Workers Routes** → Edit (solo si vas a añadir el dominio desde `wrangler.toml`; desde el panel no hace falta)

   Continue to summary → Create Token → copia el token (se muestra una sola vez).
3. En GitHub: https://github.com/nazarovstimulation-hub/temp-converter/settings/secrets/actions → **New repository secret**:
   - `CLOUDFLARE_ACCOUNT_ID` = el Account ID
   - `CLOUDFLARE_API_TOKEN` = el token
4. Lanza el despliegue: pestaña **Actions** → **Deploy INVITALIA to Cloudflare** → **Run workflow**.
   El workflow crea la base D1 `invitalia`, aplica el esquema y publica el Worker. Al final, en el paso *Deploy Worker*,
   wrangler imprime la URL del tipo `https://invitalia.<tu-subdominio>.workers.dev`. Ábrela: el sitio ya funciona
   (pagos en modo de prueba mientras no haya clave de Stripe).

> Alternativa sin GitHub Actions, desde tu ordenador con Node 22:
> `cd INVITALIA/cloudflare && npm install && npx wrangler login && npm run db:create && npm run deploy`

## 2. Pasar el dominio a Cloudflare (DNS) y conectarlo al Worker

Cloudflare gestiona los DNS del dominio; Wix sigue siendo el registrador (el dominio no se transfiere, solo se cambian los servidores de nombres).

### En Cloudflare

1. Panel → **Add a domain** (o *Websites → Add a site*) → escribe `invitalia.co` → plan **Free** → Continue.
2. Cloudflare escanea los registros existentes. Borra los registros **A** y **CNAME** que apunten a Wix (si los hay) y continúa.
3. Cloudflare muestra **dos servidores de nombres**, del tipo `ana.ns.cloudflare.com` y `rob.ns.cloudflare.com`. Déjalos a la vista.

### En Wix

1. https://manage.wix.com → **Domains** → `invitalia.co` → menú **⋯** → **Manage DNS** o **Advanced** → **Name servers** (en Wix: *Transfer away / Use custom name servers*; la opción exacta se llama **"Change name servers"**).
2. Si el dominio está conectado a un sitio de Wix, desconéctalo antes (**⋯ → Disconnect from site**).
3. Elige **Custom name servers** y pega los dos de Cloudflare. Guarda.
4. Vuelve a Cloudflare y pulsa **Check nameservers**. El estado pasará a *Active* cuando se propague (normalmente menos de una hora; puede tardar hasta 24 h).

### Conectar el Worker al dominio

Cuando el dominio esté *Active* en Cloudflare:

1. **Workers & Pages** → **invitalia** → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `invitalia.co` → Add.
2. Repite con `www.invitalia.co`.

Cloudflare crea los registros DNS y el certificado HTTPS automáticamente. En un par de minutos https://invitalia.co abre el sitio.

### Comprobar

```bash
cd INVITALIA/server
node check-deploy.js invitalia.co
```

El script comprueba los servidores de nombres, los registros DNS, el certificado, la API y la página del invitado.

## 3. Activar los pagos con Stripe

1. https://dashboard.stripe.com → **Developers → API keys** → copia la **Secret key** (`sk_live_…`; `sk_test_…` para pruebas con la tarjeta `4242 4242 4242 4242`).
2. **Developers → Webhooks → Add endpoint**: URL `https://invitalia.co/api/stripe/webhook`, eventos
   `checkout.session.completed` y `checkout.session.async_payment_succeeded`. Copia el **Signing secret** (`whsec_…`).
3. Guarda las dos claves como secretos del Worker, de una de estas formas:
   - en GitHub: secretos `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` del repositorio y vuelve a ejecutar el workflow, o
   - en Cloudflare: Workers & Pages → invitalia → Settings → **Variables and Secrets** → Add → tipo *Secret*, o
   - en tu ordenador: `npx wrangler secret put STRIPE_SECRET_KEY` y `npx wrangler secret put STRIPE_WEBHOOK_SECRET`.
4. Precio: variables `PRICE_AMOUNT` (céntimos, 2900 = 29 €) y `PRICE_CURRENCY` en `cloudflare/wrangler.toml` (sección `[vars]`).
5. Prueba: https://invitalia.co/editor.html → **Publicar** → **Pagar y publicar**. Tras pagar vuelves al editor y la invitación aparece como publicada.

## 4. Operación

- **Logs en directo:** `cd INVITALIA/cloudflare && npx wrangler tail`, o Workers & Pages → invitalia → Logs.
- **Datos:** Workers & Pages → D1 → invitalia → pestaña *Console* permite consultas SQL; exportar: `npx wrangler d1 export invitalia --remote --output backup.sql`.
- **Cambios en el sitio o los textos:** `git push`; GitHub Actions redepliega en un minuto.
- **Límites del plan gratuito:** 100 000 peticiones/día al Worker, 5 millones de lecturas y 100 000 escrituras/día en D1. Una boda típica consume unos cientos.
