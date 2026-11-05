# Cómo convertir esta preparación en un primer estudio real

**Objetivo:** documentar qué ocurrió alrededor de un episodio de disponibilidad y qué explicaciones siguen abiertas. La primera versión puede ser un caso delimitado; no necesita presentarse como un estudio de todo el mercado.

Estado a 5 de noviembre de 2026: herramienta y protocolo preparados. No hay originales incorporados, muestra empírica analizada ni resultados nuevos.

## 1. Elegir un caso que podamos documentar

Buscar una cuenta con permiso para utilizar los materiales necesarios y un episodio de disponibilidad identificable. Antes de seleccionar por el resultado, revisar si existen fechas, unidades por producto, evidencia de disponibilidad y registro de cambios.

Un buen candidato no es necesariamente el que más creció: es el que permite reconstruir la pregunta y sus límites. Si solo hay capturas generales de facturación, se mantiene como caso documental y no se fabrica una serie diaria.

## 2. Verificar las fuentes antes de prometer un análisis

| Necesidad | Qué necesitamos comprobar | Si no existe |
| --- | --- | --- |
| Unidades por producto y día | La fuente entrega realmente esa combinación de dimensiones, con productos y fechas identificables | Elegir una fuente o extracción que la aporte; no repartir totales del periodo entre días |
| Disponibilidad | Registro que permita distinguir ausencia completa, parcial y desconocida | Limitar la pregunta; cero ventas no sustituye a esta evidencia |
| Gasto por producto y día | Asignación compatible con el producto y sus fechas; sin duplicar campañas compartidas | Documentar la ausencia o cambiar el diseño; no rellenar con gasto cero |
| Precio | Mismo criterio de observación, impuestos y descuentos | No asumir que un precio medio de todo el periodo refleja cada día |
| Promociones y contenido | Registro fechado de campañas comerciales y cambios de ficha | Marcar lo desconocido y reconocer la limitación |
| Alcance y permisos | Qué materiales, cifras y soportes pueden hacerse públicos | Conservar el trabajo privado hasta resolver el alcance |

La documentación de Amazon distingue agregaciones por fecha y por ASIN. Una tabla por fecha para toda la cuenta y otra por producto para todo el periodo **no permiten deducir su cruce diario**. Hay que verificar otra extracción —por ejemplo, informes acotados a días cuando la fuente lo permita—, sin inventar cómo se distribuyen los totales. [Fuente de Amazon](https://developer-docs.amazon/sp-api/docs/report-type-values-analytics).

## 3. Mantener una capa privada y una copia de trabajo

Conservar originales, permisos y correspondencia de alias en privado. Para la copia del estudio, utilizar D001 para el conjunto, P001… para productos y S001… para fuentes. Los alias no convierten automáticamente una serie comercial en anónima: también se revisa la posibilidad de identificar al cliente por fechas, volúmenes o contexto.

La copia de trabajo sigue siendo privada hasta su revisión. El [comprobador](validacion-estudio.md) no sustituye esa revisión y no envía ni publica las entradas.

## 4. Fijar la pregunta y los criterios antes de interpretar

Registrar qué producto, mercado y periodo se estudian, qué significa cada estado de stock, qué resultado se observará y por qué se incluyen o excluyen días. Las ventanas y exclusiones no se eligen después para que la gráfica quede mejor.

Las cifras de ventas atribuidas de campañas no se utilizan como pedidos diarios intercambiables: su fecha y atribución tienen otros criterios. [Fuente de Amazon Ads](https://advertising.amazon.com/help/GX7KDKHMWQYMJ385).

## 5. Validar y revisar las observaciones

Ejecutar las comprobaciones, corregir duplicados y errores en la transformación documentada, y resolver o explicar los avisos. Conservar evidencia de cada cambio. Un día sin observación no se convierte en cero ventas o ausencia de stock.

No hay obligación de que todos los avisos desaparezcan: algunos reflejan el caso real. Deben acompañar el análisis cuando cambian lo que se puede concluir.

## 6. Preparar una publicación reproducible

- Pregunta y selección del caso.
- Fuente, periodo, unidad de análisis y definiciones.
- Método, transformaciones y exclusiones.
- Resultados realmente observados, incluidos los nulos o contradictorios.
- Explicaciones alternativas y límites.
- Materiales que pueden compartirse y versión utilizada.

Cuando los datos no puedan compartirse, explicar qué parte se ha revisado y qué parte no podrá reproducir un lector. No anunciar «datos abiertos» ni «estudio verificado» solo por publicar el método.

La eventual conexión con la web se prepara como un cambio separado. Los casos actuales conservan sus URLs y su función. [Plan de publicación](publicacion.md) · [Protocolo](../methodology/protocolo-estudio.md) · [Autorización de materiales](../templates/autorizacion-materiales.md).
