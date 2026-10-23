# Monetización del estadio y del club

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 23.5.

## 8. Monetización moderna del estadio y del club

### 8.1 Merchandising

**Tienda física**:

```
ingreso_tienda_fisica_dia = visitantes_tienda_dia × tasa_conversion × ticket_medio
```

- `visitantes_tienda_dia` = `asistencia_partido × 0,15` en día de partido [D] (`asistencia_partido` de 8.2).
- `tasa_conversion` [D] = 0,12 en día de partido; 0,04 fuera de día de partido.
- Fuera de día de partido [D] (v1.0, decisión 42, B-5c): `visitantes_tienda_mes = visitas_museo_mes + visitas_tour_mes`, con `visitas_museo_mes = visitas_museo_anio × multiplicador_m / 12,2` (0 sin sección `museo`) y `visitas_tour_mes = visitas_tour_dia × 300 × multiplicador_m / 12,2`, con los multiplicadores de 8.4. `ingreso_tienda_fuera_mes = visitantes_tienda_mes × 0,04 × 35 €`, cobrado el primer tick del mes m (6.5). No se aplica además la estacionalidad de la tienda (ya va en las visitas). Club de referencia: (95.400 + 12.900) × 0,04 × 35 € = 151.620 € al año; julio y agosto 17.399,02 €; diciembre y enero 8.699,51 €; resto de meses 12.427,87 €, y junio 12.427,85 € (absorbe el redondeo, 4.1).
- `ticket_medio` [D] = 35 €.
- Estacionalidad mensual (multiplicador): julio 1,3; agosto 1,2; septiembre 1,0; octubre y noviembre 1,0; diciembre 1,3; enero 0,9; febrero a junio 0,8. [D] En la tienda de día se aplica el multiplicador del mes del partido [D] (v0.8). La estimación de temporada de más abajo lo omite como aproximación.
- Requisito: sección `tienda_fisica` activa; sin ella, el ingreso es 0 [D] (v0.8). Cobro en la fila de matchday de 6.5.

**Tienda online**:

```
ingreso_online_mes = sesiones_mes × tasa_conversion_online × ticket_medio_online
```

- `sesiones_mes` [D] = `seguidores_club × 1,2`.
- `tasa_conversion_online` [D] = 0,012.
- `ticket_medio_online` [D] = 48 €.
- Multiplicador estacional igual que la tienda física.

**Base de seguidores**: se usa `seguidores_club` (4.4), no `fans_activos`. Valor inicial [D] = `aforo_total × 0,6 + reputacion × 8.000` (v0.5). Con reputación 60, la base es 505.680 seguidores. Se recalcula al inicio de temporada. `fans_activos` (aficionados de estadio) no interviene en tienda ni en camisetas.

**Cambio v0.5 [D] (decisión 27)**: el merchandising sube al 2 % a 3 % del ingreso total. Con 1.000 por punto de reputación, la base era de 85.680 seguidores y el merchandising estimado de 1,33 M€ (0,5 %). El ajuste está en el coeficiente de la base, porque tienda online y camisetas dependen de ella. Como alternativa, con la base de 1.000 por punto y subiendo solo la conversión online y el ticket medio online ×2,5 cada uno, el merchandising daría unos 4,97 M€ (≈2 % de 250 M€). No se usa, porque exige mover dos parámetros de mercado sin fuente. Calibrar con la simulación (14.9, criterio 8).

**Camisetas (royalty del proveedor)**:

```
unidades_camiseta_temporada = seguidores_club × tasa_compra_anual_camiseta × multiplicador_kit
ingreso_camisetas = unidades × precio_neto_camiseta × royalty_club
```

- `tasa_compra_anual_camiseta` [D] = 0,30.
- `multiplicador_kit` = 1,5 en la temporada de cambio de equipación; 1,0 en otras. [D] Se cambia cada dos temporadas. Temporadas de cambio [D] (v0.8): las de `(anio_inicio − 2026)` impar (2027/28, 2029/30…). La partida base 2026/27 es temporada normal, como la estimación de 14.8.
- `seguidores_club` es el de la semana 1 de la temporada; `ingreso_camisetas` se calcula una vez en la semana 1 y se cobra en 12 mensualidades (6.5) [D] (v0.8).
- `precio_neto_camiseta` [D] = 60 €.
- `royalty_club` [D] = 0,12.

**Estimación de temporada (v0.5)** [D]. Club de referencia: aforo 42.800, `R = 60`, 19 partidos de local, asistencia de 8.2 (37.761). La tienda de día se calcula sin multiplicador estacional, como aproximación.

| Partida | Cálculo | Importe |
|---|---|---|
| Tienda física, día de partido | 19 × 37.761 × 0,15 × 0,12 × 35 € | 0,45 M€ |
| Tienda online | 505.680 × 1,2 × 0,012 × 48 € × 11,7 (suma de multiplicadores mensuales) | 4,09 M€ |
| Camisetas, temporada normal | 505.680 × 0,30 × 60 € × 0,12 | 1,09 M€ |
| Tienda física, fuera de día de partido (v1.0, B-5c) | (95.400 + 12.900) × 0,04 × 35 € | 0,15 M€ |
| **Total, temporada normal** | | **5,79 M€** (5.785.342 €): 2,61 % del cierre de 14.8 (221,62 M€) |
| Total, temporada de cambio de equipación (camisetas × 1,5) | | 6,33 M€ (6.331.477 €): 2,85 % del cierre de 14.8 con esas camisetas (222,16 M€) |

Ambos totales están dentro de 2 % a 3 % con el cierre de 14.8 de v1.0 (221 M€) [D].

### 8.2 Demanda, precio y ocupación

**Demanda base del partido**:

```
demanda = demanda_base_division
        × f_reputacion
        × f_resultados
        × f_rival
        × f_precio
        × f_estacional
        × f_aficion
        × f_fans
```

La fórmula incluye `f_aficion` y `f_fans` (tabla siguiente). `f_fans` se añade en la versión 0.5 (decisión 26).

Componentes:

| Factor | Definición | Valor [D] |
|---|---|---|
| demanda_base_division | Demanda base de asistencia total del partido (abonados incluidos), sin precio ni otros factores. (v0.8: antes decía "localidades de taquilla", en contra de 6.2.1, que resta los abonados después.) | Primera: 0,80 × aforo_disponible. Segunda: 0,65 × aforo_disponible. |
| f_reputacion | Función de la reputación del club R ∈ [0, 100]. | 0,70 + 0,006 × R (rango 0,70 a 1,30) |
| f_resultados | Factor de situación: posición × racha, multiplicativo (decisión de producto 9). | `f_resultados = f_posicion × f_racha`. `f_posicion = 1 + 0,10 × (pos_rel − 0,5)`, con `pos_rel = (N − pos) / (N − 1)` (1 = primero, 0 = último); rango 0,95 a 1,05. `f_racha = 1 + 0,05 × racha`, con `racha` ∈ {−1, 0, +1} (5.5.4); rango 0,95 a 1,05. Producto: rango 0,9025 a 1,1025. La racha también afecta a la moral de afición (5.5.4). |
| f_rival | Atractivo del rival. | `0,95 + 0,20 × R_rival / 100` (rango 0,95 a 1,15). |
| f_precio | Elasticidad al precio. | `(p / p_ref)^(−ε)`, con ε = 1,2 y `p_ref` = precio medio de taquilla de referencia de la división (45 € Primera; 22 € Segunda) [D]. `p` en [0,5 × p_ref, 2,0 × p_ref] (4.4, B-5): rango de 0,435 a 2,297. |
| f_estacional | Mes del partido. | Enero y febrero 0,95; marzo a mayo 1,05; resto de meses 1,00 [D]. |
| f_aficion | Moral de la afición (5.5.4). | `0,90 + 0,002 × aficion_moral` (rango 0,90 a 1,10). [D] |
| f_fans | Base de aficionados de estadio (`fans_activos`, 4.4) sobre el aforo total. | `f_fans = clamp(1 + 0,20 × (fans_activos / aforo_total − 0,5), 0,90, 1,10)`. Neutro (1,00) con base igual a la mitad del aforo. Peso 0,20 por unidad de la razón. Rango 0,90 a 1,10. [D] |

Nota de `f_resultados`: la posición es la de la clasificación de la simulación (5.5.4). No depende de ningún módulo externo. Momento [D] (v0.8): se usan la posición y la racha previas al partido (tras la jornada anterior). En la jornada 1, `f_posicion = 1` y `racha = 0`. `N` es `num_equipos` de la competición. En la promoción de Segunda se usa la posición final de liga.

Notas de cálculo [D] (v0.8): `p` de `f_precio` es `Club.precio_taquilla_cent` del club local; `R_rival` es la reputación del visitante; `f_estacional` es el del mes del partido según 5.1.1; `f_reputacion` es el mismo factor en 8.2, 8.4 y 8.6.3. La demanda se calcula para todos los clubes de las dos divisiones, porque alimenta `T_i` y `aforo_medio_i` de 6.9.2.

**Aficionados de estadio (`fans_activos`, factor `f_fans`)** [D]: base de aficionados de estadio (4.4), usada solo para asistencia y ocupación. No interviene en merchandising ni en derechos digitales.

- Peso: 0,20 por unidad de la razón `fans_activos / aforo_total`. Por encima de la mitad del aforo, el factor sube; por debajo, baja.
- Rango: 0,90 a 1,10 (acotado). Una base igual al aforo da el máximo.
- Valor inicial y recálculo al inicio de temporada [D]: `fans_activos = aforo_total × 0,6`. En la versión base no tiene dinámica propia; cerrado en A-23.

**Ejemplo (valores de 6.12)**: aforo disponible 42.800; `R = 60` (`f_reputacion` = 1,06); `aficion_moral = 60` (`f_aficion` = 1,02); `fans_activos` = 25.680, razón 0,6 (`f_fans` = 1 + 0,20 × 0,1 = 1,02). Resto de factores 1,00: `f_resultados` (posición media, racha 0), `f_rival` (R rival 25), `f_precio` (45 €) y `f_estacional` (agosto). Demanda = 0,80 × 42.800 × 1,06 × 1,02 × 1,02 = 37.760,7. Tope = 38.110. Asistencia = 37.761 (ocupación 0,8823). El tope solo se alcanza si el producto de factores supera 1,113 (38.110 / 34.240).

**Fórmula única de ocupación** [D]. Es la única fórmula de ocupación del documento. 6.2.1 y 7.5 la usan:

```
ocupacion_max_global = Σ_secciones(plazas × ocupacion_maxima) / Σ_secciones(plazas)
                       (solo secciones que cuentan como localidades, 7.1)
asistencia_partido   = min(aforo_disponible × ocupacion_max_global, demanda)
ocupacion            = asistencia_partido / aforo_disponible        (en [0, 1])
```

Nota: `ocupacion_maxima` de `grada_preferente` (0,80) y de `zona_vip` (0,95) se fija por decisión de producto 10 (4.6). Con los pesos de 7.1, la ocupación máxima global de Primera es 0,8904 (38.110 plazas de 42.800).

`demanda` es la demanda base del partido multiplicada por los factores de la tabla. La asistencia incluye a los abonados que acuden (`abonados_asistentes`, 6.2.2). Para la taquilla se restan de la asistencia (6.2.1). La fórmula sin abonados de la versión 0.1 queda eliminada.

**Ocupación de referencia** [C, S-05]: 84,5 % en Primera y 68,5 % en Segunda en 2024/25 (el 61,7 % de Segunda es de 2023/24). El modelo debe producir una media entre 80 % y 90 % en un club de reputación media de Primera [D] (14.9, criterio 4). Para Segunda, la referencia de 68,5 % (14.4; 75 % [D] en v0.8) se verifica con el criterio 6 de 14.9. Con los factores neutros, un club de Segunda con R = 40 y aforo 18.000 da una demanda de 11.442,3 y una ocupación de 0,6357 (calc_v09/check.py).

### 8.3 Patrocinio por zona

| Zona | Valor de referencia de juego, por temporada (Primera) [D] | Valor (Segunda) [D] | Notas |
|---|---|---|---|
| camiseta_pecho | 12 M€ | 3 M€ | Patrocinador principal. [NV] Referencia de prensa de un club grande: unos 75 M€ anuales (no confirmado). |
| camiseta_manga | 3 M€ | 0,8 M€ | |
| camiseta_espalda | 2 M€ | 0,5 M€ | |
| estadio_fondo | 2 M€ | 0,5 M€ | |
| estadio_led | 1,5 M€ | 0,4 M€ | Requiere pantalla_led. |
| entrenamiento | 1 M€ | 0,3 M€ | |
| digital | 1,5 M€ | 0,4 M€ | |
| naming | 12 M€ | 2 M€ | Naming del estadio. [NV] Referencia de prensa: naming de un estadio grande por unos 20 M€ anuales, otro por 250 a 300 M€ en total durante unos diez años, 2024 a 2033 (ambos no confirmados). |

**Reglas**:

- Total de la tabla sin naming en Primera: 23 M€. Es la base de la fila de patrocinio de 14.8 (4 % a 11 % de ingresos desde v0.9). El naming (12 M€) va en fila propia de 14.8 y no se suma aquí.
- Un patrocinio de camiseta solo se puede firmar una vez por zona en cada temporada.
- Naming: solo un contrato activo. Duración de 3 a 10 años. [D]
- La parte variable (`importe_variable_max`) = 20 % del importe fijo y se cobra si se cumple el objetivo vinculado. [D]
- La reputación del club condiciona el valor de firma: importe = valor de la tabla × multiplicador, con multiplicador = 0,52 + 0,008 × R (rango 0,52 a 1,32) [D] (v0.9, B-5; antes 0,6 + 0,008 × R, que daba 1,08 y 24,84 M€ con R = 60). Con R = 60 el multiplicador es 1,00: el club de referencia mantiene 23 M€ sin naming y 12 M€ de naming (6.12, 14.8).
- Contratos de la carga [D] (v0.9, B-5): un contrato por zona (`estadio_led` solo si `pantalla_led = true`; `naming` en todos los clubes de Primera, a 10 años), por valor de tabla × multiplicador de la reputación inicial, a 3 años (naming, 10), con `forma_cobro = mensual` y parte variable del 20 % ligada al objetivo deportivo (6.2.7).
- Ofertas [D] (v0.9, B-5): al vencer un contrato, el sistema ofrece uno nuevo en esa zona la semana siguiente, por valor de tabla × multiplicador de la reputación vigente, a 3 años y mensual. Si el jugador lo rechaza, llega otra oferta igual 4 semanas después. En Manager, la directiva firma todas las ofertas (9.1). Los clubes no controlados no tienen caja simulada (B-1), así que sus patrocinios no se calculan.
- Comprobación de la suma [D] (v0.8): 12 + 3 + 2 + 2 + 1,5 + 1 + 1,5 = 23 M€; incluye `estadio_led`, que exige `pantalla_led` (7.1).

### 8.4 Museo y tours

```
visitas_museo_anio = visitas_base × f_reputacion × f_turismo
ingreso_museo = visitas_museo_anio × precio_entrada_museo × (1 − porcentaje_descuento)
```

- `visitas_base` [D] = 90.000 anuales en Primera; 25.000 en Segunda.
- `f_turismo` [D] = 1,0 base; 1,2 si `turismo_alto = true` en la ficha del club (4.4).
- `precio_entrada_museo` [D] = 15 €.
- `porcentaje_descuento` [D] = 0,15 de media (bonos, abonados).
- Tours: `visitas_tour_dia = min(50, round(aforo_total / 1.000))` [D]. Precio por tour: 12 €. Solo fuera de días de partido y eventos. Días habilitados: 300 por año [D]. Los 300 días ya descuentan los días de partido y de evento: no se recalculan con el calendario [D] (v0.8). `ingreso_tours = visitas_tour_dia × 12 € × 300` al año (club de referencia: 43 × 12 × 300 = 154.800 €). "Precio por tour" se lee como precio por visitante.
- El museo exige la sección `museo` activa; sin ella `ingreso_museo = 0`. Los tours no la exigen [D] (v0.8). Club de referencia: 90.000 × 1,06 × 1,0 × 15 € × 0,85 = 1.216.350 € al año.

**Estacionalidad**: multiplicador de verano (julio y agosto) 1,4; invierno (diciembre y enero) 0,7. [D] Resto de meses 1,0. Ingreso del mes m (museo y tours) [D] (v0.8): `ingreso_anual × multiplicador_m / 12,2`, siendo 12,2 la suma de los 12 multiplicadores; así el año suma el ingreso anual.

### 8.5 Restauración y cafeterías

**Cafeterías**: 1 inicial; hasta 20 construibles [NV para el límite de 20; D]. Cada una cuesta 0,6 M€ (7.2).

**Ingreso por partido**:

```
ingreso_restauracion_partido = asistentes × gasto_medio_persona × tasa_captacion × margen_club
```

- `asistentes` = asistencia total del partido.
- `gasto_medio_persona` [D] = 8 € en Primera; 6 € en Segunda.
- `tasa_captacion` [D] = `min(0,85; 0,40 × cafeterias_numero^0,6)`. Es la única tasa que entra en la fórmula. Con una cafetería la tasa es 0,40; con dos, 0,61; el tope es 0,85.
- `margen_club` [D] = 0,30 (explotación directa). En la versión base solo existe la explotación directa [D] (v1.0, decisión 43, B-5d; cierra A-12). La concesión con canon queda fuera de alcance como ampliación futura (1.2).
- No hay restauración fuera de día de partido: la fila se eliminó de 6.5 en v1.0 (decisión 42).
- Club de referencia: 37.761 × 8 € × 0,40 × 0,30 = 36.250,56 € por partido; 0,689 M€ en 19 partidos [D] (v0.8, comprobación).

**Hospitality** en restauración: ver 6.2.3.

**Coste de explotación de cafeterías**: 60.000 € anuales por cafetería [D] (7.2). Categoría `explotacion_cafeterias` (6.5), en 12 mensualidades. Es el mismo importe que el mantenimiento de `nueva_cafeteria` en 7.2; se paga una sola vez (6.3.8).

### 8.6 Eventos y conciertos

#### 8.6.1 Tipos de evento

| Tipo | Aforo típico | Nivel de insonorización requerido | Notas |
|---|---|---|---|
| concierto_nivel_1 | 15.000 a 30.000 | 1 | Solo pop y eventos de bajo volumen [D]. |
| concierto_nivel_2 | 30.000 a 50.000 | 2 | Eventos de volumen medio. |
| concierto_nivel_3 | Más de 50.000 | 3 | Grandes espectáculos. |
| evento_corporativo | 2.000 a 10.000 | 0 | Ferias, presentaciones. |
| competicion_no_futbol | 5.000 a 15.000 | 1 | Deportes de sala o competiciones de otros deportes. |

El aforo del evento es propio (4.17) y puede superar el aforo del estadio. El ingreso se calcula sobre el aforo del evento, sin límite por el aforo del estadio (decisión de producto 15). No hay regla `aforo_evento ≤ aforo_disponible`. [D]

**Parámetros del promotor por tipo** [D] (v0.9, B-6). La oferta del promotor (13.5) trae estos valores fijos en `Evento` (4.17); el jugador no fija precio ni aforo:

| Tipo | `aforo_evento` | `precio_medio` | `canon_fijo` | `porcentaje_club` | Días de montaje / desmontaje | Ingreso con R = 60 (8.6.3) |
|---|---|---|---|---|---|---|
| concierto, nivel 1 | 25.000 | 50 € | 0,5 M€ | 0,15 | 5 / 2 | 666.954 € |
| concierto, nivel 2 | 40.000 | 80 € | 1,5 M€ | 0,15 | 5 / 2 | 1.927.402 € (ejemplo de 8.6.3) |
| concierto, nivel 3 | 60.000 | 100 € | 3,0 M€ | 0,15 | 6 / 2 | 3.801.379 € |
| evento_corporativo | 6.000 | 0 € | 0,15 M€ | 0 | 2 / 1 | 150.000 € |
| competicion_no_futbol | 10.000 | 30 € | 0,2 M€ | 0,10 | 3 / 1 | 221.624 € |

El ingreso por evento queda entre 0,15 M€ y 3,80 M€ con R = 60. `competicion_no_futbol` usa `f_tipo` = 0,8, como los eventos corporativos (8.6.5).

#### 8.6.2 Reglas de aforo y calendario

- Máximo de conciertos por temporada: 6 [D].
- Separación mínima entre eventos: 14 días [D].
- Ningún concierto puede programarse en las 48 horas previas o posteriores a un partido local [D] (regla de calendario).
- Preparación: `dias_preparacion` (4.17) con estadio bloqueado para partidos.
- Eventos con cubierta: sin cancelación por lluvia. Sin cubierta: 10 % de probabilidad de cancelación por evento [D].
- Traducción a ticks semanales [D] (v0.8): un evento ocupa la semana de `Evento.semana` y, si `dias_preparacion + 1 + dias_desmontaje > 7`, las `ceil((dias_preparacion + 1 + dias_desmontaje) / 7) − 1` semanas siguientes. La regla de 48 horas equivale a que ninguna semana ocupada por un concierto tenga partido de local. La separación de 14 días equivale a que las semanas de celebración de dos eventos difieran en 2 o más. La cancelación se sortea en la semana del evento (flujo 5 de 4.1). Un evento cancelado no cobra canon ni porcentaje y no desgasta el césped [D] (v0.9, B-6).

#### 8.6.3 Ingreso de evento

```
ingreso_evento = canon_fijo_cent + porcentaje_club × (aforo_evento × llenado_evento × precio_medio_cent)
llenado_evento = min(ocupacion_max_global, demanda_evento / aforo_evento)
demanda_evento = 0,85 × aforo_evento × f_reputacion × f_tipo
```

- `ocupacion_max_global` es el de 8.2 para el estadio (0,8904 con los valores de 4.6). El evento usa su propia demanda, pero el mismo tope de ocupación que el fútbol (A-21, cerrada). [D]
- `f_tipo` [D] = 1,0 para conciertos; 0,8 para eventos corporativos y competiciones no futbolísticas (8.6.5) [D] (v0.9).

**Ejemplo ilustrativo**: concierto nivel 2, aforo 40.000, precio 80 €, canon 1,5 M€, porcentaje 0,15, R = 60 (`f_reputacion` = 1,06). `demanda_evento` = 0,85 × 40.000 × 1,06 = 36.040, y `demanda_evento / aforo_evento` = 0,901. `llenado_evento` = min(0,8904; 0,901) = 0,8904 (valor redondeado de 0,890421; con el valor exacto el ingreso sería 1.927.402 €). Ingreso = 1.500.000 + 0,15 × (40.000 × 0,8904 × 80) = 1.500.000 + 427.392 = 1.927.392 €.

#### 8.6.4 Limitaciones y ruido

- Nivel de insonorización: `insonorizacion_nivel` (4.5) debe ser igual o superior al del evento. Si no, el evento queda vetado.
- Tope de decibelios no implementado; la regla es de nivel de insonorización y calendario [D].
- Cada evento consume césped según 7.6: −8 puntos sin césped calefactado.
- Multas por incumplimiento de horario: 100.000 € por evento, si el evento supera el horario máximo autorizado [D]. Probabilidad [D] (v0.9, B-6): 0,05 por evento celebrado, sorteada con el flujo 5 después del sorteo de cancelación. La multa se paga en la semana del evento (fila de multas de 6.5).
- Restricciones referencia: en la prensa se ha informado de un veto a conciertos en un estadio por insonorización [NV], sin fuente localizada. Esta regla se modela como caso general, no como dato de club.

#### 8.6.5 Competiciones no futbolísticas

- Ingreso por competición no futbolística: como evento corporativo; sin ingresos de taquilla de partido de liga.

### 8.7 Derechos digitales del club (eliminado)

El modelo de ingreso por seguidores de esta sección era el de los ingresos digitales. Se elimina (decisión de producto 8). Los ingresos digitales son el pool de 40 M€ de 6.2.5, repartido con el modelo legal de 6.9.2 (v0.9, decisión 23). El reparto de los 40 M€ no usa `fans_activos` ni `seguidores_club`. `seguidores_club` (4.4) solo alimenta tienda online y camisetas (8.1), y no entra en ningún ingreso digital.

### 8.8 Cesión de derechos de imagen de jugadores

- Las plantillas pueden ceder derechos de imagen colectivos. [D] Cada jugador con contrato vigente aporta `valor_mercado × 0,0015` al año al club, como ingreso separado, sin relación con el pool digital de 6.2.5. Límite del total: 2 M€ por club y temporada [D].
- Esta regla queda fuera de la versión base (A-13, cerrada en v1.0); el indicador `derechos_imagen_activos` (4.24) es falso.

---

### 23.5 Demanda e ingresos de estadio (sección 8)

- [ ] Club de referencia: `f_reputacion` 1,06, `f_aficion` 1,02, `f_fans` 1,02, demanda 37.760,69, asistencia 37.761, ocupación 0,8823.
- [ ] El tope solo se alcanza si el producto de factores supera 1,1130 (38.110 / 34.240).
- [ ] Palcos del club de referencia: tasa 0,79, 95 palcos, 285.000 € por partido; hospitality: 395 plazas, 59.250 € por partido.
- [ ] Restauración de día: 36.250,56 € por partido.
- [ ] Merchandising de temporada normal: tienda de día 451.999 € (sin estacionalidad), online 4.089.454 €, camisetas 1.092.269 €, tienda fuera de día de partido 151.620 €; total 5.785.342 € (5,79 M€, 2,61 % del cierre de 14.8); en temporada de cambio, 6.331.477 € (6,33 M€, 2,85 %).
- [ ] Museo 1.216.350 € al año y tours 154.800 €; en julio, museo × 1,4 / 12,2.
- [ ] Patrocinio: multiplicador 0,52 + 0,008 × R (1,00 con R = 60); al vencer un contrato, oferta la semana siguiente y, si se rechaza, otra 4 semanas después.
- [ ] Concierto de 8.6.3: 1.927.392 € con llenado 0,8904 y 1.927.402 € con 0,890421.
- [ ] Ingresos por evento con R = 60 (8.6.1): concierto 1, 666.954 €; concierto 3, 3.801.379 €; corporativo, 150.000 €; competición no futbolística, 221.624 €. Un evento cancelado no cobra ni desgasta el césped; multa de horario con p = 0,05.
- [ ] Un concierto no se puede programar en una semana con partido de local ni a menos de 2 semanas de otro evento.
- [ ] Tabla 14.8 (criterio 8 de 14.9): total del club de referencia 221,62 M€ (referencia 221 M€ ± 1 M€, decisión 40); derechos 58,9703 M€ (26,61 %), comercialización 63,2810 M€ (28,55 %), matchday 35,4480 M€ (16,00 %), patrocinio 23 M€ (10,38 %), naming 12 M€ (5,41 %), vallas 19,26 M€ (8,69 %), merchandising 5,7853 M€ (2,61 %), otros 3,8712 M€ (1,75 %, con el premio de liga de 2,5 M€); cada fila dentro de su rango.

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 2 | Resultados, clasificación, lesiones, minutos, asistencia y afición los genera una simulación tipo rol con componente aleatorio. Sin módulo externo. | 1.3, 5.5, 8.2, A-01 |
| 8 | Derechos digitales: un único modelo. Se elimina el modelo de seguidores. El reparto "por tercios" de esta decisión se sustituye en v0.9 por el modelo legal de la decisión 30 (el 1/3 y 2/3 queda como subdivisión del tramo de implantación social). | 6.2.5, 6.9.2, 8.7, 14.5, 17.3 |
| 9 | Factor de situación: posición × racha (multiplicativo). La racha afecta a la afición (asistencia y moral). | 5.5.4, 8.2, 6.12 |
| 10 | Ocupación máxima: preferente 0,80; VIP 0,95. Una sola fórmula de ocupación (8.2). | 4.6, 7.4, 8.2, 8.6.3, 6.12 |
| 15 | Aforo de conciertos: aforo propio del evento, con el ingreso ajustado a su aforo. Sin límite por el aforo del estadio. | 4.17, 8.6.1, 8.6.3, 13.5 |
| 20 | Base de seguidores del club (`seguidores_club`, 4.4) para tienda online y camisetas. `fans_activos` queda solo para asistencia y ocupación de estadio. | 4.4, 8.1, 8.2 |
| 21 | Patrocinio de 8.3 sin cambio de cifra (23 M€, sin naming). El rango de 14.8 para patrocinio pasa al 4 % a 10 %. **Rango sustituido por A-26 (decisión 40, v1.0)**: 4 % a 11 %. El naming va en fila propia de 14.8. | 8.3, 14.8, 14.9 |
| 23 | Pool digital de 40 M€, sin sumarse al pool audiovisual [D]. El modelo de seguidores de 8.7 era el de los ingresos digitales y queda eliminado. En v0.9 su reparto sigue el modelo legal de la decisión 30 (50/25/25 con límite legal), en lugar de tercios sin límite K. | 6.2.5, 6.9.1, 6.9.2, 8.7, 14.1 |
| 24 | **Sustituida por A-26 (decisión 40, v1.0).** Antes: total de 14.8 en 254 a 260 M€, con derechos al 29 % a 32 % y comercialización al 30 % a 33 %. Ahora: total de referencia 221 M€ [D] (cierre calculado 221,62 M€ en v1.0, 221,46 M€ en v0.9), derechos 26 % a 32 % y comercialización 28 % a 33 %. | 14.8, 14.9 (criterio 8) |
| 25 | Ronda 0.5, decisión 2: naming rights en fila propia de 14.8, con rango 4 % a 5 % [D]. **Rango sustituido por A-26 (decisión 40, v1.0)**: 4 % a 6 %. | 8.3, 14.8 |
| 26 | Ronda 0.5, decisión 3: `fans_activos` entra en la demanda de 8.2 como factor `f_fans` (peso 0,20; rango 0,90 a 1,10). Mismo nombre de campo en 4.4 y 8.2. Cierra A-23. | 4.4, 8.2, 6.12 |
| 27 | Ronda 0.5, decisión 4: merchandising (8.1) al 2 % a 3 % del ingreso total. Para llegar, la base de seguidores pasa de 1.000 a 8.000 por punto de reputación. Cierra A-24. | 4.4, 8.1, 14.8, 14.9 |
| 28 | Ronda 0.7, decisión de producto: mínimo de "otros" en 14.8 bajado de 1 % a 0,5 %. En v0.9 y v1.0, "otros" (museo, tours y premio de liga) sale en 1,75 % del cierre de 221 M€, dentro de la fila. | 14.8, 14.9 (criterio 8) |
| 35 | Ronda 0.9, B-5. Patrocinio = valor de tabla × (0,52 + 0,008 × reputación) [D], que mantiene los 23 M€ del club de referencia; contratos de carga y ofertas al vencer. Precio de taquilla limitado al 50 % a 200 % del precio base. Las plazas de palco vendidas se cobran solo como palco (6.2.3) y no como taquilla (sin doble conteo). | 4.4, 6.2.1, 6.2.3, 8.2, 8.3 |
| 36 | Ronda 0.9, B-6. Una ampliación inutiliza solo el 10 % de su sección mientras dura la obra. Parámetros de eventos, hospitality, palcos, aparcamiento y reforma general [D]. | 7.2, 7.3, 7.7, 8.6 |
| 40 | Ronda 1.0, A-26 [D]. Se aceptan los rangos ampliados de 14.8: derechos mínimo 26 % (26 % a 32 %), comercialización mínimo 28 % (28 % a 33 %), patrocinio 4 % a 11 %, naming 4 % a 6 % y vallas 7 % a 9 %; total de referencia del club de referencia de Primera 221 M€ [D] (tolerancia ±1 M€). Sustituye los rangos de las decisiones 21, 22, 24 y 25. Cierra A-26. | 14.8, 14.9 (criterio 8), 16 |
| 42 | Ronda 1.0, B-5c [D]. Tienda física fuera de día de partido: visitantes del mes = visitas de museo y tours del mes; ingreso = visitantes × 0,04 × 35 €, cobrado el primer tick de cada mes. Se elimina la restauración fuera de día de partido de 6.5. | 6.5, 8.1, 8.4, 8.5, 14.8 |
| 43 | Ronda 1.0, B-5d [D]. Restauración: en la versión base solo existe la explotación directa (`margen_club` = 0,30). La concesión con canon queda fuera de alcance, como ampliación futura. Cierra A-12. | 1.2, 8.5, 16 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Seguidores del club (`seguidores_club`) | Base de seguidores del club para tienda online y camisetas (4.4, 8.1). Distinta de los aficionados de estadio. [D] |
| Aficionados de estadio (`fans_activos`) | Base de aficionados de estadio, usada solo para asistencia y ocupación (8.2). [D] |
| Promotor | Oferta de evento generada por el sistema, con canon fijo y porcentaje para el club (8.6). No tiene datos propios: sus valores van en `Evento`. [D] |
