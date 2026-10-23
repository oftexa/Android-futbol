# Índice de criterios de aceptación (sección 23)

Un criterio por fila. El identificador `AC-23.x-yy` es la posición del criterio en su bloque, según
`docs/spec/criterios.md`. Estado: **real** = test que pasa hoy; **real (parcial)** = pasa, pero solo
cubre parte del criterio; **todo** = `it.todo` con el código completo comentado encima.

Total: 83 criterios. Reales: 3, todos parciales (ver la columna de estado). Pendientes (todo): 80.

| AC         | Archivo de test                | Función del núcleo                                         | Tarea               | Estado                                                                   |
| ---------- | ------------------------------ | ---------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------ |
| AC-23.1-01 | 23.1-datos.spec.ts             | `Club`, `Estadio`, `SeccionEstadio` (contracts)            | T-01                | real (parcial: 3 de las 26 entidades 4.2 a 4.27; el resto, en contracts) |
| AC-23.1-02 | 23.1-datos.spec.ts             | `Club`, `SeccionEstadio` (contracts)                       | T-01                | real (parcial: importes de Club y SeccionEstadio)                        |
| AC-23.1-03 | 23.1-datos.spec.ts             | `ocupacionMaxGlobal` (propuesta)                           | T-28                | todo                                                                     |
| AC-23.1-04 | 23.1-datos.spec.ts             | `derivadosClub`                                            | T-17                | todo                                                                     |
| AC-23.1-05 | 23.1-datos.spec.ts             | `derivadosClub`                                            | T-17                | todo                                                                     |
| AC-23.1-06 | 23.1-datos.spec.ts             | `generarAntiguedades`                                      | T-16                | todo                                                                     |
| AC-23.1-07 | 23.1-datos.spec.ts             | `derivadosClub`                                            | T-17                | todo                                                                     |
| AC-23.1-08 | 23.1-datos.spec.ts             | `crearPartida`                                             | T-20                | todo                                                                     |
| AC-23.1-09 | 23.1-datos.spec.ts             | `escalarSecciones`                                         | T-15                | todo                                                                     |
| AC-23.1-10 | 23.1-datos.spec.ts             | `registrar`, `saldo`                                       | T-29                | todo                                                                     |
| AC-23.1-11 | 23.1-datos.spec.ts             | `generarPool` (tools/generador, no núcleo)                 | T-18                | todo                                                                     |
| AC-23.1-12 | 23.1-datos.spec.ts             | `patrociniosCarga`, `multiplicadorPatrocinio` (propuestas) | T-18                | todo                                                                     |
| AC-23.2-01 | 23.2-calendario.spec.ts        | `esPrimerTick`, `esUltimoTick`, `mesDeSemana`              | T-10                | todo                                                                     |
| AC-23.2-02 | 23.2-calendario.spec.ts        | `semanasConJornada`                                        | T-11                | todo                                                                     |
| AC-23.2-03 | 23.2-calendario.spec.ts        | `generarCalendario`                                        | T-12                | todo                                                                     |
| AC-23.2-04 | 23.2-calendario.spec.ts        | `ventanaAbierta`, `validarVentana`                         | T-13                | todo                                                                     |
| AC-23.2-05 | 23.2-calendario.spec.ts        | `avanzarSemana`, `hashEstado` (propuesta)                  | T-39                | todo                                                                     |
| AC-23.2-06 | 23.2-calendario.spec.ts        | `crearRng` (rng.ts)                                        | T-04                | real (parcial: 6 de 1.000 valores de pcg32-demo)                         |
| AC-23.2-07 | 23.2-calendario.spec.ts        | comprobación estática (ESLint)                             | T-00                | todo                                                                     |
| AC-23.2-08 | 23.2-calendario.spec.ts        | `crearPartida`, `avanzarSemana`                            | T-41                | todo                                                                     |
| AC-23.2-09 | 23.2-calendario.spec.ts        | `avanzarSemana`                                            | T-39                | todo                                                                     |
| AC-23.3-01 | 23.3-caja-economia.spec.ts     | `calcularDemanda`, `ingresosPartido`                       | T-28, T-32          | todo                                                                     |
| AC-23.3-02 | 23.3-caja-economia.spec.ts     | `validarPrecioTaquilla` (propuesta)                        | T-32                | todo                                                                     |
| AC-23.3-03 | 23.3-caja-economia.spec.ts     | `liquidarTick`, `saldo`                                    | T-30                | todo                                                                     |
| AC-23.3-04 | 23.3-caja-economia.spec.ts     | `liquidarTick`                                             | T-30                | todo                                                                     |
| AC-23.3-05 | 23.3-caja-economia.spec.ts     | `poolsLiga` (propuesta)                                    | T-33                | todo                                                                     |
| AC-23.3-06 | 23.3-caja-economia.spec.ts     | `preverTemporada`, `repartoPrimera`                        | T-31, T-33          | todo                                                                     |
| AC-23.3-07 | 23.3-caja-economia.spec.ts     | `escalaResultados` (propuesta)                             | T-33                | todo                                                                     |
| AC-23.3-08 | 23.3-caja-economia.spec.ts     | `repartoPrimera`                                           | T-33                | todo                                                                     |
| AC-23.3-09 | 23.3-caja-economia.spec.ts     | `repartoSegunda`                                           | T-34                | todo                                                                     |
| AC-23.3-10 | 23.3-caja-economia.spec.ts     | precios de mercado (propuestas)                            | sin fila en Anexo A | todo                                                                     |
| AC-23.3-11 | 23.3-caja-economia.spec.ts     | `cierreDeMes` (propuesta)                                  | sin fila en Anexo A | todo                                                                     |
| AC-23.3-12 | 23.3-caja-economia.spec.ts     | `cuadroPrestamo` (propuesta)                               | sin fila en Anexo A | todo                                                                     |
| AC-23.3-13 | 23.3-caja-economia.spec.ts     | `ingresoVallas`                                            | T-35                | todo                                                                     |
| AC-23.3-14 | 23.3-caja-economia.spec.ts     | amortización (propuesta)                                   | sin fila en Anexo A | todo                                                                     |
| AC-23.3-15 | 23.3-caja-economia.spec.ts     | `impuestoSociedades` (propuesta)                           | sin fila en Anexo A | todo                                                                     |
| AC-23.3-16 | 23.3-caja-economia.spec.ts     | `interesDescubierto`                                       | T-38                | todo                                                                     |
| AC-23.3-17 | 23.3-caja-economia.spec.ts     | `tiendaFueraDiaPartido` (propuesta)                        | sin fila en Anexo A | todo                                                                     |
| AC-23.4-01 | 23.4-estadio-obras.spec.ts     | `pagosObra`, `avanzarObra` (propuestas)                    | sin fila en Anexo A | todo                                                                     |
| AC-23.4-02 | 23.4-estadio-obras.spec.ts     | `cancelarObra` (propuesta)                                 | sin fila en Anexo A | todo                                                                     |
| AC-23.4-03 | 23.4-estadio-obras.spec.ts     | `terminarObra` (propuesta)                                 | sin fila en Anexo A | todo                                                                     |
| AC-23.4-04 | 23.4-estadio-obras.spec.ts     | `mantenimientoAnual`                                       | T-37                | todo                                                                     |
| AC-23.4-05 | 23.4-estadio-obras.spec.ts     | `avanzarCesped` (propuesta)                                | T-37                | todo                                                                     |
| AC-23.4-06 | 23.4-estadio-obras.spec.ts     | `validarObra` (propuesta)                                  | sin fila en Anexo A | todo                                                                     |
| AC-23.4-07 | 23.4-estadio-obras.spec.ts     | `calcularDemanda`, `taquillaPartido`                       | T-28                | todo                                                                     |
| AC-23.4-08 | 23.4-estadio-obras.spec.ts     | `construirHospitality`, `construirPalcos` (propuestas)     | sin fila en Anexo A | todo                                                                     |
| AC-23.4-09 | 23.4-estadio-obras.spec.ts     | `ingresoAparcamiento` (propuesta)                          | sin fila en Anexo A | todo                                                                     |
| AC-23.4-10 | 23.4-estadio-obras.spec.ts     | `reformaGeneral` (propuesta)                               | sin fila en Anexo A | todo                                                                     |
| AC-23.5-01 | 23.5-demanda-ingresos.spec.ts  | `calcularDemanda`                                          | T-28                | todo                                                                     |
| AC-23.5-02 | 23.5-demanda-ingresos.spec.ts  | `calcularDemanda`                                          | T-28                | todo                                                                     |
| AC-23.5-03 | 23.5-demanda-ingresos.spec.ts  | `ingresosPartido`                                          | T-32                | todo                                                                     |
| AC-23.5-04 | 23.5-demanda-ingresos.spec.ts  | `ingresosPartido`                                          | T-32                | todo                                                                     |
| AC-23.5-05 | 23.5-demanda-ingresos.spec.ts  | `merchandisingTemporada` (propuesta)                       | sin fila en Anexo A | todo                                                                     |
| AC-23.5-06 | 23.5-demanda-ingresos.spec.ts  | `museoAnual`, `toursAnual`, `museoMes` (propuestas)        | sin fila en Anexo A | todo                                                                     |
| AC-23.5-07 | 23.5-demanda-ingresos.spec.ts  | `multiplicadorPatrocinio`, `ofertaTrasVencer` (propuestas) | sin fila en Anexo A | todo                                                                     |
| AC-23.5-08 | 23.5-demanda-ingresos.spec.ts  | `ingresoEvento` (propuesta)                                | sin fila en Anexo A | todo                                                                     |
| AC-23.5-09 | 23.5-demanda-ingresos.spec.ts  | `ingresoEvento` (propuesta)                                | sin fila en Anexo A | todo                                                                     |
| AC-23.5-10 | 23.5-demanda-ingresos.spec.ts  | `puedeProgramarEvento` (propuesta)                         | sin fila en Anexo A | todo                                                                     |
| AC-23.5-11 | 23.5-demanda-ingresos.spec.ts  | `tablaIngresos` (propuesta)                                | sin fila en Anexo A | todo                                                                     |
| AC-23.6-01 | 23.6-simulacion.spec.ts        | `elegirTitulares`                                          | T-21                | todo                                                                     |
| AC-23.6-02 | 23.6-simulacion.spec.ts        | `fuerza`, `jugarPartido`                                   | T-22, T-23          | todo                                                                     |
| AC-23.6-03 | 23.6-simulacion.spec.ts        | `jugarPartido`                                             | T-23                | todo                                                                     |
| AC-23.6-04 | 23.6-simulacion.spec.ts        | `simular` (tools/balance)                                  | T-42                | todo                                                                     |
| AC-23.6-05 | 23.6-simulacion.spec.ts        | `sortearLesion`, `probabilidadLesionSemanal`, `diasLesion` | T-26                | todo                                                                     |
| AC-23.6-06 | 23.6-simulacion.spec.ts        | `actualizarForma`                                          | T-27                | todo                                                                     |
| AC-23.7-01 | 23.7-entrenador.spec.ts        | `evaluarObjetivos`                                         | T-40                | todo                                                                     |
| AC-23.7-02 | 23.7-entrenador.spec.ts        | `deltaReputacion`                                          | T-40                | todo                                                                     |
| AC-23.7-03 | 23.7-entrenador.spec.ts        | `objetivoPosicion` (propuesta)                             | T-40                | todo                                                                     |
| AC-23.7-04 | 23.7-entrenador.spec.ts        | `honorariosPartida`, `factorOferta`                        | T-36                | todo                                                                     |
| AC-23.7-05 | 23.7-entrenador.spec.ts        | `puedeDespedir` (propuesta)                                | T-40                | todo                                                                     |
| AC-23.7-06 | 23.7-entrenador.spec.ts        | `objetivosIniciales` (propuesta)                           | T-40                | todo                                                                     |
| AC-23.7-07 | 23.7-entrenador.spec.ts        | `ofertasEntrenador` (propuesta)                            | sin fila en Anexo A | todo                                                                     |
| AC-23.8-01 | 23.8-control-economico.spec.ts | `calcularIncn` (propuesta)                                 | sin fila en Anexo A | todo                                                                     |
| AC-23.8-02 | 23.8-control-economico.spec.ts | `indicadoresTemporada` (propuesta)                         | sin fila en Anexo A | todo                                                                     |
| AC-23.8-03 | 23.8-control-economico.spec.ts | `evaluarRatio` (propuesta)                                 | sin fila en Anexo A | todo                                                                     |
| AC-23.8-04 | 23.8-control-economico.spec.ts | `evaluarPerdidas` (propuesta)                              | sin fila en Anexo A | todo                                                                     |
| AC-23.8-05 | 23.8-control-economico.spec.ts | `comprobacionesDeCierre` (propuesta)                       | sin fila en Anexo A | todo                                                                     |
| AC-23.8-06 | 23.8-control-economico.spec.ts | `cierreDeMes` (propuesta)                                  | sin fila en Anexo A | todo                                                                     |
| AC-23.9-01 | 23.9-pantallas.spec.ts         | `pantallasVisibles` (apps/web)                             | T-52                | todo                                                                     |
| AC-23.9-02 | 23.9-pantallas.spec.ts         | `Importe`, `Desglose` (apps/web)                           | T-53                | todo                                                                     |
| AC-23.9-03 | 23.9-pantallas.spec.ts         | `aplicarComando` (api.ts)                                  | sin fila en Anexo A | todo                                                                     |
| AC-23.9-04 | 23.9-pantallas.spec.ts         | `proyectarCaja` (api.ts)                                   | sin fila en Anexo A | todo                                                                     |
| AC-23.9-05 | 23.9-pantallas.spec.ts         | pantalla de mercado (apps/web)                             | sin fila en Anexo A | todo                                                                     |

## Fixtures que los pendientes necesitan

El código comentado usa identificadores que aún no existen. Los crea la tarea que implementa cada
bloque, en `test/fixtures/` (o en el propio archivo si es solo de ese bloque): `PARAMETROS_REFERENCIA`,
`CONTEXTO_REFERENCIA`, `CLUB_SEGUNDA_REFERENCIA`, `CLUB_MANAGER_REFERENCIA`, `ESTADIO_SIN_TIENDA`,
`PLANTILLA_REFERENCIA`, `LIBRO_EJEMPLO_6_12`, `PAQUETES_REFERENCIA`, `OBRA_12M_40_SEMANAS`, entre otros.
El club de referencia (`CLUB_REFERENCIA`, `ESTADIO_REFERENCIA`, `SECCIONES_REFERENCIA`) ya existe en
`test/fixtures/club-referencia.ts`.

## Discrepancias encontradas

1. **Anexo A y numeración de la sección 23.** Varias filas del Anexo citan identificadores que no
   corresponden al orden de `docs/spec/criterios.md`:
   - T-15 cita AC-23.1-08 para el escalado de secciones; es AC-23.1-09.
   - T-29 cita AC-23.1-09 para `afecta_caja`; es AC-23.1-10.
   - T-30 cita AC-23.3-03 para la liquidación de un tick; es AC-23.3-04.
   - T-31 cita AC-23.3-04 y 05; el plazo de cobros es AC-23.3-06.
   - T-33 cita AC-23.3-06 para el reparto de Primera; es AC-23.3-08.
   - T-34 cita AC-23.3-07 para el reparto de Segunda; es AC-23.3-09.
   - T-35 cita AC-23.3-09 para las vallas; son AC-23.3-13.
   - T-38 cita AC-23.3-12 para el descubierto; es AC-23.3-16.
   - T-03 cita AC-23.3-05 (12 cobros de 166.666,67 €), que no existe en la sección 23 (ya anotado en `docs/preguntas.md`, REF-1).
   - `packages/engine/test/unidad/dinero.spec.ts` contiene un test con ese identificador inexistente.
     Este índice sigue `docs/spec/criterios.md`. El Anexo A debería actualizarse.
2. **Criterios sin fila en el Anexo A.** 30 de los 83 no tienen tarea asignada en el Anexo A
   (mercado, préstamos, impuestos, amortización, obras, eventos, merchandising, museo, patrocinio,
   INCN y control económico, entre otros). Aquí figuran como «sin fila en Anexo A» y con la función
   propuesta, para que la planificación los incluya.
3. **check.py frente a la sección 23.**
   - Tienda física fuera de día de partido: check.py suma 151.620,02 € porque redondea cada mes sin
     absorber el resto. La sección 23.3 fija 12.427,85 € en junio, que absorbe el céntimo. Se usa la
     sección 23 (`1.242.785` céntimos en junio).
   - Descendidos de Segunda 18.º a 20.º: check.py imprime 1.030.692,42 € para el 20.º; la sección 23
     da 1.030.692,43 € (mayor resto). Se usa la sección 23.
   - Abonos de Segunda (R = 40): check.py solo tiene la fórmula de Primera (base 0,60, referencia
     R = 60). Con ella, R = 40 daría 0,54 (9.720 abonos). La sección 6.2.2 da base 0,45 y referencia
     R = 40, que es el valor 8.100 de la sección 23. check.py no lo calcula, así que no es comparable.
   - Lesiones: check.py simula 200.000 sorteos; el criterio pide 100.000. El resultado (28,49 % por
     encima de 56 días) cae dentro de 28,4 ± 1 %. La distribución de días (`3 + floor(147·u³)`) no
     la he contrastado con la sección 9.12.4.
   - Nombre del script: la sección 23 cita `calc_v09/check.py`; el repositorio tiene
     `tools/calc/check.py`. Se usa ese.
   - Varios criterios no tienen cálculo en check.py y sus valores vienen solo de la sección 23
     (23.3-02 en Segunda, 23.3-11 a 23.3-16, 23.5-07, 23.7-01 a 23.7-07, 23.8-03 a 23.8-06). El
     museo de julio (13.958.115 céntimos) lo calculé fuera del repositorio con la fórmula de 8.4.
4. **Criterios de interfaz.** Los de 23.9 (pantallas) son de apps/web. Aquí quedan como `todo` con
   su identificador; el test definitivo debería ir en apps/web.
5. **Determinismo estático (AC-23.2-07).** Lo cubre ESLint. Un test de vitest que lea el código
   fuente chocaría con la regla de imports `node:*` que se aplica también a los tests de engine, así
   que queda como `todo` y la decisión de duplicarlo está abierta.
