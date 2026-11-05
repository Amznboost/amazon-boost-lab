// Spain only. Transcribed from official Amazon sources reviewed 2026-11-05.
// Amounts exclude VAT on fees. Fuel/logistics surcharge is NOT included in base FBA rows.
export const FEE_SOURCES = Object.freeze({
  card: 'https://m.media-amazon.com/images/G/02/sell/images/261014-FBA-Rate-Card-ES.pdf',
  referral: 'https://sell.amazon.es/precios',
  lowPrice: 'https://sell.amazon.es/tarifas-precio-bajo-logistica-de-amazon',
  digital: 'https://sellercentral.amazon.es/gp/help/external/GCZC4GX2L32EKP6F?locale=es-ES',
  calculator: 'https://sellercentral.amazon.es/hz/fba/profitabilitycalculator/index?lang=es_ES',
});
export const FEE_VERSION = Object.freeze({ id: 'ES-2026.11.05', reviewed: '2026-11-05', from: '2026-07-01', through: '2026-12-31', currency: 'EUR' });
const category = (id, label, bands, options = {}) => ({ id, label, bands, minimum: 0.30, mode: 'whole', lowPriceMax: 20, selected: false, apparelStorage: false, ...options });
export const REFERRAL_CATEGORIES = [
  category('beauty', 'Belleza, salud y cuidado personal', [[10, .08], [null, .15]], { lowPriceMax: 12 }),
  category('supplements', 'Vitaminas, minerales y suplementos', [[10, .05], [null, .15]]),
  category('baby', 'Productos para bebés (excepto carritos y seguridad)', [[10, .08], [null, .15]]),
  category('baby_safety', 'Carritos y dispositivos de seguridad para bebés', [[10, .08], [null, .15]], { selected: true }),
  category('home', 'Productos del hogar', [[20, .08], [null, .15]]),
  category('kitchen', 'Cocina', [[null, .15]], { lowPriceMax: 12 }),
  category('pet', 'Productos para mascotas (excepto ropa y comida)', [[null, .15]]),
  category('pet_food', 'Ropa y comida para mascotas', [[10, .05], [null, .15]], { selected: true }),
  category('clothing', 'Ropa y accesorios', [[15, .05], [20, .10], [null, .15]], { selected: true, apparelStorage: true, primeClothing: true }),
  category('footwear', 'Calzado', [[null, .15]], { selected: true, apparelStorage: true }),
  category('bags', 'Mochilas y bolsos', [[null, .15]], { selected: true, apparelStorage: true }),
  category('grocery', 'Alimentación y gourmet', [[10, .05], [null, .15]], { selected: true, lowPriceMax: 12, minimum: 0 }),
  category('electronics', 'Electrónica de consumo', [[null, .07]]),
  category('computing', 'Informática', [[null, .07]]),
  category('electronic_accessories', 'Accesorios electrónicos e informáticos', [[100, .15], [null, .08]], { mode: 'progressive' }),
  category('printer', 'Accesorios de impresoras y escáneres', [[100, .15], [null, .08]], { mode: 'progressive', selected: true }),
  category('diy', 'Bricolaje y herramientas', [[null, .13]]),
  category('furniture', 'Muebles', [[200, .15], [null, .10]], { mode: 'progressive' }),
  category('furniture_accessories', 'Accesorios para muebles', [[null, .13]], { selected: true }),
  category('sports', 'Deportes y aire libre', [[null, .15]]),
  category('toys', 'Juguetes y juegos', [[null, .15]]),
  category('jewellery', 'Joyería', [[250, .20], [null, .05]], { mode: 'progressive' }),
  category('watches', 'Relojes', [[250, .15], [null, .05]], { mode: 'progressive' }),
  category('office', 'Oficina y papelería', [[null, .15]], { lowPriceMax: 12 }),
  category('business', 'Suministros comerciales, industriales y científicos', [[null, .15]], { lowPriceMax: 12 }),
];
// Sorted dimensions in cm; masses in kg. PDF pages 5 (low price), 6 (standard), 8 (selected categories).
export const ENVELOPES = [
  { id: 'light', label: 'Sobre ligero', dimensions: [33,23,2.5], maxUnit: .1, bands: [[.02,2.77,2.15],[.04,2.84,2.21],[.06,2.87,2.23],[.08,3.21,2.55],[.1,3.23,2.59]] },
  { id: 'envelope', label: 'Sobre estándar', dimensions: [33,23,2.5], maxUnit: .46, bands: [[.21,3.26,2.61],[.46,3.45,2.85]] },
  { id: 'large_envelope', label: 'Sobre grande', dimensions: [33,23,4], maxUnit: .96, bands: [[.96,3.60,3.00]] },
  { id: 'extra_envelope', label: 'Sobre extragrande', dimensions: [33,23,6], maxUnit: .96, bands: [[.96,3.85,3.23]] },
];
export const STANDARD_PACKAGES = [
  { id: 'small_package', label: 'Paquete pequeño', dimensions: [35,25,12], maxUnit: 3.9, maxDimensional: 2.1, bands: [[.15,3.52],[.4,3.74],[.9,3.95],[1.4,4.21],[1.9,4.27],[3.9,5.50]] },
  { id: 'standard_package', label: 'Paquete estándar', dimensions: [45,34,26], maxUnit: 11.9, maxDimensional: 7.96, bands: [[.15,3.55],[.4,3.77],[.9,3.99],[1.4,4.85],[1.9,4.94],[2.9,4.98],[3.9,5.53],[5.9,5.96],[8.9,7.24],[11.9,7.85]] },
];
export const SELECTED_PACKAGES = [
  { id: 'selected_small1', label: 'Paquete pequeño 1', dimensions: [35,25,7], maxUnit: 3.9, base: 3.55, increment: .04 },
  { id: 'selected_small2', label: 'Paquete pequeño 2', dimensions: [35,25,9], maxUnit: 3.9, base: 3.59, increment: .04 },
  { id: 'selected_small3', label: 'Paquete pequeño 3', dimensions: [35,25,12], maxUnit: 3.9, base: 3.62, increment: .05 },
  { id: 'selected_medium1', label: 'Paquete mediano 1', dimensions: [40,30,6], maxUnit: 11.9, base: 3.85, increment: .07 },
  { id: 'selected_medium2', label: 'Paquete mediano 2', dimensions: [40,30,20], maxUnit: 11.9, base: 3.91, increment: .08 },
  { id: 'selected_large1', label: 'Paquete grande 1', dimensions: [45,34,10], maxUnit: 11.9, base: 4.08, increment: .11 },
  { id: 'selected_large2', label: 'Paquete grande 2', dimensions: [45,34,26], maxUnit: 11.9, base: 4.53, increment: .11 },
];
export const OVERSIZE = [
  { id: 'oversize_small', label: 'Tamaño grande pequeño', dimensions: [61,46,46], maxUnit: 1.76, maxDimensional: 25.82, baseWeight: .76, base: 5.68, perKg: .04 },
  { id: 'oversize_light', label: 'Tamaño grande estándar ligero', dimensions: [101,60,60], maxUnit: 15, maxDimensional: 72.72, baseWeight: .76, base: 6.55, perKg: .34 },
  { id: 'oversize_heavy', label: 'Tamaño grande estándar pesado', dimensions: [101,60,60], minUnitExclusive: 15, maxUnit: 23, maxDimensional: 72.72, baseWeight: 15.76, base: 11.72, perKg: .27 },
  { id: 'oversize_large', label: 'Tamaño grande estándar grande', dimensions: [120,60,60], maxUnit: 23, maxDimensional: 86.4, baseWeight: .76, base: 6.76, perKg: .33 },
  { id: 'oversize_bulky', label: 'Tamaño grande voluminoso', maxUnit: 23, maxDimensional: 126, baseWeight: .76, base: 9.95, perKg: .43 },
  { id: 'oversize_veryheavy', label: 'Tamaño grande pesado', minUnitExclusive: 23, maxUnit: 31.5, maxDimensional: 126, baseWeight: 31.5, base: 14, perKg: .12 },
];
export const STORAGE_RATES = { standard: [27.54,52.20], apparel: [19.99,29.23], oversize: [21.78,34.49] };
