import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateProduct, estimateFba, referralFee, priceScenarios, roundMoney } from '../src/product-estimator.mjs';
import example from '../src/product-example.mjs';
const input=patch=>({...structuredClone(example),...patch});
const fba=patch=>estimateFba(input(patch));
test('producto sintético: tarifas calculadas y margen reconciliado',()=>{
 const result=estimateProduct(input());assert.equal(result.supported,true);assert.equal(result.fba.lowPrice,true);assert.equal(result.fba.tierId,'low_small');
 assert.equal(result.fba.baseFee,3.46);assert.equal(result.fba.fuelFee,.07);assert.equal(result.costs.referral,1.60);assert.equal(result.costs.digitalReferral,.05);
 assert.equal(roundMoney(result.contribution),5.27);assert.equal(result.missing.length,0);assert.equal(result.costs.plan,.39);
 assert.ok(Math.abs(result.netRevenue-result.totalCosts-result.contribution)<1e-10);
});
test('precio mayor puede dejar menos margen al cruzar el umbral de hogar y bajo precio',()=>{
 const result=priceScenarios(input());assert.deepEqual(result.map(s=>s.price),[17.99,19.99,21.99]);
 assert.equal(result[2].result.fba.lowPrice,false);assert.equal(result[2].result.costs.referral,3.30);assert.equal(result[2].result.fba.baseFee,3.74);
 assert.ok(result[2].result.contribution<result[1].result.contribution);
});
test('el umbral de bajo precio es 12 en belleza/cocina y 20 en hogar',()=>{
 assert.equal(fba({grossPrice:12,categoryId:'beauty'}).lowPrice,true);
 assert.equal(fba({grossPrice:12.01,categoryId:'beauty'}).lowPrice,false);
 assert.equal(fba({grossPrice:19.99,categoryId:'home'}).lowPrice,true);
 assert.equal(fba({grossPrice:19.99,categoryId:'kitchen'}).lowPrice,false);
 assert.equal(fba({grossPrice:20.01,categoryId:'home'}).lowPrice,false);
});
test('low price exige también el peso y dimensiones correctos',()=>{
 assert.equal(fba({weightKg:.4}).lowPrice,true);assert.equal(fba({weightKg:.401}).lowPrice,false);
 assert.equal(fba({dimensions:[35,25,12],weightKg:.4}).lowPrice,true);
 assert.equal(fba({dimensions:[35.01,25,12],weightKg:.4}).lowPrice,false);
});
test('los sobres se clasifican por peso real con límites inclusivos',()=>{
 assert.equal(fba({dimensions:[33,23,2.5],weightKg:.1,grossPrice:30}).tierId,'light');
 assert.equal(fba({dimensions:[33,23,2.5],weightKg:.101,grossPrice:30}).tierId,'envelope');
 assert.equal(fba({dimensions:[33,23,4],weightKg:.96,grossPrice:30}).baseFee,3.60);
 assert.equal(fba({dimensions:[33,23,6],weightKg:.96,grossPrice:30}).baseFee,3.85);
});
test('clasifica dimensiones rotadas sin cambiar las medidas originales',()=>{
 const product=input({dimensions:[4,20,15]});const original=structuredClone(product);const result=estimateProduct(product);
 assert.deepEqual(result.fba.dimensions,[20,15,4]);assert.deepEqual(product,original);
});
test('paquetes generales usan el mayor de peso real y dimensional',()=>{
 const result=fba({categoryId:'kitchen',grossPrice:25,dimensions:[35,25,12],weightKg:.4});
 assert.equal(result.dimensionalWeightKg,2.1);assert.equal(result.chargeableWeightKg,2.1);assert.equal(result.baseFee,5.50);
 const bigger=fba({categoryId:'kitchen',grossPrice:25,dimensions:[40,30,20],weightKg:2});assert.equal(bigger.baseFee,5.96);
});
test('categorías seleccionadas usan peso real e incrementos de 100 g',()=>{
 const result=fba({categoryId:'clothing',grossPrice:25,dimensions:[35,25,12],weightKg:.4});
 assert.equal(result.weightBasis,'unit');assert.equal(result.matchedRow.increments,3);assert.equal(result.baseFee,3.77);
 assert.equal(fba({categoryId:'clothing',grossPrice:25,dimensions:[35,25,7],weightKg:.100001}).baseFee,3.59);
});
test('el recargo cambia el 2 de noviembre sin duplicarse en la tarifa base',()=>{
 const before=fba({date:'2026-11-01',grossPrice:30,dimensions:[33,23,2.5],weightKg:.1});
 const after=fba({date:'2026-11-02',grossPrice:30,dimensions:[33,23,2.5],weightKg:.1});
 assert.equal(before.baseFee,3.23);assert.equal(before.fuelFee,.05);assert.equal(after.baseFee,3.23);assert.equal(after.fuelFee,.06);
});
test('referencia: límites, mínimos y categorías progresivas',()=>{
 assert.equal(referralFee('home',20,true).fee,1.60);assert.equal(referralFee('home',20.01,true).fee,3.00);
 assert.equal(referralFee('beauty',1,true).fee,.30);assert.equal(referralFee('grocery',1,true).fee,.05);
 assert.equal(referralFee('furniture',300,true).fee,40);assert.equal(referralFee('electronic_accessories',200,true).fee,23);
 assert.equal(referralFee('jewellery',300,true).fee,52.5);
});
test('ropa Prime de más de 45 aplica tarifa progresiva; FBM sin Prime no',()=>{
 assert.equal(referralFee('clothing',100,true).fee,10.60);assert.equal(referralFee('clothing',100,false).fee,15);
 assert.equal(referralFee('clothing',15,true).fee,.75);assert.equal(referralFee('clothing',20,true).fee,2);
});
test('servicios digitales distingue sede ES y FR/UK en tarifas FBA',()=>{
 const es=estimateProduct(input()),fr=estimateProduct(input({sellerCountry:'FR'}));
 assert.equal(es.costs.digitalFba,0);assert.equal(fr.costs.digitalFba,.11);assert.equal(fr.costs.digitalReferral,es.costs.digitalReferral);
});
test('almacenamiento cambia por temporada y categoría, sin aplicarlo a FBM',()=>{
 const summer=estimateProduct(input({date:'2026-09-01'})),winter=estimateProduct(input());
 assert.equal(summer.storageRate,27.54);assert.equal(winter.storageRate,52.2);assert.ok(winter.costs.storage>summer.costs.storage);
 assert.equal(estimateProduct(input({categoryId:'clothing'})).storageRate,29.23);
 const fbm=estimateProduct(input({method:'FBM',inbound:100}));assert.equal(fbm.costs.storage,0);assert.equal(fbm.costs.inbound,0);assert.equal(fbm.costs.logistics,4.5);
});
test('ACOS necesita proporción publicitaria; no se aplica al total por error',()=>{
 const result=estimateProduct(input({advertising:{mode:'acos',value:30,adSalesSharePct:40}}));
 assert.ok(Math.abs(result.costs.advertising-2.3988)<1e-9);
 assert.throws(()=>estimateProduct(input({advertising:{mode:'acos',value:30}})),/Proporción/);
});
test('TACOS y gasto unitario representan bases distintas',()=>{
 assert.ok(Math.abs(estimateProduct(input({advertising:{mode:'tacos',value:10}})).costs.advertising-1.999)<1e-9);
 assert.equal(estimateProduct(input({advertising:{mode:'unit',value:1}})).costs.advertising,1);
});
test('porcentajes publicitarios permiten usar la base del informe sin IVA',()=>{
 const result=estimateProduct(input({advertising:{mode:'acos',value:30,adSalesSharePct:40,salesBasis:'net'}}));
 assert.ok(Math.abs(result.costs.advertising-(19.99/1.21*.3*.4))<1e-9);assert.equal(result.advertisingSalesBasis,'net');
 assert.throws(()=>estimateProduct(input({advertising:{mode:'tacos',value:10,salesBasis:'inventada'}})),/base publicitaria/);
});
test('faltantes quedan pendientes y no son ceros confirmados',()=>{
 const result=estimateProduct(input({inbound:null,returns:null}));assert.deepEqual(result.missing,['inbound','returns']);assert.equal(result.costs.inbound,null);
 assert.ok(result.warnings.some(text=>text.includes('parcial')));
});
test('productos especiales no reciben margen con FBA cero inventado',()=>{
 for(const patch of [{hazardous:true},{lithium:true},{dimensions:[180,20,20]},{weightKg:40}]){
  const result=estimateProduct(input(patch));assert.equal(result.supported,false);assert.equal(result.contribution,undefined);assert.equal(result.fba.totalFee,undefined);
 }
});
test('pérdidas y ausencia de margen publicitario se mantienen visibles',()=>{
 const result=estimateProduct(input({landedCost:100}));assert.ok(result.contribution<0);assert.equal(result.breakEvenAcosPct,null);assert.equal(result.maxAdSpendPerUnit,0);
});
test('cuota profesional se reparte con alcance explícito; individual es por unidad',()=>{
 assert.equal(estimateProduct(input({monthlyUnits:200,planAllocationPct:50})).costs.plan,.0975);
 assert.equal(estimateProduct(input({plan:'individual'})).costs.plan,.99);
});
test('rechaza fechas ajenas a la tabla y entradas imposibles',()=>{
 for(const patch of [{date:'2026-06-30'},{date:'2027-01-01'},{dimensions:[0,2,3]},{weightKg:-1},{monthlyUnits:0},{grossPrice:NaN},{landedCost:Infinity},{marketplace:'DE'},{categoryId:'inventado'},{vatPct:101},{fbmShipping:null,method:'FBM'},{storageDays:241}])assert.throws(()=>estimateProduct(input(patch)));
});
test('redondeo monetario conserva los céntimos',()=>{assert.equal(roundMoney(1.005),1.01);assert.equal(roundMoney(10.075),10.08);assert.equal(roundMoney(3.46*.02),.07);});
test('la referencia no pierde un céntimo en empates de redondeo binario',()=>{
 assert.equal(referralFee('home',33.50,true).fee,5.03);assert.equal(referralFee('electronics',14.50,true).fee,1.02);
 assert.throws(()=>referralFee('home',10.001,true),/dos decimales/);
});
