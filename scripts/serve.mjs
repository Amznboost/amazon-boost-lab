import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.md': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8', '.csv': 'text/plain; charset=utf-8' };
export function createLabServer() {
return http.createServer(async (request, response) => {
  const headers = { 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' };
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, headers); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = pathname === '/' ? '/web/index.html' : pathname;
    if (!/^\/(web|src|assets|docs|methodology|templates|examples|cases)\//.test(target)) throw new Error('Ruta privada');
    const absolute = await realpath(path.join(root, target));
    const relative = path.relative(root, absolute);
    if (relative.startsWith('..') || !/^(web|src|assets|docs|methodology|templates|examples|cases)[\\/]/.test(relative)) throw new Error('Ruta no permitida');
    const type = types[path.extname(absolute)]; if (!type) throw new Error('Formato no permitido');
    const body = await readFile(absolute);
    response.writeHead(200, { ...headers, 'Content-Type': type, 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(404, headers); response.end('Página no encontrada.'); }
});
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
const port = Number(process.env.LAB_PORT || 8787);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('LAB_PORT debe estar entre 1024 y 65535.');
const server = createLabServer();
server.listen(port, '127.0.0.1', () => process.stdout.write(`Amazon Boost Lab: http://127.0.0.1:${port}/ — vista local, sin publicación\n`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close());
}
