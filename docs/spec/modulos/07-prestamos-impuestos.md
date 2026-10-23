# Préstamos e impuestos

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 6.7, 6.8.

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
