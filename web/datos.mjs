import { validateStudy } from '../src/study-validation.mjs';
import { studyExampleMetadata, studyExampleCsv } from '../src/study-example.mjs';

const form = document.querySelector('#study-form');
const reportBox = document.querySelector('#study-report');
const empty = document.querySelector('#study-empty');
const error = document.querySelector('#study-error');
const exampleNote = document.querySelector('#study-example-note');
const definitions = document.querySelector('#definitions');
const metrics = ['availability', 'units', 'advertising', 'price'];
const el = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
const labels = { available: 'Con stock', out_of_stock: 'Sin stock todo el día', partial: 'Disponibilidad parcial', unknown: 'Estado desconocido' };
function clearReport() { reportBox.replaceChildren(); reportBox.hidden = true; empty.hidden = false; error.hidden = true; exampleNote.hidden = true; }
function input() {
  const data = new FormData(form);
  const metadata = { schemaVersion: '1.0', datasetId: data.get('datasetId'), marketplace: data.get('marketplace'), currency: data.get('currency'), timeZone: data.get('timeZone'),
    period: { start: data.get('start'), end: data.get('end') }, primaryMetric: 'units_ordered',
    definitions: Object.fromEntries(metrics.map(key => [key, data.get(`definition_${key}`)])),
    sources: Object.fromEntries(metrics.map(key => [key, data.get(`source_${key}`)])),
  };
  return { metadata, observations: data.get('observations') };
}
function render(report) {
  const body = el('div', undefined, 'result-body');
  const status = { invalid: ['Corrige la estructura', 'invalid', 'Hay errores que impiden utilizar esta tabla. No se han reparado ni descartado filas automáticamente.'], needs_review: ['Requiere revisión', 'review', 'La estructura permite continuar, pero hay ausencias o contexto que revisar antes de comparar.'], structurally_valid: ['Estructura correcta', '', 'No se detectaron errores ni avisos con estas reglas. Todavía hay que revisar las fuentes, el alcance y los permisos.'] }[report.status];
  body.append(el('p', status[0], `report-status ${status[1]}`), el('p', status[2], 'report-explanation'));
  const counts = el('div', undefined, 'report-counts');
  for (const [label, count] of [['Registros', report.summary.rows], ['Productos válidos', report.summary.products], ['Días-producto ausentes', report.summary.missingObservations]]) {
    const card = el('div'); card.append(el('strong', String(count)), el('span', label)); counts.append(card);
  }
  body.append(counts);
  const states = el('dl', undefined, 'reconciliation');
  for (const [key, label] of Object.entries(labels)) { const row = el('div'); row.append(el('dt', label), el('dd', String(report.summary.states[key]))); states.append(row); }
  body.append(states, el('p', 'La cobertura se calcula con las filas válidas únicas. Los registros con errores o duplicados no se suman a los estados.', 'report-note'));
  for (const [category, title] of [['errors', 'Errores que corregir'], ['warnings', 'Aspectos que revisar'], ['notes', 'Contexto que conservar']]) {
    if (!report[category].length) continue;
    const section = el('section', undefined, 'report-group'), list = el('ul', undefined, category === 'errors' ? 'error-list' : '');
    section.append(el('h4', title));
    for (const item of report[category]) list.append(el('li', `${item.row ? `Registro ${item.row}: ` : ''}${item.message}${item.column ? ` [${item.column}]` : ''}`));
    section.append(list); body.append(section);
  }
  const limitations = el('section', undefined, 'report-group'); limitations.append(el('h4', 'Lo que este resultado no demuestra'));
  report.limitations.forEach(text => limitations.append(el('p', text, 'report-note'))); body.append(limitations);
  reportBox.replaceChildren(body); reportBox.hidden = false; empty.hidden = true; error.hidden = true;
}
form.addEventListener('invalid', event => { if (definitions.contains(event.target)) definitions.open = true; }, true);
form.addEventListener('input', clearReport);
form.addEventListener('submit', event => {
  event.preventDefault();
  try { const data = input(); render(validateStudy(data.metadata, data.observations)); }
  catch { reportBox.hidden = true; empty.hidden = false; error.textContent = 'No se pudo completar la comprobación. Revisa el alcance y el formato de la tabla.'; error.hidden = false; }
});
document.querySelector('#study-example').addEventListener('click', () => {
  const values = { datasetId: studyExampleMetadata.datasetId, marketplace: studyExampleMetadata.marketplace, currency: studyExampleMetadata.currency, timeZone: studyExampleMetadata.timeZone,
    start: studyExampleMetadata.period.start, end: studyExampleMetadata.period.end, observations: studyExampleCsv };
  for (const key of metrics) { values[`definition_${key}`] = studyExampleMetadata.definitions[key]; values[`source_${key}`] = studyExampleMetadata.sources[key]; }
  for (const [key, value] of Object.entries(values)) form.elements.namedItem(key).value = value;
  form.requestSubmit(); exampleNote.hidden = false;
});
document.querySelector('#study-clear').addEventListener('click', () => { form.reset(); clearReport(); definitions.open = false; });
form.reset();
