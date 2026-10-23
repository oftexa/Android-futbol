# Decisiones abiertas y lagunas

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 16, 17, 17.1, 17.2, 17.3, 17.4.

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

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 8 | Derechos digitales: un único modelo. Se elimina el modelo de seguidores. El reparto "por tercios" de esta decisión se sustituye en v0.9 por el modelo legal de la decisión 30 (el 1/3 y 2/3 queda como subdivisión del tramo de implantación social). | 6.2.5, 6.9.2, 8.7, 14.5, 17.3 |
| 29 | Ronda 0.9, F-1. Comercialización: 1.585 M€ (1.584,5 M€ [C], informe económico de LaLiga 2024/25, S-02) es el pool de Primera más Segunda, no solo de Primera. El juego usa 1.584,5 M€: Primera recibe el 90 % (1.426,05 M€) y Segunda el 10 % (158,45 M€). Aplicar el 90/10 a la comercialización es [D], por analogía con el art. 5.2 del Real Decreto-ley 5/2015. | 6.2.6, 6.9.1, 14.1, 14.8, 17.2 |
| 40 | Ronda 1.0, A-26 [D]. Se aceptan los rangos ampliados de 14.8: derechos mínimo 26 % (26 % a 32 %), comercialización mínimo 28 % (28 % a 33 %), patrocinio 4 % a 11 %, naming 4 % a 6 % y vallas 7 % a 9 %; total de referencia del club de referencia de Primera 221 M€ [D] (tolerancia ±1 M€). Sustituye los rangos de las decisiones 21, 22, 24 y 25. Cierra A-26. | 14.8, 14.9 (criterio 8), 16 |
| 43 | Ronda 1.0, B-5d [D]. Restauración: en la versión base solo existe la explotación directa (`margen_club` = 0,30). La concesión con canon queda fuera de alcance, como ampliación futura. Cierra A-12. | 1.2, 8.5, 16 |
| 48 | Ronda 1.0 [D]. Cierre de las decisiones abiertas restantes de la sección 16 con su recomendación: A-03 (b), A-06 (a), A-07 (b), A-08 (b), A-09 (a: lineal por defecto, francesa como opción ya especificada), A-10 (a), A-13 (b), A-14 (b, la que ya aplica 5.5.2), A-15 (a), A-18 (a), A-19 (a). | 16 |
