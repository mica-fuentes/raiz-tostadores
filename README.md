# Raíz Tostadores · web

Sitio de **Raíz Tostadores**, tostaduría de café de especialidad (ficticia) de Chacarita, CABA. Es un proyecto de portfolio de UX/UI e identidad de Mica (diseñadora gráfica, FADU-UBA): e-commerce para consumidor final con suscripción mensual de café.

**Sitio publicado:** https://mica-fuentes.github.io/raiz-tostadores/

El diseño se hizo en Claude Design y este repo es su pasaje a código, **idéntico píxel a píxel** al diseño original (ver [Fidelidad](#fidelidad-con-el-diseño)).

## Páginas

| Ruta | Página |
|---|---|
| `/` | Home: hero con orígenes, tienda destacada, quiz «Encontrá tu café», calculadora de suscripción |
| `/tienda/` | Tienda: filtros por método y perfil, 250 g / 1 kg, agregar al carrito |
| `/ficha/` | Ficha de producto (El Mirador): tamaño, molienda, suscripción o compra única, receta |
| `/suscripcion/` | Armado de la suscripción paso a paso |
| `/cuenta/` | Mi suscripción: próximo envío, saltear, pausar, cambiar café, historial |

Hay un único diseño responsive con un corte a 760 px (container query sobre `.raiz`); las versiones mobile y desktop de Claude Design son el mismo archivo.

## Stack

- **Vite + React 18**, sitio estático multipágina (una entrada HTML por página).
- **CSS plano**, el mismo del diseño: sin frameworks, resets ni librerías de UI.
- Tipografías **DM Sans** y **Fraunces** desde Google Fonts.
- Publicación en **GitHub Pages** con GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`.

¿Por qué React? Cada página de Claude Design trae su lógica como una clase con `state`, `setState` y `renderVals()`, que es el modelo de un componente de clase de React. Así la lógica se copió sin cambios y solo hubo que pasar el markup a JSX.

## Cómo correrlo

Requiere Node 20 o más nuevo.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # genera dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

## Estructura

```
index.html, tienda/, ficha/, suscripcion/, cuenta/   entradas HTML de cada página
src/
  entradas/      monta cada página e importa su CSS
  paginas/       un componente por página: datos y lógica del diseño + render() en JSX
  estilos/       compartido.css y el CSS de cada página, tal cual el diseño
  assets/        logo, hoja, tramas, bolsas y fotos
  texto.jsx      helper para insertar valores calculados (ver NOTAS.md)
herramientas/    scripts de conversión y de verificación de fidelidad
referencia/      el diseño original de Claude Design (.dc.html, CSS y assets)
NOTAS.md         decisiones y cosas vistas que no se cambiaron
```

Las páginas se generaron con `herramientas/dc-a-react.js` a partir de `referencia/claude-design/*.dc.html`. El script reproduce las reglas del runtime de Claude Design (cómo trata los espacios, los `{{valores}}`, `sc-for` y `sc-if`) y queda como registro de cómo se hizo la traducción. **Ojo:** volver a correrlo sobrescribe `src/paginas/`, `src/estilos/` y los `index.html`.

## Fidelidad con el diseño

La prueba es objetiva: se renderiza cada página del diseño original con el runtime de Claude Design y el sitio construido, con las mismas tipografías y sin animaciones, y se cuentan los píxeles distintos.

```bash
cd herramientas
npm install
npx playwright install chromium
# con el sitio levantado (npm run preview en la raíz):
node comparar.js --url http://localhost:4173/ --anchos 1440,390,1024,768
node interacciones.js --url http://localhost:4173/ --anchos 1440,390,1024,768
```

- `comparar.js`: las 5 páginas en reposo, a 1440, 1024, 768 y 390 px. Resultado: **0 píxeles distintos y el mismo alto en las 20 combinaciones.**
- `interacciones.js`: en cada página repite la misma secuencia de clics (filtros, tamaños, agregar al carrito, quiz, pasos de la suscripción, pausar, saltear…) y movimientos del cursor en el diseño y en el sitio, y compara el DOM y la captura después de cada paso.

Las dos herramientas necesitan el runtime de Claude Design en `referencia/runtime/dc-runtime.js` y `referencia/capturas/` se regenera con `node render-referencia.js`; esas carpetas no se suben al repo (código de terceros y ~14 MB de imágenes).

Las animaciones del diseño siguen activas en el sitio; se apagan solo si el sistema pide movimiento reducido (`prefers-reduced-motion`), como en el original.

## Contenido ficticio / placeholders

Esto es una maqueta de portfolio. No es una tienda real:

- **La marca y la clienta son ficticias**: Raíz Tostadores, sus datos, la dirección de la cuenta (Av. Dorrego 1234), el historial de pedidos y los precios son inventados.
- **Fotos y bolsas generadas con IA** (`src/assets/fotos`, `src/assets/bolsas`), como placeholders hasta tener fotos reales.
- **Carrito, pagos y suscripción simulados**: no hay backend. El contador del carrito, los avisos, pausar, saltear y cambiar café son estado del navegador y se pierden al recargar. No se cobra nada; «Mercado Pago» y «transferencia» son opciones de maqueta.
- **Datos pendientes que aparecen en el sitio**:
  - Costo de envío por correo: `[COSTO]` (Suscripción, paso de envío).
  - Productor y cosecha: `[Nombre del productor]` y `[Meses de cosecha]` (Ficha).
  - Receta: «Receta de referencia: a validar con el tostador» (Ficha).
  - Cifras de perfil (dulzor, acidez, cuerpo de 1 a 5) y notas de cata, a validar.
  - Fecha de tueste «lun 5/10» y fechas de envío fijas.
- **Links de maqueta**: `#carrito`, `#envios`, `#moliendas`, `#contacto`, `#instagram`, `#cancelar`, `#editar-envio`, `#editar-pago`… no llevan a ninguna parte todavía.
- El formulario de newsletter no envía nada.
