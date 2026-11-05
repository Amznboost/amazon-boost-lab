import { readFile } from 'node:fs/promises';
import { validateStudy } from '../src/study-validation.mjs';

try {
  const [metadataFile, observationsFile, ...extra] = process.argv.slice(2);
  if (!metadataFile || !observationsFile || extra.length) throw new TypeError('Uso: node scripts/validate-study.mjs ficha.json observaciones.csv');
  const metadata = JSON.parse((await readFile(metadataFile, 'utf8')).replace(/^\uFEFF/, ''));
  const report = validateStudy(metadata, await readFile(observationsFile, 'utf8'));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status === 'invalid') process.exitCode = 1;
} catch {
  process.stderr.write('No se pudo validar. Revisa los dos archivos, su formato y el uso indicado en la documentación. No se imprimen los datos de entrada.\n');
  process.exitCode = 1;
}
