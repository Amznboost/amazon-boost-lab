import test from 'node:test';
import assert from 'node:assert/strict';
import { createLabServer } from '../scripts/serve.mjs';

test('vista local: recursos, aislamiento y política de solo lectura', async t => {
  const server = createLabServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  await t.test('el dossier y todos sus documentos enlazados pueden leerse', async () => {
    const response = await fetch(base + '/web/metodo.html');
    assert.equal(response.status, 200);
    const html = await response.text();
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (/^(https:\/\/|mailto:)/.test(target)) continue;
      if (target.startsWith('#')) assert.ok(ids.has(target.slice(1)), target);
      else assert.equal((await fetch(base + target)).status, 200, target);
    }
  });
  await t.test('HTML accesible, sin indexación ni conexiones de la calculadora', async () => {
    const response = await fetch(base);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-security-policy'), /connect-src 'none'/);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.match(await response.text(), /<html lang="es">/);
  });
  await t.test('los módulos, estilos, logo y ejemplo llegan con tipos correctos', async () => {
    for (const [url, mime] of [['/web/app.mjs', 'javascript'], ['/src/economics.mjs', 'javascript'], ['/web/style.css', 'text/css'], ['/assets/brand-symbol.svg', 'image/svg'], ['/examples/cuenta-sintetica.json', 'application/json'], ['/web/datos.html', 'text/html'], ['/web/datos.mjs', 'javascript'], ['/src/study-validation.mjs', 'javascript'], ['/examples/estudio-sintetico/observaciones.csv', 'text/plain'], ['/web/producto.mjs', 'javascript'], ['/src/es-fees-2026.mjs', 'javascript'], ['/src/product-estimator.mjs', 'javascript'], ['/web/cuenta.html', 'text/html']]) {
      const response = await fetch(base + url);
      assert.equal(response.status, 200, url);
      assert.ok(response.headers.get('content-type').includes(mime), url);
    }
  });
  await t.test('no expone repositorio, artefactos, archivos desconocidos o rutas ajenas', async () => {
    for (const url of ['/.git/config', '/artifacts/website-baseline.json', '/package.json', '/web/no-existe.html', '/web/%2e%2e%2fpackage.json', '/web/%2e%2e%2f%2e%2e%2flegal-publication/package.json', '/web/%00']) {
      assert.equal((await fetch(base + url)).status, 404, url);
    }
  });
  await t.test('rechaza envío de datos y no lista directorios', async () => {
    assert.equal((await fetch(base, { method: 'POST', body: 'prueba' })).status, 405);
    assert.equal((await fetch(base + '/web/')).status, 404);
    const head = await fetch(base, { method: 'HEAD' });
    assert.equal(head.status, 200); assert.equal(await head.text(), '');
  });
});
