// Utilidades compartidas por render-referencia.js y comparar.js
const fs = require('fs');
const path = require('path');

const REF = path.resolve(__dirname, '..', 'referencia');
const FONTS = path.join(__dirname, 'node_modules', '@fontsource-variable');
const MAPA = JSON.parse(fs.readFileSync(path.join(REF, 'assets', 'mapa-blobs.json'), 'utf8'));

// id de página, archivo de Claude Design en escritorio, en mobile y ruta en el sitio final
const PAGINAS = [
  { id: 'main',        desktop: 'Main',        mobile: 'Mobile',        ruta: '' },
  { id: 'tienda',      desktop: 'Tienda',      mobile: 'M-Tienda',      ruta: 'tienda/' },
  { id: 'ficha',       desktop: 'Ficha',       mobile: 'M-Ficha',       ruta: 'ficha/' },
  { id: 'suscripcion', desktop: 'Suscripcion', mobile: 'M-Suscripcion', ruta: 'suscripcion/' },
  { id: 'cuenta',      desktop: 'Cuenta',      mobile: 'M-Cuenta',      ruta: 'cuenta/' }
];

// Las mismas tipografías que pide el diseño (Google Fonts), servidas desde node_modules
// para que referencia y sitio se rendericen con exactamente los mismos archivos de fuente.
const FONT_CSS = `
@font-face{font-family:'Fraunces';font-style:normal;font-weight:100 900;font-display:block;src:url(http://fuentes.local/fraunces-latin-full-normal.woff2) format('woff2-variations')}
@font-face{font-family:'Fraunces';font-style:italic;font-weight:100 900;font-display:block;src:url(http://fuentes.local/fraunces-latin-full-italic.woff2) format('woff2-variations')}
@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;font-display:block;src:url(http://fuentes.local/dm-sans-latin-opsz-normal.woff2) format('woff2-variations')}
@font-face{font-family:'DM Sans';font-style:italic;font-weight:100 1000;font-display:block;src:url(http://fuentes.local/dm-sans-latin-opsz-italic.woff2) format('woff2-variations')}`;

const MIME = { '.svg': 'image/svg+xml', '.webp': 'image/webp', '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html' };

// Intercepta Google Fonts y las fuentes locales. Devuelve true si la ruta fue atendida.
async function rutaFuentes(route) {
  const u = new URL(route.request().url());
  if (u.hostname === 'fonts.googleapis.com') { await route.fulfill({ body: FONT_CSS, contentType: 'text/css', headers: { 'access-control-allow-origin': '*' } }); return true; }
  if (u.hostname === 'fuentes.local') {
    const n = u.pathname.slice(1);
    const d = n.startsWith('fraunces') ? 'fraunces' : 'dm-sans';
    await route.fulfill({ path: path.join(FONTS, d, 'files', n), contentType: 'font/woff2', headers: { 'access-control-allow-origin': '*' } });
    return true;
  }
  if (u.hostname === 'fonts.gstatic.com') { await route.abort(); return true; }
  return false;
}

// Sirve los .dc.html originales con el runtime de Claude Design, para obtener la referencia exacta.
async function rutaReferencia(route) {
  if (await rutaFuentes(route)) return;
  const u = new URL(route.request().url());
  if (u.hostname !== 'ref.local') return route.abort();
  if (u.pathname === '/project/support.js') return route.fulfill({ path: path.join(REF, 'runtime', 'dc-runtime.js'), contentType: 'text/javascript' });
  if (u.pathname.startsWith('/project/')) return route.fulfill({ path: path.join(REF, 'claude-design', u.pathname.slice(9)), contentType: 'text/html' });
  const rel = MAPA[u.pathname];
  if (rel) return route.fulfill({ path: path.join(REF, rel), contentType: MIME[path.extname(rel)] });
  return route.fulfill({ status: 404, body: '' });
}

// Archivo de Claude Design a usar según el ancho (el diseño cambia con un único corte a 760 px)
function archivoReferencia(p, ancho) { return (ancho <= 760 ? p.mobile : p.desktop) + '.dc.html'; }

async function nuevaPagina(browser, ancho, handler) {
  // reducedMotion: el diseño ya define animation:none para esa preferencia -> capturas deterministas
  const ctx = await browser.newContext({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 200)));
  await page.route('**/*', handler);
  return { ctx, page };
}

async function esperarYCapturar(page, destino) {
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const buf = await page.screenshot({ path: destino, fullPage: true });
  return buf;
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) { o[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; }
  return o;
}

module.exports = { REF, PAGINAS, rutaReferencia, rutaFuentes, archivoReferencia, nuevaPagina, esperarYCapturar, parseArgs };
