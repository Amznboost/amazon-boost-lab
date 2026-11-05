import { estimateProduct, priceScenarios } from '../src/product-estimator.mjs';
import { REFERRAL_CATEGORIES, FEE_SOURCES } from '../src/es-fees-2026.mjs';
import example from '../src/product-example.mjs';
const form=document.querySelector('#product-form'), output=document.querySelector('#product-results'), empty=document.querySelector('#product-empty'), scenarios=document.querySelector('#scenarios');
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const euro=v=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(v);
const num=v=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:3}).format(v);
const percent=v=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}).format(v);
const volume=v=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:6}).format(v);
const field=(name,label,type='number',value='',help='',options)=>{
 const wrap=el('label',label), control=el(type==='select'?'select':'input');control.name=name;control.id=`product-${name}`;
 if(type==='select'){for(const [v,t]of options) {const o=el('option',t);o.value=v;control.append(o);}}
 else {control.type=type;if(type==='number'){control.min='0';control.max='1000000';control.step='0.01';control.inputMode='decimal';}}
 control.value=String(value);if(type==='select'){for(const option of control.options)option.defaultSelected=option.value===String(value);}else control.defaultValue=String(value);wrap.append(control);if(help)wrap.append(el('span',help,'help'));return wrap;
};
const group=(title,fields,container=form)=>{const fs=el('fieldset'), grid=el('div',undefined,'fields two');fs.append(el('legend',title));fields.forEach(item=>grid.append(item));fs.append(grid);container.append(fs);return fs;};
const check=(name,label,checked=false,container=form)=>{const wrap=el('label',undefined,'checkbox'),input=el('input');input.type='checkbox';input.name=name;input.checked=checked;input.defaultChecked=checked;wrap.append(input,el('span',label));container.append(wrap);};
const categories=[['','Selecciona una categoría tarifaria'],...REFERRAL_CATEGORIES.map(c=>[c.id,c.label])];
group('Tu producto y su precio',[
 field('categoryId','Categoría tarifaria Amazon','select','','No se asigna una tarifa genérica por escribir un subnicho.',categories),
 field('grossPrice','Precio final al cliente (€)','number','','IVA y portes o regalo cobrados al cliente incluidos.'),
 field('landedCost','Coste de compra aterrizado (€)','number','','Producto e importación hasta tu almacén, sin IVA recuperable.'),
 field('vatPct','IVA del producto (%)','number',21,'Hipótesis inicial editable; indica el tipo aplicable.'),
 field('monthlyUnits','Unidades previstas al mes','number',100,'Hipótesis editable para repartir cuota y proyectar el mes.'),
]);
const measurements=group('Medidas exteriores de la unidad embalada',[
 field('length','Largo (cm)'),field('width','Ancho (cm)'),field('height','Alto (cm)'),field('weightGrams','Peso bruto (g)'),
]);
measurements.append(el('p','Ordenamos las medidas y calculamos el peso dimensional. Indica si el producto tiene condiciones especiales.','help'));
check('hazardous','Mercancía peligrosa (aerosoles, inflamables u otros)',false,measurements);
check('lithium','Contiene batería de litio',false,measurements);
const logistics=group('Cómo lo venderías',[
 field('method','Gestión logística','select','FBA','',[['FBA','FBA local · inventario en España'],['FBM','FBM · lo envías tú']]),
 field('date','Fecha de referencia','date','2026-11-05'),
 field('storageDays','Estancia media en FBA (días)','number',30,'30 días es un supuesto de rotación, no un dato de tu cuenta.'),
 field('fbmShipping','Transporte FBM por pedido (€)','number','','Opcional con FBA: añade tu transporte para comparar; obligatorio para FBM. Sin almacén ni preparación propia.'),
]);
check('primeEligible','Oferta apta para Prime (afecta a ropa de más de 45 €)',true,logistics);
group('Publicidad prevista',[
 field('adMode','Cómo estimar publicidad','select','unit','',[['unit','Euros por unidad vendida'],['tacos','TACOS sobre ventas totales'],['acos','ACOS y proporción de ventas atribuidas']]),
 field('adValue','Gasto publicitario (€/venta o %)','number',0,'0 € es el escenario inicial sin publicidad. Ajusta tu previsión.'),
 field('adSalesSharePct','Ventas atribuidas / ventas totales (%)','number','','Solo para ACOS: no se aplica ACOS a todas las ventas.'),
 field('adSalesBasis','Base de ventas del porcentaje','select','gross','Debe coincidir con el informe de donde tomas el porcentaje.',[['gross','Precio final con IVA'],['net','Ingresos sin IVA']]),
]);
const advanced=el('details',undefined,'advanced');advanced.id='product-advanced';advanced.append(el('summary','Costes propios y condiciones del vendedor'));
advanced.append(el('p','Los vacíos se mantienen pendientes. Escribe 0 solo si confirmas que ese coste no existe. Todos los gastos, sin IVA recuperable.','help'));
group('Completa los gastos que conozcas',[
 field('inbound','Envío a Amazon por unidad (€)'),field('prep','Preparación adicional por unidad (€)'),field('returns','Devoluciones e incidencias por unidad (€)'),field('otherUnit','Otros gastos por unidad (€)'),field('otherMonthly','Otros fijos mensuales asignados (€)'),
 field('plan','Plan de vendedor','select','professional','',[['professional','Profesional · 39 €/mes sin IVA'],['individual','Individual · 0,99 €/unidad sin IVA']]),
 field('planAllocationPct','Cuota profesional asignada al producto (%)','number',100,'Imputamos toda la cuota inicialmente. Reduce el porcentaje si la repartes entre varios productos.'),
 field('sellerCountry','Sede del vendedor','select','ES','Afecta a la base de la tarifa por servicios digitales.',[['ES','España'],['IT','Italia'],['FR','Francia'],['UK','Reino Unido'],['OTHER','Otro país']]),
],advanced);form.append(advanced);
const error=el('p',undefined,'error');error.id='product-error';error.hidden=true;error.setAttribute('role','alert');form.append(error);
const actions=el('div',undefined,'actions'),calculate=el('button','Estimar costes y margen ↗','button'),clear=el('button','Vaciar producto','text-button');calculate.type='submit';clear.type='button';actions.append(calculate,clear);form.append(actions);
const exampleNote=el('p','Producto de ejemplo sintético: no es un cliente ni un resultado comercial. Tarifas tomadas de las fuentes oficiales indicadas.','example-label');exampleNote.hidden=true;form.append(exampleNote);
const c=name=>form.elements.namedItem(name);
for(const name of ['categoryId','grossPrice','landedCost','vatPct','monthlyUnits','length','width','height','weightGrams','method','date','storageDays','planAllocationPct'])c(name).required=true;
for(const name of ['grossPrice','length','width','height'])c(name).min='.01';
c('weightGrams').min='1';c('weightGrams').max='150000';c('weightGrams').step='1';c('monthlyUnits').min='1';c('monthlyUnits').step='1';
for(const name of ['vatPct','planAllocationPct','adSalesSharePct'])c(name).max='100';c('storageDays').max='240';c('date').min='2026-07-01';c('date').max='2026-12-31';
c('adValue').required=true;
function sync(){const acos=c('adMode').value==='acos';c('adSalesSharePct').disabled=!acos;c('adSalesSharePct').required=acos;c('adSalesSharePct').parentElement.hidden=!acos;c('adSalesBasis').parentElement.hidden=c('adMode').value==='unit';c('fbmShipping').required=c('method').value==='FBM';}
function invalidate(){output.hidden=true;output.replaceChildren();empty.hidden=false;scenarios.hidden=true;error.hidden=true;exampleNote.hidden=true;}
function read(){const number=name=>Number(c(name).value),nullable=name=>c(name).value.trim()===''?null:number(name);
 return {marketplace:'ES',date:c('date').value,categoryId:c('categoryId').value,grossPrice:number('grossPrice'),vatPct:number('vatPct'),dimensions:['length','width','height'].map(number),weightKg:number('weightGrams')/1000,method:c('method').value,sellerCountry:c('sellerCountry').value,primeEligible:c('primeEligible').checked,hazardous:c('hazardous').checked,lithium:c('lithium').checked,
 landedCost:number('landedCost'),inbound:nullable('inbound'),prep:nullable('prep'),returns:nullable('returns'),otherUnit:nullable('otherUnit'),monthlyUnits:number('monthlyUnits'),plan:c('plan').value,planAllocationPct:number('planAllocationPct'),otherMonthly:nullable('otherMonthly'),storageDays:number('storageDays'),advertising:{mode:c('adMode').value,value:number('adValue'),salesBasis:c('adSalesBasis').value,...(c('adMode').value==='acos'?{adSalesSharePct:number('adSalesSharePct')}:{})},fbmShipping:nullable('fbmShipping')};}
function link(label,href){const a=el('a',label);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a;}
function render(result,input){const body=el('div',undefined,'result-body');
 if(!result.supported){body.append(el('p','Necesita comprobarse en Amazon','calculated-tag partial-tag'),el('p',result.fba.reason,'error'),link('Consultar calculadora oficial ↗',FEE_SOURCES.calculator));output.replaceChildren(body);output.hidden=false;empty.hidden=true;scenarios.hidden=true;return;}
 const tier=el('div',undefined,'product-tier');tier.append(el('h4',input.method==='FBA'?result.fba.tierLabel:'FBM · envío propio'));
 tier.append(el('p',`${input.dimensions.join(' × ')} cm · ${num(input.weightKg*1000)} g brutos`));
 if(input.method==='FBA'){tier.append(el('p',`Peso dimensional: ${num(result.fba.dimensionalWeightKg)} kg · facturable: ${num(result.fba.chargeableWeightKg)} kg`));tier.append(el('p',result.fba.lowPrice?`FBA de bajo precio: cumple el límite de ${euro(result.fba.lowPriceThreshold)} y las condiciones de tamaño/peso.`:'FBA estándar · tabla y peso según categoría.'));tier.append(link(`Ver tabla oficial · página ${result.fba.page} ↗`,`${FEE_SOURCES.card}#page=${result.fba.page}`));}
 body.append(tier,el('span',result.missing.length?'Margen parcial · hay gastos pendientes':'Estimación con los gastos declarados',`calculated-tag${result.missing.length?' partial-tag':''}`));
 body.append(el('div',`${euro(result.contribution)} / ud.`,`result-number${result.contribution<0?' loss':''}`),el('p',`${percent(result.marginPct)} % sobre ingresos sin IVA`,'margin'));
 const list=el('dl',undefined,'reconciliation');const row=(label,value)=>{const item=el('div');item.append(el('dt',label),el('dd',value===null?'Pendiente':euro(value),value===null?'pending':undefined));list.append(item);};
 row('Precio final al cliente',input.grossPrice);row('− IVA de venta',result.salesVat);row('Ingresos sin IVA',result.netRevenue);
 row('Coste del producto',result.costs.landedCost);row('Comisión por referencia',result.costs.referral);row('Servicios digitales · referencia',result.costs.digitalReferral);
 if(input.method==='FBA'){row('FBA base',result.fba.baseFee);row(`Combustible/logística · ${result.fba.fuelRate*100} %`,result.fba.fuelFee);if(result.costs.digitalFba)row('Servicios digitales · FBA',result.costs.digitalFba);row('Almacenamiento base estimado',result.costs.storage);row('Transporte de entrada',result.costs.inbound);}else row('Tu transporte FBM',result.costs.logistics);
 row('Preparación adicional',result.costs.prep);row('Devoluciones / incidencias',result.costs.returns);row('Otros costes unitarios',result.costs.otherUnit);row('Cuota de vendedor repartida',result.costs.plan);row('Otros fijos repartidos',result.costs.otherFixed);row('Publicidad por venta',result.costs.advertising);body.append(list);
 const metrics=el('div',undefined,'product-outcome');for(const [label,value]of [['Contribución mensual al volumen indicado',euro(result.monthlyContribution)],['Margen disponible antes de publicidad',euro(result.contributionBeforeAds)],['ACOS de equilibrio teórico',result.breakEvenAcosPct===null?'No hay margen publicitario':`${percent(result.breakEvenAcosPct)} %`]]){const item=el('div');item.append(el('span',label),el('strong',value));metrics.append(item);}body.append(metrics,el('p','El ACOS de equilibrio usa la base publicitaria indicada abajo y supone una venta equivalente. Los campos pendientes reducen la fiabilidad del umbral. La proyección mensual se calcula antes de redondear el margen unitario mostrado.','help'));
 if(input.method==='FBA'){const details=el('details',undefined,'rate-details');details.append(el('summary','Ver el tramo y cómo se ha calculado'));const table=el('table',undefined,'rate-table'),head=el('tr');head.append(el('th','Tramo de peso / regla'),el('th','Tarifa base ES'));table.append(head);
 for(const item of result.fba.rows){const matched=item.limitKg!==undefined && result.fba.matchedRow.limitKg===item.limitKg;const r=el('tr',undefined,matched?'matched':undefined);r.append(el('td',item.label||`Hasta ${num(item.limitKg*1000)} g`),el('td',euro(item.fee)));table.append(r);}details.append(table,el('p',`Base aplicada: ${euro(result.fba.baseFee)}. Recargo: ${euro(result.fba.fuelFee)}. ${result.fba.weightBasis==='unit'?'Se utiliza peso real.':'Se utiliza el mayor entre peso real y dimensional.'}`,'help'));
 if(result.fba.matchedRow.increments!==undefined)details.append(el('p',`${result.fba.matchedRow.increments} incrementos de 100 g después de los primeros 100 g.`,'help'));
 details.append(el('p',`Volumen: ${volume(result.fba.volumeM3)} m³. Almacenamiento: volumen × ${euro(result.storageRate)}/m³/mes × ${input.storageDays}/30 días.`,'help'));body.append(details);}
 body.append(el('p',`Base de los porcentajes publicitarios: ${result.advertisingSalesBasis==='net'?'ingresos sin IVA':'precio final con IVA'}.`,'help'));
 const notes=el('ul',undefined,'model-notes');result.warnings.forEach(text=>notes.append(el('li',text)));body.append(notes);const sources=el('div',undefined,'source-links');sources.append(link('Comisiones oficiales ↗',FEE_SOURCES.referral),link('Servicios digitales ↗',FEE_SOURCES.digital));body.append(sources);
 output.replaceChildren(body);output.hidden=false;empty.hidden=true;
 const cards=document.querySelector('#price-scenarios');cards.replaceChildren();for(const scenario of priceScenarios(input)){const card=el('article',undefined,`scenario-card${scenario.factor===1?' current':''}`);card.append(el('p',scenario.factor===1?'Precio actual':scenario.factor<1?'Precio −10 %':'Precio +10 %','eyebrow'),el('h3',euro(scenario.price)));if(scenario.result.supported)card.append(el('p',`${euro(scenario.result.contribution)} / ud.`,scenario.result.contribution<0?'loss':undefined),el('small',scenario.result.method==='FBA'?`${scenario.result.fba.lowPrice?'Bajo precio':'Estándar'} · FBA ${euro(scenario.result.costs.logistics)} · referencia ${euro(scenario.result.costs.referral)}`:'Envío propio · mismos costes declarados'));else card.append(el('p','Tarifa por confirmar'));cards.append(card);}
 const compare=document.querySelector('#fbm-comparison');compare.replaceChildren();if(input.method==='FBA'&&input.fbmShipping!==null){const alternative=estimateProduct({...input,method:'FBM',primeEligible:false});const box=el('div',undefined,'fbm-box');box.append(el('h3','Y si lo envías tú…'),el('p',`FBM sin Prime: ${euro(alternative.contribution)} por unidad, con transporte de ${euro(input.fbmShipping)}. No añade costes de almacén o de operativa propia que no hayas declarado. No incluye transporte de entrada a Amazon.`));compare.append(box);}scenarios.hidden=false;
}
form.addEventListener('invalid',event=>{if(advanced.contains(event.target))advanced.open=true;},true);
form.addEventListener('input',invalidate);
c('method').addEventListener('change',()=>{c('primeEligible').checked=c('method').value==='FBA';sync();});c('adMode').addEventListener('change',sync);
form.addEventListener('submit',event=>{event.preventDefault();try{const input=read();render(estimateProduct(input),input);error.hidden=true;if(matchMedia('(max-width:900px)').matches)output.parentElement.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});}catch(failure){output.hidden=true;empty.hidden=false;scenarios.hidden=true;error.textContent=failure.message;error.hidden=false;}});
document.querySelector('#product-example').addEventListener('click',()=>{form.reset();for(const [name,value]of Object.entries(example)){if(!c(name))continue;if(typeof value==='boolean')c(name).checked=value;else c(name).value=value;}['length','width','height'].forEach((key,index)=>c(key).value=example.dimensions[index]);c('weightGrams').value=example.weightKg*1000;c('adMode').value=example.advertising.mode;c('adValue').value=example.advertising.value;sync();form.requestSubmit();exampleNote.hidden=false;});
clear.addEventListener('click',()=>{form.reset();sync();invalidate();advanced.open=false;});sync();
