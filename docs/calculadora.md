# Calculadora: qué queda después de los costes

Esta página describe la [conciliación de cuenta con costes conocidos](../web/cuenta.html). Para estimar tarifas a partir de dimensiones, peso y categoría utiliza el [estimador de producto](estimador-producto.md).

**La calculadora obtiene una contribución con los ingresos y costes que introduces. No calcula automáticamente el beneficio neto contable de una empresa.** No consulta Amazon, no conoce tus tarifas y no completa gastos ausentes mediante estimaciones.

## Preparar los importes

Usa un único periodo y una única moneda. `netRevenue` representa ingresos sin IVA y después de devoluciones, según un criterio documentado. Los gastos deben tener un tratamiento comparable y no duplicarse. El coste de producto corresponde a las unidades vendidas bajo ese mismo criterio; una compra de inventario no se imputa completa como gasto del mes si no corresponde a esas ventas.

Los campos de costes son obligatorios: introduce cero solo si se sabe que no hay coste. Si falta una partida necesaria, el resultado queda incompleto y no se presenta como rentabilidad verificada.

## Fórmulas del periodo

```text
Costes variables = producto + comisiones Amazon + preparación/entrega
                 + entrada/almacenamiento + gestión de devoluciones + otros

Contribución antes de publicidad = ingresos netos − costes variables
Contribución del periodo = contribución anterior − publicidad − costes fijos
Costes fijos = honorarios de agencia + otros costes fijos introducidos

Máximo gasto publicitario para contribución cero
  = máximo(0, contribución antes de publicidad − costes fijos)
```

Ese máximo es aritmético para el nivel de ingresos y costes introducido: **no presupone que las ventas permanecerán constantes al cambiar la publicidad**, no es una recomendación de presupuesto y no incluye costes omitidos.

## Ratios de publicidad

```text
ACOS (%) = gasto publicitario / ventas atribuidas × 100
TACOS (%) = gasto publicitario / ventas totales del informe × 100
ROAS = ventas atribuidas / gasto publicitario
```

La herramienta solicita las ventas del informe por separado de los ingresos netos porque ambas bases pueden diferir. Registra periodo, IVA/devoluciones, ámbito, tipo de anuncio y ventana de atribución. No compares un ratio de informe con un margen de otra base sin reconciliarlos. El TACOS aquí tiene la definición indicada; no se presenta como una columna universal disponible en todo informe de Amazon.

Con denominador cero el ratio se muestra como **no definido**, no como cero o infinito. Un ROAS no es un ROI ni una prueba de beneficio.

## Cálculo por producto

El módulo de economía unitaria permite calcular margen antes de publicidad por unidad. Su umbral ACOS teórico usa margen/precio sin IVA, sin costes fijos. Solo es comparable con un ACOS calculado sobre una base equivalente y el mismo producto. No trasladar automáticamente un margen medio de cartera a todas las campañas.

## Ejemplo sintético comprobable

El ejemplo incluye 10.000 € de ingresos netos, 5.600 € de costes variables, 1.500 € de publicidad y 500 € de costes fijos. La contribución es **2.400 € (24 %)**. Las ventas atribuidas de ejemplo son 5.000 €: ACOS 30 %, TACOS 15 % y ROAS aproximadamente 3,33. Son cifras didácticas inventadas; los 400 € de honorarios del ejemplo no son una tarifa publicada del laboratorio.

La cifra negativa se conserva cuando los costes superan los ingresos. Los cálculos internos no se redondean antes de sumar; la interfaz redondea solo la presentación.

## Uso local

Ejecuta `npm start` y abre la dirección local. Introduce los importes manualmente o carga expresamente el ejemplo sintético. No hay envío de datos, cookies, almacenamiento persistente ni conexión a Seller Central. La interfaz no pide nombre, email, teléfono o identificadores de cliente.

Código: [economics.mjs](../src/economics.mjs). Pruebas: [economics.test.mjs](../tests/economics.test.mjs). [Fuentes oficiales](fuentes.md).
