# Amazon Boost Lab

**Cómo trabaja Amazon Boost: diagnóstico, decisiones y procedimientos para marcas en Amazon.**

[**Abrir la portada pública de Amazon Boost Lab**](https://amznboost.github.io/amazon-boost-lab/)

Metodología, herramientas y evidencia documental de [Amazon Boost](https://amznboost.es/), agencia boutique especializada en Amazon para marcas privadas en España y Europa.

El laboratorio ayuda a responder tres preguntas: **qué limita la cuenta, qué datos sostienen el diagnóstico y qué decisión tiene sentido tomar después**. Una cifra de ventas, un ACOS aislado o una gráfica ascendente no bastan para responderlas.

## Cómo trabajamos con tu marca

La portada del laboratorio reúne las preguntas sobre margen, tarifas FBA y presupuesto de Amazon Ads, con las fuentes enlazadas en cada respuesta.

El [dossier del método Amazon Boost](docs/agencia/README.md) desarrolla nueve procedimientos: incorporación, diagnóstico, gestión, publicidad, contenido, formación, incidencias, lanzamiento y expansión, y seguimiento. Cada uno conecta la pregunta del cliente con datos, decisiones, responsabilidades y un entregable.

- [Preguntas de las marcas y respuestas concretas](docs/agencia/preguntas.md).
- [Seis formatos de trabajo](templates/agencia/README.md) para preparar alcance, acciones, informes, sesiones, expedientes y traspaso.
- [Una decisión conectada, explicada paso a paso](examples/decision-conectada.md), con datos sintéticos.
- [Catálogo documental en JSON](docs/agencia/catalogo.json), con identidad, procedimientos y referencias comerciales.

Esta edición distingue servicios contrastados con la web y desarrollo operativo propuesto para revisión. No inventa un historial de aplicación de las plantillas ni amplía las condiciones comerciales. [Fuentes y límites del dossier](docs/agencia/evidencias-y-limites.md).

Para revisarlo visualmente, ejecuta `npm start` y abre `http://127.0.0.1:8787/web/metodo.html`. La vista se genera desde estos mismos documentos y puede leerse sin JavaScript.

## Empieza por tu pregunta

| Tu pregunta | Recurso |
| --- | --- |
| ¿Qué hace Amazon Boost y cómo se organiza el trabajo? | [Método de la agencia](docs/agencia/README.md) |
| ¿Cómo conecta una decisión de publicidad con stock y margen? | [Ejemplo completo de decisión](examples/decision-conectada.md) |
| ¿Qué revisar antes de invertir más en Amazon? | [Método de diagnóstico](methodology/diagnostico.md) y [checklist](templates/checklist-auditoria.csv) |
| ¿Qué queda después de producto, logística, publicidad y honorarios? | [Calculadora y fórmulas](docs/calculadora.md) |
| ¿Qué comisión y tarifa FBA corresponden a mi producto? | [Estimador por categoría, dimensiones y peso](docs/estimador-producto.md) |
| ¿Puedo comparar dos periodos o informes? | [Criterios de comparabilidad](methodology/calidad-datos.md) |
| ¿Hay duplicados, días ausentes o cambios que debamos revisar? | [Comprobador de datos para estudios](docs/validacion-estudio.md) |
| ¿Qué demuestra realmente un caso de éxito? | [Lectura documental de dos casos](cases/README.md) |
| ¿Cómo preparo un estudio con datos de una marca? | [Protocolo de investigación](methodology/protocolo-estudio.md) |

## Una herramienta que puedes comprobar

El estimador principal parte del producto: calcula comisión, tamaño, peso facturable, elegibilidad de bajo precio, FBA local, almacenamiento y recargos con un catálogo de fuentes oficiales revisadas. También recalcula escenarios de precio y compara con envío propio cuando se introduce su coste. Explica las reglas y señala los gastos pendientes. Cubre Amazon.es; no consulta un ASIN en tiempo real.

La calculadora de cuenta se conserva para revisar periodos con costes ya conocidos. Calcula ACOS, TACOS y ROAS solo cuando se declaran sus bases. No convierte ventas en beneficio ni sustituye un denominador cero por una rentabilidad ficticia.

Para abrir la interfaz local necesitas Node.js 22 o posterior. No hay dependencias que instalar:

```sh
npm start
```

Abre la dirección local que aparece en la terminal. También puedes calcular el [ejemplo sintético](examples/cuenta-sintetica.json):

```sh
npm run calculate
npm test
npm run check
npm run validate:study
```

La herramienta no se conecta a Seller Central, no pide credenciales, no envía tus importes a Amazon Boost y no utiliza analítica. Los datos introducidos permanecen en la pestaña; se pierden al recargar. [Uso y límites](docs/calculadora.md).

## Método Amazon Boost

1. Delimitar cuenta, producto, marketplace, fechas y decisión.
2. Comprobar calidad y comparabilidad de los informes.
3. Relacionar ventas y costes con publicidad, conversión, catálogo y disponibilidad.
4. Ordenar acciones por evidencia, impacto esperado, dependencias y esfuerzo.
5. Acordar responsables y una comprobación posterior.

Es un procedimiento documentado para ordenar el trabajo, no un algoritmo validado de predicción ni un umbral universal de ACOS. [Método completo](methodology/diagnostico.md).

## Qué evidencia contiene esta versión

Hay dos fichas documentales basadas en cifras que ya aparecen en la web de Amazon Boost. Identifican fuente, precisión y límites. **No se redistribuyen informes originales, capturas, nombres de clientes ni series reconstruidas como si fueran observaciones reales.** La incorporación de nuevos materiales requiere permiso específico y revisión de anonimización.

El ejemplo de la calculadora es inventado con fines didácticos y está etiquetado como sintético. No representa a un cliente ni es un resultado comercial.

[De los números a una revisión: diagnóstico sintético paso a paso](examples/diagnostico-sintetico.md).

## Autoría y versiones

Proyecto de Amazon Boost. Versión de preparación: **0.4.0**. Última revisión de fuentes: **5 de noviembre de 2026**. [Historial](CHANGELOG.md), [fuentes](docs/fuentes.md) y [cómo citar](CITATION.cff).

[Revisión del dossier de agencia](docs/agencia/revision-0.4.0.md).

[Revisión del estimador actual](docs/revision-0.3.0.md) · [Revisión del comprobador de estudios](docs/revision-0.2.0.md) · [Revisión inicial](docs/revision-inicial.md) · [Plan para un primer estudio real](docs/plan-primer-estudio.md).

La licencia del código y la documentación está propuesta en [el plan de publicación](docs/publicacion.md), pendiente de aprobación del titular. Los logos y marcas conservan su identidad y sus derechos; citar una empresa no implica afiliación con ella.

[Decisiones sobre SEO y búsqueda con IA](docs/decisiones-seo-geo.md) · [Criterio de redacción por intención](docs/intencion-y-redaccion.md).

## Llevar el análisis a tu cuenta

En Amazon Boost conectamos gestión de Seller Central, publicidad, listings, imágenes, stock y expansión. También ofrecemos formación práctica sobre la cuenta real del equipo y ayuda con incidencias y apelaciones, según el alcance acordado.

- [Servicios de Amazon Boost](https://amznboost.es/servicios/)
- [Auditoría inicial gratuita y sin compromiso](https://amznboost.es/servicios/auditoria-de-cuenta/)
- [Gestión de cuentas Amazon](https://amznboost.es/servicios/gestion-de-cuenta/)
- [LinkedIn de Amazon Boost](https://www.linkedin.com/company/amznboost/)

Los recursos ayudan a formular mejores preguntas; los resultados dependen de la cuenta, el mercado y la ejecución. No se garantiza posicionamiento en buscadores, recomendaciones de IA, ventas o reactivación de cuentas.
