# Principios y convenciones

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 0, 0.1, 0.2, 1, 1.1, 1.2, 3, 19.

## 0. Cómo leer este documento

### 0.1 Etiquetas de confianza

Cada cifra, regla o dato lleva una etiqueta que indica su origen y su grado de certeza:

| Etiqueta | Significado |
|---|---|
| [C] | Confirmado en fuente primaria (comunicado oficial, informe o contrato publicado). Se indica el año y la fuente en el Anexo. |
| [C-P] | Reportado por prensa de forma consistente, sin confirmación oficial directa. |
| [E] | Estimado a partir de datos parciales o de una inferencia documentada. Debe recalibrarse. |
| [D] | Decisión de diseño. No es un hecho del mundo real; es una regla propuesta para el juego. |
| [NV] | Dato no verificado. Se incluye porque aparece en la investigación previa, pero no debe usarse sin contraste. |
| [A] | Decisión abierta. Se resume en la sección 16. En v1.0 no queda ninguna: todas las filas de 16 están cerradas. |

Regla general: si una cifra no lleva etiqueta, se considera [D]. En v1.0 todas las reglas [D] y [E] son válidas para implementar; solo se recalibran con los criterios de 14.9.

### 0.2 Convenciones de este documento

- Los importes se expresan en euros (€) o millones de euros (M€). En el modelo de datos se almacenan en céntimos como entero (ver 4.1).
- Las fórmulas usan los nombres de campo del modelo de datos de la sección 4, en cursiva cuando se citan dentro de texto corrido.
- Los rangos entre corchetes indican valores admisibles: `[mín, máx]`.
- Un "tick" es la unidad mínima de avance del simulador de gestión. Ver 5.1.

## 1. Alcance

### 1.1 Incluido

1. Economía del club: ingresos, gastos, caja, préstamos, impuestos y cláusulas económicas de contratos. En modo Coach, la caja la lleva el jugador (decisión de producto; ver 9.1).
2. Gestión del entrenador: objetivos, reputación, renovaciones, despidos, ofertas y relación con directiva y plantilla.
3. Estadio: aforo, secciones, obras, mantenimiento y explotación comercial (palcos, hospitality, naming, eventos, tours, restauración y tienda).
4. Plantillas y contratos: registro de jugadores, salarios, duración, amortización de fichajes, rescisiones, cesiones y límites de plantilla.
5. Control económico: ratios, límites de inversión, pérdidas permitidas y consecuencias.
6. Calendario de temporada: jornadas, pretemporada, ventanas de mercado, cierres y eventos económicos.
7. Pantallas y flujos de usuario de la parte de gestión.

### 1.2 Excluido (fuera de alcance)

- Motor de partidos en sentido táctico o visual: alineaciones con efecto táctico, jugadas, eventos de partido y tácticas en partido. Los resultados se generan con la simulación de rol de 5.5, que no modela el partido.
- Simulación de ojeo y de la base de datos de jugadores real. El juego no incluye ni reproduce datos personales de jugadores reales.
- Competiciones europeas y Copa: fuera de alcance en la versión base, sin premios ni partidos (A-06, cerrada en v1.0).
- Concesión de la restauración con canon: fuera de alcance en la versión base; solo existe la explotación directa (8.5, decisión 43). Ampliación futura.
- Multijugador y ligas en línea.

## 3. Principios de diseño

1. **Coherencia causal.** Cada ingreso o gasto tiene una causa visible para el jugador: asistencia, resultados, contratos, obras o decisiones del entrenador. No hay ingresos aleatorios sin explicación.
2. **Economía que se entiende sin hojas de cálculo.** El jugador debe poder predecir a grandes rasgos cómo cambiará la caja tras una decisión. Las fórmulas están en este documento para el programador; en la interfaz se muestran resúmenes.
3. **Restricciones antes que trucos.** Ninguna mecánica puede generar dinero sin coste equivalente (ver 19). Toda entrada tiene límites: aforo, número de cafeterías, número de conciertos, máximo de obras simultáneas.
4. **Realismo sin datos personales.** Se usan magnitudes del fútbol profesional español, pero los clubes, plantillas y jugadores reales no se incluyen en el modelo base (ver 18).
5. **Decisiones explícitas de rol.** El modo de juego determina qué parte de la gestión controla el jugador. Lo que no controla lo gestiona el sistema, de forma predecible y visible.
6. **Determinismo reproducible.** Dada una semilla y las mismas decisiones, la simulación produce el mismo resultado. Esto facilita pruebas y depuración.
7. **Sin mecánicas ocultas.** Cada factor que afecta a un resultado debe ser consultable en pantalla (desglose de causas).

---

## 19. Casos a evitar en el diseño

Estos casos se documentan para evitar que se introduzcan en el juego. No son mecánicas.

| Caso | Por qué evitarlo |
|---|---|
| Fallos de guardado que duplican ingresos o caja | Rompen el equilibrio y son trampas de la comunidad. Se prueban como defectos, no como mecánicas. |
| Duplicación de ingresos mediante venta y recompra del mismo jugador | Produce dinero sin coste. Se evita con el margen entre el precio de venta al sistema y el mínimo de compra (13.2 y 13.3, B-1) y con el bloqueo de venta en la ventana de llegada (13.3). |
| Obras que se cancelan para recuperar la caja del coste total | Se penaliza con la pérdida del 50 % del coste pagado (7.3). |
| Préstamos en ciclo para financiar su propia amortización | Se bloquea con el límite de préstamos activos y la penalización anticipada (6.7). |
| Eventos programados en cadena sin límite de calendario | Limitado por 8.6.2. |
| Venta de abonos por encima del aforo | Limitado por `abonos_vendidos` (6.2.2). |
| Reputación inflada por caminar con el césped estropeado | Limitado por 9.6 (penalización con césped < 20). |

**Regla general**: cada entrada económica tiene un coste, un límite o una restricción de calendario. Un jugador que aplique la estrategia de mayor ingreso en un periodo debe encontrar un coste de oportunidad en otro.

---

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 43 | Ronda 1.0, B-5d [D]. Restauración: en la versión base solo existe la explotación directa (`margen_club` = 0,30). La concesión con canon queda fuera de alcance, como ampliación futura. Cierra A-12. | 1.2, 8.5, 16 |
| 47 | Ronda 1.0, confirma la elección del redactor de v0.9. Un jugador no se puede revender en la misma ventana de mercado en que se compró. | 13.3, 19 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Ocupación | Asistencia dividida por aforo disponible. Valor en [0, 1]. |
| Implantación social | Tramo del reparto (25 % en Primera): 1/3 por recaudación media de abonos y taquilla de las 5 últimas temporadas y 2/3 por contribución televisiva (6.9.2) [C]. |
| Reputación del club | Índice de 0 a 100 que afecta a demanda, patrocinio y ofertas. |
| Reputación del entrenador | Índice de 0 a 100 que afecta a honorarios, ofertas y renovaciones. |
