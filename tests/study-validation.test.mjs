import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, validateStudy } from '../src/study-validation.mjs';
import { studyExampleMetadata, studyExampleCsv } from '../src/study-example.mjs';

const metadata = () => structuredClone(studyExampleMetadata);
const csv = rows => [parseCsv(studyExampleCsv)[0], ...rows].map(row => row.join(',')).join('\n');
const observations = () => parseCsv(studyExampleCsv).slice(1);
const has = (report, category, code) => report[category].some(issue => issue.code === code);

test('ejemplo sintético completo: pide revisar factores de contexto sin inventar causalidad', () => {
  const report = validateStudy(metadata(), studyExampleCsv);
  assert.equal(report.status, 'needs_review');
  assert.deepEqual(report.errors, []);
  assert.equal(report.summary.rows, 10); assert.equal(report.summary.products, 2);
  assert.equal(report.summary.missingObservations, 0);
  assert.deepEqual(report.summary.states, { available: 8, out_of_stock: 1, partial: 1, unknown: 0 });
  for (const code of ['partial_availability', 'promotion', 'content_changes', 'price_changes']) assert.ok(has(report, 'warnings', code));
});
test('CSV admite BOM, CRLF, comas y saltos entrecomillados, y comillas escapadas', () => {
  assert.deepEqual(parseCsv('\uFEFFuno,dos\r\n"a,b","c""d"\r\n"e\nf",g\r\n'), [['uno', 'dos'], ['a,b', 'c"d'], ['e\nf', 'g']]);
});
for (const value of ['a,b\n"sin cerrar,b', 'a,b\nno"vale,b', 'a,b\n"cerrado"texto,b']) test('rechaza CSV mal formado sin reinterpretarlo', () => assert.throws(() => parseCsv(value), /CSV/));
test('aplica límites de tamaño y de número de observaciones', () => {
  assert.throws(() => parseCsv('x'.repeat(2000001)), /millones/);
  assert.throws(() => parseCsv('a\n'.repeat(10003)), /10.000/);
});
test('cero ventas con stock no se convierte en falta de stock', () => {
  const report = validateStudy(metadata(), studyExampleCsv);
  assert.equal(report.summary.availableWithZeroUnits, 1);
  assert.equal(report.summary.states.out_of_stock, 1);
  assert.ok(has(report, 'notes', 'zero_sales_not_stockout'));
});
test('un duplicado se rechaza sin sumarlo', () => {
  const rows = observations(); rows.push(rows[0]);
  const report = validateStudy(metadata(), csv(rows));
  assert.equal(report.status, 'invalid'); assert.ok(has(report, 'errors', 'duplicate'));
  assert.equal(report.summary.expectedObservations, 10); assert.equal(report.summary.missingObservations, 0);
});
test('una fila ausente se conserva como ausencia, no como cero', () => {
  const rows = observations(); rows.splice(2, 1);
  const report = validateStudy(metadata(), csv(rows));
  assert.equal(report.summary.missingObservations, 1);
  assert.equal(report.summary.states.out_of_stock, 0);
  assert.ok(has(report, 'warnings', 'missing_days'));
});
test('una celda numérica vacía bloquea y no recibe cero implícito', () => {
  const rows = observations(); rows[0][3] = '';
  const report = validateStudy(metadata(), csv(rows));
  assert.equal(report.status, 'invalid'); assert.ok(has(report, 'errors', 'units'));
});
test('no acepta sumas mensuales, unidades fraccionarias, importes negativos ni coma decimal', () => {
  const rows = observations(); rows[0][0] = '2026-01'; rows[1][3] = '1.5'; rows[2][4] = '-5'; rows[3][5] = '25,00';
  const report = validateStudy(metadata(), csv(rows));
  for (const code of ['date', 'units', 'amount', 'row_width']) assert.ok(has(report, 'errors', code));
});
test('rechaza columnas de identificación y no imprime su contenido', () => {
  const report = validateStudy(metadata(), studyExampleCsv.replace('content_changed', 'email'));
  assert.equal(report.status, 'invalid'); assert.ok(has(report, 'errors', 'columns'));
  assert.ok(!JSON.stringify(report).includes('email'));
});
test('rechaza ASIN/SKU en la columna de producto; solo usa alias locales', () => {
  const report = validateStudy(metadata(), studyExampleCsv.replace('P001', 'B000000001'));
  assert.ok(has(report, 'errors', 'product_alias')); assert.ok(!JSON.stringify(report).includes('B000000001'));
});
test('conserva incertidumbre de disponibilidad y de contexto', () => {
  const rows = observations(); rows[0][2] = 'unknown'; rows[1][6] = 'unknown';
  const report = validateStudy(metadata(), csv(rows));
  assert.ok(has(report, 'warnings', 'unknown_availability')); assert.ok(has(report, 'warnings', 'unknown_context'));
});
test('señala pedidos en días declarados completamente sin stock', () => {
  const rows = observations(); rows[2][3] = '2';
  const report = validateStudy(metadata(), csv(rows));
  assert.ok(has(report, 'warnings', 'units_without_stock'));
});
test('exige bases, fuentes, zona horaria y un alcance único', () => {
  const input = metadata(); input.timeZone = 'zona-inventada'; input.definitions.price = ''; input.sources.units = ''; input.primaryMetric = 'attributed_sales';
  const report = validateStudy(input, studyExampleCsv);
  for (const code of ['time_zone', 'definition_missing', 'source_alias', 'primary_metric']) assert.ok(has(report, 'errors', code));
  assert.equal(report.status, 'invalid');
});
test('fechas imposibles, fuera de alcance y periodos excesivos no se aceptan', () => {
  assert.ok(has(validateStudy(metadata(), studyExampleCsv.replace('2026-01-01', '2026-02-30')), 'errors', 'date'));
  assert.ok(has(validateStudy(metadata(), studyExampleCsv.replace('2026-01-01', '2025-12-31')), 'errors', 'date'));
  const input = metadata(); input.period.end = '2040-01-01';
  assert.ok(has(validateStudy(input, studyExampleCsv), 'errors', 'period_limit'));
});
test('acepta orden de columnas diferente y no muta ni reordena las entradas', () => {
  const input = metadata(), before = structuredClone(input);
  const table = parseCsv(studyExampleCsv).map(row => [...row].reverse());
  const reversed = table.map(row => row.join(',')).join('\n');
  const result = validateStudy(input, reversed);
  assert.equal(result.summary.rows, 10); assert.equal(result.errors.length, 0); assert.deepEqual(input, before);
});
test('estructura correcta no significa permiso de publicar ni verdad verificada', () => {
  const rows = observations().filter(row => row[1] === 'P001').map(row => [row[0], row[1], 'available', '1', '2.00', '25.00', '0', '0']);
  const report = validateStudy(metadata(), csv(rows));
  assert.equal(report.status, 'structurally_valid'); assert.equal(report.warnings.length, 0);
  assert.ok(report.limitations.some(text => text.includes('permiso')));
});
test('datos ausentes y metadatos inesperados fallan de forma controlada', () => {
  for (const input of [null, [], {}, { ...metadata(), email: 'dato-que-no-se-devuelve' }]) {
    const report = validateStudy(input, ''); assert.equal(report.status, 'invalid');
    assert.ok(!JSON.stringify(report).includes('dato-que-no-se-devuelve'));
  }
  assert.ok(has(validateStudy(metadata(), parseCsv(studyExampleCsv)[0].join(',')), 'errors', 'empty'));
});
