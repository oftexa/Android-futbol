# Carga de datos y contenido

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 15, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 18, 18.1, 18.2.

## 15. Hipótesis de temporada 2026/27: estructura de carga de datos

Esta sección define cómo cargar los datos de partida. **Todos los datos de carga son ficticios** (decisiones de producto 5 y 6). Clubes, estadios, plantillas, jugadores, entrenadores y derechos se generan con el pool ficticio de 15.5. No se usan nombres ni datos personales de jugadores reales, ni nombres reales de clubes. Las cifras de referencia de la sección 6 solo sirven para calibrar. La carga de datos es una tarea posterior y separada.

### 15.1 Entidades a cargar

| Entidad | Cantidad esperada | Fuente de datos | Responsable |
|---|---|---|---|
| Competición | 2 (Primera y Segunda) | Reglas de la temporada | Diseño |
| Temporada | 1 (2026/27) | Calendario oficial | Diseño |
| Club | 42 (20 Primera, 22 Segunda) | Pool ficticio (15.5) | Diseño |
| Club de reserva | 3 (códigos T01 a T03) | Pool ficticio (15.6) | Diseño |
| Estadio | 1 por club | Generado con la plantilla de secciones de 7.1 | Diseño |
| Sección de estadio | 10 a 12 por estadio | Generada con 7.1 | Diseño |
| Plantilla | 1 por club | Generada (15.5) | Diseño |
| Jugador | 26 a 30 por club (Primera); 24 a 28 (Segunda) | Generado (15.5), nombres ficticios | Diseño |
| Contrato | Uno por jugador | Generado (15.5) | Diseño |
| Entrenador | 1 por club | Generado (15.5) | Diseño |
| Derechos audiovisuales | 1 por división y tipo | Calibrado con 6.2.4 y 14.1 | Diseño |

### 15.2 Campos mínimos de carga

**Club (carga)**:

```
codigo_club, nombre_mostrado, division, reputacion_inicial, aforo_total,
caja_inicial_cent, prestamos_iniciales (lista), modo_juego_base, ciudad_grande, renovacion_automatica,
recaudacion_historica_cent (5 enteros), historial_posiciones (5 pares), aforo_medio_anterior, turismo_alto,
secretaria_honorarios_anual, personal_costes_anual
```

[D] (v0.9): `recaudacion_historica_cent` = 5 temporadas iguales, cada una `partidos_local × taquilla_partido` de 8.2 y 6.2.1 con factores neutros (como `aforo_medio_anterior`, 6.9.2) y el precio `p_ref`, más `abonos_objetivo × precio_medio_abono` (6.2.2). Club de referencia: 19 × 674.235 € + 25.680 × 600 € = 28.218.465 € por temporada; 141.092.325 € en las 5 (en v0.8, solo taquilla: 68.113.575 €). `historial_posiciones`: las 5 temporadas con la posición del orden por reputación de la carga, en su división (6.9.2 y 6.9.3).

**Estadio (carga)**:

```
codigo_estadio, codigo_club, nombre_mostrado, aforo_total, secciones (lista de tipo y plazas),
cafeterias_numero, insonorizacion_nivel, cubierta, antiguedad_anios
```

**Jugador (carga)**:

```
codigo_jugador_interno (no real), posicion, nacionalidad_codigo, edad, valor_mercado_cent,
salario_anual_bruto_cent, anios_restantes, coste_fichaje_pendiente_cent, clausulas (lista de tipo e importe_cent; crea filas de Clausula, 4.10)
```

**Derechos (carga)**:

```
temporada, division, tipo, importe_total_temporada_cent, tramos (semana y porcentaje)
```

### 15.3 Reglas de carga

1. Los identificadores de jugador son internos y no se corresponden con personas reales en la versión base [D].
2. Ningún campo debe contener datos personales de jugadores reales (salvo que el proyecto tenga base legal para ello).
3. Los valores de carga se validan contra las reglas de 12.1 (plantilla), 12.2 (extranjeros) y 10.1 (control).
4. La carga se versiona: cada conjunto de datos lleva una fecha de referencia y su fuente.
5. Las cifras de origen externo tienen su propia etiqueta de confianza en el registro de carga.
6. Clubes: nombres y escudos ficticios. Códigos `P01` a `P20` (Primera), `S01` a `S22` (Segunda) y `T01` a `T03` (reserva). No se usan marcas (decisión de producto 6).

### 15.4 Clubes de partida para Promanager

[D] La lista de clubes desbloqueables se carga como tabla separada con: `club_codigo`, `condicion_desbloqueo` (objetivo y temporada), `division`, `reputacion_inicial`. No se incluyen nombres ni cifras en esta versión.

### 15.5 Pool ficticio de clubes, plantillas y jugadores [D]

Pool generado con una semilla fija para 1.ª y 2.ª división. Es ficticio. Sus valores se calibran con la sección 14.

| Parámetro | Primera | Segunda |
|---|---|---|
| Clubes | 20 (P01 a P20) | 22 (S01 a S22) |
| Jugadores con contrato por club | 28 (rango 26 a 30) | 26 (rango 24 a 28) |
| Reparto por posición | 3 porteros, 9 defensas, 9 centrocampistas, 7 delanteros | 3 porteros, 8 defensas, 8 centrocampistas, 7 delanteros |
| Jugadores inscritos | Entre 18 y 25 (12.1) | Entre 18 y 25 (12.1) |
| `calidad` | 50 a 90 | 40 a 78 |
| `velocidad` | 45 a 90 | 40 a 85 |
| `edad` | 18 a 35 | 17 a 36 |
| `salario_anual_bruto` | 0,3 M€ a 12 M€ | 0,1 M€ a 1,5 M€ |
| `valor_mercado` | 0,5 M€ a 60 M€ | 0,1 M€ a 8 M€ |
| Duración de contrato | 1 a 6 años | 1 a 4 años |
| Personal técnico por club | 6 | 4 |
| Aforo de estadio | 25.000 a 60.000 (referencia 42.800, 14.4) | 8.000 a 18.000 (referencia 18.000, 14.4) |
| Proporción de comunitarios | 80 % | 80 % |

Reglas del generador [D]:

- Valores de club [D] (v0.9, B-7, decisión 37), sorteados con el flujo 7:
  - `reputacion_inicial`: entero uniforme en 40 a 90 en Primera y en 20 a 60 en Segunda. El club `P10` tiene R = 60 fijo y es el club de referencia de 14.8.
  - `caja_inicial_cent` = 0,25 M€ × R en Primera (15 M€ con R = 60, el saldo inicial de 6.12) y 0,05 M€ × R en Segunda (2 M€ con R = 40). Sin préstamos iniciales.
  - Personal: Primera, 6 técnicos de 0,5 M€ con calidad 3 (los 6 roles de 4.19), secretaría 2 M€ y dirección 3 M€, 8 M€ en total (14.2); Segunda, 4 técnicos de 0,15 M€ con calidad 3, secretaría 0,4 M€ y dirección 0,5 M€ (1,5 M€).
  - `antiguedad_anios` del estadio: entero uniforme en 0 a 60. El club `P10` usa los valores del club de referencia (aforo 42.800 con las secciones de 7.1, antigüedad 0) [D] (v0.9).
  - `turismo_alto` = verdadero en los 3 clubes de mayor reputación de Primera.
  - Patrocinios de la carga: 8.3.
  - Los 4 roles sin efecto en las fórmulas (fisioterapeuta, ojeador, analista y ayudante) no se pueden despedir, para que despedirlos no ahorre unos 2 M€ sin coste.
- Los nombres de jugadores y entrenadores son ficticios. Antes de publicar el juego se revisa que no coincidan con nombres de personas reales conocidas.
- Cada club empieza con su plantilla completa, sin lesiones y con `condicion_fisica` 80 y `moral` 60 (9.12).
- Cada club tiene un estadio con las secciones de 7.1 escaladas al aforo asignado.

### 15.6 Ascenso, descenso y clubes de reserva [D]

| Concepto | Primera | Segunda |
|---|---|---|
| Ascenso directo | — | 1.ª y 2.ª |
| Promoción de ascenso | — | 3.ª a 6.ª. Cuadro de cuatro: 3.ª contra 6.ª y 4.ª contra 5.ª; los ganadores disputan una final. Partido único, resuelto con 5.5.3. Da una plaza. |
| Permanencia | 17.ª o mejor | — |
| Descenso | 18.ª a 20.ª, a Segunda | 20.ª a 22.ª, a Tercera (fuera del juego) |
| Plazas que quedan vacías | Se cubren con los 3 ascendidos de Segunda | Se cubren con 3 clubes del pool de reserva (T01 a T03). Solo afectan a plantilla y derechos |

El cálculo de plazas cuadra. Primera: 20 − 3 + 3 = 20. Segunda: 22 − 3 (ascienden) − 3 (descienden a Tercera) + 3 (llegan de Primera) + 3 (reserva) = 22. No hay promoción de permanencia en la versión base [D].

Precisiones [D] (v0.8):

- Promoción: las semifinales y la final se juegan en el campo del mejor clasificado en liga, con los ingresos normales de partido de local. Si hay empate, pasa el mejor clasificado (sin prórroga ni penaltis). La posición final de liga no cambia por la promoción (6.9.4 usa la de liga).
- Los cambios de división se aplican en la semana 52, después de evaluar objetivos y antes del reparto de la temporada siguiente (11.4).
- En cada semana 52, el generador de 15.5 crea 3 clubes de reserva nuevos (códigos `T04`, `T05`… en orden) con los parámetros de Segunda, para la temporada siguiente.
- Los clubes que bajan a Tercera dejan la partida (`activo = false`); sus jugadores con contrato pasan a libres. Si el club del jugador baja a Tercera, su entrenador pasa a `en_paro` (9.8) [D] (v0.9, B-2).

---

## 18. Reglas de contenido y de datos personales

### 18.1 Jugadores y clubes

- Los nombres de jugadores, entrenadores y clubes reales no se incluyen en la versión base [D].
- Las marcas, escudos y nombres de estadio son ficticios en el juego (decisión de producto 6; A-17 cerrada).
- Los datos de cuentas de clubes reales se usan solo como referencia de magnitud.
- Los títulos y URL de las fuentes del Anexo (21) pueden contener nombres de clubes reales. Son citas bibliográficas y no pasan al juego. En las descripciones del Anexo se usan denominaciones genéricas (revisión de coherencia, v0.2).

### 18.2 Datos de referencia

- Los datos de la referencia que citan personas (por ejemplo, declaraciones o cifras de directivos) no se incluyen en el juego.
- Los valores de referencia se citan en el Anexo con su URL cuando se localizó.

---

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 4 | Partida base en la temporada 2026/27. | 4.2, 5.1, 11.1, 15 |
| 5 | Plantillas, jugadores y entrenadores ficticios. Sin nombres reales. | 15.5, 15.3, 18.1 |
| 6 | Clubes, escudos y estadios ficticios. Sin marcas reales. | 15.3, 15.5, 18.1, A-17 |
| 11 | Promanager: se desbloquea por objetivos del club actual. | 9.1, 9.3, 15.4 |
| 37 | Ronda 0.9, B-7. Premio de liga incluido en "otros" de 14.8. Generador con caja inicial = 0,25 M€ × reputación (Primera) y personal de 8 M€ [D]. | 14.8, 15.5 |
