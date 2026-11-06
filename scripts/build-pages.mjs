import { access, cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicSite = new URL('https://amznboost.github.io/amazon-boost-lab/');
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
await cp(path.join(root, 'google565a89d0024014b2.html'), path.join(output, 'google565a89d0024014b2.html'));
await writeFile(path.join(output, '.nojekyll'), '');

function publicHtml(html, directory) {
  return html
    .replace(/<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*>/gi, '')
    .replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attribute, target) =>
      `${attribute}="${directory === 'web' ? '../' : './'}${target}"`);
}

function withCanonical(html, url) {
  if (!html.includes('</head>')) throw new Error(`Falta </head> en ${url}`);
  return html.replace('</head>', `<link rel="canonical" href="${url}">\n</head>`);
}

const landingSource = await readFile(path.join(root, 'web/lab.html'), 'utf8');
const landing = landingSource
  .replace('href="lab.html"', 'href="./"')
  .replaceAll('href="index.html"', 'href="web/index.html"')
  .replaceAll('href="metodo.html"', 'href="web/metodo.html"')
  .replaceAll('href="casos.html"', 'href="web/casos.html"')
  .replace('href="lab.css"', 'href="web/lab.css"')
  .replace('</head>', '<meta name="msvalidate.01" content="A7C83052C6E6C42C9EDC41398DE807DB">\n</head>')
  .replace(/\b(href|src)="\.\.\//g, '$1="');
await writeFile(path.join(output, 'index.html'), withCanonical(publicHtml(landing, ''), publicSite));

const webDirectory = path.join(output, 'web');
const webPages = (await readdir(webDirectory)).filter(file => file.endsWith('.html'));
const canonicalUrls = [publicSite];
for (const file of webPages) {
  const target = path.join(webDirectory, file);
  const isLandingAlias = file === 'lab.html';
  const canonical = isLandingAlias ? publicSite : new URL(`web/${file}`, publicSite);
  const html = isLandingAlias
    ? '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Amazon Boost Lab</title><meta http-equiv="refresh" content="0;url=../"></head><body><a href="../">Abrir Amazon Boost Lab</a></body></html>\n'
    : publicHtml(await readFile(target, 'utf8'), 'web')
      .replace('DOSSIER DE REVISIÓN', 'DOSSIER DEL MÉTODO')
      .replace('Preparación local · 5 de noviembre de 2026', 'Edición del 5 de noviembre de 2026')
      .replace('Documento local, sin publicación', 'Amazon Boost Lab');
  await writeFile(target, withCanonical(html, canonical));
  if (!isLandingAlias) canonicalUrls.push(canonical);
}

const sitemapEntries = canonicalUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n');
await writeFile(path.join(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`);

const pages = ['index.html', ...webPages.map(file => `web/${file}`)];
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
