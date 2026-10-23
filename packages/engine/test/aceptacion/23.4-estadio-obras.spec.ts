// Sección 23.4 de la especificación (estadio y obras). Todos los criterios están pendientes:
// cada `it.todo` va precedido del código completo del test, comentado. Importes en céntimos.
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.4 · Estadio y obras (sección 7)", () => {
  // Sin fila en el Anexo A (7.3). Funciones propuestas: pagosObra(obra, p), avanzarObra(obra, estado).
  // it("AC-23.4-01 · obra de 40 semanas y 12 M€ paga 40 cuotas de 300.000 €; sin saldo se suspende y la duración crece en 1", () => {
  //   const pagos = pagosObra(OBRA_12M_40_SEMANAS, PARAMETROS_REFERENCIA);
  //   expect(pagos).toHaveLength(40);
  //   expect(pagos.every((c) => c === 30_000_000)).toBe(true);
  //   const suspendida = avanzarObra(OBRA_12M_40_SEMANAS, { saldo_disponible_cent: 0 });
  //   expect(suspendida.semanas_duracion).toBe(41);
  // });
  it.todo(
    "AC-23.4-01 · obra de 12 M€ en 40 cuotas de 300.000 € y suspensión sin saldo (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (7.3). Función propuesta: cancelarObra(obra, semana).
  // it("AC-23.4-02 · cancelación en curso pierde el 50 % de lo pagado; antes de empezar no tiene coste", () => {
  //   const enCurso = cancelarObra(OBRA_CON_3_CUOTAS_PAGADAS, 5);
  //   expect(enCurso.perdido_cent).toBe(45_000_000);
  //   const sinEmpezar = cancelarObra(OBRA_PLANIFICADA, 1);
  //   expect(sinEmpezar.perdido_cent).toBe(0);
  // });
  it.todo("AC-23.4-02 · cancelación en curso pierde el 50 % de lo pagado (sin fila en Anexo A)");

  // Sin fila en el Anexo A (7.2, 7.4). Funciones propuestas: terminarObra(obra, estadio), aplicarAforo(...).
  // it("AC-23.4-03 · ampliación de 2.000 plazas de general: grada_general 18.000 → 20.000; aforo 44.800; abonos_objetivo cambia en la semana 1 siguiente", () => {
  //   const e = terminarObra(OBRA_AMPLIAR_2000_GENERAL, ESTADIO_REFERENCIA);
  //   expect(e.secciones.find((s) => s.tipo === "grada_general")?.plazas).toBe(20_000);
  //   expect(e.aforo_total).toBe(44_800);
  //   expect(e.tope_asistencia_desde_siguiente_jornada).toBe(true);
  // });
  it.todo(
    "AC-23.4-03 · ampliación de 2.000 plazas: aforo 44.800 y tope desde la siguiente jornada (sin fila en Anexo A)",
  );

  // Pendiente de T-37. Función: mantenimientoAnual(estadio, p) en estadio/mantenimiento.ts.
  // import { mantenimientoAnual } from "../../src/estadio/mantenimiento";
  // it("AC-23.4-04 · mantenimiento base 2.568.000 € al año (214.000 € al mes); con antigüedad 30: 3.338.400 € al año", () => {
  //   expect(mantenimientoAnual(ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA)).toBe(256_800_000);
  //   expect(mantenimientoAnual({ ...ESTADIO_REFERENCIA, antiguedad_anios: 30 }, PARAMETROS_REFERENCIA)).toBe(333_840_000);
  // });
  it.todo("AC-23.4-04 · mantenimiento base de 2.568.000 € y con antigüedad 30 (T-37)");

  // Pendiente de T-37. Función propuesta: avanzarCesped(estadio, eventos, p) en estadio/mantenimiento.ts.
  // it("AC-23.4-05 · césped 45 con concierto sin calefactado: 45 − 8 + 2 = 39 → reposición de 200.000 € en t + 1 y estado 100; con estado < 20 en partido de local, −2 de reputación", () => {
  //   const tras = avanzarCesped({ ...ESTADIO_REFERENCIA, cesped_estado: 45 }, [CONCIERTO_SIN_CALEFACCION_T], PARAMETROS_REFERENCIA);
  //   expect(tras.cesped_estado).toBe(39);
  //   expect(tras.reposicion?.importe_cent).toBe(20_000_000);
  //   expect(tras.reposicion?.semana).toBe(T_SIGUIENTE);
  //   expect(tras.cesped_tras_pago).toBe(100);
  //   expect(reputacionPorCesped({ ...ESTADIO_REFERENCIA, cesped_estado: 19 }, "local").delta).toBe(-2);
  // });
  it.todo(
    "AC-23.4-05 · césped: 45 − 8 + 2 = 39 y reposición de 200.000 €; pérdida de reputación con césped < 20 (T-37)",
  );

  // Sin fila en el Anexo A (7.2). Función propuesta: validarObra(estadio, tipo).
  // it("AC-23.4-06 · insonorizacion_nivel_2 se rechaza si el nivel actual es 0", () => {
  //   const r = validarObra({ ...ESTADIO_REFERENCIA, insonorizacion_nivel: 0 }, "insonorizacion_nivel_2");
  //   expect(r.ok).toBe(false);
  // });
  it.todo("AC-23.4-06 · insonorizacion_nivel_2 se rechaza con nivel 0 (sin fila en Anexo A)");

  // Pendiente de T-28. Funciones: ampliacionGeneral(estadio, unidades), calcularDemanda, taquillaPartido.
  // it("AC-23.4-07 · ampliación de la general en el estadio de referencia: bloqueo 1.800; tope 36.507; asistencia 36.173; taquilla de 602.775 € por partido", () => {
  //   const obra = ampliacionGeneral(ESTADIO_REFERENCIA, 2_000);
  //   expect(obra.bloqueo_aforo).toBe(1_800);
  //   const d = calcularDemanda(ESTADIO_REFERENCIA, { ...CONTEXTO_REFERENCIA, bloqueo_aforo: 1_800 });
  //   expect(d.tope).toBe(36_507);
  //   expect(d.asistencia).toBe(36_173);
  //   expect(taquillaPartido(d, PARAMETROS_REFERENCIA)).toBe(60_277_500);
  // });
  it.todo(
    "AC-23.4-07 · bloqueo de 1.800, tope 36.507, asistencia 36.173 y taquilla de 602.775 € (T-28)",
  );

  // Sin fila en el Anexo A (7.2). Funciones propuestas: construirHospitality(estadio, zonas), construirPalcos(estadio, n).
  // it("AC-23.4-08 · construir_hospitality de 1 zona suma 250 plazas; construir_palcos con más de 30 unidades se rechaza", () => {
  //   expect(construirHospitality(ESTADIO_REFERENCIA, 1).plazas_añadidas).toBe(250);
  //   expect(construirPalcos(ESTADIO_REFERENCIA, 31).ok).toBe(false);
  // });
  it.todo(
    "AC-23.4-08 · hospitality de 250 plazas por zona y límite de 30 palcos por obra (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (7.2, 8.6). Función propuesta: ingresoAparcamiento(estadio, asistencia, p).
  // it("AC-23.4-09 · aparcamiento terminado: 1.500 vehículos (tope) y 15.000 € por partido de local", () => {
  //   expect(ingresoAparcamiento(ESTADIO_CON_APARCAMIENTO, 37_761, PARAMETROS_REFERENCIA)).toBe(1_500_000);
  //   expect(capacidadAparcamiento(ESTADIO_CON_APARCAMIENTO, PARAMETROS_REFERENCIA)).toBe(1_500);
  // });
  it.todo(
    "AC-23.4-09 · aparcamiento: tope de 1.500 vehículos y 15.000 € por partido (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (7.2). Función propuesta: reformaGeneral(estadio, p).
  // it("AC-23.4-10 · reforma general: solo con antigüedad ≥ 50; 104 semanas; bloqueo de 10.700 plazas; antigüedad 0 al terminar", () => {
  //   expect(reformaGeneral({ ...ESTADIO_REFERENCIA, antiguedad_anios: 49 }, PARAMETROS_REFERENCIA).ok).toBe(false);
  //   const obra = reformaGeneral({ ...ESTADIO_REFERENCIA, antiguedad_anios: 50 }, PARAMETROS_REFERENCIA);
  //   expect(obra.semanas_duracion).toBe(104);
  //   expect(obra.bloqueo_aforo).toBe(10_700);
  //   expect(terminarObra(obra, ESTADIO_REFERENCIA).antiguedad_anios).toBe(0);
  // });
  it.todo(
    "AC-23.4-10 · reforma general: antigüedad ≥ 50, 104 semanas, bloqueo de 10.700 (sin fila en Anexo A)",
  );
});
