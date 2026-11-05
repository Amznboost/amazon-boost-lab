/** Pure calculations. No network, storage, telemetry or external dependencies. */
export const VARIABLE_COST_KEYS = Object.freeze(['product', 'amazonFees', 'fulfilment', 'inboundAndStorage', 'returnsProcessing', 'other']);
export const FIXED_COST_KEYS = Object.freeze(['agency', 'other']);

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function record(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label}: se necesita un objeto.`);
}
function amount(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12) throw new TypeError(`${label}: introduce un número entre 0 y 1 billón.`);
  return value;
}
function keys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new TypeError(`${label}: campo desconocido «${key}».`);
}
function costs(value, allowed, label) {
  record(value, label); keys(value, allowed, label);
  for (const key of allowed) amount(value[key], `${label}.${key}`);
  return Object.values(value).reduce((sum, item) => sum + item, 0);
}
const percentage = (numerator, denominator) => denominator > 0 ? numerator / denominator * 100 : null;

export function calculateAccount(input) {
  record(input, 'Cuenta');
  keys(input, ['currency', 'period', 'netRevenue', 'variableCosts', 'adSpend', 'fixedCosts', 'adMetrics'], 'Cuenta');
  if (typeof input.currency !== 'string' || !/^[A-Z]{3}$/.test(input.currency)) throw new TypeError('Divisa: utiliza tres letras, por ejemplo EUR.');
  record(input.period, 'Periodo'); keys(input.period, ['start', 'end'], 'Periodo');
  if (!validDate(input.period.start) || !validDate(input.period.end) || input.period.start > input.period.end) throw new TypeError('Periodo: fechas reales, ordenadas y con formato AAAA-MM-DD.');
  const revenue = amount(input.netRevenue, 'Ingresos netos');
  const variable = costs(input.variableCosts, VARIABLE_COST_KEYS, 'Costes variables');
  const advertising = amount(input.adSpend, 'Publicidad');
  const fixed = costs(input.fixedCosts, FIXED_COST_KEYS, 'Costes fijos');
  const beforeAds = revenue - variable;
  const contribution = beforeAds - advertising - fixed;
  const warnings = [];
  if (!revenue) warnings.push('Sin ingresos netos: los porcentajes sobre ingresos no se pueden calcular.');
  if (beforeAds < 0) warnings.push('Los costes variables superan los ingresos antes de añadir publicidad y costes fijos.');
  if (contribution < 0) warnings.push('La contribución del periodo es negativa con los costes introducidos.');
  let acos = null, tacos = null, roas = null, reportedSalesBasis = null;
  if (input.adMetrics !== undefined) {
    record(input.adMetrics, 'Métricas publicitarias');
    keys(input.adMetrics, ['totalSales', 'attributedSales', 'salesBasis', 'attributionWindow'], 'Métricas publicitarias');
    amount(input.adMetrics.totalSales, 'Ventas totales del informe');
    amount(input.adMetrics.attributedSales, 'Ventas atribuidas del informe');
    for (const key of ['salesBasis', 'attributionWindow']) if (typeof input.adMetrics[key] !== 'string' || !input.adMetrics[key].trim()) throw new TypeError(`Métricas publicitarias.${key}: documenta la base y la atribución.`);
    acos = percentage(advertising, input.adMetrics.attributedSales);
    tacos = percentage(advertising, input.adMetrics.totalSales);
    roas = advertising > 0 ? input.adMetrics.attributedSales / advertising : null;
    reportedSalesBasis = input.adMetrics.salesBasis;
    if (input.adMetrics.attributedSales > input.adMetrics.totalSales) warnings.push('Las ventas atribuidas superan las totales: revisa periodos, atribución y fuentes antes de interpretar los ratios.');
    if (!input.adMetrics.attributedSales) warnings.push('Sin ventas atribuidas: ACOS no definido; no se sustituye por cero.');
    if (!input.adMetrics.totalSales) warnings.push('Sin ventas totales del informe: TACOS no definido.');
    if (!advertising) warnings.push('Sin gasto publicitario: ROAS no definido.');
    warnings.push('ACOS, TACOS y ROAS usan las ventas declaradas del informe; la contribución usa ingresos netos. Sus bases pueden ser distintas.');
  }
  return {
    currency: input.currency, period: { ...input.period },
    netRevenue: revenue, variableCosts: variable, adSpend: advertising, fixedCosts: fixed,
    contributionBeforeAds: beforeAds,
    contributionBeforeAdsPct: percentage(beforeAds, revenue),
    contribution, contributionPct: percentage(contribution, revenue),
    maximumAffordableAdSpend: Math.max(0, beforeAds - fixed),
    acosPct: acos, tacosPct: tacos, roas, reportedSalesBasis, warnings,
  };
}

export function calculateUnit(input) {
  record(input, 'Producto');
  const allowed = ['priceExVat', 'productCost', 'amazonFees', 'fulfilmentCost', 'otherVariableCost'];
  keys(input, allowed, 'Producto');
  for (const key of allowed) amount(input[key], key);
  const variableCost = input.productCost + input.amazonFees + input.fulfilmentCost + input.otherVariableCost;
  const margin = input.priceExVat - variableCost;
  return {
    variableCost, marginBeforeAds: margin,
    marginBeforeAdsPct: percentage(margin, input.priceExVat),
    breakEvenAcosPct: input.priceExVat > 0 && margin > 0 ? margin / input.priceExVat * 100 : null,
    warning: 'Umbral teórico por producto, sin costes fijos. Solo comparable con ACOS si la base de ventas, el producto y los costes son equivalentes. No es un objetivo de campaña ni una garantía de beneficio.',
  };
}
