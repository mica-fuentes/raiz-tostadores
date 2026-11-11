// Genera capturas de referencia de los .dc.html originales (Claude Design) con su runtime.
// Uso: node render-referencia.js [--anchos 1440,390] [--paginas main,tienda]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const L = require('./lib');

(async () => {
  const a = L.parseArgs(process.argv.slice(2));
  const anchos = (a.anchos || '1440,390').split(',').map(Number);
  const ids = a.paginas ? a.paginas.split(',') : L.PAGINAS.map((p) => p.id);
  const out = path.join(L.REF, 'capturas');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const w of anchos) for (const p of L.PAGINAS.filter((x) => ids.includes(x.id))) {
    const { ctx, page } = await L.nuevaPagina(b, w, L.rutaReferencia);
    await page.goto('http://ref.local/project/' + L.archivoReferencia(p, w), { waitUntil: 'load' });
    const dest = path.join(out, `${p.id}-${w}.png`);
    await L.esperarYCapturar(page, dest);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${p.id} @${w}px -> alto ${h}px -> ${path.relative(process.cwd(), dest)}`);
    await ctx.close();
  }
  await b.close();
})();
