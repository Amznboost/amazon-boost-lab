# Protocolo para un estudio original de Amazon Boost

**Pregunta propuesta:** ¿cómo evoluciona el rendimiento comercial de un producto alrededor de periodos de falta de disponibilidad, y qué cambia cuando se recupera la oferta?

Estado: diseño de investigación, **sin muestra analizada ni conclusiones empíricas todavía**. El estudio se acotará después de comprobar los informes y permisos disponibles.

## Por qué esta pregunta

Conecta stock, publicidad y ventas, áreas que Amazon Boost trabaja conjuntamente. Puede aportar algo más útil que un caso de crecimiento: un registro de qué condiciones acompañaron al resultado y qué explicaciones siguen abiertas.

## Definir antes de calcular

- Unidad de análisis: producto o ASIN por día y marketplace; documentar variantes y cambios de identificación.
- Exposición: un estado de disponibilidad definido con la fuente real disponible, no inferido únicamente de ventas cero.
- Resultado principal: elegir entre ventas, unidades u otra métrica antes de observar qué gráfica resulta más atractiva.
- Variables de contexto: precio, promociones, inversión, contenido, modelo logístico y eventos relevantes.
- Ventanas: fijar periodos comparables antes/después y explicar exclusiones. No fijar números sin revisar la granularidad y madurez de los datos.
- Muestra: publicar número de marcas, productos y observaciones efectivamente incluidos, así como el criterio de selección.

## Método y límites

El diseño inicial sería observacional. Si no hay control adecuado, se describirán asociaciones y evolución temporal, no «ventas perdidas por culpa del stock» como una cantidad causal demostrada. Un producto que vuelve a vender tras reponerse también puede haber cambiado de precio o de inversión.

Se mostrarán resultados negativos, nulos y dispersión cuando existan; no solo los productos que crecieron. Si una tabla no permite proteger suficientemente a una marca, se agregará o no se publicará.

## Publicación prevista

1. Artículo original con pregunta, alcance, resultados y límites en la web, sujeto a revisión previa.
2. En el laboratorio: metodología, diccionario, transformaciones y tablas autorizadas suficientes para reproducir los cálculos.
3. Fecha, versión y procedimiento para comunicar errores.

No hay resultados, porcentajes, tamaño de muestra o fechas de publicación comprometidos en esta versión. [Ficha de autorización](../templates/autorizacion-materiales.md).

## Preparación técnica de las observaciones

El [comprobador local](../docs/validacion-estudio.md) revisa una tabla normalizada de una marca, mercado y divisa. Señala duplicados, días ausentes y factores de contexto; no convierte directamente un informe de Amazon en un estudio. Los ejemplos son sintéticos y no se utilizan como resultados empíricos.
