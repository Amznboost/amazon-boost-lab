import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import example from '../src/example.mjs';
import { studyExampleMetadata, studyExampleCsv } from '../src/study-example.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['.git', 'artifacts', 'node_modules', 'private', 'incoming', 'exports']);
const failures = [];
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}
const files = await walk(root);
const exampleJson = JSON.parse(await readFile(path.join(root, 'examples/cuenta-sintetica.json'), 'utf8'));
if (!isDeepStrictEqual(example, exampleJson)) failures.push('El ejemplo del navegador y el ejemplo JSON deben contener exactamente los mismos datos sintéticos.');
const studyJson = JSON.parse(await readFile(path.join(root, 'examples/estudio-sintetico/ficha.json'), 'utf8'));
const studyCsv = await readFile(path.join(root, 'examples/estudio-sintetico/observaciones.csv'), 'utf8');
if (!isDeepStrictEqual(studyJson, studyExampleMetadata) || studyCsv.replaceAll('\r\n', '\n') !== studyExampleCsv.replaceAll('\r\n', '\n')) failures.push('El ejemplo del estudio y el del navegador deben coincidir.');
let links = 0, modules = 0;
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (/^\.env(?:\.|$)/.test(path.basename(file))) failures.push(`${relative}: archivo de entorno fuera del paquete permitido.`);
  const text = await readFile(file, 'utf8');
  if (/\bAKIA[0-9A-Z]{16}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}\b/.test(text)) failures.push(`${relative}: posible credencial; revisar sin imprimir su valor.`);
  if (file.endsWith('.json')) { try { JSON.parse(text); } catch { failures.push(`${relative}: JSON inválido.`); } }
  if (file.endsWith('.mjs')) {
    modules++;
    const parsed = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (parsed.status !== 0) failures.push(`${relative}: sintaxis JavaScript inválida.`);
  }
  if (file.endsWith('.md')) {
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^(https?:|mailto:)/.test(target)) continue;
      links++;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
      if (path.relative(root, resolved).startsWith('..')) { failures.push(`${relative}: enlace fuera del proyecto.`); continue; }
      try { await access(resolved); } catch { failures.push(`${relative}: enlace roto a ${target}.`); }
    }
  }
}
for (const htmlFile of files.filter(file => file.endsWith('.html'))) {
const html = await readFile(htmlFile, 'utf8');
const relativeHtml = path.relative(root, htmlFile).replaceAll('\\', '/');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (/^(https:\/\/|mailto:)/.test(target)) continue;
  links++;
  if (target.startsWith('#')) { if (!ids.has(target.slice(1))) failures.push(`${relativeHtml}: ancla rota ${target}.`); continue; }
  try { await access(target === '/' ? path.join(root, 'web/index.html') : target.startsWith('/') ? path.join(root, target) : path.resolve(path.dirname(htmlFile), target)); }
  catch { failures.push(`${relativeHtml}: recurso local roto ${target}.`); }
}
if (/<(?:script|link)[^>]*(?:src|href)="https?:/i.test(html)) failures.push(`${relativeHtml}: dependencia externa en la interfaz local.`);
}
for (const browserFile of files.filter(file => path.dirname(file) === path.join(root, 'web') && file.endsWith('.mjs'))) {
const browserCode = await readFile(browserFile, 'utf8');
if (/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB)\b/.test(browserCode)) failures.push(`${path.basename(browserFile)}: revisar transporte o almacenamiento incorporado.`);
}
if (failures.length) {
  failures.forEach(failure => process.stderr.write(`ERROR ${failure}\n`)); process.exitCode = 1;
} else {
  process.stdout.write(`Comprobación correcta: ${files.length} archivos, ${modules} módulos y ${links} enlaces/recursos locales.\n`);
  process.stdout.write('Los enlaces externos, los permisos de clientes y la aprobación editorial requieren revisión independiente.\n');
}
