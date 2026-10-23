# Ingresos

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 6.2.

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

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 7 | **Sustituida en v0.9 por las decisiones 29 (F-1) y 30 (F-2).** Antes: pools de 990 M€ (nacional) y 1.585 M€ (comercialización) solo de Primera, y pool propio de Segunda. | 6.2.4, 6.2.6, 6.9.1, 6.9.3, 14.1, 14.8 |
| 8 | Derechos digitales: un único modelo. Se elimina el modelo de seguidores. El reparto "por tercios" de esta decisión se sustituye en v0.9 por el modelo legal de la decisión 30 (el 1/3 y 2/3 queda como subdivisión del tramo de implantación social). | 6.2.5, 6.9.2, 8.7, 14.5, 17.3 |
| 18 | Ciclo de derechos 2027/28 a 2031/32: 5.250 M€ es el total del ciclo (unos 1.050 M€ por temporada). | 4.2, 6.2.4, 14.1, 14.8, A-04 |
| 22 | Vallas publicitarias: fila propia en 14.8 con rango [D] de 7 % a 8 %. **Rango sustituido por A-26 (decisión 40, v1.0)**: 7 % a 9 %. | 6.2.8, 14.8 |
| 23 | Pool digital de 40 M€, sin sumarse al pool audiovisual [D]. El modelo de seguidores de 8.7 era el de los ingresos digitales y queda eliminado. En v0.9 su reparto sigue el modelo legal de la decisión 30 (50/25/25 con límite legal), en lugar de tercios sin límite K. | 6.2.5, 6.9.1, 6.9.2, 8.7, 14.1 |
| 29 | Ronda 0.9, F-1. Comercialización: 1.585 M€ (1.584,5 M€ [C], informe económico de LaLiga 2024/25, S-02) es el pool de Primera más Segunda, no solo de Primera. El juego usa 1.584,5 M€: Primera recibe el 90 % (1.426,05 M€) y Segunda el 10 % (158,45 M€). Aplicar el 90/10 a la comercialización es [D], por analogía con el art. 5.2 del Real Decreto-ley 5/2015. | 6.2.6, 6.9.1, 14.1, 14.8, 17.2 |
| 30 | Ronda 0.9, F-2. Reparto audiovisual según el Real Decreto-ley 5/2015 [C, BOE, S-14]: art. 5.2, 90 % Primera y 10 % Segunda; art. 5.3 en Primera, 50 % a partes iguales, 25 % por resultados deportivos y 25 % por implantación social, que se divide en 1/3 por recaudación media de abonos y taquilla (5 últimas temporadas) y 2/3 por contribución a la generación de ingresos televisivos (audiencia); art. 5.5, límite de dispersión de 3,5 veces si el reparto es de 1.500 M€ o más, y 4,5 en otro caso. Fondo de compensación de descendidos del 2,5 %: se mantiene. Datos: reparto 2024/25 de 1.432,12 M€ (Primera 1.292,09 / Segunda 140,03) [E, una sola fuente de prensa, la suma cuadra]; ocupación de Segunda 2024/25 68,5 % [C] (61,7 % es la de 2023/24); los 4.950 M€ del ciclo nacional cubren solo partidos de Primera [E]. Sustituye el reparto "por tercios" y el factor K = 4 (decisión 19). | 6.2.4, 6.2.5, 6.9, 14.1, 14.4, 14.5, 14.8, 14.9 |
| 34 | Ronda 0.9, B-4. Comercialización e internacional con el mismo modelo legal que la decisión 30 (Primera 50/25/25, con límite legal de dispersión); en Segunda, la posición es la de la temporada anterior. Cierra A-05. | 6.2.5, 6.2.6, 6.9.3 |
| 35 | Ronda 0.9, B-5. Patrocinio = valor de tabla × (0,52 + 0,008 × reputación) [D], que mantiene los 23 M€ del club de referencia; contratos de carga y ofertas al vencer. Precio de taquilla limitado al 50 % a 200 % del precio base. Las plazas de palco vendidas se cobran solo como palco (6.2.3) y no como taquilla (sin doble conteo). | 4.4, 6.2.1, 6.2.3, 8.2, 8.3 |
