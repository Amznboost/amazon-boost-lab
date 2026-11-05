# Revisión de la preparación del método de agencia

Fecha: 5 de noviembre de 2026. Edición 0.4.0. Estado: preparada en local; sin publicación remota.

## Contenido preparado

- Nueve procedimientos que conectan incorporación, diagnóstico, gestión, publicidad, contenido, formación, incidencias, lanzamiento/expansión y seguimiento.
- Quince respuestas a preguntas concretas de las marcas.
- Seis plantillas vacías y su índice.
- Una decisión sintética desarrollada desde la petición inicial hasta el entregable.
- Catálogo JSON con identidad, fuentes comerciales y distinción entre oferta contrastada y procedimiento propuesto.
- Dossier HTML de veinte capítulos, generado desde los documentos Markdown.
- Entrada del README, cita, versión e historial actualizados.

## Comprobaciones realizadas

1. Suite de Node: **72 pruebas correctas**. La primera ejecución restringida no pudo conectarse al servidor local; se repitió con acceso al bucle local y no hubo fallos.
2. El dossier generado coincide con sus documentos de origen. Se comprueban enlaces locales, anclas y recursos mediante el servidor de prueba.
3. El contenido se sirve como HTML; no necesita JavaScript para la lectura. El renderizador escapa HTML y rechaza enlaces ejecutables, rutas ajenas y tablas desalineadas.
4. Revisión visual en ordenador y pruebas de anchura de 390 y 320 píxeles. Sin desbordamiento horizontal de la página; las tablas tienen desplazamiento dentro de su propio contenedor.
5. Apertura de capítulos comprobada en navegador. La vista conserva encabezados, preguntas, tablas y enlaces.
6. Capturas de escritorio y móvil conservadas en la carpeta privada de artefactos, excluida del repositorio.
7. Comparación con la línea de base de la web comercial: mismo HEAD, mismo estado de archivos y mismo diff de los cambios previos. No se han modificado archivos de esa web.

La vista local utiliza noindex y solo escucha en 127.0.0.1. Esas restricciones pertenecen al servidor de revisión; no son instrucciones para bloquear el futuro repositorio público.

## Qué falta antes de publicar

Contrastar con el titular los detalles operativos y entregables propuestos, resolver las decisiones del [plan de publicación](../publicacion.md) y comprobar los enlaces externos al preparar el lanzamiento. No se ha creado un repositorio remoto, aplicado una licencia ni atribuido una revisión del titular.

No se han añadido resultados reales, testimonios, clientes, departamentos ni acreditaciones. Los casos existentes mantienen su carácter documental y el ejemplo nuevo sigue identificado como sintético.

[Leer el método](README.md) · [Fuentes y límites](evidencias-y-limites.md).
