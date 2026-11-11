# Notas de implementación

Cosas que se vieron al pasar el diseño a código y que **no se cambiaron**, porque la regla es que el sitio quede idéntico a Claude Design. Quedan acá para decidirlas aparte.

## Diseño y accesibilidad

- **Contraste del terracota.** `#A95F44` sobre papel `#FBF8F3` da 4,498:1: queda apenas por debajo de 4,5:1, el mínimo WCAG AA para texto chico. Es decisión de diseño; no se tocó.
- **Espaciados fuera de escala** en algunos bloques de la Home (14, 22, 26, 30 y 34 px). Se respetaron tal cual.
- **Bolsas y fotos generadas con IA.** Funcionan como placeholders hasta tener fotos reales.

## Datos

- **Precios distintos al brief.** En el diseño los precios de 250 g son El Mirador $12.500, Caparaó $12.500, San Ignacio $12.000, Buku $14.000 y Santa Cruz $13.500. El catálogo del brief dice Caparaó $10.000, San Ignacio $11.000, Buku $16.000 y Santa Cruz $18.000. El sitio usa los del diseño.
- **Precio de 1 kg en la Tienda** = precio de 250 g × 3,6 (cálculo del diseño, no la lista del brief).

## Detalles técnicos que hacen falta para que quede igual

- **Cada valor calculado va dentro de un `<span>`** (función `texto()` en `src/texto.jsx`). Claude Design los renderiza así y el CSS depende de eso: por ejemplo `.qopt span{font-size:14px;color:#6E5A4E}` también alcanza a la etiqueta de `<b>{{op.label}}</b>` en el quiz de la Home. Si se saca el `<span>`, cambia el tamaño y color de esos textos.
- **Saltos de línea y espacios.** Los textos con `white-space:pre-line` (títulos en varias líneas) conservan los `\n` del original; los nodos que en el original solo tenían saltos de línea se descartan, igual que hace el runtime.
- **Orden del CSS.** `compartido.css` tiene que cargarse antes que el CSS de cada página (si no, por ejemplo `.wrap{padding:0 32px}` pisa el `padding-top` de `.prod` en la Ficha). Por eso cada CSS de página empieza con `@import './compartido.css'`. Los archivos siguen separados, como en el diseño.
- **CSS sin minificar** (`cssMinify: false` en `vite.config.js`), para publicar el CSS tal como está.
- **Se agregó `<meta name="viewport">`.** En Claude Design no hace falta porque el tablero ya mide 390 px; en un celular real, sin esa etiqueta el navegador muestra la página a 980 px y nunca se activa la versión mobile. No cambia nada en escritorio.
- **Links entre páginas** relativos (`./tienda/`, `../cuenta/`…) para que funcionen bajo `/raiz-tostadores/` en GitHub Pages. Las anclas de maqueta (`#carrito`, `#envios`, `#instagram`…) quedaron igual.

## Verificación

- En Cuenta, la propia referencia a veces mide 2 px menos de alto entre una corrida y otra (3238 / 3240 px a 1440). Es variación del render de Claude Design, no del sitio; si `comparar.js` llegara a marcarla, conviene volver a correrlo.
- Los toasts son `position: fixed`; en capturas de página completa su lugar depende del scroll, por eso `interacciones.js` captura siempre desde arriba.
- Cuando un clic cambia el alto del contenido bajo el cursor quieto, Chromium dispara `pointerleave` en un momento variable (le pasa igual a la referencia). `interacciones.js` vuelve a mover el cursor después de cada clic para que los dos lados queden en el mismo estado.
- Con la máquina muy cargada (varias pruebas a la vez) aparecen diferencias de antialiasing en bordes rotados y en el borde difuso del lente. La referencia comparada contra sí misma (`comparar.js --autotest`) muestra las mismas diferencias, así que no son del sitio; corriendo de a una prueba por vez dan 0.
