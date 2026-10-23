# Criterios de aceptación (sección 23)

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split`.

Total: 83 criterios. Cada identificador AC-23.x-yy es la posición del criterio dentro de su bloque 23.x. Si se inserta o quita un criterio, cambian los identificadores posteriores: revisar el backlog (REF-1) al hacerlo.

| ID | Bloque | Criterio (resumen) | Sección de la especificación |
|---|---|---|---|
| AC-23.1-01 | Datos | Todas las entidades de 4.2 a 4.27 existen con los campos, tipos y rangos de sus tablas; un valor fuera de rango se rechaza al guardar. | 4, 4.2, 4.27, 15 |
| AC-23.1-02 | Datos | Importes en céntimos enteros; ningún campo de importe es de coma flotante. | 4, 15 |
| AC-23.1-03 | Datos | `aforo_total` del estadio de referencia = 42.800; `ocupacion_max_global` = 38.110 / 42.800 = 0,890421 (6 decimales). | 4, 6, 15 |
| AC-23.1-04 | Datos | `seguidores_club` inicial del club de referencia = 505.680; `fans_activos` = 25.680. | 4, 15 |
| AC-23.1-05 | Datos | `abonos_objetivo` del club de referencia = 25.680 (`porcentaje_abonados` = 0,60); con R = 40 en Segunda y aforo 18.000, 8.100 (0,45). | 4, 15 |
| AC-23.1-06 | Datos | La antigüedad inicial de abonos sigue 0,9^(k−1): con 25.680 abonos, unos 16.460 tienen 5 años o más (64,1 %, tolerancia ±2 % con la semilla … | 1, 2, 4, 5, 15 |
| AC-23.1-07 | Datos | `recaudacion_historica_cent` del club de referencia: 28.218.465 € por temporada (19 × 674.235 € + 25.680 × 600 €) y 141.092.325 € en las 5. | 4, 5, 15, 19 |
| AC-23.1-08 | Datos | `historial_posiciones` de la carga: las 5 temporadas con la posición del orden por reputación descendente y `codigo` ascendente de su … | 4, 5, 15 |
| AC-23.1-09 | Datos | El escalado de 7.1 a 25.000 plazas da secciones que suman exactamente 25.000 y palcos múltiplo de 10. | 4, 7.1, 10, 15 |
| AC-23.1-10 | Datos | Movimientos de `amortizacion` con `afecta_caja = false` no cambian `Caja.saldo_cent`. | 4, 15 |
| AC-23.1-11 | Datos | Generador (15.5): reputación de Primera en 40 a 90 y de Segunda en 20 a 60; `P10` con R = 60; caja inicial 15.000.000 € con R = 60 en … | 3, 4, 15, 15.5, 20 |
| AC-23.1-12 | Datos | Patrocinios de carga del club de referencia (8.3): 7 zonas por 23.000.000 € al año (multiplicador 1,00) y naming de 12.000.000 € a 10 años; … | 4, 7, 8.3, 10, 15 |
| AC-23.2-01 | Calendario | 52 ticks por temporada; los primeros ticks de mes son 1, 5, 9, 14, 18, 22, 27, 31, 35, 40, 44 y 48, y los últimos 4, 8, 13, 17, 21, 26, 30, … | 1, 4, 5, 8, 9, 11, 13, 14, 17, 18, 21, 22 |
| AC-23.2-02 | Calendario | Primera: 38 jornadas en las semanas 5 a 47 sin las semanas 10, 15, 25, 26 y 37; Segunda: 42 jornadas en las semanas 5 a 47 sin la 25; … | 5, 10, 11, 15 |
| AC-23.2-03 | Calendario | Cada club juega 19 partidos de local en Primera y 21 en Segunda; cada pareja se enfrenta una vez en cada campo. | 5, 11, 19, 21 |
| AC-23.2-04 | Calendario | Ventanas abiertas en las semanas 1 a 6 y 27 a 29; fuera de ellas, una venta o un fichaje se rechaza con causa. | 1, 5, 6, 11 |
| AC-23.2-05 | Calendario | Mismo `Partida.semilla` y mismas decisiones: calendario, resultados, lesiones y saldo semanal idénticos en dos ejecuciones (comparar el hash … | 5, 11 |
| AC-23.2-06 | Calendario | PCG32 (4.1): cada flujo k se inicializa con `pcg32_srandom(Partida.semilla, k)`; los primeros 1.000 valores de cada flujo coinciden con los … | 4.1, 5, 11 |
| AC-23.2-07 | Calendario | Determinismo numérico (4.1, decisión 39): el núcleo no llama a `Math.pow`, `Math.exp` ni `Math.log` ni a equivalentes de la plataforma … | 4.1, 5, 11 |
| AC-23.2-08 | Calendario | Misma semilla y mismos datos de carga, sin decisiones del jugador (o con el mismo guion de decisiones): tras 3 temporadas simuladas, … | 3, 5, 11 |
| AC-23.2-09 | Calendario | El tick ejecuta los 11 pasos de 5.2 en orden; la semana 52 ejecuta los 7 pasos de 11.4. | 5, 5.2, 7, 11, 11.4 |
| AC-23.3-01 | Caja y motor económico | Con el club de referencia, la taquilla del ejemplo de 6.12 da 14.983 localidades (37.761 − 21.828 abonados − 950 plazas de palco) y 674.235 … | 6, 6.12 |
| AC-23.3-02 | Caja y motor económico | Precio de taquilla: se rechaza fuera de 22,50 € a 90 € en Primera (11 € a 44 € en Segunda); a 40,50 € la taquilla es 620.946 € y a 50 €, … | 6, 11 |
| AC-23.3-03 | Caja y motor económico | Saldo de agosto del ejemplo de 6.12 con saldo inicial 15,0 M€ y solo las filas del ejemplo: 17.961.014,25 € (18,0 M€). | 6, 6.12 |
| AC-23.3-04 | Caja y motor económico | Liquidación de un tick: cobros antes que pagos; pagos en el orden 1.º (préstamos e impuestos) a "Resto"; desempate por `secuencia_creacion`. | 1, 6 |
| AC-23.3-05 | Caja y motor económico | Pools de 2026/27 (6.9.1): audiovisual de Primera 1.288.908.000 € y de Segunda 143.212.000 €; comercialización 1.426.050.000 € y 158.450.000 … | 6 |
| AC-23.3-06 | Caja y motor económico | Club de referencia (6.9.2): fracción 0,044375; audiovisual 57.195.292,50 €, en diez cobros de 5.719.529,25 € en las semanas 5, 9, 14, 18, … | 1, 5, 6, 9, 11, 14, 18, 22 |
| AC-23.3-07 | Caja y motor económico | Escala de resultados de Primera: suma 100 %; con un club en la misma posición las 5 temporadas, `r_i` = escala de esa posición (10.ª: … | 0, 1, 5, 6, 10 |
| AC-23.3-08 | Caja y motor económico | Límite de dispersión: con un pool de 1.288,908 M€ y repartos brutos proporcionales a 1, 2, …, 20, L = 28.642.400 € y 3,5 × L = 100.248.400 … | 1, 2, 4, 6, 17, 20 |
| AC-23.3-09 | Caja y motor económico | Reparto audiovisual de Segunda (6.9.3; pool de 143,212 M€, fondo, implantación igual): parte igual 4.442.826,82 € por club; 1.º 6.918.116,05 … | 1, 6, 18, 19, 20, 22 |
| AC-23.3-10 | Caja y motor económico | Mercado (13.2, 13.3): con valor de 10 M€, el vendedor rechaza 9,9 M€ y acepta 10 M€ con 2 años restantes, y exige 13 M€ con 5 o más; el … | 2, 3, 4, 5, 6, 8, 10, 13, 13.2, 13.3 |
| AC-23.3-11 | Caja y motor económico | Venta forzosa (6.11): aviso en el 2.º cierre de mes seguido por encima del límite y venta automática del jugador vendible de mayor salario … | 2, 3, 6, 6.11, 13.3 |
| AC-23.3-12 | Caja y motor económico | Préstamo de 10 M€ a 5 años y 5 %: lineal, primera cuota 208.333,33 € e intereses totales 1.270.833,33 €; francesa, cuota 188.712,34 € e … | 5, 6, 10 |
| AC-23.3-13 | Caja y motor económico | Vallas: 1.070 × 18.000 € = 19.260.000 € en la semana 1; modalidad B: 947,37 € por valla y partido en Primera. | 1, 6 |
| AC-23.3-14 | Caja y motor económico | Amortización: fichaje de 12 M€ a 4 años: 3 M€ por temporada; tras 2 temporadas, 6 M€ pendientes; venta por 4 M€: −2 M€ en resultados y +4 M€ … | 2, 3, 4, 6, 12 |
| AC-23.3-15 | Caja y motor económico | Impuesto de sociedades: con beneficio de 10 M€ y 6 M€ de bases negativas, compensación de 5 M€ e impuesto de 1,25 M€ cobrado en la semana 4 … | 4, 5, 6, 10 |
| AC-23.3-16 | Caja y motor económico | Descubierto: con saldo de −4 M€ al cierre de mes, interés de 26.666,67 € en el primer tick del mes siguiente. | 4, 6 |
| AC-23.3-17 | Caja y motor económico | Tienda física fuera de día de partido (8.1, decisión 42): club de referencia, 151.620 € al año, cobrados en el primer tick de cada mes: … | 0, 6, 8.1 |
| AC-23.4-01 | Estadio y obras | Una obra de 40 semanas y 12 M€ paga 40 cuotas de 300.000 €; sin saldo disponible (`saldo + descubierto_limite`) la semana se suspende y la … | 1, 7, 12 |
| AC-23.4-02 | Estadio y obras | Cancelación en curso: se pierde el 50 % de lo pagado; antes de empezar, sin coste. | 7 |
| AC-23.4-03 | Estadio y obras | Al terminar una ampliación de 2.000 plazas de general, `plazas` de `grada_general` pasa de 18.000 a 20.000, `aforo_total` a 44.800 y el tope … | 1, 7 |
| AC-23.4-04 | Estadio y obras | Mantenimiento base del club de referencia: 2.568.000 € al año, 214.000 € al mes; con `antiguedad_anios = 30`, 3.338.400 € al año. | 7 |
| AC-23.4-05 | Estadio y obras | Césped: con `cesped_estado` = 45 y un concierto sin césped calefactado en la semana t, 45 − 8 + 2 = 39 < 40: reposición de 200.000 € pagada … | 1, 2, 7, 8, 20 |
| AC-23.4-06 | Estadio y obras | `insonorizacion_nivel_2` se rechaza si el nivel actual es 0. | 0, 7 |
| AC-23.4-07 | Estadio y obras | Ampliación de la general del estadio de referencia: `bloqueo_aforo` = 1.800 durante la obra; tope 36.507, asistencia 36.173 y taquilla de … | 7 |
| AC-23.4-08 | Estadio y obras | `construir_hospitality` de 1 zona suma 250 plazas; `construir_palcos` con más de 30 unidades se rechaza. | 1, 7 |
| AC-23.4-09 | Estadio y obras | Aparcamiento terminado, club de referencia: 1.500 vehículos (tope), 15.000 € por partido de local. | 7 |
| AC-23.4-10 | Estadio y obras | Reforma general: solo con `antiguedad_anios` ≥ 50; 104 semanas; bloqueo de 10.700 plazas en el estadio de referencia; `antiguedad_anios` = 0 … | 0, 7 |
| AC-23.5-01 | Demanda e ingresos de estadio | Club de referencia: `f_reputacion` 1,06, `f_aficion` 1,02, `f_fans` 1,02, demanda 37.760,69, asistencia 37.761, ocupación 0,8823. | 8 |
| AC-23.5-02 | Demanda e ingresos de estadio | El tope solo se alcanza si el producto de factores supera 1,1130 (38.110 / 34.240). | 8 |
| AC-23.5-03 | Demanda e ingresos de estadio | Palcos del club de referencia: tasa 0,79, 95 palcos, 285.000 € por partido; hospitality: 395 plazas, 59.250 € por partido. | 8 |
| AC-23.5-04 | Demanda e ingresos de estadio | Restauración de día: 36.250,56 € por partido. | 8 |
| AC-23.5-05 | Demanda e ingresos de estadio | Merchandising de temporada normal: tienda de día 451.999 € (sin estacionalidad), online 4.089.454 €, camisetas 1.092.269 €, tienda fuera de … | 8, 14.8 |
| AC-23.5-06 | Demanda e ingresos de estadio | Museo 1.216.350 € al año y tours 154.800 €; en julio, museo × 1,4 / 12,2. | 8 |
| AC-23.5-07 | Demanda e ingresos de estadio | Patrocinio: multiplicador 0,52 + 0,008 × R (1,00 con R = 60); al vencer un contrato, oferta la semana siguiente y, si se rechaza, otra 4 … | 4, 8 |
| AC-23.5-08 | Demanda e ingresos de estadio | Concierto de 8.6.3: 1.927.392 € con llenado 0,8904 y 1.927.402 € con 0,890421. | 8 |
| AC-23.5-09 | Demanda e ingresos de estadio | Ingresos por evento con R = 60 (8.6.1): concierto 1, 666.954 €; concierto 3, 3.801.379 €; corporativo, 150.000 €; competición no … | 1, 3, 8 |
| AC-23.5-10 | Demanda e ingresos de estadio | Un concierto no se puede programar en una semana con partido de local ni a menos de 2 semanas de otro evento. | 2, 8 |
| AC-23.5-11 | Demanda e ingresos de estadio | Tabla 14.8 (criterio 8 de 14.9): total del club de referencia 221,62 M€ (referencia 221 M€ ± 1 M€, decisión 40); derechos 58,9703 M€ (26,61 … | 1, 8, 12, 14.8, 14.9, 23 |
| AC-23.6-01 | Simulación | Titulares: exactamente un portero y 10 de campo; los titulares suman 90 minutos cada uno. | 5.5, 10 |
| AC-23.6-02 | Simulación | `S_club` en [0, 105]. Con d = 0, `p_local` = 0,37 y `p_visitante` = 0,37. | 0, 5.5 |
| AC-23.6-03 | Simulación | El marcador siempre concuerda con el resultado sorteado. | 5.5 |
| AC-23.6-04 | Simulación | Criterios de 5.5.7 en 200 temporadas: diferencia primero-último entre 35 y 75 puntos en el 90 %. | 5.5 |
| AC-23.6-05 | Simulación | Lesiones: con CF 80, plan normal y médico de calidad 3, p = 0,012 por semana; en 100.000 sorteos de días, mediana 21, media 39,3 ± 0,5, 28,4 … | 1, 3, 5.5, 21 |
| AC-23.6-06 | Simulación | Condición física (9.12.1, B-3): en semana con partido, un titular varía +1 con `suave`, 0 con `normal` y −1 con `intenso`, y un jugador sin … | 0, 1, 2, 3, 5, 5.5 |
| AC-23.7-01 | Entrenador | `score_objetivos` con pesos normalizados; en Coach no existe `presupuesto_no_superar` y `copa` tiene peso 0. | 0, 9 |
| AC-23.7-02 | Entrenador | `delta_reputacion` = round(20 × (score − 0,5)) en [−10, +10]; con score 0,75, +5. | 5, 9, 10, 20 |
| AC-23.7-03 | Entrenador | Objetivo de posición en Primera: R = 60 → 10; R = 70 → 8; R = 85 → 6; R = 100 → 4; R = 40 → 14. | 4, 6, 8, 9, 10, 14 |
| AC-23.7-04 | Entrenador | Honorarios de partida en Primera con reputación 55: 1,26 M€; oferta con reputación 70: +14 %. | 9, 14 |
| AC-23.7-05 | Entrenador | Con `confianza_directiva` ≤ 20, como máximo un despido por temporada. | 9, 20 |
| AC-23.7-06 | Entrenador | Objetivos (9.3, B-2): President y Total reciben deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda), con … | 0, 6, 9, 9.3, 12 |
| AC-23.7-07 | Entrenador | Entrenador `en_paro` con reputación 20: 1 oferta en cada una de las semanas 1, 27 y 52; con 60: 2. Los clubes de destino cumplen \|R − … | 1, 2, 9, 15, 20 |
| AC-23.8-01 | Control económico | INCN solo con derechos (nacional, internacional y digital), taquilla y comercialización. | 10 |
| AC-23.8-02 | Control económico | Club de referencia sin traspasos: masa salarial 60 + 8 + 1,26 = 69,26 M€; INCN 58,9703 + 63,2810 + 12,8105 = 135,06 M€; ratio 0,513 (sin … | 8, 10 |
| AC-23.8-03 | Control económico | Ratio 0,62: aviso; 0,66: bloqueo de altas salariales hasta la siguiente comprobación con ratio ≤ 0,65. | 10 |
| AC-23.8-04 | Control económico | Pérdida de 70 M€ en Primera: multa de 1 M€ y confianza −20; pérdida de 95 M€: además bloqueo de la siguiente ventana y reputación del club … | 1, 5, 10, 20 |
| AC-23.8-05 | Control económico | La semana 26 evalúa ratio y límite de inversión; la 52, además, pérdidas. | 10 |
| AC-23.8-06 | Control económico | Descubierto sostenido: aviso al 2.º cierre seguido y venta forzosa al 3.º (6.11, 10.2). | 2, 3, 6.11, 10, 10.2 |
| AC-23.9-01 | Pantallas | Cada modo ve exactamente las pantallas de 13.1; Promanager igual que Coach; Manager ve "Caja y finanzas" en solo lectura. | 13, 13.1 |
| AC-23.9-02 | Pantallas | Toda cifra de pantalla abre su desglose de causas (`Movimiento.causa`, factores de 8.2, sorteos de 5.5). | 5.5, 8.2, 13 |
| AC-23.9-03 | Pantallas | Ninguna acción prohibida por una regla se puede confirmar; se muestra la causa (ventana cerrada, límite, descubierto, plantilla, no … | 13 |
| AC-23.9-04 | Pantallas | La proyección de caja de 8 semanas (13.2) coincide con la suma de movimientos `previsto` y se etiqueta como estimada. | 8, 13, 13.2 |
| AC-23.9-05 | Pantallas | Flujos de Mercado (13.2 y 13.3): cada rechazo del vendedor, del jugador o de una regla muestra su causa; la venta muestra el precio de 13.3 … | 13, 13.2, 13.3 |
