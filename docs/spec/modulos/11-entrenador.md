# Gestión del entrenador

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 9, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.13, 23.7.

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

### 9.13 Ajustes de la directiva al entrenador

En modo Coach no existe el objetivo `presupuesto_no_superar` ni ningún ajuste de confianza ligado a un presupuesto: la directiva no asigna presupuesto fijo y el jugador lleva la caja (9.1, decisión de producto 1). Solo en modo Manager, donde la directiva asigna presupuesto, si el gasto en fichajes de la temporada supera 1,5 veces el valor de `presupuesto_no_superar` (9.3), la confianza de la directiva baja 10 puntos [D].

---

### 23.7 Entrenador (sección 9)

- [ ] `score_objetivos` con pesos normalizados; en Coach no existe `presupuesto_no_superar` y `copa` tiene peso 0.
- [ ] `delta_reputacion` = round(20 × (score − 0,5)) en [−10, +10]; con score 0,75, +5.
- [ ] Objetivo de posición en Primera: R = 60 → 10; R = 70 → 8; R = 85 → 6; R = 100 → 4; R = 40 → 14.
- [ ] Honorarios de partida en Primera con reputación 55: 1,26 M€; oferta con reputación 70: +14 %.
- [ ] Con `confianza_directiva` ≤ 20, como máximo un despido por temporada.
- [ ] Objetivos (9.3, B-2): President y Total reciben deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda), con pesos 0,50, 0,25 y 0,25; Manager, `presupuesto_no_superar` en lugar de `saldo_minimo`; Coach y Promanager, solo deportivo y ocupación (0,667 y 0,333). Segunda: posición 6 con R ≥ 60, 12 con R de 40 a 59 y permanencia con R < 40.
- [ ] Entrenador `en_paro` con reputación 20: 1 oferta en cada una de las semanas 1, 27 y 52; con 60: 2. Los clubes de destino cumplen |R − reputación| ≤ 15 y no incluyen el actual. La rescisión al aceptar la paga el club de destino.

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Modo Coach: la caja la gestiona el jugador, sin presupuesto fijo de la directiva. En Coach no existe el objetivo `presupuesto_no_superar` ni techo de gasto, y no hay consecuencias ligadas a ese objetivo. | 4.4 (`gestor_caja`), 9.1, 9.3, 9.13, 10.4, 13.1, A-02 |
| 11 | Promanager: se desbloquea por objetivos del club actual. | 9.1, 9.3, 15.4 |
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 32 | Ronda 0.9, B-2. Tres objetivos por temporada: deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda). Manager: `presupuesto_no_superar` = presupuesto de 10.4. Un entrenador sin club recibe siempre al menos 1 oferta. En Coach y Promanager no se asigna `saldo_minimo` (decisión 46, v1.0). | 9.1, 9.3, 9.8, 9.9, 10.4, 13.7 |
| 46 | Ronda 1.0, confirma la elección del redactor de v0.9. En Coach y Promanager no hay objetivo `saldo_minimo` (saldo ≥ 0): solo cuentan el deportivo y la ocupación, con pesos 0,667 y 0,333. | 9.3, 13.1 |
