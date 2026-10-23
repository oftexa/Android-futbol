# Estadio y obras

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 23.4.

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

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 10 | Ocupación máxima: preferente 0,80; VIP 0,95. Una sola fórmula de ocupación (8.2). | 4.6, 7.4, 8.2, 8.6.3, 6.12 |
| 36 | Ronda 0.9, B-6. Una ampliación inutiliza solo el 10 % de su sección mientras dura la obra. Parámetros de eventos, hospitality, palcos, aparcamiento y reforma general [D]. | 7.2, 7.3, 7.7, 8.6 |
