export const studyExampleMetadata = {
  schemaVersion: '1.0', datasetId: 'D001', marketplace: 'ES', currency: 'EUR', timeZone: 'Europe/Madrid',
  period: { start: '2026-01-01', end: '2026-01-05' }, primaryMetric: 'units_ordered',
  definitions: {
    availability: 'Ejemplo sintético: estado de oferta durante el día completo. Partial indica disponibilidad solo durante una parte del día.',
    units: 'Ejemplo sintético: unidades pedidas por producto y fecha de pedido, no unidades enviadas ni ventas atribuidas a publicidad.',
    advertising: 'Ejemplo sintético: gasto por producto y día, en la misma divisa y sin IVA recuperable; no suma campañas sin asignación al producto.',
    price: 'Ejemplo sintético: precio de oferta en EUR con IVA, observado con el mismo criterio cada día; no es ingreso neto.',
  }, sources: { availability: 'S001', units: 'S002', advertising: 'S003', price: 'S004' },
};
export const studyExampleCsv = `date,product_id,availability,units_ordered,ad_spend,price,promotion,content_changed
2026-01-01,P001,available,5,10.00,25.00,0,0
2026-01-02,P001,available,0,8.00,25.00,0,0
2026-01-03,P001,out_of_stock,0,0.00,25.00,0,0
2026-01-04,P001,available,6,12.00,25.00,0,0
2026-01-05,P001,available,7,14.00,25.00,0,0
2026-01-01,P002,available,3,5.00,30.00,0,0
2026-01-02,P002,available,4,5.00,30.00,0,0
2026-01-03,P002,available,5,5.00,29.00,1,0
2026-01-04,P002,partial,2,5.00,29.00,1,0
2026-01-05,P002,available,4,5.00,29.00,0,1
`;
