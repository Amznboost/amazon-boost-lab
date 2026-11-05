# Estimador por producto: tarifas, logística y margen

Amazon Boost Lab estima costes a partir del precio final, categoría tarifaria, dimensiones exteriores y peso bruto de una unidad embalada. No exige introducir a mano una comisión o una tarifa FBA conocida. La herramienta trabaja en el dispositivo; no consulta ni modifica una cuenta de Seller Central.

## Qué calcula

- Comisión por referencia, con mínimos y tramos de precio, incluidos los progresivos.
- Clasificación física y peso facturable; no aplica siempre peso dimensional.
- Elegibilidad estimada para FBA de bajo precio, por precio, categoría, dimensiones y peso.
- Tarifa FBA local española, con tablas generales o de categorías seleccionadas.
- Recargo de combustible/logística por la fecha elegida.
- Servicios digitales según sede declarada y tarifa afectada.
- Almacenamiento base estacional, volumen y estancia media.
- Cuota del plan de vendedor y otros fijos repartidos con las hipótesis indicadas.
- Publicidad por venta, TACOS o ACOS con proporción atribuida explícita.
- Contribución por unidad, proyección mensual y umbral publicitario, con costes pendientes visibles.
- Tres escenarios de precio que vuelven a clasificar las tarifas; no predicen cambios de demanda.
- Comparación con FBM si el usuario aporta su coste de transporte. No inventa el coste del almacén o de su operativa propia.

## Alcance verificado y fuentes

**Amazon.es, inventario FBA local en España o FBM.** Catálogo de tarifas revisado el 5 de noviembre de 2026. Fechas admitidas: 1 de julio a 31 de diciembre de 2026. Una fecha posterior a la revisión genera aviso: el catálogo no se actualiza en tiempo real.

| Regla | Fuente | Comprobación |
| --- | --- | --- |
| FBA de bajo precio | [Tarifario oficial, página 5](https://m.media-amazon.com/images/G/02/sell/images/261014-FBA-Rate-Card-ES.pdf#page=5) y [programa de bajo precio](https://sell.amazon.es/tarifas-precio-bajo-logistica-de-amazon) | Precios límite y condiciones físicas; no basta vender por menos de 20 € |
| Logística general | [Tarifario, página 6](https://m.media-amazon.com/images/G/02/sell/images/261014-FBA-Rate-Card-ES.pdf#page=6) | Columna ES, pesos, tamaños y notas |
| Paquetes de categorías seleccionadas | [Tarifario, página 8](https://m.media-amazon.com/images/G/02/sell/images/261014-FBA-Rate-Card-ES.pdf#page=8) | Peso real y base más incrementos de 100 g |
| Almacenamiento | [Tarifario, página 20](https://m.media-amazon.com/images/G/02/sell/images/261014-FBA-Rate-Card-ES.pdf#page=20) | Temporada y grupos de producto |
| Referencia y planes | [Precios oficiales de Amazon España](https://sell.amazon.es/precios) | Mínimos, porcentajes y tramos; plan profesional o individual |
| Servicios digitales | [Ayuda oficial](https://sellercentral.amazon.es/gp/help/external/GCZC4GX2L32EKP6F?locale=es-ES) | Sede del vendedor y base de la tarifa; la página puede exigir sesión |

Las páginas 5, 6, 8 y 9 del PDF se han revisado visualmente para no confundir países ni temporadas. El PDF actual especifica el aumento del recargo al 2 % el 2 de noviembre de 2026; la página comercial resumida todavía mostraba el anuncio previo del 1,5 %. Se prioriza la nota fechada del tarifario. No se añade a España un recargo de temporada alta de logística que la tabla limita a Reino Unido y Alemania.

## Reglas de cálculo y supuestos

Las dimensiones se ordenan de mayor a menor; se calcula volumen y peso dimensional con divisor 5.000. Los sobres y bajo precio usan peso real. Los paquetes de categorías seleccionadas usan peso real e incrementos de 100 g. Los otros paquetes y el gran tamaño general comparan peso real y dimensional, siguiendo la regla de su tabla.

El recargo se calcula sobre la tarifa base FBA, no sobre el precio del producto, y se muestra separado. Las tarifas de referencia se calculan sobre lo cobrado al cliente, con IVA y los cargos correspondientes incluidos. Los ingresos para el margen se muestran sin IVA del producto. Los gastos deben introducirse sin IVA recuperable; el IVA no deducible debe incorporarse a los costes del usuario.

En servicios digitales se modela un 3 % de la referencia para las ventas de esta herramienta en Amazon.es. Con sede en Francia o Reino Unido también se aplica a la tarifa FBA; las otras sedes admitidas siguen la base indicada en la ayuda oficial para España. No se aplica al precio de venta como si fuera un impuesto del comprador.

Almacenamiento por unidad vendida: volumen unitario × tarifa mensual × estancia media / 30. Es una aproximación con meses de treinta días y la temporada de la fecha elegida, no la reconstrucción de una factura. La estancia no indica que se haya comprobado antigüedad de cada unidad.

En gran tamaño el incremento por kg se modela proporcionalmente y se advierte que hay que confirmar redondeo y tarifa final en Amazon. Tamaño especial, dimensiones fuera de las reglas, mercancías peligrosas y litio no producen una tarifa FBA cero ni un margen inventado: se requiere comprobarlos en la calculadora oficial. En FBM el transporte es el coste declarado; no se traslada a FBM el envío de entrada a Amazon.

La cuota profesional se reparte con el volumen y porcentaje de imputación declarados. El supuesto inicial asigna toda la cuota a ese producto y prevé cien unidades mensuales; ambos se pueden cambiar. No se presenta ese volumen como una previsión de Amazon Boost.

ACOS por sí solo no se aplica a todas las ventas: el gasto unitario se obtiene con la base de ventas elegida, ACOS y proporción de ventas atribuidas. TACOS usa las ventas totales de la hipótesis. Se puede elegir precio con IVA o ingresos sin IVA para que el porcentaje coincida con el informe de origen. El umbral publicitario utiliza esa misma base, que se muestra junto al resultado; no se debe comparar con un informe que utilice otra. La proyección mensual se calcula antes de redondear el margen unitario mostrado.

## Qué falta y qué no se promete

Los gastos propios vacíos se identifican como pendientes. La contribución usa solo los gastos declarados y calculados y se etiqueta como parcial; no convierte una ausencia en un coste confirmado como cero. La herramienta no conoce costes del proveedor, transporte de entrada, devoluciones, preparación ni gastos generales de una cuenta.

Fuera del cálculo automático: tarifas paneuropeas o transfronterizas, recargos de baja cobertura, sobreutilización, inventario antiguo, retiradas, descuentos e incentivos particulares, programas de embalaje certificados y condiciones especiales del ASIN. No se incluyen categorías con tarifas no implementadas, como multimedia con cargos adicionales; tampoco se les asigna un 15 % genérico.

La selección comercial orienta, pero Amazon asigna la categoría tarifaria y las medidas que determinan la factura. Para confirmar un ASIN se debe contrastar con [la calculadora oficial](https://sellercentral.amazon.es/hz/fba/profitabilitycalculator/index?lang=es_ES) o su informe de previsualización. El resultado es una estimación económica con alcance declarado, no beneficio neto contable ni autorización para comprar inventario.

## Mantenimiento

Las reglas se versionan en [el catálogo ES](../src/es-fees-2026.mjs), separadas de [el motor](../src/product-estimator.mjs). Cada cambio exige revisar fuente, fecha, país, notas, límites y ejemplos de frontera. Las pruebas comprueban umbrales, mínimos, cambios de programa, pesos, recargos y costes pendientes; no sustituyen el contraste de un ASIN con Amazon.

El [ejemplo](../src/product-example.mjs) es sintético. La [calculadora de cuenta](../web/cuenta.html) sigue disponible para conciliar importes ya conocidos; tiene una finalidad diferente.
