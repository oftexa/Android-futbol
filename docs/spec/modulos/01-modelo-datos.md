# Modelo de datos

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16, 4.17, 4.18, 4.19, 4.20, 4.21, 4.22, 4.23, 4.24, 4.25, 4.26, 4.27, 20, 23.1.

## 4. Modelo de datos

### 4.1 Convenciones generales

| Convención | Regla |
|---|---|
| Identificadores | Cadena UUID v4 para todas las entidades. Campo `id`. |
| Importes | Entero en céntimos de euro (`importe_cent`). Evita errores de coma flotante. |
| Fechas | Fecha ISO 8601 en zona horaria del club; el calendario de temporada usa `semana` y `tick`. |
| Porcentajes | Decimal en [0, 1], salvo cuando se indica "0 a 100". |
| Borrado | Lógico (`activo = false`). No se borran movimientos económicos. |
| Auditoría | Todas las entidades tienen `creado_en`, `actualizado_en` y `version`. |
| Enumeraciones | Valores en minúscula con guion bajo, listados en cada tabla. |
| Redondeo [D] (v0.8) | Los cálculos intermedios se hacen en coma flotante de doble precisión y se redondean solo al guardar. Importes: a céntimo entero, mitades hacia arriba en valor absoluto. Personas, unidades y localidades: al entero más próximo, mitades hacia arriba. Puntos de reputación, moral, condición física y césped: se guardan con un decimal y se muestran enteros, salvo que la regla diga "entero". Repartos que deben sumar un total exacto (pools, 6.9; bolsas, 6.6.3): método del mayor resto sobre céntimos. Series de tramos (10, 12 o N cuotas): todas las cuotas iguales redondeadas a céntimo y la última absorbe la diferencia. |
| Aleatoriedad [D] (v0.8; inicialización fijada en v0.9, decisión 38) | Generador PCG32 (XSH RR, 64 bits de estado, multiplicador 6364136223846793005), inicializado con el procedimiento de referencia `pcg32_srandom(initstate, initseq)`. Semilla de la partida en `Partida.semilla` (4.24). Un flujo independiente por subsistema, con `initstate = Partida.semilla` e `initseq = k` (índice del flujo); el incremento interno es `(initseq << 1) | 1`. Así dos implementaciones producen exactamente la misma secuencia en cada flujo (v0.8 usaba semilla `Partida.semilla + k` sin fijar `initseq`). Flujos: k = 1 calendario, 2 resultados y goles, 3 lesiones, 4 renovación de abonos, 5 eventos, 6 ofertas y despidos, 7 generador de carga. Uniforme `u` ∈ [0, 1) = entero de 32 bits / 2^32. Poisson: algoritmo de Knuth con el mismo flujo. Orden de sorteo: por índice de partido de la jornada (5.4) y, dentro de cada club, por `codigo` de jugador ascendente. |
| Determinismo numérico [D] (v0.9, decisión 39) | El núcleo de simulación (5.5, 6, 7, 8, 9 y 10) no usa `Math.pow`, `Math.exp`, `Math.log` ni otras funciones de coma flotante cuyo resultado dependa de la plataforma o del motor. Usa una librería matemática propia del núcleo: potencias de exponente entero por multiplicación repetida (por ejemplo `u^3` en 9.12.4); potencias de exponente no entero, `exp` y `log` (por ejemplo `10^(−d/25)` y `^0,5` en 5.5.3, `(p / p_ref)^(−1,2)` en 8.2, `cafeterias_numero^0,6` en 8.5) con una aproximación fija (serie o tabla con interpolación) de coeficientes publicados en el código del núcleo e idénticos en todas las plataformas, con error relativo menor de 1e−9 en el rango de uso. Solo se permiten suma, resta, multiplicación, división y raíz cuadrada de IEEE 754 de doble precisión, que son exactas por norma. Los importes monetarios se guardan y acumulan en céntimos enteros; cada paso de coma flotante a céntimos usa la regla de redondeo de esta tabla (mitades hacia arriba en valor absoluto), de forma explícita. Criterio de aceptación en 23.2. |
| Caja frente a resultado [D] (v0.8) | Los movimientos con `afecta_caja = false` (4.13) solo cuentan en la cuenta de resultados (amortización, beneficio contable de traspasos). El saldo de caja solo suma movimientos con `afecta_caja = true`. |

### 4.2 Entidad `Temporada`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | Identificador. |
| anio_inicio | entero | [2020, 2100] | Año de inicio, por ejemplo 2026 para 2026/27. |
| etiqueta | texto | "2026/27" | Derivado de `anio_inicio`. |
| fecha_inicio | fecha | | Primer día de la temporada (inicio de pretemporada). Para la partida base es el inicio de 2026/27 (semana 1 de julio de 2026) [D] (decisión de producto 4). |
| fecha_fin | fecha | | Cierre del ejercicio económico: 30 de junio [D] (A-18, cerrada en v1.0). |
| num_jornadas | entero | 38 o 42 | Según competición. [D] Primera: 38; Segunda: 42, por formato de ida y vuelta (2 × (equipos − 1)). Sin fila en el Anexo. |
| ciclo_derechos | texto | "2022-2027", "2027-2032" | Ciclo de derechos audiovisuales vigente. |
| estado | enumeración | `pretemporada`, `competicion`, `cerrada` | Estado de la temporada. |

Nota: el ciclo de derechos 2022/23-2026/27 termina en la temporada 2026/27 [NV, S-04, no leída en detalle]. El siguiente ciclo empieza en 2027/28 [NV, P-11, sin URL localizada].

### 4.3 Entidad `Competicion`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| nombre | texto | | Por ejemplo, "Primera" o "Segunda" (nombres del juego, sin marcas) [D]. |
| division | enumeración | `primera`, `segunda` | |
| num_equipos | entero | Primera: 20. Segunda: 22 | [D] Formato de la liga. Sin fila en el Anexo. |
| num_jornadas | entero | 38 o 42 | [D] Ver 4.2. |
| partidos_local_por_equipo | entero | Primera: 19. Segunda: 21 | Derivado. |
| ventanas_mercado | lista | verano, invierno | Ver 11.3. |

### 4.4 Entidad `Club`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| codigo | texto | `P01`…`P20`, `S01`…`S22`, `T01`… | Código de carga (15.3). Desempate estable en sorteos y listados [D] (v0.8). |
| nombre | texto | Hasta 60 caracteres | Nombre del club. Sin marcas ni escudos reales en la versión base [D]. |
| division_actual | enumeración | `primera`, `segunda` | |
| reputacion | entero | [0, 100] | Reputación del club. Ver 9.6. |
| seguidores_club | entero | ≥ 0 | Base de seguidores del club para tienda online y camisetas (8.1). Distinta de los aficionados de estadio (`fans_activos`, 8.2), que solo intervienen en asistencia y ocupación. Valor inicial [D] = `aforo_total × 0,6 + reputacion × 8.000` (v0.5, decisión 27; antes 1.000 por punto, que daba 85.680 en el club de referencia). Se recalcula al inicio de temporada. |
| fans_activos | entero | ≥ 0 | Base de aficionados de estadio. Solo entra en asistencia y ocupación, como factor `f_fans` de 8.2 (peso 0,20; rango 0,90 a 1,10). Inicial y recálculo al inicio de temporada [D] = `aforo_total × 0,6` (25.680 en el club de referencia). Sin dinámica propia en la versión base. No interviene en merchandising ni en derechos digitales. |
| ingresos_base_temporada | entero (cent) nulo | ≥ 0 | Referencia para calibración. Opcional; el motor no lo usa [D] (v0.8). |
| precio_taquilla_cent | entero (cent) | [0,5 × p_ref, 2,0 × p_ref] | Precio medio de taquilla del club: es `precio_medio_taquilla` (6.2.1) y `p` de `f_precio` (8.2). Inicial = `p_ref` de la división (4.500 cent en Primera; 2.200 en Segunda). Lo fija el jugador dentro del rango, con efecto desde el siguiente partido de local; en Manager y en los clubes no controlados queda fijo en `p_ref` [D] (v0.9, B-5). Al cambiar de división se acota al rango de la nueva `p_ref` en la semana 1. |
| plan_entrenamiento | enumeración | `suave`, `normal`, `intenso` | Plan vigente (9.12.3). Inicial `normal` [D] (v0.8). |
| plan_entrenamiento_siguiente | enumeración | `suave`, `normal`, `intenso` | Plan elegido por el jugador; pasa a `plan_entrenamiento` en el paso 1 del tick siguiente (9.12.3, retardo de una semana) [D] (v0.8). |
| victorias_consecutivas | entero | ≥ 0 | Contador de liga. Se pone a 0 con empate o derrota [D] (v0.8). |
| derrotas_consecutivas | entero | ≥ 0 | Contador de liga. Se pone a 0 con empate o victoria [D] (v0.8). |
| racha | entero | {−1, 0, +1} | Derivado: +1 si `victorias_consecutivas ≥ 5`; −1 si `derrotas_consecutivas ≥ 5`; 0 en otro caso (5.5.4) [D] (v0.8). |
| despidos_temporada | entero | [0, 1] | Despidos de entrenador en la temporada en curso (9.7, 12.10). Se pone a 0 en la semana 1 [D] (v0.8). |
| bases_negativas | JSON | Lista de (anio_inicio de la temporada, importe_cent ≥ 0) | Pérdidas fiscales pendientes de compensar (6.8). Se eliminan las de más de 5 ejercicios [D] (v0.8). |
| recaudacion_historica_cent | lista de 5 enteros (cent) | ≥ 0 | Recaudación de taquilla y abonos de las 5 últimas temporadas, para `T_i` (6.9.2). La carga la rellena (15.2); al cierre de cada temporada se desplaza y entra la de la temporada [D] (v0.9; antes `taquilla_historica_cent`, solo taquilla). |
| historial_posiciones | lista de 5 pares (division, posicion) | | Posición final de liga de las 5 últimas temporadas (la más reciente primero), para el tramo de resultados de 6.9.2 y 6.9.3. La carga la rellena (15.2); se desplaza en la semana 52 [D] (v0.9). |
| aforo_medio_anterior | entero | ≥ 0 | Media de `asistencia_partido` de local de la temporada anterior (6.9.2, 9.6). En la carga, la asistencia de 8.2 con factores neutros [D] (v0.8). |
| (sin campo propio) | | | El saldo actual se guarda solo en `Caja.saldo_cent` (4.13). Se elimina `caja_saldo` para evitar duplicidad. |
| descubierto_limite | entero (cent) | ≥ 0 | Límite de descubierto permitido. [D] Primera: 20 M€. Segunda: 5 M€. Se actualiza en la semana 1 si el club cambia de división [D] (v0.8). |
| aforo_total | derivado | | Copia de `Estadio.aforo_total` (4.5). No se almacena en Club. |
| secretaria_honorarios_anual | entero (cent) | | Gasto fijo anual de secretaría técnica y administrativa. [D] |
| personal_costes_anual | entero (cent) | | Salarios de personal no futbolístico. [D] |
| modo_juego | enumeración | `coach`, `manager`, `president`, `total`, `promanager` | Ver 9.1. |
| promanager_desbloqueado | booleano | | Solo en modo Promanager. Ver 9.1. |
| gestor_caja | enumeración | `jugador`, `directiva` | Quién lleva la caja. `jugador` en modo Coach, `directiva` en Manager, `jugador` en President, Total y Promanager (9.1). [D] |
| aficion_moral | entero | [0, 100] | Moral de la afición. Inicial 60. Afecta a la demanda (8.2) y se actualiza según resultados (5.5.4). [D] |
| confianza_directiva | entero | [0, 100] | Confianza de la directiva. Inicial 60. Se guarda aquí; la ficha del entrenador (4.11) solo la lee. Ver 9.7. [D] |
| turismo_alto | booleano | | Ficha de club. Si es verdadero, `f_turismo` = 1,2 en el museo (8.4). [D] |
| ciudad_grande | booleano | | Club de ciudad grande: `factor_partido` = 1,2 en el reparto audiovisual (6.9.2). Lo asigna la carga (15.2) a los 4 clubes de Primera con mayor `aforo_total`. [D] Sin datos de población, que el juego no modela. |
| renovacion_automatica | booleano | | Opción de configuración de la partida. Por defecto, falso. Activa la renovación automática del entrenador (9.9). [D] |

### 4.5 Entidad `Estadio`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | Referencia a `Club` | |
| nombre | texto | | Nombre del estadio. |
| naming_contrato_id | UUID nulo | Referencia a `Patrocinio` (zona `naming`, 4.15) | Naming rights vigentes. |
| aforo_total | entero | [5.000, 120.000] | Suma de aforos de secciones. |
| aforo_disponible_hoy | entero | Derivado | Aforo menos bloqueos de obra y de evento (7.4). |
| cesped_estado | entero | [0, 100] | Estado del césped. Ver 7.6. |
| insonorizacion_nivel | entero | [0, 3] | 0 = sin insonorizar; 3 = máximo. Habilita eventos. Ver 8.6. |
| cubierta | booleano | | Cubierta de gradas; afecta a la cancelación de eventos (8.6.2). Sin efecto en la demanda de 8.2 en la versión base [D] (v0.8). |
| pantalla_led | booleano | | Obra `pantalla_led` terminada. Requisito de la zona `estadio_led` (8.3) [D] (v0.8). |
| cesped_calefactado | booleano | | Obra `cesped_calefactado` terminada. Modifica 7.6 [D] (v0.8). |
| antiguedad_anios | entero | [0, 120] | Afecta a mantenimiento (7.7). Suma 1 en la semana 52 [D] (v0.8). |
| cafeterias_max | entero | 20 | Máximo de cafeterías construibles (8.5). [D] |
| cafeterias_numero | entero | [1, cafeterias_max] | Cafeterías en funcionamiento. Inicial: 1 (8.5). [D] |
| obras_activas_max | entero | [1, 3] | Máximo de obras simultáneas. [D] |

### 4.6 Entidad `SeccionEstadio`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| estadio_id | UUID | | |
| tipo | enumeración | `grada_general`, `grada_preferente`, `grada_fondo`, `palcos`, `hospitality`, `zona_vip`, `museo`, `tienda_fisica`, `restauracion`, `zona_eventos`, `aparcamiento` | Tipo de sección. |
| plazas | entero | [0, 60.000] | Número de localidades o unidades de espacio. |
| precio_base_partido | entero (cent) nulo | ≥ 0 | Reservado. La versión base no fija precio por sección: la taquilla usa `Club.precio_taquilla_cent` (4.4) [D] (v0.8). |
| ocupacion_maxima | decimal | [0, 1] | Techo de ocupación por tipo, usado en 8.2. Solo tipos que cuentan como localidades (7.1). Valores [D]: grada_general 0,95; grada_preferente 0,80; grada_fondo 0,90; palcos 0,95; zona_vip 0,95. Preferente 0,80 y VIP 0,95 son decisión de producto. |
| estado_fisico | entero | [0, 100] | Reservado. Ninguna fórmula lo usa en la versión base; valor fijo 100 [D] (v0.8). |
| activa | booleano | | |

### 4.7 Entidad `Obra`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| estadio_id | UUID | | |
| tipo | enumeración | Ver tabla de obras en 7.2 | Tipo de obra. |
| coste_total | entero (cent) | | Coste total. Se paga en cuotas (ver 7.3). |
| semanas_duracion | entero | [1, 260] | Duración. |
| temporada_inicio_id | UUID | Referencia a `Temporada` | Temporada en que empieza. Las obras pueden cruzar temporadas [D] (v0.8). |
| semana_inicio | entero | [1, 52] | Semana de la temporada en que empieza. |
| unidades | entero | ≥ 1 | Plazas nuevas (ampliaciones), palcos nuevos (`construir_palcos`, máximo 30 por obra [D], v0.9) o zonas (`construir_hospitality`); 1 en el resto. `coste_total` = coste base de 7.2 × unidades [D] (v0.8). |
| semanas_pagadas | entero | [0, semanas_duracion] | Cuotas pagadas [D] (v0.8). |
| progreso | decimal | [0, 1] | Avance = `semanas_pagadas / semanas_duracion` [D] (v0.8). Las semanas suspendidas (7.3) no avanzan. |
| aforo_delta | entero | Puede ser negativo | Cambio de aforo al terminar. |
| bloqueo_aforo | entero | ≥ 0 | Localidades bloqueadas durante la obra. Ampliaciones: `round(0,10 × plazas` de la sección al empezar`)`; reforma general: `round(0,25 × aforo_total)`; resto: 0 (7.3) [D] (v0.9, B-6). |
| estado | enumeración | `planificada`, `en_curso`, `finalizada`, `cancelada` | |
| efectos | JSON | Ver 7.2 | Efectos en ingresos y en mantenimiento. |

### 4.8 Entidad `Jugador`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| codigo | texto | Único en la partida | `codigo_jugador_interno` de la carga (15.2). Desempate estable [D] (v0.8). |
| nombre_ficticio | texto | | Nombre ficticio. Ver 18.1. |
| posicion | enumeración | `portero`, `defensa`, `centrocampista`, `delantero` | Posición genérica. |
| nacionalidad_codigo | texto | ISO 3166-1 alfa-2 | Usado para extranjeros comunitarios. |
| es_comunitario | booleano | | Derivado de `nacionalidad_codigo` y de la lista de 12.2. |
| edad | entero | [15, 45] | |
| valor_mercado | entero (cent) | ≥ 0 | Valor de referencia del mercado. Dato de la carga (15.5); sin dinámica en la versión base [D] (v0.8). |
| condicion_fisica | entero | [0, 100] | Ver 9.12. |
| moral | entero | [0, 100] | Ver 9.12. |
| lesion_dias_restantes | entero | ≥ 0 | 0 si no está lesionado. |
| minutos_temporada | entero | ≥ 0 | Minutos de liga de la temporada, generados por la simulación (5.5.2). Inicial 0; se pone a 0 en la semana 1 [D] (v0.8). |
| minutos_semana | entero | [0, 90] | Minutos de la semana en curso (5.5.2), para 9.12.1 [D] (v0.8). |
| semanas_moral_baja | entero | ≥ 0 | Semanas seguidas con `moral < 35` (9.11) [D] (v0.8). |
| solicitud_traspaso_ventanas | entero nulo | [0, 2] | Nulo sin solicitud; 2 al crearla; resta 1 al cerrar cada ventana (9.11) [D] (v0.8). |
| inscrito | booleano | | Si figura en la plantilla de competición. |
| club_id | UUID nulo | | Club actual. Nulo si es libre. |
| contrato_id | UUID nulo | | Contrato vigente. |
| cesion_id | UUID nulo | | Si está cedido. |
| calidad | entero | [1, 100] | Calidad técnica base. Ver 5.5.2. [D] |
| velocidad | entero | [1, 100] | Velocidad y resistencia física base. Ver 5.5.2. [D] |
| puntos_entrenamiento | entero | [0, 100] | Puntos acumulados por entrenamiento. Mejoran calidad y velocidad efectivas (5.5.2). [D] |

### 4.9 Entidad `Contrato`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| jugador_id | UUID | | |
| club_id | UUID | | |
| salario_anual_bruto | entero (cent) | [0, 2.000.000.000 cent] | Salario bruto anual. [D] Topes de referencia en 14.2. |
| fecha_inicio | fecha | | |
| anios_duracion | entero | [1, 6] | Duración en años. |
| anios_restantes | entero | [0, 6] | Años pendientes de contrato. Derivado: año de `fecha_fin` − `Temporada.anio_inicio` de la temporada en curso (un contrato que termina el 30/06/2027 tiene 1 en 2026/27). Todo contrato termina en la semana 52 de su última temporada [D] (v0.8). Usado en 6.6.2. |
| fecha_fin | fecha | Derivado | |
| forma_pago | enumeración | `doce_mensualidades`, `diez_mensualidades`, `aplazado` | Ver 6.3.1. |
| plazos_aplazado | JSON | Lista de (semana, porcentaje) que suman 1 | Solo si `forma_pago = aplazado`. Por defecto, 50 % en la semana 26 y 50 % en la semana 48 [D]. |
| coste_fichaje_cent | entero (cent) | ≥ 0 | Coste de traspaso asociado. Se amortiza (6.4). |
| amortizacion_restante_cent | entero (cent) | ≥ 0 | Valor contable pendiente. |
| clausulas_ids | lista de UUID | Referencias a `Clausula` (4.10) | Cláusulas económicas del contrato. La fuente de verdad es `Clausula`; este campo solo referencia por id. Las cláusulas de casa y coche, rescisión y prima de gol no se duplican aquí. [D] |
| estado | enumeración | `vigente`, `rescindido`, `finalizado`, `cedido` | |

### 4.10 Entidad `Clausula`

Las cláusulas económicas de contrato se modelan como filas independientes para poder auditarlas. Es la **fuente de verdad** de estas cláusulas (decisión de producto 17). La prima de permanencia no es una cláusula de contrato: es un gasto del club (6.6.3).

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| contrato_id | UUID | | |
| tipo | enumeración | `casa_coche`, `rescision`, `prima_gol` | Tipo de cláusula. |
| activa | booleano | | Falso si la cláusula ya no aplica (por ejemplo, tras la venta del jugador). [D] |
| importe_cent | entero | ≥ 0 | Importe fijo, o base de cálculo si es variable. |
| formula | enumeración | `fija`, `por_anios_restantes`, `por_numero_casa_coche` | Ver 6.6. |
| pagado | booleano | | Si ya se ha pagado (casa y coche, firma). |

### 4.11 Entidad `Entrenador`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| nombre_ficticio | texto | | |
| club_id | UUID nulo | | Nulo si `estado` es `en_paro` [D] (v0.8). |
| reputacion | entero | [0, 100] | Ver 9.4. Inicial según división. |
| penalizacion_honorarios_temporadas | entero | [0, 2] | Temporadas restantes con honorarios de oferta × 0,85 tras un despido (9.5). Resta 1 en cada semana 52 [D] (v0.8). |
| honorarios_anual | entero (cent) | ≥ 0 | Ver 9.5. |
| contrato_fecha_fin | fecha | | |
| contrato_anios_restantes | entero | [0, 4] | |
| confianza_directiva | entero | [0, 100] | Ver 9.7. Se guarda en la ficha del club (4.4). Aquí solo se lee. |
| moral_plantilla | entero | [0, 100] | Media de moral de la plantilla. Derivado (9.10). |
| estado | enumeración | `activo`, `despedido`, `dimitido`, `en_paro` | |
| historial_despidos | entero | ≥ 0 | Contador. |

### 4.12 Entidad `Objetivo`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| club_id | UUID | | |
| tipo | enumeración | `posicion_final`, `puntos_minimos`, `copa`, `presupuesto_no_superar`, `saldo_minimo`, `aforo_medio_minimo`, `fichajes_maximos`, `permanencia` | Ver 9.3. `presupuesto_no_superar` solo existe en modo Manager (decisión 1, fila 1 de 0.3). |
| valor_objetivo | decimal | Depende del tipo | Por ejemplo, posición 10. |
| peso | decimal | (0, 1] | Peso del objetivo en la evaluación. |
| cumplido | booleano nulo | | Nulo hasta evaluación. |
| evaluado_en | fecha | | Fecha de evaluación. |
| origen | enumeración | `directiva`, `automatico`, `promanager` | |

### 4.13 Entidad `Caja` y `Movimiento`

`Caja` representa el saldo del club en cada momento. Cada cambio de saldo se registra como `Movimiento`.

**Caja**

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| club_id | UUID | | |
| saldo_cent | entero | Puede ser negativo dentro del descubierto | Saldo actual. |
| saldo_minimo_semana | entero | | Mínimo semanal, para estadísticas. |
| saldo_cierre_temporada | entero | | Saldo al cierre. |

**Movimiento**

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| temporada_id | UUID | | |
| semana | entero | [1, 52] | Semana de la temporada (la semana 53 no se usa, 5.1.1). |
| fecha_efectiva | fecha | | Fecha en la que se hace efectivo el cobro o pago. |
| categoria | enumeración | Ver 6.2 y 6.3 | Categoría contable. |
| subcategoria | texto | | Detalle. |
| importe_cent | entero | Positivo: ingreso; negativo: gasto | |
| origen_id | UUID nulo | | Referencia a la entidad que lo genera. |
| estado | enumeración | `previsto`, `efectivo`, `anulado` | |
| causa | texto | | Descripción legible para el desglose en pantalla (ver principio 7). |
| secuencia_creacion | entero | ≥ 1 | Orden de creación dentro del club. Es el desempate de la liquidación del tick (6.5). Sustituye al id como criterio de orden. [D] |
| afecta_caja | booleano | | Verdadero por defecto. Falso en `amortizacion` y en el apunte de beneficio o pérdida contable de traspasos (6.2.14, 6.3.3): cuentan en resultados, no en el saldo [D] (v0.8). |

### 4.14 Entidad `ContratoDerechos` (derechos audiovisuales)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| division | enumeración | `primera`, `segunda` | |
| tipo | enumeración | `nacional`, `internacional`, `digital`, `comercializacion` | `comercializacion` (6.2.6) usa la misma estructura aunque no es audiovisual [D] (v0.8). |
| importe_total_temporada_cent | entero | ≥ 0 | Importe repartible de la temporada en la división del registro, ya aplicado el 90/10 de 6.9.1 a los importes de liga (`nacional`, `internacional`, `comercializacion`); `digital` es pool propio por división [D] (v0.9). |
| tramos_cobro | JSON | Lista de (semana, porcentaje) | Ver 6.2.4 y 6.5. |
| operador | texto | Nombre ficticio en versión base | Operador de emisión. [D] |

### 4.15 Entidad `Patrocinio`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| zona | enumeración | `camiseta_pecho`, `camiseta_manga`, `camiseta_espalda`, `estadio_fondo`, `estadio_led`, `entrenamiento`, `digital`, `naming` | Ver 8.3. |
| importe_fijo_anual_cent | entero | ≥ 0 | Parte fija anual. |
| importe_variable_max_cent | entero | ≥ 0 | Parte variable máxima por objetivos. |
| objetivo_variable_id | UUID nulo | Referencia a `Objetivo` | Objetivo que activa la parte variable. |
| anios | entero | [1, 10] | Duración. |
| fecha_inicio | fecha | | |
| fecha_fin | fecha | | |
| forma_cobro | enumeración | `mensual`, `trimestral`, `anual_inicio` | |

### 4.16 Entidad `Prestamo`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| principal_cent | entero | [0, límite_division] | Importe dispuesto. |
| tipo_interes_anual | decimal | [0, 0,15] | [D] Tipo fijo. |
| anios | entero | [1, 10] | Plazo. |
| amortizacion | enumeración | `lineal`, `francesa` | Ver 6.7. |
| saldo_pendiente_cent | entero | ≥ 0 | |
| activo | booleano | | |
| semana_disposicion | entero | [1, 52] | Semana en que se cobra el principal. La primera cuota se paga en el primer tick del mes siguiente [D] (v0.8). |
| (constante) | | 4 | Máximo de préstamos activos por club (6.7). Es una constante del sistema, no un campo por préstamo [D] (v0.8; antes `limite_activo_max`). |

### 4.17 Entidad `Concierto` / `Evento`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| estadio_id | UUID | | |
| tipo | enumeración | `concierto`, `evento_corporativo`, `competicion_no_futbol`, `otro` | Los tipos `concierto_nivel_1` a `concierto_nivel_3` de 8.6.1 se guardan como `tipo = concierto` con `nivel` 1 a 3 [D] (v0.8). |
| nivel | entero | [0, 3] | Nivel de insonorización requerido (8.6.1). Solo conciertos (nivel 1 a 3). [D] |
| semana | entero | | Semana de la temporada. |
| dias_preparacion | entero | [1, 14] | Días de montaje (bloquea el estadio). |
| dias_desmontaje | entero | [1, 7] | |
| aforo_evento | entero | [1.000, 120.000] | Aforo propio del evento: localidades ofertadas. No está limitado por el aforo del estadio (decisión de producto 15). El ingreso se ajusta a este aforo (8.6.3). [D] |
| precio_medio_cent | entero | ≥ 0 | Precio medio. |
| canon_fijo_cent | entero | ≥ 0 | Pago fijo del promotor. |
| porcentaje_club | decimal | [0, 1] | Parte variable para el club. |
| coste_cesped_cent | entero | ≥ 0 | Informativo. En la versión base vale 0: el coste del evento sobre el césped es el desgaste de 7.6, que puede activar la reposición de 200.000 € [D] (v0.8). |
| estado | enumeración | `propuesto`, `confirmado`, `celebrado`, `cancelado`, `vetado` | |

### 4.18 Entidad `Oferta` (ofertas de entrenador)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| entrenador_id | UUID | | |
| club_origen_id | UUID | | |
| club_destino_id | UUID | Club del pool ficticio (15.5 y 15.6) | Club destino de la oferta. Debe existir en el pool de clubes de la partida (Primera, Segunda o reserva T01 a T03). [D] |
| division_destino | enumeración | `primera`, `segunda` | |
| honorarios_anual_cent | entero | ≥ 0 | |
| anios | entero | [1, 4] | |
| semana | entero | | Semana de la oferta. |
| caduca_semana | entero | | |
| estado | enumeración | `pendiente`, `aceptada`, `rechazada`, `caducada` | |

### 4.19 Entidad `PersonalTecnico`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| rol | enumeración | `preparador_fisico`, `medico`, `fisioterapeuta`, `ojeador`, `analista`, `ayudante` | |
| salario_anual_cent | entero | ≥ 0 | |
| calidad | entero | [1, 5] | Afecta a lesiones y a moral. |

### 4.20 Entidad `Seguro`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| jugador_id | UUID | | |
| tasa_prima | decimal | [0, 0,2] | Prima como porcentaje del salario. |
| cobertura_lesion | decimal | [0, 1] | Porcentaje de gasto médico cubierto. |
| cobertura_salario_baja | decimal | [0, 1] | Porcentaje de salario cubierto en baja larga. |
| activo | booleano | | |

### 4.21 Entidad `VentanaMercado`

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| tipo | enumeración | `verano`, `invierno` | |
| semana_inicio | entero | | |
| semana_fin | entero | | |
| abierta | booleano | | |

### 4.22 Relaciones principales

| Relación | Cardinalidad | Notas |
|---|---|---|
| Club – Estadio | 1 a 1 | Un club tiene un estadio. |
| Estadio – SeccionEstadio | 1 a N | |
| Estadio – Obra | 1 a N | Como máximo `obras_activas_max` en curso. |
| Estadio – Concierto/Evento | 1 a N | |
| Club – Jugador | 1 a N | Jugador vigente en un club a la vez. |
| Jugador – Contrato | 1 a N histórico; 1 vigente | |
| Contrato – Clausula | 1 a N | |
| Club – Entrenador | 1 a N histórico; 1 activo | |
| Club – Patrocinio | 1 a N | |
| Club – Prestamo | 1 a N; como máximo 4 activos | |
| Club – Objetivo | 1 a N por temporada | |
| Club – Movimiento | 1 a N | Libro de movimientos. |
| Temporada – ContratoDerechos | 1 a N | Por división: un nacional, uno internacional, uno digital y uno de comercialización (v0.9). |
| Club – Abonado | 1 a N | Abonos vigentes y su antigüedad (4.23). |
| Temporada – Partido | 1 a N | Calendario de 5.4 (4.25). [D] (v0.8) |
| Temporada – Clasificacion | 1 a N | Una fila por club y temporada (4.26). [D] (v0.8) |
| Jugador – Cesion | 1 a N histórico; como máximo 1 vigente | 4.27. [D] (v0.8) |

### 4.23 Entidad `Abonado`

Abono con antigüedad. Determina `abonos_vendidos` (6.2.2), cuya recaudación entra en `T_i` (6.9.2). Desde v0.9 el número de abonos de cinco años no interviene en el reparto (F-2); la antigüedad se conserva para la renovación y como dato informativo. Puede almacenarse como contadores por antigüedad en lugar de una fila por abonado; el resultado es el mismo. [D]

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| club_id | UUID | | |
| antiguedad_abono_anios | entero | [1, 120] | Temporadas consecutivas con abono. Alta: 1. Se incrementa al renovar. [D] |
| activo | booleano | | Falso si el abono no se renovó. |

Reglas [D]:

- Al cierre de temporada (semana 52), cada abono se renueva con probabilidad 0,90. Si se renueva, `antiguedad_abono_anios` aumenta en 1; si no, `activo = false`.
- Las altas nuevas son `max(0, abonos_objetivo − abonos_renovados)` (6.2.2), y entran con `antiguedad_abono_anios = 1`.
- Abono de cinco años: abono `activo` con `antiguedad_abono_anios ≥ 5`. Informativo desde v0.9 (antes era `A_i` de 6.9.2).
- La distribución de antigüedad inicial de la carga se genera con el pool ficticio (15.5). [D] (v0.8): cada abono de la carga recibe `antiguedad_abono_anios = k` con probabilidad proporcional a 0,9^(k−1), k = 1 a 30 (distribución estacionaria de la renovación de 0,90). Con ella, el 64,1 % de los abonos de la carga son de cinco años o más.
- Orden [D] (v0.8): la renovación se sortea en la semana 52 (flujo 4 de 4.1) antes de calcular el reparto de la temporada siguiente (11.4, paso 4). Las altas se crean en la semana 1, con el `abonos_objetivo` de la nueva temporada.

### 4.24 Entidad `Partida` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| semilla | entero | [0, 2^63 − 1] | Semilla de la partida (4.1, principio 6). |
| club_jugador_id | UUID | Referencia a `Club` | Club que controla el jugador. Cambia si el entrenador acepta una oferta (13.7). |
| entrenador_jugador_id | UUID | Referencia a `Entrenador` | Entrenador que encarna el jugador. |
| temporada_actual_id | UUID | Referencia a `Temporada` | |
| semana_actual | entero | [1, 52] | Tick en curso. |
| impuesto_tesoreria_activo | booleano | Falso en la versión base | A-10 (cerrada en v1.0: desactivado). |
| prima_gol_activa | booleano | Falso en la versión base | A-07 (cerrada en v1.0: fuera). |
| derechos_imagen_activos | booleano | Falso en la versión base | A-13 (cerrada en v1.0: fuera). |

### 4.25 Entidad `Partido` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | |
| temporada_id | UUID | | |
| competicion_id | UUID | | |
| jornada | entero | [1, 42]; 43 a 45 para la promoción de Segunda (15.6) | |
| indice | entero | ≥ 1 | Orden del partido dentro de la jornada (orden de sorteo, 4.1). |
| semana | entero | [1, 52] | Ver 5.4. |
| local_id | UUID | | |
| visitante_id | UUID | | |
| goles_local | entero nulo | ≥ 0 | Nulo hasta jugarse. |
| goles_visitante | entero nulo | ≥ 0 | |
| asistencia | entero nulo | ≥ 0 | `asistencia_partido` de 8.2. |
| demanda | decimal nulo | ≥ 0 | Para el desglose (principio 7). |

### 4.26 Entidad `Clasificacion` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| temporada_id | UUID | | Clave compuesta con `club_id`. |
| club_id | UUID | | |
| competicion_id | UUID | | |
| jugados, ganados, empatados, perdidos | entero | ≥ 0 | |
| goles_favor, goles_contra | entero | ≥ 0 | |
| puntos | entero | ≥ 0 | 5.5.4. |
| posicion | entero | [1, num_equipos] | Recalculada tras cada jornada con el desempate de 5.5.4. Antes de la jornada 1, orden por `reputacion` descendente y `codigo` ascendente. |

### 4.27 Entidad `Cesion` [D] (v0.8)

| Campo | Tipo | Rango / valores | Descripción |
|---|---|---|---|
| id | UUID | | Es el `Jugador.cesion_id`. |
| jugador_id | UUID | | |
| club_origen_id | UUID | | Club que cede (cobra, 6.2.14). |
| club_destino_id | UUID | | |
| temporada_id | UUID | | Cesiones de una temporada; terminan en la semana 52. |
| cuota_cesion_cent | entero | ≥ 0 | 10 % de `valor_mercado` (6.2.14). |
| porcentaje_salario_tercero | decimal | [0, 1] | 0,50 por defecto (6.2.14). |
| semana_inicio | entero | [1, 52] | |

---

## 20. Glosario de identificadores y enumeraciones

| Enumeración | Valores |
|---|---|
| `division` | `primera`, `segunda` |
| `modo_juego` | `coach`, `manager`, `president`, `total`, `promanager` |
| `tipo_objetivo` | `posicion_final`, `puntos_minimos`, `copa`, `presupuesto_no_superar`, `saldo_minimo`, `aforo_medio_minimo`, `fichajes_maximos`, `permanencia` |
| `tipo_seccion` | `grada_general`, `grada_preferente`, `grada_fondo`, `palcos`, `hospitality`, `zona_vip`, `museo`, `tienda_fisica`, `restauracion`, `zona_eventos`, `aparcamiento` |
| `tipo_obra` | Ver 7.2 |
| `estado_obra` | `planificada`, `en_curso`, `finalizada`, `cancelada` |
| `estado_contrato` | `vigente`, `rescindido`, `finalizado`, `cedido` |
| `forma_pago` | `doce_mensualidades`, `diez_mensualidades`, `aplazado` |
| `estado_movimiento` | `previsto`, `efectivo`, `anulado` |
| `categoria_movimiento` | `taquilla`, `abonos`, `palcos`, `hospitality`, `derechos_tv`, `comercializacion`, `patrocinio`, `vallas`, `merchandising`, `restauracion`, `museo`, `eventos`, `naming`, `traspasos`, `seguros_cobro`, `competicion`, `salarios_jugadores`, `personal`, `amortizacion`, `primas`, `rescision`, `seguros_gasto`, `medico`, `mantenimiento`, `obras`, `prestamos`, `impuestos`, `clausula_casa_coche`, `honorarios_tecnico`, `intereses_descubierto`, `explotacion_cafeterias`, `entrenamientos`, `sanciones`, `aparcamiento`, `derechos_imagen` (v0.8) |
| `tipo_contrato_derechos` | `nacional`, `internacional`, `digital`, `comercializacion` (v0.8) |
| `formula_clausula` | `fija`, `por_anios_restantes`, `por_numero_casa_coche` (v0.8) |
| `estado_temporada` | `pretemporada`, `competicion`, `cerrada` (v0.8) |
| `forma_cobro` | `mensual`, `trimestral`, `anual_inicio` (v0.8) |
| `subcategoria` de `prestamos` | `principal`, `intereses` (v0.8) |
| `tipo_evento` | `concierto`, `evento_corporativo`, `competicion_no_futbol`, `otro` |
| `estado_evento` | `propuesto`, `confirmado`, `celebrado`, `cancelado`, `vetado` |
| `estado_entrenador` | `activo`, `despedido`, `dimitido`, `en_paro` |
| `estado_oferta` | `pendiente`, `aceptada`, `rechazada`, `caducada` |
| `zona_patrocinio` | `camiseta_pecho`, `camiseta_manga`, `camiseta_espalda`, `estadio_fondo`, `estadio_led`, `entrenamiento`, `digital`, `naming` |
| `posicion_jugador` | `portero`, `defensa`, `centrocampista`, `delantero` |
| `intensidad_entrenamiento` | `suave`, `normal`, `intenso` |

---

### 23.1 Datos (sección 4 y 15)

- [ ] Todas las entidades de 4.2 a 4.27 existen con los campos, tipos y rangos de sus tablas; un valor fuera de rango se rechaza al guardar.
- [ ] Importes en céntimos enteros; ningún campo de importe es de coma flotante.
- [ ] `aforo_total` del estadio de referencia = 42.800; `ocupacion_max_global` = 38.110 / 42.800 = 0,890421 (6 decimales).
- [ ] `seguidores_club` inicial del club de referencia = 505.680; `fans_activos` = 25.680.
- [ ] `abonos_objetivo` del club de referencia = 25.680 (`porcentaje_abonados` = 0,60); con R = 40 en Segunda y aforo 18.000, 8.100 (0,45).
- [ ] La antigüedad inicial de abonos sigue 0,9^(k−1): con 25.680 abonos, unos 16.460 tienen 5 años o más (64,1 %, tolerancia ±2 % con la semilla de carga).
- [ ] `recaudacion_historica_cent` del club de referencia: 28.218.465 € por temporada (19 × 674.235 € + 25.680 × 600 €) y 141.092.325 € en las 5.
- [ ] `historial_posiciones` de la carga: las 5 temporadas con la posición del orden por reputación descendente y `codigo` ascendente de su división.
- [ ] El escalado de 7.1 a 25.000 plazas da secciones que suman exactamente 25.000 y palcos múltiplo de 10.
- [ ] Movimientos de `amortizacion` con `afecta_caja = false` no cambian `Caja.saldo_cent`.
- [ ] Generador (15.5): reputación de Primera en 40 a 90 y de Segunda en 20 a 60; `P10` con R = 60; caja inicial 15.000.000 € con R = 60 en Primera y 2.000.000 € con R = 40 en Segunda; personal de 8.000.000 € en Primera y 1.500.000 € en Segunda; sin préstamos; `turismo_alto` en los 3 clubes de mayor reputación; despedir a fisioterapeuta, ojeador, analista o ayudante se rechaza.
- [ ] Patrocinios de carga del club de referencia (8.3): 7 zonas por 23.000.000 € al año (multiplicador 1,00) y naming de 12.000.000 € a 10 años; con R = 90, multiplicador 1,24; con R = 40, 0,84.

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Modo Coach: la caja la gestiona el jugador, sin presupuesto fijo de la directiva. En Coach no existe el objetivo `presupuesto_no_superar` ni techo de gasto, y no hay consecuencias ligadas a ese objetivo. | 4.4 (`gestor_caja`), 9.1, 9.3, 9.13, 10.4, 13.1, A-02 |
| 4 | Partida base en la temporada 2026/27. | 4.2, 5.1, 11.1, 15 |
| 10 | Ocupación máxima: preferente 0,80; VIP 0,95. Una sola fórmula de ocupación (8.2). | 4.6, 7.4, 8.2, 8.6.3, 6.12 |
| 15 | Aforo de conciertos: aforo propio del evento, con el ingreso ajustado a su aforo. Sin límite por el aforo del estadio. | 4.17, 8.6.1, 8.6.3, 13.5 |
| 17 | Cláusulas (rescisión, casa y coche, prima de gol): la fuente de verdad es la entidad `Clausula`; `Contrato` solo la referencia por id. | 4.9, 4.10, 6.3.4, 6.6 |
| 18 | Ciclo de derechos 2027/28 a 2031/32: 5.250 M€ es el total del ciclo (unos 1.050 M€ por temporada). | 4.2, 6.2.4, 14.1, 14.8, A-04 |
| 20 | Base de seguidores del club (`seguidores_club`, 4.4) para tienda online y camisetas. `fans_activos` queda solo para asistencia y ocupación de estadio. | 4.4, 8.1, 8.2 |
| 26 | Ronda 0.5, decisión 3: `fans_activos` entra en la demanda de 8.2 como factor `f_fans` (peso 0,20; rango 0,90 a 1,10). Mismo nombre de campo en 4.4 y 8.2. Cierra A-23. | 4.4, 8.2, 6.12 |
| 27 | Ronda 0.5, decisión 4: merchandising (8.1) al 2 % a 3 % del ingreso total. Para llegar, la base de seguidores pasa de 1.000 a 8.000 por punto de reputación. Cierra A-24. | 4.4, 8.1, 14.8, 14.9 |
| 35 | Ronda 0.9, B-5. Patrocinio = valor de tabla × (0,52 + 0,008 × reputación) [D], que mantiene los 23 M€ del club de referencia; contratos de carga y ofertas al vencer. Precio de taquilla limitado al 50 % a 200 % del precio base. Las plazas de palco vendidas se cobran solo como palco (6.2.3) y no como taquilla (sin doble conteo). | 4.4, 6.2.1, 6.2.3, 8.2, 8.3 |
| 38 | Ronda 0.9, añadido de producto [D]. PCG32 con `initstate = Partida.semilla` e `initseq = k` (índice del flujo), para que dos implementaciones den la misma secuencia. | 4.1, 23.2 |
| 39 | Ronda 0.9, añadido de producto [D]. Determinismo numérico: sin `Math.pow`, `Math.exp` ni `Math.log` (ni equivalentes dependientes de plataforma) en el núcleo; librería matemática propia; importes en céntimos enteros con redondeo explícito (regla de 4.1). Criterio: misma semilla y mismos datos dan el mismo saldo al céntimo tras 3 temporadas. | 4.1, 23.2 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Abono 5 años | Abonos con antigüedad de cinco temporadas o más. Desde v0.9 no interviene en el reparto audiovisual (la implantación social usa la recaudación, 6.9.2); se conserva como dato informativo (4.23). |
| Seguidores del club (`seguidores_club`) | Base de seguidores del club para tienda online y camisetas (4.4, 8.1). Distinta de los aficionados de estadio. [D] |
