# Raíz Tostadores · web en código

Proyecto de portfolio de **Mica** (diseñadora gráfica, FADU-UBA). Raíz Tostadores es una tostaduría de café de especialidad ficticia de Chacarita, CABA. La web ya está diseñada y funcionando en **Claude Design** (archivos `.dc.html`). Tu trabajo es pasarla a **código real, publicable en GitHub Pages**.

Mica entiende HTML, CSS y JS pero no los escribe a mano, y trabaja con ingenieros que van a leer este repo. Escribí código legible, con nombres claros, y respondele en español rioplatense (voseo), corto y directo.

## Regla n.º 1: tiene que quedar EXACTAMENTE igual

Lo dijo ella: «quiero que quede exactamente igual, así como lo veo en Claude Design, así tiene que quedar».

- **No toques ningún valor visual**: ni espaciados (aunque haya valores fuera de escala como 14, 22, 26, 30 o 34 px), ni colores, ni tamaños, ni tipografías, ni copy, ni animaciones.
- **No rediseñes, no «mejores», no normalices, no reordenes.** Si algo te parece mal, anotalo en `NOTAS.md` y no lo cambies.
- Copiá el HTML y el CSS de `referencia/claude-design/` tal cual. Lo único que se reemplaza es lo que es del runtime de Claude Design (ver abajo).
- La prueba de que quedó igual es objetiva: `herramientas/comparar.js` tiene que dar **0 píxeles de diferencia y el mismo alto** en cada página y cada ancho. Sin eso, no está terminado.

## Qué hay en esta carpeta

| Ruta | Qué es |
|---|---|
| `referencia/claude-design/*.dc.html` | **Fuente de verdad.** 5 páginas × 2 versiones: `Main` (Home), `Tienda`, `Ficha`, `Suscripcion`, `Cuenta`, y las `M-*` / `Mobile` |
| `referencia/claude-design/compartido.css` | CSS compartido por Tienda, Ficha, Suscripción y Cuenta (`<link href="/_blob/31e6d751…">`) |
| `referencia/claude-design/canvas.json` | Orden y tamaño de los tableros (solo informativo) |
| `referencia/assets/` | Logo, hoja, 5 tramas, 5 bolsas (mockups) y 6 fotos, con nombres legibles |
| `referencia/assets/mapa-blobs.json` | Equivalencia `/_blob/<hash>` → archivo. Las páginas apuntan a `/_blob/…`; hay que cambiarlas por estas rutas |
| `referencia/capturas/*.png` | Cómo se ve cada página renderizada por Claude Design, a 1440 y 390 px (página completa, sin animaciones) |
| `referencia/runtime/` | `dc-runtime.js` (el runtime de Claude Design), `formato-dc.md` y `SKILL-claude-design.md` (reglas del formato). Solo para **entender** cómo se lee un `.dc.html` |
| `referencia/contexto/proyecto.txt` | Brief del cliente ficticio (Martín), público, tono, alcance |
| `herramientas/` | `render-referencia.js` y `comparar.js` para verificar píxel a píxel |

Figma (opcional, solo consulta): archivo `N1zieoUdeyRh9s6bHmd5LL`, página «06b UI v2 — Web» (id `87:2`). La fuente de verdad visual es Claude Design, no Figma.

## Cómo se lee un `.dc.html`

Cada archivo es una página con un formato propio que **necesita el runtime de Claude Design** (por eso no se puede publicar tal cual):

- `<x-dc>…</x-dc>` envuelve el markup. Dentro, `<helmet>` contiene el `<link>` de Google Fonts y el `<style>` de la página (van al `<head>`).
- Dentro de `<x-dc>`, `{{variable}}` inserta valores calculados (también dentro de atributos y de `style="…"`). `<sc-for list="{{lista}}" as="x">` repite y `<sc-if value="{{cond}}">` condiciona. `hint-placeholder-*` son solo pistas del editor: ignoralas.
- Los eventos van como `onClick="{{r.add}}"`, `onPointerMove`, `onPointerLeave`, `onSubmit`.
- Al final hay un `<script type="text/x-dc" data-dc-script>` con una clase `Component extends DCLogic`: `this.state`, `setState`, `renderVals()` (devuelve todos los valores y handlers que usa el markup) y `componentWillUnmount`/`componentDidMount`. Es el mismo modelo que un componente de clase de React, y el runtime efectivamente usa React por debajo.
- `data-props='{"$preview":…}'` es solo el tamaño del tablero en el editor: ignoralo.
- `<script src="./support.js">` y `<x-dc>`/`<helmet>` **no existen en el sitio final**.

Antes de escribir código leé `referencia/runtime/formato-dc.md` y, si hay dudas de semántica (cómo se resuelven `{{}}` en atributos, `sc-for` anidados, etc.), buscá en `referencia/runtime/dc-runtime.js`. No adivines: verificá.

## Hallazgos ya verificados

- **Desktop y mobile son el mismo diseño.** Hice `diff` de cada par (`Tienda`/`M-Tienda`, `Ficha`/`M-Ficha`, `Suscripcion`/`M-Suscripcion`, `Cuenta`/`M-Cuenta`, `Main`/`Mobile`) normalizando los nombres de los links: solo cambian el `<title>` (el de mobile agrega « · mobile») y el `$preview`. El diseño responde con **un único corte**: `@container raiz (max-width:760px)`, donde `.raiz{container-type:inline-size;container-name:raiz}`. → **Son 5 páginas, no 10.** Usá el título de la versión desktop. Volvé a verificarlo con `diff` antes de descartar las `M-*`.
- `Main`/`Mobile` llevan su CSS **inline** en `<helmet>`; las otras cuatro cargan `compartido.css` además de su `<style>`. Conservá esa estructura; no unifiques los CSS.
- Unidades `cqi` y `@property --lx/--ly/--lr` (el «lente» que sigue al cursor sobre la bolsa) están en uso: no las reemplaces.
- Hay `@media (prefers-reduced-motion: reduce)` que apaga animaciones. Las capturas de referencia usan esa preferencia para que sean determinísticas; las animaciones **tienen que seguir existiendo** en el sitio.

## Qué reemplazar y qué no

Reemplazar:
1. `<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`, `{{…}}` y `<script src="./support.js">`/`text/x-dc` → HTML y JS real equivalente.
2. `/_blob/<hash>` → ruta real del asset según `mapa-blobs.json` (incluye `compartido.css`).
3. Links entre páginas `Main.dc.html`, `Tienda.dc.html`, `Ficha.dc.html`, `Suscripcion.dc.html`, `Cuenta.dc.html` (y sus `M-*`/`Mobile`) → rutas del sitio. Tienen que funcionar bajo un subpath de GitHub Pages (`/raiz-tostadores/`), así que usá rutas relativas o `base` configurada.

No tocar:
- Los `<link>` de Google Fonts (DM Sans + Fraunces con ejes `opsz`, `SOFT`, `WONK`). Mantenelos como están; no autoalojes tipografías sin avisarle a Mica.
- Anclas placeholder (`#carrito`, `#envios`, `#moliendas`, `#contacto`, `#instagram`, `#cancelar`, `#editar-envio`…): son de la maqueta, dejalas igual.
- Textos, `aria-*`, `alt`, estructura de encabezados, `.sr`.

## Interacciones a portar (misma lógica, sin cambiar nada)

Cada página trae su lógica completa en su `<script type="text/x-dc">`. Portá todo lo que haga, incluyendo timers y efectos. Resumen del estado de cada una, para que sepas qué buscar:

- **Home (`Main`)**: origen activo (`oi`) con pausa, seguimiento del cursor (`lx`/`ly`), quiz de 4 preguntas (`qa`, `so`, `sq`, `sf`), `componentDidMount` y un `setTimeout`.
- **Tienda**: filtros por método y perfil (las tarjetas que no coinciden se atenúan), tamaño 250 g / 1 kg (el precio de 1 kg es `precio × 3,6`), «Agregar» (suma al contador del carrito, animación `bump`/`bump2` y toast de 2,6 s), lente con el cursor, formato de precio `es-AR`.
- **Ficha**: tamaño, molienda, modo (suscripción / compra única), cantidad, frecuencia, pestañas, carrito y toast.
- **Suscripción**: asistente por pasos (método, cantidad, frecuencia, origen, envío, fecha, pago), con `setInterval` para rotar.
- **Cuenta**: próximo envío, saltear, pausar/reanudar, cambiar café, mapa de orígenes probados, anillo de progreso.

El carrito, los pagos y la suscripción son **simulados**: no hay backend. Dejalo así.

## Stack recomendado (decidilo vos si ves algo mejor y más fiel; anotalo en el README)

**Vite + React**, sitio multipágina (5 entradas HTML) o una SPA con rutas simples, lo que preserve mejor el HTML original. Razón: `DCLogic` ≈ componente de React, así que `state`/`setState`/`renderVals` se portan casi 1 a 1 y el markup se copia verbatim. Build estático, desplegado con **GitHub Pages por GitHub Actions**. Si una versión sin framework (HTML + CSS + JS) sale igual de fiel y más simple, también sirve.

## Verificación (obligatoria antes de decir «listo»)

```bash
cd herramientas
npm install
npx playwright install chromium
# 1) levantá el sitio construido (por ejemplo `npm run preview` en la raíz del proyecto)
# 2) compará:
node comparar.js --url http://localhost:4173/ --anchos 1440,390,1024,768
```

- `comparar.js` renderiza la referencia (los `.dc.html` con el runtime de Claude Design) y tu sitio, con las **mismas tipografías servidas desde `node_modules`** y sin movimiento, a página completa, y cuenta píxeles distintos.
- Si da diferencias, mirá `herramientas/salida/dif-*.png` (en magenta/rojo lo que cambia), corregí **el código**, no el diseño, y volvé a correr.
- `node comparar.js --autotest` compara la referencia contra sí misma y debería dar 0 (sirve para confirmar que el entorno es determinista).
- Además de las páginas en reposo, probá a mano (o con Playwright) los estados interactivos clave contra la referencia: filtro en Tienda, «Agregar» + toast, cambio de tamaño/molienda en Ficha, pasos de Suscripción, pausar/saltear en Cuenta, quiz en Home.
- Tamaños a cubrir: 1440 y 390 (los de diseño) más 1024 y 768. Si una diferencia aparece solo en una fuente por redondeo subpíxel y no se puede eliminar, mostrásela a Mica con el recorte, no la ocultes.

## Repo y publicación

- Repo: lo crea **Mica** en su GitHub, **vacío y público** (sugerencia: `raiz-tostadores`). Si todavía no existe, pedile la URL antes de hacer `git push`. No lo crees por tu cuenta en otra cuenta.
- Publicá con GitHub Pages (Actions) y dejale el link vivo para el portfolio.
- Escribí un `README.md` para el repo con: qué es, stack, cómo correrlo, estructura de carpetas, cómo se verifica la fidelidad, y una sección **«Contenido ficticio / placeholders»** que liste lo que sea de maqueta: fotos generadas con IA, carrito y suscripción simulados (sin backend ni pagos), datos del cliente inventados, y cualquier dato pendiente que aparezca en el HTML (costo de envío, productor/cosecha, registros RNE/RNPA, dominio `raiztostadores.com.ar`, `@raiztostadores`, cifras de perfil, recetas a validar). Revisá cuáles aparecen de verdad en las páginas antes de listarlos.
- Mantené `NOTAS.md` con cosas que viste y **no** cambiaste. Ya conocidos:
  - Terracota `#A95F44` sobre papel `#FBF8F3` da 4,498:1: queda **por debajo de 4,5:1** para texto chico (WCAG AA). Es decisión de diseño; se documenta, no se cambia.
  - Espaciados fuera de escala en algunos bloques de la Home (14, 22, 26, 30, 34 px).
  - Las bolsas y fotos son imágenes generadas con IA y funcionan como placeholders.
- Commits chicos y descriptivos, en español.

## Qué NO hacer

- No cambiar el diseño, aunque «mejore» la accesibilidad o el código.
- No agregar librerías de UI, resets, ni frameworks CSS que alteren estilos.
- No convertir a Tailwind ni reescribir las clases.
- No dejar rastros del runtime de Claude Design en el sitio final.
- No subir `node_modules`, `herramientas/salida/` ni `herramientas/node_modules/` al repo (agregalos al `.gitignore`).
- `referencia/` puede quedar en el repo (sirve como evidencia de fidelidad), pero evaluá el peso: `dc-runtime.js` y las capturas no son necesarios para el sitio publicado.
