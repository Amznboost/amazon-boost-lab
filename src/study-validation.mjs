import { validDate } from './economics.mjs';

export const STUDY_COLUMNS = Object.freeze(['date', 'product_id', 'availability', 'units_ordered', 'ad_spend', 'price', 'promotion', 'content_changed']);
const DAY = 86400000;
const LIMITS = Object.freeze({ characters: 2000000, rows: 10000, days: 3660 });
const STATES = ['available', 'out_of_stock', 'partial', 'unknown'];
const time = date => Date.parse(`${date}T00:00:00Z`);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasOnly = (value, allowed) => isRecord(value) && Object.keys(value).every(key => allowed.includes(key));

/** Strict comma-separated CSV. Quoted fields, CRLF, BOM and escaped quotes are supported. */
export function parseCsv(text) {
  if (typeof text !== 'string' || text.length > LIMITS.characters) throw new TypeError('CSV: utiliza texto de hasta dos millones de caracteres.');
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = [], field = '', quoted = false, closed = false;
  const fieldEnd = () => { row.push(field); field = ''; closed = false; };
  const rowEnd = () => { fieldEnd(); rows.push(row); row = []; if (rows.length > LIMITS.rows + 1) throw new TypeError('CSV: el límite es de 10.000 observaciones.'); };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else field += char;
      continue;
    }
    if (char === ',') { fieldEnd(); continue; }
    if (char === '\n' || char === '\r') { if (char === '\r' && text[i + 1] === '\n') i++; rowEnd(); continue; }
    if (closed) throw new TypeError('CSV: hay texto después del cierre de un campo entre comillas.');
    if (char === '"') { if (field) throw new TypeError('CSV: comillas dentro de un campo sin delimitar.'); quoted = true; }
    else field += char;
  }
  if (quoted) throw new TypeError('CSV: hay un campo con comillas sin cerrar.');
  if (field || row.length || closed) rowEnd();
  if (!rows.length) throw new TypeError('CSV: falta el encabezado.');
  return rows;
}

/** Reports structural readiness for review, never truth, anonymization, permission or causality. */
export function validateStudy(metadata, csv) {
  const errors = [], warnings = [], notes = [];
  const issue = (list, code, message, row, column) => list.push({ code, message, ...(row !== undefined ? { row } : {}), ...(column ? { column } : {}) });
  const summary = { rows: 0, products: 0, expectedObservations: 0, missingObservations: 0, states: Object.fromEntries(STATES.map(state => [state, 0])), availableWithZeroUnits: 0 };
  const finish = () => ({ status: errors.length ? 'invalid' : warnings.length ? 'needs_review' : 'structurally_valid', summary, errors, warnings, notes,
    limitations: ['Comprueba estructura y coherencia interna; no verifica los informes originales.', 'No acredita anonimización, permiso de publicación ni relación causal.', 'No calcula ventas perdidas ni una mejora atribuible a una intervención.'] });
  const allowed = ['schemaVersion', 'datasetId', 'marketplace', 'currency', 'timeZone', 'period', 'primaryMetric', 'definitions', 'sources'];
  if (!hasOnly(metadata, allowed)) { issue(errors, 'metadata_shape', 'La ficha necesita un objeto con los campos documentados, sin campos adicionales.'); return finish(); }
  if (metadata.schemaVersion !== '1.0') issue(errors, 'schema_version', 'La versión del formato debe ser 1.0.');
  if (typeof metadata.datasetId !== 'string' || !/^D\d{3,6}$/.test(metadata.datasetId)) issue(errors, 'dataset_alias', 'Usa un alias de conjunto como D001, sin nombre de cliente.');
  if (typeof metadata.marketplace !== 'string' || !/^[A-Z]{2}$/.test(metadata.marketplace)) issue(errors, 'marketplace', 'Declara un único mercado con dos letras mayúsculas, por ejemplo ES.');
  if (typeof metadata.currency !== 'string' || !/^[A-Z]{3}$/.test(metadata.currency)) issue(errors, 'currency', 'Declara una única divisa con tres letras mayúsculas.');
  try { if (typeof metadata.timeZone !== 'string' || !metadata.timeZone.trim()) throw new Error(); new Intl.DateTimeFormat('es', { timeZone: metadata.timeZone }); }
  catch { issue(errors, 'time_zone', 'Documenta una zona horaria válida y común a las observaciones.'); }
  let days = 0;
  if (!hasOnly(metadata.period, ['start', 'end']) || !validDate(metadata.period.start) || !validDate(metadata.period.end) || metadata.period.start > metadata.period.end) issue(errors, 'period', 'El periodo debe tener fechas reales y ordenadas.');
  else {
    days = (time(metadata.period.end) - time(metadata.period.start)) / DAY + 1;
    if (days > LIMITS.days) issue(errors, 'period_limit', 'Acota el periodo a un máximo de 3.660 días.');
  }
  if (metadata.primaryMetric !== 'units_ordered') issue(errors, 'primary_metric', 'Esta versión revisa unidades pedidas por producto y día; no acepta totales mensuales ni métricas atribuidas como equivalentes.');
  const definitionKeys = ['availability', 'units', 'advertising', 'price'];
  if (!hasOnly(metadata.definitions, definitionKeys)) issue(errors, 'definitions_shape', 'Documenta las cuatro definiciones: disponibilidad, unidades, gasto y precio.');
  else for (const key of definitionKeys) if (typeof metadata.definitions[key] !== 'string' || !metadata.definitions[key].trim() || metadata.definitions[key].length > 1000) issue(errors, 'definition_missing', 'Falta una definición o supera los 1.000 caracteres.', undefined, key);
  if (!hasOnly(metadata.sources, definitionKeys)) issue(errors, 'sources_shape', 'Relaciona las cuatro métricas con sus fuentes mediante alias.');
  else for (const key of definitionKeys) if (typeof metadata.sources[key] !== 'string' || !/^S\d{3,6}$/.test(metadata.sources[key])) issue(errors, 'source_alias', 'Usa un alias de fuente como S001; conserva el informe y su correspondencia en privado.', undefined, key);
  if (errors.length) return finish();
  let table;
  try { table = parseCsv(csv); }
  catch (failure) { issue(errors, 'csv_format', failure.message); return finish(); }
  const [header, ...rows] = table;
  if (header.length !== STUDY_COLUMNS.length || new Set(header).size !== header.length || !STUDY_COLUMNS.every(key => header.includes(key))) {
    issue(errors, 'columns', 'El encabezado debe contener exactamente las ocho columnas documentadas, sin campos adicionales ni repetidos. Separador: coma.'); return finish();
  }
  if (!rows.length) issue(errors, 'empty', 'El fichero no contiene observaciones.');
  const positions = Object.fromEntries(header.map((column, index) => [column, index]));
  const groups = new Map(), keys = new Set();
  for (const [index, row] of rows.entries()) {
    const line = index + 2; summary.rows++;
    if (row.length !== header.length) { issue(errors, 'row_width', 'La fila no tiene ocho campos; revisa vacíos, separadores y comillas.', line); continue; }
    const data = Object.fromEntries(STUDY_COLUMNS.map(key => [key, row[positions[key]].trim()]));
    const rowErrorsBefore = errors.length;
    if (!validDate(data.date) || data.date < metadata.period.start || data.date > metadata.period.end) issue(errors, 'date', 'La fecha no es válida o queda fuera del periodo declarado.', line, 'date');
    if (!/^P\d{3,6}$/.test(data.product_id)) issue(errors, 'product_alias', 'Usa un alias como P001, sin ASIN, SKU, título ni identificador original.', line, 'product_id');
    if (!STATES.includes(data.availability)) issue(errors, 'availability', 'Disponibilidad: available, out_of_stock, partial o unknown; no se infiere de las ventas.', line, 'availability');
    if (!/^\d+$/.test(data.units_ordered) || Number(data.units_ordered) > 1000000000) issue(errors, 'units', 'Las unidades deben ser un entero no negativo. Un vacío no es cero.', line, 'units_ordered');
    for (const key of ['ad_spend', 'price']) if (!/^\d+(?:\.\d{1,2})?$/.test(data[key]) || Number(data[key]) > 1e12) issue(errors, 'amount', 'Introduce un importe no negativo con punto decimal y hasta dos decimales. No se sustituyen vacíos por cero.', line, key);
    for (const key of ['promotion', 'content_changed']) if (!['0', '1', 'unknown'].includes(data[key])) issue(errors, 'context', 'Declara 0, 1 o unknown para este evento.', line, key);
    if (errors.length !== rowErrorsBefore) continue;
    const key = `${data.product_id}|${data.date}`;
    if (keys.has(key)) { issue(errors, 'duplicate', 'Producto y fecha repetidos: no se suman ni se elige una fila automáticamente.', line); continue; }
    keys.add(key);
    if (!groups.has(data.product_id)) groups.set(data.product_id, []);
    groups.get(data.product_id).push({ ...data, units_ordered: Number(data.units_ordered), ad_spend: Number(data.ad_spend), price: Number(data.price), line });
    summary.states[data.availability]++;
    if (data.availability === 'available' && Number(data.units_ordered) === 0) summary.availableWithZeroUnits++;
    if (data.availability === 'out_of_stock' && Number(data.units_ordered) > 0) issue(warnings, 'units_without_stock', 'Hay unidades pedidas junto a un día declarado completamente sin stock; revisa la fuente, el horario y la definición.', line);
  }
  summary.products = groups.size;
  summary.expectedObservations = groups.size * days;
  summary.missingObservations = summary.expectedObservations - keys.size;
  if (summary.missingObservations > 0) issue(warnings, 'missing_days', 'Faltan observaciones producto-día dentro del periodo. No se rellenan con ceros; documenta cobertura, altas y exclusiones.');
  if (summary.states.unknown) issue(warnings, 'unknown_availability', 'Hay días sin estado de disponibilidad conocido; no se clasifican como días con stock ni sin stock.');
  if (summary.states.partial) issue(warnings, 'partial_availability', 'Hay disponibilidad parcial: no equivale a un día completo con stock ni sin stock.');
  const all = [...groups.values()].flat();
  if (all.some(data => data.promotion === '1')) issue(warnings, 'promotion', 'Hay promociones; deben considerarse al interpretar diferencias de unidades.');
  if (all.some(data => data.content_changed === '1')) issue(warnings, 'content_changes', 'Hay cambios de contenido; no atribuyas toda la evolución al stock.');
  if (all.some(data => data.promotion === 'unknown' || data.content_changed === 'unknown')) issue(warnings, 'unknown_context', 'Falta confirmar parte del contexto de promociones o cambios.');
  for (const [product, observations] of groups) {
    const ordered = [...observations].sort((a, b) => a.date.localeCompare(b.date));
    if (ordered.some((item, index) => index && item.price !== ordered[index - 1].price)) issue(warnings, 'price_changes', `Hay cambios de precio entre observaciones de ${product}; revisa su efecto antes de comparar.`);
    if (ordered.some((item, index) => index && item.ad_spend !== ordered[index - 1].ad_spend)) issue(notes, 'ad_spend_changes', `El gasto publicitario varía en ${product}. El fichero no mide por sí solo el efecto de esa variación.`);
  }
  if (summary.availableWithZeroUnits) issue(notes, 'zero_sales_not_stockout', 'Existen días con stock declarado y cero unidades. Se mantienen con stock; cero ventas no demuestra rotura de stock.');
  return finish();
}
