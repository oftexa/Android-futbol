# Simulación de partidos, forma y lesiones

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 1.3, 5.5, 9.12, 23.6.

### 1.3 Resultados, clasificación y lesiones

Sin motor de partidos, los resultados de jornada, la clasificación, las lesiones y los minutos de juego los genera la simulación de rol descrita en la sección 5.5 [D]. El juego no depende de ningún módulo de competición externo (decisión de producto; cierra A-01 en 16).

La simulación produce, por jornada o por semana:

- resultado (victoria, empate o derrota, con goles a favor y en contra);
- clasificación acumulada y final de temporada;
- lesiones por jugador, con duración en días y efecto económico (9.12.4);
- minutos jugados por jugador y semana (9.12.1).

Si en el futuro se integra un módulo externo, solo podrá sustituir a la simulación si entrega estos mismos campos.

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

### 23.6 Simulación (5.5)

- [ ] Titulares: exactamente un portero y 10 de campo; los titulares suman 90 minutos cada uno.
- [ ] `S_club` en [0, 105]. Con d = 0, `p_local` = 0,37 y `p_visitante` = 0,37.
- [ ] El marcador siempre concuerda con el resultado sorteado.
- [ ] Criterios de 5.5.7 en 200 temporadas: diferencia primero-último entre 35 y 75 puntos en el 90 %.
- [ ] Lesiones: con CF 80, plan normal y médico de calidad 3, p = 0,012 por semana; en 100.000 sorteos de días, mediana 21, media 39,3 ± 0,5, 28,4 % ± 1 % por encima de 56 días.
- [ ] Condición física (9.12.1, B-3): en semana con partido, un titular varía +1 con `suave`, 0 con `normal` y −1 con `intenso`, y un jugador sin minutos +3, +2 y +1; en semana sin partido, +5 con cualquier plan (tope 100).

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 2 | Resultados, clasificación, lesiones, minutos, asistencia y afición los genera una simulación tipo rol con componente aleatorio. Sin módulo externo. | 1.3, 5.5, 8.2, A-01 |
| 9 | Factor de situación: posición × racha (multiplicativo). La racha afecta a la afición (asistencia y moral). | 5.5.4, 8.2, 6.12 |
| 13 | Baja muy larga: más de 120 días. Rango de lesiones: 3 a 150 días. | 5.5.5, 6.6.2, 9.12.4, 12.4 |
| 33 | Ronda 0.9, B-3. Condición física: en semanas con partido solo se recupera lo que da el plan de entrenamiento; en semanas sin partido, +5. El plan intenso mejora atributos (puntos de entrenamiento) y recupera menos. | 9.12.1, 9.12.3 |
| 41 | Ronda 1.0, B-3. Se confirma la columna de recuperación en semana con partido de 9.12.3: +3 `suave`, +2 `normal`, +1 `intenso` (el plan intenso recupera menos). | 9.12.1, 9.12.3 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Límite de dispersión | Razón máxima entre el mayor y el menor reparto de una división: 3,5 con un reparto de 1.500 M€ o más; 4,5 en otro caso (art. 5.5 del Real Decreto-ley 5/2015) [C]. |
