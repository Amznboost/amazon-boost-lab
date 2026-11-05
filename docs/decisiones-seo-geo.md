# Decisiones de descubrimiento y contenido

Documento de trabajo del 4 de noviembre de 2026. Distingue lo implementado en este proyecto de posibles cambios posteriores en la web.

| Decisión | Motivo y evidencia | Estado |
| --- | --- | --- |
| Proyecto independiente de la web | Permite revisar herramienta y metodología sin alterar URLs, títulos, enlaces internos o canónicas del sitio actual | Implementado localmente |
| README organizado por preguntas reales del cliente | Hace explícitos problema, recurso y alcance; criterio editorial, sin atribuirle una mejora cuantificada de ranking | Preparado |
| Explicaciones y fórmulas disponibles en texto | Google recomienda que el contenido importante sea textual y descubrible | Preparado en Markdown; herramienta visual complementaria |
| Enlaces a las páginas actuales | Conservan la web como punto comercial y fuente de los casos; no se trasladan artículos a GitHub | Preparados, sin modificar la web |
| Citas, historial y límites de evidencia | Permiten identificar qué se afirma, de dónde sale y qué falta | Preparado; sin DOI ni revisión externa inventados |
| No usar entrenamiento como sinónimo de búsqueda | OpenAI documenta controles separados para OAI-SearchBot y GPTBot | Sin cambios en robots.txt ni preferencias de bots |
| No añadir ficheros o schema solo por prometer presencia en IA | Google indica que sus funciones de IA no requieren marcado ni archivos especiales adicionales | No se modifican los datos estructurados actuales |
| Vista local excluida de indexación | Es una preparación en este ordenador, no una URL pública terminada | Meta robots y cabecera noindex de la vista de revisión |
| No publicar una investigación sin datos revisados | Dos casos seleccionados no sustentan conclusiones sobre el mercado completo | Protocolo preparado, resultados pendientes |

## Si más adelante enlazamos desde la web

Proponer un enlace desde una página pertinente, con un texto que describa el recurso: por ejemplo, la herramienta para comprobar contribución. No añadir enlaces repetidos por toda la web ni cambiar la intención principal de una página comercial para hablar del laboratorio.

Antes de aplicar esa propuesta se revisarán contenido, navegación, móvil, build y el conjunto exacto de cambios. Su eventual efecto se observará con datos de búsqueda y captación; no se asumirá una subida por el mero hecho de enlazar.

## Cómo revisar el efecto con honestidad

1. Guardar fecha de publicación y versiones.
2. Comparar periodos equivalentes en las herramientas de búsqueda cuando exista acceso; separar marca y servicios.
3. Registrar citas concretas en respuestas de IA con consulta, fecha, plataforma y contexto. Una visita del bot no cuenta como cita.
4. Registrar procedencia declarada de los contactos sin convertirla automáticamente en atribución técnica.
5. Revisar tendencias, no cambios aislados. Un único antes/después no demuestra qué produjo una variación.

Fuentes: [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features), [OpenAI: crawlers](https://developers.openai.com/api/docs/bots) y [registro de fuentes del proyecto](fuentes.md).
