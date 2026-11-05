# Revisión de la primera versión

Fecha: 4 de noviembre de 2026. Estado: **preparada en local para revisión; no publicada en GitHub**.

## Qué se ha preparado

- Repositorio independiente, sin conexión de despliegue con la web existente.
- Metodología de diagnóstico, calidad de datos, checklist y registros de fuentes y decisiones.
- Calculadora de contribución, ACOS, TACOS, ROAS y margen unitario. No se conecta con Seller Central ni envía los importes introducidos.
- Ejemplo sintético y diagnóstico comentado para enseñar a pasar de los números a las siguientes comprobaciones.
- Dos fichas documentales de casos ya publicados, con fuentes y límites; sin exportaciones ni capturas de clientes.
- Protocolo para un futuro estudio original sobre disponibilidad y rendimiento comercial, sin resultados inventados.
- Criterio editorial por intención de búsqueda y decisiones documentadas de SEO/GEO.
- Fuentes primarias, cita, historial y comprobaciones automáticas para GitHub; sin publicación automática.

## Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| Cálculos y validación de entradas | 19 pruebas de cálculo correctas: ejemplo, pérdidas, ceros, datos incompletos, fechas, bases y economía unitaria |
| Servidor de revisión | Cuatro pruebas de integración correctas y su grupo: respuestas, tipos de recursos, rutas protegidas y métodos de solo lectura |
| Resultado del ejemplo en el navegador | Contribución de 2.400 €, 24 %; ACOS 30 %, TACOS 15 %, ROAS 3,33 |
| Pérdida en el navegador | Al reducir ingresos a 100 €, muestra −7.500 € y las advertencias pertinentes |
| Sin bases publicitarias | No calcula ACOS, TACOS ni ROAS |
| Formulario incompleto | No presenta un cálculo a partir de los campos vacíos |
| Margen unitario | Precio 25, costes 17: margen 8 y umbral teórico 32 %, con sus límites |
| Recarga y borrado | El resultado y los importes quedan vacíos; no hay almacenamiento persistente de la aplicación |
| Escritorio y móvil | Inspección visual; sin desbordamiento horizontal en ventanas de prueba de 390 y 320 píxeles |
| Carga del ejemplo | Se corrigió una incompatibilidad de carga y se verificó el resultado visible después |
| Enlaces locales y sintaxis | Comprobados por el verificador del proyecto |
| Entorno de producción | No se han hecho cambios ni despliegues en la web |

Las comprobaciones de GitHub Actions están preparadas; todavía no se han ejecutado en un repositorio remoto. Las capturas de revisión y la comparación del estado del repositorio web se conservan como artefactos locales excluidos del proyecto público.

## Qué conviene revisar antes de publicar

1. **Método:** confirmar que refleja el procedimiento real que Amazon Boost quiere compartir. No se atribuye revisión personal al fundador mientras no la realice.
2. **Licencias:** revisar la propuesta de licencia para código y documentación. Todavía no se ha concedido una licencia abierta al material.
3. **Casos:** revisar la reproducción en este nuevo soporte de las cifras ya publicadas. Cualquier dato original adicional requiere una autorización concreta.
4. **Identidad del repositorio:** nombre propuesto Amazon Boost Lab; configurar propietario, descripción y dirección del repositorio al crearlo.

El [plan de publicación](publicacion.md) detalla la salida. El [protocolo de estudio](../methodology/protocolo-estudio.md) define cómo ampliar después con datos reales. La propuesta de redacción de servicios permanece como documento; no se ha aplicado a la web.
