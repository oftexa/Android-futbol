# Preguntas de especificación

Dudas de T-01 (contratos). Cada una indica la sección y la interpretación aplicada. Todas son `TODO(ref)` en el código de `packages/contracts`.

1. **3.3 · Comando y Evento.** La especificación no define catálogo de comandos ni de eventos ni sus `payload`. Se usa un envoltorio genérico `{ tipo, payload }`. Cada tarea de comando define su `payload`.
2. **3.3 · EstadoPartida, Parametros, PaquetesCargados, OpcionesPartida, Proyeccion, Consulta.** Sin forma definida. Forma provisional: `EstadoPartida` es un objeto con un array por entidad; `Proyeccion` es `{ semanas, saldos_cent, minimo_cent }`. Se afinan con la tarea del cargador de packs y con 6.1.
3. **4.24 · Partida.semilla.** Se modela como `bigint` (cabe 2^63 − 1). El JSON de la partida guardada debe codificarla como cadena decimal.
4. **4.4 · precio_taquilla_cent.** Se leyó que `p_ref` (4.500 en Primera, 2.200 en Segunda) está en céntimos, es decir 45 € y 22 €, como indica 23 (precio de taquilla 45 €). El rango exacto por división es cruzado; el esquema valida solo la envolvente [1.100, 9.000] cent.
5. **4.4 · aforo_total.** Derivado (no se guarda en Club, según la propia tabla). No está en el esquema de Club.
6. **4.4 · secretaria_honorarios_anual y personal_costes_anual.** La tabla no fija rango. Se valida `>= 0`.
7. **4.1 · Auditoría.** Se aplica a todas las entidades, incluidas las sin `id` propio (Caja, Clasificacion), por la frase «todas las entidades».
8. **4.5 · Estadio.aforo_disponible_hoy.** Derivado en la tabla. Se modela como campo para caché. La regla `cafeterias_numero <= cafeterias_max` no se valida en el esquema (cruzada).
9. **4.7 · Obra.** Se valida `semanas_pagadas <= semanas_duracion`. El resto de reglas de 7.2 (p. ej. máximo 30 palcos, `insonorizacion_nivel` previo) no se valida aquí.
10. **4.9 · Contrato.plazos_aplazado.** Se valida que los porcentajes sumen 1 cuando hay lista. `anios_restantes` y `fecha_fin` son derivados pero se guardan (la tabla los marca como derivados).
11. **4.11 · Entrenador.** Se valida `club_id` nulo si `estado = en_paro`.
12. **4.12 · Objetivo.** `presupuesto_no_superar` solo existe en modo Manager. Regla de negocio, no validada en el esquema.
13. **4.16 · Prestamo.principal_cent.** El límite `límite_division` no tiene cifra en la tabla. Solo se valida `>= 0`.
14. **4.18 · Oferta.semana y caduca_semana.** Sin rango en la tabla. Se valida `>= 1`.
15. **4.25 · Partido.jornada.** Rango [1, 45] por la promoción de 15.6 (43 a 45).
16. **4.26 · Clasificacion.posicion.** Rango [1, 22] (máximo de equipos). La tabla dice [1, num_equipos]; la cota exacta es cruzada.
17. **4.13 · Movimiento.afecta_caja.** La tabla dice falso en `amortizacion`. No se impone en el esquema.
18. **4.17 · Nombre de la entidad.** Se llama `EventoEstadio` para no chocar con el tipo `Evento` de la API (3.3).
19. **Sección 20 incompleta.** Se usan enumeraciones que solo aparecen en las tablas de entidad: `tipo_clausula`, `rol_personal`, `tipo_ventana`, `gestor_caja`, `origen_objetivo`, `amortizacion_prestamo` y `unidad_desglose`. Conviene añadirlas a la sección 20 en la próxima versión.
20. **4.4 y 4.11 · Listas de tamaño fijo.** `recaudacion_historica_cent` (5 importes) e `historial_posiciones` (5 pares) se validan con longitud exacta 5. `bases_negativas` usa objetos `{ anio_inicio, importe_cent }` en vez de tuplas.

## Revisión de T-01 por modelo mayor (coordinador)

- **[DET-1] UUID en el núcleo.** `Uuid = z.uuidv4()` está bien como formato, pero el núcleo NO puede generar UUID con `crypto.randomUUID()`. Regla: los identificadores se derivan del PCG32 con su propio flujo `k` (T-04), formateados como UUID v4. Aplicar en T-20 (`crearPartida`) y en cualquier comando que cree entidades.
- **[DET-2] Auditoría con fechas reales.** `creado_en`/`actualizado_en` (FechaHora) no pueden venir de `Date` dentro del núcleo. Regla: dentro de `EstadoPartida` se rellenan con la fecha de juego (temporada + semana convertida a fecha ISO fija) o con una constante; las fechas reales solo existen en la capa de persistencia (metadatos del guardado). El hash de determinismo (T-39) no incluye metadatos de persistencia.
- **[API-1] Comando y Evento genéricos.** Se acepta `{tipo, payload}` provisional. Antes de T-50 (cliente del worker) hay que sustituirlo por una unión discriminada con el catálogo real de comandos (crear partida, cambiar plan, fichar, vender, renovar, fijar precio, iniciar obra, contratar evento, pedir préstamo, iniciar temporada) y de eventos.
