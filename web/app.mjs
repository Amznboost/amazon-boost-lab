import { calculateAccount, calculateUnit } from '../src/economics.mjs';
import example from '../src/example.mjs';

const form = document.querySelector('#account-form');
const adsToggle = document.querySelector('#include-ads');
const adsFields = document.querySelector('#ads-fields');
const results = document.querySelector('#account-results');
const empty = document.querySelector('#result-empty');
const error = document.querySelector('#account-error');
const exampleLabel = document.querySelector('#example-label');
const unitForm = document.querySelector('#unit-form');
const unitResult = document.querySelector('#unit-result');
const unitError = document.querySelector('#unit-error');
const number = (data, name) => Number(data.get(name));
const money = (value, currency) => new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(value);
const pct = value => value === null ? 'No definido' : `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(value)} %`;
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
function syncAds() { adsFields.hidden = !adsToggle.checked; adsFields.disabled = !adsToggle.checked; }
function invalidate() {
  results.hidden = true; empty.hidden = false; results.replaceChildren(); error.hidden = true;
  exampleLabel.hidden = true;
}
function accountInput() {
  const data = new FormData(form);
  const input = {
    currency: data.get('currency'), period: { start: data.get('start'), end: data.get('end') },
    netRevenue: number(data, 'netRevenue'),
    variableCosts: {
      product: number(data, 'product'), amazonFees: number(data, 'amazonFees'), fulfilment: number(data, 'fulfilment'),
      inboundAndStorage: number(data, 'inboundAndStorage'), returnsProcessing: number(data, 'returnsProcessing'), other: number(data, 'otherVariable'),
    }, adSpend: number(data, 'adSpend'),
    fixedCosts: { agency: number(data, 'agency'), other: number(data, 'otherFixed') },
  };
  if (adsToggle.checked) input.adMetrics = {
    totalSales: number(data, 'totalSales'), attributedSales: number(data, 'attributedSales'),
    salesBasis: data.get('salesBasis'), attributionWindow: data.get('attributionWindow'),
  };
  return input;
}
function renderAccount(result) {
  const body = element('div', undefined, 'result-body');
  const date = value => new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
  body.append(element('p', `${date(result.period.start)} — ${date(result.period.end)} · ${result.currency}`, 'result-period'));
  body.append(element('div', money(result.contribution, result.currency), `result-number${result.contribution < 0 ? ' loss' : ''}`));
  body.append(element('p', `${pct(result.contributionPct)} de los ingresos netos`, 'margin'));
  const rows = element('dl', undefined, 'reconciliation');
  for (const [label, value] of [
    ['Ingresos netos', result.netRevenue], ['− Costes variables', result.variableCosts],
    ['− Publicidad', result.adSpend], ['− Costes fijos', result.fixedCosts],
  ]) {
    const row = element('div'); row.append(element('dt', label), element('dd', money(value, result.currency))); rows.append(row);
  }
  body.append(rows);
  if (adsToggle.checked) {
    const ratios = element('div', undefined, 'ratios');
    for (const [label, value] of [['ACOS', pct(result.acosPct)], ['TACOS', pct(result.tacosPct)], ['ROAS', result.roas === null ? 'No definido' : `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(result.roas)}×`]]) {
      const ratio = element('div', label, 'ratio'); ratio.append(element('strong', value)); ratios.append(ratio);
    }
    body.append(ratios, element('p', `Base declarada: ${result.reportedSalesBasis}`, 'help'));
    body.append(element('p', `Atribución: ${accountInput().adMetrics.attributionWindow}`, 'help'));
  } else body.append(element('p', 'ACOS, TACOS y ROAS: sin bases del informe. No se han calculado.', 'help'));
  if (result.warnings.length) {
    const warnings = element('ul', undefined, 'warnings');
    result.warnings.forEach(warning => warnings.append(element('li', warning)));
    body.append(warnings);
  }
  results.replaceChildren(body); results.hidden = false; empty.hidden = true; error.hidden = true;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  try { renderAccount(calculateAccount(accountInput())); }
  catch (failure) { results.hidden = true; empty.hidden = false; error.textContent = failure.message; error.hidden = false; }
});
form.addEventListener('input', () => { invalidate(); unitResult.replaceChildren(); });
adsToggle.addEventListener('change', syncAds);
document.querySelector('#clear').addEventListener('click', () => {
  form.reset(); syncAds(); invalidate(); unitForm.reset(); unitResult.replaceChildren(); unitError.hidden = true;
});
document.querySelector('#example').addEventListener('click', () => {
  const values = { start: example.period.start, end: example.period.end, currency: example.currency,
    netRevenue: example.netRevenue, ...example.variableCosts, otherVariable: example.variableCosts.other,
    adSpend: example.adSpend, agency: example.fixedCosts.agency, otherFixed: example.fixedCosts.other,
    ...example.adMetrics };
  for (const [key, value] of Object.entries(values)) if (form.elements.namedItem(key)) form.elements.namedItem(key).value = value;
  adsToggle.checked = true; syncAds(); form.requestSubmit(); exampleLabel.hidden = false;
});
unitForm.addEventListener('input', () => { unitResult.replaceChildren(); unitError.hidden = true; });
unitForm.addEventListener('submit', event => {
  event.preventDefault();
  try {
    const data = new FormData(unitForm);
    const result = calculateUnit(Object.fromEntries([...data].map(([key, value]) => [key, Number(value)])));
    const output = element('div', undefined, 'unit-output');
    output.append(element('strong', `Margen antes de publicidad: ${money(result.marginBeforeAds, form.elements.currency.value)} (${pct(result.marginBeforeAdsPct)}).`, result.marginBeforeAds < 0 ? 'loss' : ''));
    output.append(element('p', `ACOS de equilibrio teórico: ${pct(result.breakEvenAcosPct)}. ${result.warning}`));
    unitResult.replaceChildren(output); unitError.hidden = true;
  } catch (failure) { unitResult.replaceChildren(); unitError.textContent = failure.message; unitError.hidden = false; }
});
// Clear restored browser form values on load; the application keeps no saved inputs.
form.reset(); unitForm.reset(); syncAds();
