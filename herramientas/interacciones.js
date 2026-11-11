// Compara los estados interactivos del sitio contra la referencia (Claude Design).
// En cada página hace la misma secuencia de acciones en los dos lados (clics en botones,
// cursor sobre la zona con "lente", formularios) y después de cada paso compara:
//   1) el DOM de .raiz normalizado (clases, textos, estilos inline, atributos)
//   2) la captura de página completa, píxel a píxel
// Uso: node interacciones.js --url http://localhost:4173/ [--anchos 1440,390] [--paginas main,tienda] [--pasos 25]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const L = require('./lib');

const ZONAS_LENTE = '.hero, .shelf-media, .pmedia, .panel, .cmedia, [class*="media"]';

// Secuencia determinista de índices de botón (pseudoaleatoria con semilla fija)
function secuencia(n, semilla) {
  let s = semilla;
  const out = [];
  for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) % 2147483648; out.push(s >>> 12); }
  return out;
}

async function abrir(b, w, p, base) {
  if (!base) {
    const { ctx, page } = await L.nuevaPagina(b, w, L.rutaReferencia);
    await page.goto('http://ref.local/project/' + L.archivoReferencia(p, w), { waitUntil: 'load' });
    return { ctx, page };
  }
  const handler = async (route) => {
    if (await L.rutaFuentes(route)) return;
    if (new URL(route.request().url()).origin === new URL(base).origin) return route.continue();
    return route.abort();
  };
  const { ctx, page } = await L.nuevaPagina(b, w, handler);
  await page.goto(new URL(p.ruta, base).href, { waitUntil: 'load' });
  return { ctx, page };
}

// DOM de .raiz sin las marcas propias del runtime de Claude Design y con links llevados a la página destino
async function domNormalizado(page) {
  return page.evaluate((mapa) => {
    // documento inerte: cambiar src acá no dispara descargas
    const raiz = document.implementation.createHTMLDocument('').importNode(document.querySelector('.raiz'), true);
    const pag = (h) => {
      const m = h.match(/(?:M-)?([A-Za-z]+)\.dc\.html/);
      if (m) return { Main: 'home', Mobile: 'home', Tienda: 'tienda', Ficha: 'ficha', Suscripcion: 'suscripcion', Cuenta: 'cuenta' }[m[1]] + (h.split('#')[1] ? '#' + h.split('#')[1] : '');
      if (h.startsWith('#')) return h;
      const u = h.replace(/^(\.\.\/|\.\/)/, '');
      return (u.split('/')[0] || 'home') + (h.split('#')[1] ? '#' + h.split('#')[1] : '');
    };
    raiz.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-dc-tpl');
      if (el.getAttribute('class') === 'sc-interp') el.removeAttribute('class');
      if (el.hasAttribute('href')) el.setAttribute('href', pag(el.getAttribute('href')));
      if (el.hasAttribute('src')) {
        let src = el.getAttribute('src');
        if (mapa[src]) src = mapa[src]; // /_blob/<hash> -> assets/fotos/x.webp
        el.setAttribute('src', src.replace(/^.*\/([a-z0-9-]+?)(-[A-Za-z0-9_-]{8})?\.(webp|svg)$/, '$1'));
      }
    });
    raiz.removeAttribute('data-dc-tpl');
    return raiz.outerHTML;
  }, MAPA);
}
const MAPA = JSON.parse(fs.readFileSync(path.join(L.REF, 'assets', 'mapa-blobs.json'), 'utf8'));

async function accion(page, paso, k) {
  if (paso % 5 === 4) {
    // cursor sobre una zona con lente (posición fija relativa a la zona)
    const zonas = await page.$$(ZONAS_LENTE);
    const z = zonas[k % Math.max(1, zonas.length)];
    if (z) {
      await z.scrollIntoViewIfNeeded();
      const bb = await z.boundingBox();
      if (bb) {
        page.cursor = [bb.x + bb.width * 0.3, bb.y + bb.height * 0.4];
        await page.mouse.move(...page.cursor);
      }
      return 'cursor sobre zona ' + (k % zonas.length);
    }
  }
  const n = await page.evaluate(() => document.querySelectorAll('.raiz button, .raiz summary').length);
  if (!n) return 'sin botones';
  const i = k % n;
  const desc = await page.evaluate((i) => {
    const el = document.querySelectorAll('.raiz button, .raiz summary')[i];
    el.click();
    return (el.className || el.tagName) + ' «' + (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) + '»';
  }, i);
  // Si el clic cambió el layout bajo el cursor quieto, Chromium dispara pointerleave/enter
  // recién con el próximo evento de mouse y en un momento variable. Se re-envía la posición
  // (1 px y de vuelta) para que el estado del lente quede igual en los dos lados.
  if (page.cursor) {
    await page.waitForTimeout(100);
    await page.mouse.move(page.cursor[0] + 1, page.cursor[1]);
    await page.mouse.move(...page.cursor);
  }
  return 'clic botón ' + i + ' ' + desc;
}

async function captura(page) {
  await page.waitForTimeout(450);
  // los toasts son position:fixed: en una captura de página completa su lugar depende del scroll,
  // así que se captura siempre desde arriba en los dos lados
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(50);
  return PNG.sync.read(await page.screenshot({ fullPage: true }));
}

function comparar(a, b) {
  const W = Math.max(a.width, b.width), H = Math.max(a.height, b.height);
  const pad = (img) => { const o = new PNG({ width: W, height: H }); o.data.fill(255); PNG.bitblt(img, o, 0, 0, img.width, img.height, 0, 0); return o; };
  const A = pad(a), B = pad(b), D = new PNG({ width: W, height: H });
  return { n: pixelmatch(A.data, B.data, D.data, W, H, { threshold: 0 }), alto: a.height === b.height, D };
}

(async () => {
  const a = L.parseArgs(process.argv.slice(2));
  if (!a.url) { console.log('Falta --url'); process.exit(2); }
  const anchos = (a.anchos || '1440,390').split(',').map(Number);
  const ids = a.paginas ? a.paginas.split(',') : L.PAGINAS.map((p) => p.id);
  const pasos = +(a.pasos || 25);
  fs.mkdirSync(path.join(__dirname, 'salida'), { recursive: true });
  const b = await chromium.launch();
  let fallas = 0;
  for (const w of anchos) for (const p of L.PAGINAS.filter((x) => ids.includes(x.id))) {
    const R = await abrir(b, w, p, null);
    const S = await abrir(b, w, p, a.url);
    await R.page.waitForTimeout(1200); await S.page.waitForTimeout(1200);
    const ks = secuencia(pasos, 7 + w + p.id.length);
    let ok = 0;
    for (let i = 0; i < pasos; i++) {
      // en paralelo, para que los timers (toasts de 2,6 s, etc.) estén en el mismo momento en los dos lados
      const [d1, d2] = await Promise.all([accion(R.page, i, ks[i]), accion(S.page, i, ks[i])]);
      const [dr, ds] = await Promise.all([domNormalizado(R.page), domNormalizado(S.page)]);
      const [cr, cs] = await Promise.all([captura(R.page), captura(S.page)]);
      const c = comparar(cr, cs);
      if (dr !== ds || c.n || !c.alto) {
        fallas++;
        const base = `int-${p.id}-${w}-${i}`;
        fs.writeFileSync(path.join(__dirname, 'salida', base + '-dif.png'), PNG.sync.write(c.D));
        if (c.n) { fs.writeFileSync(path.join(__dirname, 'salida', base + '-ref.png'), PNG.sync.write(cr)); fs.writeFileSync(path.join(__dirname, 'salida', base + '-sitio.png'), PNG.sync.write(cs)); }
        fs.writeFileSync(path.join(__dirname, 'salida', base + '-ref.html'), dr);
        fs.writeFileSync(path.join(__dirname, 'salida', base + '-sitio.html'), ds);
        console.log(`  ${p.id} @${w} paso ${i}: ${d1}${d1 !== d2 ? ' / sitio: ' + d2 : ''} -> DOM ${dr === ds ? 'igual' : 'DISTINTO'}, ${c.n} px, alto ${c.alto ? 'igual' : 'DISTINTO'}`);
      } else ok++;
    }
    console.log(`${p.id.padEnd(12)} @${w}: ${ok}/${pasos} pasos idénticos`);
    await R.ctx.close(); await S.ctx.close();
  }
  await b.close();
  console.log(fallas ? `\n${fallas} pasos con diferencias.` : '\nTodos los estados idénticos.');
  process.exit(fallas ? 1 : 0);
})();
