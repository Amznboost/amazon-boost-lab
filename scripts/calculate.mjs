import { readFile } from 'node:fs/promises';
import { calculateAccount } from '../src/economics.mjs';
try {
  if (process.argv.length !== 3) throw new Error('Uso: node scripts/calculate.mjs archivo.json');
  const result = calculateAccount(JSON.parse(await readFile(process.argv[2], 'utf8')));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
