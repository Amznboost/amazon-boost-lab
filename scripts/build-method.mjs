import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export const chapterId = file => 'cap-' + file.replace(/\.md$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();

export function resolveLink(target, source, included = new Set()) {
  if (/^(https:\/\/|mailto:)/.test(target)) return target;
  if (target.startsWith('#')) throw new Error('Utiliza un documento enlazado, no un ancla Markdown sin resolver.');
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//') || target.startsWith('/')) throw new Error('Enlace no permitido');
  const [pathname, fragment] = target.split('#');
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), pathname));
  if (resolved === '..' || resolved.startsWith('../')) throw new Error('Enlace fuera del proyecto');
  if (included.has(resolved)) return '#' + chapterId(resolved);
  if (resolved === 'README.md') return '#top';
  if (!/^(docs|methodology|templates|examples|cases)\//.test(resolved)) throw new Error('Ruta sin vista de lectura');
  return '/' + resolved + (fragment ? '#' + fragment : '');
}

function inline(text, source, included) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let output = '', cursor = 0;
  for (const match of text.matchAll(pattern)) {
    output += escapeHtml(text.slice(cursor, match.index));
    if (match[1] !== undefined) output += '<a href="' + escapeHtml(resolveLink(match[2], source, included)) + '">' + escapeHtml(match[1]) + '</a>';
    else if (match[3] !== undefined) output += '<strong>' + escapeHtml(match[3]) + '</strong>';
    else output += '<code>' + escapeHtml(match[4]) + '</code>';
    cursor = match.index + match[0].length;
  }
  return output + escapeHtml(text.slice(cursor));
}

// Small renderer for the authored subset: headings, paragraphs, flat lists and tables.
// Raw HTML is escaped. Unsupported constructs fail instead of silently losing content.
export function renderMarkdown(markdown, source, included = new Set()) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const output = [];
  const format = line => inline(line, source, included);
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (/^```|^>|^!\[/.test(line)) throw new Error('Formato no admitido en ' + source);
    if (/^# /.test(line)) { i++; continue; }
    const heading = /^(#{2,3}) (.+)$/.exec(line);
    if (heading) { const level = heading[1].length + 1; output.push('<h' + level + '>' + format(heading[2]) + '</h' + level + '>'); i++; continue; }
    if (line.startsWith('|')) {
      const cells = value => value.split('|').slice(1, -1).map(cell => cell.trim());
      const headings = cells(line);
      if (!/^\|[\s:|-]+\|$/.test(lines[i + 1]?.trim() || '')) throw new Error('Tabla sin cabecera en ' + source);
      i += 2; const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = cells(lines[i++].trim());
        if (row.length !== headings.length) throw new Error('Tabla desalineada en ' + source);
        rows.push('<tr>' + row.map(cell => '<td>' + format(cell) + '</td>').join('') + '</tr>');
      }
      output.push('<div class="table-scroll" tabindex="0" role="region" aria-label="Tabla: ' + escapeHtml(headings.join(', ')) + '"><table><thead><tr>' + headings.map(cell => '<th scope="col">' + format(cell) + '</th>').join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>');
      continue;
    }
    if (/^(?:- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line), expression = ordered ? /^\d+\. / : /^- /;
      const items = [];
      while (i < lines.length && expression.test(lines[i].trim())) items.push('<li>' + format(lines[i++].trim().replace(expression, '')) + '</li>');
      const tag = ordered ? 'ol' : 'ul'; output.push('<' + tag + '>' + items.join('') + '</' + tag + '>'); continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(?:#|\||- |\d+\. )/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
    output.push('<p>' + format(paragraph.join(' ')) + '</p>');
  }
  return output.join('\n');
}

export async function buildMethod(root = projectRoot) {
  const catalog = JSON.parse(await readFile(path.join(root, 'docs/agencia/catalogo.json'), 'utf8'));
  const documents = [...catalog.readingOrder, ...catalog.templates];
  if (new Set(documents).size !== documents.length) throw new Error('Documentos duplicados');
  const included = new Set(documents), chapters = [];
  for (const file of documents) {
    if (!/^(docs|methodology|templates|examples)\/[a-z0-9/.-]+\.md$/i.test(file) || file.includes('..')) throw new Error('Documento no permitido');
    const markdown = await readFile(path.join(root, file), 'utf8');
    const title = catalog.procedures.find(entry => entry.document === file)?.title || /^# (.+)$/m.exec(markdown)?.[1];
    if (!title) throw new Error('Documento sin título: ' + file);
    chapters.push({ file, title, content: renderMarkdown(markdown, file, included), id: chapterId(file) });
  }
  const menu = chapters.map((chapter, index) => '<a href="#' + chapter.id + '"><span>' + String(index + 1).padStart(2, '0') + '</span>' + escapeHtml(chapter.title) + '</a>').join('\n');
  const body = chapters.map((chapter, index) => '<details class="chapter" id="' + chapter.id + '"' + (index === 0 ? ' open' : '') + '><summary><span class="number">' + String(index + 1).padStart(2, '0') + '</span><h2>' + escapeHtml(chapter.title) + '</h2><span class="expand" aria-hidden="true">+</span></summary><div class="prose">' + chapter.content + '<a class="source" href="/' + chapter.file + '">Ver documento Markdown ↗</a><a class="back" href="#contenido">Volver al índice ↑</a></div></details>').join('\n');
  return '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Método Amazon Boost — dossier de revisión</title><meta name="description" content="Procedimientos, decisiones y formatos de trabajo de Amazon Boost. Borrador local para revisión."><link rel="stylesheet" href="/web/metodo.css"></head><body><a class="skip" href="#contenido">Saltar al contenido</a><header class="header wrap"><a class="brand" href="#top"><img src="/assets/brand-symbol.svg" width="40" height="40" alt=""><span>Amazon <b>Boost.</b></span></a><span class="edition">DOSSIER DE REVISIÓN · ' + escapeHtml(catalog.version) + '</span></header><main><section class="hero wrap" id="top"><p class="eyebrow">AMAZON BOOST / MÉTODO Y PROCEDIMIENTOS</p><h1>El método detrás de<br><em>cada decisión.</em></h1><p class="lead">Cómo entendemos una cuenta, conectamos sus áreas de trabajo y explicamos qué merece la pena hacer después.</p><div class="hero-bottom"><a class="button" href="#contenido">Leer el método ↓</a><p>Preparación local · 5 de noviembre de 2026<br>Servicios contrastados. Desarrollo operativo propuesto para revisión.</p></div><div class="facts"><div><strong>09</strong><span>procedimientos</span></div><div><strong>15</strong><span>preguntas de marcas</span></div><div><strong>06</strong><span>formatos de trabajo</span></div><div><strong>01</strong><span>decisión explicada</span></div></div></section><section class="reading wrap" id="contenido"><aside><p class="eyebrow">ÍNDICE DE LECTURA</p><nav aria-label="Capítulos">' + menu + '</nav><p class="aside-note">Abre cada capítulo para leerlo. Esta vista se genera desde los documentos del repositorio, sin cargar servicios externos.</p><a href="/docs/agencia/catalogo.json">Índice documental JSON ↗</a></aside><div class="chapters">' + body + '</div></section><section class="closing wrap"><p class="eyebrow">DEL MÉTODO A LA CUENTA</p><h2>La siguiente decisión empieza<br>por entender tu marca.</h2><p>La web recoge los servicios y las condiciones vigentes. Este dossier desarrolla el método y mantiene identificados los límites y la evidencia disponible.</p><a class="button" href="https://amznboost.es/servicios/">Ver servicios de Amazon Boost ↗</a></section></main><footer class="wrap"><span>Amazon Boost · ' + escapeHtml(catalog.version) + ' · Documento local, sin publicación</span><a href="/">Volver a las herramientas</a></footer></body></html>\n';
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const html = await buildMethod();
  await writeFile(path.join(projectRoot, 'web/metodo.html'), html);
  process.stdout.write('Dossier generado desde los documentos originales.\n');
}
