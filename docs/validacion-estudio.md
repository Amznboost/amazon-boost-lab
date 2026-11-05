# ¿Los datos permiten empezar una comparación?

El comprobador de Amazon Boost revisa una serie normalizada **de una marca, un mercado y una divisa**, con una fila por producto y día. Detecta errores de estructura y señala contexto que necesita revisión. No afirma que los datos sean verdaderos, que estén anonimizados o que puedan publicarse.

Esta versión prepara el [estudio de disponibilidad](../methodology/protocolo-estudio.md). No se conecta a Amazon ni convierte automáticamente los distintos informes de Seller Central o Amazon Ads.

## Qué comprueba

- Fechas válidas dentro de un periodo declarado y una zona horaria documentada.
- Una sola observación por producto y día, sin sumar duplicados automáticamente.
- Días ausentes respecto al periodo completo de cada producto observado.
- Celdas vacías, unidades fraccionarias, importes inválidos y columnas inesperadas.
- Disponibilidad completa, ausencia de stock, disponibilidad parcial y estado desconocido, conservados como estados diferentes.
- Pedidos en un día declarado completamente sin stock, que requieren revisar la definición y el horario.
- Promociones y cambios de precio o contenido como contexto de interpretación.

**Cero unidades pedidas no demuestra falta de stock.** Si la fuente de disponibilidad indica stock, el día se conserva con stock. Si no tenemos esa fuente, se utiliza `unknown`.

## Formato de observaciones

Separador: coma. Decimal: punto. Cabecera exacta; el orden de columnas puede variar. Una fila es un registro CSV, no necesariamente una línea física si existen campos entre comillas. Se admiten BOM, CRLF y comillas CSV estándar. No se adivinan separadores ni se convierten formatos locales automáticamente.

| Campo | Valor | Interpretación |
| --- | --- | --- |
| `date` | AAAA-MM-DD | Día ya reconciliado con la zona y el criterio declarados |
| `product_id` | P001, P002… | Alias, nunca ASIN, SKU ni título |
| `availability` | available / out_of_stock / partial / unknown | Estado según la fuente; `out_of_stock` exige ausencia durante todo el día según la definición |
| `units_ordered` | Entero ≥ 0 | Unidades pedidas; no unidades enviadas, saldo ni ventas atribuidas |
| `ad_spend` | Importe ≥ 0, máximo dos decimales | Gasto de la misma moneda y periodo, con criterio de impuestos declarado |
| `price` | Importe ≥ 0, máximo dos decimales | Precio observado con el mismo criterio; no se usa como ingreso neto |
| `promotion` | 0 / 1 / unknown | Si consta una promoción relevante ese día |
| `content_changed` | 0 / 1 / unknown | Si consta un cambio relevante de contenido ese día |

Para campañas compartidas entre productos no se reparte todo el gasto a cada producto. Hay que documentar una asignación defendible o reconocer que falta la desagregación necesaria. No se rellenan esas celdas con cero.

## Ficha de alcance

La ficha JSON declara versión 1.0, alias de conjunto D001, mercado, divisa, zona horaria, inicio y fin, y resultado principal `units_ordered`. Las cuatro definiciones documentan disponibilidad, unidades, publicidad y precio. Las fuentes se referencian con alias S001… y se relacionan con los originales en un registro privado.

[Ficha de ejemplo](../examples/estudio-sintetico/ficha.json) · [Observaciones de ejemplo](../examples/estudio-sintetico/observaciones.csv). Son **datos sintéticos**, no resultados ni informes de clientes.

Los alias ayudan a evitar identificadores directos; no garantizan anonimización. Las fechas, cantidades y combinaciones de variables también pueden identificar una cuenta. El registro privado, los originales y las pruebas de permiso no se incluyen en el repositorio público.

## Interpretar el resultado

| Estado | Significado | Siguiente paso |
| --- | --- | --- |
| `invalid` | Hay errores que impiden utilizar esta estructura | Corregirlos en la fuente o en la transformación documentada; no ocultarlos |
| `needs_review` | La estructura permite continuar, pero hay ausencias, incertidumbre o factores de contexto | Revisar cada aviso y documentar inclusiones y exclusiones |
| `structurally_valid` | No se detectaron errores ni avisos con estas reglas | Revisar originales, definiciones y permisos; no es autorización para publicar |

Un producto lanzado a mitad de periodo puede generar un aviso de días ausentes. No significa que haya que inventarlos: se debe ajustar el alcance o documentar por qué esos días no son observables. Un producto totalmente ausente del archivo no puede detectarse sin un inventario independiente.

Cambios de inversión se muestran como notas; no se estima su efecto. No hay puntuación SEO, predicción de ventas perdidas, efecto causal ni clasificación automática de resultados comerciales.

## Ejecución local y límites

Interfaz: con el servidor local activo, abre `/web/datos.html`. No se envían las entradas ni se conservan al recargar. Se pueden revisar las fuentes con alias, sin subir informes originales.

```sh
npm run validate:study
node scripts/validate-study.mjs incoming/ficha.json incoming/observaciones.csv
```

Los originales deben permanecer en carpetas privadas excluidas de Git. El CLI devuelve solo un resumen y avisos, sin copiar las filas de entrada. Sale con error si hay errores de estructura; los avisos requieren revisión aunque el comando finalice correctamente.

Límites operativos: 10.000 observaciones, dos millones de caracteres CSV y un periodo de hasta 3.660 días. Son límites de esta herramienta, no requisitos de Amazon ni tamaños mínimos de un estudio. Las siglas de mercado y moneda se comprueban por formato; hay que verificar que corresponden a los informes reales. Declarar una zona horaria no transforma ni certifica las fechas de origen.

## Por qué no se mezclan los informes sin reconciliación

Amazon documenta diferentes granularidades y métricas de ventas y tráfico; no debe suponerse que un agregado por fecha ya contiene el desglose diario por producto. Hay que verificar que el origen aporta esa combinación real. Amazon Ads también distingue fechas de interacción y atribución de la fecha efectiva de venta. El validador no convierte esas bases en equivalentes.

Fuentes primarias: [informes de Analytics de SP-API](https://developer-docs.amazon/sp-api/docs/report-type-values-analytics) y [atribución de campañas de Amazon Ads](https://advertising.amazon.com/help/GX7KDKHMWQYMJ385). Los nombres del formato normalizado son propios del laboratorio; no se presentan como un esquema oficial de Amazon.
