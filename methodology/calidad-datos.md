# Cuándo dos cifras de Amazon se pueden comparar

**Dos importes no son comparables solo porque ambas columnas se llamen ventas.** Antes de calcular un crecimiento o interpretar publicidad, hay que comprobar que miden lo mismo y documentar las diferencias.

| Comprobación | Qué registrar | Decisión si no coincide |
| --- | --- | --- |
| Periodo | Fechas inicial/final, días cubiertos y zona horaria | No mezclar un acumulado de nueve meses con un mes |
| Marketplace y moneda | País de venta y divisa de cada informe | Separar mercados; documentar cualquier conversión |
| Definición de ventas | Encargadas, enviadas, atribuidas o liquidadas | Mantener series separadas hasta reconciliarlas |
| IVA y devoluciones | Inclusión/exclusión y criterio temporal | Normalizar o explicar por qué no es posible |
| Atribución | Tipo de anuncio, ventana y fecha del informe | Esperar maduración o marcar provisional |
| Agregación | Cuenta, producto, variante o campaña | No dividir el gasto de un ámbito entre ventas de otro |
| Duplicados | Clave de fecha, mercado y unidad de análisis | Resolver antes de sumar |
| Datos ausentes | Partida, motivo y posible efecto | No interpretar ausencia como cero |
| Cambios concurrentes | Precio, promoción, oferta, stock, contenido, campañas | Limitar la atribución causal |

## Evidencia y precisión

- Una **captura** puede documentar lo que muestra, con su periodo y definición; no demuestra por sí sola su causa.
- Una **serie exportada** puede permitir un análisis reproducible si se conserva su origen y se documentan las transformaciones.
- Una **reconstrucción visual** no es una serie observada. Sus puntos estimados se mantienen fuera de datasets empíricos.
- Una **simulación** permite explicar una fórmula, no acreditar un resultado de cliente.
- Dos casos seleccionados no constituyen un benchmark representativo de vendedores de Amazon.

## Proceso de trabajo

1. Conservar el original en una carpeta privada de acceso limitado.
2. Registrar origen, periodo, definición y fecha de extracción en la [ficha de fuentes](../templates/registro-fuentes.csv).
3. Crear una tabla normalizada sin datos innecesarios.
4. Revisar sumas, duplicados, ausencias y consistencia de unidades.
5. Separar observaciones de interpretaciones.
6. Publicar únicamente el material autorizado y revisado; documentar correcciones con versión.

Los criterios no sustituyen las definiciones concretas que muestre cada informe. [Fuentes de referencia](../docs/fuentes.md).
