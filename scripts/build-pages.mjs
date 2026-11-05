import { access, cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const artifacts = path.join(root, 'artifacts');
await mkdir(artifacts, { recursive: true });
const output = await mkdtemp(path.join(artifacts, 'pages-'));

const publicDirectories = ['assets', 'cases', 'docs', 'examples', 'methodology', 'src', 'templates', 'web'];
for (const directory of publicDirectories) {
  await cp(path.join(root, directory), path.join(output, directory), {
    recursive: true,
    filter: (source) => {
      const name = path.basename(source);
      return !name.startsWith('.') &&
        !['private', 'incoming', 'exports', 'artifacts'].includes(name);
    },
  });
}
await cp(path.join(root, 'README.md'), path.join(output, 'README.md'));
await writeFile(path.join(output, '.nojekyll'), '');

function publicHtml(html, directory) {
  return html
    .replace(/<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*>/gi, '')
    .replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attribute, target) =>
      `${attribute}="${directory === 'web' ? '../' : './'}${target}"`);
}

const landingSource = await readFile(path.join(root, 'web/lab.html'), 'utf8');
const landing = landingSource
  .replace('href="lab.html"', 'href="./"')
  .replaceAll('href="index.html"', 'href="web/index.html"')
  .replaceAll('href="metodo.html"', 'href="web/metodo.html"')
  .replace('href="lab.css"', 'href="web/lab.css"')
  .replace(/\b(href|src)="\.\.\//g, '$1="');
await writeFile(path.join(output, 'index.html'), publicHtml(landing, ''));

const webDirectory = path.join(output, 'web');
for (const file of await readdir(webDirectory)) {
  if (!file.endsWith('.html')) continue;
  const target = path.join(webDirectory, file);
  const html = file === 'lab.html'
    ? '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Amazon Boost Lab</title><meta http-equiv="refresh" content="0;url=../"></head><body><a href="../">Abrir Amazon Boost Lab</a></body></html>\n'
    : publicHtml(await readFile(target, 'utf8'), 'web')
      .replace('DOSSIER DE REVISIÓN', 'DOSSIER DEL MÉTODO')
      .replace('Preparación local · 5 de noviembre de 2026', 'Edición del 5 de noviembre de 2026')
      .replace('Documento local, sin publicación', 'Amazon Boost Lab');
  await writeFile(target, html);
}

const pages = ['index.html', ...await readdir(webDirectory).then(files =>
  files.filter(file => file.endsWith('.html')).map(file => `web/${file}`))];
for (const file of pages) {
  const html = await readFile(path.join(output, file), 'utf8');
  for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:#|https:\/\/|mailto:)/.test(url)) continue;
    if (url.startsWith('/') || /^\w+:/.test(url)) throw new Error(`Ruta incompatible con Pages en ${file}: ${url}`);
    const local = path.resolve(output, path.dirname(file), url.split(/[?#]/, 1)[0]);
    if (path.relative(output, local).startsWith('..')) throw new Error(`Ruta fuera del sitio: ${url}`);
    await access(local);
  }
}
console.log(output);
