# Gastos y cláusulas

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 6.3, 6.4, 6.6.

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

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 13 | Baja muy larga: más de 120 días. Rango de lesiones: 3 a 150 días. | 5.5.5, 6.6.2, 9.12.4, 12.4 |
| 14 | Premio de permanencia: gasto del club (prima a la plantilla al cierre de temporada). | 6.3.4, 6.5, 6.6.3 |
| 17 | Cláusulas (rescisión, casa y coche, prima de gol): la fuente de verdad es la entidad `Clausula`; `Contrato` solo la referencia por id. | 4.9, 4.10, 6.3.4, 6.6 |
