import { validDate } from './economics.mjs';
import { FEE_VERSION, REFERRAL_CATEGORIES, ENVELOPES, STANDARD_PACKAGES, SELECTED_PACKAGES, OVERSIZE, STORAGE_RATES } from './es-fees-2026.mjs';
export const roundMoney = value => Math.round((value + Number.EPSILON * Math.max(1,Math.abs(value))) * 100) / 100;
const fits = (dims, limit) => dims.every((value, i) => value <= limit[i] + 1e-9);
const within = (value, limit) => value <= limit + 1e-9;
const steps = (value, base, step) => Math.max(0, Math.ceil((value - base) / step - 1e-9));
const positive = (value, name, allowZero = false, max = 1e8) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < (allowZero ? 0 : Number.MIN_VALUE) || value > max) throw new TypeError(`${name}: introduce un número ${allowZero ? 'no negativo' : 'mayor que cero'} válido.`);
  return value;
};
export function referralFee(categoryId, grossPrice, primeEligible) {
  positive(grossPrice, 'Precio');
  const category = REFERRAL_CATEGORIES.find(item => item.id === categoryId);
  if (!category) throw new TypeError('Selecciona una categoría tarifaria cubierta. Un subnicho no determina por sí solo la tarifa.');
  let bands = category.bands, mode = category.mode;
  if (category.primeClothing && primeEligible && grossPrice > 45) { bands = [[45,.15],[null,.07]]; mode = 'progressive'; }
  const grossCents=Math.round(grossPrice*100);
  if (Math.abs(grossPrice*100-grossCents)>1e-5) throw new TypeError('El precio final debe tener como máximo dos decimales.');
  // Accumulate integer cent × basis-point products; round the commission only once.
  let numerator=0;
  if (mode === 'whole') numerator=grossCents*Math.round(bands.find(([limit]) => limit===null || within(grossPrice,limit))[1]*10000);
  else { let from=0; for(const [limit,rate] of bands){const to=limit===null?grossCents:Math.min(grossCents,Math.round(limit*100));if(to>from)numerator+=(to-from)*Math.round(rate*10000);if(to>=grossCents)break;from=to;} }
  const feeCents=Math.max(Math.round(category.minimum*100),Math.round(numerator/10000));
  return { fee: feeCents/100, minimum: category.minimum, mode, bands, category };
}
export function estimateFba({ dimensions, weightKg, grossPrice, categoryId, date, hazardous = false, lithium = false }) {
  if (!validDate(date) || date < FEE_VERSION.from || date > FEE_VERSION.through) throw new TypeError('La tabla verificada cubre del 1 de julio al 31 de diciembre de 2026.');
  if (!Array.isArray(dimensions) || dimensions.length !== 3) throw new TypeError('Introduce las tres dimensiones del producto embalado.');
  dimensions.forEach(value => positive(value, 'Dimensiones', false, 1000)); positive(weightKg, 'Peso', false, 150); positive(grossPrice, 'Precio');
  if (typeof hazardous !== 'boolean' || typeof lithium !== 'boolean') throw new TypeError('Confirma si el producto es peligroso o contiene litio.');
  const category = REFERRAL_CATEGORIES.find(item => item.id === categoryId);
  if (!category) throw new TypeError('Categoría no cubierta.');
  const dims = [...dimensions].sort((a,b) => b-a), volumeM3 = dims.reduce((a,b) => a*b,1) / 1e6;
  const dimensionalWeightKg = volumeM3 * 200, fuelRate = date >= '2026-11-02' ? .02 : .015;
  const common = { dimensions: dims, volumeM3, dimensionalWeightKg, unitWeightKg: weightKg, fuelRate, lowPriceThreshold: category.lowPriceMax };
  if (hazardous || lithium) return { ...common, supported: false, reason: 'Mercancía peligrosa o con litio: valida la elegibilidad y la tarifa completa en Amazon. Esta versión no presupone un recargo o tarifa cero.' };
  const lowPrice = grossPrice <= category.lowPriceMax && weightKg <= .4 + 1e-9 && fits(dims,[35,25,12]);
  let tier, baseFee, chargeableWeightKg = weightKg, weightBasis = 'unit', rows, matchedRow, page;
  tier = ENVELOPES.find(item => fits(dims,item.dimensions) && within(weightKg,item.maxUnit));
  if (tier) {
    rows = tier.bands.map(([max,normal,low]) => ({ limitKg: max, fee: lowPrice ? low : normal }));
    matchedRow = rows.find(item => within(weightKg,item.limitKg)); baseFee = matchedRow.fee; page = lowPrice ? 5 : 6;
  } else if (lowPrice) {
    tier = { id: 'low_small', label: 'Paquete pequeño · bajo precio', dimensions: [35,25,12] };
    rows = [{ limitKg: .15, fee: 3.23 },{ limitKg: .4, fee: 3.46 }]; matchedRow = rows.find(item => within(weightKg,item.limitKg)); baseFee = matchedRow.fee; page = 5;
  } else if (category.selected && (tier = SELECTED_PACKAGES.find(item => fits(dims,item.dimensions) && within(weightKg,item.maxUnit)))) {
    const increments = steps(weightKg,.1,.1); baseFee = roundMoney(tier.base + increments*tier.increment); page = 8;
    rows = [{ label: 'Primeros 100 g', fee: tier.base },{ label: 'Cada 100 g adicionales o fracción', fee: tier.increment }];
    matchedRow = { increments, stepKg: .1, baseKg: .1 };
  } else {
    chargeableWeightKg = Math.max(weightKg,dimensionalWeightKg); weightBasis = 'max';
    tier = STANDARD_PACKAGES.find(item => !category.selected && fits(dims,item.dimensions) && within(weightKg,item.maxUnit) && within(dimensionalWeightKg,item.maxDimensional));
    if (tier) { rows = tier.bands.map(([limitKg,fee]) => ({ limitKg,fee })); matchedRow = rows.find(item => within(chargeableWeightKg,item.limitKg)); baseFee = matchedRow.fee; page = 6; }
    else {
      const girth = dims[0] + 2*(dims[1]+dims[2]);
      if (weightKg > 31.5 || dims[0] > 175 || girth > 360) return { ...common, supported: false, reason: 'Tamaño grande especial: requiere confirmar elegibilidad y tarifa en Amazon; no se extrapola una tarifa de otro tramo.' };
      tier = OVERSIZE.find(item => (!item.dimensions || fits(dims,item.dimensions)) && (!item.minUnitExclusive || weightKg > item.minUnitExclusive) && within(weightKg,item.maxUnit) && within(dimensionalWeightKg,item.maxDimensional));
      if (!tier) return { ...common, supported: false, reason: 'Las dimensiones o el peso exceden las reglas verificadas. Confirma el nivel de tamaño y la tarifa en Amazon.' };
      // Oversize additions are proportional per kg above the base threshold (not 100 g package increments).
      baseFee = roundMoney(tier.base + Math.max(0,chargeableWeightKg-tier.baseWeight)*tier.perKg); page = 6;
      rows = [{ label: `Base hasta ${tier.baseWeight} kg`, fee: tier.base },{ label: 'Por kg adicional', fee: tier.perKg }]; matchedRow = { baseKg: tier.baseWeight, extraKg: Math.max(0,chargeableWeightKg-tier.baseWeight) };
    }
  }
  const fuelFee = roundMoney(baseFee*fuelRate);
  return { ...common, supported: true, tierId: tier.id, tierLabel: tier.label, tierDimensions: tier.dimensions || null,
    lowPrice, chargeableWeightKg, weightBasis, baseFee, fuelFee, totalFee: roundMoney(baseFee+fuelFee), rows, matchedRow, page,
    storageGroup: tier.id.startsWith('oversize_') ? 'oversize' : category.apparelStorage ? 'apparel' : 'standard' };
}
function validateProduct(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Faltan los datos del producto.');
  const allowed = ['marketplace','date','categoryId','grossPrice','vatPct','dimensions','weightKg','method','sellerCountry','primeEligible','hazardous','lithium','landedCost','inbound','prep','returns','otherUnit','monthlyUnits','plan','planAllocationPct','otherMonthly','storageDays','advertising','fbmShipping'];
  if (Object.keys(input).some(key => !allowed.includes(key))) throw new TypeError('Hay campos no admitidos en los datos del producto.');
  if (input.marketplace !== 'ES') throw new TypeError('Esta versión cubre Amazon.es, con inventario FBA local en España o envío propio.');
  if (!['FBA','FBM'].includes(input.method)) throw new TypeError('Elige FBA local o FBM.');
  if (!['ES','IT','FR','UK','OTHER'].includes(input.sellerCountry)) throw new TypeError('Declara el país de establecimiento para servicios digitales.');
  for (const key of ['primeEligible','hazardous','lithium']) if (typeof input[key] !== 'boolean') throw new TypeError(`Confirma ${key}.`);
  positive(input.grossPrice,'Precio'); positive(input.landedCost,'Coste del producto',true);
  positive(input.monthlyUnits,'Ventas mensuales'); if (!Number.isInteger(input.monthlyUnits)) throw new TypeError('Las ventas mensuales deben ser unidades enteras.');
  positive(input.vatPct,'IVA',true,100); positive(input.planAllocationPct,'Porcentaje de cuota asignado',true,100);
  if (!['professional','individual'].includes(input.plan)) throw new TypeError('Plan de vendedor no reconocido.');
  positive(input.storageDays,'Estancia en almacén',true,240);
  for (const key of ['inbound','prep','returns','otherUnit','otherMonthly']) if (input[key] !== null) positive(input[key],key,true);
  if (input.method === 'FBM') positive(input.fbmShipping,'Coste de envío propio',true);
  const ad = input.advertising;
  if (!ad || !['unit','tacos','acos'].includes(ad.mode)) throw new TypeError('Indica cómo estimar el gasto publicitario.');
  positive(ad.value,'Publicidad',true,ad.mode==='unit' ? 1e8 : 1000);
  if (ad.salesBasis !== undefined && !['gross','net'].includes(ad.salesBasis)) throw new TypeError('La base publicitaria debe ser precio con IVA o ingresos sin IVA.');
  if (ad.mode==='acos') positive(ad.adSalesSharePct,'Proporción de ventas atribuidas',true,100);
}
export function estimateProduct(input) {
  validateProduct(input);
  const referral = referralFee(input.categoryId,input.grossPrice,input.primeEligible);
  const fba = estimateFba(input); // validates the packed product/date even for the comparison with FBM.
  const warnings = ['Estimación por tabla, no una tarifa consultada en tu ASIN. La categoría tarifaria final la asigna Amazon.'];
  if (input.date > FEE_VERSION.reviewed) warnings.push('La fecha elegida es posterior a la última revisión de la tabla; confirma que no haya cambios nuevos.');
  const missing = ['inbound','prep','returns','otherUnit','otherMonthly'].filter(key => input[key] === null && !(key==='inbound' && input.method==='FBM'));
  if (input.storageDays >= 241) throw new TypeError('Inventario antiguo fuera del alcance del estimador.');
  if (input.method==='FBA' && !fba.supported) return { supported:false, fba, referralFee:referral.fee, warnings, missing };
  const netRevenue = input.grossPrice/(1+input.vatPct/100);
  const logistics = input.method==='FBA' ? fba.totalFee : input.fbmShipping;
  const digitalReferral = roundMoney(referral.fee*.03);
  const digitalFba = input.method==='FBA' && ['FR','UK'].includes(input.sellerCountry) ? roundMoney(logistics*.03) : 0;
  const volumeM3 = fba.volumeM3, highSeason = Number(input.date.slice(5,7)) >= 10;
  const storageGroup = fba.storageGroup || (referral.category.apparelStorage ? 'apparel' : 'standard');
  const storageRate = STORAGE_RATES[storageGroup][highSeason ? 1 : 0];
  const storage = input.method==='FBA' ? volumeM3*storageRate*input.storageDays/30 : 0;
  const planUnit = input.plan==='individual' ? .99 : 39*input.planAllocationPct/100/input.monthlyUnits;
  const otherFixed = (input.otherMonthly ?? 0)/input.monthlyUnits;
  const advertisingSalesBasis = input.advertising.salesBasis==='net' ? 'net' : 'gross';
  const advertisingRevenue = advertisingSalesBasis==='net' ? netRevenue : input.grossPrice;
  const advertising = input.advertising.mode==='unit' ? input.advertising.value : advertisingRevenue*input.advertising.value/100*(input.advertising.mode==='acos' ? input.advertising.adSalesSharePct/100 : 1);
  const inbound = input.method==='FBA' ? input.inbound : 0;
  const ownCosts = input.landedCost+(inbound??0)+(input.prep??0)+(input.returns??0)+(input.otherUnit??0);
  const costs = { landedCost:input.landedCost, referral:referral.fee, digitalReferral, logistics, digitalFba, storage, plan:planUnit,
    inbound, prep:input.prep, returns:input.returns, otherUnit:input.otherUnit, otherFixed:input.otherMonthly===null ? null : otherFixed, advertising };
  const beforeAds = netRevenue-ownCosts-referral.fee-digitalReferral-logistics-digitalFba-storage-planUnit-otherFixed;
  const contribution = beforeAds-advertising;
  if (input.method==='FBA') warnings.push('Almacenamiento base estimado con estancia media y meses de 30 días. No incluye recargos por sobreutilización, inventario antiguo ni programas paneuropeos.');
  if (input.method==='FBA' && fba.tierId.startsWith('oversize_')) warnings.push('Gran tamaño: incremento modelado proporcionalmente por kg de exceso. Confirma el redondeo y la tarifa final en la calculadora oficial.');
  if (missing.length) warnings.push('El margen es parcial: hay gastos propios sin indicar. No se han estimado automáticamente ni se consideran confirmados como cero.');
  warnings.push('Ingresos sin IVA de venta; gastos sin IVA recuperable. El IVA no recuperable debe incorporarse en tus costes. No es beneficio neto contable.');
  return { supported:true, feeVersion:FEE_VERSION.id, categoryLabel:referral.category.label, referral, fba, method:input.method, netRevenue, salesVat:input.grossPrice-netRevenue,
    grossPrice:input.grossPrice, costs, totalCosts:netRevenue-contribution, contribution, marginPct:contribution/netRevenue*100, contributionBeforeAds:beforeAds,
    maxAdSpendPerUnit:Math.max(0,beforeAds), breakEvenAcosPct:beforeAds>0 ? beforeAds/advertisingRevenue*100 : null, advertisingSalesBasis,
    monthlyContribution:contribution*input.monthlyUnits, storageRate, storageGroup, highSeason, missing, warnings };
}
export function priceScenarios(input) {
  return [.9,1,1.1].map(factor => { const price=roundMoney(input.grossPrice*factor); return { price, factor, result:estimateProduct({...input,grossPrice:price}) }; });
}
