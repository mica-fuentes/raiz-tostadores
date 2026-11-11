// Convierte los .dc.html de Claude Design (referencia/claude-design) a código del sitio:
//   src/paginas/<Pagina>.jsx   componente React: lógica copiada tal cual + markup traducido a JSX
//   src/estilos/<pagina>.css   el <style> de la página, sin cambios salvo las rutas /_blob/ -> assets
//   src/estilos/compartido.css
//   <ruta>/index.html          entrada HTML de cada página (Vite multipágina)
//
// Se corrió una vez para generar el sitio; queda en el repo como registro de cómo se hizo la
// traducción. Reproduce las reglas del runtime de Claude Design (dc-runtime.js):
//   - un nodo de texto que solo tiene saltos de línea/tabs (sin espacios) se descarta; el resto queda literal
//   - cada {{valor}} dentro de texto se renderiza envuelto en un <span> (afecta la cascada: p. ej. `.qopt span`)
//   - <sc-for> repite sus hijos sin envoltorio; <sc-if> los muestra si el valor es truthy
//   - style="a: {{x}}" se convierte en objeto de estilo
// El HTML se parsea con el DOMParser de Chromium (igual que en el navegador) vía Playwright.
//
// Uso: node dc-a-react.js   (sobrescribe los archivos generados)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const REF = path.join(RAIZ, 'referencia');
const MAPA = JSON.parse(fs.readFileSync(path.join(REF, 'assets', 'mapa-blobs.json'), 'utf8'));

const PAGINAS = [
  { archivo: 'Main', componente: 'Home', id: 'home', dir: '', compartido: false },
  { archivo: 'Tienda', componente: 'Tienda', id: 'tienda', dir: 'tienda', compartido: true },
  { archivo: 'Ficha', componente: 'Ficha', id: 'ficha', dir: 'ficha', compartido: true },
  { archivo: 'Suscripcion', componente: 'Suscripcion', id: 'suscripcion', dir: 'suscripcion', compartido: true },
  { archivo: 'Cuenta', componente: 'Cuenta', id: 'cuenta', dir: 'cuenta', compartido: true }
];
// Links entre tableros de Claude Design -> carpeta de la página en el sitio
const LINKS = { Main: '', Mobile: '', Tienda: 'tienda', Ficha: 'ficha', Suscripcion: 'suscripcion', Cuenta: 'cuenta' };

const EVENTOS = ['Click', 'Change', 'Input', 'Submit', 'KeyDown', 'KeyUp', 'KeyPress', 'MouseDown', 'MouseUp', 'MouseEnter', 'MouseLeave', 'Focus', 'Blur', 'MouseMove', 'MouseOver', 'MouseOut', 'PointerDown', 'PointerUp', 'PointerMove', 'PointerEnter', 'PointerLeave', 'PointerCancel', 'PointerOver', 'PointerOut', 'TouchStart', 'TouchEnd', 'TouchMove', 'AnimationEnd', 'TransitionEnd'];
const MAPA_EVENTOS = Object.fromEntries(EVENTOS.map((e) => ['on' + e.toLowerCase(), 'on' + e]));
const MAPA_ATRIBUTOS = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', colspan: 'colSpan', rowspan: 'rowSpan', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength', autocomplete: 'autoComplete', inputmode: 'inputMode', srcset: 'srcSet', crossorigin: 'crossOrigin', enterkeyhint: 'enterKeyHint' };
const BOOLEANOS = new Set('allowfullscreen async autofocus autoplay checked controls default defer disabled formnovalidate hidden loop multiple muted novalidate open playsinline readonly required reversed selected'.split(' '));
const VACIOS = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());

// ---------- parseo con Chromium ----------
async function parsear(page, html) {
  return page.evaluate((src) => {
    const doc = new DOMParser().parseFromString('<!doctype html><html><body>' + src + '</body></html>', 'text/html');
    const conv = (n) => {
      if (n.nodeType === 3) return { t: 'txt', v: n.nodeValue };
      if (n.nodeType !== 1) return null;
      return {
        t: 'el',
        tag: n.localName,
        svg: n.namespaceURI === 'http://www.w3.org/2000/svg',
        attrs: [...n.attributes].map((a) => [a.name, a.value]),
        hijos: [...n.childNodes].map(conv).filter(Boolean)
      };
    };
    return [...doc.body.childNodes].map(conv).filter(Boolean);
  }, html);
}

// ---------- expresiones {{ }} ----------
function expr(src, ctx) {
  const e = src.trim();
  if (e === 'true' || e === 'false' || e === 'null' || /^-?\d+(\.\d+)?$/.test(e)) return e;
  if (!/^[A-Za-z_$][\w$]*(\.[\w$]+)*$/.test(e)) throw new Error('Expresión no soportada: {{' + e + '}}');
  const [raiz, ...resto] = e.split('.');
  if (!ctx.locales.has(raiz)) ctx.globales.add(raiz);
  return [raiz, ...resto.map((p) => (/^\d/.test(p) ? `[${p}]` : '.' + p))].join('').replace(/\.\[/g, '[');
}
const partes = (s) => s.split(/\{\{([\s\S]+?)\}\}/g); // pares = literal, impares = expresión

function valorAtributo(v, ctx) {
  const p = partes(v);
  if (p.length === 1) return JSON.stringify(v);
  if (p.length === 3 && p[0] === '' && p[2] === '') return '{' + expr(p[1], ctx) + '}';
  return '{`' + p.map((x, i) => (i % 2 ? '${' + expr(x, ctx) + '}' : x.replace(/[`\\$]/g, '\\$&'))).join('') + '`}';
}

function valorEstilo(v, ctx) {
  // "a: x; b: {{y}}" -> { a: 'x', b: y }
  const decl = [];
  for (const d of v.split(';')) {
    const i = d.indexOf(':');
    if (i < 0) { if (d.trim()) throw new Error('style raro: ' + v); continue; }
    const prop = d.slice(0, i).trim();
    const val = d.slice(i + 1).trim();
    const k = prop.startsWith('--') ? JSON.stringify(prop) : camel(prop);
    const p = partes(val);
    let js;
    if (p.length === 1) js = JSON.stringify(val);
    else if (p.length === 3 && p[0] === '' && p[2] === '') js = expr(p[1], ctx);
    else js = '`' + p.map((x, j) => (j % 2 ? '${' + expr(x, ctx) + '}' : x)).join('') + '`';
    decl.push(k + ': ' + js);
  }
  return '{{ ' + decl.join(', ') + ' }}';
}

function rutaLink(href, ctx) {
  const m = href.match(/^(?:M-)?([A-Za-z]+)\.dc\.html(#.*)?$/);
  if (!m || !(m[1] in LINKS)) return href;
  const destino = LINKS[m[1]];
  const base = ctx.pagina.dir ? '../' : './';
  return base + (destino ? destino + '/' : '') + (m[2] || '');
}

function importarAsset(blob, ctx) {
  const rel = MAPA[blob];
  if (!rel) throw new Error('blob sin mapa: ' + blob);
  const nombre = camel(path.basename(rel).replace(/\.[a-z]+$/, '').replace(/[^a-z0-9-]/gi, '-'));
  ctx.imports.set(nombre, '../' + rel.replace(/^assets\//, 'assets/'));
  return '{' + nombre + '}';
}

function atributos(el, ctx) {
  const out = [];
  for (let [n, v] of el.attrs) {
    if (n.startsWith('hint-')) continue;
    let nombre = MAPA_EVENTOS[n] || MAPA_ATRIBUTOS[n] || n;
    if (el.svg && n.includes('-') && !n.startsWith('aria-') && !n.startsWith('data-')) nombre = camel(n);
    if (nombre === 'style') { out.push('style=' + valorEstilo(v, ctx)); continue; }
    if (nombre === 'href' && !v.includes('{{')) v = rutaLink(v, ctx);
    if ((nombre === 'src') && /^\/_blob\//.test(v)) { out.push('src=' + importarAsset(v, ctx)); continue; }
    if (/\/_blob\//.test(v)) throw new Error('blob en atributo no previsto: ' + n);
    if (BOOLEANOS.has(n) && !v.includes('{{')) { out.push(camel(MAPA_ATRIBUTOS[n] || n)); continue; }
    out.push(nombre + '=' + valorAtributo(v, ctx));
  }
  return out;
}

// ---------- generación de JSX ----------
const IND = '  ';
function esTextoDescartable(v) { return !v.trim() && !v.includes(' '); } // regla del runtime

// Devuelve los "items" JSX de una lista de nodos (cada item = string de una o más líneas)
function nodos(lista, ctx, nivel) {
  const out = [];
  for (const n of lista) {
    if (n.t === 'txt') {
      if (!n.v.includes('{{')) { if (!esTextoDescartable(n.v)) out.push({ inline: true, s: texto(n.v) }); continue; }
      partes(n.v).forEach((x, i) => {
        if (i % 2) out.push({ inline: true, s: '{texto(' + expr(x, ctx) + ')}' });
        else if (x) out.push({ inline: true, s: texto(x) });
      });
      continue;
    }
    out.push({ inline: false, s: elemento(n, ctx, nivel) });
  }
  return out;
}

function texto(v) {
  // literal si es seguro en JSX; si no, como string JS para conservar espacios y saltos exactos
  if (/^[^{}<>&\n\r\t]+$/.test(v) && v.trim() === v) return v;
  return '{' + JSON.stringify(v) + '}';
}

function bloque(items, nivel) {
  // si hay texto mezclado, todo en una línea (en JSX los saltos entre texto y tags cambian el espaciado)
  if (!items.length) return null;
  if (items.some((x) => x.inline)) return { inline: true, s: items.map((x) => x.s.replace(/\n\s*/g, '')).join('') };
  return { inline: false, s: items.map((x) => IND + x.s.replace(/\n/g, '\n' + IND)).join('\n') };
}

function conLocal(ctx, nombres, fn) {
  const antes = new Set(ctx.locales);
  nombres.forEach((n) => ctx.locales.add(n));
  const r = fn();
  ctx.locales = antes;
  return r;
}

function elemento(el, ctx, nivel) {
  const a = Object.fromEntries(el.attrs);
  if (el.tag === 'sc-for') {
    const lista = expr(a.list.replace(/^\{\{|\}\}$/g, ''), ctx);
    const as = a.as || 'item';
    const usaIndex = JSON.stringify(el).includes('$index');
    const idx = usaIndex ? '$index' : 'i';
    return conLocal(ctx, [as, '$index'], () => {
      const items = nodos(el.hijos, ctx, nivel + 1);
      return envolverMap(lista, as, idx, items, nivel);
    });
  }
  if (el.tag === 'sc-if') {
    const cond = expr(a.value.replace(/^\{\{|\}\}$/g, ''), ctx);
    const items = nodos(el.hijos, ctx, nivel);
    return '{' + cond + ' ? ' + fragmento(items, nivel, null) + ' : null}';
  }
  if (el.tag.startsWith('sc-') || el.tag.includes('-')) throw new Error('etiqueta no soportada: ' + el.tag);
  const attrs = atributos(el, ctx);
  const apertura = '<' + el.tag + (attrs.length ? ' ' + attrs.join(' ') : '');
  if (VACIOS.has(el.tag)) return apertura + ' />';
  const b = bloque(nodos(el.hijos, ctx, nivel), nivel);
  if (!b) return apertura + '></' + el.tag + '>';
  if (b.inline) return apertura + '>' + b.s + '</' + el.tag + '>';
  return apertura + '>\n' + b.s + '\n</' + el.tag + '>';
}

function fragmento(items, nivel, key) {
  // un solo elemento: se devuelve tal cual (agregándole key si hace falta); si no, Fragment
  if (items.length === 1 && !items[0].inline && items[0].s.startsWith('<')) {
    return key ? items[0].s.replace(/^<([a-z0-9]+)/, '<$1 key={' + key + '}') : items[0].s;
  }
  const b = bloque(items, nivel);
  const open = key ? '<Fragment key={' + key + '}>' : '<>';
  const close = key ? '</Fragment>' : '</>';
  if (!b) return 'null';
  return b.inline ? open + b.s + close : open + '\n' + b.s + '\n' + close;
}

function envolverMap(lista, as, idx, items, nivel) {
  return '{' + lista + '.map((' + as + ', ' + idx + ') => (\n' + IND + fragmento(items, nivel, idx).replace(/\n/g, '\n' + IND) + '\n))}';
}

// ---------- archivos ----------
function cssConAssets(css, desdeDir) {
  return css.replace(/\/_blob\/[0-9a-f]+/g, (b) => {
    const rel = MAPA[b];
    if (!rel) throw new Error('blob sin mapa en CSS: ' + b);
    return path.posix.relative(desdeDir, 'src/' + rel);
  });
}

async function convertir(page, p) {
  const src = fs.readFileSync(path.join(REF, 'claude-design', p.archivo + '.dc.html'), 'utf8');
  const titulo = src.match(/<title>([^<]*)<\/title>/)[1];
  const xdc = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
  const helmet = xdc.match(/<helmet>([\s\S]*?)<\/helmet>/)[1];
  const fuentes = helmet.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/)[0];
  const estilo = helmet.match(/<style>\n?([\s\S]*?)<\/style>/)[1];
  const markup = xdc.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  const script = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];

  const arbol = await parsear(page, markup);
  const ctx = { pagina: p, locales: new Set(), globales: new Set(), imports: new Map() };
  const items = nodos(arbol, ctx, 1).filter((x) => !(x.inline && /^\{"\s*"\}$/.test(x.s)));
  if (items.length !== 1) throw new Error(p.archivo + ': se esperaba un único elemento raíz');
  const jsx = items[0].s.replace(/\n/g, '\n      ');

  if (!/class Component extends DCLogic \{/.test(script)) throw new Error('no encontré la clase');
  let logica = script.trim().replace('class Component extends DCLogic {', 'export default class ' + p.componente + ' extends React.Component {');
  const cierre = logica.lastIndexOf('}');
  const usaFragment = jsx.includes('<Fragment');
  const render =
    '\n  render() {\n' +
    '    const { ' + [...ctx.globales].sort().join(', ') + ' } = this.renderVals();\n' +
    '    return (\n      ' + jsx + '\n    );\n  }\n';
  logica = logica.slice(0, cierre).replace(/\s*$/, '\n') + render + '}\n';

  const cabecera =
    '// ' + titulo + '\n' +
    '// Generado desde referencia/claude-design/' + p.archivo + '.dc.html con herramientas/dc-a-react.js.\n' +
    '// La lógica (datos, estado y renderVals) es la del diseño, sin cambios; render() es su markup en JSX.\n' +
    "import React" + (usaFragment ? ', { Fragment }' : '') + " from 'react';\n" +
    "import { texto } from '../texto.jsx';\n" +
    [...ctx.imports].map(([n, r]) => 'import ' + n + " from '" + r + "';").join('\n') + (ctx.imports.size ? '\n' : '') + '\n';
  fs.mkdirSync(path.join(RAIZ, 'src', 'paginas'), { recursive: true });
  fs.writeFileSync(path.join(RAIZ, 'src', 'paginas', p.componente + '.jsx'), cabecera + logica);

  fs.mkdirSync(path.join(RAIZ, 'src', 'estilos'), { recursive: true });
  // compartido.css tiene que cargarse ANTES que el CSS de la página (en el original va en el <head>).
  // Con @import, Vite arma un único CSS por página con ese orden garantizado.
  const previo = p.compartido ? "/* Primero el CSS compartido, igual que en el diseño original */\n@import './compartido.css';\n\n" : '';
  fs.writeFileSync(path.join(RAIZ, 'src', 'estilos', p.id + '.css'), previo + cssConAssets(estilo, 'src/estilos'));

  const entrada =
    "import React from 'react';\n" +
    "import { createRoot } from 'react-dom/client';\n" +
    "import '../estilos/" + p.id + ".css';\n" +
    'import ' + p.componente + " from '../paginas/" + p.componente + ".jsx';\n\n" +
    "createRoot(document.getElementById('app')).render(<" + p.componente + ' />);\n';
  fs.mkdirSync(path.join(RAIZ, 'src', 'entradas'), { recursive: true });
  fs.writeFileSync(path.join(RAIZ, 'src', 'entradas', p.id + '.jsx'), entrada);

  const html =
    '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + titulo + '</title>\n' +
    fuentes + '\n</head>\n<body>\n<div id="app"></div>\n' +
    '<script type="module" src="/src/entradas/' + p.id + '.jsx"></script>\n</body>\n</html>\n';
  const dirHtml = path.join(RAIZ, p.dir);
  fs.mkdirSync(dirHtml, { recursive: true });
  fs.writeFileSync(path.join(dirHtml, 'index.html'), html);
  console.log(p.archivo, '->', p.componente + '.jsx', '(' + ctx.globales.size + ' valores,', ctx.imports.size, 'imágenes)');
}

(async () => {
  const css = fs.readFileSync(path.join(REF, 'claude-design', 'compartido.css'), 'utf8');
  fs.mkdirSync(path.join(RAIZ, 'src', 'estilos'), { recursive: true });
  fs.writeFileSync(path.join(RAIZ, 'src', 'estilos', 'compartido.css'), cssConAssets(css, 'src/estilos'));
  const b = await chromium.launch();
  const page = await b.newPage();
  for (const p of PAGINAS) await convertir(page, p);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
