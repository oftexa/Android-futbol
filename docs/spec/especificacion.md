# Especificación funcional y de datos: juego de gestión de fútbol (economía, estadio y entrenador)

| Campo | Valor |
|---|---|
| Documento | Especificación funcional y de datos, versión 1.0 (especificación cerrada para desarrollo; ronda 1.0: A-26 aceptada (rangos de 14.8 y total de 221 M€), B-3 confirmada, B-5c y B-5d decididas, elecciones del redactor de v0.9 confirmadas como decisiones de producto (filas 40 a 48 de 0.3) y cierre de todas las decisiones abiertas de la sección 16; ronda 0.9: decisiones de producto F-1, F-2 y B-1 a B-7 y añadidos de determinismo aplicados (filas 29 a 39 de 0.3): pools de comercialización y audiovisual de Primera y Segunda con el reparto 90/10 y 50/25/25 del Real Decreto-ley 5/2015, límite legal de dispersión en lugar de K, mercado, objetivos, condición física, ingresos propios, estadio y generador; cifras recalculadas con calc_v09/check.py y cierre de 14.8 en 221 M€; ronda 0.8: revisión final de implementabilidad, correcciones técnicas [D] sin cambio de balance y checklist de implementación en la sección 23; las propuestas que cambian el balance quedan fuera del documento, en el informe revision_final_v08.md; ronda 0.7: mínimo de "otros" en 14.8 bajado de 1 % a 0,5 %; ronda 0.6: total de 14.8 en 254 a 260 M€ (antes 240 a 260 M€), royalty de camisetas aclarado en 8.1, `precio_valla_partido` definido en 6.2.8, URLs de clubes retiradas del Anexo, anclas [NV] de 14.8 marcadas) |
| Ámbito | Referencia: 1.ª y 2.ª división de la liga española. En el juego, las competiciones se llaman "Primera" y "Segunda", sin marcas comerciales [D]. |
| Temporada de partida | 2026/27 |
| Fecha de referencia de los datos | 22 de octubre de 2026 |
| Idioma | Español |
| Dependencias externas | Ninguna obligatoria. Resultados, clasificación, lesiones y minutos los genera la simulación de 5.5. El mercado de jugadores usa las reglas internas de 13.2 y 13.3 (B-1), sin módulo externo |
| Estado | Cerrada para desarrollo (v1.0). No quedan decisiones abiertas ni puntos pendientes de producto. Las cifras [D] y [E] son reglas del juego; su calibración posterior se hace con los criterios de 14.9 |

---

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

### 0.3 Decisiones de producto aplicadas

Las referencias "decisión de producto N" del documento apuntan a esta tabla.

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Modo Coach: la caja la gestiona el jugador, sin presupuesto fijo de la directiva. En Coach no existe el objetivo `presupuesto_no_superar` ni techo de gasto, y no hay consecuencias ligadas a ese objetivo. | 4.4 (`gestor_caja`), 9.1, 9.3, 9.13, 10.4, 13.1, A-02 |
| 2 | Resultados, clasificación, lesiones, minutos, asistencia y afición los genera una simulación tipo rol con componente aleatorio. Sin módulo externo. | 1.3, 5.5, 8.2, A-01 |
| 3 | Cobros y pagos mensuales con un único orden de liquidación por tick. | 5.1.1, 5.2, 6.5, 6.10 |
| 4 | Partida base en la temporada 2026/27. | 4.2, 5.1, 11.1, 15 |
| 5 | Plantillas, jugadores y entrenadores ficticios. Sin nombres reales. | 15.5, 15.3, 18.1 |
| 6 | Clubes, escudos y estadios ficticios. Sin marcas reales. | 15.3, 15.5, 18.1, A-17 |
| 7 | **Sustituida en v0.9 por las decisiones 29 (F-1) y 30 (F-2).** Antes: pools de 990 M€ (nacional) y 1.585 M€ (comercialización) solo de Primera, y pool propio de Segunda. | 6.2.4, 6.2.6, 6.9.1, 6.9.3, 14.1, 14.8 |
| 8 | Derechos digitales: un único modelo. Se elimina el modelo de seguidores. El reparto "por tercios" de esta decisión se sustituye en v0.9 por el modelo legal de la decisión 30 (el 1/3 y 2/3 queda como subdivisión del tramo de implantación social). | 6.2.5, 6.9.2, 8.7, 14.5, 17.3 |
| 9 | Factor de situación: posición × racha (multiplicativo). La racha afecta a la afición (asistencia y moral). | 5.5.4, 8.2, 6.12 |
| 10 | Ocupación máxima: preferente 0,80; VIP 0,95. Una sola fórmula de ocupación (8.2). | 4.6, 7.4, 8.2, 8.6.3, 6.12 |
| 11 | Promanager: se desbloquea por objetivos del club actual. | 9.1, 9.3, 15.4 |
| 12 | Cobros y pagos mensuales: todos en el primer tick del mes, en el orden de la columna "Orden" de 6.5. | 5.1, 5.2, 6.5, 6.10, 6.11 |
| 13 | Baja muy larga: más de 120 días. Rango de lesiones: 3 a 150 días. | 5.5.5, 6.6.2, 9.12.4, 12.4 |
| 14 | Premio de permanencia: gasto del club (prima a la plantilla al cierre de temporada). | 6.3.4, 6.5, 6.6.3 |
| 15 | Aforo de conciertos: aforo propio del evento, con el ingreso ajustado a su aforo. Sin límite por el aforo del estadio. | 4.17, 8.6.1, 8.6.3, 13.5 |
| 16 | INCN: solo derechos, taquilla y comercialización. | 10.1 |
| 17 | Cláusulas (rescisión, casa y coche, prima de gol): la fuente de verdad es la entidad `Clausula`; `Contrato` solo la referencia por id. | 4.9, 4.10, 6.3.4, 6.6 |
| 18 | Ciclo de derechos 2027/28 a 2031/32: 5.250 M€ es el total del ciclo (unos 1.050 M€ por temporada). | 4.2, 6.2.4, 14.1, 14.8, A-04 |
| 19 | **Sustituida en v0.9 por la decisión 30 (F-2).** Antes: factor K = 4,0 [D] sin fuente. Ahora rige el límite legal de dispersión del art. 5.5 del Real Decreto-ley 5/2015 (3,5 veces con un reparto de 1.500 M€ o más; 4,5 en otro caso) [C], más estricto que K = 4,0, que queda redundante y se elimina. | 6.9.2, 14.5, 14.9 |
| 20 | Base de seguidores del club (`seguidores_club`, 4.4) para tienda online y camisetas. `fans_activos` queda solo para asistencia y ocupación de estadio. | 4.4, 8.1, 8.2 |
| 21 | Patrocinio de 8.3 sin cambio de cifra (23 M€, sin naming). El rango de 14.8 para patrocinio pasa al 4 % a 10 %. **Rango sustituido por A-26 (decisión 40, v1.0)**: 4 % a 11 %. El naming va en fila propia de 14.8. | 8.3, 14.8, 14.9 |
| 22 | Vallas publicitarias: fila propia en 14.8 con rango [D] de 7 % a 8 %. **Rango sustituido por A-26 (decisión 40, v1.0)**: 7 % a 9 %. | 6.2.8, 14.8 |
| 23 | Pool digital de 40 M€, sin sumarse al pool audiovisual [D]. El modelo de seguidores de 8.7 era el de los ingresos digitales y queda eliminado. En v0.9 su reparto sigue el modelo legal de la decisión 30 (50/25/25 con límite legal), en lugar de tercios sin límite K. | 6.2.5, 6.9.1, 6.9.2, 8.7, 14.1 |
| 24 | **Sustituida por A-26 (decisión 40, v1.0).** Antes: total de 14.8 en 254 a 260 M€, con derechos al 29 % a 32 % y comercialización al 30 % a 33 %. Ahora: total de referencia 221 M€ [D] (cierre calculado 221,62 M€ en v1.0, 221,46 M€ en v0.9), derechos 26 % a 32 % y comercialización 28 % a 33 %. | 14.8, 14.9 (criterio 8) |
| 25 | Ronda 0.5, decisión 2: naming rights en fila propia de 14.8, con rango 4 % a 5 % [D]. **Rango sustituido por A-26 (decisión 40, v1.0)**: 4 % a 6 %. | 8.3, 14.8 |
| 26 | Ronda 0.5, decisión 3: `fans_activos` entra en la demanda de 8.2 como factor `f_fans` (peso 0,20; rango 0,90 a 1,10). Mismo nombre de campo en 4.4 y 8.2. Cierra A-23. | 4.4, 8.2, 6.12 |
| 27 | Ronda 0.5, decisión 4: merchandising (8.1) al 2 % a 3 % del ingreso total. Para llegar, la base de seguidores pasa de 1.000 a 8.000 por punto de reputación. Cierra A-24. | 4.4, 8.1, 14.8, 14.9 |
| 28 | Ronda 0.7, decisión de producto: mínimo de "otros" en 14.8 bajado de 1 % a 0,5 %. En v0.9 y v1.0, "otros" (museo, tours y premio de liga) sale en 1,75 % del cierre de 221 M€, dentro de la fila. | 14.8, 14.9 (criterio 8) |
| 29 | Ronda 0.9, F-1. Comercialización: 1.585 M€ (1.584,5 M€ [C], informe económico de LaLiga 2024/25, S-02) es el pool de Primera más Segunda, no solo de Primera. El juego usa 1.584,5 M€: Primera recibe el 90 % (1.426,05 M€) y Segunda el 10 % (158,45 M€). Aplicar el 90/10 a la comercialización es [D], por analogía con el art. 5.2 del Real Decreto-ley 5/2015. | 6.2.6, 6.9.1, 14.1, 14.8, 17.2 |
| 30 | Ronda 0.9, F-2. Reparto audiovisual según el Real Decreto-ley 5/2015 [C, BOE, S-14]: art. 5.2, 90 % Primera y 10 % Segunda; art. 5.3 en Primera, 50 % a partes iguales, 25 % por resultados deportivos y 25 % por implantación social, que se divide en 1/3 por recaudación media de abonos y taquilla (5 últimas temporadas) y 2/3 por contribución a la generación de ingresos televisivos (audiencia); art. 5.5, límite de dispersión de 3,5 veces si el reparto es de 1.500 M€ o más, y 4,5 en otro caso. Fondo de compensación de descendidos del 2,5 %: se mantiene. Datos: reparto 2024/25 de 1.432,12 M€ (Primera 1.292,09 / Segunda 140,03) [E, una sola fuente de prensa, la suma cuadra]; ocupación de Segunda 2024/25 68,5 % [C] (61,7 % es la de 2023/24); los 4.950 M€ del ciclo nacional cubren solo partidos de Primera [E]. Sustituye el reparto "por tercios" y el factor K = 4 (decisión 19). | 6.2.4, 6.2.5, 6.9, 14.1, 14.4, 14.5, 14.8, 14.9 |
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 32 | Ronda 0.9, B-2. Tres objetivos por temporada: deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda). Manager: `presupuesto_no_superar` = presupuesto de 10.4. Un entrenador sin club recibe siempre al menos 1 oferta. En Coach y Promanager no se asigna `saldo_minimo` (decisión 46, v1.0). | 9.1, 9.3, 9.8, 9.9, 10.4, 13.7 |
| 33 | Ronda 0.9, B-3. Condición física: en semanas con partido solo se recupera lo que da el plan de entrenamiento; en semanas sin partido, +5. El plan intenso mejora atributos (puntos de entrenamiento) y recupera menos. | 9.12.1, 9.12.3 |
| 34 | Ronda 0.9, B-4. Comercialización e internacional con el mismo modelo legal que la decisión 30 (Primera 50/25/25, con límite legal de dispersión); en Segunda, la posición es la de la temporada anterior. Cierra A-05. | 6.2.5, 6.2.6, 6.9.3 |
| 35 | Ronda 0.9, B-5. Patrocinio = valor de tabla × (0,52 + 0,008 × reputación) [D], que mantiene los 23 M€ del club de referencia; contratos de carga y ofertas al vencer. Precio de taquilla limitado al 50 % a 200 % del precio base. Las plazas de palco vendidas se cobran solo como palco (6.2.3) y no como taquilla (sin doble conteo). | 4.4, 6.2.1, 6.2.3, 8.2, 8.3 |
| 36 | Ronda 0.9, B-6. Una ampliación inutiliza solo el 10 % de su sección mientras dura la obra. Parámetros de eventos, hospitality, palcos, aparcamiento y reforma general [D]. | 7.2, 7.3, 7.7, 8.6 |
| 37 | Ronda 0.9, B-7. Premio de liga incluido en "otros" de 14.8. Generador con caja inicial = 0,25 M€ × reputación (Primera) y personal de 8 M€ [D]. | 14.8, 15.5 |
| 38 | Ronda 0.9, añadido de producto [D]. PCG32 con `initstate = Partida.semilla` e `initseq = k` (índice del flujo), para que dos implementaciones den la misma secuencia. | 4.1, 23.2 |
| 39 | Ronda 0.9, añadido de producto [D]. Determinismo numérico: sin `Math.pow`, `Math.exp` ni `Math.log` (ni equivalentes dependientes de plataforma) en el núcleo; librería matemática propia; importes en céntimos enteros con redondeo explícito (regla de 4.1). Criterio: misma semilla y mismos datos dan el mismo saldo al céntimo tras 3 temporadas. | 4.1, 23.2 |
| 40 | Ronda 1.0, A-26 [D]. Se aceptan los rangos ampliados de 14.8: derechos mínimo 26 % (26 % a 32 %), comercialización mínimo 28 % (28 % a 33 %), patrocinio 4 % a 11 %, naming 4 % a 6 % y vallas 7 % a 9 %; total de referencia del club de referencia de Primera 221 M€ [D] (tolerancia ±1 M€). Sustituye los rangos de las decisiones 21, 22, 24 y 25. Cierra A-26. | 14.8, 14.9 (criterio 8), 16 |
| 41 | Ronda 1.0, B-3. Se confirma la columna de recuperación en semana con partido de 9.12.3: +3 `suave`, +2 `normal`, +1 `intenso` (el plan intenso recupera menos). | 9.12.1, 9.12.3 |
| 42 | Ronda 1.0, B-5c [D]. Tienda física fuera de día de partido: visitantes del mes = visitas de museo y tours del mes; ingreso = visitantes × 0,04 × 35 €, cobrado el primer tick de cada mes. Se elimina la restauración fuera de día de partido de 6.5. | 6.5, 8.1, 8.4, 8.5, 14.8 |
| 43 | Ronda 1.0, B-5d [D]. Restauración: en la versión base solo existe la explotación directa (`margen_club` = 0,30). La concesión con canon queda fuera de alcance, como ampliación futura. Cierra A-12. | 1.2, 8.5, 16 |
| 44 | Ronda 1.0, confirma la elección del redactor de v0.9. El umbral de 1.500 M€ del límite de dispersión se compara con la suma de todos los pools de liga de la temporada (audiovisual, comercialización y digital de Primera y Segunda). | 6.9.1, 14.5 |
| 45 | Ronda 1.0, confirma la elección del redactor de v0.9. Reparto de Segunda 70 % igual, 15 % resultados y 15 % implantación social. | 6.9.3, 14.5 |
| 46 | Ronda 1.0, confirma la elección del redactor de v0.9. En Coach y Promanager no hay objetivo `saldo_minimo` (saldo ≥ 0): solo cuentan el deportivo y la ocupación, con pesos 0,667 y 0,333. | 9.3, 13.1 |
| 47 | Ronda 1.0, confirma la elección del redactor de v0.9. Un jugador no se puede revender en la misma ventana de mercado en que se compró. | 13.3, 19 |
| 48 | Ronda 1.0 [D]. Cierre de las decisiones abiertas restantes de la sección 16 con su recomendación: A-03 (b), A-06 (a), A-07 (b), A-08 (b), A-09 (a: lineal por defecto, francesa como opción ya especificada), A-10 (a), A-13 (b), A-14 (b, la que ya aplica 5.5.2), A-15 (a), A-18 (a), A-19 (a). | 16 |

---

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

### 1.3 Resultados, clasificación y lesiones

Sin motor de partidos, los resultados de jornada, la clasificación, las lesiones y los minutos de juego los genera la simulación de rol descrita en la sección 5.5 [D]. El juego no depende de ningún módulo de competición externo (decisión de producto; cierra A-01 en 16).

La simulación produce, por jornada o por semana:

- resultado (victoria, empate o derrota, con goles a favor y en contra);
- clasificación acumulada y final de temporada;
- lesiones por jugador, con duración en días y efecto económico (9.12.4);
- minutos jugados por jugador y semana (9.12.1).

Si en el futuro se integra un módulo externo, solo podrá sustituir a la simulación si entrega estos mismos campos.

---

## 2. Glosario

| Término | Definición |
|---|---|
| Aforo | Número total de localidades físicas del estadio, incluidas las de palco, sin contar las obras. |
| Aforo disponible | Aforo menos localidades bloqueadas por obra o mantenimiento en la fecha del partido. |
| Abono | Título de acceso anual o multianual a localidades fijas. |
| Abono 5 años | Abonos con antigüedad de cinco temporadas o más. Desde v0.9 no interviene en el reparto audiovisual (la implantación social usa la recaudación, 6.9.2); se conserva como dato informativo (4.23). |
| Asistencia | Número de espectadores que acceden a un partido o evento. |
| Seguidores del club (`seguidores_club`) | Base de seguidores del club para tienda online y camisetas (4.4, 8.1). Distinta de los aficionados de estadio. [D] |
| Aficionados de estadio (`fans_activos`) | Base de aficionados de estadio, usada solo para asistencia y ocupación (8.2). [D] |
| Ocupación | Asistencia dividida por aforo disponible. Valor en [0, 1]. |
| Taquilla | Ingreso por venta de localidades sueltas en partidos y eventos. |
| Matchday | Conjunto de ingresos ligados a día de partido: taquilla, abonos imputados, palcos, hospitality, restauración y tienda de día. |
| Palco | Espacio cerrado de venta por temporada o por partido. |
| Hospitality | Servicio de experiencia premium por partido (zonas de restauración y acceso prioritario). |
| Naming rights | Derecho de denominación comercial del estadio por contrato plurianual. |
| Derechos audiovisuales | Ingresos por emisión de partidos, nacionales e internacionales. |
| Reparto audiovisual | Distribución de los derechos entre divisiones y clubes según el Real Decreto-ley 5/2015 (6.9) [C]. |
| Resultados deportivos | Tramo del reparto (25 % en Primera) que depende de la posición final de las temporadas anteriores (6.9.2) [C]. |
| Implantación social | Tramo del reparto (25 % en Primera): 1/3 por recaudación media de abonos y taquilla de las 5 últimas temporadas y 2/3 por contribución televisiva (6.9.2) [C]. |
| Contribución televisiva | Parte de la implantación social basada en la aportación de cada club a la generación de ingresos televisivos (audiencia). |
| Límite de dispersión | Razón máxima entre el mayor y el menor reparto de una división: 3,5 con un reparto de 1.500 M€ o más; 4,5 en otro caso (art. 5.5 del Real Decreto-ley 5/2015) [C]. |
| Fichaje | Incorporación de un jugador con coste de traspaso. Se amortiza en el tiempo. |
| Traspaso | Operación de compra o venta de un contrato federativo entre clubes. |
| Cesión | Préstamo de un jugador a otro club. |
| Rescisión | Terminación anticipada de un contrato con indemnización. |
| Cláusula casa y coche | Bonus económico de firma o renovación, cuyo importe crece con el número de jugadores que la tienen. |
| Masa salarial | Definición única en 10.1. |
| Ingresos netos de competición (INCN) | Definición única en 10.1. |
| Promotor | Oferta de evento generada por el sistema, con canon fijo y porcentaje para el club (8.6). No tiene datos propios: sus valores van en `Evento`. [D] |
| Pérdidas permitidas | Pérdida neta máxima de un ejercicio antes de sanción. |
| Reputación del club | Índice de 0 a 100 que afecta a demanda, patrocinio y ofertas. |
| Reputación del entrenador | Índice de 0 a 100 que afecta a honorarios, ofertas y renovaciones. |
| Objetivo | Condición medible de temporada asignada al entrenador o al club. |
| Ventana de mercado | Periodo en el que se pueden registrar altas y bajas (verano e invierno). |
| Inscripción | Registro de un jugador en la plantilla de competición. Limita el número de jugadores. |
| Comunitario | Nacional de un Estado de la Unión Europea o del Espacio Económico Europeo, o de Suiza. [D] Ver 12.2. |

---

## 3. Principios de diseño

1. **Coherencia causal.** Cada ingreso o gasto tiene una causa visible para el jugador: asistencia, resultados, contratos, obras o decisiones del entrenador. No hay ingresos aleatorios sin explicación.
2. **Economía que se entiende sin hojas de cálculo.** El jugador debe poder predecir a grandes rasgos cómo cambiará la caja tras una decisión. Las fórmulas están en este documento para el programador; en la interfaz se muestran resúmenes.
3. **Restricciones antes que trucos.** Ninguna mecánica puede generar dinero sin coste equivalente (ver 19). Toda entrada tiene límites: aforo, número de cafeterías, número de conciertos, máximo de obras simultáneas.
4. **Realismo sin datos personales.** Se usan magnitudes del fútbol profesional español, pero los clubes, plantillas y jugadores reales no se incluyen en el modelo base (ver 18).
5. **Decisiones explícitas de rol.** El modo de juego determina qué parte de la gestión controla el jugador. Lo que no controla lo gestiona el sistema, de forma predecible y visible.
6. **Determinismo reproducible.** Dada una semilla y las mismas decisiones, la simulación produce el mismo resultado. Esto facilita pruebas y depuración.
7. **Sin mecánicas ocultas.** Cada factor que afecta a un resultado debe ser consultable en pantalla (desglose de causas).

---

## 4. Modelo de datos

### 4.1 Convenciones generales

| Convención | Regla |
|---|---|
| Identificadores | Cadena UUID v4 para todas las entidades. Campo `id`. |
| Importes | Entero en céntimos de euro (`importe_cent`). Evita errores de coma flotante. |
| Fechas | Fecha ISO 8601 en zona horaria del club; el calendario de temporada usa `semana` y `tick`. |
| Porcentajes | Decimal en [0, 1], salvo cuando se indica "0 a 100". |
| Borrado | Lógico (`activo = false`). No se borran movimientos económicos. |
| Auditoría | Todas las entidades tienen `creado_en`, `actualizado_en` y `version`. |
| Enumeraciones | Valores en minúscula con guion bajo, listados en cada tabla. |
| Redondeo [D] (v0.8) | Los cálculos intermedios se hacen en coma flotante de doble precisión y se redondean solo al guardar. Importes: a céntimo entero, mitades hacia arriba en valor absoluto. Personas, unidades y localidades: al entero más próximo, mitades hacia arriba. Puntos de reputación, moral, condición física y césped: se guardan con un decimal y se muestran enteros, salvo que la regla diga "entero". Repartos que deben sumar un total exacto (pools, 6.9; bolsas, 6.6.3): método del mayor resto sobre céntimos. Series de tramos (10, 12 o N cuotas): todas las cuotas iguales redondeadas a céntimo y la última absorbe la diferencia. |
| Aleatoriedad [D] (v0.8; inicialización fijada en v0.9, decisión 38) | Generador PCG32 (XSH RR, 64 bits de estado, multiplicador 6364136223846793005), inicializado con el procedimiento de referencia `pcg32_srandom(initstate, initseq)`. Semilla de la partida en `Partida.semilla` (4.24). Un flujo independiente por subsistema, con `initstate = Partida.semilla` e `initseq = k` (índice del flujo); el incremento interno es `(initseq << 1) | 1`. Así dos implementaciones producen exactamente la misma secuencia en cada flujo (v0.8 usaba semilla `Partida.semilla + k` sin fijar `initseq`). Flujos: k = 1 calendario, 2 resultados y goles, 3 lesiones, 4 renovación de abonos, 5 eventos, 6 ofertas y despidos, 7 generador de carga. Uniforme `u` ∈ [0, 1) = entero de 32 bits / 2^32. Poisson: algoritmo de Knuth con el mismo flujo. Orden de sorteo: por índice de partido de la jornada (5.4) y, dentro de cada club, por `codigo` de jugador ascendente. |
| Determinismo numérico [D] (v0.9, decisión 39) | El núcleo de simulación (5.5, 6, 7, 8, 9 y 10) no usa `Math.pow`, `Math.exp`, `Math.log` ni otras funciones de coma flotante cuyo resultado dependa de la plataforma o del motor. Usa una librería matemática propia del núcleo: potencias de exponente entero por multiplicación repetida (por ejemplo `u^3` en 9.12.4); potencias de exponente no entero, `exp` y `log` (por ejemplo `10^(−d/25)` y `^0,5` en 5.5.3, `(p / p_ref)^(−1,2)` en 8.2, `cafeterias_numero^0,6` en 8.5) con una aproximación fija (serie o tabla con interpolación) de coeficientes publicados en el código del núcleo e idénticos en todas las plataformas, con error relativo menor de 1e−9 en el rango de uso. Solo se permiten suma, resta, multiplicación, división y raíz cuadrada de IEEE 754 de doble precisión, que son exactas por norma. Los importes monetarios se guardan y acumulan en céntimos enteros; cada paso de coma flotante a céntimos usa la regla de redondeo de esta tabla (mitades hacia arriba en valor absoluto), de forma explícita. Criterio de aceptación en 23.2. |
| Caja frente a resultado [D] (v0.8) | Los movimientos con `afecta_caja = false` (4.13) solo cuentan en la cuenta de resultados (amortización, beneficio contable de traspasos). El saldo de caja solo suma movimientos con `afecta_caja = true`. |

### 4.2 Entidad `Temporada`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | Identificador. |
| anio_inicio | entero | [2020, 2100] | Año de inicio, por ejemplo 2026 para 2026/27. |
| etiqueta | texto | "2026/27" | Derivado de `anio_inicio`. |
| fecha_inicio | fecha | | Primer día de la temporada (inicio de pretemporada). Para la partida base es el inicio de 2026/27 (semana 1 de julio de 2026) [D] (decisión de producto 4). |
| fecha_fin | fecha | | Cierre del ejercicio económico: 30 de junio [D] (A-18, cerrada en v1.0). |
| num_jornadas | entero | 38 o 42 | Según competición. [D] Primera: 38; Segunda: 42, por formato de ida y vuelta (2 × (equipos − 1)). Sin fila en el Anexo. |
| ciclo_derechos | texto | "2022-2027", "2027-2032" | Ciclo de derechos audiovisuales vigente. |
| estado | enumeración | `pretemporada`, `competicion`, `cerrada` | Estado de la temporada. |

Nota: el ciclo de derechos 2022/23-2026/27 termina en la temporada 2026/27 [NV, S-04, no leída en detalle]. El siguiente ciclo empieza en 2027/28 [NV, P-11, sin URL localizada].

### 4.3 Entidad `Competicion`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| nombre | texto | | Por ejemplo, "Primera" o "Segunda" (nombres del juego, sin marcas) [D]. |
| division | enumeración | `primera`, `segunda` | |
| num_equipos | entero | Primera: 20. Segunda: 22 | [D] Formato de la liga. Sin fila en el Anexo. |
| num_jornadas | entero | 38 o 42 | [D] Ver 4.2. |
| partidos_local_por_equipo | entero | Primera: 19. Segunda: 21 | Derivado. |
| ventanas_mercado | lista | verano, invierno | Ver 11.3. |

### 4.4 Entidad `Club`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| codigo | texto | `P01`…`P20`, `S01`…`S22`, `T01`… | Código de carga (15.3). Desempate estable en sorteos y listados [D] (v0.8). |
| nombre | texto | Hasta 60 caracteres | Nombre del club. Sin marcas ni escudos reales en la versión base [D]. |
| division_actual | enumeración | `primera`, `segunda` | |
| reputacion | entero | [0, 100] | Reputación del club. Ver 9.6. |
| seguidores_club | entero | ≥ 0 | Base de seguidores del club para tienda online y camisetas (8.1). Distinta de los aficionados de estadio (`fans_activos`, 8.2), que solo intervienen en asistencia y ocupación. Valor inicial [D] = `aforo_total × 0,6 + reputacion × 8.000` (v0.5, decisión 27; antes 1.000 por punto, que daba 85.680 en el club de referencia). Se recalcula al inicio de temporada. |
| fans_activos | entero | ≥ 0 | Base de aficionados de estadio. Solo entra en asistencia y ocupación, como factor `f_fans` de 8.2 (peso 0,20; rango 0,90 a 1,10). Inicial y recálculo al inicio de temporada [D] = `aforo_total × 0,6` (25.680 en el club de referencia). Sin dinámica propia en la versión base. No interviene en merchandising ni en derechos digitales. |
| ingresos_base_temporada | entero (cent) nulo | ≥ 0 | Referencia para calibración. Opcional; el motor no lo usa [D] (v0.8). |
| precio_taquilla_cent | entero (cent) | [0,5 × p_ref, 2,0 × p_ref] | Precio medio de taquilla del club: es `precio_medio_taquilla` (6.2.1) y `p` de `f_precio` (8.2). Inicial = `p_ref` de la división (4.500 cent en Primera; 2.200 en Segunda). Lo fija el jugador dentro del rango, con efecto desde el siguiente partido de local; en Manager y en los clubes no controlados queda fijo en `p_ref` [D] (v0.9, B-5). Al cambiar de división se acota al rango de la nueva `p_ref` en la semana 1. |
| plan_entrenamiento | enumeración | `suave`, `normal`, `intenso` | Plan vigente (9.12.3). Inicial `normal` [D] (v0.8). |
| plan_entrenamiento_siguiente | enumeración | `suave`, `normal`, `intenso` | Plan elegido por el jugador; pasa a `plan_entrenamiento` en el paso 1 del tick siguiente (9.12.3, retardo de una semana) [D] (v0.8). |
| victorias_consecutivas | entero | ≥ 0 | Contador de liga. Se pone a 0 con empate o derrota [D] (v0.8). |
| derrotas_consecutivas | entero | ≥ 0 | Contador de liga. Se pone a 0 con empate o victoria [D] (v0.8). |
| racha | entero | {−1, 0, +1} | Derivado: +1 si `victorias_consecutivas ≥ 5`; −1 si `derrotas_consecutivas ≥ 5`; 0 en otro caso (5.5.4) [D] (v0.8). |
| despidos_temporada | entero | [0, 1] | Despidos de entrenador en la temporada en curso (9.7, 12.10). Se pone a 0 en la semana 1 [D] (v0.8). |
| bases_negativas | JSON | Lista de (anio_inicio de la temporada, importe_cent ≥ 0) | Pérdidas fiscales pendientes de compensar (6.8). Se eliminan las de más de 5 ejercicios [D] (v0.8). |
| recaudacion_historica_cent | lista de 5 enteros (cent) | ≥ 0 | Recaudación de taquilla y abonos de las 5 últimas temporadas, para `T_i` (6.9.2). La carga la rellena (15.2); al cierre de cada temporada se desplaza y entra la de la temporada [D] (v0.9; antes `taquilla_historica_cent`, solo taquilla). |
| historial_posiciones | lista de 5 pares (division, posicion) | | Posición final de liga de las 5 últimas temporadas (la más reciente primero), para el tramo de resultados de 6.9.2 y 6.9.3. La carga la rellena (15.2); se desplaza en la semana 52 [D] (v0.9). |
| aforo_medio_anterior | entero | ≥ 0 | Media de `asistencia_partido` de local de la temporada anterior (6.9.2, 9.6). En la carga, la asistencia de 8.2 con factores neutros [D] (v0.8). |
| (sin campo propio) | | | El saldo actual se guarda solo en `Caja.saldo_cent` (4.13). Se elimina `caja_saldo` para evitar duplicidad. |
| descubierto_limite | entero (cent) | ≥ 0 | Límite de descubierto permitido. [D] Primera: 20 M€. Segunda: 5 M€. Se actualiza en la semana 1 si el club cambia de división [D] (v0.8). |
| aforo_total | derivado | | Copia de `Estadio.aforo_total` (4.5). No se almacena en Club. |
| secretaria_honorarios_anual | entero (cent) | | Gasto fijo anual de secretaría técnica y administrativa. [D] |
| personal_costes_anual | entero (cent) | | Salarios de personal no futbolístico. [D] |
| modo_juego | enumeración | `coach`, `manager`, `president`, `total`, `promanager` | Ver 9.1. |
| promanager_desbloqueado | booleano | | Solo en modo Promanager. Ver 9.1. |
| gestor_caja | enumeración | `jugador`, `directiva` | Quién lleva la caja. `jugador` en modo Coach, `directiva` en Manager, `jugador` en President, Total y Promanager (9.1). [D] |
| aficion_moral | entero | [0, 100] | Moral de la afición. Inicial 60. Afecta a la demanda (8.2) y se actualiza según resultados (5.5.4). [D] |
| confianza_directiva | entero | [0, 100] | Confianza de la directiva. Inicial 60. Se guarda aquí; la ficha del entrenador (4.11) solo la lee. Ver 9.7. [D] |
| turismo_alto | booleano | | Ficha de club. Si es verdadero, `f_turismo` = 1,2 en el museo (8.4). [D] |
| ciudad_grande | booleano | | Club de ciudad grande: `factor_partido` = 1,2 en el reparto audiovisual (6.9.2). Lo asigna la carga (15.2) a los 4 clubes de Primera con mayor `aforo_total`. [D] Sin datos de población, que el juego no modela. |
| renovacion_automatica | booleano | | Opción de configuración de la partida. Por defecto, falso. Activa la renovación automática del entrenador (9.9). [D] |

### 4.5 Entidad `Estadio`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | Referencia a `Club` | |
| nombre | texto | | Nombre del estadio. |
| naming_contrato_id | UUID nulo | Referencia a `Patrocinio` (zona `naming`, 4.15) | Naming rights vigentes. |
| aforo_total | entero | [5.000, 120.000] | Suma de aforos de secciones. |
| aforo_disponible_hoy | entero | Derivado | Aforo menos bloqueos de obra y de evento (7.4). |
| cesped_estado | entero | [0, 100] | Estado del césped. Ver 7.6. |
| insonorizacion_nivel | entero | [0, 3] | 0 = sin insonorizar; 3 = máximo. Habilita eventos. Ver 8.6. |
| cubierta | booleano | | Cubierta de gradas; afecta a la cancelación de eventos (8.6.2). Sin efecto en la demanda de 8.2 en la versión base [D] (v0.8). |
| pantalla_led | booleano | | Obra `pantalla_led` terminada. Requisito de la zona `estadio_led` (8.3) [D] (v0.8). |
| cesped_calefactado | booleano | | Obra `cesped_calefactado` terminada. Modifica 7.6 [D] (v0.8). |
| antiguedad_anios | entero | [0, 120] | Afecta a mantenimiento (7.7). Suma 1 en la semana 52 [D] (v0.8). |
| cafeterias_max | entero | 20 | Máximo de cafeterías construibles (8.5). [D] |
| cafeterias_numero | entero | [1, cafeterias_max] | Cafeterías en funcionamiento. Inicial: 1 (8.5). [D] |
| obras_activas_max | entero | [1, 3] | Máximo de obras simultáneas. [D] |

### 4.6 Entidad `SeccionEstadio`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| estadio_id | UUID | | |
| tipo | enumeración | `grada_general`, `grada_preferente`, `grada_fondo`, `palcos`, `hospitality`, `zona_vip`, `museo`, `tienda_fisica`, `restauracion`, `zona_eventos`, `aparcamiento` | Tipo de sección. |
| plazas | entero | [0, 60.000] | Número de localidades o unidades de espacio. |
| precio_base_partido | entero (cent) nulo | ≥ 0 | Reservado. La versión base no fija precio por sección: la taquilla usa `Club.precio_taquilla_cent` (4.4) [D] (v0.8). |
| ocupacion_maxima | decimal | [0, 1] | Techo de ocupación por tipo, usado en 8.2. Solo tipos que cuentan como localidades (7.1). Valores [D]: grada_general 0,95; grada_preferente 0,80; grada_fondo 0,90; palcos 0,95; zona_vip 0,95. Preferente 0,80 y VIP 0,95 son decisión de producto. |
| estado_fisico | entero | [0, 100] | Reservado. Ninguna fórmula lo usa en la versión base; valor fijo 100 [D] (v0.8). |
| activa | booleano | | |

### 4.7 Entidad `Obra`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| estadio_id | UUID | | |
| tipo | enumeración | Ver tabla de obras en 7.2 | Tipo de obra. |
| coste_total | entero (cent) | | Coste total. Se paga en cuotas (ver 7.3). |
| semanas_duracion | entero | [1, 260] | Duración. |
| temporada_inicio_id | UUID | Referencia a `Temporada` | Temporada en que empieza. Las obras pueden cruzar temporadas [D] (v0.8). |
| semana_inicio | entero | [1, 52] | Semana de la temporada en que empieza. |
| unidades | entero | ≥ 1 | Plazas nuevas (ampliaciones), palcos nuevos (`construir_palcos`, máximo 30 por obra [D], v0.9) o zonas (`construir_hospitality`); 1 en el resto. `coste_total` = coste base de 7.2 × unidades [D] (v0.8). |
| semanas_pagadas | entero | [0, semanas_duracion] | Cuotas pagadas [D] (v0.8). |
| progreso | decimal | [0, 1] | Avance = `semanas_pagadas / semanas_duracion` [D] (v0.8). Las semanas suspendidas (7.3) no avanzan. |
| aforo_delta | entero | Puede ser negativo | Cambio de aforo al terminar. |
| bloqueo_aforo | entero | ≥ 0 | Localidades bloqueadas durante la obra. Ampliaciones: `round(0,10 × plazas` de la sección al empezar`)`; reforma general: `round(0,25 × aforo_total)`; resto: 0 (7.3) [D] (v0.9, B-6). |
| estado | enumeración | `planificada`, `en_curso`, `finalizada`, `cancelada` | |
| efectos | JSON | Ver 7.2 | Efectos en ingresos y en mantenimiento. |

### 4.8 Entidad `Jugador`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| codigo | texto | Único en la partida | `codigo_jugador_interno` de la carga (15.2). Desempate estable [D] (v0.8). |
| nombre_ficticio | texto | | Nombre ficticio. Ver 18.1. |
| posicion | enumeración | `portero`, `defensa`, `centrocampista`, `delantero` | Posición genérica. |
| nacionalidad_codigo | texto | ISO 3166-1 alfa-2 | Usado para extranjeros comunitarios. |
| es_comunitario | booleano | | Derivado de `nacionalidad_codigo` y de la lista de 12.2. |
| edad | entero | [15, 45] | |
| valor_mercado | entero (cent) | ≥ 0 | Valor de referencia del mercado. Dato de la carga (15.5); sin dinámica en la versión base [D] (v0.8). |
| condicion_fisica | entero | [0, 100] | Ver 9.12. |
| moral | entero | [0, 100] | Ver 9.12. |
| lesion_dias_restantes | entero | ≥ 0 | 0 si no está lesionado. |
| minutos_temporada | entero | ≥ 0 | Minutos de liga de la temporada, generados por la simulación (5.5.2). Inicial 0; se pone a 0 en la semana 1 [D] (v0.8). |
| minutos_semana | entero | [0, 90] | Minutos de la semana en curso (5.5.2), para 9.12.1 [D] (v0.8). |
| semanas_moral_baja | entero | ≥ 0 | Semanas seguidas con `moral < 35` (9.11) [D] (v0.8). |
| solicitud_traspaso_ventanas | entero nulo | [0, 2] | Nulo sin solicitud; 2 al crearla; resta 1 al cerrar cada ventana (9.11) [D] (v0.8). |
| inscrito | booleano | | Si figura en la plantilla de competición. |
| club_id | UUID nulo | | Club actual. Nulo si es libre. |
| contrato_id | UUID nulo | | Contrato vigente. |
| cesion_id | UUID nulo | | Si está cedido. |
| calidad | entero | [1, 100] | Calidad técnica base. Ver 5.5.2. [D] |
| velocidad | entero | [1, 100] | Velocidad y resistencia física base. Ver 5.5.2. [D] |
| puntos_entrenamiento | entero | [0, 100] | Puntos acumulados por entrenamiento. Mejoran calidad y velocidad efectivas (5.5.2). [D] |

### 4.9 Entidad `Contrato`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| jugador_id | UUID | | |
| club_id | UUID | | |
| salario_anual_bruto | entero (cent) | [0, 2.000.000.000 cent] | Salario bruto anual. [D] Topes de referencia en 14.2. |
| fecha_inicio | fecha | | |
| anios_duracion | entero | [1, 6] | Duración en años. |
| anios_restantes | entero | [0, 6] | Años pendientes de contrato. Derivado: año de `fecha_fin` − `Temporada.anio_inicio` de la temporada en curso (un contrato que termina el 30/06/2027 tiene 1 en 2026/27). Todo contrato termina en la semana 52 de su última temporada [D] (v0.8). Usado en 6.6.2. |
| fecha_fin | fecha | Derivado | |
| forma_pago | enumeración | `doce_mensualidades`, `diez_mensualidades`, `aplazado` | Ver 6.3.1. |
| plazos_aplazado | JSON | Lista de (semana, porcentaje) que suman 1 | Solo si `forma_pago = aplazado`. Por defecto, 50 % en la semana 26 y 50 % en la semana 48 [D]. |
| coste_fichaje_cent | entero (cent) | ≥ 0 | Coste de traspaso asociado. Se amortiza (6.4). |
| amortizacion_restante_cent | entero (cent) | ≥ 0 | Valor contable pendiente. |
| clausulas_ids | lista de UUID | Referencias a `Clausula` (4.10) | Cláusulas económicas del contrato. La fuente de verdad es `Clausula`; este campo solo referencia por id. Las cláusulas de casa y coche, rescisión y prima de gol no se duplican aquí. [D] |
| estado | enumeración | `vigente`, `rescindido`, `finalizado`, `cedido` | |

### 4.10 Entidad `Clausula`

Las cláusulas económicas de contrato se modelan como filas independientes para poder auditarlas. Es la **fuente de verdad** de estas cláusulas (decisión de producto 17). La prima de permanencia no es una cláusula de contrato: es un gasto del club (6.6.3).

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| contrato_id | UUID | | |
| tipo | enumeración | `casa_coche`, `rescision`, `prima_gol` | Tipo de cláusula. |
| activa | booleano | | Falso si la cláusula ya no aplica (por ejemplo, tras la venta del jugador). [D] |
| importe_cent | entero | ≥ 0 | Importe fijo, o base de cálculo si es variable. |
| formula | enumeración | `fija`, `por_anios_restantes`, `por_numero_casa_coche` | Ver 6.6. |
| pagado | booleano | | Si ya se ha pagado (casa y coche, firma). |

### 4.11 Entidad `Entrenador`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| nombre_ficticio | texto | | |
| club_id | UUID nulo | | Nulo si `estado` es `en_paro` [D] (v0.8). |
| reputacion | entero | [0, 100] | Ver 9.4. Inicial según división. |
| penalizacion_honorarios_temporadas | entero | [0, 2] | Temporadas restantes con honorarios de oferta × 0,85 tras un despido (9.5). Resta 1 en cada semana 52 [D] (v0.8). |
| honorarios_anual | entero (cent) | ≥ 0 | Ver 9.5. |
| contrato_fecha_fin | fecha | | |
| contrato_anios_restantes | entero | [0, 4] | |
| confianza_directiva | entero | [0, 100] | Ver 9.7. Se guarda en la ficha del club (4.4). Aquí solo se lee. |
| moral_plantilla | entero | [0, 100] | Media de moral de la plantilla. Derivado (9.10). |
| estado | enumeración | `activo`, `despedido`, `dimitido`, `en_paro` | |
| historial_despidos | entero | ≥ 0 | Contador. |

### 4.12 Entidad `Objetivo`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| club_id | UUID | | |
| tipo | enumeración | `posicion_final`, `puntos_minimos`, `copa`, `presupuesto_no_superar`, `saldo_minimo`, `aforo_medio_minimo`, `fichajes_maximos`, `permanencia` | Ver 9.3. `presupuesto_no_superar` solo existe en modo Manager (decisión 1, fila 1 de 0.3). |
| valor_objetivo | decimal | Depende del tipo | Por ejemplo, posición 10. |
| peso | decimal | (0, 1] | Peso del objetivo en la evaluación. |
| cumplido | booleano nulo | | Nulo hasta evaluación. |
| evaluado_en | fecha | | Fecha de evaluación. |
| origen | enumeración | `directiva`, `automatico`, `promanager` | |

### 4.13 Entidad `Caja` y `Movimiento`

`Caja` representa el saldo del club en cada momento. Cada cambio de saldo se registra como `Movimiento`.

**Caja**

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| club_id | UUID | | |
| saldo_cent | entero | Puede ser negativo dentro del descubierto | Saldo actual. |
| saldo_minimo_semana | entero | | Mínimo semanal, para estadísticas. |
| saldo_cierre_temporada | entero | | Saldo al cierre. |

**Movimiento**

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| temporada_id | UUID | | |
| semana | entero | [1, 52] | Semana de la temporada (la semana 53 no se usa, 5.1.1). |
| fecha_efectiva | fecha | | Fecha en la que se hace efectivo el cobro o pago. |
| categoria | enumeración | Ver 6.2 y 6.3 | Categoría contable. |
| subcategoria | texto | | Detalle. |
| importe_cent | entero | Positivo: ingreso; negativo: gasto | |
| origen_id | UUID nulo | | Referencia a la entidad que lo genera. |
| estado | enumeración | `previsto`, `efectivo`, `anulado` | |
| causa | texto | | Descripción legible para el desglose en pantalla (ver principio 7). |
| secuencia_creacion | entero | ≥ 1 | Orden de creación dentro del club. Es el desempate de la liquidación del tick (6.5). Sustituye al id como criterio de orden. [D] |
| afecta_caja | booleano | | Verdadero por defecto. Falso en `amortizacion` y en el apunte de beneficio o pérdida contable de traspasos (6.2.14, 6.3.3): cuentan en resultados, no en el saldo [D] (v0.8). |

### 4.14 Entidad `ContratoDerechos` (derechos audiovisuales)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| division | enumeración | `primera`, `segunda` | |
| tipo | enumeración | `nacional`, `internacional`, `digital`, `comercializacion` | `comercializacion` (6.2.6) usa la misma estructura aunque no es audiovisual [D] (v0.8). |
| importe_total_temporada_cent | entero | ≥ 0 | Importe repartible de la temporada en la división del registro, ya aplicado el 90/10 de 6.9.1 a los importes de liga (`nacional`, `internacional`, `comercializacion`); `digital` es pool propio por división [D] (v0.9). |
| tramos_cobro | JSON | Lista de (semana, porcentaje) | Ver 6.2.4 y 6.5. |
| operador | texto | Nombre ficticio en versión base | Operador de emisión. [D] |

### 4.15 Entidad `Patrocinio`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| zona | enumeración | `camiseta_pecho`, `camiseta_manga`, `camiseta_espalda`, `estadio_fondo`, `estadio_led`, `entrenamiento`, `digital`, `naming` | Ver 8.3. |
| importe_fijo_anual_cent | entero | ≥ 0 | Parte fija anual. |
| importe_variable_max_cent | entero | ≥ 0 | Parte variable máxima por objetivos. |
| objetivo_variable_id | UUID nulo | Referencia a `Objetivo` | Objetivo que activa la parte variable. |
| anios | entero | [1, 10] | Duración. |
| fecha_inicio | fecha | | |
| fecha_fin | fecha | | |
| forma_cobro | enumeración | `mensual`, `trimestral`, `anual_inicio` | |

### 4.16 Entidad `Prestamo`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| principal_cent | entero | [0, límite_division] | Importe dispuesto. |
| tipo_interes_anual | decimal | [0, 0,15] | [D] Tipo fijo. |
| anios | entero | [1, 10] | Plazo. |
| amortizacion | enumeración | `lineal`, `francesa` | Ver 6.7. |
| saldo_pendiente_cent | entero | ≥ 0 | |
| activo | booleano | | |
| semana_disposicion | entero | [1, 52] | Semana en que se cobra el principal. La primera cuota se paga en el primer tick del mes siguiente [D] (v0.8). |
| (constante) | | 4 | Máximo de préstamos activos por club (6.7). Es una constante del sistema, no un campo por préstamo [D] (v0.8; antes `limite_activo_max`). |

### 4.17 Entidad `Concierto` / `Evento`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| estadio_id | UUID | | |
| tipo | enumeración | `concierto`, `evento_corporativo`, `competicion_no_futbol`, `otro` | Los tipos `concierto_nivel_1` a `concierto_nivel_3` de 8.6.1 se guardan como `tipo = concierto` con `nivel` 1 a 3 [D] (v0.8). |
| nivel | entero | [0, 3] | Nivel de insonorización requerido (8.6.1). Solo conciertos (nivel 1 a 3). [D] |
| semana | entero | | Semana de la temporada. |
| dias_preparacion | entero | [1, 14] | Días de montaje (bloquea el estadio). |
| dias_desmontaje | entero | [1, 7] | |
| aforo_evento | entero | [1.000, 120.000] | Aforo propio del evento: localidades ofertadas. No está limitado por el aforo del estadio (decisión de producto 15). El ingreso se ajusta a este aforo (8.6.3). [D] |
| precio_medio_cent | entero | ≥ 0 | Precio medio. |
| canon_fijo_cent | entero | ≥ 0 | Pago fijo del promotor. |
| porcentaje_club | decimal | [0, 1] | Parte variable para el club. |
| coste_cesped_cent | entero | ≥ 0 | Informativo. En la versión base vale 0: el coste del evento sobre el césped es el desgaste de 7.6, que puede activar la reposición de 200.000 € [D] (v0.8). |
| estado | enumeración | `propuesto`, `confirmado`, `celebrado`, `cancelado`, `vetado` | |

### 4.18 Entidad `Oferta` (ofertas de entrenador)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| entrenador_id | UUID | | |
| club_origen_id | UUID | | |
| club_destino_id | UUID | Club del pool ficticio (15.5 y 15.6) | Club destino de la oferta. Debe existir en el pool de clubes de la partida (Primera, Segunda o reserva T01 a T03). [D] |
| division_destino | enumeración | `primera`, `segunda` | |
| honorarios_anual_cent | entero | ≥ 0 | |
| anios | entero | [1, 4] | |
| semana | entero | | Semana de la oferta. |
| caduca_semana | entero | | |
| estado | enumeración | `pendiente`, `aceptada`, `rechazada`, `caducada` | |

### 4.19 Entidad `PersonalTecnico`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| rol | enumeración | `preparador_fisico`, `medico`, `fisioterapeuta`, `ojeador`, `analista`, `ayudante` | |
| salario_anual_cent | entero | ≥ 0 | |
| calidad | entero | [1, 5] | Afecta a lesiones y a moral. |

### 4.20 Entidad `Seguro`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| jugador_id | UUID | | |
| tasa_prima | decimal | [0, 0,2] | Prima como porcentaje del salario. |
| cobertura_lesion | decimal | [0, 1] | Porcentaje de gasto médico cubierto. |
| cobertura_salario_baja | decimal | [0, 1] | Porcentaje de salario cubierto en baja larga. |
| activo | booleano | | |

### 4.21 Entidad `VentanaMercado`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| tipo | enumeración | `verano`, `invierno` | |
| semana_inicio | entero | | |
| semana_fin | entero | | |
| abierta | booleano | | |

### 4.22 Relaciones principales

| Relación | Cardinalidad | Notas |
|---|---|---|
| Club – Estadio | 1 a 1 | Un club tiene un estadio. |
| Estadio – SeccionEstadio | 1 a N | |
| Estadio – Obra | 1 a N | Como máximo `obras_activas_max` en curso. |
| Estadio – Concierto/Evento | 1 a N | |
| Club – Jugador | 1 a N | Jugador vigente en un club a la vez. |
| Jugador – Contrato | 1 a N histórico; 1 vigente | |
| Contrato – Clausula | 1 a N | |
| Club – Entrenador | 1 a N histórico; 1 activo | |
| Club – Patrocinio | 1 a N | |
| Club – Prestamo | 1 a N; como máximo 4 activos | |
| Club – Objetivo | 1 a N por temporada | |
| Club – Movimiento | 1 a N | Libro de movimientos. |
| Temporada – ContratoDerechos | 1 a N | Por división: un nacional, uno internacional, uno digital y uno de comercialización (v0.9). |
| Club – Abonado | 1 a N | Abonos vigentes y su antigüedad (4.23). |
| Temporada – Partido | 1 a N | Calendario de 5.4 (4.25). [D] (v0.8) |
| Temporada – Clasificacion | 1 a N | Una fila por club y temporada (4.26). [D] (v0.8) |
| Jugador – Cesion | 1 a N histórico; como máximo 1 vigente | 4.27. [D] (v0.8) |

### 4.23 Entidad `Abonado`

Abono con antigüedad. Determina `abonos_vendidos` (6.2.2), cuya recaudación entra en `T_i` (6.9.2). Desde v0.9 el número de abonos de cinco años no interviene en el reparto (F-2); la antigüedad se conserva para la renovación y como dato informativo. Puede almacenarse como contadores por antigüedad en lugar de una fila por abonado; el resultado es el mismo. [D]

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| antiguedad_abono_anios | entero | [1, 120] | Temporadas consecutivas con abono. Alta: 1. Se incrementa al renovar. [D] |
| activo | booleano | | Falso si el abono no se renovó. |

Reglas [D]:

- Al cierre de temporada (semana 52), cada abono se renueva con probabilidad 0,90. Si se renueva, `antiguedad_abono_anios` aumenta en 1; si no, `activo = false`.
- Las altas nuevas son `max(0, abonos_objetivo − abonos_renovados)` (6.2.2), y entran con `antiguedad_abono_anios = 1`.
- Abono de cinco años: abono `activo` con `antiguedad_abono_anios ≥ 5`. Informativo desde v0.9 (antes era `A_i` de 6.9.2).
- La distribución de antigüedad inicial de la carga se genera con el pool ficticio (15.5). [D] (v0.8): cada abono de la carga recibe `antiguedad_abono_anios = k` con probabilidad proporcional a 0,9^(k−1), k = 1 a 30 (distribución estacionaria de la renovación de 0,90). Con ella, el 64,1 % de los abonos de la carga son de cinco años o más.
- Orden [D] (v0.8): la renovación se sortea en la semana 52 (flujo 4 de 4.1) antes de calcular el reparto de la temporada siguiente (11.4, paso 4). Las altas se crean en la semana 1, con el `abonos_objetivo` de la nueva temporada.

### 4.24 Entidad `Partida` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| semilla | entero | [0, 2^63 − 1] | Semilla de la partida (4.1, principio 6). |
| club_jugador_id | UUID | Referencia a `Club` | Club que controla el jugador. Cambia si el entrenador acepta una oferta (13.7). |
| entrenador_jugador_id | UUID | Referencia a `Entrenador` | Entrenador que encarna el jugador. |
| temporada_actual_id | UUID | Referencia a `Temporada` | |
| semana_actual | entero | [1, 52] | Tick en curso. |
| impuesto_tesoreria_activo | booleano | Falso en la versión base | A-10 (cerrada en v1.0: desactivado). |
| prima_gol_activa | booleano | Falso en la versión base | A-07 (cerrada en v1.0: fuera). |
| derechos_imagen_activos | booleano | Falso en la versión base | A-13 (cerrada en v1.0: fuera). |

### 4.25 Entidad `Partido` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| competicion_id | UUID | | |
| jornada | entero | [1, 42]; 43 a 45 para la promoción de Segunda (15.6) | |
| indice | entero | ≥ 1 | Orden del partido dentro de la jornada (orden de sorteo, 4.1). |
| semana | entero | [1, 52] | Ver 5.4. |
| local_id | UUID | | |
| visitante_id | UUID | | |
| goles_local | entero nulo | ≥ 0 | Nulo hasta jugarse. |
| goles_visitante | entero nulo | ≥ 0 | |
| asistencia | entero nulo | ≥ 0 | `asistencia_partido` de 8.2. |
| demanda | decimal nulo | ≥ 0 | Para el desglose (principio 7). |

### 4.26 Entidad `Clasificacion` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| temporada_id | UUID | | Clave compuesta con `club_id`. |
| club_id | UUID | | |
| competicion_id | UUID | | |
| jugados, ganados, empatados, perdidos | entero | ≥ 0 | |
| goles_favor, goles_contra | entero | ≥ 0 | |
| puntos | entero | ≥ 0 | 5.5.4. |
| posicion | entero | [1, num_equipos] | Recalculada tras cada jornada con el desempate de 5.5.4. Antes de la jornada 1, orden por `reputacion` descendente y `codigo` ascendente. |

### 4.27 Entidad `Cesion` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | Es el `Jugador.cesion_id`. |
| jugador_id | UUID | | |
| club_origen_id | UUID | | Club que cede (cobra, 6.2.14). |
| club_destino_id | UUID | | |
| temporada_id | UUID | | Cesiones de una temporada; terminan en la semana 52. |
| cuota_cesion_cent | entero | ≥ 0 | 10 % de `valor_mercado` (6.2.14). |
| porcentaje_salario_tercero | decimal | [0, 1] | 0,50 por defecto (6.2.14). |
| semana_inicio | entero | [1, 52] | |

---

## 5. Tiempo y calendario

### 5.1 Unidades de tiempo

- **Semana de temporada (`semana`)**: índice de 1 a 52 desde la primera semana de julio (la 53 no se usa). [D] Se usa como unidad de resolución económica.
- **Tick**: una semana de juego. Cada tick ejecuta, en orden: calendario, cobros y pagos previstos, desgaste y lesiones, obras, eventos, evaluaciones y comprobaciones de control económico.
- **Mes de liquidación** [D]: la temporada tiene 12 meses de 4 o 5 semanas (tabla 5.1.1). Cada mes tiene un primer tick y un último tick. Todos los movimientos mensuales (cobros y pagos) se ejecutan en el primer tick del mes, según la tabla 6.5 (decisión de producto 12). El último tick de cada mes se usa para la comprobación de descubierto (10.3).

#### 5.1.1 Tabla de meses

| Mes | Semanas | Primer tick | Último tick |
|---|---|---|---|
| Julio | 1 a 4 | 1 | 4 |
| Agosto | 5 a 8 | 5 | 8 |
| Septiembre | 9 a 13 | 9 | 13 |
| Octubre | 14 a 17 | 14 | 17 |
| Noviembre | 18 a 21 | 18 | 21 |
| Diciembre | 22 a 26 | 22 | 26 |
| Enero | 27 a 30 | 27 | 30 |
| Febrero | 31 a 34 | 31 | 34 |
| Marzo | 35 a 39 | 35 | 39 |
| Abril | 40 a 43 | 40 | 43 |
| Mayo | 44 a 47 | 44 | 47 |
| Junio | 48 a 52 | 48 | 52 |

La semana 53 no se usa. El último tick de la temporada es la semana 52 [D].

### 5.2 Orden de ejecución por tick

1. Actualizar calendario: jornada, pretemporada o parada.
2. Si hay jornada, ejecutar la simulación de resultados, clasificación, lesiones y asistencia (5.5).
3. Calcular ingresos de día de partido (taquilla, palcos, hospitality, restauración, tienda de día).
4. Ejecutar eventos programados (conciertos, eventos).
5. Ejecutar los cobros previstos del tick (6.5). Los cobros de un tick se aplican antes que los pagos del mismo tick.
6. Ejecutar los pagos del tick en el orden de 6.5 (préstamos e impuestos, seguros, salarios, personal, honorarios, obras, primas, resto).
7. Aplicar desgaste de jugadores, lesiones y recuperaciones.
8. Avanzar obras y mantenimiento de estadio.
9. Actualizar caja y registrar movimientos.
10. Si es último tick de mes (5.1.1), comprobar descubierto y aplicar sanciones (10.2). Los intereses de descubierto del mes anterior se liquidan en el paso 6 del primer tick del mes, como fila "Resto" de 6.5, sobre el saldo guardado en este paso [D] (v0.8; antes se citaban en los dos pasos).
11. Si es fin de temporada, evaluar objetivos, reputación, cierre de cuentas y control económico.

### 5.3 Calendario de temporada (plantilla por defecto)

| Periodo aproximado | Contenido | Notas |
|---|---|---|
| Julio (semanas 1-4) | Pretemporada. Venta de vallas. Cobro de abonos (primer plazo). Ventana de mercado de verano. | [D] Mercado de verano abierto en las semanas 1 a 6 (11.3), es decir, hasta la segunda semana de agosto. |
| Agosto (semanas 5-8) | Inicio de liga. Primeras jornadas. Derechos: primer tramo en el primer tick de agosto (semana 5). | [D] |
| Septiembre a diciembre | Competición. Partidos locales y visitantes. | |
| Enero (semanas 27 a 30) | Ventana de mercado de invierno (semanas 27 a 29). Cobro de abonos (segundo plazo) en la semana 27. Control económico intermedio al cierre de diciembre (semana 26). | [D] |
| Febrero a mayo | Competición. | |
| Junio | Final de temporada. Evaluación de objetivos. Sin tramo de derechos (ver 6.2.4). | |
| Fin de junio (semana 52) | Cierre de ejercicio económico. Cálculo de impuestos y de control económico. | [D] |

La numeración y fechas se parametrizan por temporada. La secuencia es fija; las fechas no.

### 5.4 Calendario de partidos

- Liga: 38 jornadas en Primera y 42 en Segunda [D] (ver 4.2). Cada equipo juega como local la mitad de sus partidos (19 en Primera y 21 en Segunda).
- En cada jornada, un equipo es local o visitante. Los partidos como visitante generan ingresos de derechos y de comercialización, pero no de taquilla propia.
- Un partido de local genera el paquete de ingresos de día de partido (sección 7 y 8).

**Semanas con jornada** [D] (v0.8):

- Primera (38 jornadas): semanas 5 a 47, salvo las semanas 10, 15, 25, 26 y 37 (43 − 5 = 38).
- Segunda (42 jornadas): semanas 5 a 47, salvo la semana 25 (43 − 1 = 42).
- Promoción de ascenso de Segunda (15.6): semifinales en la semana 48 (jornada 43 y 44) y final en la semana 49 (jornada 45).

**Generación del calendario** [D] (v0.8): liga a doble vuelta con el método del círculo. El orden inicial de clubes se baraja con el flujo 1 (4.1). La segunda vuelta repite la primera con local y visitante invertidos. En la primera vuelta, un club alterna local y visitante en lo posible (método del círculo con alternancia del club fijo). Resultado verificable: 19 partidos de local en Primera y 21 en Segunda por club.

---

### 5.5 Simulación de resultados, clasificación y lesiones [D]

Sustituye al motor de partidos y a cualquier módulo externo de competición (1.3). Es una simulación de tipo juego de rol: cada jornada se resuelve con los atributos de los jugadores, un componente aleatorio y la asistencia de la afición. Todos los valores de esta sección son propuestas de diseño [D] para calibrar en pruebas.

#### 5.5.1 Entradas

- Plantilla inscrita del club (hasta 25) con los atributos de cada jugador: `calidad`, `velocidad`, `puntos_entrenamiento`, `condicion_fisica` y `lesion_dias_restantes`.
- Reputación del club `R` ∈ [0, 100] y `aficion_moral` ∈ [0, 100].
- Semilla de la temporada (principio 6 de la sección 3). Con la misma semilla y las mismas decisiones, la simulación es idéntica.

#### 5.5.2 Atributos efectivos

- Calidad efectiva: `calidad_ef = clamp(calidad + 0,1 × puntos_entrenamiento, 1, 100)`.
- Velocidad efectiva: `velocidad_ef = velocidad × condicion_fisica / 100`.
- Un jugador con `lesion_dias_restantes > 0` no juega.
- Los puntos de entrenamiento suben 1 punto por semana con plan `normal` y 2 con plan `intenso`; con plan `suave` no suben. Tope 100 (9.12.3).
- Disponible: jugador inscrito, con contrato vigente, sin cesión vigente y con `lesion_dias_restantes = 0` [D] (v0.8).
- Los 11 titulares son el portero disponible de mayor `calidad_ef` y los 10 jugadores de campo disponibles con mayor `calidad_ef` (exactamente un portero [D], v0.8; antes "al menos un portero"). Desempate: mayor `velocidad_ef` y después `codigo` ascendente. Minutos [D] (v0.8): cada titular juega 90 minutos y el resto 0; no hay cambios. Si hay menos de 11 disponibles, juegan los que haya y los huecos cuentan con `calidad_ef` y `velocidad_ef` 0 en las medias. Si no hay ningún portero disponible, el puesto lo ocupa el jugador disponible de mayor `calidad_ef`, con esa `calidad_ef` reducida a la mitad [D]. Peso por posición: portero 1,0; defensa 1,0; centrocampista 1,1; delantero 1,2.
- `Q_club` = media ponderada de `calidad_ef` de los titulares. `V_club` = media ponderada de `velocidad_ef` de los titulares, con los mismos pesos.
- Moral media de la plantilla `moral_plantilla` (4.11 y 9.10).
- Fuerza del equipo:

```
S_club = 0,75 × Q_club + 0,25 × V_club + 0,05 × moral_plantilla
```

Rango teórico de `S_club`: [0, 105] (cota con Q, V y moral en sus límites de 0 a 100; el 110 de la versión anterior no es alcanzable).

#### 5.5.3 Resultado de cada partido

- Diferencia de fuerza para un partido local: `d = S_local − S_visitante + 5` (ventaja de campo [D] = 5).
- Probabilidades de resultado:

```
p_empate   = 0,26
p_local    = (1 − p_empate) × 1 / (1 + 10^(−d/25))
p_visitante = 1 − p_local − p_empate
```

- Se sortea un número uniforme `u` ∈ [0, 1) con la semilla. Si `u < p_local` gana el local; si `u < p_local + p_empate` empate; si no, gana el visitante.
- Goles: se sortea el número de goles de cada equipo con una distribución de Poisson de media `λ_local = 1,35 × (S_local / S_visitante)^0,5` y `λ_visitante = 1,35 × (S_visitante / S_local)^0,5`. En estas medias, `S` se acota a un mínimo de 1 para evitar la división por cero [D] (v0.8). Orden de sorteo por partido: `u` del resultado, goles del local y goles del visitante (flujo 2 de 4.1). Si el signo del marcador no coincide con el resultado sorteado, se ajusta [D] (v0.8): si gana el local y `goles_local ≤ goles_visitante`, `goles_local = goles_visitante + 1`; si gana el visitante, simétrico; si es empate, el equipo con menos goles sube hasta igualar al otro.
- Los goles y el resultado se guardan por jornada para el desglose en pantalla (principio 7).

#### 5.5.4 Clasificación, rachas y afición

- Puntos: 3 por victoria, 1 por empate, 0 por derrota.
- Desempate: puntos, diferencia de goles, goles a favor y sorteo con la semilla.
- Racha: 5 victorias consecutivas (`racha = +1`) o 5 derrotas consecutivas (`racha = −1`), con los contadores de 4.4. La racha se mantiene mientras siga la serie y vuelve a 0 con el primer resultado que la corta [D] (v0.8). La racha que se aplica a un partido es la previa al partido. Los contadores no se reinician entre temporadas. Se usa en `f_racha` (8.2), que forma parte de `f_resultados` junto con la posición (decisión 9).
- Moral de la afición `aficion_moral`: +2 por victoria, 0 por empate, −2 por derrota; +5 al ascender; −5 al descender; +5 al alcanzar una racha de 5 victorias y −5 al alcanzar una de 5 derrotas, una vez por racha (cuando el contador llega exactamente a 5) [D]; acotada a [0, 100]. Se aplica a todos los clubes, locales y visitantes, tras cada partido de liga y de promoción [D] (v0.8).
- Clasificación externa: no existe. La posición de la simulación es la única posición del juego.

#### 5.5.5 Lesiones

- Las lesiones las genera la simulación cada semana con la probabilidad de 9.12.4. Origen: sistema, no módulo externo.
- Unidad: días. La simulación convierte días en semanas de juego con `semanas = ceil(días / 7)`.
- Umbrales de baja, todos en días [D]:
  - baja corta: hasta 56 días (8 semanas);
  - baja larga: más de 56 días. Activa la cobertura de seguro (6.2.15);
  - baja muy larga: más de 120 días (decisión 13). Permite rescindir fuera de ventana (6.6.2 y 12.4).
- Efecto económico: gasto médico (6.3.7) y, si hay seguro, indemnización (6.2.15).

#### 5.5.6 Asistencia y demanda de aficionados

- La asistencia del partido se calcula con la fórmula única de 8.2.
- La simulación aporta a 8.2 los factores `f_resultados` (posición y racha) y `f_aficion` (moral de la afición).
- La reputación del club y la moral de la afición se actualizan en 9.6 y 5.5.4.

#### 5.5.7 Verificación de la simulación

- Con la misma semilla y las mismas decisiones, dos ejecuciones dan la misma clasificación y los mismos resultados (principio 6 de la sección 3).
- En 90 % de las temporadas simuladas de 38 jornadas, la diferencia de puntos entre el primero y el último de la clasificación debe estar entre 35 y 75 puntos [D].
- Un club con reputación alta debe terminar entre los 8 primeros en más de la mitad de simulaciones [D].

---

## 6. Motor económico

### 6.1 Visión general del flujo de caja

El saldo de caja de un club se calcula como la suma acumulada de todos los movimientos con `estado = efectivo` más el saldo inicial de temporada.

Cada movimiento tiene una `fecha_efectiva` y una `semana`. Los ingresos previstos se muestran en la proyección de caja con su semana de cobro.

Fórmula de saldo:

```
saldo(t) = saldo_inicio_temporada
         + Σ movimientos.importe_cent  para movimientos con semana ≤ t y estado = efectivo
```

`saldo_inicio_temporada` es `Caja.saldo_cierre_temporada` de la temporada anterior o, en la partida 2026/27, `caja_inicial_cent` de la carga (15.2).

Proyección de caja a N semanas: aplicar la misma fórmula incluyendo `estado = previsto` y estimar ocupación y resultados según probabilidades de 8.2. [D] (v0.8): la proyección no sortea. Para cada partido de local futuro usa la demanda de 8.2 con `f_resultados` = 1, la `R` real del rival, el precio vigente y el mes del partido; no proyecta lesiones ni eventos no confirmados.

En la suma del saldo solo entran movimientos con `afecta_caja = true` (4.13) [D] (v0.8).

### 6.2 Fuentes de ingreso

Para cada fuente se indica la fórmula, la periodicidad de cobro y la categoría contable.

#### 6.2.1 Taquilla (`categoria = taquilla`)

**Fórmula**:

```
taquilla_partido = taquilla_vendida × precio_medio_taquilla
taquilla_vendida = max(0, asistencia_partido − abonados_asistentes − plazas_palco_vendidas)
plazas_palco_vendidas = 10 × palcos_vendidos      (6.2.3)
```

`asistencia_partido` se calcula con la fórmula única de ocupación de 8.2. Es la única fórmula de ocupación del documento.

- `abonados_asistentes` son los abonados que acuden al partido. Se restan del aforo para no contar dos veces la asistencia. Cálculo determinista [D] (v0.8): `abonados_asistentes = round(abonos_vendidos × probabilidad_asistencia_abonado)` (6.2.2), sin sorteo. Si supera `asistencia_partido`, la taquilla vendida es 0.
- `plazas_palco_vendidas` [D] (v0.9, B-5): las plazas de los palcos vendidos asisten al partido, pero se cobran solo como palco (6.2.3); se restan para no contarlas también como taquilla. Club de referencia: 95 palcos, 950 plazas; taquilla vendida 37.761 − 21.828 − 950 = 14.983 localidades, 674.235 € por partido (716.985 € en v0.8; 812.250 € menos por temporada).
- `precio_medio_taquilla` [D]: 45 € en Primera y 22 € en Segunda de precio base (`p_ref`). Es `Club.precio_taquilla_cent` (4.4). El jugador lo fija entre el 50 % y el 200 % de `p_ref` (B-5, decisión 35); el precio actúa en la demanda a través de `f_precio` (8.2) y no cambia solo.
- Comprobación de explotación del precio [D] (v0.9), club de referencia con ε = 1,2: 22,50 € → 344.970 €; 40,50 € → 620.946 €; 45 € → 674.235 €; 50 € → 524.900 €; 90 € → 0 € por partido. El máximo está en 44,66 € (684.666 €), donde la demanda toca el tope de 8.2: subir el precio por encima de `p_ref` no da más taquilla.
- Cobro: al celebrarse el partido (semana de la jornada de local).
- Confianza: forma y orden de magnitud [NV] (ver 17.2, asistencia 2025/26). Precio y demanda [D].

**Asistencia de referencia**: 17.535.164 espectadores y 20.776 de media por partido en 2025/26 [NV] (fuente pendiente, ver P-03 en el Anexo). Nota: la cifra de 17.535.164 divididos por 20.776 da unos 844 partidos, cuando la liga tiene 380. La media por partido y la asistencia total son inconsistentes entre sí; ver 17.2. Para el juego se usan solo las ocupaciones medias de 2024/25: 84,5 % en Primera y 68,5 % en Segunda [C, S-05] (el 61,7 % de Segunda es de 2023/24).

#### 6.2.2 Abonos (`categoria = abonos`)

**Fórmula**:

```
ingreso_abonos_temporada = abonos_vendidos × precio_medio_abono
```

- `abonos_vendidos` = número de `Abonado` activos (4.23) al inicio de temporada. El objetivo es `abonos_objetivo` = `round(aforo_total × porcentaje_abonados)`, con `porcentaje_abonados` en [0,4; 0,7] según reputación [D]. Las altas nuevas cubren la diferencia entre el objetivo y los abonos renovados. Fórmula [D] (v0.8): `porcentaje_abonados = clamp(base_div + 0,003 × (R − R_ref_div), 0,40, 0,70)`, con `base_div` = 0,60 y `R_ref_div` = 60 en Primera, y `base_div` = 0,45 y `R_ref_div` = 40 en Segunda. Reproduce los valores de 14.4 (60 % y 45 %) con la reputación media de cada división (14.9). Club de referencia: 0,60 × 42.800 = 25.680 abonos. `abonos_vendidos` se fija en la semana 1 y sirve para los dos plazos de cobro.
- `precio_medio_abono` [D]: 600 € Primera, 220 € Segunda. Rango de referencia de la liga [NV, P-04]: 55 € a 2.462 € según club (precios 2025/26, sin fuente primaria).
- Cobro: 40 % en el primer tick de julio (semana 1) y 60 % en el primer tick de enero (semana 27) [D].
- Imputación en día de partido: a efectos de asistencia, cada abonado cuenta como asistente habitual con probabilidad `probabilidad_asistencia_abonado` [D] = 0,85.

**Abono 5 años**: `antiguedad_abono_anios` de cada abonado (4.23). Informativo desde v0.9: en el reparto audiovisual (6.9.2) cuenta la recaudación de abonos (`ingreso_abonos_temporada`), no el número de abonos de cinco años.

#### 6.2.3 Palcos y hospitality (`categoria = palcos`, `hospitality`)

**Fórmula por partido**:

```
ingreso_palcos_partido = palcos_vendidos × precio_palco_partido
ingreso_hospitality_partido = plazas_hospitality_vendidas × precio_hospitality_partido
```

- `palcos_vendidos` [D] = `round(num_palcos × tasa_venta_palcos)`, con `num_palcos = palcos_plazas / 10` (un palco equivale a 10 plazas; `palcos_plazas` es `SeccionEstadio.plazas` de tipo `palcos`).
- `tasa_venta_palcos` [D] = `clamp(0,50 + 0,004 × R + 0,05 × [división = primera], 0,50, 0,95)`, con `R` la reputación del club (4.4). En Segunda va de 0,50 a 0,90; en Primera, de 0,55 a 0,95. Es una tasa de venta de palcos, no la ocupación de 8.2.
- `plazas_hospitality_vendidas` [D] = `round(SeccionEstadio.plazas(tipo = hospitality) × tasa_venta_palcos)`. Usa la misma tasa que los palcos.
- `precio_hospitality_partido` [D] = 150 € por plaza en Primera; 60 € en Segunda.
- Los palcos se venden solo por partido. No hay pago anual de palco en la versión base [D]. Así se evita contar dos veces el mismo palco. Sus plazas (10 por palco vendido) se restan de la taquilla vendida (6.2.1), para que cada asistente de palco se cobre una sola vez [D] (v0.9, B-5).
- Precio de palco: [D] 3.000 € por partido en Primera para palco de 10 plazas; 1.000 € en Segunda.

#### 6.2.4 Derechos audiovisuales nacionales (`categoria = derechos_tv`)

**Fuente**: contrato de derechos de la temporada (4.14).

**Importe nacional de referencia**:

- Ciclo 2022/23 a 2026/27: 4.950 M€ en total, unos 990 M€ por temporada [E, prensa, S-15]. El contrato cubre solo los partidos de Primera [E]; su importe entra en el pool audiovisual común de la liga, que se reparte 90/10 entre divisiones (6.9.1, decisión 30).
- Ciclo 2027/28 a 2031/32: 5.250 M€ es el total del ciclo [NV, P-11, sin URL localizada], que son la suma de los importes del operador A (unos 2.636 M€) y del operador B (unos 2.614 M€). Se aplica como total de ciclo (decisión de producto 18): cinco temporadas, unos 1.050 M€ por temporada. Ver A-04 (cerrada).

**Pool audiovisual de liga** (nacional más internacional, las dos divisiones) [E] (v0.9): 1.432,12 M€ por temporada, el reparto audiovisual de 2024/25 [E, S-16; total confirmado por varias fuentes, desglose por división de una sola fuente de prensa]. De él, 990 M€ son el contrato nacional y 442,12 M€ el resto (internacional y contratos de Segunda) [E, por diferencia]. Desde 2027/28, nacional de 1.050 M€ y resto sin cambio: 1.492,12 M€ [D].

**Reparto entre divisiones y clubes**: ver 6.9 (art. 5.2 y 5.3 del Real Decreto-ley 5/2015).

**Cobro**: en tramos a lo largo de la temporada. [D] Por defecto, 10 tramos en el primer tick de cada mes de agosto a mayo (6.5), sin tramo en junio. Cada tramo es el 10 % del `reparto_av_i` del club (nacional más internacional, 6.9.2) [D] (v0.9).

**Momento del cálculo** [D] (v0.8): el reparto de la temporada t (nacional, internacional, digital y comercialización) se calcula en la semana 52 de la temporada t − 1 (11.4, paso 4), con la división de cada club en la temporada t, y se crean entonces sus movimientos `previsto`. En la partida 2026/27 se calcula al cargar, antes del tick 1.

#### 6.2.5 Derechos internacionales y digitales (`categoria = derechos_tv`, subtipo internacional o digital)

- Internacional: forma parte del pool audiovisual de liga de 6.2.4 (442,12 M€ por temporada con los contratos de Segunda [E]) y se reparte con el mismo modelo que el nacional, implantación social incluida (B-4, decisión 34; cierra A-05). El nacional y el internacional se reparten juntos como `reparto_av_i` (6.9.2) y se cobran en los mismos tramos (6.5). Sustituye a la horquilla de 440 a 586 M€ de v0.8, que atribuía todo el audiovisual a Primera.
- Digital: [D] pool de 40 M€ en Primera (4 M€ en Segunda, 14.1). Es un pool propio: no se suma al pool audiovisual ni compite con el de comercialización (6.9.1 y 6.2.6).
- Reparto del pool digital entre clubes [D] (v0.9): mismo modelo legal que el audiovisual de su división (6.9.2 en Primera, 6.9.3 sin fondo en Segunda), con el límite legal de dispersión. Sustituye al reparto por tercios de v0.8. Club de referencia de Primera (14.8): 40 × 0,044375 = 1,775 M€ por temporada, 147.916,67 € al mes. Un club con 1/20 exacto cobraría 2,0 M€.
- Sustituye al modelo de seguidores de la versión 0.2, que se elimina (8.7; decisión de producto 8). No hay opción de sumarlo al pool audiovisual.

#### 6.2.6 Comercialización de LaLiga (`categoria = comercializacion`)

- Pool de liga: 1.584,5 M€ [C, S-02, Cuadro 1 del informe económico 2024/25], que el documento redondea a 1.585 M€. Es el agregado de Primera y Segunda (42 clubes), no solo de Primera (decisión 29, F-1). Incluye patrocinio de liga, comercialización internacional y otros.
- Reparto entre divisiones [D] (v0.9): 90 % Primera (1.426,05 M€) y 10 % Segunda (158,45 M€), por analogía con el art. 5.2 del Real Decreto-ley 5/2015. El informe no da desglose por división [C, S-02].
- Reparto entre clubes [D] (v0.9, B-4): mismo modelo legal que el audiovisual de la división (6.9.2 en Primera: 50 % igual, 25 % resultados, 25 % implantación social, con límite legal de dispersión; 6.9.3 sin fondo de compensación en Segunda, con la posición de la temporada anterior). Club de referencia de Primera (14.8): 1.426,05 × 0,044375 = 63,281 M€ por temporada (79,25 M€ en v0.8, con 1.585 M€ atribuidos solo a Primera y 1/20 por club).
- Cobro [D] (v0.8): 50 % del importe del club en la semana 1 y 50 % en la semana 27 (6.5). Club de referencia: 31.640.484,38 € y 31.640.484,37 € (la última cuota absorbe el redondeo, 4.1).

#### 6.2.7 Patrocinio de club (`categoria = patrocinio`)

**Fórmula por zona y temporada**:

```
ingreso_patrocinio_temporada = importe_fijo_anual + importe_variable_max × proporcion_objetivo
```

- `proporcion_objetivo` = 1 si el objetivo vinculado está cumplido; 0 si no; [D] proporcional si el objetivo es de tipo cuantitativo. Proporcional [D] (v0.8): `clamp(valor_logrado / valor_objetivo, 0, 1)` en objetivos de mínimo (`puntos_minimos`, `saldo_minimo`, `aforo_medio_minimo`); en objetivos de máximo (`posicion_final`, `fichajes_maximos`), `clamp(valor_objetivo / valor_logrado, 0, 1)`. `permanencia` es 1 o 0.
- Objetivo vinculado por defecto [D] (v0.8): el objetivo deportivo de la temporada (`posicion_final` o `permanencia`). La parte variable se cobra la semana siguiente a la evaluación (6.10, punto 2), es decir, en la semana 1 de la temporada siguiente, con categoría `patrocinio`.
- Cobro según `forma_cobro`. Por defecto, mensual en 10 tramos, en el primer tick de cada mes de agosto a mayo (6.5). `trimestral` [D] (v0.8): 4 tramos del 25 % en las semanas 5, 18, 31 y 44. `anual_inicio`: 100 % en la semana 1 (o en la semana de firma si se firma con la temporada empezada).
- Contratos que empiezan con la temporada empezada [D] (v0.8): cobran solo los tramos posteriores a la semana de firma, cada uno por su importe completo; el importe anual se reduce en los tramos ya pasados.
- Rango de referencia [NV]: las cifras de patrocinio de los grandes clubes (ver 8.3) no se usan como base. Fuente sin URL localizada.

#### 6.2.8 Venta de vallas (`categoria = vallas`)

- Modalidad A (inicio de temporada): cobro fijo al inicio. `ingreso_vallas = n_vallas × precio_valla_temporada`.
- Modalidad B (por partido): `ingreso_vallas_partido = n_vallas × precio_valla_partido × ocupacion`, con `ocupacion` la de 8.2.
- `precio_valla_partido` [D] (v0.6): unidad, euros por valla y partido de local. Rango: mayor que 0 y no superior a `precio_valla_temporada / partidos_local_por_equipo` (4.3). Origen: derivado de la modalidad A, `precio_valla_partido = precio_valla_temporada / partidos_local_por_equipo`. Primera: 18.000 / 19 = 947 € por valla y partido. Segunda: 6.000 / 21 = 286 €. Con ocupación 1,0 en todos los partidos, la modalidad B iguala a la A; con la ocupación de referencia de 8.2 (0,88 en el club de referencia), da unos 0,88 de la A.
- [D] Modalidad A por defecto. `n_vallas` = `aforo_total / 40`, redondeado hacia abajo. `precio_valla_temporada` [D] = 18.000 € en Primera; 6.000 € en Segunda.
- Importe de referencia en Primera [D]: 1.070 vallas × 18.000 € = 19,26 M€ por temporada. Tiene fila propia en 14.8, con rango de 7 % a 8 % [D].

#### 6.2.9 Merchandising (`categoria = merchandising`)

Ver 8.1 para el modelo completo. Resumen: la tienda física y online generan ingreso neto del club; las camisetas generan un royalty sobre unidades vendidas por el proveedor.

#### 6.2.10 Restauración (`categoria = restauracion`)

Ver 8.5. Resumen: `ingreso_restauracion_partido = asistentes × gasto_medio × tasa_captacion × margen_club`.

#### 6.2.11 Museo y tours (`categoria = museo`)

Ver 8.4.

#### 6.2.12 Eventos y conciertos (`categoria = eventos`)

Ver 8.6.

#### 6.2.13 Naming rights (`categoria = naming`)

Ver 8.3.

#### 6.2.14 Venta y cesión de jugadores (`categoria = traspasos`)

**Venta de jugador**:

```
beneficio_venta = precio_venta − amortizacion_restante_cent
```

- El ingreso de caja es `precio_venta`. Se registra un movimiento de traspaso positivo. El beneficio contable se registra en la cuenta de resultados de la temporada.
- La venta solo es posible en ventana de mercado abierta (11.3).
- Comprador y precio [D] (v0.9, B-1): el sistema compra al instante por `precio_venta = valor_mercado × min(1,0; 0,6 + 0,1 × anios_restantes)` (13.3).

**Cesión de jugador** (solo saliente; las cesiones entrantes quedan fuera de la versión base, B-1):

```
ingreso_cesion = cuota_cesion + porcentaje_salario_pagado_por_tercero × salario_anual
```

- `cuota_cesion` [D] = 10 % del valor de mercado del jugador para cesiones de una temporada.
- `porcentaje_salario_pagado_por_tercero` [D] = 0,50 por defecto.

#### 6.2.15 Indemnización de seguros (`categoria = seguros_cobro`)

- Cuando un jugador asegurado (4.20) causa baja larga (más de 56 días, ver 5.5.5), el seguro devuelve un porcentaje del gasto médico y del salario de baja.
- `indemnizacion = gasto_medico_bruto × cobertura_lesion + salario_baja × cobertura_salario_baja`, con topes [D] de 1,5 M€ por lesión en Primera y 0,6 M€ en Segunda.
- `salario_baja` = `salario_anual_bruto / 365 × días de baja que superan 56`, es decir, el salario solo se cubre desde el día 57 [D]. `gasto_medico_bruto` se define en 6.3.7.
- Momento [D] (v0.8): la duración de la lesión se conoce al sortearla (9.12.4), así que la indemnización completa se calcula en el tick de la lesión ("comprobación del siniestro") y se cobra en la semana siguiente, la misma semana que el gasto médico.
- Producto de seguro [D] (v0.8): la versión base ofrece un único producto, con `tasa_prima` 0,04, `cobertura_lesion` 1,0 y `cobertura_salario_baja` 0,8 (14.3). Se contrata o se cancela por jugador con efecto en el primer tick del mes siguiente. La carga no incluye seguros.

#### 6.2.16 Ingresos por objetivos y primas de competición (`categoria = competicion`)

- Premio de liga por posición: [D] tabla en 6.9.4. Cobro en la semana 1 de la temporada siguiente (6.5).
- Premio de ascenso (solo Segunda): [D] 3,0 M€ en 6.9.4. Cobro en la semana 1 de la temporada siguiente.
- La prima de permanencia no es un ingreso: es un gasto del club (6.6.3).
- Premios de Copa y Europa: fuera de alcance en la versión base (A-06, cerrada en v1.0).

#### 6.2.17 Impuestos a favor del club

No hay ingresos fiscales a favor del club. Los impuestos son solo gasto (6.8).

### 6.3 Fuentes de gasto

#### 6.3.1 Salarios de jugadores (`categoria = salarios_jugadores`)

**Fórmula mensual**:

```
pago_salario_jugador_mes = salario_anual_bruto / N_mensualidades
```

- `N_mensualidades` = 12 si `forma_pago = doce_mensualidades`; 10 si `diez_mensualidades` [D].
- `aplazado`: el salario se paga en las semanas indicadas en `plazos_aplazado` (4.9). Por defecto, 50 % en la semana 26 (último tick de diciembre, coincide con la comprobación intermedia de 10.3) y 50 % en la semana 48 (primer tick de junio). Son fechas fijas y no siguen la regla mensual [D].
- Pago en el primer tick de cada mes (5.1.1; decisión de producto 12) [D].
- Altas con la temporada empezada [D] (v0.8): se pagan las mensualidades de los meses posteriores a la semana de firma, a `salario_anual_bruto / N_mensualidades` cada una; no hay pago del mes de la firma. En `aplazado`, un plazo cuya semana ya pasó se suma al siguiente plazo pendiente, y el total de la temporada se multiplica por (meses de la temporada posteriores a la firma / 12).
- Bajas (venta, rescisión, venta forzosa de 6.11): no se devuelve la mensualidad ya pagada; las mensualidades posteriores se anulan (`estado = anulado`) [D] (v0.8).
- Los salarios se pagan mientras el jugador es del club, incluso lesionado. Las bajas largas tienen cobertura de seguro si el jugador es asegurado (6.2.15).

#### 6.3.2 Salarios de personal técnico y administrativo (`categoria = personal`)

- Suma de `PersonalTecnico.salario_anual_cent / 12` mensual.
- Personal de secretaría: `secretaria_honorarios_anual / 12` mensual.
- Personal de dirección: `personal_costes_anual / 12`.

#### 6.3.3 Amortización de fichajes (`categoria = amortizacion`)

**Fórmula lineal**:

```
cargo_amortizacion_temporada = coste_fichaje_cent / anios_duracion
```

- Se aplica por temporada (no por mes) desde la temporada del fichaje hasta el fin del contrato [D] (práctica contable simplificada, sin fuente en el Anexo).
- En el juego, la amortización se muestra en la cuenta de resultados, pero no sale de caja. [D] Se registra en la semana 52 como `Movimiento` de categoría `amortizacion` con `afecta_caja = false` (4.13) [D] (v0.8).
- Comisiones de intermediario (6.3.14): gasto del ejercicio, no se amortizan [D] (v0.8).
- Un fichaje en ventana de invierno se amortiza desde la temporada siguiente [D] (A-08, cerrada en v1.0).
- Si el jugador se vende, el cargo restante se elimina y el beneficio o pérdida se registra como se indica en 6.2.14.

**Nota para la caja**: el pago real del fichaje sale de caja en el momento de la operación. Se registra como `movimiento` de `traspasos` negativo en la semana de la operación.

#### 6.3.4 Primas (`categoria = primas`)

- **Prima de gol**: desactivada en la versión base (A-07, cerrada en v1.0). Si se activa, la `Clausula` de tipo `prima_gol` del contrato (4.10) paga su importe por cada gol marcado, con los goles que produce la simulación (5.5.3).
- **Prima de objetivo**: si el objetivo asociado se cumple, pago único en la semana 52 (6.5). [D] La prima de permanencia se define solo en 6.6.3.
- Límite por temporada: el total de primas no puede superar el 15 % de la masa salarial de jugadores [D] (ver 10.2 para control).

#### 6.3.5 Rescisiones (`categoria = rescision`)

Ver 6.6.

#### 6.3.6 Seguros de jugadores (`categoria = seguros_gasto`)

```
prima_seguro_mensual = salario_anual_bruto × tasa_prima / 12
```

- `tasa_prima` [D] = 0,04 para un seguro completo (cobertura del 100 % del gasto médico y 80 % del salario en baja larga). Valores en 14.3.
- Pago mensual en el primer tick de cada mes (6.5).

#### 6.3.7 Hospital y lesiones (`categoria = medico`)

```
gasto_medico_bruto = dias_baja × coste_diario_medico
gasto_medico_lesion = gasto_medico_bruto × (1 − cobertura_lesion)
```

El seguro (6.2.15) cubre `gasto_medico_bruto × cobertura_lesion`; la parte no cubierta es `gasto_medico_lesion`.

- `coste_diario_medico` [D] = 1.500 € por día en Primera; 800 € en Segunda, ajustado por calidad del médico (PersonalTecnico, rol medico): × (1 − 0,05 × (calidad − 3)). `calidad_medico` [D] (v0.8): la mayor `calidad` entre el personal con rol `medico` del club; 1 si no hay ninguno (factor 1,10). Es el mismo valor que usa `f_medico` en 9.12.4.
- `dias_baja` = días sorteados de la lesión (9.12.4) [D] (v0.8).
- Sin seguro, `cobertura_lesion = 0`.
- El gasto se devenga en el tick en que se produce la lesión y se paga en la semana siguiente [D].

#### 6.3.8 Mantenimiento de estadio (`categoria = mantenimiento`)

- Mantenimiento fijo anual: `coste_mantenimiento_base = aforo_total × 60 € × (1 + 0,01 × antiguedad_anios)` [D] (factor de antigüedad de 7.7, citado aquí en v0.8), pagado en 12 mensualidades iguales en el primer tick de cada mes (6.5). `aforo_total` y `antiguedad_anios` son los del primer tick del mes.
- Reposición de césped: ver 7.6.
- Mantenimiento de obras finalizadas: `aforo_delta × coste anual por plaza` de 7.2 (25 € por plaza en grada general; 30 € en preferente) [D]. Se suma al mantenimiento base, que ya incluye las plazas nuevas en `aforo_total` (las dos partidas se pagan; no es doble conteo) [D] (v0.8). Palcos [D] (v0.8): 2.000 € al año por palco nuevo (columna de 7.2), no por plaza. Las mensualidades empiezan en el primer tick del mes siguiente al fin de la obra.
- Mantenimiento de obras finalizadas sin aforo: el importe anual de la columna "Mantenimiento anual" de 7.2, en 12 mensualidades (primer tick). La excepción es `nueva_cafeteria`, cuyo coste de 60.000 €/año se paga como `explotacion_cafeterias` (8.5), no como mantenimiento, para no contarlo dos veces. [D]

#### 6.3.9 Obras (`categoria = obras`)

- El coste total se paga en cuotas iguales por semana durante la duración de la obra [D].
- La obra solo empieza si la caja tiene saldo suficiente para la primera cuota o si el descubierto lo permite. Regla [D] (v0.8): "saldo disponible" = `saldo_cent + descubierto_limite`, medido en el momento del pago de la cuota (orden 6.º de 6.5). Si es menor que la cuota, la obra no empieza o se suspende esa semana (7.3).
- Ver 7.3.

#### 6.3.10 Préstamos (`categoria = prestamos`)

Ver 6.7. Cuotas separadas en principal e intereses.

#### 6.3.11 Impuestos (`categoria = impuestos`)

Ver 6.8.

#### 6.3.12 Cláusula casa y coche (`categoria = clausula_casa_coche`)

Ver 6.6.

#### 6.3.13 Honorarios del entrenador (`categoria = honorarios_tecnico`)

- Pago mensual en 12 tramos.
- Importe: `honorarios_anual_cent / 12`.
- Ver 9.5.

#### 6.3.14 Gastos de traspaso (`categoria = traspasos`)

- Coste de fichaje: pago único en la semana de la operación. Ver 6.3.3.
- Comisiones de intermediario: [D] 5 % del coste de fichaje, pagadas el mismo día.

### 6.4 Amortización de fichajes (detalle)

Datos del contrato: `coste_fichaje_cent`, `anios_duracion`, `fecha_inicio`.

```
cargo_anual = coste_fichaje_cent / anios_duracion
amortizacion_restante(t) = coste_fichaje_cent − cargo_anual × temporadas_transcurridas(t)
```

Ejemplo de cálculo (ilustrativo, sin datos reales): fichaje de 12 M€ con contrato de 4 años produce un cargo de 3 M€ por temporada. Tras 2 temporadas, la amortización restante es 6 M€. Si se vende por 4 M€, el beneficio contable es −2 M€.

### 6.5 Plazos de cobro y pago

Tabla única de cobros y pagos [D]. Los ticks son los de la tabla 5.1.1. "Orden" indica el lugar dentro de la liquidación de cada tick (ver regla siguiente).

| Concepto | Tipo | Periodicidad | Tick de cobro o pago | Orden |
|---|---|---|---|---|
| Derechos audiovisuales (nacional e internacional, `reparto_av_i` de 6.9) [D] (v0.9; antes dos filas con el mismo calendario) | Cobro | 10 tramos, de agosto a mayo | Primer tick de cada mes de agosto a mayo (semanas 5, 9, 14, 18, 22, 27, 31, 35, 40, 44) | 1 |
| Derechos digitales | Cobro | 12 mensualidades | Primer tick de cada mes (semanas 1, 5, 9, 14, 18, 22, 27, 31, 35, 40, 44, 48) | 1 |
| Comercialización de liga | Cobro | 2 tramos del 50 % [D] (v0.8) | Primer tick de julio (semana 1) y primer tick de enero (semana 27) | 1 |
| Abonos | Cobro | 2 plazos | Primer tick de julio (40 %) y primer tick de enero (60 %) | 1 |
| Patrocinio | Cobro | Según `forma_cobro` (4.15): mensual, 10 tramos; trimestral, 4 tramos del 25 %; anual_inicio, 1 pago [D] (v0.8) | Mensual: primer tick de cada mes de agosto a mayo. Trimestral: semanas 5, 18, 31 y 44. Anual_inicio: semana 1. Parte variable: semana 1 de la temporada siguiente (6.2.7) | 1 |
| Venta de vallas | Cobro | Anual (modalidad A). Modalidad B: por partido de local [D] (v0.8) | A: semana 1, con `n_vallas` calculado en la semana 1. B: semana de la jornada de local | 1 |
| Taquilla y matchday (taquilla, palcos, hospitality, restauración y tienda de día) | Cobro | Por partido | Semana de la jornada de local | 1 |
| Merchandising (tienda online; la tienda física de día de partido va en la fila de matchday y la de fuera de día de partido, en su propia fila) | Cobro | Mensual: el primer tick del mes m cobra `ingreso_online_mes` del mes m, con su multiplicador estacional [D] (v0.8) | Primer tick de cada mes | 1 |
| Royalty de camisetas (8.1) | Cobro | 12 mensualidades iguales de `ingreso_camisetas` de la temporada [D] (v0.8) | Primer tick de cada mes | 1 |
| Museo y tours | Cobro | Mensual: ingreso anual × multiplicador del mes / 12,2 (8.4) [D] (v0.8) | Primer tick de cada mes | 1 |
| Tienda física fuera de día de partido (8.1) [D] (v1.0, decisión 42) | Cobro | Mensual: `(visitas_museo_mes + visitas_tour_mes) × 0,04 × 35 €` del mes m (8.1). Sustituye a la fila de restauración fuera de día de partido, eliminada en v1.0 | Primer tick de cada mes | 1 |
| Eventos (canon fijo y porcentaje del club) | Cobro | Por evento | Semana de celebración del evento | 1 |
| Cesiones salientes (ingreso_cesion, 6.2.14; el club cede al jugador) | Cobro | `cuota_cesion`: pago único; parte de salario: mensual, `porcentaje_salario_tercero × salario_anual_bruto / 12` por cada mes de cesión [D] (v0.8) | Cuota: semana de la operación. Salario: primer tick de cada mes posterior a la operación | 1 |
| Premio de liga por posición (6.9.4) | Cobro | Anual | Semana 1 de la temporada siguiente | 1 |
| Premio de ascenso (6.9.4) | Cobro | Anual | Semana 1 de la temporada siguiente | 1 |
| Seguro (indemnización) | Cobro | Por siniestro | Semana siguiente a la comprobación del siniestro (tick de la lesión, 6.2.15) | 1 |
| Cuotas de préstamo (principal e intereses) | Pago | Mensual, desde el mes siguiente a la disposición | Primer tick de cada mes | 1.º |
| Impuesto de sociedades | Pago | Anual | Semana 4 de la temporada siguiente | 1.º [D] (v0.8; antes "Resto", en contra de 6.10 punto 3) |
| Impuesto de tesorería (6.8, A-10; desactivado por defecto) | Pago | Semanal si está activo | Cada semana | 1.º [D] (v0.8; antes "Resto") |
| Seguros (prima) | Pago | Mensual | Primer tick de cada mes | 2.º |
| Salarios jugadores | Pago | 12 o 10 mensualidades (10 = de agosto a mayo); `aplazado`: 50 % y 50 % (6.3.1) | Primer tick de cada mes; `aplazado`: semanas 26 y 48 | 3.º |
| Salarios personal técnico, secretaría y dirección | Pago | 12 mensualidades | Primer tick de cada mes | 4.º |
| Honorarios del entrenador | Pago | 12 mensualidades | Primer tick de cada mes | 5.º |
| Obras | Pago | Cuota semanal | Cada semana de obra | 6.º |
| Primas de objetivo | Pago | Anual | Semana 52 | 7.º |
| Prima de permanencia (gasto, 6.6.3) | Pago | Anual | Semana 52 | 7.º |
| Gasto médico | Pago | Por lesión | Semana siguiente a la lesión | Resto |
| Mantenimiento de estadio (incluye obras sin aforo, 6.3.8) | Pago | 12 mensualidades | Primer tick de cada mes | Resto |
| Explotación de cafeterías (60.000 €/año por cafetería, 8.5) | Pago | 12 mensualidades | Primer tick de cada mes | Resto |
| Reposición de césped (7.6) | Pago | Puntual | Semana siguiente a `cesped_estado < 40` | Resto |
| Intereses de descubierto | Pago | Mensual, sobre el saldo de cierre del mes anterior | Primer tick de cada mes | Resto |
| Traspasos, comisiones y rescisiones | Pago o cobro | Puntual | Semana de la operación | Resto |
| Naming (zona `naming`, 4.15; 8.3) | Cobro | Según `forma_cobro` del contrato (4.15) | Mensual: primer tick de cada mes de agosto a mayo; `anual_inicio`: semana 1 [D] | 1 |
| Principal dispuesto de préstamo (6.7, 13.6) | Cobro | Por operación | Semana de la operación | 1 |
| Cláusula casa y coche (6.6.1) | Pago | Una vez por firma o renovación | Semana de la firma o renovación | Resto |
| Prima de firma de renovación del entrenador (9.9) | Pago | Una vez por renovación | Semana de la renovación | Resto |
| Rescisión del entrenador al aceptar oferta (9.8, 13.7) | Pago del club de destino [D] (v0.9, B-2) | Puntual | Semana siguiente a la aceptación | Resto |
| Coste del plan de entrenamiento (9.12.3) | Pago | Semanal | Cada semana | Resto |
| Multas y sanciones (10.2, 8.6.4, 12.7) | Pago | Puntual | Semana de la comprobación de la sanción | Resto |
| Aparcamiento (7.2), solo si existe la obra | Cobro | Por partido: `min(1.500, round(0,10 × asistencia_partido)) × 10 €` [D] (v0.9, B-6) | Semana de la jornada de local | 1 |
| Venta forzosa (6.11, B-1) | Cobro | Puntual | Semana del tercer cierre de mes seguido con descubierto por encima del límite | 1 |

**Regla de liquidación dentro de un tick** [D]:

1. Se aplican todos los cobros previstos del tick en el orden de la columna "Orden". Dentro del mismo orden, el desempate es `secuencia_creacion` ascendente.
2. Después se aplican los pagos del tick, en el orden de la columna "Orden" de 6.5 (préstamos e impuestos, seguros, salarios, personal, honorarios, obras, primas, resto).
3. Dentro de un mismo grupo de orden, el desempate es `secuencia_creacion` ascendente, un entero asignado al crear el movimiento. No se usa el id UUID.
4. Si el descubierto supera el límite después de los pagos, se aplica 6.11 al último tick de mes, no en el tick.

Cambio respecto a v0.2: todos los movimientos mensuales pasan al primer tick del mes (decisión de producto 12). Los movimientos anuales y puntuales usan el tick que indica la tabla. Los palcos no tienen pago anual (6.2.3).

### 6.6 Cláusulas de contrato

#### 6.6.1 Cláusula casa y coche

**Propósito**: bonus al firmar o renovar que crece con el número de jugadores de la plantilla que la tienen [NV, P-01].

**Fórmula**:

```
bonus_casa_coche = base_casa_coche × (1 + k_casa_coche × n_jugadores_con_clausula)
```

- `base_casa_coche` [D] = 150.000 € para jugadores de salario bajo, 300.000 € para medio, 600.000 € para alto (tramos por salario anual bruto [D]: bajo si es menor de 1 M€; medio si está entre 1 M€ y 3 M€, ambos incluidos; alto si es mayor de 3 M€).
- `k_casa_coche` [D] = 0,10.
- `n_jugadores_con_clausula` cuenta las `Clausula` de tipo `casa_coche` activas (4.10) de los jugadores vigentes del club en el momento del pago. Incluye al jugador que se firma o renueva, una vez registrada su cláusula [D].
- Se paga una vez, al firmar o renovar. Movimiento de categoría `clausula_casa_coche`.
- Límite [D]: como máximo 6 jugadores con cláusula activa por club. Ver 12.5.

#### 6.6.2 Cláusula de rescisión

**Propósito**: indemnización por terminar un contrato antes de tiempo.

**Fórmula por años restantes**:

```
coste_rescision = salario_anual_bruto × anios_restantes × factor_rescision
```

- `factor_rescision` [D]: 0,60 si `anios_restantes ≥ 3`; 0,45 si `anios_restantes = 2`; 0,30 si `anios_restantes = 1`.
- Si el contrato tiene una `Clausula` de tipo `rescision` activa (4.10), el coste es el mayor entre su importe y la fórmula anterior [D].
- La rescisión se puede ejecutar en ventana de mercado. Fuera de ventana, solo por acuerdo del sistema en casos de baja muy larga de más de 120 días [D] (decisión de producto 13).

#### 6.6.3 Prima de permanencia

- Solo en Primera [D]. Es un gasto del club, no un ingreso (decisión de producto 14), y es la única definición de la prima de permanencia. Se paga en la semana 52 si el club queda en la posición 17 o mejor (15.6). Bolsa total: 500.000 €, repartida entre la plantilla en proporción a `minutos_temporada` de cada jugador. Categoría `primas`.

### 6.7 Préstamos

**Límite por división** [D]: 60 M€ en Primera; 15 M€ en Segunda. Límite adicional [D] de +20 % si el club cumple todos los objetivos de la temporada anterior.

**Número máximo de préstamos activos**: 4 [D].

**Tipo de interés**: 4 % a 6 % anual. Depende de reputación del club y de la división [D]. Fórmula [D] (v0.8): `tipo = clamp(0,06 − 0,02 × R / 100 + 0,005 × [división = segunda], 0,04, 0,06)`, con `R` la reputación del club en la semana de la solicitud. Club de referencia (Primera, R = 60): 4,8 %. El tipo queda fijo durante toda la vida del préstamo.

**Ejemplo de comprobación** [D] (v0.8): 10 M€ a 5 años y 5 %. Lineal: principal 166.666,67 € al mes; intereses del primer mes 41.666,67 €; primera cuota 208.333,33 €; intereses totales 1.270.833,33 €. Francesa: cuota 188.712,34 €; intereses totales 1.322.740,19 €.

**Amortización**:

- Lineal: `cuota_principal_mensual = principal / (anios × 12)`; `interes_mes = saldo_pendiente × tipo / 12`.
- Francesa (opcional): cuota constante. [D] Lineal por defecto; el jugador puede elegir francesa al pedir el préstamo (13.6) (A-09, cerrada en v1.0).

**Cálculo de cuota mensual** (francesa):

```
cuota = principal × (i × (1 + i)^n) / ((1 + i)^n − 1)
```

con `i = tipo / 12` y `n = anios × 12`.

**Reglas**:

- No se puede pedir un préstamo si el saldo sumado de préstamos activos más el nuevo principal supera el límite de división. "Saldo sumado" = Σ `saldo_pendiente_cent` de los préstamos activos [D] (v0.8). El +20 % exige que todos los objetivos de la temporada anterior tengan `cumplido = true`; en 2026/27 no aplica.
- Un préstamo con saldo pendiente no se puede cancelar anticipadamente sin pagar un 2 % de penalización [D]. Base [D] (v0.8): 2 % de `saldo_pendiente_cent` en la semana de la cancelación, pagado junto con ese saldo (orden 1.º).
- Las cuotas se registran como dos movimientos de categoría `prestamos`: `subcategoria = principal` (no es gasto en resultados) y `subcategoria = intereses` (gasto) [D] (v0.8). El principal dispuesto es un cobro `prestamos/principal`, que tampoco es ingreso en resultados.
- Préstamos de la carga (`prestamos_iniciales`, 15.2): mismos campos que `Prestamo` (4.16), con su `saldo_pendiente_cent` y plazo restante [D] (v0.8).
- Cuando el club no puede pagar una cuota, el saldo entra en descubierto. Si el descubierto supera el límite, aplica 10.2.

### 6.8 Impuestos

**Impuesto de sociedades simplificado** [D]:

```
impuesto_sociedades = max(0, beneficio_contable_ejercicio) × 0,25
```

- `beneficio_contable_ejercicio` = ingresos − gastos, incluida la amortización de 6.3.3, más el beneficio o pérdida contable de traspasos (6.2.14). No se incluyen los importes de caja de traspasos, solo el resultado contable [D]. Esta definición sustituye a la versión 0.1.
- Pago en la semana 4 de la temporada siguiente (tick de la semana 4, ver 6.5). Plazo fijo: semana 4, sin plazo en días [D].
- Pérdidas de ejercicios anteriores compensables con tope [D] del 50 % del beneficio, durante 5 ejercicios.
- Cálculo exacto [D] (v0.8):
  - `beneficio_contable_ejercicio` = Σ `importe_cent` de los movimientos de la temporada (semanas 1 a 52, estado `efectivo`, con o sin `afecta_caja`), excluyendo: los de categoría `traspasos` que son precio de compra o de venta (sí entran las comisiones y el apunte de beneficio o pérdida contable con `afecta_caja = false`), los de `prestamos` con `subcategoria = principal`, y los de `impuestos`. Criterio de caja para el resto de ingresos y gastos.
  - Base imponible = `beneficio_contable_ejercicio − compensación`, con `compensación = min(0,5 × beneficio, Σ bases_negativas)` si el beneficio es positivo; se consumen primero las bases más antiguas.
  - Si el beneficio es negativo, se añade `(anio_inicio, −beneficio)` a `Club.bases_negativas` (4.4).
  - El impuesto se registra en la semana 52 como movimiento `previsto` y pasa a `efectivo` en la semana 4 siguiente. La "pérdida neta del ejercicio" de 10.1 es `−beneficio_contable_ejercicio`, antes de impuesto.

**Impuesto de tesorería opcional** [D; A-10, cerrada en v1.0: desactivado en la versión base]:

- Impuesto sobre saldo positivo de caja: `impuesto_semanal = saldo_caja × 0,01`, pagado cada semana si el saldo es positivo y supera 10 M€ [D].
- Este mecanismo viene de una referencia no verificada [NV] (ver 17.1). Desactivado en la versión base (A-10, cerrada en v1.0).
- **Aviso de riesgo [D]**: un 1 % semanal equivale a unos 41 % anual compuesto (1 − 0,99^52). Activarlo sin recalibrar el resto del modelo vacía la caja de cualquier club. El valor de 1 % semanal se mantiene como decisión de diseño con este aviso, y debe probarse con la simulación antes de activarlo.

**Retención de jugadores**: los salarios se modelan como brutos. La retención del IRPF no se modela de forma separada; el jugador percibe el importe neto implícito [D].

### 6.9 Reparto audiovisual y de liga entre clubes

Modelo del Real Decreto-ley 5/2015 (versión consolidada, BOE, S-14) [C], aplicado en el juego a los tres pools de liga: audiovisual, comercialización (por analogía, [D], decisión 29) y digital (pool propio, [D]). Decisiones 30 (F-2) y 34 (B-4). Sustituye al reparto "por tercios" y al factor K = 4 de v0.8.

#### 6.9.1 Pools y reparto entre divisiones

| Pool (temporada 2026/27) | Liga | Primera (90 %) | Segunda (10 %) | Etiqueta |
|---|---|---|---|---|
| Audiovisual: nacional más internacional (6.2.4 y 6.2.5) | 1.432,12 M€ | 1.288,908 M€ | 143,212 M€ | Importe [E] (reparto 2024/25, S-16); 90/10 [C] (art. 5.2) |
| Comercialización (6.2.6) | 1.584,5 M€ | 1.426,05 M€ | 158,45 M€ | Importe [C] (S-02); 90/10 [D] por analogía (decisión 29) |
| Digital (6.2.5) | — | 40 M€ | 4 M€ | [D]; pool propio de cada división |

- Desde 2027/28: audiovisual de liga 1.492,12 M€ (Primera 1.342,908 M€; Segunda 149,212 M€) [D]. Comercialización y digital sin cambio [D].
- Referencia real: el reparto audiovisual de 2024/25 fue de 1.292,09 M€ en Primera y 140,03 M€ en Segunda (90,2 % y 9,8 %) [E, S-16]. El juego aplica el 90/10 exacto del art. 5.2 sobre el total.
- Los tres pools se reparten por separado con 6.9.2 (Primera) o 6.9.3 (Segunda). No se suman ni compiten entre sí. El fondo de compensación solo se detrae del audiovisual de Segunda (6.9.3).

**Límite de dispersión** (art. 5.5) [C]: dentro de cada división, el mayor reparto no puede superar `L_disp` veces el menor, con `L_disp = 3,5` si el importe total repartido de la temporada es de 1.500 M€ o más, y `L_disp = 4,5` en otro caso. "Importe total repartido" [D] (decisión de producto 44, v1.0; interpretación del art. 5.5, que incluye en el cálculo otros ingresos comerciales; la nota oficial de 2024/25 aplicó 3,5 [C, S-16]): suma de los pools de liga de la temporada (audiovisual, comercialización y digital de las dos divisiones), 3.060,62 M€ en 2026/27 y 3.120,62 M€ desde 2027/28. En la versión base, `L_disp = 3,5`. El límite se aplica a cada pool por separado; si cada pool lo cumple, la suma por club también.

**Factor K** (v0.8, K = 4,0 [D]): eliminado en v0.9. El límite legal de 3,5 es más estricto, así que K quedaba redundante (decisión 19).

#### 6.9.2 Fórmula en Primera

Para cada club `i` de Primera y cada pool `P` de 6.9.1 (art. 5.3) [C]:

```
reparto_bruto_i = P × ( 0,50 / 20  +  0,25 × r_i  +  0,25 × m_i )
```

- **Parte igual** (art. 5.3.a) [C]: 50 % del pool a partes iguales entre los 20 clubes.
- **Resultados deportivos** (art. 5.3.b.1.º), 25 % del pool. Escala y pesos [C]; normalización y temporadas fuera de Primera [D]:

```
r_i = Σ_k w_k × e(pos_i,k) / Σ_j Σ_k w_k × e(pos_j,k)
k = 1 a 5 (temporadas anteriores, 1 = la última); w = 0,35; 0,20; 0,15; 0,15; 0,15
e(p): 1.º 17 %; 2.º 15 %; 3.º 13 %; 4.º 11 %; 5.º 9 %; 6.º 7 %; 7.º 5 %; 8.º 3,5 %; 9.º 3 %; 10.º 2,75 %;
      desde el 11.º, 0,25 puntos menos por puesto hasta el 20.º (0,25 %). Suma: 100 %.
```

  Las posiciones salen de `historial_posiciones` (4.4). Una temporada en Segunda o fuera del juego cuenta `e = 0` [D]; la normalización hace que `r_i` sume 1 entre los 20 clubes. Si los 20 clubes jugaron en Primera las 5 temporadas, el denominador es 1 y `r_i` es la media ponderada de la escala. En la carga (2026/27), las 5 temporadas toman la posición del orden por `reputacion` descendente y `codigo` ascendente [D] (B-4).
- **Implantación social** (art. 5.3.b.2.º), 25 % del pool, con 1/3 por recaudación y 2/3 por contribución televisiva [C]:

```
m_i = (1/3) × T_i / Σ_j T_j  +  (2/3) × c_i
T_i = Σ Club.recaudacion_historica_cent (taquilla y abonos de las 5 últimas temporadas; 4.4, carga en 15.2)
```

  La ley habla de recaudación media; la suma de 5 temporadas da la misma proporción. El tope del 20 % y el mínimo del 2 % por club del art. 5.3.b.2.º no se modelan en la versión base [D].

- `c_i` = contribución televisiva: proporción del club en la generación de ingresos televisivos, medida con audiencia y valor de emisión de sus partidos. En el juego, se calcula con audiencia simulada:

```
c_i = (audiencia_i × factor_partido_i) / Σ_j (audiencia_j × factor_partido_j)
```

- `audiencia_i` [D] = `(0,5 + R_i / 100) × 0,5 × aforo_medio_i`, con `R_i` la reputación del club (4.4) y `aforo_medio_i` la media de `asistencia_partido` de sus partidos de local en la temporada anterior (9.6). En la primera temporada, `aforo_medio_i` es la demanda media del club (8.2). El factor (0,5 + R/100) va de 0,5 a 1,5. Precisión [D] (v0.8): `aforo_medio_i` es `Club.aforo_medio_anterior` (4.4); en la carga, la `asistencia_partido` de 8.2 con `f_resultados`, `f_rival`, `f_precio` y `f_estacional` iguales a 1 y el aforo de la carga. Para un club ascendido, su media en Segunda.
- `factor_partido_i` [D] = 1,0 por defecto; 1,2 si `ciudad_grande` (4.4) es verdadero; 1,5 si la reputación es ≥ 85. Si se cumplen las dos condiciones, se toma 1,5.

**Aplicación del límite de dispersión** (6.9.1) [D en el procedimiento]: se aplica por construcción, con un procedimiento cerrado que siempre cumple el límite:

```
1. Se calcula el reparto bruto reparto_bruto_i con la fórmula anterior.
2. Se busca L > 0 tal que Σ clamp(reparto_bruto_i, L, L_disp × L) = P.
   (Búsqueda por bisección; la función es monótona en L.)
3. reparto_i = clamp(reparto_bruto_i, L, L_disp × L).
```

Precisión numérica [D] (v0.8): bisección sobre L en [0, P / n_clubes], hasta que |Σ − P| < 1 céntimo o 100 iteraciones. Después se redondea cada `reparto_i` a céntimo por el método del mayor resto (4.1), de modo que la suma es exactamente el pool. Si después del redondeo la razón máximo/mínimo supera `L_disp` por un céntimo, se acepta: el criterio 5 de 14.9 se comprueba con tolerancia de 1 céntimo.

Como todos los valores quedan en [L, L_disp × L], la relación máximo/mínimo es como mucho `L_disp` en el 100 % de los casos, y el reparto suma exactamente el pool. Con el modelo legal el límite rara vez actúa: con implantación igual para todos (1/20) y posiciones 1 a 20 en las 5 temporadas, la razón es 0,08 / 0,038125 = 2,10; con implantación del 15 % en el primero y del 2 % en el último, 3,43 [D] (calc_v09/check.py).

Ejemplo de comprobación del procedimiento [D] (v0.9): pool de Primera de 1.288,908 M€ y repartos brutos proporcionales a 1, 2, …, 20. L = 28,6424 M€ y 3,5 × L = 100,2484 M€; los clubes 1 a 4 cobran 28,6424 M€, los 17 a 20 cobran 100,2484 M€ y la suma es 1.288,908 M€ exactos.

**Nombres en el resto del documento**: `reparto_av_i` es el reparto del pool audiovisual (nacional más internacional), `reparto_digital_i` el del digital y `reparto_com_i` el de comercialización.

**Club de referencia de 14.8** [D] (v0.9): posición 10.ª en las 5 temporadas de historial (el objetivo de posición de un club con R = 60, 9.3) e implantación media (`T_i / Σ T` = `c_i` = 1/20, por tanto `m_i` = 1/20). Fracción de cada pool: 0,025 + 0,25 × 0,0275 + 0,25 × 0,05 = 0,044375. Audiovisual: 1.288,908 × 0,044375 = 57,1953 M€ (57.195.292,50 €); digital: 1,775 M€; comercialización: 63,2810 M€ (63.280.968,75 €). El límite no actúa en este caso. Un club con exactamente 1/20 de cada pool cobraría 64,4454 M€, 2,0 M€ y 71,3025 M€.

#### 6.9.3 Fórmula en Segunda

Mismo marco legal que 6.9.2, con los parámetros de Segunda del art. 5.3 (decisión 30) y la posición de la temporada anterior (decisión 34, B-4):

- **Fondo de compensación** (solo pool audiovisual): 2,5 % del pool audiovisual de Segunda para los clubes descendidos de Primera la temporada anterior [C: 2,5 %, art. 6.1; D: base y reparto, se mantiene el de v0.8]. Se reparte entre ellos en proporción a `peso_primera(p) = 2 − 1,5 × (p − 1) / 19` según su posición en Primera. Si no hay descendidos identificables (temporada 2026/27 de la carga), el fondo se suma a `pool_resto`. Comercialización y digital no tienen fondo.
- `pool_resto` = 0,975 × pool en el audiovisual; el pool completo en comercialización y digital.
- **Parte igual**: 70 % de `pool_resto` a partes iguales entre los 22 clubes [C: mínimo legal del 70 % en Segunda, art. 5.3.a; D: se usa el mínimo, decisión de producto 45]. En v0.8 era el 60 %, por debajo del mínimo legal.
- **Resultados**: 15 % de `pool_resto`, por `peso_pos(p) = 2 − 1,5 × (p − 1) / 21` (p = 1 a 22, de 2,0 a 0,5), es decir `0,15 × pool_resto × peso_pos(p) / Σ peso_pos` (Σ = 27,5). En Segunda solo cuenta la última temporada [C, art. 5.3.b.1.º]; la escala `peso_pos` es [D], porque la ley ajusta la escala de Primera a 22 equipos sin fórmula en la parte leída de la fuente.
- **Implantación social**: 15 % de `pool_resto` por `m_i` (6.9.2), con `T_i` y `c_i` calculados solo entre los 22 clubes de Segunda [D].
- **Límite de dispersión**: `L_disp` de 6.9.1, con el procedimiento de 6.9.2 aplicado a `pool_resto`; el fondo se suma después y no entra en el ajuste [D].
- **Posición `p`** [D] (v0.9, B-4): el reparto se calcula en la semana 52 anterior (6.2.4) con la clasificación final de la temporada t − 1 de Segunda, ordenada así: los 3 descendidos de Primera ocupan los puestos 1 a 3 en su orden de Primera; los 16 clubes que siguen en Segunda, los puestos 4 a 19 en su orden final; los clubes de reserva (T), los puestos 20 a 22 por `reputacion` descendente y `codigo` ascendente. En 2026/27, orden por `reputacion` descendente y `codigo` ascendente.

Ejemplo de comprobación [D] (v0.9), pool audiovisual de Segunda de 143,212 M€ con descensos de Primera en 18.º, 19.º y 20.º e implantación igual para todos (1/22): fondo 3,5803 M€, repartido en 1,3562, 1,1934 y 1,0307 M€ (pesos 0,658, 0,579 y 0,500); `pool_resto` 139,6317 M€; parte igual 97,7422 M€ (4,4428 M€ por club); resultados 20,9448 M€; implantación 20,9448 M€. Total del 1.º: 6,9181 M€; del 22.º: 5,7757 M€ (razón 1,20). Suma de los 22 más el fondo: 143,212 M€. En 2026/27, sin descendidos identificables: 1.º 7,0955 M€ y 22.º 5,9238 M€. Comercialización de Segunda (158,45 M€, sin fondo, mismo orden): 1.º 7,8505 M€ y 22.º 6,5541 M€ (media 7,2023 M€).

- Descenso y ascenso: ver 15.6.

**Premios de clasificación en Segunda** [D]: ver tabla 6.9.4.

#### 6.9.4 Premios por posición (propuesta de juego)

| Posición final | Premio por posición (M€, Primera) [D] | Premio por posición (M€, Segunda) [D] | Efecto |
|---|---|---|---|
| 1 | 6,0 | 2,0 | Campeón de liga (Primera); ascenso directo (Segunda) |
| 2 | 4,0 | 1,4 | Ascenso directo (Segunda) |
| 3 a 4 | 4,0 | 1,0 | Primera: 2.ª a 4.ª. Segunda: plazas de promoción (3.ª a 6.ª) |
| 5 a 6 | 2,5 | 1,0 | Segunda: plazas de promoción |
| 7 a 10 | 2,5 | 0,6 | |
| 11 a 16 | 1,2 | 0,6 | |
| 17 | 0,6 | 0,4 | Primera: permanencia directa (ver 15.6). Segunda: fuera de descenso |
| 18 a 19 | 0,3 | 0,4 | Primera: descenso (ver 15.6). Segunda: fuera de descenso |
| 20 | 0,3 | 0,3 | Primera: descenso. Segunda: descenso a Tercera (ver 15.6) |
| 21 a 22 | — | 0,3 | Segunda: descenso a Tercera (ver 15.6) |

Premio de liga [D]: los importes de la columna Primera se cobran en la semana 1 de la temporada siguiente (6.5). Premio de ascenso [D]: 3,0 M€ adicionales al club que asciende a Primera. Se paga en el primer tick de julio de la temporada siguiente (semana 1). El premio de permanencia de Primera está en 6.6.3 y es aparte.

Las cifras son propuestas de equilibrio y no reflejan ningún dato real. Ver 14. Las posiciones de la tabla cubren todas las posiciones de Primera (1 a 20) y de Segunda (1 a 22).

#### 6.9.5 Comparativa con la referencia [NV, P-02; contrastada en parte con S-16 en v0.9]

Los clubes de referencia se citan solo por grupo. El juego no usa nombres reales (sección 18).

| Grupo de referencia (2024/25) | Reparto aproximado [NV, P-02] | Observación |
|---|---|---|
| Dos clubes de referencia máxima | Más de 155 M€ cada uno | Máximo |
| Club de referencia alta | Más de 108 M€ | |
| Club de referencia media-alta | Unos 68 M€ | |
| Grupo intermedio | 55 M€ a 90 M€ | |
| Grupo bajo | 40 M€ a 50 M€ | |

Precisión de v0.9 [E, S-16]: son cifras del reparto audiovisual por club, sin comercialización. En 2024/25 el máximo fue de 157,92 M€ y solo un club de Primera quedó por debajo de 40 M€; la razón supera 3,5 porque el límite del art. 5.5 se calcula con el fondo de compensación y otros ingresos comerciales incluidos. En el juego, el audiovisual de cada club sale del pool de Primera de 1.288,908 M€ con 6.9.2; el club de referencia (posición 10.ª, implantación media) cobra 57,20 M€, dentro del grupo intermedio. La comercialización (6.2.6) y el digital (6.2.5) se reparten aparte.

### 6.10 Reglas de cobro y pago

1. Todo pago se intenta en su semana prevista. Si no hay saldo, entra en descubierto (6.11).
2. Un ingreso previsto nunca se adelanta. Si el club cumple las condiciones de un cobro (por ejemplo, un objetivo), el cobro se produce en la semana siguiente a la evaluación.
3. Los impuestos y las cuotas de préstamo tienen prioridad sobre otros pagos de la semana.
4. El orden de pago dentro de una semana es: préstamos e impuestos, seguros, salarios, personal, honorarios, obras, primas, resto (6.5; impuestos al orden 1.º en v0.8 para cumplir el punto 3).
5. Si una cuenta supera el descubierto, el sistema bloquea la siguiente operación de fichaje, ampliación de obra o contratación de préstamo hasta regularizar.
6. Los movimientos pendientes en `previsto` no cuentan para el saldo real, pero sí para la proyección.

### 6.11 Descubierto y falta de liquidez

- Descubierto permitido: `descubierto_limite` (4.4), [D] 20 M€ Primera; 5 M€ Segunda.
- Interés del descubierto: 8 % anual sobre el importe utilizado, liquidado en el primer tick del mes siguiente, sobre el saldo de cierre del mes anterior (5.2 y 6.5) [D]. Interés mensual = `importe_descubierto × 0,08 / 12`, con `importe_descubierto = max(0, −saldo)` y `saldo` el de después del paso 9 del último tick del mes [D] (v0.8).
- Si el descubierto supera el límite al cierre de mes: aplicar sanción (10.2) y bloquear fichajes hasta regularizar.
- Venta forzosa [D] (v0.9, B-1; cierra A-11): en el 2.º cierre de mes seguido con el descubierto por encima del límite, aviso de venta forzosa; en el 3.º cierre seguido, venta automática del jugador de mayor salario entre los vendibles, al precio de venta al sistema de 13.3 (`valor_mercado × min(1,0; 0,6 + 0,1 × anios_restantes)`), aunque la ventana esté cerrada. El contador vuelve a 0 con el primer cierre dentro del límite; tras una venta forzosa, empieza de nuevo. Un jugador es vendible si tiene `Contrato.estado = vigente` y `cesion_id` nulo. Empate de salario: menor `codigo`.

### 6.12 Ejemplo de flujo mensual (ilustrativo)

Club de referencia de Primera (posición 10.ª e implantación media, 6.9.2 y 14.8) con los siguientes datos en agosto:

| Concepto | Importe (M€) |
|---|---|
| Saldo inicial (0,25 M€ × R, 15.5) | 15,0 |
| Derechos audiovisuales, nacional e internacional (1 tramo de 10 de 57,1953 M€, 6.9.2) | +5,72 |
| Derechos digitales (1/12 de 1,775 M€, 6.2.5) | +0,15 |
| Patrocinio (1/10 de 23 M€ × multiplicador 1,00 con R = 60, sin naming, 8.3) | +2,3 |
| Salarios (1/12 de 60 M€) | −5,0 |
| Personal (1/12 de 8 M€) | −0,67 |
| Mantenimiento de estadio (1/12 de 2,568 M€, 6.3.8) | −0,21 |
| Amortización (no sale de caja) | 0,0 |
| Préstamos | 0,0 (no hay préstamo en el ejemplo) |
| Impuesto de tesorería (desactivado) | 0,0 |
| Taquilla (1 partido local en agosto, 6.2.1 y 8.2) | +0,67 |
| Saldo final de agosto | 18,0 |

Cálculo de la taquilla con las fórmulas del documento (mismos valores que el ejemplo de 8.2): aforo disponible 42.800; `R = 60`, `f_reputacion = 1,06`; `f_aficion = 1,02` con `aficion_moral = 60`; `f_fans = 1,02` con `fans_activos = 25.680` (0,6 × aforo); resto de factores 1,00. Demanda = 0,80 × 42.800 × 1,06 × 1,02 × 1,02 = 37.761 espectadores (37.760,7), menor que el máximo de 38.110 (42.800 × 0,890421, con los valores de 4.6 y la fórmula de 8.2). La asistencia es 37.761 (ocupación 0,8823). Abonados asistentes = 60 % × 42.800 × 0,85 = 21.828. Plazas de palco vendidas = 95 × 10 = 950 (6.2.1 y 6.2.3). Taquilla vendida = 37.761 − 21.828 − 950 = 14.983 localidades, a 45 €, es decir 674.235 € (0,67 M€). Los ingresos de palcos y de restauración de día de partido (6.2.3 y 8.5) se omiten en el ejemplo.

Nota: los abonos y la comercialización no aparecen en agosto porque se cobran en julio y enero (6.5). El patrocinio de agosto es el primer tramo de los diez mensuales.

Omitidos por no estar en el ejemplo: honorarios del entrenador, primas de seguro, palcos, hospitality, restauración de día de partido, tienda de día, tienda online, royalty de camisetas, museo y tours, cafeterías, obras y gasto de césped. Por eso el saldo es orientativo. El ejemplo sí incluye los derechos digitales de 6.2.5. El mantenimiento supone `antiguedad_anios = 0` (6.3.8). Saldo sin redondear las filas: 17,961 M€ (17.961.014,25 €); con las filas redondeadas, 17,96 M€; en los dos casos, 18,0 M€ [D] (v0.9; 19,8 M€ en v0.8, con 1/20 de cada pool, 990 + 500 M€ de audiovisual solo de Primera y taquilla sin descontar palcos).

Este ejemplo solo ilustra el mecanismo. No es un presupuesto de club.

---

## 7. Estadio y obras

### 7.1 Estructura del estadio

Un estadio se compone de secciones (4.6). El aforo total es la suma de plazas de las secciones que cuentan como localidades de venta (`grada_general`, `grada_preferente`, `grada_fondo`, `palcos`, `zona_vip`). Las secciones `hospitality`, `museo`, `tienda_fisica`, `restauracion`, `zona_eventos` y `aparcamiento` no cuentan como aforo.

**Estadio inicial de referencia** [D] (ver 14.4):

| Sección | Plazas | Notas |
|---|---|---|
| grada_general | 18.000 | |
| grada_preferente | 14.000 | |
| grada_fondo | 9.000 | |
| palcos | 1.200 | Palcos de 10 plazas: 120 palcos. |
| zona_vip | 600 | |
| hospitality | 500 | Por partido. |
| museo | 1 | Espacio (sin aforo). |
| tienda_fisica | 1 | Espacio. |
| restauracion | 1 | Cafetería inicial. |
| aparcamiento | 1 | |

Aforo total de localidades: 42.800 [D].

Equipamiento del estadio de referencia [D] (v0.8): `pantalla_led = true` (la zona `estadio_led` forma parte de los 23 M€ de patrocinio de 8.3 y 14.8), `cesped_calefactado = false`, `cubierta = false`, `insonorizacion_nivel = 0`, `cafeterias_numero = 1`, `antiguedad_anios = 0` (6.12).

Escalado a otros aforos (15.5) [D] (v0.8): `plazas_i = round(plazas_ref_i × aforo / 42.800)` para las secciones de localidades y para `hospitality`; `palcos` se redondea al múltiplo de 10 más próximo; la diferencia de redondeo se ajusta en `grada_general` para que la suma sea exactamente el aforo. Las secciones de espacio (`museo`, `tienda_fisica`, `restauracion`, `aparcamiento`) mantienen `plazas = 1`.

### 7.2 Tipos de obra

Para cada obra: coste, duración, efecto en aforo, efecto en ingresos y mantenimiento.

| Tipo | Coste base [D] | Duración (semanas) [D] | Efecto en aforo | Efecto en ingresos | Mantenimiento anual [D] |
|---|---|---|---|---|---|
| ampliar_grada_general | 12.000 € por plaza nueva | 40 | +plazas (hasta 6.000) | +taquilla y abonos proporcionales | 25 € por plaza |
| ampliar_preferente | 18.000 € por plaza nueva | 40 | +plazas (hasta 4.000) | Taquilla más precio medio | 30 € por plaza |
| construir_palcos | 60.000 € por palco | 30 | +10 plazas por palco | Ingresos de palcos (6.2.3) | 2.000 € por palco |
| construir_hospitality | 2,5 M€ por zona | 24 | No aforo | Hospitality por partido | 120.000 € por zona |
| construir_museo | 4 M€ | 36 | No aforo | Visitas anuales (8.4) | 300.000 € |
| tienda_fisica | 1,2 M€ | 16 | No aforo | Merchandising (8.1) | 150.000 € |
| nueva_cafeteria | 0,6 M€ | 12 | No aforo | Restauración (8.5) | 60.000 € |
| cubierta_gradas | 45 M€ | 80 | Ningún cambio de aforo | Permite eventos con cubierta y reduce cancelaciones | 0,4 M€ |
| insonorizacion_nivel_1 | 2 M€ | 20 | No aforo | Habilita eventos de nivel 1 | 50.000 € |
| insonorizacion_nivel_2 | 6 M€ | 36 | No aforo | Habilita eventos de nivel 2 | 120.000 € |
| insonorizacion_nivel_3 | 12 M€ | 52 | No aforo | Habilita eventos de nivel 3 | 200.000 € |
| cesped_calefactado | 3 M€ | 16 | No aforo | Reduce deterioro de césped | 150.000 € |
| pantalla_led | 1,5 M€ | 12 | No aforo | Patrocinio estadio_led (8.3) | 80.000 € |
| aparcamiento | 3 M€ | 30 | No aforo | Ingreso de aparcamiento: 10 € por vehículo por partido, con 1.500 plazas (v0.9) | 80.000 € |
| reforma_general (7.7, v0.9) | 0,5 × aforo_total × 12.000 € | 104 | Bloquea el 25 % del aforo durante la obra | `antiguedad_anios` = 0 al terminar | Sin mantenimiento propio |

Los costes de referencia se derivan de magnitudes generales y no de datos de un club concreto. Un coste de reforma de un estadio de referencia [NV] (unos 1.408 M€, según prensa; fuente S-08 localizada, no leída en detalle) no se usa como coste por plaza porque incluye conceptos ajenos al juego (ver 17.2, punto 6).

**Efecto de aforo en la demanda**: el nuevo aforo se incorpora en la temporada siguiente a la finalización. Una obra que termina en mitad de temporada aplica el aforo desde la siguiente jornada de local. [D] Lectura única [D] (v0.8; las dos frases se contradecían): el aforo físico (`aforo_disponible_hoy`, tope de asistencia y demanda de 8.2) cambia desde la siguiente jornada de local tras el fin de la obra; lo que depende de `aforo_total` al inicio de temporada (`abonos_objetivo`, `n_vallas`, `fans_activos`, `seguidores_club`) se recalcula en la semana 1 de la temporada siguiente.

**Requisitos y efectos de cada obra** [D] (v0.8):

- Al terminar una obra con aforo, `aforo_delta` se suma a `plazas` de la sección correspondiente (`grada_general`, `grada_preferente` o `palcos`). Si la sección no existe, se crea con la `ocupacion_maxima` de 4.6.
- `construir_hospitality` suma 250 plazas por zona (`unidades`) a la sección `hospitality` [D] (v0.9, B-6).
- `construir_palcos`: como máximo 30 palcos por obra (`unidades` ≤ 30) [D] (v0.9, B-6).
- `construir_museo` y `tienda_fisica`: solo si el estadio no tiene esa sección; al terminar la crean con `plazas = 1`.
- `nueva_cafeteria`: solo si `cafeterias_numero < cafeterias_max`; al terminar suma 1.
- `cubierta_gradas`, `cesped_calefactado` y `pantalla_led`: una vez por estadio; al terminar ponen a verdadero el campo de 4.5.
- `insonorizacion_nivel_n`: exige `insonorizacion_nivel = n − 1`; al terminar lo pone a n. El mantenimiento anual del nivel nuevo sustituye al del anterior (no se suman).
- `aparcamiento`: una vez por estadio. Al terminar, la sección `aparcamiento` pasa a 1.500 plazas. Ingreso por partido de local [D] (v0.9, B-6): `min(1.500, round(0,10 × asistencia_partido)) × 10 €` (club de referencia con la obra: 3.776 vehículos posibles, tope 1.500, 15.000 € por partido y 285.000 € por temporada). La sección `aparcamiento` de la carga (plazas 1) no genera ingreso.
- `reforma_general`: solo con `antiguedad_anios ≥ 50` (7.7).

### 7.3 Ejecución y pago de obras

- Un estadio puede tener hasta `obras_activas_max` obras en curso (4.5). [D] 3 por defecto.
- Coste pagado en cuotas semanales: `cuota_semanal = coste_total / semanas_duracion`.
- Durante la obra, las localidades afectadas quedan bloqueadas (`bloqueo_aforo`, 4.7). Una ampliación (`ampliar_grada_general`, `ampliar_preferente` o `construir_palcos`) bloquea solo el 10 % de las plazas de su sección al empezar [D] (v0.9, B-6; antes toda la sección): 1.800 plazas en la general del estadio de referencia. La reforma general bloquea el 25 % del aforo total (10.700 plazas en el estadio de referencia). El resto de obras no bloquea localidades. Comprobación (calc_v09/check.py): con el bloqueo del 10 % en la general, tope 36.507, asistencia 36.173 y taquilla de 602.775 € por partido (71.460 € menos); con el bloqueo de toda la sección (v0.8), tope 22.082 y asistencia 21.880, por debajo de abonados asistentes más palcos (22.778), así que la taquilla caía a 0 durante toda la obra.
- Si el club no tiene saldo para una cuota, la obra se suspende y se reanuda al regularizar. Cada semana suspendida suma 1 semana a la duración. [D]
- Una obra puede cancelarse antes de empezar sin coste; cancelada en curso, pierde el 50 % del coste pagado. [D]
- Las obras no pueden hacerse en semanas de partido en las secciones que albergan la afición visitante (regla de seguridad) [D]. Simplificación: el sistema evita iniciar obras que bloqueen localidades en la semana de un partido de alta demanda. Regla exacta [D] (v0.8): una obra con `bloqueo_aforo > 0` no empieza en una semana con partido de local cuya demanda prevista (proyección de 6.1) sea mayor o igual que el tope de asistencia de 8.2; empieza la primera semana siguiente que no cumpla esa condición. Una vez empezada, no se interrumpe por esta regla.
- Cada semana con la obra en curso y la cuota pagada suma 1 a `semanas_pagadas`; al llegar a `semanas_duracion`, la obra pasa a `finalizada` en el paso 8 del tick [D] (v0.8).

### 7.4 Capacidad resultante y reglas de aforo

- `aforo_total` = Σ plazas de secciones que cuentan (7.1). Las obras finalizadas ya están incluidas, porque su `aforo_delta` se suma a `plazas` al terminar (7.2) [D] (v0.8; antes se sumaba `aforo_delta` aparte, lo que dejaba fuera de `ocupacion_max_global` las plazas nuevas).
- `aforo_disponible_hoy` = `aforo_total − Σ bloqueo_aforo` de obras en curso − localidades bloqueadas por evento.
- Límite máximo por tipo de sección: `ocupacion_maxima` (4.6) [D]: grada_general 0,95; grada_preferente 0,80; grada_fondo 0,90; palcos 0,95; zona_vip 0,95 (decisión de producto 10).
- Aforo mínimo de seguridad: 5.000 localidades. Si el aforo disponible es inferior, no se puede jugar en casa y el sistema pide trasladar el partido. [D]

### 7.5 Ocupación en partido local

Ver 8.2 para el modelo de demanda. Resumen: `ocupacion = asistencia_partido / aforo_disponible`, donde `asistencia_partido` sale de la fórmula única de 8.2. No hay otra fórmula de ocupación en el documento.

### 7.6 Mantenimiento y césped

- `cesped_estado` ∈ [0, 100]. Empieza en 90 cada temporada [D].
- Desgaste por partido local: −1,5 puntos [D]. Por partido de visita: −0,5 [D].
- Desgaste por concierto: −8 puntos (sin césped calefactado) o −4 (con césped calefactado) [D]. Ver 8.6.
- Recuperación semanal: +2 puntos, con tope 100 [D]. Con césped calefactado, +3.
- Reposición de césped: coste fijo 200.000 € cuando `cesped_estado < 40` [D]. Se ejecuta en el primer tick en que se cumple la condición. Se paga en la semana siguiente como gasto de mantenimiento (categoría `mantenimiento`, orden "resto" en 6.5), y restaura 100 puntos [D]. Precisión [D] (v0.8): "restaura 100 puntos" = `cesped_estado = 100` en el tick del pago. Orden en el paso 8 de 5.2: desgaste de partidos y eventos de la semana, recuperación semanal, tope 100 y comprobación de `< 40`. Mientras haya una reposición pendiente no se crea otra.
- Si `cesped_estado < 20` en un partido local, el partido se juega en otro estadio. El sistema lo registra y aplica una pérdida de reputación del club de −2 [D].
- La reposición de césped tiene coste de caja y es el gasto de mantenimiento que el jugador percibe como "obligatorio" [NV].

### 7.7 Antigüedad y reformas

- La antigüedad del estadio aumenta el coste de mantenimiento: `mantenimiento_base × (1 + 0,01 × antiguedad_anios)` [D].
- A partir de 50 años de antigüedad, el club puede pedir una reforma general (`reforma_general`, 7.2), con coste de 0,5 × aforo × 12.000 € [D]. Duración 104 semanas, bloqueo del 25 % del aforo durante la obra y `antiguedad_anios` = 0 al terminar [D] (v0.9, B-6).

---

## 8. Monetización moderna del estadio y del club

### 8.1 Merchandising

**Tienda física**:

```
ingreso_tienda_fisica_dia = visitantes_tienda_dia × tasa_conversion × ticket_medio
```

- `visitantes_tienda_dia` = `asistencia_partido × 0,15` en día de partido [D] (`asistencia_partido` de 8.2).
- `tasa_conversion` [D] = 0,12 en día de partido; 0,04 fuera de día de partido.
- Fuera de día de partido [D] (v1.0, decisión 42, B-5c): `visitantes_tienda_mes = visitas_museo_mes + visitas_tour_mes`, con `visitas_museo_mes = visitas_museo_anio × multiplicador_m / 12,2` (0 sin sección `museo`) y `visitas_tour_mes = visitas_tour_dia × 300 × multiplicador_m / 12,2`, con los multiplicadores de 8.4. `ingreso_tienda_fuera_mes = visitantes_tienda_mes × 0,04 × 35 €`, cobrado el primer tick del mes m (6.5). No se aplica además la estacionalidad de la tienda (ya va en las visitas). Club de referencia: (95.400 + 12.900) × 0,04 × 35 € = 151.620 € al año; julio y agosto 17.399,02 €; diciembre y enero 8.699,51 €; resto de meses 12.427,87 €, y junio 12.427,85 € (absorbe el redondeo, 4.1).
- `ticket_medio` [D] = 35 €.
- Estacionalidad mensual (multiplicador): julio 1,3; agosto 1,2; septiembre 1,0; octubre y noviembre 1,0; diciembre 1,3; enero 0,9; febrero a junio 0,8. [D] En la tienda de día se aplica el multiplicador del mes del partido [D] (v0.8). La estimación de temporada de más abajo lo omite como aproximación.
- Requisito: sección `tienda_fisica` activa; sin ella, el ingreso es 0 [D] (v0.8). Cobro en la fila de matchday de 6.5.

**Tienda online**:

```
ingreso_online_mes = sesiones_mes × tasa_conversion_online × ticket_medio_online
```

- `sesiones_mes` [D] = `seguidores_club × 1,2`.
- `tasa_conversion_online` [D] = 0,012.
- `ticket_medio_online` [D] = 48 €.
- Multiplicador estacional igual que la tienda física.

**Base de seguidores**: se usa `seguidores_club` (4.4), no `fans_activos`. Valor inicial [D] = `aforo_total × 0,6 + reputacion × 8.000` (v0.5). Con reputación 60, la base es 505.680 seguidores. Se recalcula al inicio de temporada. `fans_activos` (aficionados de estadio) no interviene en tienda ni en camisetas.

**Cambio v0.5 [D] (decisión 27)**: el merchandising sube al 2 % a 3 % del ingreso total. Con 1.000 por punto de reputación, la base era de 85.680 seguidores y el merchandising estimado de 1,33 M€ (0,5 %). El ajuste está en el coeficiente de la base, porque tienda online y camisetas dependen de ella. Como alternativa, con la base de 1.000 por punto y subiendo solo la conversión online y el ticket medio online ×2,5 cada uno, el merchandising daría unos 4,97 M€ (≈2 % de 250 M€). No se usa, porque exige mover dos parámetros de mercado sin fuente. Calibrar con la simulación (14.9, criterio 8).

**Camisetas (royalty del proveedor)**:

```
unidades_camiseta_temporada = seguidores_club × tasa_compra_anual_camiseta × multiplicador_kit
ingreso_camisetas = unidades × precio_neto_camiseta × royalty_club
```

- `tasa_compra_anual_camiseta` [D] = 0,30.
- `multiplicador_kit` = 1,5 en la temporada de cambio de equipación; 1,0 en otras. [D] Se cambia cada dos temporadas. Temporadas de cambio [D] (v0.8): las de `(anio_inicio − 2026)` impar (2027/28, 2029/30…). La partida base 2026/27 es temporada normal, como la estimación de 14.8.
- `seguidores_club` es el de la semana 1 de la temporada; `ingreso_camisetas` se calcula una vez en la semana 1 y se cobra en 12 mensualidades (6.5) [D] (v0.8).
- `precio_neto_camiseta` [D] = 60 €.
- `royalty_club` [D] = 0,12.

**Estimación de temporada (v0.5)** [D]. Club de referencia: aforo 42.800, `R = 60`, 19 partidos de local, asistencia de 8.2 (37.761). La tienda de día se calcula sin multiplicador estacional, como aproximación.

| Partida | Cálculo | Importe |
|---|---|---|
| Tienda física, día de partido | 19 × 37.761 × 0,15 × 0,12 × 35 € | 0,45 M€ |
| Tienda online | 505.680 × 1,2 × 0,012 × 48 € × 11,7 (suma de multiplicadores mensuales) | 4,09 M€ |
| Camisetas, temporada normal | 505.680 × 0,30 × 60 € × 0,12 | 1,09 M€ |
| Tienda física, fuera de día de partido (v1.0, B-5c) | (95.400 + 12.900) × 0,04 × 35 € | 0,15 M€ |
| **Total, temporada normal** | | **5,79 M€** (5.785.342 €): 2,61 % del cierre de 14.8 (221,62 M€) |
| Total, temporada de cambio de equipación (camisetas × 1,5) | | 6,33 M€ (6.331.477 €): 2,85 % del cierre de 14.8 con esas camisetas (222,16 M€) |

Ambos totales están dentro de 2 % a 3 % con el cierre de 14.8 de v1.0 (221 M€) [D].

### 8.2 Demanda, precio y ocupación

**Demanda base del partido**:

```
demanda = demanda_base_division
        × f_reputacion
        × f_resultados
        × f_rival
        × f_precio
        × f_estacional
        × f_aficion
        × f_fans
```

La fórmula incluye `f_aficion` y `f_fans` (tabla siguiente). `f_fans` se añade en la versión 0.5 (decisión 26).

Componentes:

| Factor | Definición | Valor [D] |
|---|---|---|
| demanda_base_division | Demanda base de asistencia total del partido (abonados incluidos), sin precio ni otros factores. (v0.8: antes decía "localidades de taquilla", en contra de 6.2.1, que resta los abonados después.) | Primera: 0,80 × aforo_disponible. Segunda: 0,65 × aforo_disponible. |
| f_reputacion | Función de la reputación del club R ∈ [0, 100]. | 0,70 + 0,006 × R (rango 0,70 a 1,30) |
| f_resultados | Factor de situación: posición × racha, multiplicativo (decisión de producto 9). | `f_resultados = f_posicion × f_racha`. `f_posicion = 1 + 0,10 × (pos_rel − 0,5)`, con `pos_rel = (N − pos) / (N − 1)` (1 = primero, 0 = último); rango 0,95 a 1,05. `f_racha = 1 + 0,05 × racha`, con `racha` ∈ {−1, 0, +1} (5.5.4); rango 0,95 a 1,05. Producto: rango 0,9025 a 1,1025. La racha también afecta a la moral de afición (5.5.4). |
| f_rival | Atractivo del rival. | `0,95 + 0,20 × R_rival / 100` (rango 0,95 a 1,15). |
| f_precio | Elasticidad al precio. | `(p / p_ref)^(−ε)`, con ε = 1,2 y `p_ref` = precio medio de taquilla de referencia de la división (45 € Primera; 22 € Segunda) [D]. `p` en [0,5 × p_ref, 2,0 × p_ref] (4.4, B-5): rango de 0,435 a 2,297. |
| f_estacional | Mes del partido. | Enero y febrero 0,95; marzo a mayo 1,05; resto de meses 1,00 [D]. |
| f_aficion | Moral de la afición (5.5.4). | `0,90 + 0,002 × aficion_moral` (rango 0,90 a 1,10). [D] |
| f_fans | Base de aficionados de estadio (`fans_activos`, 4.4) sobre el aforo total. | `f_fans = clamp(1 + 0,20 × (fans_activos / aforo_total − 0,5), 0,90, 1,10)`. Neutro (1,00) con base igual a la mitad del aforo. Peso 0,20 por unidad de la razón. Rango 0,90 a 1,10. [D] |

Nota de `f_resultados`: la posición es la de la clasificación de la simulación (5.5.4). No depende de ningún módulo externo. Momento [D] (v0.8): se usan la posición y la racha previas al partido (tras la jornada anterior). En la jornada 1, `f_posicion = 1` y `racha = 0`. `N` es `num_equipos` de la competición. En la promoción de Segunda se usa la posición final de liga.

Notas de cálculo [D] (v0.8): `p` de `f_precio` es `Club.precio_taquilla_cent` del club local; `R_rival` es la reputación del visitante; `f_estacional` es el del mes del partido según 5.1.1; `f_reputacion` es el mismo factor en 8.2, 8.4 y 8.6.3. La demanda se calcula para todos los clubes de las dos divisiones, porque alimenta `T_i` y `aforo_medio_i` de 6.9.2.

**Aficionados de estadio (`fans_activos`, factor `f_fans`)** [D]: base de aficionados de estadio (4.4), usada solo para asistencia y ocupación. No interviene en merchandising ni en derechos digitales.

- Peso: 0,20 por unidad de la razón `fans_activos / aforo_total`. Por encima de la mitad del aforo, el factor sube; por debajo, baja.
- Rango: 0,90 a 1,10 (acotado). Una base igual al aforo da el máximo.
- Valor inicial y recálculo al inicio de temporada [D]: `fans_activos = aforo_total × 0,6`. En la versión base no tiene dinámica propia; cerrado en A-23.

**Ejemplo (valores de 6.12)**: aforo disponible 42.800; `R = 60` (`f_reputacion` = 1,06); `aficion_moral = 60` (`f_aficion` = 1,02); `fans_activos` = 25.680, razón 0,6 (`f_fans` = 1 + 0,20 × 0,1 = 1,02). Resto de factores 1,00: `f_resultados` (posición media, racha 0), `f_rival` (R rival 25), `f_precio` (45 €) y `f_estacional` (agosto). Demanda = 0,80 × 42.800 × 1,06 × 1,02 × 1,02 = 37.760,7. Tope = 38.110. Asistencia = 37.761 (ocupación 0,8823). El tope solo se alcanza si el producto de factores supera 1,113 (38.110 / 34.240).

**Fórmula única de ocupación** [D]. Es la única fórmula de ocupación del documento. 6.2.1 y 7.5 la usan:

```
ocupacion_max_global = Σ_secciones(plazas × ocupacion_maxima) / Σ_secciones(plazas)
                       (solo secciones que cuentan como localidades, 7.1)
asistencia_partido   = min(aforo_disponible × ocupacion_max_global, demanda)
ocupacion            = asistencia_partido / aforo_disponible        (en [0, 1])
```

Nota: `ocupacion_maxima` de `grada_preferente` (0,80) y de `zona_vip` (0,95) se fija por decisión de producto 10 (4.6). Con los pesos de 7.1, la ocupación máxima global de Primera es 0,8904 (38.110 plazas de 42.800).

`demanda` es la demanda base del partido multiplicada por los factores de la tabla. La asistencia incluye a los abonados que acuden (`abonados_asistentes`, 6.2.2). Para la taquilla se restan de la asistencia (6.2.1). La fórmula sin abonados de la versión 0.1 queda eliminada.

**Ocupación de referencia** [C, S-05]: 84,5 % en Primera y 68,5 % en Segunda en 2024/25 (el 61,7 % de Segunda es de 2023/24). El modelo debe producir una media entre 80 % y 90 % en un club de reputación media de Primera [D] (14.9, criterio 4). Para Segunda, la referencia de 68,5 % (14.4; 75 % [D] en v0.8) se verifica con el criterio 6 de 14.9. Con los factores neutros, un club de Segunda con R = 40 y aforo 18.000 da una demanda de 11.442,3 y una ocupación de 0,6357 (calc_v09/check.py).

### 8.3 Patrocinio por zona

| Zona | Valor de referencia de juego, por temporada (Primera) [D] | Valor (Segunda) [D] | Notas |
|---|---|---|---|
| camiseta_pecho | 12 M€ | 3 M€ | Patrocinador principal. [NV] Referencia de prensa de un club grande: unos 75 M€ anuales (no confirmado). |
| camiseta_manga | 3 M€ | 0,8 M€ | |
| camiseta_espalda | 2 M€ | 0,5 M€ | |
| estadio_fondo | 2 M€ | 0,5 M€ | |
| estadio_led | 1,5 M€ | 0,4 M€ | Requiere pantalla_led. |
| entrenamiento | 1 M€ | 0,3 M€ | |
| digital | 1,5 M€ | 0,4 M€ | |
| naming | 12 M€ | 2 M€ | Naming del estadio. [NV] Referencia de prensa: naming de un estadio grande por unos 20 M€ anuales, otro por 250 a 300 M€ en total durante unos diez años, 2024 a 2033 (ambos no confirmados). |

**Reglas**:

- Total de la tabla sin naming en Primera: 23 M€. Es la base de la fila de patrocinio de 14.8 (4 % a 11 % de ingresos desde v0.9). El naming (12 M€) va en fila propia de 14.8 y no se suma aquí.
- Un patrocinio de camiseta solo se puede firmar una vez por zona en cada temporada.
- Naming: solo un contrato activo. Duración de 3 a 10 años. [D]
- La parte variable (`importe_variable_max`) = 20 % del importe fijo y se cobra si se cumple el objetivo vinculado. [D]
- La reputación del club condiciona el valor de firma: importe = valor de la tabla × multiplicador, con multiplicador = 0,52 + 0,008 × R (rango 0,52 a 1,32) [D] (v0.9, B-5; antes 0,6 + 0,008 × R, que daba 1,08 y 24,84 M€ con R = 60). Con R = 60 el multiplicador es 1,00: el club de referencia mantiene 23 M€ sin naming y 12 M€ de naming (6.12, 14.8).
- Contratos de la carga [D] (v0.9, B-5): un contrato por zona (`estadio_led` solo si `pantalla_led = true`; `naming` en todos los clubes de Primera, a 10 años), por valor de tabla × multiplicador de la reputación inicial, a 3 años (naming, 10), con `forma_cobro = mensual` y parte variable del 20 % ligada al objetivo deportivo (6.2.7).
- Ofertas [D] (v0.9, B-5): al vencer un contrato, el sistema ofrece uno nuevo en esa zona la semana siguiente, por valor de tabla × multiplicador de la reputación vigente, a 3 años y mensual. Si el jugador lo rechaza, llega otra oferta igual 4 semanas después. En Manager, la directiva firma todas las ofertas (9.1). Los clubes no controlados no tienen caja simulada (B-1), así que sus patrocinios no se calculan.
- Comprobación de la suma [D] (v0.8): 12 + 3 + 2 + 2 + 1,5 + 1 + 1,5 = 23 M€; incluye `estadio_led`, que exige `pantalla_led` (7.1).

### 8.4 Museo y tours

```
visitas_museo_anio = visitas_base × f_reputacion × f_turismo
ingreso_museo = visitas_museo_anio × precio_entrada_museo × (1 − porcentaje_descuento)
```

- `visitas_base` [D] = 90.000 anuales en Primera; 25.000 en Segunda.
- `f_turismo` [D] = 1,0 base; 1,2 si `turismo_alto = true` en la ficha del club (4.4).
- `precio_entrada_museo` [D] = 15 €.
- `porcentaje_descuento` [D] = 0,15 de media (bonos, abonados).
- Tours: `visitas_tour_dia = min(50, round(aforo_total / 1.000))` [D]. Precio por tour: 12 €. Solo fuera de días de partido y eventos. Días habilitados: 300 por año [D]. Los 300 días ya descuentan los días de partido y de evento: no se recalculan con el calendario [D] (v0.8). `ingreso_tours = visitas_tour_dia × 12 € × 300` al año (club de referencia: 43 × 12 × 300 = 154.800 €). "Precio por tour" se lee como precio por visitante.
- El museo exige la sección `museo` activa; sin ella `ingreso_museo = 0`. Los tours no la exigen [D] (v0.8). Club de referencia: 90.000 × 1,06 × 1,0 × 15 € × 0,85 = 1.216.350 € al año.

**Estacionalidad**: multiplicador de verano (julio y agosto) 1,4; invierno (diciembre y enero) 0,7. [D] Resto de meses 1,0. Ingreso del mes m (museo y tours) [D] (v0.8): `ingreso_anual × multiplicador_m / 12,2`, siendo 12,2 la suma de los 12 multiplicadores; así el año suma el ingreso anual.

### 8.5 Restauración y cafeterías

**Cafeterías**: 1 inicial; hasta 20 construibles [NV para el límite de 20; D]. Cada una cuesta 0,6 M€ (7.2).

**Ingreso por partido**:

```
ingreso_restauracion_partido = asistentes × gasto_medio_persona × tasa_captacion × margen_club
```

- `asistentes` = asistencia total del partido.
- `gasto_medio_persona` [D] = 8 € en Primera; 6 € en Segunda.
- `tasa_captacion` [D] = `min(0,85; 0,40 × cafeterias_numero^0,6)`. Es la única tasa que entra en la fórmula. Con una cafetería la tasa es 0,40; con dos, 0,61; el tope es 0,85.
- `margen_club` [D] = 0,30 (explotación directa). En la versión base solo existe la explotación directa [D] (v1.0, decisión 43, B-5d; cierra A-12). La concesión con canon queda fuera de alcance como ampliación futura (1.2).
- No hay restauración fuera de día de partido: la fila se eliminó de 6.5 en v1.0 (decisión 42).
- Club de referencia: 37.761 × 8 € × 0,40 × 0,30 = 36.250,56 € por partido; 0,689 M€ en 19 partidos [D] (v0.8, comprobación).

**Hospitality** en restauración: ver 6.2.3.

**Coste de explotación de cafeterías**: 60.000 € anuales por cafetería [D] (7.2). Categoría `explotacion_cafeterias` (6.5), en 12 mensualidades. Es el mismo importe que el mantenimiento de `nueva_cafeteria` en 7.2; se paga una sola vez (6.3.8).

### 8.6 Eventos y conciertos

#### 8.6.1 Tipos de evento

| Tipo | Aforo típico | Nivel de insonorización requerido | Notas |
|---|---|---|---|
| concierto_nivel_1 | 15.000 a 30.000 | 1 | Solo pop y eventos de bajo volumen [D]. |
| concierto_nivel_2 | 30.000 a 50.000 | 2 | Eventos de volumen medio. |
| concierto_nivel_3 | Más de 50.000 | 3 | Grandes espectáculos. |
| evento_corporativo | 2.000 a 10.000 | 0 | Ferias, presentaciones. |
| competicion_no_futbol | 5.000 a 15.000 | 1 | Deportes de sala o competiciones de otros deportes. |

El aforo del evento es propio (4.17) y puede superar el aforo del estadio. El ingreso se calcula sobre el aforo del evento, sin límite por el aforo del estadio (decisión de producto 15). No hay regla `aforo_evento ≤ aforo_disponible`. [D]

**Parámetros del promotor por tipo** [D] (v0.9, B-6). La oferta del promotor (13.5) trae estos valores fijos en `Evento` (4.17); el jugador no fija precio ni aforo:

| Tipo | `aforo_evento` | `precio_medio` | `canon_fijo` | `porcentaje_club` | Días de montaje / desmontaje | Ingreso con R = 60 (8.6.3) |
|---|---|---|---|---|---|---|
| concierto, nivel 1 | 25.000 | 50 € | 0,5 M€ | 0,15 | 5 / 2 | 666.954 € |
| concierto, nivel 2 | 40.000 | 80 € | 1,5 M€ | 0,15 | 5 / 2 | 1.927.402 € (ejemplo de 8.6.3) |
| concierto, nivel 3 | 60.000 | 100 € | 3,0 M€ | 0,15 | 6 / 2 | 3.801.379 € |
| evento_corporativo | 6.000 | 0 € | 0,15 M€ | 0 | 2 / 1 | 150.000 € |
| competicion_no_futbol | 10.000 | 30 € | 0,2 M€ | 0,10 | 3 / 1 | 221.624 € |

El ingreso por evento queda entre 0,15 M€ y 3,80 M€ con R = 60. `competicion_no_futbol` usa `f_tipo` = 0,8, como los eventos corporativos (8.6.5).

#### 8.6.2 Reglas de aforo y calendario

- Máximo de conciertos por temporada: 6 [D].
- Separación mínima entre eventos: 14 días [D].
- Ningún concierto puede programarse en las 48 horas previas o posteriores a un partido local [D] (regla de calendario).
- Preparación: `dias_preparacion` (4.17) con estadio bloqueado para partidos.
- Eventos con cubierta: sin cancelación por lluvia. Sin cubierta: 10 % de probabilidad de cancelación por evento [D].
- Traducción a ticks semanales [D] (v0.8): un evento ocupa la semana de `Evento.semana` y, si `dias_preparacion + 1 + dias_desmontaje > 7`, las `ceil((dias_preparacion + 1 + dias_desmontaje) / 7) − 1` semanas siguientes. La regla de 48 horas equivale a que ninguna semana ocupada por un concierto tenga partido de local. La separación de 14 días equivale a que las semanas de celebración de dos eventos difieran en 2 o más. La cancelación se sortea en la semana del evento (flujo 5 de 4.1). Un evento cancelado no cobra canon ni porcentaje y no desgasta el césped [D] (v0.9, B-6).

#### 8.6.3 Ingreso de evento

```
ingreso_evento = canon_fijo_cent + porcentaje_club × (aforo_evento × llenado_evento × precio_medio_cent)
llenado_evento = min(ocupacion_max_global, demanda_evento / aforo_evento)
demanda_evento = 0,85 × aforo_evento × f_reputacion × f_tipo
```

- `ocupacion_max_global` es el de 8.2 para el estadio (0,8904 con los valores de 4.6). El evento usa su propia demanda, pero el mismo tope de ocupación que el fútbol (A-21, cerrada). [D]
- `f_tipo` [D] = 1,0 para conciertos; 0,8 para eventos corporativos y competiciones no futbolísticas (8.6.5) [D] (v0.9).

**Ejemplo ilustrativo**: concierto nivel 2, aforo 40.000, precio 80 €, canon 1,5 M€, porcentaje 0,15, R = 60 (`f_reputacion` = 1,06). `demanda_evento` = 0,85 × 40.000 × 1,06 = 36.040, y `demanda_evento / aforo_evento` = 0,901. `llenado_evento` = min(0,8904; 0,901) = 0,8904 (valor redondeado de 0,890421; con el valor exacto el ingreso sería 1.927.402 €). Ingreso = 1.500.000 + 0,15 × (40.000 × 0,8904 × 80) = 1.500.000 + 427.392 = 1.927.392 €.

#### 8.6.4 Limitaciones y ruido

- Nivel de insonorización: `insonorizacion_nivel` (4.5) debe ser igual o superior al del evento. Si no, el evento queda vetado.
- Tope de decibelios no implementado; la regla es de nivel de insonorización y calendario [D].
- Cada evento consume césped según 7.6: −8 puntos sin césped calefactado.
- Multas por incumplimiento de horario: 100.000 € por evento, si el evento supera el horario máximo autorizado [D]. Probabilidad [D] (v0.9, B-6): 0,05 por evento celebrado, sorteada con el flujo 5 después del sorteo de cancelación. La multa se paga en la semana del evento (fila de multas de 6.5).
- Restricciones referencia: en la prensa se ha informado de un veto a conciertos en un estadio por insonorización [NV], sin fuente localizada. Esta regla se modela como caso general, no como dato de club.

#### 8.6.5 Competiciones no futbolísticas

- Ingreso por competición no futbolística: como evento corporativo; sin ingresos de taquilla de partido de liga.

### 8.7 Derechos digitales del club (eliminado)

El modelo de ingreso por seguidores de esta sección era el de los ingresos digitales. Se elimina (decisión de producto 8). Los ingresos digitales son el pool de 40 M€ de 6.2.5, repartido con el modelo legal de 6.9.2 (v0.9, decisión 23). El reparto de los 40 M€ no usa `fans_activos` ni `seguidores_club`. `seguidores_club` (4.4) solo alimenta tienda online y camisetas (8.1), y no entra en ningún ingreso digital.

### 8.8 Cesión de derechos de imagen de jugadores

- Las plantillas pueden ceder derechos de imagen colectivos. [D] Cada jugador con contrato vigente aporta `valor_mercado × 0,0015` al año al club, como ingreso separado, sin relación con el pool digital de 6.2.5. Límite del total: 2 M€ por club y temporada [D].
- Esta regla queda fuera de la versión base (A-13, cerrada en v1.0); el indicador `derechos_imagen_activos` (4.24) es falso.

---

## 9. Gestión del entrenador

### 9.1 Modos de juego

| Modo | Control del entrenador | Control económico | Notas |
|---|---|---|---|
| coach | Plantilla y mercado (fichajes, ventas, renovaciones), entrenamientos, objetivos y carrera. Caja del club, ingresos, gastos, préstamos, patrocinios, estadio y obras. | Control económico completo: el jugador lleva la caja y responde a los controles de la sección 10. La directiva fija objetivos y confianza. Sin presupuesto fijo, sin objetivo `presupuesto_no_superar` y sin techo de gasto (10.4). | [D] Decisión de producto: en modo Coach, el jugador gestiona las finanzas. Cierra A-02. |
| manager | Plantilla y mercado con presupuesto asignado. Estadio: solo propuestas. | Presupuesto asignado por la directiva: `presupuesto_no_superar` = presupuesto de 10.4. | [D] (v0.9, B-2): la directiva firma todas las ofertas de patrocinio, no pide préstamos, mantiene el precio de taquilla en `p_ref` y aprueba una obra propuesta si su coste ≤ saldo − saldo mínimo de seguridad de 10.4. |
| president | Finanzas, estadio, mercado y directiva. | Control económico completo. | [D] |
| total | Todo lo anterior y el entrenador actúa como primer ejecutivo. | Control económico completo. | [D] |
| promanager | Modo de campaña. Clubes de partida limitados, desbloqueables por objetivos del club actual. | Como `coach`: el jugador lleva la caja (`gestor_caja = jugador`, 4.4). | [D] Ver 15.4 y A-20. |

**Promanager**: el club de partida es uno solo. El club siguiente se desbloquea cuando el club actual cumple sus objetivos de temporada (9.3) [D] (decisión de producto 11). Los clubes desbloqueables se listan en 15.4.

### 9.2 Ciclo de temporada del entrenador

1. **Inicio**: la directiva asigna objetivos (9.3).
2. **Durante temporada**: el entrenador recibe ofertas (9.8), puede renovar su contrato y gestiona plantilla según modo.
3. **Cierre**: se evalúan objetivos, se actualiza reputación, se decide despido o renovación, se generan ofertas.

### 9.3 Objetivos

Cada temporada se asignan 2 o 3 objetivos [D] (v0.9, B-2; ver "Objetivos que se asignan" más abajo). Tipos:

| Tipo | Evaluación | Peso base [D] |
|---|---|---|
| posicion_final | Cumplido si la posición final ≤ valor_objetivo. | 0,40 |
| puntos_minimos | Cumplido si puntos ≥ valor_objetivo. | 0,30 |
| copa | Sin Copa simulada (A-06). Se excluye de la evaluación: no cuenta ni en el peso ni en el score. [D] | 0 (excluido) |
| presupuesto_no_superar | Cumplido si el gasto de temporada ≤ valor_objetivo. Solo en modo Manager; no existe en modo Coach (decisión 1). | 0,20 (solo Manager) |
| saldo_minimo | Cumplido si el saldo al cierre ≥ valor_objetivo. | 0,20 |
| aforo_medio_minimo | Cumplido si la ocupación media ≥ valor_objetivo. `valor_objetivo` en [0, 1]; ocupación media = media de `ocupacion` (8.2) de los partidos de liga de local [D] (v0.8). | 0,20 |
| fichajes_maximos | Cumplido si el número de fichajes ≤ valor_objetivo. | 0,10 |
| permanencia | Cumplido si la posición final ≤ número de equipos − 3: Primera ≤ 17; Segunda ≤ 19 [D]. | 0,40 (Primera); 0,40 (Segunda) |

Los pesos se normalizan para que sumen 1. En modo Coach el objetivo `presupuesto_no_superar` no existe: su peso no se asigna y los demás se normalizan.

**Objetivos cumplidos** (definición única del documento): `score_objetivos ≥ 0,6` (ver 9.4). 9.5, 9.7, 9.8 y 9.9 usan esta regla [D].

**Asignación inicial de objetivos**: la directiva fija los valores a partir de la reputación del club y de la posición de temporada anterior. [D]

- Club de división alta con reputación ≥ 70: posición_final objetivo entre 4 y 8.
- Club de reputación media (40 a 70): posición_final entre 8 y 14.
- Club de reputación baja (< 40): permanencia.
- Valor exacto en Primera [D] (v0.8): con R ≥ 70, `valor_objetivo = round(8 − 4 × (R − 70) / 30)` (R = 70 → 8; R = 100 → 4); con 40 ≤ R < 70, `valor_objetivo = round(14 − 6 × (R − 40) / 30)` (R = 40 → 14; R = 60 → 10, el ejemplo de 4.12). "División alta" = Primera.
- Objetivo deportivo en Segunda [D] (v0.9, B-2): `posicion_final` = 6 si R ≥ 60; `posicion_final` = 12 si 40 ≤ R < 60; `permanencia` si R < 40.

**Objetivos que se asignan** [D] (v0.9, B-2, decisión 32):

| Modo | Objetivos | Pesos base | Pesos normalizados |
|---|---|---|---|
| President, Total | Deportivo (`posicion_final` o `permanencia`), `saldo_minimo` = 0 € y `aforo_medio_minimo` = 0,80 en Primera o 0,70 en Segunda | 0,40; 0,20; 0,20 | 0,50; 0,25; 0,25 |
| Manager | Deportivo, `presupuesto_no_superar` = presupuesto de 10.4 (en lugar de `saldo_minimo`, porque en Manager la caja la lleva la directiva) y `aforo_medio_minimo` | 0,40; 0,20; 0,20 | 0,50; 0,25; 0,25 |
| Coach, Promanager | Deportivo y `aforo_medio_minimo` | 0,40; 0,20 | 0,667; 0,333 |

- Decisión de producto 46 (v1.0; propuesta del redactor en v0.9, coherente con la decisión 1): en Coach la directiva no fija presupuesto. Un objetivo `saldo_minimo` = 0 equivale a exigir gasto ≤ ingresos + saldo inicial, que es el presupuesto de 10.4 con un saldo mínimo de seguridad de 0. Por eso en Coach, y en Promanager, que funciona como Coach (9.1), no se asigna `saldo_minimo` y solo cuentan el objetivo deportivo y el de ocupación. El jugador sigue respondiendo a los controles de la sección 10.
- `puntos_minimos` y `fichajes_maximos` no se asignan en la versión base; quedan definidos para el modo Promanager (15.4) y para extensiones.
- Comprobación: el club de referencia de Primera tiene ocupación 0,8823 ≥ 0,80, así que cumple el objetivo de ocupación con factores neutros; el objetivo deportivo decide el resultado. Un club de Segunda con R = 40 y factores neutros tiene 0,6357 < 0,70 (8.2).

### 9.4 Reputación del entrenador

**Valor inicial**: depende de la división y de la experiencia del entrenador [D]:

| División | Reputación inicial [D] |
|---|---|
| Segunda | 35 a 50 |
| Primera | 45 a 65 |

El generador (15.5) sortea un entero uniforme en el rango de la división (flujo 7 de 4.1) [D] (v0.8).

**Evaluación de fin de temporada**:

```
score_objetivos = Σ (peso_i × cumplido_i) / Σ peso_i      (en [0, 1])
delta_reputacion = round(20 × (score_objetivos − 0,5)), acotado a [−10, +10]
```

- Redondeo: `reputacion` es entera. Los efectos fraccionarios se redondean al entero más próximo antes de aplicarse [D]. La cota de −15 de la versión 0.1 era inalcanzable, porque con `score` en [0, 1] el delta está en [−10, +10].

- Bonus por título o ascenso: +5 [D].
- Penalización por despido o dimisión: −5 [D].
- Reputación en [0, 100]; acotada.

### 9.5 Honorarios

- Honorarios anuales de partida: [D] `honorarios_base_division × (0,5 + reputacion/100)`, con base de 1,2 M€ en Primera y 0,4 M€ en Segunda.
- Actualización tras la evaluación:
  - Objetivos cumplidos (score ≥ 0,6, ver 9.3): honorarios × 1,10 en la nueva renovación.
  - Objetivos incumplidos (score < 0,4): honorarios × 0,90.
- Despido: honorarios de la siguiente oferta × 0,85 [D] durante dos temporadas [D].

### 9.6 Reputación del club

Este índice afecta a demanda (8.2), patrocinio (8.3), ofertas al entrenador (9.8) y audiencia (6.9.2).

**Evolución anual**:

```
delta_reputacion_club = Σ (efectos)
efectos:
  +5 si el club cumple posición objetivo
  −5 si el club desciende
  +3 si el club asciende
  −2 si el césped quedó por debajo de 20 durante un partido local
  −5 si hay una sanción por pérdida superior al 150 % del límite (10.2)
  +5 × (aforo_medio − aforo_medio_anterior) / aforo_medio_anterior
```

Límite de variación anual: ±10 [D]. Orden [D] (v0.8): se suman los efectos, se acota la suma a [−10, +10], se redondea al entero más próximo y se acota `reputacion` a [0, 100]. "Cumple posición objetivo" = el objetivo deportivo de la temporada (`posicion_final` o `permanencia`) tiene `cumplido = true`. El −5 por sanción es el mismo efecto que la fila "Pérdida superior al 150 %" de 10.2: se aplica una sola vez. Se evalúa en la semana 52 para todos los clubes.

- `aforo_medio` = media de `asistencia_partido` de los partidos de local de la temporada [D].
- `aforo_medio_anterior` = la misma media de la temporada anterior. En la primera temporada, es igual a `aforo_medio` (variación cero) [D].

### 9.7 Confianza de la directiva

- Valor inicial: 60 [D].
- Cambio tras evaluación: +10 si `score_objetivos ≥ 0,6`; −10 si el score es menor de 0,4; −20 si hay sanción de control económico (10.2). Precisión [D] (v0.8): el −20 es el de la fila "Pérdida superior a la permitida" de 10.2 (se aplica una vez, no se suma a otro −20). Resultado acotado a [0, 100]. El sorteo semanal de despido usa el flujo 6 de 4.1 y se hace en el paso 11 del tick, solo en las semanas 5 a 51.
- Si `confianza_directiva` es 20 o menos, hay dos mecanismos de cese, con prioridad ordenada [D]: (1) durante la temporada, despido con probabilidad 0,25 cada semana (12.10); (2) al cierre de temporada, cese con probabilidad 0,5, solo si no ha habido ya un despido en esa temporada.

### 9.8 Ofertas de otros clubes

**Generación**: al cierre de temporada y en cada ventana de mercado, el sistema genera ofertas según reputación del entrenador y del club:

```
numero_ofertas = min(3, floor(reputacion_entrenador / 25))
```

- Si `reputacion_entrenador ≥ 70` y `score_objetivos ≥ 0,6`, al menos una oferta es de división superior [D].
- Honorarios de la oferta: honorarios actuales × (1 + 0,002 × reputacion) [D]. Con reputación 70 da +14 %; con 100, +20 %. La versión 0.1 daba +35 % y +50 %, que se consideraron excesivos. Si se quiere otra magnitud, es decisión de diseño.
- Caducidad: 14 días [D] (2 semanas de juego). `caduca_semana = semana + 2` [D] (v0.8).
- Momento [D] (v0.8): las ofertas "de ventana" se generan en la primera semana de cada ventana (semanas 1 y 27); las de cierre, en la semana 52 (11.4). `anios` de la oferta: entero uniforme en [1, 4] (flujo 6). Con `penalizacion_honorarios_temporadas > 0` (4.11), los honorarios de la oferta se multiplican además por 0,85 (9.5).
- Entrenador sin club [D] (v0.9, B-2): estado `en_paro` (4.11) tras un despido, el fin de contrato sin renovación (9.9) o el descenso de su club a Tercera (15.6). El tiempo sigue avanzando y recibe `max(1, min(3, floor(reputacion_entrenador / 25)))` ofertas en las semanas 1, 27 y 52: siempre al menos 1, así la partida no se bloquea. Sin club no cobra honorarios.
- Club de destino [D] (v0.9, B-2): sorteo uniforme (flujo 6) entre los clubes con |R − reputacion_entrenador| ≤ 15, sin incluir el club actual ni repetir club en la misma tanda; si la regla anterior exige división superior, solo entre los de Primera. Si no hay ningún club que cumpla, el de R más próxima (desempate por `codigo`).
- El entrenador puede aceptar, rechazar o ignorar. Ignorarla produce caducidad sin efecto.
- Aceptar una oferta exige rescindir el contrato actual: coste de rescisión del entrenador = honorarios × años_restantes × 0,5 [D]. Lo paga el club de destino, que pasa a ser el club del jugador, así que sale de la caja que gestiona el jugador desde ese momento [D] (v0.9, B-2). Un entrenador `en_paro` no paga rescisión.

### 9.9 Renovaciones

- Duración de contrato: 1 a 4 años [D].
- Renovación automática si `renovacion_automatica` (4.4) es verdadero, `reputacion ≥ 40` y `score_objetivos ≥ 0,6` [D]. Se evalúa en la semana 52 cuando `contrato_anios_restantes = 1`; renueva por 2 años con los honorarios ajustados de 9.5 y sin prima de firma [D] (v0.8).
- Renovación manual [D] (v0.8): el jugador elige de 1 a 4 años; los honorarios nuevos son los actuales ajustados por el último `score_objetivos` evaluado (9.5); se paga la prima de firma.
- `contrato_anios_restantes` resta 1 en cada semana 52 [D] (v0.8). Si llega a 0 sin renovación, el entrenador pasa a `en_paro` en esa semana 52 y recibe ofertas según 9.8 [D] (v0.9, B-2).
- Renovación manual: el jugador puede renovar en cualquier momento de la temporada con una prima de firma de honorarios × 0,25 [D].
- Renovación de contratos de jugadores: [D] la plantilla se puede renovar en ventanas de mercado con prima y salario negociados. Los contratos vencidos sin renovar pasan a libres al cierre de temporada. Aceptación [D] (v0.9, B-1): el jugador acepta si `salario_nuevo ≥ salario_actual × (1 + 0,05 × anios_nuevos)` y `moral ≥ 35`. Ejemplo: salario de 2 M€ y renovación por 3 años, mínimo 2,3 M€. Los clubes no controlados renuevan con el mismo salario todos los contratos que vencen (13.2).

### 9.10 Relación con la plantilla

- `moral_plantilla` es la media de `moral` de jugadores inscritos.
- Efectos de la moral: probabilidad de solicitud de traspaso (9.11), probabilidad de aceptar renovación y, en la evaluación, un ajuste de `delta_reputacion` (−2 si moral media < 40) [D].

### 9.11 Solicitudes de traspaso

- Un jugador con `moral < 35` durante 4 semanas seguidas genera una solicitud de traspaso [D].
- La solicitud tiene caducidad en 2 ventanas. Si no se atiende, el jugador queda con moral reducida en −10.
- Atender la solicitud: vender o ceder al jugador en la siguiente ventana.

### 9.12 Mecánicas no documentadas: decisiones de diseño

Las mecánicas de moral, condición física y entrenamientos no están documentadas en las fuentes. Se proponen aquí con valores iniciales y se marcan como [D]. Ninguna de ellas requiere motor de partido: solo afectan a la economía, a lesiones, a renovaciones y a la evaluación de objetivos.

#### 9.12.1 Condición física

- Rango `condicion_fisica` ∈ [0, 100]. Valor inicial: 80 [D].
- Desgaste semanal: `−minutos_semana_normalizados × 2` [D], donde `minutos_semana_normalizados` = minutos jugados en la semana / 90, producidos por la simulación (5.5).
- Recuperación semanal [D] (v0.9, B-3): en semanas sin partido, +5, sin efecto del plan; en semanas con partido, solo la recuperación del plan de entrenamiento vigente (9.12.3): +3 con `suave`, +2 con `normal` y +1 con `intenso`. No hay recuperación base en semanas con partido (en v0.8, +3 más el plan sin regla de combinación). "Con partido" = el club jugó partido esa semana, haya jugado o no el jugador [D] (v0.8).
- Efecto neto de una semana con partido: un titular (90 minutos, desgaste −2) queda en +1 con `suave`, 0 con `normal` y −1 con `intenso`; un jugador sin minutos, en +3, +2 o +1. Así el plan cambia de verdad la condición física, y con ella el riesgo de lesión (9.12.4).
- Orden en el tick (paso 7 de 5.2) [D] (v0.8): desgaste, recuperación, acotado a [0, 100]. Se aplica a todos los jugadores con contrato vigente, incluidos los lesionados (que tienen 0 minutos).
- Efecto en lesiones (9.12.4).

#### 9.12.2 Moral

- Rango `moral` ∈ [0, 100]. Valor inicial: 60 [D].
- Efectos semanales:
  - Resultado de jornada (simulación, 5.5.3): ganada +3; empatada 0; perdida −3 [D].
  - Minutos bajos (menos de 30 % de minutos esperados en la temporada): −1 por semana [D]. Minutos esperados [D] (v0.8): `90 × partidos de liga jugados por el club en la temporada`. Solo se aplica desde la jornada 5 y a jugadores inscritos sin lesión.
  - Los efectos de resultado se aplican a todos los inscritos del club, jueguen o no [D] (v0.8).
  - Entrenamiento intenso: −1 [D].
  - Prima por objetivos cumplidos: +5 al cerrar temporada [D].
- Acotado a [0, 100].

#### 9.12.3 Entrenamientos

Plan semanal del club [D] con tres intensidades:

| Intensidad | Recuperación de condición física en semana con partido (9.12.1) | Efecto moral semanal | Multiplicador de riesgo de lesión | Puntos de entrenamiento por semana (5.5.2) | Coste semanal [D] |
|---|---|---|---|---|---|
| suave | +3 | +1 | 0,8 | 0 | 0 |
| normal | +2 | 0 | 1,0 | +1 | 0 |
| intenso | +1 | −1 | 1,4 | +2 | 25.000 € |

Trade-off [D] (v0.9, B-3, decisión 33): `intenso` mejora los atributos (2 puntos de entrenamiento por semana) y recupera menos, penaliza la moral y eleva el riesgo de lesión y el coste. `suave` recupera más, protege la moral y reduce el riesgo de lesión, pero no suma puntos de entrenamiento, así que a largo plazo pierde calidad. En semanas sin partido la recuperación es +5 con cualquier plan (9.12.1). La columna de condición física es +3, +2, +1: el plan intenso recupera menos (decisiones 33 y 41).

- El coste semanal es el del preparador físico. Con personal de calidad 4-5, el coste se reduce un 10 %. [D] "Personal" = la mayor `calidad` entre el personal con rol `preparador_fisico` (4.19). Sin preparador físico, coste completo. Categoría `entrenamientos` [D] (v0.8).
- Los clubes que no controla el jugador usan el plan `normal` [D] (v0.8; confirmado por B-1).
- Se puede cambiar el plan cada semana, pero el cambio tarda una semana en surtir efecto. [D]

#### 9.12.4 Lesiones

Probabilidad semanal de lesión por jugador [D]:

```
p_lesion_semana = p_base × multiplicador_intensidad × (1 + (100 − condicion_fisica)/100) × f_medico
p_base = 0,01  (1 % semanal por jugador en condiciones normales)
f_medico = 1 − 0,05 × (calidad_medico − 3)   (acotado a [0,8, 1,1])
```

- Si lesión: `lesion_dias_restantes` se sortea entre 3 y 150 días [D] (decisión de producto 13), con distribución sesgada (la mayoría leves). Distribución [D] (v0.8): `dias = 3 + floor(147 × u^3)`, con `u` uniforme en [0, 1) del flujo 3. Resultado de referencia: mediana 21 días, media de 39,3 días, 28,4 % de bajas largas (más de 56 días) y 7,1 % de bajas muy largas (más de 120 días).
- Ámbito y orden [D] (v0.8): el sorteo se hace en el paso 7 de 5.2 de cada tick (semanas 1 a 52), para cada jugador con contrato vigente y `lesion_dias_restantes = 0`, con la `condicion_fisica` previa al desgaste de la semana y el plan vigente. `lesion_dias_restantes` baja 7 en cada tick (mínimo 0) antes del sorteo. `calidad_medico` como en 6.3.7. Con CF 80, plan normal y médico de calidad 3: p = 0,012 por semana.
- Gasto médico (6.3.7) y, si hay seguro, indemnización (6.2.15).
- Al volver de lesión, `condicion_fisica` se reduce en 5 [D].

#### 9.12.5 Interacción con la evaluación de objetivos

- La condición física y la moral no aparecen como objetivos. Sí afectan al cumplimiento de `permanencia`, `puntos_minimos` y `posicion_final` solo a través de la simulación de 5.5 (`velocidad_ef` y `moral_plantilla` en `S_club`, 5.5.2), que es interna [D] (A-14, cerrada en v1.0 con la opción (b)).

### 9.13 Ajustes de la directiva al entrenador

En modo Coach no existe el objetivo `presupuesto_no_superar` ni ningún ajuste de confianza ligado a un presupuesto: la directiva no asigna presupuesto fijo y el jugador lleva la caja (9.1, decisión de producto 1). Solo en modo Manager, donde la directiva asigna presupuesto, si el gasto en fichajes de la temporada supera 1,5 veces el valor de `presupuesto_no_superar` (9.3), la confianza de la directiva baja 10 puntos [D].

---

## 10. Control económico

### 10.1 Indicadores

| Indicador | Definición | Umbral (Primera) | Umbral (Segunda) | Confianza |
|---|---|---|---|---|
| Ratio masa salarial | `masa_salarial / (INCN + traspasos_netos)` | 0,60 | 0,60 [D] | [NV, P-10] para 60 % en Primera (fuente sin URL localizada); [D] para Segunda. |
| Ratio UEFA de referencia | Mismo cálculo con umbral de gasto | 0,70 desde 2025/26 | No aplica | [NV, P-10]. Se usa solo como aviso. |
| Pérdidas permitidas | Pérdida neta del ejercicio máxima | 60 M€ | 15 M€ [D] | [NV] para 60 M€ (P-10, sin URL localizada; año no confirmado, ver 17.1). Valor de juego [D] fijado en v1.0: no depende de contrastar la fuente; [D] para Segunda. |
| Deuda neta / EBITDA | Deuda neta dividida entre EBITDA | 1,5 (referencia, no límite) | 2,0 [D] | [NV] para el valor de 2024/25 (17.2, punto 4); no es límite. |
| Límite de inversión en fichajes | Gasto de fichajes de la temporada, según el juego | 1,5 × INCN del ejercicio anterior [D] | 1,5 × INCN del ejercicio anterior [D] | [D]. Umbral operativo. Las cifras de clubes reales no se usan (17.1). Precisión [D] (v0.8): gasto de fichajes = Σ costes de fichaje + comisiones de la temporada. En 2026/27, "INCN del ejercicio anterior" = INCN previsto de 2026/27 al cargar (repartos de 6.9 + taquilla proyectada de 6.1). Club de referencia (v0.9): 1,5 × 135,06 = 202,59 M€. |

**Lectura del ratio de 60 %**: la referencia lo describe como ratio entre plantilla y la suma de INCN y traspasos [NV, P-10]. En el juego se aplica al ejercicio en curso.

**Definiciones**:

```
INCN = Σ importes de las categorías derechos_tv (nacional, internacional y digital), taquilla y comercializacion de la temporada, sin traspasos [D] (decisión de producto 16). Quedan fuera merchandising, restauración, eventos, patrocinios, museo, naming, palcos, hospitality y abonos.
traspasos_netos = Σ ventas − Σ compras de la temporada
masa_salarial = salarios_jugadores + personal (técnico, secretaría y dirección, 6.3.2) + honorarios_tecnico (entrenador) [D]. Es la única definición de masa salarial del documento.
EBITDA = resultado de explotación + amortizaciones
deuda_neta = préstamos_activos − Caja.saldo_cent (con saldo negativo, el descubierto suma a la deuda)
```

Precisiones [D] (v0.8): `préstamos_activos` = Σ `saldo_pendiente_cent`. Si `INCN + traspasos_netos ≤ 0`, el ratio de masa salarial se trata como superior a 0,65. Todos los importes son de la temporada en curso hasta la semana de la comprobación. `resultado de explotación` = `beneficio_contable_ejercicio` de 6.8 sin intereses de préstamo ni de descubierto y sin el apunte de beneficio de traspasos.

### 10.2 Aplicación de sanciones

| Situación | Consecuencia [D] |
|---|---|
| Ratio masa salarial entre 0,60 y 0,65 | Aviso. No hay sanción. |
| Ratio masa salarial superior a 0,65 | Bloqueo de nuevas altas salariales hasta regularizar. |
| Pérdida superior a la permitida | Multa de 10 % del exceso. Confianza de directiva −20. |
| Pérdida superior al 150 % del límite | Bloqueo de fichajes durante una ventana. Coste de reputación del club −5. |
| Descubierto sostenido | Dos cierres seguidos: aviso de venta forzosa. Tres cierres seguidos: venta forzosa automática (6.11, B-1). |
| Límite de inversión superado | Bloqueo de fichajes hasta reducir el gasto del periodo. |

Las sanciones se comunican en la pantalla de control económico, con su causa y su plazo de regularización.

Precisiones [D] (v0.8):

- Descubierto por encima del límite en un solo cierre de mes: bloqueo de fichajes, obras nuevas y préstamos (12.9) y aviso; sin multa.
- "Regularizar" = que la condición deje de cumplirse en la siguiente comprobación del mismo tipo (cierre de mes para el descubierto; semana 26 o 52 para los ratios).
- "Durante una ventana" = la siguiente ventana de mercado completa.
- La multa del 10 % se registra en la semana de la comprobación (fila de multas de 6.5).

**Nota de realismo**: la liga real aplica sanciones y prohibiciones de inscripción según su propio reglamento; la lista anterior es una simplificación de juego. [D]

### 10.3 Comprobaciones

- Comprobación intermedia: al cierre de diciembre (semana 26) [D]. Contenido [D] (v0.8): ratio de masa salarial y límite de inversión con los importes acumulados de las semanas 1 a 26. Las pérdidas permitidas solo se evalúan en la semana 52.
- Comprobación final: al cierre de ejercicio, 30 de junio (semana 52) [D].
- Comprobación mensual del descubierto (6.11).

### 10.4 Techo de gasto por temporada (modos President, Total y Manager)

- En modo Coach (y Promanager) no hay techo de gasto ni aviso de presupuesto: el jugador lleva la caja sin presupuesto fijo (9.1, decisión de producto 1).
- Presupuesto por temporada (President, Total y Manager): ingresos previstos del club + saldo inicial − saldo mínimo de seguridad (propuesta: 5 M€ Primera; 2 M€ Segunda) [D]. En Manager es el valor de `presupuesto_no_superar` (9.3), fijado en la semana 1 con la proyección de 6.1 [D] (v0.9, B-2).
- Si el gasto previsto supera el presupuesto, la pantalla muestra aviso, pero no bloquea (salvo las reglas de 10.2).

---

## 11. Flujo de temporada

### 11.1 Pretemporada

- Semanas 1 a 4 [D].
- Estado inicial de la partida base: semana 1 de 2026/27, con la caja y la plantilla de la carga (sección 15). La fecha de referencia del documento (22/10/2026) no es la fecha de partida. No hay cobros ni pagos previos a la semana 1 [D].
- Acciones posibles: fichajes y ventas (ventana de verano), firma de patrocinios, contratación de personal, decisiones de estadio y obras, préstamos.
- Se cobran: vallas (inicio) y primer plazo de abonos. Los palcos se venden por partido (6.2.3) y no tienen tramo de pretemporada.
- Asignación de objetivos y plan de entrenamientos inicial.

### 11.2 Jornadas

- Cada semana con jornada genera partido.
- Local: taquilla, palcos, hospitality, restauración y tienda de día. El museo y los tours se cobran mensualmente (8.4 y 6.5), no por partido [D] (v0.8).
- Visitante: ingresos de derechos, sin taquilla.
- Cada jornada se ejecutan obras, desgaste, lesiones y evaluación de moral.

### 11.3 Ventanas de mercado

| Ventana | Semanas [D] | Operaciones |
|---|---|---|
| Verano | 1 a 6 | Fichajes, ventas, cesiones, rescisiones, renovaciones. |
| Invierno | 27 a 29 | Fichajes, ventas, cesiones, rescisiones, renovaciones. |

- Fuera de ventana: solo renovaciones automáticas, rescisiones por baja larga (6.6.2), y ofertas de entrenador (9.8).
- Límite de fichajes por ventana: sin límite de número, solo límite de inversión (10.1) y de plantilla (12.3).

### 11.4 Evento de cierre de temporada

En la última semana de la temporada (semana 52):

1. Se cierra el ejercicio contable: se calcula beneficio y se fija el impuesto de sociedades (6.8), con pago en la semana 4 de la temporada siguiente.
2. Se evalúan objetivos y reputación (9.4, 9.6).
3. Se calculan renovaciones y caducidad de contratos.
4. Se calcula el reparto de derechos de la temporada siguiente.
5. Se generan ofertas de entrenador (9.8).
6. Se aplica la comprobación final del control económico (10.3).
7. Se muestra el resumen de temporada.

### 11.5 Calendario económico resumido

| Semana | Evento |
|---|---|
| 1 | Inicio de temporada; cobro de vallas; primer plazo de abonos (julio) |
| 1 a 6 | Ventana de verano abierta |
| 5 | Primer cobro de derechos (primer tick de agosto) |
| 26 | Comprobación intermedia del control económico (cierre de diciembre) |
| 27 a 29 | Ventana de invierno abierta |
| 27 | Segundo plazo de abonos (primer tick de enero) |
| 52 | Cierre de ejercicio; evaluación de objetivos; ofertas de entrenador |

---

## 12. Reglas de negocio y casos límite

### 12.1 Plantilla

| Regla | Valor [D] |
|---|---|
| Plantilla registrada (inscritos en competición) | Mínimo 18, máximo 25 |
| Jugadores de cantera | Máximo 4 por plantilla (sin contratos profesionales vigentes). Reservada: la versión base no genera jugadores de cantera ni tiene campo para ellos, así que la regla no se aplica [D] (v0.8). |
| Porteros inscritos | Mínimo 2 |
| Jugadores sin contrato vigente | No pueden estar inscritos |
| Jugadores cedidos | No cuentan para la plantilla registrada |
| Límite de cláusulas casa y coche | 6 por club |

### 12.2 Extranjeros no comunitarios

**Regla de juego**: el número de jugadores no comunitarios inscritos en plantilla no puede superar 6 [NV; D].

**Definición de comunitario** [D]: nacional de un Estado de la Unión Europea o del Espacio Económico Europeo, o de Suiza. Es una regla propia del juego (A-15 y A-19, cerradas en v1.0); no pretende reproducir la normativa vigente de la liga.

**Casos**:

- Doble nacionalidad: cuenta como comunitario si al menos una nacionalidad es comunitaria. [D]
- Jugador con nacionalidad no comunitaria que adquiere nacionalidad comunitaria durante la temporada: pasa a comunitario desde la fecha de adquisición. [D]
- Cesión entrante: cuenta en el límite del club cedente y del receptor según el lado del contrato. [D] Simplificación: cuenta para el receptor.
- Intento de inscribir un séptimo no comunitario: el sistema bloquea la inscripción y muestra la causa. [D]
- Venta de un no comunitario que deja la plantilla con seis o menos: se libera el hueco. [D]

### 12.3 Límite de plantilla

- Límite de inscritos: 25 (regla de competición de juego) [D].
- Si la plantilla inscrita supera 25 por cesiones o contrataciones de emergencia: la inscripción excedente se bloquea.
- Lesionados de larga duración siguen inscritos. [D]

### 12.4 Casos de contrato

| Caso | Comportamiento [D] |
|---|---|
| Jugador vence contrato en junio sin renovación | Pasa a libre al cierre de temporada (semana 52); no genera ingreso. Desde la semana 1 de la temporada siguiente puede firmar con cualquier club. |
| Jugador lesionado durante la negociación | Se mantiene la negociación; la prima de firma se reduce 10 %. |
| Jugador con contrato vigente que pide rescisión sin ventana | Solo si es baja muy larga (más de 120 días). |
| Venta de jugador en fecha límite de ventana | Operación en vigor si se formaliza antes del cierre. |
| Doble cesión | No permitida. |
| Jugador mayor de 40 años | No se puede firmar contrato nuevo. Se mantiene el vigente. |

### 12.5 Casos de cláusulas económicas

- Cláusula casa y coche con jugador vendido: el bonus ya pagado no se devuelve. El número de cláusulas del club baja en uno. [D]
- Renovación con cláusula: se paga de nuevo el bonus con el número de cláusulas vigente en la renovación. [D]
- Cláusula de rescisión con contrato a punto de vencer (`anios_restantes = 1`): factor de 0,30 (6.6.2). [D]

### 12.6 Casos de patrocinio

- Patrocinio con objetivo no cumplido: solo se cobra la parte fija.
- Patrocinio de zona ocupada: no se puede firmar otro en la misma zona. [D]
- Naming de estadio al cambiar de club: el contrato sigue vigente en la propiedad del estadio. [D] No se aplica en la versión base.

### 12.7 Casos de estadio

- Obra cancelada con cuota a medias: se pierde el 50 % del coste pagado.
- Estadio sin aforo suficiente para partido: se pide trasladar el partido (7.4).
- Estadio con césped inutilizable: ver 7.6.
- Evento vetado por insonorización: no se puede programar. Si se programó antes de la obra, se cancela con indemnización del 20 % del canon fijo. [D]

### 12.8 Casos de descenso y ascenso

- Descenso de Primera: el club pasa a Segunda al cierre. Los contratos no se reducen. Si la masa salarial supera el ratio de 10.1 en Segunda, se aplica 10.2. El tope de 14.2 solo es aviso. [D] Cláusula de rescisión sin efecto por descenso. [D]
- Fondo de compensación: 2,5 % del pool audiovisual de Segunda para descendidos de Primera (6.9.3). [C] para el porcentaje; [D] para la base.
- Ascenso a Primera: contratos de jugadores de cantera o del club pasan a vigentes con su salario. [D]

### 12.9 Casos de caja

- Saldo negativo dentro del descubierto: se pagan los gastos, con interés (6.11).
- Saldo negativo superior al descubierto: se bloquean fichajes, obras y préstamos. Se pagan salarios y cuotas.
- Saldo nulo al cierre de temporada: sin efecto especial.

### 12.10 Casos de entrenador

- Despido durante la temporada: si `confianza_directiva` ≤ 20, probabilidad 0,25 cada semana. Como máximo un despido por temporada; si ya lo hubo, no hay cese adicional al cierre (9.7) [D].
- Oferta aceptada con contrato actual vigente: se paga la rescisión (9.8).
- Dos ofertas aceptadas el mismo día: prevalece la primera aceptada. [D]

### 12.11 Casos límite técnicos

- Un movimiento de caja que deja saldo exactamente igual al descubierto: permitido.
- Ingresos y pagos en el mismo tick: los cobros se aplican antes que los pagos, y los pagos siguen el orden de la columna "Orden" de 6.5 (regla de 5.2 y 6.5). [D]
- Dos eventos en el mismo tick que superan el aforo: se procesan en orden de `secuencia_creacion` ascendente, no por id. [D]

---

## 13. Pantallas y flujos de usuario (gestión)

Las pantallas describen funciones, no diseño visual. Cada una indica quién la usa (según modo de juego).

### 13.1 Mapa de pantallas

Promanager ve lo mismo que Coach (9.1). Manager consulta la caja en solo lectura, porque `gestor_caja = directiva` (4.4) [D] (v0.8).

| Pantalla | Modos | Función |
|---|---|---|
| Inicio / resumen | Todos | Resumen de la semana, avisos y próximos eventos. |
| Caja y finanzas | Coach, President, Total, Promanager; Manager (solo lectura, con el presupuesto asignado) | Saldo, movimientos, proyección, préstamos. En Coach, sin presupuesto ni techo de gasto (9.1, 10.4). |
| Ingresos | Coach, President, Total, Promanager | Desglose de ingresos por fuente. |
| Gastos | Coach, President, Total, Promanager | Desglose de gastos por categoría. |
| Préstamos | Coach, President, Total, Promanager | Solicitud, amortización, límites. |
| Patrocinios | Coach, President, Total, Promanager | Ofertas de patrocinio y contratos vigentes. |
| Estadio | Todos (lectura); Coach, President, Total y Promanager (decisiones); Manager (solo propuestas) | Secciones, aforo, obras y mantenimiento. |
| Obras | Coach, President, Total, Promanager | Planificación, coste, progreso. |
| Explotación del estadio | Coach, President, Total, Promanager | Palcos, hospitality, restauración, museo, tours, eventos. |
| Tienda y merchandising | Coach, President, Total, Promanager | Estado, estacionalidad, camisetas. |
| Plantilla | Coach, Manager, President, Total, Promanager | Lista de jugadores, contratos, moral y condición física. |
| Mercado | Coach, Manager, President, Total, Promanager | Fichajes, ventas, cesiones, rescisiones. |
| Entrenamientos | Coach, Manager, President, Total, Promanager | Plan semanal y costes. |
| Objetivos | Todos | Objetivos de temporada y progreso. |
| Carrera del entrenador | Todos | Reputación, honorarios, ofertas y renovación. |
| Control económico | Todos (lectura) | Indicadores, avisos, sanciones. |
| Calendario | Todos | Jornadas, ventanas, eventos económicos. |
| Historial de temporada | Todos | Resumen cerrado de cada temporada. |

### 13.2 Flujo: fichar a un jugador

0. Reglas de mercado [D] (v0.9, B-1, decisión 31):
   - Fichables: jugadores con contrato de cualquier club no controlado por el jugador, y jugadores libres (`club_id` nulo).
   - Aceptación del club vendedor: acepta si `oferta ≥ valor_mercado × min(1,3; 0,8 + 0,1 × anios_restantes)`. Ejemplo: valor de 10 M€ y 2 años restantes, mínimo 10 M€; 5 años o más, 13 M€. Un libre no tiene vendedor (coste de fichaje 0).
   - Aceptación del jugador: `salario ≥ 1,10 × salario actual`; un libre, `salario ≥ 0,90 × salario de su último contrato`.
   - Clubes no controlados (IA): sin caja simulada; plan de entrenamiento `normal`; renuevan con el mismo salario los contratos que vencen; no fichan; su reputación sigue 9.6 con el objetivo deportivo de 9.3.
   - Cesiones entrantes: fuera de la versión base.
1. Desde Mercado, el usuario selecciona jugador y oferta de coste de fichaje.
2. El sistema comprueba: ventana abierta; saldo o descubierto disponible; límite de inversión (10.1); plantilla (12.3); no comunitario (12.2); masa salarial (10.1); aceptación del vendedor y del jugador (paso 0).
3. Si alguna comprobación falla, se muestra causa y la opción de corregirla.
4. El usuario define salario, duración, forma de pago, cláusulas (casa y coche, rescisión).
5. El sistema muestra el impacto proyectado: caja de las próximas 8 semanas, cargo de amortización anual, ratio de masa salarial.
6. Confirmación: se crean `Contrato`, `Clausula` y `Movimiento`.

### 13.3 Flujo: vender o ceder a un jugador

1. Desde Plantilla, el usuario elige jugador.
2. Selecciona venta, cesión o rescisión.
3. El sistema calcula ingreso o coste (6.2.14, 6.6.2). Venta [D] (v0.9, B-1): el sistema compra al instante por `valor_mercado × min(1,0; 0,6 + 0,1 × anios_restantes)`. El jugador pasa, con su contrato y su salario, a un club no controlado de su división sorteado con el flujo 6 entre los que tienen menos de 25 inscritos; si no hay ninguno, de la otra división. Margen frente a la recompra: para los mismos `anios_restantes`, el precio de venta (0,6 + 0,1 × años, tope 1,0) es siempre menor que el mínimo de compra del paso 0 de 13.2 (0,8 + 0,1 × años, tope 1,3), así que vender y recomprar no da dinero (sección 19). Un jugador fichado no se puede vender en la misma ventana en que llegó, para que no se pueda comprar con pocos años de contrato, renovar a más años y revender en el acto [D] (v0.9; decisión de producto 47, v1.0).
4. Muestra beneficio o pérdida contable.
5. Confirmación: movimientos y actualización de plantilla.

### 13.4 Flujo: encargar una obra

1. Desde Estadio, se elige tipo de obra.
2. El sistema muestra coste, duración, aforo resultante, efectos y mantenimiento.
3. Comprobación de saldo, obras activas máximas y espacio.
4. Confirmación: obra en estado `planificada`; empieza en la siguiente semana con saldo suficiente.

### 13.5 Flujo: programar un concierto

1. Desde Explotación del estadio, se elige tipo de evento.
2. El sistema comprueba: insonorización, calendario (8.6.2), aforo, césped.
3. El sistema muestra ingreso proyectado (8.6.3) y coste de césped.
4. El promotor (oferta del sistema, con los parámetros por tipo de 8.6.1) acepta si se cumplen todas las comprobaciones del paso 2; si no, rechaza y se muestra la causa [D] (v0.9, B-6). Si acepta, el evento pasa a `confirmado`.

### 13.6 Flujo: préstamo

1. Desde Préstamos, se elige importe, plazo y método de amortización (lineal por defecto o francesa, 6.7).
2. Comprobación de límite de división, número de préstamos activos y límite con objetivos cumplidos (6.7).
3. Muestra cuota mensual, intereses totales y saldo.
4. Confirmación: préstamo activo y entrada de caja.

### 13.7 Flujo: decisión sobre ofertas de entrenador

1. Desde Carrera del entrenador, se lista la oferta con club, división, honorarios, duración y caducidad.
2. Se muestra el coste de rescisión del contrato actual (9.8), que paga el club de destino.
3. Aceptar: se abre cambio de club en el siguiente tick.
4. Rechazar o caducar: sin efecto.

### 13.8 Flujo: fin de temporada

1. Se muestra el resumen de objetivos cumplidos y no cumplidos.
2. Se muestra la evaluación de reputación del entrenador y del club.
3. Se muestra el resultado económico y el cálculo de impuesto.
4. Se muestran ofertas, renovaciones y avisos de control económico.
5. Confirmación: se inicia la siguiente temporada.

### 13.9 Requisitos transversales de pantalla

- Toda cifra de la pantalla debe poder desglosarse en causas (principio 7).
- Las proyecciones se etiquetan como estimadas.
- Ninguna pantalla debe permitir una acción que la regla de negocio prohíbe; se muestra la causa.
- Las pantallas son accesibles por teclado y lector de pantalla; los importes se leen con separadores locales.

---

## 14. Parámetros de equilibrio propuestos

Todas las cifras de esta sección son propuestas [D] para calibrar en pruebas. Se justifican con su relación con la referencia. Cada tabla indica la justificación.

### 14.1 Parámetros económicos generales

| Parámetro | Primera | Segunda | Justificación |
|---|---|---|---|
| Pool audiovisual anual (nacional más internacional) | 1.288,908 M€ en 2026/27; 1.342,908 M€ desde 2027/28 | 143,212 M€ en 2026/27; 149,212 M€ desde 2027/28 | 90/10 del art. 5.2 [C] sobre el pool de liga de 1.432,12 M€ [E, S-16] (6.9.1). De él, 990 M€ son el contrato nacional del ciclo 2022/23-2026/27 (4.950 M€, solo partidos de Primera [E, S-15]) y 442,12 M€ el resto [E]; desde 2027/28, nacional de 1.050 M€ (decisión 18) [D]. Sustituye a 990 + 500 M€ en Primera y 120 M€ en Segunda (v0.8). |
| Pool digital anual | 40 M€ [D] | 4 M€ [D] | Propuesta de diseño (6.2.5), repartida con el modelo legal de 6.9.2 y 6.9.3. Sustituye al modelo de seguidores (decisión 8). |
| Comercialización liga | 1.426,05 M€ | 158,45 M€ | 90/10 [D] (por analogía con el art. 5.2) de 1.584,5 M€ [C, S-02], el agregado de Primera y Segunda (decisión 29). Sustituye a 1.585 M€ solo de Primera y 80 M€ en Segunda (v0.8). |
| Límite de dispersión | 3,5 | 3,5 | Art. 5.5 [C]: 3,5 con un importe repartido de 1.500 M€ o más (3.060,62 M€ en 2026/27), 4,5 en otro caso (6.9.1). |
| Descubierto límite | 20 M€ | 5 M€ | Proporcional a ingresos. |
| Tipo préstamo | 4 % a 6 % | 4 % a 6 % | Propuesta. |
| Límite de préstamo | 60 M€ | 15 M€ | Proporcional a ingresos. |

### 14.2 Salarios y masa salarial

| Parámetro | Valor | Justificación |
|---|---|---|
| Salario anual máximo de referencia | 15 M€ en Primera; 2 M€ en Segunda [D] | Escala por ingresos de club. Tope de validación de carga; el juego no lo impone salvo como aviso. |
| Masa salarial de referencia de club medio | 60 % de INCN+traspasos [NV, P-10] | El límite de liga es el ratio de 60 %. |
| Personal técnico y de secretaría | 8 M€ anuales (Primera); 1,5 M€ (Segunda) [D] | Dato de partida del generador (15.5, B-7): Primera, 6 × 0,5 M€ de personal técnico + 2 M€ de secretaría + 3 M€ de dirección; Segunda, 4 × 0,15 M€ + 0,4 M€ + 0,5 M€. |

### 14.3 Seguros y médicos

| Parámetro | Valor | Justificación |
|---|---|---|
| Tasa de prima | 4 % del salario | Propuesta de equilibrio. |
| Cobertura gasto médico con seguro | 100 % | Propuesta. |
| Cobertura salario en baja larga | 80 % | Propuesta. |
| Coste diario médico Primera | 1.500 € | Propuesta. |
| Coste diario médico Segunda | 800 € | Propuesta. |

### 14.4 Estadio de referencia

| Parámetro | Primera | Segunda | Justificación |
|---|---|---|---|
| Aforo inicial | 42.800 | 18.000 | Propuesta de juego. No es dato de ningún club. |
| Ocupación media de referencia | 84,5 % | 68,5 % | Ocupaciones medias de 2024/25 [C, S-05] (v0.9; Segunda era 75 % [D]; el 61,7 % es de 2023/24). |
| Precio medio de taquilla | 45 € | 22 € | [D]. No hay datos de precio medio en la referencia. Ver 17.4. |
| Abonos | 60 % del aforo | 45 % del aforo | [D]. |
| Precio medio de abono | 600 € | 220 € | [D] dentro del rango de referencia de 55 € a 2.462 € [NV, P-04]. |

### 14.5 Derechos y reparto

| Parámetro | Valor | Justificación |
|---|---|---|
| Reparto entre divisiones | 90 % Primera / 10 % Segunda | [C] art. 5.2 del Real Decreto-ley 5/2015 (S-14). En comercialización, [D] por analogía. |
| Primera: igual / resultados / implantación | 50 % / 25 % / 25 % | [C] art. 5.3 (S-14). Ver 6.9.2. |
| Segunda: igual / resultados / implantación | 70 % / 15 % / 15 % | [C] mínimo legal del 70 % igual (art. 5.3.a); usar el mínimo y repartir el resto a mitades es [D] (decisión de producto 45). Ver 6.9.3. |
| Resultados en Primera | Escala 17 % … 0,25 %; 5 temporadas con pesos 35/20/15/15/15 | [C] art. 5.3.b.1.º (S-14). |
| Peso de la recaudación en la implantación | 1/3 | [C] art. 5.3.b.2.º (S-14). Cierra A-22. |
| Peso de la contribución televisiva en la implantación | 2/3 | [C] art. 5.3.b.2.º (S-14). Cierra A-22. |
| Límite de dispersión | 3,5 (4,5 si el importe repartido es menor de 1.500 M€) | [C] art. 5.5 (S-14). Sustituye a K = 4,0 [D]. Ver 6.9.1. |
| Fondo de compensación | 2,5 % | [C] art. 6.1 (S-14) para el porcentaje; detraerlo del pool audiovisual de Segunda es [D] (6.9.3). |

### 14.6 Entrenador

| Parámetro | Primera | Segunda | Justificación |
|---|---|---|---|
| Honorarios base | 1,2 M€ | 0,4 M€ | [D]. |
| Reputación inicial | 45 a 65 | 35 a 50 | [D]. |
| Umbral de renovación | 40 | 40 | [D]. |
| Umbral de oferta de división superior | 70 | 70 | [D]. |

### 14.7 Control económico

| Parámetro | Primera | Segunda | Justificación |
|---|---|---|---|
| Ratio masa salarial | 0,60 | 0,60 | [NV, P-10] para Primera; [D] para Segunda. |
| Pérdidas permitidas | 60 M€ | 15 M€ | [NV] para Primera (P-10, sin URL localizada). Valor de juego [D] fijado en v1.0. |
| Aviso de ratio UEFA de referencia | 0,70 | No aplica | [NV, P-10]. |

### 14.8 Equilibrio de ingresos por fuente (club de referencia de Primera)

Porcentaje orientativo de ingresos totales del club de referencia de Primera [D]: aforo 42.800 (7.1), R = 60, 19 partidos de local, posición 10.ª en las 5 temporadas del historial e implantación social media (6.9.2). Cifras de calc_v09/check.py (versión 1.0). Rangos y total aceptados por producto (A-26, decisión 40). Importes anclados por temporada:

- Derechos: 58,9703 M€ = audiovisual 57,1953 M€ (0,044375 × 1.288,908 M€, 6.9.2) + digital 1,775 M€ (0,044375 × 40 M€). En v0.8: 76,5 M€ (1/20 de 990 + 500 + 40 M€, todo atribuido a Primera).
- Comercialización: 63,2810 M€ = 0,044375 × 1.426,05 M€ (6.2.6). En v0.8: 79,25 M€ (1/20 de 1.585 M€ atribuidos solo a Primera).
- Patrocinio sin naming: 23 M€ (8.3; multiplicador 0,52 + 0,008 × 60 = 1,00).
- Naming: 12 M€ (8.3, [NV]; mismo multiplicador).
- Vallas: 19,26 M€ (6.2.8).

**Nota de validación**: el pool de comercialización (1.584,5 M€) está confirmado [C, S-02]; el audiovisual de 1.432,12 M€ es [E] (S-16) y el naming de 12 M€ sigue [NV]. El 90/10 de la comercialización es [D] (decisión 29).

| Fuente | Porcentaje | Valor calculado (v0.9) |
|---|---|---|
| Derechos audiovisuales (nacionales, internacionales y digitales) | 26 % a 32 % [D] (decisión 40; antes 29 % a 32 %) | 26,61 % |
| Comercialización de liga | 28 % a 33 % [D] (decisión 40; antes 30 % a 33 %) | 28,55 % |
| Taquilla y matchday (taquilla, abonos, palcos, hospitality, restauración de día de partido; la tienda de día va en merchandising) | 9 % a 18 % [D] (v0.5: mínimo bajado de 10 %) | 16,00 % |
| Patrocinio de club (zonas de 8.3 sin naming) | 4 % a 11 % [D] (decisión 40; antes 4 % a 10 %) | 10,38 % |
| Naming del estadio (8.3, 6.2.13) | 4 % a 6 % [D] (decisión 40; antes 4 % a 5 %) | 5,41 % |
| Vallas publicitarias (6.2.8) | 7 % a 9 % [D] (decisión 40; antes 7 % a 8 %) | 8,69 % |
| Merchandising (8.1, con la tienda fuera de día de partido) | 2 % a 3 % [D] (decisión 27) | 2,61 % (2,85 % en temporada de cambio de equipación) |
| Otros (museo, tours, premio de liga, eventos) | 0,5 % a 4 % | 1,75 % |

Los rangos son orientativos. Los valores exactos dependen de la simulación y se validan con la sección 14.9 (criterio 8).

**Validación de la tabla (versión 1.0)** [D]. Ingreso total de referencia del club de referencia de Primera: **221 M€** (decisión 40; cierre calculado 221,62 M€, redondeado a M€ entero). Sustituye al total de 254 a 260 M€ de las decisiones 24 y 28 (v0.6 y v0.7).

1. Importes anclados: 58,9703 + 63,2810 + 23 + 12 + 19,26 = 176,5113 M€.
2. Taquilla y matchday: 35,4480 M€ (taquilla 12,8105, con 674.235 € por partido tras descontar las plazas de palco, 6.2.1; abonos 15,408; palcos 5,415; hospitality 1,1258; restauración de día 0,6888).
3. Merchandising: 5,7853 M€ (8.1: tienda de día 0,4520; online 4,0895; camisetas 1,0923; tienda fuera de día de partido 0,1516, decisión 42). En v0.9, sin la tienda fuera de día de partido: 5,6337 M€.
4. Otros: 3,8712 M€ = museo 1,2164 + tours 0,1548 + premio de liga de la posición 10.ª, 2,5 M€ (6.9.4, incluido en "otros" por la decisión 37, B-7). Sin eventos (insonorización 0). La restauración fuera de día de partido ya no existe (decisión 42). Con el premio medio de Primera (2,085 M€) en lugar del de la posición 10.ª, "otros" sería 3,4562 M€.
5. Total: 176,5113 + 35,4480 + 5,7853 + 3,8712 = 221,62 M€ (221,6157 M€ sin redondear los sumandos; 221,46 M€ en v0.9). Las filas suman 100 % por construcción.
6. Suma de los rangos de la tabla: mínimos 80,5 %, máximos 116 %. El 100 % está dentro.
7. Por qué cambia el cierre [D] (v0.9): F-1 baja la comercialización del club de 79,25 a 63,28 M€ (pool de Primera de 1.426,05 M€ en vez de 1.585 M€ y posición 10.ª en vez de 1/20); F-2 y B-4 bajan los derechos de 76,5 a 58,97 M€ (audiovisual de Primera de 1.288,908 M€ en vez de 1.490 M€, y la escala legal de resultados, que da a la posición 10.ª el 2,75 % del tramo frente al 5 % medio); B-5 quita 0,81 M€ de taquilla (palcos). Con un total más bajo, patrocinio, naming y vallas, que no cambian en euros, pesan más y salen de sus filas de v0.8; por eso se amplían esas filas y bajan los mínimos de derechos y comercialización. No se cambia ninguna decisión F o B (instrucción de la ronda 0.9). Las ampliaciones de las filas de patrocinio (decisión 21), vallas (22) y naming (25) y el total de 221 M€ quedan aceptados por producto en v1.0 (A-26, decisión 40).
8. Referencia informativa: un club con exactamente 1/20 de cada pool y el premio medio cerraría en 236,70 M€.

**Histórico de validación (v0.6 a v0.8)**: anclas de 210,01 M€ (76,5 + 79,25 + 23 + 12 + 19,26), matchday de 36,26 M€ y merchandising de 5,63 M€; total de 254 a 260 M€ con "otros" entre 0,8 % y 3,1 % (decisiones 24 y 28). En v0.8 el "otros" calculado (1,371 M€) dejaba el total en 253,27 M€, por debajo de 254 M€; B-7 incluyó el premio de liga en "otros". Sustituido por la validación de v0.9.

Cambio respecto a v0.3 (histórico; los rangos vigentes son los de la tabla): el rango de 184 a 232 M€ no es compatible con patrocinio, naming y vallas. Con 210 M€ anclados, un total de 232 M€ deja 22 M€ para taquilla, merchandising y otros, que necesitan al menos 28 M€ (mínimos de 10 %, 1 % y 1 %). Por eso se bajan los rangos de derechos y comercialización para el total de 240 a 260 M€. Los pools no cambian (regla de 14.8: se ajustan los rangos y no los pools). La tabla sigue marcada como [D] hasta validarla con la simulación.

### 14.9 Pruebas de verificación del equilibrio

Criterios que la simulación debe cumplir antes de dar el juego por equilibrado. "Reputación media" [D] (v0.8): R = 60 en Primera y R = 40 en Segunda (los `R_ref_div` de 6.2.2); "reputación alta": R ≥ 80. Cada criterio se mide sobre 200 temporadas simuladas con semillas 1 a 200.

1. Un club de reputación media en Primera, con gestión conservadora, debe cerrar la temporada con saldo positivo en el 80 % de las simulaciones.
2. Un club de reputación alta que no inicia ninguna obra debe acumular saldo de forma sostenida; el juego debe presentar un coste de oportunidad claro.
3. Un club de Segunda con gestión agresiva (préstamos al máximo y fichajes) debe caer en descubierto en al menos el 50 % de simulaciones.
4. La ocupación media de un club de reputación media de Primera debe estar entre 80 % y 90 %, con la referencia de 84,5 % [C] (14.4).
5. Cada reparto de 6.9 (audiovisual, comercialización y digital, por división) debe respetar el límite legal de dispersión `L_disp` (3,5 con un importe repartido de 1.500 M€ o más) en el 100 % de las simulaciones. Se garantiza por construcción (6.9.2); el criterio verifica la implementación.
6. Un club de Segunda de reputación media debe tener una ocupación media entre 63,5 % y 73,5 %, con la referencia de 68,5 % [C] (14.4) [D] (v0.9; antes 70 % a 80 % con referencia de 75 % [D]). Con factores neutros, el modelo da 63,57 % (8.2).
7. Ninguna combinación de decisiones debe producir un ingreso neto mayor que el coste de oportunidad de la estrategia equivalente en la vida real (ver 19).
8. Las filas de 14.8 suman 100 % con el ingreso total del club de referencia de Primera, que con las estimaciones de 8.x cierra en 221,62 M€ (total de referencia de 221 M€, tolerancia ±1 M€) [D] (decisión 40). Cada fila cae en su rango: derechos 26,61 %, comercialización 28,55 %, matchday 16,00 %, patrocinio 10,38 %, naming 5,41 %, vallas 8,69 %, merchandising 2,61 % (2,85 % en temporada de cambio de equipación, dentro de 2 % a 3 %, decisión 27) y "otros" 1,75 % (mínimo 0,5 %, decisión 28).

---

## 15. Hipótesis de temporada 2026/27: estructura de carga de datos

Esta sección define cómo cargar los datos de partida. **Todos los datos de carga son ficticios** (decisiones de producto 5 y 6). Clubes, estadios, plantillas, jugadores, entrenadores y derechos se generan con el pool ficticio de 15.5. No se usan nombres ni datos personales de jugadores reales, ni nombres reales de clubes. Las cifras de referencia de la sección 6 solo sirven para calibrar. La carga de datos es una tarea posterior y separada.

### 15.1 Entidades a cargar

| Entidad | Cantidad esperada | Fuente de datos | Responsable |
|---|---|---|---|
| Competición | 2 (Primera y Segunda) | Reglas de la temporada | Diseño |
| Temporada | 1 (2026/27) | Calendario oficial | Diseño |
| Club | 42 (20 Primera, 22 Segunda) | Pool ficticio (15.5) | Diseño |
| Club de reserva | 3 (códigos T01 a T03) | Pool ficticio (15.6) | Diseño |
| Estadio | 1 por club | Generado con la plantilla de secciones de 7.1 | Diseño |
| Sección de estadio | 10 a 12 por estadio | Generada con 7.1 | Diseño |
| Plantilla | 1 por club | Generada (15.5) | Diseño |
| Jugador | 26 a 30 por club (Primera); 24 a 28 (Segunda) | Generado (15.5), nombres ficticios | Diseño |
| Contrato | Uno por jugador | Generado (15.5) | Diseño |
| Entrenador | 1 por club | Generado (15.5) | Diseño |
| Derechos audiovisuales | 1 por división y tipo | Calibrado con 6.2.4 y 14.1 | Diseño |

### 15.2 Campos mínimos de carga

**Club (carga)**:

```
codigo_club, nombre_mostrado, division, reputacion_inicial, aforo_total,
caja_inicial_cent, prestamos_iniciales (lista), modo_juego_base, ciudad_grande, renovacion_automatica,
recaudacion_historica_cent (5 enteros), historial_posiciones (5 pares), aforo_medio_anterior, turismo_alto,
secretaria_honorarios_anual, personal_costes_anual
```

[D] (v0.9): `recaudacion_historica_cent` = 5 temporadas iguales, cada una `partidos_local × taquilla_partido` de 8.2 y 6.2.1 con factores neutros (como `aforo_medio_anterior`, 6.9.2) y el precio `p_ref`, más `abonos_objetivo × precio_medio_abono` (6.2.2). Club de referencia: 19 × 674.235 € + 25.680 × 600 € = 28.218.465 € por temporada; 141.092.325 € en las 5 (en v0.8, solo taquilla: 68.113.575 €). `historial_posiciones`: las 5 temporadas con la posición del orden por reputación de la carga, en su división (6.9.2 y 6.9.3).

**Estadio (carga)**:

```
codigo_estadio, codigo_club, nombre_mostrado, aforo_total, secciones (lista de tipo y plazas),
cafeterias_numero, insonorizacion_nivel, cubierta, antiguedad_anios
```

**Jugador (carga)**:

```
codigo_jugador_interno (no real), posicion, nacionalidad_codigo, edad, valor_mercado_cent,
salario_anual_bruto_cent, anios_restantes, coste_fichaje_pendiente_cent, clausulas (lista de tipo e importe_cent; crea filas de Clausula, 4.10)
```

**Derechos (carga)**:

```
temporada, division, tipo, importe_total_temporada_cent, tramos (semana y porcentaje)
```

### 15.3 Reglas de carga

1. Los identificadores de jugador son internos y no se corresponden con personas reales en la versión base [D].
2. Ningún campo debe contener datos personales de jugadores reales (salvo que el proyecto tenga base legal para ello).
3. Los valores de carga se validan contra las reglas de 12.1 (plantilla), 12.2 (extranjeros) y 10.1 (control).
4. La carga se versiona: cada conjunto de datos lleva una fecha de referencia y su fuente.
5. Las cifras de origen externo tienen su propia etiqueta de confianza en el registro de carga.
6. Clubes: nombres y escudos ficticios. Códigos `P01` a `P20` (Primera), `S01` a `S22` (Segunda) y `T01` a `T03` (reserva). No se usan marcas (decisión de producto 6).

### 15.4 Clubes de partida para Promanager

[D] La lista de clubes desbloqueables se carga como tabla separada con: `club_codigo`, `condicion_desbloqueo` (objetivo y temporada), `division`, `reputacion_inicial`. No se incluyen nombres ni cifras en esta versión.

### 15.5 Pool ficticio de clubes, plantillas y jugadores [D]

Pool generado con una semilla fija para 1.ª y 2.ª división. Es ficticio. Sus valores se calibran con la sección 14.

| Parámetro | Primera | Segunda |
|---|---|---|
| Clubes | 20 (P01 a P20) | 22 (S01 a S22) |
| Jugadores con contrato por club | 28 (rango 26 a 30) | 26 (rango 24 a 28) |
| Reparto por posición | 3 porteros, 9 defensas, 9 centrocampistas, 7 delanteros | 3 porteros, 8 defensas, 8 centrocampistas, 7 delanteros |
| Jugadores inscritos | Entre 18 y 25 (12.1) | Entre 18 y 25 (12.1) |
| `calidad` | 50 a 90 | 40 a 78 |
| `velocidad` | 45 a 90 | 40 a 85 |
| `edad` | 18 a 35 | 17 a 36 |
| `salario_anual_bruto` | 0,3 M€ a 12 M€ | 0,1 M€ a 1,5 M€ |
| `valor_mercado` | 0,5 M€ a 60 M€ | 0,1 M€ a 8 M€ |
| Duración de contrato | 1 a 6 años | 1 a 4 años |
| Personal técnico por club | 6 | 4 |
| Aforo de estadio | 25.000 a 60.000 (referencia 42.800, 14.4) | 8.000 a 18.000 (referencia 18.000, 14.4) |
| Proporción de comunitarios | 80 % | 80 % |

Reglas del generador [D]:

- Valores de club [D] (v0.9, B-7, decisión 37), sorteados con el flujo 7:
  - `reputacion_inicial`: entero uniforme en 40 a 90 en Primera y en 20 a 60 en Segunda. El club `P10` tiene R = 60 fijo y es el club de referencia de 14.8.
  - `caja_inicial_cent` = 0,25 M€ × R en Primera (15 M€ con R = 60, el saldo inicial de 6.12) y 0,05 M€ × R en Segunda (2 M€ con R = 40). Sin préstamos iniciales.
  - Personal: Primera, 6 técnicos de 0,5 M€ con calidad 3 (los 6 roles de 4.19), secretaría 2 M€ y dirección 3 M€, 8 M€ en total (14.2); Segunda, 4 técnicos de 0,15 M€ con calidad 3, secretaría 0,4 M€ y dirección 0,5 M€ (1,5 M€).
  - `antiguedad_anios` del estadio: entero uniforme en 0 a 60. El club `P10` usa los valores del club de referencia (aforo 42.800 con las secciones de 7.1, antigüedad 0) [D] (v0.9).
  - `turismo_alto` = verdadero en los 3 clubes de mayor reputación de Primera.
  - Patrocinios de la carga: 8.3.
  - Los 4 roles sin efecto en las fórmulas (fisioterapeuta, ojeador, analista y ayudante) no se pueden despedir, para que despedirlos no ahorre unos 2 M€ sin coste.
- Los nombres de jugadores y entrenadores son ficticios. Antes de publicar el juego se revisa que no coincidan con nombres de personas reales conocidas.
- Cada club empieza con su plantilla completa, sin lesiones y con `condicion_fisica` 80 y `moral` 60 (9.12).
- Cada club tiene un estadio con las secciones de 7.1 escaladas al aforo asignado.

### 15.6 Ascenso, descenso y clubes de reserva [D]

| Concepto | Primera | Segunda |
|---|---|---|
| Ascenso directo | — | 1.ª y 2.ª |
| Promoción de ascenso | — | 3.ª a 6.ª. Cuadro de cuatro: 3.ª contra 6.ª y 4.ª contra 5.ª; los ganadores disputan una final. Partido único, resuelto con 5.5.3. Da una plaza. |
| Permanencia | 17.ª o mejor | — |
| Descenso | 18.ª a 20.ª, a Segunda | 20.ª a 22.ª, a Tercera (fuera del juego) |
| Plazas que quedan vacías | Se cubren con los 3 ascendidos de Segunda | Se cubren con 3 clubes del pool de reserva (T01 a T03). Solo afectan a plantilla y derechos |

El cálculo de plazas cuadra. Primera: 20 − 3 + 3 = 20. Segunda: 22 − 3 (ascienden) − 3 (descienden a Tercera) + 3 (llegan de Primera) + 3 (reserva) = 22. No hay promoción de permanencia en la versión base [D].

Precisiones [D] (v0.8):

- Promoción: las semifinales y la final se juegan en el campo del mejor clasificado en liga, con los ingresos normales de partido de local. Si hay empate, pasa el mejor clasificado (sin prórroga ni penaltis). La posición final de liga no cambia por la promoción (6.9.4 usa la de liga).
- Los cambios de división se aplican en la semana 52, después de evaluar objetivos y antes del reparto de la temporada siguiente (11.4).
- En cada semana 52, el generador de 15.5 crea 3 clubes de reserva nuevos (códigos `T04`, `T05`… en orden) con los parámetros de Segunda, para la temporada siguiente.
- Los clubes que bajan a Tercera dejan la partida (`activo = false`); sus jugadores con contrato pasan a libres. Si el club del jugador baja a Tercera, su entrenador pasa a `en_paro` (9.8) [D] (v0.9, B-2).

---

## 16. Decisiones abiertas

En v1.0 todas las filas están cerradas. La tabla se mantiene como registro.

| ID | Decisión | Opciones | Recomendación inicial | Impacto |
|---|---|---|---|---|
| A-01 | **Cerrada.** Origen de resultados, clasificación y lesiones | (a) módulo externo obligatorio; (b) simulación en el juego | (b). Decisión de producto 2, desarrollada en 5.5. | Cerrada. |
| A-02 | **Cerrada.** Quién gestiona las finanzas en modo Coach | (a) directiva con presupuesto fijo; (b) el jugador; (c) el sistema automático | (b). Decisión de producto 1, aplicada en 9.1. | Cerrada. |
| A-03 | **Cerrada (v1.0).** Naturaleza de la reputación del club y del entrenador | (a) índice único; (b) dos índices con efectos separados | (b) [D]: `Club.reputacion` (4.4, 9.6) y `Entrenador.reputacion` (4.11, 9.4) son campos distintos con efectos separados, como ya define el documento. | Cerrada. |
| A-04 | **Cerrada.** Importe del ciclo 2027/28 a 2031/32 | (a) total del ciclo; (b) anual | (a). Decisión de producto 18: 5.250 M€ de total, unos 1.050 M€ por temporada. | Cerrada. |
| A-05 | **Cerrada (v0.9).** Internacional: reparto por el mismo criterio que el nacional | (a) mismo criterio; (b) reparto igualitario | (a). Decisión 34 (B-4): mismo modelo legal, implantación social incluida (6.2.5, 6.9). | Cerrada. |
| A-06 | **Cerrada (v1.0).** Competiciones europeas y Copa | (a) fuera de alcance; (b) entrada externa con premios fijos | (a) [D]: fuera de la versión base (1.2); el objetivo `copa` tiene peso 0 (9.3). | Cerrada. |
| A-07 | **Cerrada (v1.0).** Primas por gol | (a) incluidas; (b) fuera | (b) [D]: `prima_gol_activa` = falso en la versión base (4.24, 6.3.4). | Cerrada. |
| A-08 | **Cerrada (v1.0).** Amortización de fichajes de invierno | (a) desde la temporada en curso; (b) desde la siguiente | (b) [D], ya aplicada en 6.3.3. | Cerrada. |
| A-09 | **Cerrada (v1.0).** Método de amortización de préstamos | (a) lineal; (b) francesa | (a) [D]: lineal por defecto. La francesa, ya especificada y con ejemplo de comprobación (6.7, 23.3), se mantiene como opción que el jugador elige al pedir el préstamo (13.6). | Cerrada. |
| A-10 | **Cerrada (v1.0).** Impuesto de tesorería sobre saldo positivo | (a) desactivado; (b) activado al 1 % semanal | (a) [D]: `impuesto_tesoreria_activo` = falso en la versión base (6.8). | Cerrada. |
| A-11 | **Cerrada (v0.9).** Venta forzosa por descubierto | (a) sí; (b) no, solo sanción | (a) con aviso previo. Decisión 31 (B-1): aviso al 2.º cierre seguido y venta automática al 3.º (6.11). | Cerrada. |
| A-12 | **Cerrada (v1.0).** Concesión de restauración | (a) explotación directa; (b) concesión con canon; (c) ambas | (a). Decisión de producto 43 (B-5d): solo explotación directa; la concesión con canon es ampliación futura (1.2, 8.5). | Cerrada. |
| A-13 | **Cerrada (v1.0).** Derechos de imagen de jugadores | (a) incluidos; (b) fuera | (b) [D]: `derechos_imagen_activos` = falso en la versión base (8.8). | Cerrada. |
| A-14 | **Cerrada (v1.0).** Efecto de condición física y moral en objetivos | (a) solo económico; (b) también en el rendimiento de la simulación 5.5 | (b) [D]: es la que ya aplica el documento (`velocidad_ef` y `moral_plantilla` en `S_club`, 5.5.2; 9.12.5) y la que da sentido a la decisión 33. La recomendación inicial (a) contradecía 5.5.2. | Cerrada. |
| A-15 | **Cerrada (v1.0).** Definición de comunitario y reglas de extranjeros | (a) lista UE y EEE; (b) incluir otros acuerdos | (a) [D]: UE, EEE y Suiza, como regla propia del juego (12.2). | Cerrada. |
| A-16 | **Cerrada (v0.9).** Pertenencia de Segunda al ciclo de derechos | (a) reparto por posición con fondo; (b) reparto igualitario | Decisión 30 (F-2): Segunda recibe el 10 % del pool audiovisual de liga (art. 5.2) y lo reparte con 70 % igual, 15 % resultados y 15 % implantación, más el fondo (6.9.3). | Cerrada. |
| A-17 | **Cerrada.** Tratamiento de clubes reales y licencias | (a) clubes ficticios; (b) clubes reales con marcas | (a). Decisión de producto 6. | Cerrada. |
| A-18 | **Cerrada (v1.0).** Fecha de cierre de ejercicio | (a) 30 de junio; (b) 31 de diciembre | (a) [D]: 30 de junio, semana 52 (4.2, 5.3). | Cerrada. |
| A-19 | **Cerrada (v1.0).** Fuente de la lista de extranjeros y de plantilla | (a) reglas propias; (b) reglas oficiales de la liga | (a) [D]: reglas propias (12). | Cerrada. |
| A-20 | **Cerrada.** Modo Promanager: clubes y desbloqueos | (a) lista fija; (b) generados por reputación | (a). Desbloqueo por objetivos del club actual (decisión de producto 11). | Campaña. |
| A-21 | **Cerrada.** Ocupación máxima de `grada_preferente` y `zona_vip`; tasa de llenado de eventos (8.6.3) frente a la ocupación de 8.2 | (a) fijar valores y usar una sola tasa; (b) mantener el llenado de eventos como función separada | (a). Preferente 0,80 y VIP 0,95 (decisión de producto 10). Los eventos usan su propia demanda y el mismo tope de ocupación global (8.6.3). | Cálculo de asistencia y de eventos. |
| A-22 | **Cerrada (v0.9).** Pesos social y televisivo (1/3 y 2/3) y fondo de compensación (2,5 %) | (a) mantener como propuesta [D]; (b) fijar con fuente de reparto | (b). Real Decreto-ley 5/2015 (S-14): 1/3 y 2/3 son la subdivisión del tramo de implantación social [C]; fondo del 2,5 % [C] (art. 6.1). | Cerrada. |
| A-23 | **Cerrada (v0.5).** Conexión de `fans_activos` con la asistencia | (a) mantener como base de aficionados de estadio y definir su fórmula; (b) eliminarlo | (a). Factor `f_fans` en 8.2 (peso 0,20; rango 0,90 a 1,10; decisión 26). Dinámica con moral o resultados, fuera de la versión base. | Asistencia y ocupación (8.2). |
| A-24 | **Cerrada (v0.5).** Merchandising por debajo del rango de 14.8 | (a) subir la estimación de 8.1; (b) bajar el rango de 14.8 | (a), por decisión 27: rango 2 % a 3 %; base de seguidores de 8.000 por punto de reputación (8.1). | Validación de 14.8 (merchandising, 2 % a 3 %). |
| A-25 | **Cerrada (v0.6).** Cierre de 14.8 con las estimaciones de matchday y merchandising | (a) calibrar la estimación de matchday (6.12, 8.2, 8.6) con la simulación; (b) aceptar el rango real de cierre | (b) en v0.6: total de 14.8 en 254 a 260 M€ (decisión 24, corregida). La calibración de matchday sigue como ajuste posterior con la simulación (criterio 8 de 14.9). | **Cerrada (v0.6)**. En v0.9, con F-1, F-2, B-4 y B-5, el cierre calculado pasa a 221,46 M€ (221,62 M€ en v1.0) y el total de referencia a 221 M€ (14.8); ver A-26. |
| A-26 | **Cerrada (v1.0).** Rangos de las filas de 14.8 tras el cierre de v0.9 | (a) confirmar las filas ampliadas (derechos 26 % a 32 %, comercialización 28 % a 33 %, patrocinio 4 % a 11 %, naming 4 % a 6 %, vallas 7 % a 9 %); (b) recalibrar patrocinio, naming y vallas en euros para volver a los rangos de v0.8 | (a). Decisión de producto 40: filas ampliadas y total de referencia de 221 M€ [D]; sustituye los rangos de las decisiones 21, 22, 24 y 25. | Cerrada. |

---

## 17. Datos no verificados y lagunas

### 17.1 Datos no verificados

| Dato | Origen | Problema | Tratamiento en el juego |
|---|---|---|---|
| Impuesto semanal del 1 % sobre saldo de caja | Usuario de la comunidad de PC Fútbol | No verificado en fuente oficial. | Desactivado (A-10). |
| Pérdidas permitidas de 60 M€ | Referencia de investigación | Se toma como dato de 2024/25; año de vigencia no confirmado en todas las fuentes. | Usado como límite de Primera, como valor de juego [D] fijado en v1.0. Fuente P-10 sin URL localizada: marcado [NV]. |
| Patrocinio de camiseta de club grande: unos 75 M€ anuales | Prensa | No confirmado. | Solo como orientación (8.3). |
| Naming de un estadio de club grande: unos 20 M€ anuales | Prensa | No confirmado. | Solo como orientación (8.3). |
| Naming de otro estadio de club grande: 250 a 300 M€ | Prensa | Estimación de prensa. | Solo como orientación. |
| Acuerdo de explotación de un estadio de club grande: unos 360 M€ en 20 años | Prensa y cálculo | Importe y reparto estimados. | Solo como referencia de concepto de explotación. |
| Cifras de caída de ingresos por conciertos en un estadio de club grande | Prensa | Sin confirmar. | No usado. |
| Límite de inversión en fichajes de dos clubes de referencia: 754 M€ y 426 M€ | Referencia de investigación | Año no indicado. | Solo como ejemplo de magnitud; no se usa en el juego (10.1 usa 1,5 × INCN). |
| Precio de referencia de abonos 2025/26 | Referencia | Rangos de precio publicados por club, sin fecha de consulta. | Se usa el rango general. |
| Presupuesto de un estadio en proyecto (202,7 M€) | Referencia | Dato de proyecto; no se usa en el juego. | No usado. |
| Coste de un estadio en proyecto: por debajo de 270 M€ | Prensa | Estimación. | No usado. |
| Ingresos 2024/25 de LaLiga: 5.464 M€ | Informe de LaLiga | Discrepancias internas del propio informe (ver 17.2). | Se usa 5.464 M€ con nota de discrepancia. |

### 17.2 Discrepancias internas

1. **Ingresos de LaLiga 2024/25**: los desgloses no cuadran con el total. Comercialización 1.585 M€ + audiovisual 1.576 M€ (máximo del rango 1.430 a 1.576 M€) + taquilla 902 M€ = 4.063 M€, frente a 5.464 M€ del total; la diferencia de 1.401 M€ no está explicada en las fuentes. Se usa el total de 5.464 M€ [NV] y los desgloses no se usan como base. Tratamiento: calibrar con el total. Precisión de v0.9 [C, S-02]: todas estas cifras son del agregado de 42 clubes (Primera y Segunda). El Cuadro 1 da también UEFA (406,6 M€) y traspasos (796,7 M€), que podrían explicar buena parte de la diferencia (no verificado en la conciliación del informe); el informe da 5.464,0 M€ normalizados en el texto y 5.591,6 M€ en la tabla, sin conciliarlos. Retransmisión: 1.429,7 M€ en el Cuadro 1 y 1.576,3 M€ ajustados en el texto.
2. **Asistencia 2025/26**: 17.535.164 espectadores frente a una media de 20.776 por partido. Con 380 partidos la media sería 46.145 por partido, y con 844 partidos cuadra la cifra media. La combinación no es coherente; no se usa el dato de media por partido en el juego.
3. **Derechos nacionales**: 990 M€ por temporada del contrato nacional (solo partidos de Primera [E]) frente a 1.430 a 1.576 M€ de audiovisual total de las dos divisiones. Tratamiento en v0.9: el juego usa el reparto audiovisual de 2024/25 (1.432,12 M€ [E, S-16]) como pool de liga y le aplica el 90/10 del art. 5.2; los 442,12 M€ por encima del contrato nacional se atribuyen a internacional y contratos de Segunda [E] (6.2.4, 6.2.5).
4. **Ratio 1,5x de deuda neta / EBITDA**: es un resultado de 2024/25, no un límite. Tratamiento en 10.1.
5. **Ciclo 2027/28-2031/32**: la cifra de 5.250 M€ coincide con la suma de los dos operadores. Se trata como total de ciclo (A-04, cerrada por decisión de producto 18).
6. **Estadio de club grande (reforma)**: la inversión se reporta en 1.407,7 M€ y en 1.408 M€ según prensa; la diferencia se considera redondeo [E]. Un artículo menciona un desvío de 40 M€ no explicado; no se usa.

### 17.3 Lagunas de información

| Laguna | Efecto en el diseño |
|---|---|
| Segunda División: cifras por club | Los ingresos totales por club no están publicados en la parte accesible de S-02. Solo hay un proxy: unos 6,4 M€ de audiovisual medio por club en 2024/25 (140,03 / 22) [E, S-16]; en el juego, 143,212 / 22 = 6,51 M€. El resto de valores de Segunda son propuesta [D]. |
| Precio medio de entrada (taquilla) | Se propone en 14.4. |
| Número de abonados y precios dinámicos | Modelo propio de 8.2. |
| Restauración y concesiones | Modelo propio de 8.5 (solo explotación directa; concesión como ampliación futura, decisión 43). |
| Fan tokens y cifras de ingresos digitales | Modelo de 6.2.5 (reparto con el modelo legal de 6.9; 8.7 eliminado) con valores [D]. |
| Avales de LaLiga | Fuera de alcance; no se simulan avales. |
| Estadio de un club de referencia de otra comunidad | No investigado. No se usa. |
| Manual de PC Fútbol 6 | No localizado en esta revisión. Las mecánicas de PC Fútbol 6 provienen de la investigación previa. |
| Mecánicas de moral, condición física y entrenamientos | Sin fuentes; decisiones de diseño (9.12). |
| Cifras de la temporada 2026/27 | No hay datos de la temporada en curso en las fuentes. Se trabaja con 2025/26 y 2024/25. |

### 17.4 Dato de precio de taquilla

No hay precios medios de entrada en las fuentes de la investigación previa. Los valores de 45 € y 22 € son propuesta [D] y deben sustituirse si se consigue el dato.

---

## 18. Reglas de contenido y de datos personales

### 18.1 Jugadores y clubes

- Los nombres de jugadores, entrenadores y clubes reales no se incluyen en la versión base [D].
- Las marcas, escudos y nombres de estadio son ficticios en el juego (decisión de producto 6; A-17 cerrada).
- Los datos de cuentas de clubes reales se usan solo como referencia de magnitud.
- Los títulos y URL de las fuentes del Anexo (21) pueden contener nombres de clubes reales. Son citas bibliográficas y no pasan al juego. En las descripciones del Anexo se usan denominaciones genéricas (revisión de coherencia, v0.2).

### 18.2 Datos de referencia

- Los datos de la referencia que citan personas (por ejemplo, declaraciones o cifras de directivos) no se incluyen en el juego.
- Los valores de referencia se citan en el Anexo con su URL cuando se localizó.

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

## 20. Glosario de identificadores y enumeraciones

| Enumeración | Valores |
|---|---|
| `division` | `primera`, `segunda` |
| `modo_juego` | `coach`, `manager`, `president`, `total`, `promanager` |
| `tipo_objetivo` | `posicion_final`, `puntos_minimos`, `copa`, `presupuesto_no_superar`, `saldo_minimo`, `aforo_medio_minimo`, `fichajes_maximos`, `permanencia` |
| `tipo_seccion` | `grada_general`, `grada_preferente`, `grada_fondo`, `palcos`, `hospitality`, `zona_vip`, `museo`, `tienda_fisica`, `restauracion`, `zona_eventos`, `aparcamiento` |
| `tipo_obra` | Ver 7.2 |
| `estado_obra` | `planificada`, `en_curso`, `finalizada`, `cancelada` |
| `estado_contrato` | `vigente`, `rescindido`, `finalizado`, `cedido` |
| `forma_pago` | `doce_mensualidades`, `diez_mensualidades`, `aplazado` |
| `estado_movimiento` | `previsto`, `efectivo`, `anulado` |
| `categoria_movimiento` | `taquilla`, `abonos`, `palcos`, `hospitality`, `derechos_tv`, `comercializacion`, `patrocinio`, `vallas`, `merchandising`, `restauracion`, `museo`, `eventos`, `naming`, `traspasos`, `seguros_cobro`, `competicion`, `salarios_jugadores`, `personal`, `amortizacion`, `primas`, `rescision`, `seguros_gasto`, `medico`, `mantenimiento`, `obras`, `prestamos`, `impuestos`, `clausula_casa_coche`, `honorarios_tecnico`, `intereses_descubierto`, `explotacion_cafeterias`, `entrenamientos`, `sanciones`, `aparcamiento`, `derechos_imagen` (v0.8) |
| `tipo_contrato_derechos` | `nacional`, `internacional`, `digital`, `comercializacion` (v0.8) |
| `formula_clausula` | `fija`, `por_anios_restantes`, `por_numero_casa_coche` (v0.8) |
| `estado_temporada` | `pretemporada`, `competicion`, `cerrada` (v0.8) |
| `forma_cobro` | `mensual`, `trimestral`, `anual_inicio` (v0.8) |
| `subcategoria` de `prestamos` | `principal`, `intereses` (v0.8) |
| `tipo_evento` | `concierto`, `evento_corporativo`, `competicion_no_futbol`, `otro` |
| `estado_evento` | `propuesto`, `confirmado`, `celebrado`, `cancelado`, `vetado` |
| `estado_entrenador` | `activo`, `despedido`, `dimitido`, `en_paro` |
| `estado_oferta` | `pendiente`, `aceptada`, `rechazada`, `caducada` |
| `zona_patrocinio` | `camiseta_pecho`, `camiseta_manga`, `camiseta_espalda`, `estadio_fondo`, `estadio_led`, `entrenamiento`, `digital`, `naming` |
| `posicion_jugador` | `portero`, `defensa`, `centrocampista`, `delantero` |
| `intensidad_entrenamiento` | `suave`, `normal`, `intenso` |

---

## 21. Anexo: fuentes

Las URLs marcadas con [U] se localizaron en esta revisión mediante búsqueda. Su contenido no se ha leído completo en esta revisión; las cifras proceden de la investigación previa y deben contrastarse con la fuente antes de publicar el juego.

### 21.1 Fuentes de LaLiga (economía, 2024/25 y 2025/26)

| Ref. | Contenido | Año | URL | Estado |
|---|---|---|---|---|
| S-01 | Comunicado de cierre de temporada: ingresos y asistencia récord | 2024/25 y 2025/26 | https://www.laliga.com/noticias/laliga-cierra-la-temporada-con-maximos-historicos-en-ingresos-y-asistencia | [U] |
| S-02 | Informe económico 2024/25 en PDF | 2024/25 | https://assets.laliga.com/assets/2026/03/18/originals/5658090da03d3a5134540accdc341c89.pdf | [U]. Leído en parte el 23/10/2026 (pp. 1 a 36 aprox.; anexos no accesibles): comercialización 1.584,5 M€ y retransmisión 1.429,7 M€ (Cuadro 1), agregado de 42 clubes, sin desglose por división. |
| S-03 | Cobertura de prensa del informe de ingresos 2024/25 (más de 5.400 M€) | 2024/25 | https://theobjective.com/actualidad/2026-03-18/laliga-5400-millones-euros-ingresos-2024-2025/ | [U] |
| S-04 | Transparencia de LaLiga: derechos audiovisuales (reparto y criterios) | 2024/25 | https://www.laliga.com/transparencia/gestion-economica/derechos-audiovisuales | [U] |
| S-05 | Nota de prensa de LaLiga (18/03/2026): máximo histórico de ingresos y más de 17 millones de espectadores; ocupación 84,5 % en Primera y 68,5 % en Segunda | 2024/25 | https://www.laliga.com/noticias/laliga-alcanza-un-nuevo-maximo-historico-de-ingresos-y-supera-los-17-millones-de-espectadores | [U]. Ocupaciones verificadas el 23/10/2026 (v0.9; antes fechada en 2025/26). |
| S-14 | Real Decreto-ley 5/2015, versión consolidada (arts. 5.2, 5.3, 5.5 y 6.1) | Vigente | https://www.boe.es/eli/es/rdl/2015/04/30/5/con | Leído el 23/10/2026. Texto consolidado informativo, sin valor jurídico. |
| S-15 | Prensa: venta de los derechos nacionales 2022/23-2026/27 por 4.950 M€ (solo Primera) | 2021 | https://www.moncloa.com/2021/12/13/laliga-consigue-venta-historica-tv-clubes-aficionados-futbol-espanol-1142095/ | [U]. Confirmado solo por prensa. |
| S-16 | Reparto audiovisual 2024/25: nota informativa del órgano de control (tablas no legibles) y prensa con los totales (1.432,12 M€; Primera 1.292,09; Segunda 140,03) | 2024/25 | https://www.laliga.com/es-ID/noticias/nota-informativa-reparto-de-los-ingresos-audiovisuales-de-la-temporada-2024-2025 ; https://www.marketingregistrado.com/futbol/2025/reparto-dinero-derechos-television-laliga-45344/ ; https://www.elgoldigital.com/futbol/laliga-reparto-television-2024-2025-ranking-clubes/ | Total confirmado por varias fuentes; desglose por división de una sola fuente de prensa [E]. Una tercera fuente con el desglose tiene nombre de club en la URL: [URL retirada]. |

### 21.2 Fuentes de clubes (prensa)

| Ref. | Contenido | Año | URL | Estado |
|---|---|---|---|---|
| S-06 | Cuentas de un club de referencia máxima: ingresos de explotación 1.221 M€ | 2025/26 | URL retirada por contener nombre de persona. La misma cifra consta en S-07. | [U] |
| S-07 | Prensa deportiva: ingresos de explotación de un club de referencia máxima, 1.221 M€ | 2025/26 | [URL retirada] | [U] |
| S-08 | Inversión en la reforma de estadio de un club de referencia máxima: 1.408 M€ | 2025/26 | https://www.idealista.com/news/node/908465 | [U] |
| S-09 | Desvío de 40 M€ en la reforma de estadio de un club de referencia máxima | 2025/26 | [URL retirada] | [U] |

### 21.3 Fuentes de la referencia de PC Fútbol

| Ref. | Contenido | Año | URL | Estado |
|---|---|---|---|---|
| S-10 | Historia y contexto de PC Fútbol 5.0 | 1996-97 | https://en.wikipedia.org/wiki/PC_F%C3%BAtbol_5.0 | [U]. No leído en detalle. |
| S-11 | Artículo sobre el regreso de PC Fútbol | Contexto | https://www.elgrafico.com.ar/articulo/esports/75274/el-regreso-del-pc-futbol-un-clasico-inoxidable | [U]. No leído en detalle. |
| S-12 | Colección de revistas de la saga PC Fútbol | Contexto | https://archive.org/details/pc-futbol-revistas | [U]. No leído en detalle. |
| S-13 | Historia de PC Fútbol (auge y caída) | Contexto | https://www.421.news/dinamic-multimedia-pc-futbol | [U]. No leído en detalle. |

### 21.4 Fuentes de la investigación previa sin URL recuperada

Las siguientes referencias proceden de la investigación previa, pero su URL no se recuperó en esta revisión. Deben localizarse antes de citarlas en público. No bloquean el desarrollo [D] (v1.0): ninguna regla depende de ellas, y las cifras relacionadas se usan con su etiqueta [D], [E] o [NV] actual.

| Ref. | Contenido | Año | Estado |
|---|---|---|---|
| P-01 | Mecánicas de PC Fútbol 6 (caja, préstamos, cláusula casa y coche, entrenador) | PC Fútbol 6 | Pendiente de URL primaria (manual). |
| P-02 | Reparto por club 2024/25 (clubes de referencia máxima, alta y grupos) | 2024/25 | Pendiente. Puede estar en S-02. |
| P-03 | Asistencia 2025/26 y media por partido | 2025/26 | Pendiente. Véase 17.2. |
| P-04 | Precios de abonos 2025/26 por club | 2025/26 | Pendiente. |
| P-05 | Club de referencia máxima: ingresos, pérdidas, patrimonio, acuerdos de estadio, notas de prensa 2026 | 2025/26 | Pendiente. |
| P-06 | Club de referencia alta: naming de su estadio | 2024-2033 | Pendiente. |
| P-07 | Club de referencia media: proyecto de estadio nuevo | 2027 | Pendiente. |
| P-08 | Club de referencia media: proyecto de estadio | Proyecto | Pendiente. |
| P-09 | Límite de inversión en fichajes (dos clubes de referencia máxima) | Sin año | Pendiente. |
| P-10 | Resultados de LaLiga 2024/25: resultado neto -81 M€, ratio 60 %, umbral UEFA 70 % | 2024/25 | Pendiente. |
| P-11 | Derechos 2027/28-2031/32 (operadores de emisión A y B; nombres en la fuente) | 2027/28 | Pendiente. |

---

## 22. Historial de cambios del documento

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 22/10/2026 | Primera versión completa como borrador de referencia. |
| 0.2 | 22/10/2026 | Coherencia revisada. Decisiones de producto aplicadas: Coach con caja del jugador (9.1); simulación de resultados, clasificación y lesiones (5.5); cobros y pagos mensuales con orden de liquidación (5.1.1, 5.2, 6.5); partida en 2026/27 (5.1, 11.1); plantillas y clubes ficticios (15, 15.5, 15.6, 18). Se cierran A1 a A12 del informe de revisión, con la fórmula de ocupación única (8.2) y el pool de Primera y Segunda (15.5 y 15.6). Sigue abierta A-04. |
| 0.3 | 22/10/2026 | Decisiones de producto 7 a 19 aplicadas: pools solo de Primera, derechos digitales por tercios (8.7 eliminado), factor de situación posición × racha, ocupación máxima preferente 0,80 y VIP 0,95, cobros y pagos mensuales en el primer tick, baja muy larga de 120 días y lesiones de 3 a 150, premio de permanencia como gasto, aforo propio de eventos, INCN y masa salarial definidas, cláusulas en `Clausula`, ciclo 2027/28 de 5.250 M€ como total, K = 4,0 como decisión [D]. Pendientes técnicos cerrados con propuesta [D]: factores sin definición, abonados de cinco años (4.23), categoría `explotacion_cafeterias`, plantilla con portero, impuesto de sociedades en la semana 4, cuotas aplazadas, trazabilidad de fuentes y anexo. Quedan abiertos A-22 (pesos social y televisivo y fondo de compensación, sin fuente) y la confirmación de las fuentes marcadas [NV] o [C-P] (ver 17). |
| 0.4 | 22/10/2026 | Ronda de coherencia sobre las decisiones de producto. Coach: sin objetivo `presupuesto_no_superar` ni techo de gasto (9.1, 9.3, 9.13, 10.4, 13.1). Nuevo `seguidores_club` (4.4) para tienda online y camisetas (8.1); `fans_activos` solo para asistencia y ocupación. Patrocinio de 8.3 sin cambio de cifra; rango de 14.8 al 4 % a 10 %. Vallas en fila propia de 14.8 (7 % a 8 %). Naming en fila propia de 14.8 (4 % a 5 %). Validación de 14.8 rehecha para un total de 240 a 260 M€; rangos de derechos y comercialización ajustados sin tocar los pools. Pool digital de 40 M€ por tercios, sin sumar al nacional; 8.7 aclarado. Etiquetas [C-P] con fuente no leída pasan a [NV]. Quedan A-23 (`fans_activos`) y A-24 (merchandising fuera de 14.8). |
| 0.5 | 22/10/2026 | Ronda de cuatro decisiones de producto (filas 24 a 27 de 0.3). (1) Total de 14.8 en 240 a 260 M€, rangos de derechos y comercialización sin cambio. (2) Naming en fila propia, sin cambio. (3) `fans_activos` como factor `f_fans` en la demanda de 8.2 (peso 0,20; rango 0,90 a 1,10); campo en 4.4; ejemplos de 6.12 y 8.2 recalculados (asistencia 37.761; taquilla 0,717 M€; saldo de agosto 19,8 M€). Cierra A-23. (4) Merchandising al 2 % a 3 % (8.1 y 14.8): base de seguidores de 8.000 por punto de reputación (antes 1.000; 505.680 en el club de referencia), estimación de 5,63 M€, y mínimo de taquilla y matchday de 10 % a 9 % para que la suma de mínimos quepa en el resto de 240 M€ (12,5 %), sin que la tabla cierre en 240 M€ con estimaciones (A-25). Cierra A-24 y abre A-25 (cierre de 14.8 con estimaciones, 254,4 a 260,0 M€). El concierto de 8.6.3 y la ocupación máxima (0,8904; 38.110 plazas) no cambian. |
| 0.6 | 22/10/2026 | Corrección de la ronda 0.5 y pendientes altos de la revisión v0.5. (1) Total de 14.8 en 254 a 260 M€ (antes 240 a 260 M€; decisión 24 corregida). Cierre con estimaciones entre 254 y 260 M€; A-25 cerrada. Queda abierto el 0,8 % de "otros" a 254 M€ (nota de validación de 14.8). (2) Anclas de derechos nacionales, comercialización y naming marcadas [NV], sin cambio de cifras. (3) 8.1: frase del royalty de camiseta al 71 % eliminada, por no reproducirse con los datos del documento; alternativa de conversión y ticket descrita sin royalty. (4) 6.2.8: `precio_valla_partido` definido [D] (derivado de la modalidad A; 947 € en Primera). (5) Merchandising de 8.1 recalculado a 254 y 260 M€ (2,2 %). (6) Anexo: URLs de S-07 y S-09 retiradas (nombres de clubes) y sustituidas por [URL retirada]; títulos genéricos. Sin cambio de decisiones de producto ni de fuentes. |
| 0.7 | 22/10/2026 | Mínimo de "otros" en 14.8 bajado de 1 % a 0,5 % (decisión de producto 28, sección 0.3). Suma de mínimos de 14.8: 85,5 %. Cierre de 14.8 sin cambio: total de 254 a 260 M€, "otros" entre 0,8 % y 3,1 %. |
| 0.8 | 23/10/2026 | Revisión final de implementabilidad. Ejemplos recalculados con python3 -I sin errores (6.12, 8.1, 8.2, 8.6.3, 14.8). Correcciones técnicas [D] sin cambio de balance: redondeo, generador aleatorio y caja frente a resultado (4.1); campos nuevos en `Club`, `Estadio`, `Obra`, `Jugador`, `Entrenador`, `Movimiento` y `Prestamo`; entidades `Partida`, `Partido`, `Clasificacion` y `Cesion` (4.24 a 4.27); semanas de jornada y calendario (5.4); titulares, minutos y ajuste de goles (5.5); impuestos al orden 1.º de 6.5 (contradicción con 6.10); filas de patrocinio trimestral y anual, royalty de camisetas, cesiones y vallas B en 6.5; `porcentaje_abonados` (6.2.2) y tipo de interés (6.7) con fórmula dentro del rango ya fijado; beneficio contable y compensación de pérdidas (6.8); precisión de K y fondo de Segunda (6.9); aforo de obras (7.2, 7.4); distribución de días de lesión (9.12.4); objetivos de posición en Primera (9.3); comprobación intermedia (10.3); pantallas de Promanager y Manager (13.1); promoción y clubes de reserva (15.6); orden de las tablas 16 y 22; enumeraciones de 20. Puntos que cambian el balance, marcados [pendiente de producto] y propuestos en revision_final_v08.md. Nueva sección 23 (checklist de implementación). Sin cambios en decisiones de producto ni en cifras de fuente. |
| 0.9 | 23/10/2026 | Decisiones de producto F-1, F-2, B-1 a B-7 y dos añadidos de determinismo aplicados (filas 29 a 39 de 0.3). **F-1**: 1.585 M€ (1.584,5 M€ [C]) de comercialización son de Primera y Segunda; 90/10 [D] (1.426,05 / 158,45 M€); se corrigen todas las menciones a "solo Primera" (6.2.6, 14.1, 14.8, 17.2, filas 7 y 24 de 0.3). **F-2**: reparto según el Real Decreto-ley 5/2015 [C]: 90/10 entre divisiones; en Primera 50 % igual, 25 % resultados (escala legal y 5 temporadas) y 25 % implantación (1/3 recaudación, 2/3 audiencia); en Segunda 70/15/15 (mínimo legal); límite de dispersión de 3,5 (4,5 bajo 1.500 M€); fondo del 2,5 % mantenido. Pool audiovisual de liga de 1.432,12 M€ [E] (Primera 1.288,908; Segunda 143,212), que sustituye a 990 + 500 M€ y 120 M€; ocupación de Segunda 68,5 % [C] (14.4, criterio 6). El reparto "por tercios" pasa a ser la subdivisión de la implantación; el factor K = 4 queda redundante con el límite legal de 3,5, que es más estricto, y se elimina (6.9, decisión 19). Campos `recaudacion_historica_cent` (antes `taquilla_historica_cent`) e `historial_posiciones` (4.4, 15.2). **B-1**: mercado (13.2, 13.3), renovación de jugadores (9.9), clubes no controlados, venta forzosa (6.11, cierra A-11), sin cesiones entrantes; bloqueo de venta en la ventana de llegada [D] para cerrar la compra, renovación y reventa. **B-2**: tres objetivos (deportivo, `saldo_minimo` = 0 y ocupación 0,80 / 0,70); Manager con `presupuesto_no_superar` de 10.4; en Coach y Promanager no se asigna `saldo_minimo` porque equivale a un presupuesto (decisión 1), y solo cuentan deportivo y ocupación; entrenador `en_paro` con al menos 1 oferta; club de destino y rescisión a cargo del destino (9.8). **B-3**: recuperación en semanas con partido solo por plan; la columna de condición física de 9.12.3 pasa a +3 / +2 / +1 para que el plan intenso recupere menos, como dice la decisión (la redacción de B-3 en el informe dejaba +3 en intenso). **B-4**: comercialización, internacional y digital con el modelo legal; posición de Segunda de la temporada anterior (cierra A-05 y A-16). **B-5**: patrocinio × (0,52 + 0,008 R) con contratos de carga y ofertas; precio de taquilla entre 50 % y 200 % de `p_ref`; plazas de palco fuera de la taquilla (674.235 € por partido). Quedan pendientes B-5c (ingresos fuera de día de partido) y B-5d (canon de concesión), no decididas. **B-6**: bloqueo del 10 % de la sección en ampliaciones; hospitality de 250 plazas por zona; 30 palcos por obra; aparcamiento de 1.500 plazas; reforma general; parámetros del promotor y multa de horario (7.2, 7.3, 7.7, 8.6). **B-7**: premio de liga en "otros"; generador con caja 0,25 M€ × R y personal de 8 M€ (15.5). **Determinismo** [D]: PCG32 con `initseq = k` y librería matemática propia del núcleo, sin `Math.pow`, `Math.exp` ni `Math.log` (4.1, criterio en 23.2). **Cifras** (calc_v09/check.py): club de referencia de Primera (posición 10.ª, implantación media) con audiovisual 57,1953 M€, digital 1,775 M€ y comercialización 63,2810 M€ (antes 74,5 + 2 + 79,25 M€); taquilla 674.235 € por partido; saldo de agosto de 6.12 de 18,0 M€ (17.961.014,25 €); INCN 135,06 M€ y ratio de masa salarial 0,513. **14.8**: el cierre calculado baja a 221,46 M€, fuera de 254 a 260 M€; sin cambiar ninguna decisión F o B, el total de referencia pasa a 221 M€ [D] y se amplían las filas de derechos (26 % a 32 %), comercialización (28 % a 33 %), patrocinio (4 % a 11 %), naming (4 % a 6 %) y vallas (7 % a 9 %) [D]; "otros" queda en 1,75 %. Ampliaciones de filas pendientes de confirmación (A-26). Nuevas fuentes S-14 a S-16. |
| 1.0 | 23/10/2026 | 1.0 — especificación cerrada para desarrollo. Decisiones de producto definitivas (filas 40 a 48 de 0.3): (1) A-26 aceptada: rangos de 14.8 de patrocinio 4 % a 11 %, naming 4 % a 6 %, vallas 7 % a 9 %, derechos mínimo 26 % y comercialización mínimo 28 %, y total de referencia de 221 M€ [D]; las decisiones 21, 22, 24 y 25 quedan sustituidas por A-26 (decisión 40). (2) B-3: el plan intenso recupera menos (+3 / +2 / +1, decisión 41); se elimina la nota de conflicto de 9.12.3. (3) B-5c: tienda física fuera de día de partido = visitas de museo y tours del mes × 0,04 × 35 € [D] (8.1, nueva fila mensual en 6.5; 151.620 € al año en el club de referencia); se elimina la restauración fuera de día de partido de 6.5 y de 14.8 (decisión 42). (4) B-5d: solo explotación directa de la restauración; concesión con canon fuera de alcance como ampliación futura (1.2, 8.5; decisión 43, cierra A-12). (5) Elecciones del redactor de v0.9 confirmadas: umbral de 1.500 M€ sobre la suma de todos los pools (44), Segunda 70/15/15 (45), sin `saldo_minimo` en Coach y Promanager (46), sin reventa en la ventana de compra (47). Cierre de las decisiones abiertas restantes con la recomendación de la sección 16 [D] (decisión 48): A-03 (b), A-06 (a), A-07 (b), A-08 (b), A-09 (a, lineal por defecto y francesa como opción en 13.6), A-10 (a), A-13 (b), A-15 (a), A-18 (a), A-19 (a); A-14 se cierra con (b), la opción que ya aplicaba 5.5.2 (la recomendación inicial (a) la contradecía). Fuentes P-01 a P-11 (21.4) marcadas como no bloqueantes. **Cifras** (calc_v09/check.py actualizado, con comprobación automática de las filas de 14.8): merchandising 5,7853 M€ (6,3315 M€ con cambio de equipación); cierre de 14.8 221,62 M€ (221,6157 M€): derechos 26,61 %, comercialización 28,55 %, matchday 16,00 %, patrocinio 10,38 %, naming 5,41 %, vallas 8,69 %, merchandising 2,61 % (2,85 %), otros 1,75 %; referencia 1/20 236,70 M€. Sin cambios en 6.12, INCN ni en el resto de ejemplos. Pérdidas permitidas de 60 M€ fijadas como valor de juego [D] (antes "provisional"). Regla general de 0.1 actualizada. |

---

## 23. Checklist de implementación [D] (v0.8; valores actualizados en v0.9 y v1.0)

Criterios verificables por módulo. Salvo que se diga otra cosa, "club de referencia" es un club de Primera con aforo 42.800 (secciones de 7.1), `R = 60`, `aficion_moral = 60`, `fans_activos = 25.680`, `antiguedad_anios = 0`, precio de taquilla 45 €, rival con `R = 25` en agosto, posición 10.ª en las 5 temporadas del historial e implantación social media (6.9.2). Las tolerancias son de 1 céntimo en importes y de 1 unidad en personas, salvo indicación. Los valores esperados salen de calc_v09/check.py (versión 1.0). No hay módulos bloqueados ni puntos pendientes de producto.

### 23.1 Datos (sección 4 y 15)

- [ ] Todas las entidades de 4.2 a 4.27 existen con los campos, tipos y rangos de sus tablas; un valor fuera de rango se rechaza al guardar.
- [ ] Importes en céntimos enteros; ningún campo de importe es de coma flotante.
- [ ] `aforo_total` del estadio de referencia = 42.800; `ocupacion_max_global` = 38.110 / 42.800 = 0,890421 (6 decimales).
- [ ] `seguidores_club` inicial del club de referencia = 505.680; `fans_activos` = 25.680.
- [ ] `abonos_objetivo` del club de referencia = 25.680 (`porcentaje_abonados` = 0,60); con R = 40 en Segunda y aforo 18.000, 8.100 (0,45).
- [ ] La antigüedad inicial de abonos sigue 0,9^(k−1): con 25.680 abonos, unos 16.460 tienen 5 años o más (64,1 %, tolerancia ±2 % con la semilla de carga).
- [ ] `recaudacion_historica_cent` del club de referencia: 28.218.465 € por temporada (19 × 674.235 € + 25.680 × 600 €) y 141.092.325 € en las 5.
- [ ] `historial_posiciones` de la carga: las 5 temporadas con la posición del orden por reputación descendente y `codigo` ascendente de su división.
- [ ] El escalado de 7.1 a 25.000 plazas da secciones que suman exactamente 25.000 y palcos múltiplo de 10.
- [ ] Movimientos de `amortizacion` con `afecta_caja = false` no cambian `Caja.saldo_cent`.
- [ ] Generador (15.5): reputación de Primera en 40 a 90 y de Segunda en 20 a 60; `P10` con R = 60; caja inicial 15.000.000 € con R = 60 en Primera y 2.000.000 € con R = 40 en Segunda; personal de 8.000.000 € en Primera y 1.500.000 € en Segunda; sin préstamos; `turismo_alto` en los 3 clubes de mayor reputación; despedir a fisioterapeuta, ojeador, analista o ayudante se rechaza.
- [ ] Patrocinios de carga del club de referencia (8.3): 7 zonas por 23.000.000 € al año (multiplicador 1,00) y naming de 12.000.000 € a 10 años; con R = 90, multiplicador 1,24; con R = 40, 0,84.

### 23.2 Calendario (sección 5 y 11)

- [ ] 52 ticks por temporada; los primeros ticks de mes son 1, 5, 9, 14, 18, 22, 27, 31, 35, 40, 44 y 48, y los últimos 4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47 y 52.
- [ ] Primera: 38 jornadas en las semanas 5 a 47 sin las semanas 10, 15, 25, 26 y 37; Segunda: 42 jornadas en las semanas 5 a 47 sin la 25; promoción en las semanas 48 y 49.
- [ ] Cada club juega 19 partidos de local en Primera y 21 en Segunda; cada pareja se enfrenta una vez en cada campo.
- [ ] Ventanas abiertas en las semanas 1 a 6 y 27 a 29; fuera de ellas, una venta o un fichaje se rechaza con causa.
- [ ] Mismo `Partida.semilla` y mismas decisiones: calendario, resultados, lesiones y saldo semanal idénticos en dos ejecuciones (comparar el hash de todos los movimientos).
- [ ] PCG32 (4.1): cada flujo k se inicializa con `pcg32_srandom(Partida.semilla, k)`; los primeros 1.000 valores de cada flujo coinciden con los del código de referencia de PCG32 para esa pareja (`initstate`, `initseq`), en todas las plataformas objetivo (decisión 38).
- [ ] Determinismo numérico (4.1, decisión 39): el núcleo no llama a `Math.pow`, `Math.exp` ni `Math.log` ni a equivalentes de la plataforma (comprobación estática del código del núcleo); las potencias, exponenciales y logaritmos usan la librería propia.
- [ ] Misma semilla y mismos datos de carga, sin decisiones del jugador (o con el mismo guion de decisiones): tras 3 temporadas simuladas, `Caja.saldo_cent` del club del jugador (los clubes no controlados no tienen caja simulada, B-1), la clasificación y la reputación de todos los clubes coinciden al céntimo y a la unidad entre dos ejecuciones y entre dos plataformas o motores distintos (decisión 39).
- [ ] El tick ejecuta los 11 pasos de 5.2 en orden; la semana 52 ejecuta los 7 pasos de 11.4.

### 23.3 Caja y motor económico (sección 6)

- [ ] Con el club de referencia, la taquilla del ejemplo de 6.12 da 14.983 localidades (37.761 − 21.828 abonados − 950 plazas de palco) y 674.235 €.
- [ ] Precio de taquilla: se rechaza fuera de 22,50 € a 90 € en Primera (11 € a 44 € en Segunda); a 40,50 € la taquilla es 620.946 € y a 50 €, 524.900 €; en Manager el precio no se puede cambiar.
- [ ] Saldo de agosto del ejemplo de 6.12 con saldo inicial 15,0 M€ y solo las filas del ejemplo: 17.961.014,25 € (18,0 M€).
- [ ] Liquidación de un tick: cobros antes que pagos; pagos en el orden 1.º (préstamos e impuestos) a "Resto"; desempate por `secuencia_creacion`.
- [ ] Pools de 2026/27 (6.9.1): audiovisual de Primera 1.288.908.000 € y de Segunda 143.212.000 €; comercialización 1.426.050.000 € y 158.450.000 €; digital 40.000.000 € y 4.000.000 €; `L_disp` = 3,5 (importe total 3.060,62 M€).
- [ ] Club de referencia (6.9.2): fracción 0,044375; audiovisual 57.195.292,50 €, en diez cobros de 5.719.529,25 € en las semanas 5, 9, 14, 18, 22, 27, 31, 35, 40 y 44, ninguno en junio; comercialización 63.280.968,75 €, en 31.640.484,38 € (semana 1) y 31.640.484,37 € (semana 27); digital 1.775.000 €, en 11 cobros de 147.916,67 € y el último de 147.916,63 €.
- [ ] Escala de resultados de Primera: suma 100 %; con un club en la misma posición las 5 temporadas, `r_i` = escala de esa posición (10.ª: 0,0275). Una temporada en Segunda cuenta 0 y `r_i` se renormaliza para sumar 1.
- [ ] Límite de dispersión: con un pool de 1.288,908 M€ y repartos brutos proporcionales a 1, 2, …, 20, L = 28.642.400 € y 3,5 × L = 100.248.400 €; los clubes 1 a 4 cobran L, los 17 a 20 cobran 3,5 × L y la suma es 1.288.908.000 € exactos.
- [ ] Reparto audiovisual de Segunda (6.9.3; pool de 143,212 M€, fondo, implantación igual): parte igual 4.442.826,82 € por club; 1.º 6.918.116,05 €; 22.º 5.775.674,86 €; total con el fondo 143.212.000 € (redondeo de mayor resto, tolerancia de 1 céntimo por club). Fondo de 3.580.300 € con descensos en 18.º, 19.º y 20.º: 1.356.174,24, 1.193.433,33 y 1.030.692,43 €. En 2026/27, sin descendidos: 1.º 7.095.503,64 € y 22.º 5.923.769,09 €.
- [ ] Mercado (13.2, 13.3): con valor de 10 M€, el vendedor rechaza 9,9 M€ y acepta 10 M€ con 2 años restantes, y exige 13 M€ con 5 o más; el sistema compra por 8 M€ con 2 años y por 10 M€ con 4 o más; para los mismos años, el precio de venta es siempre menor que el mínimo de compra; un jugador fichado en una ventana no se puede vender en ella; renovación de 2 M€ por 3 años: rechaza 2,29 M€ y acepta 2,3 M€ con moral ≥ 35.
- [ ] Venta forzosa (6.11): aviso en el 2.º cierre de mes seguido por encima del límite y venta automática del jugador vendible de mayor salario en el 3.º, al precio de 13.3.
- [ ] Préstamo de 10 M€ a 5 años y 5 %: lineal, primera cuota 208.333,33 € e intereses totales 1.270.833,33 €; francesa, cuota 188.712,34 € e intereses totales 1.322.740,19 €. Tipo del club de referencia: 4,8 %.
- [ ] Vallas: 1.070 × 18.000 € = 19.260.000 € en la semana 1; modalidad B: 947,37 € por valla y partido en Primera.
- [ ] Amortización: fichaje de 12 M€ a 4 años: 3 M€ por temporada; tras 2 temporadas, 6 M€ pendientes; venta por 4 M€: −2 M€ en resultados y +4 M€ en caja.
- [ ] Impuesto de sociedades: con beneficio de 10 M€ y 6 M€ de bases negativas, compensación de 5 M€ e impuesto de 1,25 M€ cobrado en la semana 4 siguiente.
- [ ] Descubierto: con saldo de −4 M€ al cierre de mes, interés de 26.666,67 € en el primer tick del mes siguiente.
- [ ] Tienda física fuera de día de partido (8.1, decisión 42): club de referencia, 151.620 € al año, cobrados en el primer tick de cada mes: 17.399,02 € en julio y agosto, 8.699,51 € en diciembre y enero, 12.427,87 € el resto y 12.427,85 € en junio; 0 € sin sección `tienda_fisica`. No existe fila de restauración fuera de día de partido ni concesión de restauración (decisión 43).

### 23.4 Estadio y obras (sección 7)

- [ ] Una obra de 40 semanas y 12 M€ paga 40 cuotas de 300.000 €; sin saldo disponible (`saldo + descubierto_limite`) la semana se suspende y la duración crece en 1.
- [ ] Cancelación en curso: se pierde el 50 % de lo pagado; antes de empezar, sin coste.
- [ ] Al terminar una ampliación de 2.000 plazas de general, `plazas` de `grada_general` pasa de 18.000 a 20.000, `aforo_total` a 44.800 y el tope de asistencia sube desde la siguiente jornada de local; `abonos_objetivo` cambia en la semana 1 siguiente.
- [ ] Mantenimiento base del club de referencia: 2.568.000 € al año, 214.000 € al mes; con `antiguedad_anios = 30`, 3.338.400 € al año.
- [ ] Césped: con `cesped_estado` = 45 y un concierto sin césped calefactado en la semana t, 45 − 8 + 2 = 39 < 40: reposición de 200.000 € pagada en t + 1 y estado 100 tras el pago. Con `cesped_estado` < 20 en un partido de local, −2 de reputación del club al cierre.
- [ ] `insonorizacion_nivel_2` se rechaza si el nivel actual es 0.
- [ ] Ampliación de la general del estadio de referencia: `bloqueo_aforo` = 1.800 durante la obra; tope 36.507, asistencia 36.173 y taquilla de 602.775 € por partido.
- [ ] `construir_hospitality` de 1 zona suma 250 plazas; `construir_palcos` con más de 30 unidades se rechaza.
- [ ] Aparcamiento terminado, club de referencia: 1.500 vehículos (tope), 15.000 € por partido de local.
- [ ] Reforma general: solo con `antiguedad_anios` ≥ 50; 104 semanas; bloqueo de 10.700 plazas en el estadio de referencia; `antiguedad_anios` = 0 al terminar.

### 23.5 Demanda e ingresos de estadio (sección 8)

- [ ] Club de referencia: `f_reputacion` 1,06, `f_aficion` 1,02, `f_fans` 1,02, demanda 37.760,69, asistencia 37.761, ocupación 0,8823.
- [ ] El tope solo se alcanza si el producto de factores supera 1,1130 (38.110 / 34.240).
- [ ] Palcos del club de referencia: tasa 0,79, 95 palcos, 285.000 € por partido; hospitality: 395 plazas, 59.250 € por partido.
- [ ] Restauración de día: 36.250,56 € por partido.
- [ ] Merchandising de temporada normal: tienda de día 451.999 € (sin estacionalidad), online 4.089.454 €, camisetas 1.092.269 €, tienda fuera de día de partido 151.620 €; total 5.785.342 € (5,79 M€, 2,61 % del cierre de 14.8); en temporada de cambio, 6.331.477 € (6,33 M€, 2,85 %).
- [ ] Museo 1.216.350 € al año y tours 154.800 €; en julio, museo × 1,4 / 12,2.
- [ ] Patrocinio: multiplicador 0,52 + 0,008 × R (1,00 con R = 60); al vencer un contrato, oferta la semana siguiente y, si se rechaza, otra 4 semanas después.
- [ ] Concierto de 8.6.3: 1.927.392 € con llenado 0,8904 y 1.927.402 € con 0,890421.
- [ ] Ingresos por evento con R = 60 (8.6.1): concierto 1, 666.954 €; concierto 3, 3.801.379 €; corporativo, 150.000 €; competición no futbolística, 221.624 €. Un evento cancelado no cobra ni desgasta el césped; multa de horario con p = 0,05.
- [ ] Un concierto no se puede programar en una semana con partido de local ni a menos de 2 semanas de otro evento.
- [ ] Tabla 14.8 (criterio 8 de 14.9): total del club de referencia 221,62 M€ (referencia 221 M€ ± 1 M€, decisión 40); derechos 58,9703 M€ (26,61 %), comercialización 63,2810 M€ (28,55 %), matchday 35,4480 M€ (16,00 %), patrocinio 23 M€ (10,38 %), naming 12 M€ (5,41 %), vallas 19,26 M€ (8,69 %), merchandising 5,7853 M€ (2,61 %), otros 3,8712 M€ (1,75 %, con el premio de liga de 2,5 M€); cada fila dentro de su rango.

### 23.6 Simulación (5.5)

- [ ] Titulares: exactamente un portero y 10 de campo; los titulares suman 90 minutos cada uno.
- [ ] `S_club` en [0, 105]. Con d = 0, `p_local` = 0,37 y `p_visitante` = 0,37.
- [ ] El marcador siempre concuerda con el resultado sorteado.
- [ ] Criterios de 5.5.7 en 200 temporadas: diferencia primero-último entre 35 y 75 puntos en el 90 %.
- [ ] Lesiones: con CF 80, plan normal y médico de calidad 3, p = 0,012 por semana; en 100.000 sorteos de días, mediana 21, media 39,3 ± 0,5, 28,4 % ± 1 % por encima de 56 días.
- [ ] Condición física (9.12.1, B-3): en semana con partido, un titular varía +1 con `suave`, 0 con `normal` y −1 con `intenso`, y un jugador sin minutos +3, +2 y +1; en semana sin partido, +5 con cualquier plan (tope 100).

### 23.7 Entrenador (sección 9)

- [ ] `score_objetivos` con pesos normalizados; en Coach no existe `presupuesto_no_superar` y `copa` tiene peso 0.
- [ ] `delta_reputacion` = round(20 × (score − 0,5)) en [−10, +10]; con score 0,75, +5.
- [ ] Objetivo de posición en Primera: R = 60 → 10; R = 70 → 8; R = 85 → 6; R = 100 → 4; R = 40 → 14.
- [ ] Honorarios de partida en Primera con reputación 55: 1,26 M€; oferta con reputación 70: +14 %.
- [ ] Con `confianza_directiva` ≤ 20, como máximo un despido por temporada.
- [ ] Objetivos (9.3, B-2): President y Total reciben deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda), con pesos 0,50, 0,25 y 0,25; Manager, `presupuesto_no_superar` en lugar de `saldo_minimo`; Coach y Promanager, solo deportivo y ocupación (0,667 y 0,333). Segunda: posición 6 con R ≥ 60, 12 con R de 40 a 59 y permanencia con R < 40.
- [ ] Entrenador `en_paro` con reputación 20: 1 oferta en cada una de las semanas 1, 27 y 52; con 60: 2. Los clubes de destino cumplen |R − reputación| ≤ 15 y no incluyen el actual. La rescisión al aceptar la paga el club de destino.

### 23.8 Control económico (sección 10)

- [ ] INCN solo con derechos (nacional, internacional y digital), taquilla y comercialización.
- [ ] Club de referencia sin traspasos: masa salarial 60 + 8 + 1,26 = 69,26 M€; INCN 58,9703 + 63,2810 + 12,8105 = 135,06 M€; ratio 0,513 (sin aviso); límite de inversión 1,5 × INCN = 202,59 M€.
- [ ] Ratio 0,62: aviso; 0,66: bloqueo de altas salariales hasta la siguiente comprobación con ratio ≤ 0,65.
- [ ] Pérdida de 70 M€ en Primera: multa de 1 M€ y confianza −20; pérdida de 95 M€: además bloqueo de la siguiente ventana y reputación del club −5 (una sola vez).
- [ ] La semana 26 evalúa ratio y límite de inversión; la 52, además, pérdidas.
- [ ] Descubierto sostenido: aviso al 2.º cierre seguido y venta forzosa al 3.º (6.11, 10.2).

### 23.9 Pantallas (sección 13)

- [ ] Cada modo ve exactamente las pantallas de 13.1; Promanager igual que Coach; Manager ve "Caja y finanzas" en solo lectura.
- [ ] Toda cifra de pantalla abre su desglose de causas (`Movimiento.causa`, factores de 8.2, sorteos de 5.5).
- [ ] Ninguna acción prohibida por una regla se puede confirmar; se muestra la causa (ventana cerrada, límite, descubierto, plantilla, no comunitarios).
- [ ] La proyección de caja de 8 semanas (13.2) coincide con la suma de movimientos `previsto` y se etiqueta como estimada.
- [ ] Flujos de Mercado (13.2 y 13.3): cada rechazo del vendedor, del jugador o de una regla muestra su causa; la venta muestra el precio de 13.3 y el beneficio contable.
