import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildMethod, renderMarkdown, resolveLink } from '../scripts/build-method.mjs';

test('el dossier coincide con sus documentos y no depende de JavaScript para leerlo', async () => {
  const generated = await buildMethod();
  const saved = await readFile(new URL('../web/metodo.html', import.meta.url), 'utf8');
  assert.equal(saved, generated);
  assert.equal((generated.match(/<h1>/g) || []).length, 1);
  assert.equal((generated.match(/<details class="chapter"/g) || []).length, 20);
  assert.doesNotMatch(generated, /<script\b|<iframe\b|<form\b/);
  assert.match(generated, /Ejemplo completamente sintético/);
});

test('el renderizado escapa contenido y rechaza enlaces ejecutables o ajenos', () => {
  const html = renderMarkdown('# Título\n\n<script>alert("x")</script>\n\n[web](https://amznboost.es/)\n', 'docs/prueba.md');
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.throws(() => renderMarkdown('[x](javascript:alert)', 'docs/prueba.md'), /no permitido/);
  assert.throws(() => resolveLink('../../privado.md', 'docs/prueba.md'), /fuera del proyecto/);
  assert.throws(() => resolveLink('//example.com', 'docs/prueba.md'), /no permitido/);
});

test('los enlaces internos conservan destino y las tablas no pierden columnas', () => {
  const included = new Set(['methodology/agencia/03-gestion.md']);
  assert.equal(resolveLink('../../methodology/agencia/03-gestion.md', 'docs/agencia/README.md', included), '#cap-methodology-agencia-03-gestion');
  assert.equal(resolveLink('../README.md', 'docs/prueba.md'), '#top');
  assert.equal(resolveLink('plantilla.md', 'docs/prueba.md'), '/docs/plantilla.md');
  const html = renderMarkdown('| A | B |\n| --- | --- |\n| uno | dos |', 'docs/prueba.md');
  assert.equal((html.match(/<td>/g) || []).length, 2);
  assert.throws(() => renderMarkdown('| A | B |\n| --- | --- |\n| uno |', 'docs/prueba.md'), /desalineada/);
});

test('el índice documental separa propuestas y servicios y tiene rutas y fuentes válidas', async () => {
  const catalog = JSON.parse(await readFile(new URL('../docs/agencia/catalogo.json', import.meta.url), 'utf8'));
  assert.equal(new Set(catalog.procedures.map(entry => entry.id)).size, 9);
  assert.equal(catalog.publicationStatus, 'local_draft');
  assert.equal(catalog.templates.length, 6);
  for (const entry of catalog.procedures) {
    assert.equal(entry.realClientData, false);
    assert.equal(entry.procedureEvidence, 'documented_proposal');
    assert.equal(new URL(entry.serviceUrl).hostname, 'amznboost.es');
    assert.equal(new URL(entry.serviceUrl).protocol, 'https:');
    assert.match(await readFile(new URL('../' + entry.document, import.meta.url), 'utf8'), /^# /);
  }
  for (const file of [...catalog.readingOrder, ...catalog.templates]) await readFile(new URL('../' + file, import.meta.url));
});
