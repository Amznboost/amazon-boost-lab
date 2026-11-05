# Revisión 0.3.0: del sumatorio al estimador de producto

Fecha: 5 de noviembre de 2026. Preparación local independiente; no publicada ni incorporada a la web comercial.

## Cambio principal

La entrada del laboratorio ahora estima costes desde el producto en vez de exigir una tarifa FBA y comisión conocidas. El usuario indica categoría, precio, IVA, medidas, peso bruto y coste de compra. La herramienta calcula tramo físico y tarifas del catálogo español verificado, con sus fuentes y límites.

La calculadora anterior se conserva en `web/cuenta.html` para conciliar periodos con costes reales conocidos. Tiene una finalidad distinta.

## Comprobaciones

- Veintitrés pruebas nuevas: umbrales de referencia y bajo precio; mínimos y progresivos; sobres y paquetes; peso real/dimensional; categorías seleccionadas; recargo por fecha; servicios digitales; almacenamiento; cuota; publicidad y bases de IVA; errores, pérdidas y pendientes.
- Referencia calculada con céntimos y puntos básicos enteros, redondeando una sola vez, para evitar perder un céntimo por representación binaria.
- Revisión visual de las tablas oficiales, columna española y notas. [Registro de versión](tarifas-es-2026-snapshot.json).
- Ejemplo sintético en navegador: 20 × 10 × 8 cm, 300 g, precio 19,99 €, compra 4 € y otros costes didácticos declarados. Contribución estimada: 5,27 €/unidad.
- Escenario 21,99 €: cambia la tarifa y la referencia; la contribución baja a 4,89 €/unidad sin predecir demanda.
- Tabla de tramo visible, fila aplicada, peso facturable, recargo y enlace al PDF.
- ACOS 30 % y 40 % de ventas atribuidas: 2,40 € con precio final como base; 1,98 € con base sin IVA en el ejemplo.
- FBM: usa el transporte declarado, sin añadir almacenamiento FBA ni entrada a Amazon.
- Entrada vacía: resultado parcial y partida pendiente, sin considerar confirmado un coste cero.
- Producto peligroso: no presenta margen con una tarifa FBA convencional inventada.
- Vaciar conserva hipótesis editables e impide calcular sin datos del producto.
- Revisión en escritorio de 1.280 píxeles y móvil de 390 y 320: sin desbordamiento horizontal del documento.
- Conciliación anterior comprobada en su nueva ruta; el ejemplo mantiene 2.400 € y 24 %.
- Conjunto completo: 67 pruebas correctas. Los nuevos módulos y la ruta de conciliación también responden en las pruebas HTTP locales.

## Límites que deben permanecer visibles

Es una estimación versionada, no una consulta de ASIN. Amazon determina categoría y medidas finales. No se calculan programas transfronterizos ni todos los recargos de cuenta. Gran tamaño requiere confirmar redondeo incremental y tarifa final. Mercancías peligrosas, litio, tamaño especial y categorías fuera del catálogo requieren comprobación en Amazon.

El programa no conoce proveedor, incidencias ni almacén propio. Los vacíos se señalan; el resultado no se llama beneficio neto contable.

[Metodología y cobertura](estimador-producto.md) · [Fuentes](fuentes.md) · [Plan de publicación](publicacion.md).
