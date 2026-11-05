# Revisión de la ampliación 0.2.0

Fecha: 5 de noviembre de 2026. Estado: **preparación local; sin publicación remota ni cambios en la web**.

## Ampliación

Se ha añadido una segunda herramienta para revisar datos antes de desarrollar un estudio de disponibilidad. Comprueba una tabla normalizada de una marca, mercado y divisa, con una fila por producto y día. Señala duplicados, ausencias, entradas inválidas y contexto como precio, promociones, publicidad y cambios de contenido.

No es un conector con Amazon, no estima ventas perdidas y no certifica anonimización ni permisos. Los ejemplos incluidos son sintéticos.

## Verificación

- Veinte pruebas nuevas sobre el comprobador y el lector CSV: formatos, límites, duplicados, celdas vacías, fechas, estados de disponibilidad, definiciones y métricas.
- Pruebas previas de la calculadora y del servidor mantenidas; se amplían los recursos comprobados con la nueva pantalla y sus archivos.
- Prueba real de la pantalla con el ejemplo: diez observaciones, dos productos, cero días-producto ausentes y avisos por disponibilidad parcial y cambios de contexto.
- Duplicado introducido manualmente: se detecta sin sumarlo.
- Día retirado manualmente: se muestra una observación ausente, sin rellenarla con cero.
- Definición obligatoria vacía y plegada: se abre el apartado correspondiente e impide mostrar un resultado nuevo.
- Recarga: vacía entradas y resultados.
- Navegación entre herramientas y cálculo anterior comprobados en el navegador.
- Revisión móvil en ventanas de 390 y 320 píxeles: sin desbordamiento horizontal del documento; la tabla tiene desplazamiento interno.

## Decisión de método añadida

No se cruzan agregados por cuenta-fecha y producto-periodo para fabricar datos producto-día. Primero hay que verificar que la fuente aporta esa granularidad. También se conservan las diferencias entre fecha de pedido y atribución publicitaria. [Fuentes](fuentes.md).

## Siguiente paso con más valor

Aplicar el [plan del primer estudio](plan-primer-estudio.md) a un caso con originales y permisos disponibles. Hasta entonces la herramienta y la metodología pueden revisarse, pero no existen resultados empíricos nuevos que presentar.

Se mantienen las revisiones previas a la publicación del repositorio: método, licencia y alcance de las cifras de casos documentales. [Preparación de publicación](publicacion.md) · [Revisión inicial](revision-inicial.md).
