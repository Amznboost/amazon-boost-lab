// Synthetic teaching data. Not a client account or a quote for agency services.
export default {
  currency: 'EUR', period: { start: '2026-01-01', end: '2026-01-31' }, netRevenue: 10000,
  variableCosts: { product: 3000, amazonFees: 1500, fulfilment: 800, inboundAndStorage: 200, returnsProcessing: 100, other: 0 },
  adSpend: 1500, fixedCosts: { agency: 400, other: 100 },
  adMetrics: {
    totalSales: 10000, attributedSales: 5000,
    salesBasis: 'Ejemplo sintético: ventas sin IVA, con criterio de devoluciones igualado',
    attributionWindow: 'Ejemplo didáctico: ventana declarada por el usuario; no se atribuye a un formato real de Amazon',
  },
};
