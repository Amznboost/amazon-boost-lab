import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateAccount, calculateUnit, validDate } from '../src/economics.mjs';
const demo = JSON.parse(await readFile(new URL('../examples/cuenta-sintetica.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(demo);
test('cuenta sintética: contribución reconciliada y ratios con denominadores declarados', () => {
  const result = calculateAccount(demo);
  assert.equal(result.variableCosts, 5600);
  assert.equal(result.contributionBeforeAds, 4400);
  assert.equal(result.contribution, 2400);
  assert.equal(result.contributionPct, 24);
  assert.equal(result.maximumAffordableAdSpend, 3900);
  assert.equal(result.acosPct, 30); assert.equal(result.tacosPct, 15);
  assert.ok(Math.abs(result.roas - 10 / 3) < 1e-10);
});
test('no muta el objeto original', () => { const original = copy(); calculateAccount(original); assert.deepEqual(original, demo); });
test('denominadores nulos no producen infinito ni falsas métricas cero', () => {
  const input = copy(); input.netRevenue = 0; input.adSpend = 0; input.adMetrics.totalSales = 0; input.adMetrics.attributedSales = 0;
  const result = calculateAccount(input);
  for (const key of ['contributionPct', 'contributionBeforeAdsPct', 'acosPct', 'tacosPct', 'roas']) assert.equal(result[key], null);
  assert.ok(result.warnings.length >= 4);
});
test('mantiene las pérdidas visibles y no propone presupuesto donde no hay margen', () => {
  const input = copy(); input.netRevenue = 100; const result = calculateAccount(input);
  assert.equal(result.contribution, -7500); assert.equal(result.maximumAffordableAdSpend, 0);
});
test('separación entre ingresos netos y bases de los informes publicitarios', () => {
  const input = copy(); input.netRevenue = 8000; const result = calculateAccount(input);
  assert.equal(result.contribution, 400); assert.equal(result.tacosPct, 15);
});
test('sin informes publicitarios no inventa ACOS ni TACOS', () => {
  const input = copy(); delete input.adMetrics; const result = calculateAccount(input);
  assert.equal(result.acosPct, null); assert.equal(result.tacosPct, null);
});
test('detecta atribución incompatible con las ventas totales', () => {
  const input = copy(); input.adMetrics.attributedSales = 12000;
  assert.ok(calculateAccount(input).warnings.some(value => value.includes('superan las totales')));
});
for (const value of [-1, NaN, Infinity, '1500', null, 1e13]) test(`rechaza importes inválidos: ${String(value)}`, () => {
  const input = copy(); input.adSpend = value; assert.throws(() => calculateAccount(input), TypeError);
});
test('exige todos los costes; un dato faltante no es un coste cero', () => {
  const input = copy(); delete input.variableCosts.product; assert.throws(() => calculateAccount(input));
});
test('rechaza campos ajenos y datos personales accidentales', () => {
  const input = copy(); input.customerEmail = 'example'; assert.throws(() => calculateAccount(input), /desconocido/);
});
test('las fechas y el orden temporal deben ser reales', () => {
  assert.equal(validDate('2026-02-29'), false); assert.equal(validDate('2024-02-29'), true);
  assert.equal(validDate('2026-11-04T00:00:00Z'), false);
  const input = copy(); input.period.start = '2026-02-01'; assert.throws(() => calculateAccount(input));
});
test('exige describir atribución y base de ventas', () => {
  const input = copy(); input.adMetrics.salesBasis = ''; assert.throws(() => calculateAccount(input));
});
test('economía unitaria y límite de ACOS sin costes fijos', () => {
  const result = calculateUnit({ priceExVat: 25, productCost: 9, amazonFees: 3, fulfilmentCost: 4, otherVariableCost: 1 });
  assert.equal(result.marginBeforeAds, 8); assert.equal(result.breakEvenAcosPct, 32);
});
test('un producto sin margen no obtiene un objetivo ACOS engañoso', () => {
  const result = calculateUnit({ priceExVat: 10, productCost: 9, amazonFees: 3, fulfilmentCost: 4, otherVariableCost: 1 });
  assert.equal(result.breakEvenAcosPct, null); assert.equal(result.marginBeforeAds, -7);
});
