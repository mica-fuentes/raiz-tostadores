// Compara el sitio construido contra la referencia (los .dc.html corriendo con el runtime de Claude Design).
// Uso:
//   node comparar.js --url http://localhost:4173/ [--anchos 1440,390,1024,768] [--paginas main,tienda]
//   node comparar.js --autotest        (referencia contra sí misma: tiene que dar 0 píxeles de diferencia)
// Criterio de aceptación: 0 píxeles distintos y mismo alto en cada página y cada ancho.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const L = require('./lib');

async function capRef(b, p, w) {
  const { ctx, page } = await L.nuevaPagina(b, w, L.rutaReferencia);
  await page.goto('http://ref.local/project/' + L.archivoReferencia(p, w), { waitUntil: 'load' });
  const buf = await L.esperarYCapturar(page, path.join(__dirname, 'salida', `ref-${p.id}-${w}.png`));
  await ctx.close();
  return buf;
}
async function capSitio(b, base, p, w) {
  const handler = async (route) => {
    if (await L.rutaFuentes(route)) return;
    const u = new URL(route.request().url());
    if (u.origin === new URL(base).origin) return route.continue();
    return route.abort(); // sin red externa: todo lo que no sea el sitio ni las fuentes se bloquea
  };
  const { ctx, page } = await L.nuevaPagina(b, w, handler);
  await page.goto(new URL(p.ruta, base).href, { waitUntil: 'load' });
  const buf = await L.esperarYCapturar(page, path.join(__dirname, 'salida', `sitio-${p.id}-${w}.png`));
  await ctx.close();
  return buf;
}

(async () => {
  const a = L.parseArgs(process.argv.slice(2));
  if (!a.url && !a.autotest) { console.log('Falta --url (o --autotest)'); process.exit(2); }
  const anchos = (a.anchos || '1440,390').split(',').map(Number);
  const ids = a.paginas ? a.paginas.split(',') : L.PAGINAS.map((p) => p.id);
  fs.mkdirSync(path.join(__dirname, 'salida'), { recursive: true });
  const b = await chromium.launch();
  let fallas = 0;
  console.log('página'.padEnd(13), 'ancho'.padEnd(6), 'alto ref/sitio'.padEnd(16), 'px distintos');
  for (const w of anchos) for (const p of L.PAGINAS.filter((x) => ids.includes(x.id))) {
    const ref = PNG.sync.read(await capRef(b, p, w));
    const sit = PNG.sync.read(a.autotest ? await capRef(b, p, w) : await capSitio(b, a.url, p, w));
    const W = Math.max(ref.width, sit.width), H = Math.max(ref.height, sit.height);
    const pad = (img) => { const o = new PNG({ width: W, height: H }); o.data.fill(255); PNG.bitblt(img, o, 0, 0, img.width, img.height, 0, 0); return o; };
    const A = pad(ref), B = pad(sit), D = new PNG({ width: W, height: H });
    const n = pixelmatch(A.data, B.data, D.data, W, H, { threshold: 0 });
    const mismoAlto = ref.height === sit.height && ref.width === sit.width;
    if (n > 0 || !mismoAlto) { fallas++; fs.writeFileSync(path.join(__dirname, 'salida', `dif-${p.id}-${w}.png`), PNG.sync.write(D)); }
    console.log(p.id.padEnd(13), String(w).padEnd(6), `${ref.height}/${sit.height}`.padEnd(16), n, n > 0 || !mismoAlto ? '  <-- DIFERENCIA (ver herramientas/salida/dif-' + p.id + '-' + w + '.png)' : '  ok');
  }
  await b.close();
  console.log(fallas ? `\n${fallas} comparaciones con diferencias.` : '\nTodo idéntico.');
  process.exit(fallas ? 1 : 0);
})();
