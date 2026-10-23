# Calendario y flujo de temporada

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 5, 5.1, 5.2, 5.3, 5.4, 11, 11.1, 11.2, 11.3, 11.4, 11.5, 23.2.

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

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 3 | Cobros y pagos mensuales con un único orden de liquidación por tick. | 5.1.1, 5.2, 6.5, 6.10 |
| 4 | Partida base en la temporada 2026/27. | 4.2, 5.1, 11.1, 15 |
| 12 | Cobros y pagos mensuales: todos en el primer tick del mes, en el orden de la columna "Orden" de 6.5. | 5.1, 5.2, 6.5, 6.10, 6.11 |
| 38 | Ronda 0.9, añadido de producto [D]. PCG32 con `initstate = Partida.semilla` e `initseq = k` (índice del flujo), para que dos implementaciones den la misma secuencia. | 4.1, 23.2 |
| 39 | Ronda 0.9, añadido de producto [D]. Determinismo numérico: sin `Math.pow`, `Math.exp` ni `Math.log` (ni equivalentes dependientes de plataforma) en el núcleo; librería matemática propia; importes en céntimos enteros con redondeo explícito (regla de 4.1). Criterio: misma semilla y mismos datos dan el mismo saldo al céntimo tras 3 temporadas. | 4.1, 23.2 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Reparto audiovisual | Distribución de los derechos entre divisiones y clubes según el Real Decreto-ley 5/2015 (6.9) [C]. |
| Implantación social | Tramo del reparto (25 % en Primera): 1/3 por recaudación media de abonos y taquilla de las 5 últimas temporadas y 2/3 por contribución televisiva (6.9.2) [C]. |
| Límite de dispersión | Razón máxima entre el mayor y el menor reparto de una división: 3,5 con un reparto de 1.500 M€ o más; 4,5 en otro caso (art. 5.5 del Real Decreto-ley 5/2015) [C]. |
