# Caja y liquidación

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 6, 6.1, 6.5, 6.10, 6.11, 6.12, 23.3.

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

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 3 | Cobros y pagos mensuales con un único orden de liquidación por tick. | 5.1.1, 5.2, 6.5, 6.10 |
| 9 | Factor de situación: posición × racha (multiplicativo). La racha afecta a la afición (asistencia y moral). | 5.5.4, 8.2, 6.12 |
| 10 | Ocupación máxima: preferente 0,80; VIP 0,95. Una sola fórmula de ocupación (8.2). | 4.6, 7.4, 8.2, 8.6.3, 6.12 |
| 12 | Cobros y pagos mensuales: todos en el primer tick del mes, en el orden de la columna "Orden" de 6.5. | 5.1, 5.2, 6.5, 6.10, 6.11 |
| 14 | Premio de permanencia: gasto del club (prima a la plantilla al cierre de temporada). | 6.3.4, 6.5, 6.6.3 |
| 26 | Ronda 0.5, decisión 3: `fans_activos` entra en la demanda de 8.2 como factor `f_fans` (peso 0,20; rango 0,90 a 1,10). Mismo nombre de campo en 4.4 y 8.2. Cierra A-23. | 4.4, 8.2, 6.12 |
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 42 | Ronda 1.0, B-5c [D]. Tienda física fuera de día de partido: visitantes del mes = visitas de museo y tours del mes; ingreso = visitantes × 0,04 × 35 €, cobrado el primer tick de cada mes. Se elimina la restauración fuera de día de partido de 6.5. | 6.5, 8.1, 8.4, 8.5, 14.8 |
