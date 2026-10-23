# Común: preámbulo, glosario, decisiones, fuentes y criterios

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 0.3, 2, 21, 21.1, 21.2, 21.3, 21.4, 22, 23.

### 0.3 Decisiones de producto aplicadas

Las referencias "decisión de producto N" del documento apuntan a esta tabla.

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Modo Coach: la caja la gestiona el jugador, sin presupuesto fijo de la directiva. En Coach no existe el objetivo `presupuesto_no_superar` ni techo de gasto, y no hay consecuencias ligadas a ese objetivo. | 4.4 (`gestor_caja`), 9.1, 9.3, 9.13, 10.4, 13.1, A-02 |
| 2 | Resultados, clasificación, lesiones, minutos, asistencia y afición los genera una simulación tipo rol con componente aleatorio. Sin módulo externo. | 1.3, 5.5, 8.2, A-01 |
| 3 | Cobros y pagos mensuales con un único orden de liquidación por tick. | 5.1.1, 5.2, 6.5, 6.10 |
| 4 | Partida base en la temporada 2026/27. | 4.2, 5.1, 11.1, 15 |
| 5 | Plantillas, jugadores y entrenadores ficticios. Sin nombres reales. | 15.5, 15.3, 18.1 |
| 6 | Clubes, escudos y estadios ficticios. Sin marcas reales. | 15.3, 15.5, 18.1, A-17 |
| 7 | **Sustituida en v0.9 por las decisiones 29 (F-1) y 30 (F-2).** Antes: pools de 990 M€ (nacional) y 1.585 M€ (comercialización) solo de Primera, y pool propio de Segunda. | 6.2.4, 6.2.6, 6.9.1, 6.9.3, 14.1, 14.8 |
| 8 | Derechos digitales: un único modelo. Se elimina el modelo de seguidores. El reparto "por tercios" de esta decisión se sustituye en v0.9 por el modelo legal de la decisión 30 (el 1/3 y 2/3 queda como subdivisión del tramo de implantación social). | 6.2.5, 6.9.2, 8.7, 14.5, 17.3 |
| 9 | Factor de situación: posición × racha (multiplicativo). La racha afecta a la afición (asistencia y moral). | 5.5.4, 8.2, 6.12 |
| 10 | Ocupación máxima: preferente 0,80; VIP 0,95. Una sola fórmula de ocupación (8.2). | 4.6, 7.4, 8.2, 8.6.3, 6.12 |
| 11 | Promanager: se desbloquea por objetivos del club actual. | 9.1, 9.3, 15.4 |
| 12 | Cobros y pagos mensuales: todos en el primer tick del mes, en el orden de la columna "Orden" de 6.5. | 5.1, 5.2, 6.5, 6.10, 6.11 |
| 13 | Baja muy larga: más de 120 días. Rango de lesiones: 3 a 150 días. | 5.5.5, 6.6.2, 9.12.4, 12.4 |
| 14 | Premio de permanencia: gasto del club (prima a la plantilla al cierre de temporada). | 6.3.4, 6.5, 6.6.3 |
| 15 | Aforo de conciertos: aforo propio del evento, con el ingreso ajustado a su aforo. Sin límite por el aforo del estadio. | 4.17, 8.6.1, 8.6.3, 13.5 |
| 16 | INCN: solo derechos, taquilla y comercialización. | 10.1 |
| 17 | Cláusulas (rescisión, casa y coche, prima de gol): la fuente de verdad es la entidad `Clausula`; `Contrato` solo la referencia por id. | 4.9, 4.10, 6.3.4, 6.6 |
| 18 | Ciclo de derechos 2027/28 a 2031/32: 5.250 M€ es el total del ciclo (unos 1.050 M€ por temporada). | 4.2, 6.2.4, 14.1, 14.8, A-04 |
| 19 | **Sustituida en v0.9 por la decisión 30 (F-2).** Antes: factor K = 4,0 [D] sin fuente. Ahora rige el límite legal de dispersión del art. 5.5 del Real Decreto-ley 5/2015 (3,5 veces con un reparto de 1.500 M€ o más; 4,5 en otro caso) [C], más estricto que K = 4,0, que queda redundante y se elimina. | 6.9.2, 14.5, 14.9 |
| 20 | Base de seguidores del club (`seguidores_club`, 4.4) para tienda online y camisetas. `fans_activos` queda solo para asistencia y ocupación de estadio. | 4.4, 8.1, 8.2 |
| 21 | Patrocinio de 8.3 sin cambio de cifra (23 M€, sin naming). El rango de 14.8 para patrocinio pasa al 4 % a 10 %. **Rango sustituido por A-26 (decisión 40, v1.0)**: 4 % a 11 %. El naming va en fila propia de 14.8. | 8.3, 14.8, 14.9 |
| 22 | Vallas publicitarias: fila propia en 14.8 con rango [D] de 7 % a 8 %. **Rango sustituido por A-26 (decisión 40, v1.0)**: 7 % a 9 %. | 6.2.8, 14.8 |
| 23 | Pool digital de 40 M€, sin sumarse al pool audiovisual [D]. El modelo de seguidores de 8.7 era el de los ingresos digitales y queda eliminado. En v0.9 su reparto sigue el modelo legal de la decisión 30 (50/25/25 con límite legal), en lugar de tercios sin límite K. | 6.2.5, 6.9.1, 6.9.2, 8.7, 14.1 |
| 24 | **Sustituida por A-26 (decisión 40, v1.0).** Antes: total de 14.8 en 254 a 260 M€, con derechos al 29 % a 32 % y comercialización al 30 % a 33 %. Ahora: total de referencia 221 M€ [D] (cierre calculado 221,62 M€ en v1.0, 221,46 M€ en v0.9), derechos 26 % a 32 % y comercialización 28 % a 33 %. | 14.8, 14.9 (criterio 8) |
| 25 | Ronda 0.5, decisión 2: naming rights en fila propia de 14.8, con rango 4 % a 5 % [D]. **Rango sustituido por A-26 (decisión 40, v1.0)**: 4 % a 6 %. | 8.3, 14.8 |
| 26 | Ronda 0.5, decisión 3: `fans_activos` entra en la demanda de 8.2 como factor `f_fans` (peso 0,20; rango 0,90 a 1,10). Mismo nombre de campo en 4.4 y 8.2. Cierra A-23. | 4.4, 8.2, 6.12 |
| 27 | Ronda 0.5, decisión 4: merchandising (8.1) al 2 % a 3 % del ingreso total. Para llegar, la base de seguidores pasa de 1.000 a 8.000 por punto de reputación. Cierra A-24. | 4.4, 8.1, 14.8, 14.9 |
| 28 | Ronda 0.7, decisión de producto: mínimo de "otros" en 14.8 bajado de 1 % a 0,5 %. En v0.9 y v1.0, "otros" (museo, tours y premio de liga) sale en 1,75 % del cierre de 221 M€, dentro de la fila. | 14.8, 14.9 (criterio 8) |
| 29 | Ronda 0.9, F-1. Comercialización: 1.585 M€ (1.584,5 M€ [C], informe económico de LaLiga 2024/25, S-02) es el pool de Primera más Segunda, no solo de Primera. El juego usa 1.584,5 M€: Primera recibe el 90 % (1.426,05 M€) y Segunda el 10 % (158,45 M€). Aplicar el 90/10 a la comercialización es [D], por analogía con el art. 5.2 del Real Decreto-ley 5/2015. | 6.2.6, 6.9.1, 14.1, 14.8, 17.2 |
| 30 | Ronda 0.9, F-2. Reparto audiovisual según el Real Decreto-ley 5/2015 [C, BOE, S-14]: art. 5.2, 90 % Primera y 10 % Segunda; art. 5.3 en Primera, 50 % a partes iguales, 25 % por resultados deportivos y 25 % por implantación social, que se divide en 1/3 por recaudación media de abonos y taquilla (5 últimas temporadas) y 2/3 por contribución a la generación de ingresos televisivos (audiencia); art. 5.5, límite de dispersión de 3,5 veces si el reparto es de 1.500 M€ o más, y 4,5 en otro caso. Fondo de compensación de descendidos del 2,5 %: se mantiene. Datos: reparto 2024/25 de 1.432,12 M€ (Primera 1.292,09 / Segunda 140,03) [E, una sola fuente de prensa, la suma cuadra]; ocupación de Segunda 2024/25 68,5 % [C] (61,7 % es la de 2023/24); los 4.950 M€ del ciclo nacional cubren solo partidos de Primera [E]. Sustituye el reparto "por tercios" y el factor K = 4 (decisión 19). | 6.2.4, 6.2.5, 6.9, 14.1, 14.4, 14.5, 14.8, 14.9 |
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 32 | Ronda 0.9, B-2. Tres objetivos por temporada: deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda). Manager: `presupuesto_no_superar` = presupuesto de 10.4. Un entrenador sin club recibe siempre al menos 1 oferta. En Coach y Promanager no se asigna `saldo_minimo` (decisión 46, v1.0). | 9.1, 9.3, 9.8, 9.9, 10.4, 13.7 |
| 33 | Ronda 0.9, B-3. Condición física: en semanas con partido solo se recupera lo que da el plan de entrenamiento; en semanas sin partido, +5. El plan intenso mejora atributos (puntos de entrenamiento) y recupera menos. | 9.12.1, 9.12.3 |
| 34 | Ronda 0.9, B-4. Comercialización e internacional con el mismo modelo legal que la decisión 30 (Primera 50/25/25, con límite legal de dispersión); en Segunda, la posición es la de la temporada anterior. Cierra A-05. | 6.2.5, 6.2.6, 6.9.3 |
| 35 | Ronda 0.9, B-5. Patrocinio = valor de tabla × (0,52 + 0,008 × reputación) [D], que mantiene los 23 M€ del club de referencia; contratos de carga y ofertas al vencer. Precio de taquilla limitado al 50 % a 200 % del precio base. Las plazas de palco vendidas se cobran solo como palco (6.2.3) y no como taquilla (sin doble conteo). | 4.4, 6.2.1, 6.2.3, 8.2, 8.3 |
| 36 | Ronda 0.9, B-6. Una ampliación inutiliza solo el 10 % de su sección mientras dura la obra. Parámetros de eventos, hospitality, palcos, aparcamiento y reforma general [D]. | 7.2, 7.3, 7.7, 8.6 |
| 37 | Ronda 0.9, B-7. Premio de liga incluido en "otros" de 14.8. Generador con caja inicial = 0,25 M€ × reputación (Primera) y personal de 8 M€ [D]. | 14.8, 15.5 |
| 38 | Ronda 0.9, añadido de producto [D]. PCG32 con `initstate = Partida.semilla` e `initseq = k` (índice del flujo), para que dos implementaciones den la misma secuencia. | 4.1, 23.2 |
| 39 | Ronda 0.9, añadido de producto [D]. Determinismo numérico: sin `Math.pow`, `Math.exp` ni `Math.log` (ni equivalentes dependientes de plataforma) en el núcleo; librería matemática propia; importes en céntimos enteros con redondeo explícito (regla de 4.1). Criterio: misma semilla y mismos datos dan el mismo saldo al céntimo tras 3 temporadas. | 4.1, 23.2 |
| 40 | Ronda 1.0, A-26 [D]. Se aceptan los rangos ampliados de 14.8: derechos mínimo 26 % (26 % a 32 %), comercialización mínimo 28 % (28 % a 33 %), patrocinio 4 % a 11 %, naming 4 % a 6 % y vallas 7 % a 9 %; total de referencia del club de referencia de Primera 221 M€ [D] (tolerancia ±1 M€). Sustituye los rangos de las decisiones 21, 22, 24 y 25. Cierra A-26. | 14.8, 14.9 (criterio 8), 16 |
| 41 | Ronda 1.0, B-3. Se confirma la columna de recuperación en semana con partido de 9.12.3: +3 `suave`, +2 `normal`, +1 `intenso` (el plan intenso recupera menos). | 9.12.1, 9.12.3 |
| 42 | Ronda 1.0, B-5c [D]. Tienda física fuera de día de partido: visitantes del mes = visitas de museo y tours del mes; ingreso = visitantes × 0,04 × 35 €, cobrado el primer tick de cada mes. Se elimina la restauración fuera de día de partido de 6.5. | 6.5, 8.1, 8.4, 8.5, 14.8 |
| 43 | Ronda 1.0, B-5d [D]. Restauración: en la versión base solo existe la explotación directa (`margen_club` = 0,30). La concesión con canon queda fuera de alcance, como ampliación futura. Cierra A-12. | 1.2, 8.5, 16 |
| 44 | Ronda 1.0, confirma la elección del redactor de v0.9. El umbral de 1.500 M€ del límite de dispersión se compara con la suma de todos los pools de liga de la temporada (audiovisual, comercialización y digital de Primera y Segunda). | 6.9.1, 14.5 |
| 45 | Ronda 1.0, confirma la elección del redactor de v0.9. Reparto de Segunda 70 % igual, 15 % resultados y 15 % implantación social. | 6.9.3, 14.5 |
| 46 | Ronda 1.0, confirma la elección del redactor de v0.9. En Coach y Promanager no hay objetivo `saldo_minimo` (saldo ≥ 0): solo cuentan el deportivo y la ocupación, con pesos 0,667 y 0,333. | 9.3, 13.1 |
| 47 | Ronda 1.0, confirma la elección del redactor de v0.9. Un jugador no se puede revender en la misma ventana de mercado en que se compró. | 13.3, 19 |
| 48 | Ronda 1.0 [D]. Cierre de las decisiones abiertas restantes de la sección 16 con su recomendación: A-03 (b), A-06 (a), A-07 (b), A-08 (b), A-09 (a: lineal por defecto, francesa como opción ya especificada), A-10 (a), A-13 (b), A-14 (b, la que ya aplica 5.5.2), A-15 (a), A-18 (a), A-19 (a). | 16 |

---

## 2. Glosario

| Término | Definición |
|---|---|
| Aforo | Número total de localidades físicas del estadio, incluidas las de palco, sin contar las obras. |
| Aforo disponible | Aforo menos localidades bloqueadas por obra o mantenimiento en la fecha del partido. |
| Abono | Título de acceso anual o multianual a localidades fijas. |
| Abono 5 años | Abonos con antigüedad de cinco temporadas o más. Desde v0.9 no interviene en el reparto audiovisual (la implantación social usa la recaudación, 6.9.2); se conserva como dato informativo (4.23). |
| Asistencia | Número de espectadores que acceden a un partido o evento. |
| Seguidores del club (`seguidores_club`) | Base de seguidores del club para tienda online y camisetas (4.4, 8.1). Distinta de los aficionados de estadio. [D] |
| Aficionados de estadio (`fans_activos`) | Base de aficionados de estadio, usada solo para asistencia y ocupación (8.2). [D] |
| Ocupación | Asistencia dividida por aforo disponible. Valor en [0, 1]. |
| Taquilla | Ingreso por venta de localidades sueltas en partidos y eventos. |
| Matchday | Conjunto de ingresos ligados a día de partido: taquilla, abonos imputados, palcos, hospitality, restauración y tienda de día. |
| Palco | Espacio cerrado de venta por temporada o por partido. |
| Hospitality | Servicio de experiencia premium por partido (zonas de restauración y acceso prioritario). |
| Naming rights | Derecho de denominación comercial del estadio por contrato plurianual. |
| Derechos audiovisuales | Ingresos por emisión de partidos, nacionales e internacionales. |
| Reparto audiovisual | Distribución de los derechos entre divisiones y clubes según el Real Decreto-ley 5/2015 (6.9) [C]. |
| Resultados deportivos | Tramo del reparto (25 % en Primera) que depende de la posición final de las temporadas anteriores (6.9.2) [C]. |
| Implantación social | Tramo del reparto (25 % en Primera): 1/3 por recaudación media de abonos y taquilla de las 5 últimas temporadas y 2/3 por contribución televisiva (6.9.2) [C]. |
| Contribución televisiva | Parte de la implantación social basada en la aportación de cada club a la generación de ingresos televisivos (audiencia). |
| Límite de dispersión | Razón máxima entre el mayor y el menor reparto de una división: 3,5 con un reparto de 1.500 M€ o más; 4,5 en otro caso (art. 5.5 del Real Decreto-ley 5/2015) [C]. |
| Fichaje | Incorporación de un jugador con coste de traspaso. Se amortiza en el tiempo. |
| Traspaso | Operación de compra o venta de un contrato federativo entre clubes. |
| Cesión | Préstamo de un jugador a otro club. |
| Rescisión | Terminación anticipada de un contrato con indemnización. |
| Cláusula casa y coche | Bonus económico de firma o renovación, cuyo importe crece con el número de jugadores que la tienen. |
| Masa salarial | Definición única en 10.1. |
| Ingresos netos de competición (INCN) | Definición única en 10.1. |
| Promotor | Oferta de evento generada por el sistema, con canon fijo y porcentaje para el club (8.6). No tiene datos propios: sus valores van en `Evento`. [D] |
| Pérdidas permitidas | Pérdida neta máxima de un ejercicio antes de sanción. |
| Reputación del club | Índice de 0 a 100 que afecta a demanda, patrocinio y ofertas. |
| Reputación del entrenador | Índice de 0 a 100 que afecta a honorarios, ofertas y renovaciones. |
| Objetivo | Condición medible de temporada asignada al entrenador o al club. |
| Ventana de mercado | Periodo en el que se pueden registrar altas y bajas (verano e invierno). |
| Inscripción | Registro de un jugador en la plantilla de competición. Limita el número de jugadores. |
| Comunitario | Nacional de un Estado de la Unión Europea o del Espacio Económico Europeo, o de Suiza. [D] Ver 12.2. |

---

## 21. Anexo: fuentes

Las URLs marcadas con [U] se localizaron en esta revisión mediante búsqueda. Su contenido no se ha leído completo en esta revisión; las cifras proceden de la investigación previa y deben contrastarse con la fuente antes de publicar el juego.

### 21.1 Fuentes de LaLiga (economía, 2024/25 y 2025/26)

| Ref. | Contenido | Año | URL | Estado |
|---|---|---|---|---|
| S-01 | Comunicado de cierre de temporada: ingresos y asistencia récord | 2024/25 y 2025/26 | https://www.laliga.com/noticias/laliga-cierra-la-temporada-con-maximos-historicos-en-ingresos-y-asistencia | [U] |
| S-02 | Informe económico 2024/25 en PDF | 2024/25 | https://assets.laliga.com/assets/2026/03/18/originals/5658090da03d3a5134540accdc341c89.pdf | [U]. Leído en parte el 23/10/2026 (pp. 1 a 36 aprox.; anexos no accesibles): comercialización 1.584,5 M€ y retransmisión 1.429,7 M€ (Cuadro 1), agregado de 42 clubes, sin desglose por división. |
| S-03 | Cobertura de prensa del informe de ingresos 2024/25 (más de 5.400 M€) | 2024/25 | https://theobjective.com/actualidad/2026-03-18/laliga-5400-millones-euros-ingresos-2024-2025/ | [U] |
| S-04 | Transparencia de LaLiga: derechos audiovisuales (reparto y criterios) | 2024/25 | https://www.laliga.com/transparencia/gestion-economica/derechos-audiovisuales | [U] |
| S-05 | Nota de prensa de LaLiga (18/03/2026): máximo histórico de ingresos y más de 17 millones de espectadores; ocupación 84,5 % en Primera y 68,5 % en Segunda | 2024/25 | https://www.laliga.com/noticias/laliga-alcanza-un-nuevo-maximo-historico-de-ingresos-y-supera-los-17-millones-de-espectadores | [U]. Ocupaciones verificadas el 23/10/2026 (v0.9; antes fechada en 2025/26). |
| S-14 | Real Decreto-ley 5/2015, versión consolidada (arts. 5.2, 5.3, 5.5 y 6.1) | Vigente | https://www.boe.es/eli/es/rdl/2015/04/30/5/con | Leído el 23/10/2026. Texto consolidado informativo, sin valor jurídico. |
| S-15 | Prensa: venta de los derechos nacionales 2022/23-2026/27 por 4.950 M€ (solo Primera) | 2021 | https://www.moncloa.com/2021/12/13/laliga-consigue-venta-historica-tv-clubes-aficionados-futbol-espanol-1142095/ | [U]. Confirmado solo por prensa. |
| S-16 | Reparto audiovisual 2024/25: nota informativa del órgano de control (tablas no legibles) y prensa con los totales (1.432,12 M€; Primera 1.292,09; Segunda 140,03) | 2024/25 | https://www.laliga.com/es-ID/noticias/nota-informativa-reparto-de-los-ingresos-audiovisuales-de-la-temporada-2024-2025 ; https://www.marketingregistrado.com/futbol/2025/reparto-dinero-derechos-television-laliga-45344/ ; https://www.elgoldigital.com/futbol/laliga-reparto-television-2024-2025-ranking-clubes/ | Total confirmado por varias fuentes; desglose por división de una sola fuente de prensa [E]. Una tercera fuente con el desglose tiene nombre de club en la URL: [URL retirada]. |

### 21.2 Fuentes de clubes (prensa)

| Ref. | Contenido | Año | URL | Estado |
|---|---|---|---|---|
| S-06 | Cuentas de un club de referencia máxima: ingresos de explotación 1.221 M€ | 2025/26 | URL retirada por contener nombre de persona. La misma cifra consta en S-07. | [U] |
| S-07 | Prensa deportiva: ingresos de explotación de un club de referencia máxima, 1.221 M€ | 2025/26 | [URL retirada] | [U] |
| S-08 | Inversión en la reforma de estadio de un club de referencia máxima: 1.408 M€ | 2025/26 | https://www.idealista.com/news/node/908465 | [U] |
| S-09 | Desvío de 40 M€ en la reforma de estadio de un club de referencia máxima | 2025/26 | [URL retirada] | [U] |

### 21.3 Fuentes de la referencia de PC Fútbol

| Ref. | Contenido | Año | URL | Estado |
|---|---|---|---|---|
| S-10 | Historia y contexto de PC Fútbol 5.0 | 1996-97 | https://en.wikipedia.org/wiki/PC_F%C3%BAtbol_5.0 | [U]. No leído en detalle. |
| S-11 | Artículo sobre el regreso de PC Fútbol | Contexto | https://www.elgrafico.com.ar/articulo/esports/75274/el-regreso-del-pc-futbol-un-clasico-inoxidable | [U]. No leído en detalle. |
| S-12 | Colección de revistas de la saga PC Fútbol | Contexto | https://archive.org/details/pc-futbol-revistas | [U]. No leído en detalle. |
| S-13 | Historia de PC Fútbol (auge y caída) | Contexto | https://www.421.news/dinamic-multimedia-pc-futbol | [U]. No leído en detalle. |

### 21.4 Fuentes de la investigación previa sin URL recuperada

Las siguientes referencias proceden de la investigación previa, pero su URL no se recuperó en esta revisión. Deben localizarse antes de citarlas en público. No bloquean el desarrollo [D] (v1.0): ninguna regla depende de ellas, y las cifras relacionadas se usan con su etiqueta [D], [E] o [NV] actual.

| Ref. | Contenido | Año | Estado |
|---|---|---|---|
| P-01 | Mecánicas de PC Fútbol 6 (caja, préstamos, cláusula casa y coche, entrenador) | PC Fútbol 6 | Pendiente de URL primaria (manual). |
| P-02 | Reparto por club 2024/25 (clubes de referencia máxima, alta y grupos) | 2024/25 | Pendiente. Puede estar en S-02. |
| P-03 | Asistencia 2025/26 y media por partido | 2025/26 | Pendiente. Véase 17.2. |
| P-04 | Precios de abonos 2025/26 por club | 2025/26 | Pendiente. |
| P-05 | Club de referencia máxima: ingresos, pérdidas, patrimonio, acuerdos de estadio, notas de prensa 2026 | 2025/26 | Pendiente. |
| P-06 | Club de referencia alta: naming de su estadio | 2024-2033 | Pendiente. |
| P-07 | Club de referencia media: proyecto de estadio nuevo | 2027 | Pendiente. |
| P-08 | Club de referencia media: proyecto de estadio | Proyecto | Pendiente. |
| P-09 | Límite de inversión en fichajes (dos clubes de referencia máxima) | Sin año | Pendiente. |
| P-10 | Resultados de LaLiga 2024/25: resultado neto -81 M€, ratio 60 %, umbral UEFA 70 % | 2024/25 | Pendiente. |
| P-11 | Derechos 2027/28-2031/32 (operadores de emisión A y B; nombres en la fuente) | 2027/28 | Pendiente. |

---

## 22. Historial de cambios del documento

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 22/10/2026 | Primera versión completa como borrador de referencia. |
| 0.2 | 22/10/2026 | Coherencia revisada. Decisiones de producto aplicadas: Coach con caja del jugador (9.1); simulación de resultados, clasificación y lesiones (5.5); cobros y pagos mensuales con orden de liquidación (5.1.1, 5.2, 6.5); partida en 2026/27 (5.1, 11.1); plantillas y clubes ficticios (15, 15.5, 15.6, 18). Se cierran A1 a A12 del informe de revisión, con la fórmula de ocupación única (8.2) y el pool de Primera y Segunda (15.5 y 15.6). Sigue abierta A-04. |
| 0.3 | 22/10/2026 | Decisiones de producto 7 a 19 aplicadas: pools solo de Primera, derechos digitales por tercios (8.7 eliminado), factor de situación posición × racha, ocupación máxima preferente 0,80 y VIP 0,95, cobros y pagos mensuales en el primer tick, baja muy larga de 120 días y lesiones de 3 a 150, premio de permanencia como gasto, aforo propio de eventos, INCN y masa salarial definidas, cláusulas en `Clausula`, ciclo 2027/28 de 5.250 M€ como total, K = 4,0 como decisión [D]. Pendientes técnicos cerrados con propuesta [D]: factores sin definición, abonados de cinco años (4.23), categoría `explotacion_cafeterias`, plantilla con portero, impuesto de sociedades en la semana 4, cuotas aplazadas, trazabilidad de fuentes y anexo. Quedan abiertos A-22 (pesos social y televisivo y fondo de compensación, sin fuente) y la confirmación de las fuentes marcadas [NV] o [C-P] (ver 17). |
| 0.4 | 22/10/2026 | Ronda de coherencia sobre las decisiones de producto. Coach: sin objetivo `presupuesto_no_superar` ni techo de gasto (9.1, 9.3, 9.13, 10.4, 13.1). Nuevo `seguidores_club` (4.4) para tienda online y camisetas (8.1); `fans_activos` solo para asistencia y ocupación. Patrocinio de 8.3 sin cambio de cifra; rango de 14.8 al 4 % a 10 %. Vallas en fila propia de 14.8 (7 % a 8 %). Naming en fila propia de 14.8 (4 % a 5 %). Validación de 14.8 rehecha para un total de 240 a 260 M€; rangos de derechos y comercialización ajustados sin tocar los pools. Pool digital de 40 M€ por tercios, sin sumar al nacional; 8.7 aclarado. Etiquetas [C-P] con fuente no leída pasan a [NV]. Quedan A-23 (`fans_activos`) y A-24 (merchandising fuera de 14.8). |
| 0.5 | 22/10/2026 | Ronda de cuatro decisiones de producto (filas 24 a 27 de 0.3). (1) Total de 14.8 en 240 a 260 M€, rangos de derechos y comercialización sin cambio. (2) Naming en fila propia, sin cambio. (3) `fans_activos` como factor `f_fans` en la demanda de 8.2 (peso 0,20; rango 0,90 a 1,10); campo en 4.4; ejemplos de 6.12 y 8.2 recalculados (asistencia 37.761; taquilla 0,717 M€; saldo de agosto 19,8 M€). Cierra A-23. (4) Merchandising al 2 % a 3 % (8.1 y 14.8): base de seguidores de 8.000 por punto de reputación (antes 1.000; 505.680 en el club de referencia), estimación de 5,63 M€, y mínimo de taquilla y matchday de 10 % a 9 % para que la suma de mínimos quepa en el resto de 240 M€ (12,5 %), sin que la tabla cierre en 240 M€ con estimaciones (A-25). Cierra A-24 y abre A-25 (cierre de 14.8 con estimaciones, 254,4 a 260,0 M€). El concierto de 8.6.3 y la ocupación máxima (0,8904; 38.110 plazas) no cambian. |
| 0.6 | 22/10/2026 | Corrección de la ronda 0.5 y pendientes altos de la revisión v0.5. (1) Total de 14.8 en 254 a 260 M€ (antes 240 a 260 M€; decisión 24 corregida). Cierre con estimaciones entre 254 y 260 M€; A-25 cerrada. Queda abierto el 0,8 % de "otros" a 254 M€ (nota de validación de 14.8). (2) Anclas de derechos nacionales, comercialización y naming marcadas [NV], sin cambio de cifras. (3) 8.1: frase del royalty de camiseta al 71 % eliminada, por no reproducirse con los datos del documento; alternativa de conversión y ticket descrita sin royalty. (4) 6.2.8: `precio_valla_partido` definido [D] (derivado de la modalidad A; 947 € en Primera). (5) Merchandising de 8.1 recalculado a 254 y 260 M€ (2,2 %). (6) Anexo: URLs de S-07 y S-09 retiradas (nombres de clubes) y sustituidas por [URL retirada]; títulos genéricos. Sin cambio de decisiones de producto ni de fuentes. |
| 0.7 | 22/10/2026 | Mínimo de "otros" en 14.8 bajado de 1 % a 0,5 % (decisión de producto 28, sección 0.3). Suma de mínimos de 14.8: 85,5 %. Cierre de 14.8 sin cambio: total de 254 a 260 M€, "otros" entre 0,8 % y 3,1 %. |
| 0.8 | 23/10/2026 | Revisión final de implementabilidad. Ejemplos recalculados con python3 -I sin errores (6.12, 8.1, 8.2, 8.6.3, 14.8). Correcciones técnicas [D] sin cambio de balance: redondeo, generador aleatorio y caja frente a resultado (4.1); campos nuevos en `Club`, `Estadio`, `Obra`, `Jugador`, `Entrenador`, `Movimiento` y `Prestamo`; entidades `Partida`, `Partido`, `Clasificacion` y `Cesion` (4.24 a 4.27); semanas de jornada y calendario (5.4); titulares, minutos y ajuste de goles (5.5); impuestos al orden 1.º de 6.5 (contradicción con 6.10); filas de patrocinio trimestral y anual, royalty de camisetas, cesiones y vallas B en 6.5; `porcentaje_abonados` (6.2.2) y tipo de interés (6.7) con fórmula dentro del rango ya fijado; beneficio contable y compensación de pérdidas (6.8); precisión de K y fondo de Segunda (6.9); aforo de obras (7.2, 7.4); distribución de días de lesión (9.12.4); objetivos de posición en Primera (9.3); comprobación intermedia (10.3); pantallas de Promanager y Manager (13.1); promoción y clubes de reserva (15.6); orden de las tablas 16 y 22; enumeraciones de 20. Puntos que cambian el balance, marcados [pendiente de producto] y propuestos en revision_final_v08.md. Nueva sección 23 (checklist de implementación). Sin cambios en decisiones de producto ni en cifras de fuente. |
| 0.9 | 23/10/2026 | Decisiones de producto F-1, F-2, B-1 a B-7 y dos añadidos de determinismo aplicados (filas 29 a 39 de 0.3). **F-1**: 1.585 M€ (1.584,5 M€ [C]) de comercialización son de Primera y Segunda; 90/10 [D] (1.426,05 / 158,45 M€); se corrigen todas las menciones a "solo Primera" (6.2.6, 14.1, 14.8, 17.2, filas 7 y 24 de 0.3). **F-2**: reparto según el Real Decreto-ley 5/2015 [C]: 90/10 entre divisiones; en Primera 50 % igual, 25 % resultados (escala legal y 5 temporadas) y 25 % implantación (1/3 recaudación, 2/3 audiencia); en Segunda 70/15/15 (mínimo legal); límite de dispersión de 3,5 (4,5 bajo 1.500 M€); fondo del 2,5 % mantenido. Pool audiovisual de liga de 1.432,12 M€ [E] (Primera 1.288,908; Segunda 143,212), que sustituye a 990 + 500 M€ y 120 M€; ocupación de Segunda 68,5 % [C] (14.4, criterio 6). El reparto "por tercios" pasa a ser la subdivisión de la implantación; el factor K = 4 queda redundante con el límite legal de 3,5, que es más estricto, y se elimina (6.9, decisión 19). Campos `recaudacion_historica_cent` (antes `taquilla_historica_cent`) e `historial_posiciones` (4.4, 15.2). **B-1**: mercado (13.2, 13.3), renovación de jugadores (9.9), clubes no controlados, venta forzosa (6.11, cierra A-11), sin cesiones entrantes; bloqueo de venta en la ventana de llegada [D] para cerrar la compra, renovación y reventa. **B-2**: tres objetivos (deportivo, `saldo_minimo` = 0 y ocupación 0,80 / 0,70); Manager con `presupuesto_no_superar` de 10.4; en Coach y Promanager no se asigna `saldo_minimo` porque equivale a un presupuesto (decisión 1), y solo cuentan deportivo y ocupación; entrenador `en_paro` con al menos 1 oferta; club de destino y rescisión a cargo del destino (9.8). **B-3**: recuperación en semanas con partido solo por plan; la columna de condición física de 9.12.3 pasa a +3 / +2 / +1 para que el plan intenso recupere menos, como dice la decisión (la redacción de B-3 en el informe dejaba +3 en intenso). **B-4**: comercialización, internacional y digital con el modelo legal; posición de Segunda de la temporada anterior (cierra A-05 y A-16). **B-5**: patrocinio × (0,52 + 0,008 R) con contratos de carga y ofertas; precio de taquilla entre 50 % y 200 % de `p_ref`; plazas de palco fuera de la taquilla (674.235 € por partido). Quedan pendientes B-5c (ingresos fuera de día de partido) y B-5d (canon de concesión), no decididas. **B-6**: bloqueo del 10 % de la sección en ampliaciones; hospitality de 250 plazas por zona; 30 palcos por obra; aparcamiento de 1.500 plazas; reforma general; parámetros del promotor y multa de horario (7.2, 7.3, 7.7, 8.6). **B-7**: premio de liga en "otros"; generador con caja 0,25 M€ × R y personal de 8 M€ (15.5). **Determinismo** [D]: PCG32 con `initseq = k` y librería matemática propia del núcleo, sin `Math.pow`, `Math.exp` ni `Math.log` (4.1, criterio en 23.2). **Cifras** (calc_v09/check.py): club de referencia de Primera (posición 10.ª, implantación media) con audiovisual 57,1953 M€, digital 1,775 M€ y comercialización 63,2810 M€ (antes 74,5 + 2 + 79,25 M€); taquilla 674.235 € por partido; saldo de agosto de 6.12 de 18,0 M€ (17.961.014,25 €); INCN 135,06 M€ y ratio de masa salarial 0,513. **14.8**: el cierre calculado baja a 221,46 M€, fuera de 254 a 260 M€; sin cambiar ninguna decisión F o B, el total de referencia pasa a 221 M€ [D] y se amplían las filas de derechos (26 % a 32 %), comercialización (28 % a 33 %), patrocinio (4 % a 11 %), naming (4 % a 6 %) y vallas (7 % a 9 %) [D]; "otros" queda en 1,75 %. Ampliaciones de filas pendientes de confirmación (A-26). Nuevas fuentes S-14 a S-16. |
| 1.0 | 23/10/2026 | 1.0 — especificación cerrada para desarrollo. Decisiones de producto definitivas (filas 40 a 48 de 0.3): (1) A-26 aceptada: rangos de 14.8 de patrocinio 4 % a 11 %, naming 4 % a 6 %, vallas 7 % a 9 %, derechos mínimo 26 % y comercialización mínimo 28 %, y total de referencia de 221 M€ [D]; las decisiones 21, 22, 24 y 25 quedan sustituidas por A-26 (decisión 40). (2) B-3: el plan intenso recupera menos (+3 / +2 / +1, decisión 41); se elimina la nota de conflicto de 9.12.3. (3) B-5c: tienda física fuera de día de partido = visitas de museo y tours del mes × 0,04 × 35 € [D] (8.1, nueva fila mensual en 6.5; 151.620 € al año en el club de referencia); se elimina la restauración fuera de día de partido de 6.5 y de 14.8 (decisión 42). (4) B-5d: solo explotación directa de la restauración; concesión con canon fuera de alcance como ampliación futura (1.2, 8.5; decisión 43, cierra A-12). (5) Elecciones del redactor de v0.9 confirmadas: umbral de 1.500 M€ sobre la suma de todos los pools (44), Segunda 70/15/15 (45), sin `saldo_minimo` en Coach y Promanager (46), sin reventa en la ventana de compra (47). Cierre de las decisiones abiertas restantes con la recomendación de la sección 16 [D] (decisión 48): A-03 (b), A-06 (a), A-07 (b), A-08 (b), A-09 (a, lineal por defecto y francesa como opción en 13.6), A-10 (a), A-13 (b), A-15 (a), A-18 (a), A-19 (a); A-14 se cierra con (b), la opción que ya aplicaba 5.5.2 (la recomendación inicial (a) la contradecía). Fuentes P-01 a P-11 (21.4) marcadas como no bloqueantes. **Cifras** (calc_v09/check.py actualizado, con comprobación automática de las filas de 14.8): merchandising 5,7853 M€ (6,3315 M€ con cambio de equipación); cierre de 14.8 221,62 M€ (221,6157 M€): derechos 26,61 %, comercialización 28,55 %, matchday 16,00 %, patrocinio 10,38 %, naming 5,41 %, vallas 8,69 %, merchandising 2,61 % (2,85 %), otros 1,75 %; referencia 1/20 236,70 M€. Sin cambios en 6.12, INCN ni en el resto de ejemplos. Pérdidas permitidas de 60 M€ fijadas como valor de juego [D] (antes "provisional"). Regla general de 0.1 actualizada. |

---

## 23. Checklist de implementación [D] (v0.8; valores actualizados en v0.9 y v1.0)

Criterios verificables por módulo. Salvo que se diga otra cosa, "club de referencia" es un club de Primera con aforo 42.800 (secciones de 7.1), `R = 60`, `aficion_moral = 60`, `fans_activos = 25.680`, `antiguedad_anios = 0`, precio de taquilla 45 €, rival con `R = 25` en agosto, posición 10.ª en las 5 temporadas del historial e implantación social media (6.9.2). Las tolerancias son de 1 céntimo en importes y de 1 unidad en personas, salvo indicación. Los valores esperados salen de calc_v09/check.py (versión 1.0). No hay módulos bloqueados ni puntos pendientes de producto.
