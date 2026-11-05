# De los números a una revisión: ejemplo sintético

Este ejemplo es didáctico. No corresponde a un cliente ni representa una tarifa o un resultado de Amazon Boost. La cuenta numérica es la misma del [archivo de ejemplo](cuenta-sintetica.json).

## La pregunta

«Ingresamos 10.000 € netos este mes: ¿podemos aumentar la publicidad?»

La calculadora no responde automáticamente «sí». Primero reconstruye qué queda con los costes declarados.

| Concepto | Importe del ejemplo |
| --- | ---: |
| Ingresos netos | 10.000 € |
| Producto vendido | 3.000 € |
| Comisiones | 1.500 € |
| Logística de pedidos | 800 € |
| Entrada a almacén y almacenamiento | 200 € |
| Procesar devoluciones | 100 € |
| Otros costes variables | 0 € |
| Publicidad | 1.500 € |
| Honorarios de gestión, importe didáctico | 400 € |
| Otros costes fijos | 100 € |
| **Contribución con esos costes** | **2.400 € / 24 %** |

Con unas ventas atribuidas sintéticas de 5.000 € y unas ventas totales del informe de 10.000 €, el ACOS es del 30 %, el TACOS del 15 % y el ROAS de aproximadamente 3,33. La base didáctica iguala impuestos y devoluciones; un informe real puede usar criterios distintos.

## Lo que sabemos y lo que no

Los costes introducidos dejan contribución positiva. No se han comprobado stock, reparto por producto, rendimiento marginal de campañas, flujo de caja, impuestos sobre el beneficio ni gastos fuera del alcance introducido.

Por tanto, el resultado justifica continuar el diagnóstico; **no basta para recomendar un aumento de presupuesto**. Tampoco significa que el saldo de Amazon coincida con 2.400 €.

## Próximas comprobaciones

| Pregunta | Evidencia que pediríamos | Qué decisión ayuda a preparar |
| --- | --- | --- |
| ¿Todos los productos aportan margen? | Ventas y costes por ASIN, con periodos equivalentes | Separar referencias que admiten inversión de otras que primero necesitan corregir costes u oferta |
| ¿Hay disponibilidad suficiente? | Stock vendible y reposiciones verificadas | Evitar una ampliación publicitaria incompatible con el suministro |
| ¿Qué campañas captan demanda adicional? | Informes de campañas y términos con su atribución | Formular pruebas concretas, con límites y fecha de revisión |
| ¿La ficha permite convertir esa demanda? | Sesiones, pedidos, contenido y cambios documentados | Priorizar un problema de conversión antes de comprar más tráfico |

No hay respuestas inventadas para esas preguntas. En un diagnóstico real quedarían como pendientes hasta recibir las evidencias.

## Entregable resultante

Un informe útil separaría hallazgos comprobados, hipótesis y datos faltantes. Cada acción tendría responsable, dependencia, métrica y fecha de revisión. El [registro de decisiones](../templates/registro-decisiones.csv) permite documentarlo sin presentar una hipótesis como conclusión.

[Cómo diagnosticamos](../methodology/diagnostico.md) · [Fórmulas y límites](../docs/calculadora.md)
