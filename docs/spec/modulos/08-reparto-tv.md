# Reparto audiovisual y de liga

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 6.9.

### 6.9 Reparto audiovisual y de liga entre clubes

Modelo del Real Decreto-ley 5/2015 (versión consolidada, BOE, S-14) [C], aplicado en el juego a los tres pools de liga: audiovisual, comercialización (por analogía, [D], decisión 29) y digital (pool propio, [D]). Decisiones 30 (F-2) y 34 (B-4). Sustituye al reparto "por tercios" y al factor K = 4 de v0.8.

#### 6.9.1 Pools y reparto entre divisiones

| Pool (temporada 2026/27) | Liga | Primera (90 %) | Segunda (10 %) | Etiqueta |
|---|---|---|---|---|
| Audiovisual: nacional más internacional (6.2.4 y 6.2.5) | 1.432,12 M€ | 1.288,908 M€ | 143,212 M€ | Importe [E] (reparto 2024/25, S-16); 90/10 [C] (art. 5.2) |
| Comercialización (6.2.6) | 1.584,5 M€ | 1.426,05 M€ | 158,45 M€ | Importe [C] (S-02); 90/10 [D] por analogía (decisión 29) |
| Digital (6.2.5) | — | 40 M€ | 4 M€ | [D]; pool propio de cada división |

- Desde 2027/28: audiovisual de liga 1.492,12 M€ (Primera 1.342,908 M€; Segunda 149,212 M€) [D]. Comercialización y digital sin cambio [D].
- Referencia real: el reparto audiovisual de 2024/25 fue de 1.292,09 M€ en Primera y 140,03 M€ en Segunda (90,2 % y 9,8 %) [E, S-16]. El juego aplica el 90/10 exacto del art. 5.2 sobre el total.
- Los tres pools se reparten por separado con 6.9.2 (Primera) o 6.9.3 (Segunda). No se suman ni compiten entre sí. El fondo de compensación solo se detrae del audiovisual de Segunda (6.9.3).

**Límite de dispersión** (art. 5.5) [C]: dentro de cada división, el mayor reparto no puede superar `L_disp` veces el menor, con `L_disp = 3,5` si el importe total repartido de la temporada es de 1.500 M€ o más, y `L_disp = 4,5` en otro caso. "Importe total repartido" [D] (decisión de producto 44, v1.0; interpretación del art. 5.5, que incluye en el cálculo otros ingresos comerciales; la nota oficial de 2024/25 aplicó 3,5 [C, S-16]): suma de los pools de liga de la temporada (audiovisual, comercialización y digital de las dos divisiones), 3.060,62 M€ en 2026/27 y 3.120,62 M€ desde 2027/28. En la versión base, `L_disp = 3,5`. El límite se aplica a cada pool por separado; si cada pool lo cumple, la suma por club también.

**Factor K** (v0.8, K = 4,0 [D]): eliminado en v0.9. El límite legal de 3,5 es más estricto, así que K quedaba redundante (decisión 19).

#### 6.9.2 Fórmula en Primera

Para cada club `i` de Primera y cada pool `P` de 6.9.1 (art. 5.3) [C]:

```
reparto_bruto_i = P × ( 0,50 / 20  +  0,25 × r_i  +  0,25 × m_i )
```

- **Parte igual** (art. 5.3.a) [C]: 50 % del pool a partes iguales entre los 20 clubes.
- **Resultados deportivos** (art. 5.3.b.1.º), 25 % del pool. Escala y pesos [C]; normalización y temporadas fuera de Primera [D]:

```
r_i = Σ_k w_k × e(pos_i,k) / Σ_j Σ_k w_k × e(pos_j,k)
k = 1 a 5 (temporadas anteriores, 1 = la última); w = 0,35; 0,20; 0,15; 0,15; 0,15
e(p): 1.º 17 %; 2.º 15 %; 3.º 13 %; 4.º 11 %; 5.º 9 %; 6.º 7 %; 7.º 5 %; 8.º 3,5 %; 9.º 3 %; 10.º 2,75 %;
      desde el 11.º, 0,25 puntos menos por puesto hasta el 20.º (0,25 %). Suma: 100 %.
```

  Las posiciones salen de `historial_posiciones` (4.4). Una temporada en Segunda o fuera del juego cuenta `e = 0` [D]; la normalización hace que `r_i` sume 1 entre los 20 clubes. Si los 20 clubes jugaron en Primera las 5 temporadas, el denominador es 1 y `r_i` es la media ponderada de la escala. En la carga (2026/27), las 5 temporadas toman la posición del orden por `reputacion` descendente y `codigo` ascendente [D] (B-4).
- **Implantación social** (art. 5.3.b.2.º), 25 % del pool, con 1/3 por recaudación y 2/3 por contribución televisiva [C]:

```
m_i = (1/3) × T_i / Σ_j T_j  +  (2/3) × c_i
T_i = Σ Club.recaudacion_historica_cent (taquilla y abonos de las 5 últimas temporadas; 4.4, carga en 15.2)
```

  La ley habla de recaudación media; la suma de 5 temporadas da la misma proporción. El tope del 20 % y el mínimo del 2 % por club del art. 5.3.b.2.º no se modelan en la versión base [D].

- `c_i` = contribución televisiva: proporción del club en la generación de ingresos televisivos, medida con audiencia y valor de emisión de sus partidos. En el juego, se calcula con audiencia simulada:

```
c_i = (audiencia_i × factor_partido_i) / Σ_j (audiencia_j × factor_partido_j)
```

- `audiencia_i` [D] = `(0,5 + R_i / 100) × 0,5 × aforo_medio_i`, con `R_i` la reputación del club (4.4) y `aforo_medio_i` la media de `asistencia_partido` de sus partidos de local en la temporada anterior (9.6). En la primera temporada, `aforo_medio_i` es la demanda media del club (8.2). El factor (0,5 + R/100) va de 0,5 a 1,5. Precisión [D] (v0.8): `aforo_medio_i` es `Club.aforo_medio_anterior` (4.4); en la carga, la `asistencia_partido` de 8.2 con `f_resultados`, `f_rival`, `f_precio` y `f_estacional` iguales a 1 y el aforo de la carga. Para un club ascendido, su media en Segunda.
- `factor_partido_i` [D] = 1,0 por defecto; 1,2 si `ciudad_grande` (4.4) es verdadero; 1,5 si la reputación es ≥ 85. Si se cumplen las dos condiciones, se toma 1,5.

**Aplicación del límite de dispersión** (6.9.1) [D en el procedimiento]: se aplica por construcción, con un procedimiento cerrado que siempre cumple el límite:

```
1. Se calcula el reparto bruto reparto_bruto_i con la fórmula anterior.
2. Se busca L > 0 tal que Σ clamp(reparto_bruto_i, L, L_disp × L) = P.
   (Búsqueda por bisección; la función es monótona en L.)
3. reparto_i = clamp(reparto_bruto_i, L, L_disp × L).
```

Precisión numérica [D] (v0.8): bisección sobre L en [0, P / n_clubes], hasta que |Σ − P| < 1 céntimo o 100 iteraciones. Después se redondea cada `reparto_i` a céntimo por el método del mayor resto (4.1), de modo que la suma es exactamente el pool. Si después del redondeo la razón máximo/mínimo supera `L_disp` por un céntimo, se acepta: el criterio 5 de 14.9 se comprueba con tolerancia de 1 céntimo.

Como todos los valores quedan en [L, L_disp × L], la relación máximo/mínimo es como mucho `L_disp` en el 100 % de los casos, y el reparto suma exactamente el pool. Con el modelo legal el límite rara vez actúa: con implantación igual para todos (1/20) y posiciones 1 a 20 en las 5 temporadas, la razón es 0,08 / 0,038125 = 2,10; con implantación del 15 % en el primero y del 2 % en el último, 3,43 [D] (calc_v09/check.py).

Ejemplo de comprobación del procedimiento [D] (v0.9): pool de Primera de 1.288,908 M€ y repartos brutos proporcionales a 1, 2, …, 20. L = 28,6424 M€ y 3,5 × L = 100,2484 M€; los clubes 1 a 4 cobran 28,6424 M€, los 17 a 20 cobran 100,2484 M€ y la suma es 1.288,908 M€ exactos.

**Nombres en el resto del documento**: `reparto_av_i` es el reparto del pool audiovisual (nacional más internacional), `reparto_digital_i` el del digital y `reparto_com_i` el de comercialización.

**Club de referencia de 14.8** [D] (v0.9): posición 10.ª en las 5 temporadas de historial (el objetivo de posición de un club con R = 60, 9.3) e implantación media (`T_i / Σ T` = `c_i` = 1/20, por tanto `m_i` = 1/20). Fracción de cada pool: 0,025 + 0,25 × 0,0275 + 0,25 × 0,05 = 0,044375. Audiovisual: 1.288,908 × 0,044375 = 57,1953 M€ (57.195.292,50 €); digital: 1,775 M€; comercialización: 63,2810 M€ (63.280.968,75 €). El límite no actúa en este caso. Un club con exactamente 1/20 de cada pool cobraría 64,4454 M€, 2,0 M€ y 71,3025 M€.

#### 6.9.3 Fórmula en Segunda

Mismo marco legal que 6.9.2, con los parámetros de Segunda del art. 5.3 (decisión 30) y la posición de la temporada anterior (decisión 34, B-4):

- **Fondo de compensación** (solo pool audiovisual): 2,5 % del pool audiovisual de Segunda para los clubes descendidos de Primera la temporada anterior [C: 2,5 %, art. 6.1; D: base y reparto, se mantiene el de v0.8]. Se reparte entre ellos en proporción a `peso_primera(p) = 2 − 1,5 × (p − 1) / 19` según su posición en Primera. Si no hay descendidos identificables (temporada 2026/27 de la carga), el fondo se suma a `pool_resto`. Comercialización y digital no tienen fondo.
- `pool_resto` = 0,975 × pool en el audiovisual; el pool completo en comercialización y digital.
- **Parte igual**: 70 % de `pool_resto` a partes iguales entre los 22 clubes [C: mínimo legal del 70 % en Segunda, art. 5.3.a; D: se usa el mínimo, decisión de producto 45]. En v0.8 era el 60 %, por debajo del mínimo legal.
- **Resultados**: 15 % de `pool_resto`, por `peso_pos(p) = 2 − 1,5 × (p − 1) / 21` (p = 1 a 22, de 2,0 a 0,5), es decir `0,15 × pool_resto × peso_pos(p) / Σ peso_pos` (Σ = 27,5). En Segunda solo cuenta la última temporada [C, art. 5.3.b.1.º]; la escala `peso_pos` es [D], porque la ley ajusta la escala de Primera a 22 equipos sin fórmula en la parte leída de la fuente.
- **Implantación social**: 15 % de `pool_resto` por `m_i` (6.9.2), con `T_i` y `c_i` calculados solo entre los 22 clubes de Segunda [D].
- **Límite de dispersión**: `L_disp` de 6.9.1, con el procedimiento de 6.9.2 aplicado a `pool_resto`; el fondo se suma después y no entra en el ajuste [D].
- **Posición `p`** [D] (v0.9, B-4): el reparto se calcula en la semana 52 anterior (6.2.4) con la clasificación final de la temporada t − 1 de Segunda, ordenada así: los 3 descendidos de Primera ocupan los puestos 1 a 3 en su orden de Primera; los 16 clubes que siguen en Segunda, los puestos 4 a 19 en su orden final; los clubes de reserva (T), los puestos 20 a 22 por `reputacion` descendente y `codigo` ascendente. En 2026/27, orden por `reputacion` descendente y `codigo` ascendente.

Ejemplo de comprobación [D] (v0.9), pool audiovisual de Segunda de 143,212 M€ con descensos de Primera en 18.º, 19.º y 20.º e implantación igual para todos (1/22): fondo 3,5803 M€, repartido en 1,3562, 1,1934 y 1,0307 M€ (pesos 0,658, 0,579 y 0,500); `pool_resto` 139,6317 M€; parte igual 97,7422 M€ (4,4428 M€ por club); resultados 20,9448 M€; implantación 20,9448 M€. Total del 1.º: 6,9181 M€; del 22.º: 5,7757 M€ (razón 1,20). Suma de los 22 más el fondo: 143,212 M€. En 2026/27, sin descendidos identificables: 1.º 7,0955 M€ y 22.º 5,9238 M€. Comercialización de Segunda (158,45 M€, sin fondo, mismo orden): 1.º 7,8505 M€ y 22.º 6,5541 M€ (media 7,2023 M€).

- Descenso y ascenso: ver 15.6.

**Premios de clasificación en Segunda** [D]: ver tabla 6.9.4.

#### 6.9.4 Premios por posición (propuesta de juego)

| Posición final | Premio por posición (M€, Primera) [D] | Premio por posición (M€, Segunda) [D] | Efecto |
|---|---|---|---|
| 1 | 6,0 | 2,0 | Campeón de liga (Primera); ascenso directo (Segunda) |
| 2 | 4,0 | 1,4 | Ascenso directo (Segunda) |
| 3 a 4 | 4,0 | 1,0 | Primera: 2.ª a 4.ª. Segunda: plazas de promoción (3.ª a 6.ª) |
| 5 a 6 | 2,5 | 1,0 | Segunda: plazas de promoción |
| 7 a 10 | 2,5 | 0,6 | |
| 11 a 16 | 1,2 | 0,6 | |
| 17 | 0,6 | 0,4 | Primera: permanencia directa (ver 15.6). Segunda: fuera de descenso |
| 18 a 19 | 0,3 | 0,4 | Primera: descenso (ver 15.6). Segunda: fuera de descenso |
| 20 | 0,3 | 0,3 | Primera: descenso. Segunda: descenso a Tercera (ver 15.6) |
| 21 a 22 | — | 0,3 | Segunda: descenso a Tercera (ver 15.6) |

Premio de liga [D]: los importes de la columna Primera se cobran en la semana 1 de la temporada siguiente (6.5). Premio de ascenso [D]: 3,0 M€ adicionales al club que asciende a Primera. Se paga en el primer tick de julio de la temporada siguiente (semana 1). El premio de permanencia de Primera está en 6.6.3 y es aparte.

Las cifras son propuestas de equilibrio y no reflejan ningún dato real. Ver 14. Las posiciones de la tabla cubren todas las posiciones de Primera (1 a 20) y de Segunda (1 a 22).

#### 6.9.5 Comparativa con la referencia [NV, P-02; contrastada en parte con S-16 en v0.9]

Los clubes de referencia se citan solo por grupo. El juego no usa nombres reales (sección 18).

| Grupo de referencia (2024/25) | Reparto aproximado [NV, P-02] | Observación |
|---|---|---|
| Dos clubes de referencia máxima | Más de 155 M€ cada uno | Máximo |
| Club de referencia alta | Más de 108 M€ | |
| Club de referencia media-alta | Unos 68 M€ | |
| Grupo intermedio | 55 M€ a 90 M€ | |
| Grupo bajo | 40 M€ a 50 M€ | |

Precisión de v0.9 [E, S-16]: son cifras del reparto audiovisual por club, sin comercialización. En 2024/25 el máximo fue de 157,92 M€ y solo un club de Primera quedó por debajo de 40 M€; la razón supera 3,5 porque el límite del art. 5.5 se calcula con el fondo de compensación y otros ingresos comerciales incluidos. En el juego, el audiovisual de cada club sale del pool de Primera de 1.288,908 M€ con 6.9.2; el club de referencia (posición 10.ª, implantación media) cobra 57,20 M€, dentro del grupo intermedio. La comercialización (6.2.6) y el digital (6.2.5) se reparten aparte.

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 7 | **Sustituida en v0.9 por las decisiones 29 (F-1) y 30 (F-2).** Antes: pools de 990 M€ (nacional) y 1.585 M€ (comercialización) solo de Primera, y pool propio de Segunda. | 6.2.4, 6.2.6, 6.9.1, 6.9.3, 14.1, 14.8 |
| 8 | Derechos digitales: un único modelo. Se elimina el modelo de seguidores. El reparto "por tercios" de esta decisión se sustituye en v0.9 por el modelo legal de la decisión 30 (el 1/3 y 2/3 queda como subdivisión del tramo de implantación social). | 6.2.5, 6.9.2, 8.7, 14.5, 17.3 |
| 19 | **Sustituida en v0.9 por la decisión 30 (F-2).** Antes: factor K = 4,0 [D] sin fuente. Ahora rige el límite legal de dispersión del art. 5.5 del Real Decreto-ley 5/2015 (3,5 veces con un reparto de 1.500 M€ o más; 4,5 en otro caso) [C], más estricto que K = 4,0, que queda redundante y se elimina. | 6.9.2, 14.5, 14.9 |
| 23 | Pool digital de 40 M€, sin sumarse al pool audiovisual [D]. El modelo de seguidores de 8.7 era el de los ingresos digitales y queda eliminado. En v0.9 su reparto sigue el modelo legal de la decisión 30 (50/25/25 con límite legal), en lugar de tercios sin límite K. | 6.2.5, 6.9.1, 6.9.2, 8.7, 14.1 |
| 29 | Ronda 0.9, F-1. Comercialización: 1.585 M€ (1.584,5 M€ [C], informe económico de LaLiga 2024/25, S-02) es el pool de Primera más Segunda, no solo de Primera. El juego usa 1.584,5 M€: Primera recibe el 90 % (1.426,05 M€) y Segunda el 10 % (158,45 M€). Aplicar el 90/10 a la comercialización es [D], por analogía con el art. 5.2 del Real Decreto-ley 5/2015. | 6.2.6, 6.9.1, 14.1, 14.8, 17.2 |
| 30 | Ronda 0.9, F-2. Reparto audiovisual según el Real Decreto-ley 5/2015 [C, BOE, S-14]: art. 5.2, 90 % Primera y 10 % Segunda; art. 5.3 en Primera, 50 % a partes iguales, 25 % por resultados deportivos y 25 % por implantación social, que se divide en 1/3 por recaudación media de abonos y taquilla (5 últimas temporadas) y 2/3 por contribución a la generación de ingresos televisivos (audiencia); art. 5.5, límite de dispersión de 3,5 veces si el reparto es de 1.500 M€ o más, y 4,5 en otro caso. Fondo de compensación de descendidos del 2,5 %: se mantiene. Datos: reparto 2024/25 de 1.432,12 M€ (Primera 1.292,09 / Segunda 140,03) [E, una sola fuente de prensa, la suma cuadra]; ocupación de Segunda 2024/25 68,5 % [C] (61,7 % es la de 2023/24); los 4.950 M€ del ciclo nacional cubren solo partidos de Primera [E]. Sustituye el reparto "por tercios" y el factor K = 4 (decisión 19). | 6.2.4, 6.2.5, 6.9, 14.1, 14.4, 14.5, 14.8, 14.9 |
| 34 | Ronda 0.9, B-4. Comercialización e internacional con el mismo modelo legal que la decisión 30 (Primera 50/25/25, con límite legal de dispersión); en Segunda, la posición es la de la temporada anterior. Cierra A-05. | 6.2.5, 6.2.6, 6.9.3 |
| 44 | Ronda 1.0, confirma la elección del redactor de v0.9. El umbral de 1.500 M€ del límite de dispersión se compara con la suma de todos los pools de liga de la temporada (audiovisual, comercialización y digital de Primera y Segunda). | 6.9.1, 14.5 |
| 45 | Ronda 1.0, confirma la elección del redactor de v0.9. Reparto de Segunda 70 % igual, 15 % resultados y 15 % implantación social. | 6.9.3, 14.5 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Abono 5 años | Abonos con antigüedad de cinco temporadas o más. Desde v0.9 no interviene en el reparto audiovisual (la implantación social usa la recaudación, 6.9.2); se conserva como dato informativo (4.23). |
| Reparto audiovisual | Distribución de los derechos entre divisiones y clubes según el Real Decreto-ley 5/2015 (6.9) [C]. |
| Resultados deportivos | Tramo del reparto (25 % en Primera) que depende de la posición final de las temporadas anteriores (6.9.2) [C]. |
| Implantación social | Tramo del reparto (25 % en Primera): 1/3 por recaudación media de abonos y taquilla de las 5 últimas temporadas y 2/3 por contribución televisiva (6.9.2) [C]. |
