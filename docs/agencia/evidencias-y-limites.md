# De dónde sale esta documentación y qué queda por validar

Revisión documental: 5 de noviembre de 2026. Esta edición prepara una explicación pública del trabajo de Amazon Boost. No certifica su implantación interna ni aporta un estudio empírico nuevo.

## Servicios contrastados

El contraste utiliza el código local de las páginas comerciales de la web en la versión 91d6f041f0eaeac4ada34df4fe4df74af27754b5 como referencia de contenido. No equivale a certificar que cada URL remota responda actualmente: dos páginas no pudieron recuperarse con el lector web utilizado. Esos fallos de herramienta no prueban un fallo del sitio.

| Materia | Referencia comercial | Alcance que sustenta |
| --- | --- | --- |
| Gestión | [Gestión de cuenta](https://amznboost.es/servicios/gestion-de-cuenta/) | Coordinación de cuenta, PPC, catálogo, contenido y stock según alcance; titularidad del cliente |
| Diagnóstico | [Auditoría](https://amznboost.es/servicios/auditoria-de-cuenta/) | Revisión inicial gratuita, diferencia frente a análisis exhaustivo |
| Publicidad | [PPC](https://amznboost.es/servicios/gestion-de-ppc/) | Función por campaña, contexto de margen, atribución y coordinación |
| Contenido | [Listings](https://amznboost.es/servicios/optimizacion-de-listados/) e [imágenes](https://amznboost.es/servicios/imagenes-para-amazon/) | Búsquedas, argumentos de producto y coherencia visual |
| Formación | [Formación para empresas](https://amznboost.es/servicios/formacion-amazon-empresas/) | Trabajo sobre cuenta propia, programas, sesiones y canal acordado; servicio independiente |
| Incidencias | [Desbloqueos](https://amznboost.es/servicios/desbloqueos-amazon/) | Revisión, POA cuando procede, seguimiento y ausencia de garantía |
| Lanzamiento y expansión | [Servicios](https://amznboost.es/servicios/) | Acompañamiento a distintas fases y coordinación europea; alcance a concretar |

Archivos de referencia del sitio, sin copiar datos privados: src/data/service-pages.ts, src/data/training.ts, src/data/unlocking-service.ts y sus componentes de presentación. El código antiguo de src/data/services no se toma como referencia preferente cuando existe una definición actual de la página.

## Qué hemos desarrollado para este proyecto

Los procedimientos, campos de plantilla, estados y ejemplo de decisión son una propuesta editorial y operativa elaborada para el repositorio. Desarrollan el enfoque publicado, pero no prueban que cada plantilla o fase se haya utilizado históricamente en todos los clientes.

Antes de hacerlos públicos conviene contrastar con el titular: documentación que realmente se entrega, responsables, nivel de detalle publicable y particularidades de cada servicio. Las frecuencias, SLA, tarifas y garantías comerciales no se deducen de una plantilla.

La skill de gestión de cuentas de ALL IN se ha utilizado como apoyo de organización: aislamiento de información, alcance y separación entre datos y estimaciones. No acredita un partnership, una certificación de la agencia ni que el calendario de esa skill sea una promesa comercial de Amazon Boost.

## Qué evidencia real hay

Las dos [fichas documentales](../../cases/README.md) resumen casos ya publicados con sus límites. No se han añadido cifras, resultados ni nombres. El ejemplo nuevo es [sintético](../../examples/decision-conectada.md) y no incluye mejoras observadas tras ejecutar las acciones.

Un futuro caso necesita fuente autorizada, periodo y definición de métricas, permiso específico para los materiales y revisión de riesgo de identificación. La metodología por sí sola no convierte un caso en un experimento causal.

## Por qué este formato tiene sentido para búsqueda

La documentación de [Google sobre funciones generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) mantiene la relevancia del SEO y del contenido útil y claro. Aquí aplicamos ese criterio mediante preguntas, respuestas autónomas y navegación entre método, evidencia y servicio. Es una decisión editorial: no se ha medido una mejora de visibilidad por este proyecto.

La documentación de [OpenAI sobre crawlers](https://developers.openai.com/api/docs/bots) distingue búsqueda y entrenamiento. Crear un repositorio no confirma inclusión en ninguno de esos sistemas. No se han cambiado controles de bots de la web.

## Relación con amznboost.es

La web sigue siendo la referencia para contratar. El repositorio amplía procedimientos y recursos útiles; no copia íntegramente las páginas comerciales ni sustituye sus URLs.

Una futura mención en la web puede ser un enlace contextual desde una página pertinente. Se evaluará aparte, sin cambios masivos de contenido, URLs, canonical, robots o sitemap. Publicar una documentación en GitHub no requiere alterar primero la web.

## Lista antes de una publicación futura

- Revisar que los procedimientos representan lo que se quiere ofrecer y hacer público.
- Mantener identificados los ejemplos sintéticos y los límites de las fichas documentales.
- Resolver cuenta propietaria, nombre remoto y licencia según el [plan de publicación](../publicacion.md).
- Verificar los enlaces externos y el estado del repositorio público tras crearlo.
- Registrar una línea de base y después observar descubrimiento y menciones sin confundirlos con captación.
