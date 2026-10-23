// Sección 23.5 de la especificación (demanda e ingresos de estadio). Todos los criterios están
// pendientes: cada `it.todo` va precedido del código completo del test, comentado.
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.5 · Demanda e ingresos de estadio (sección 8)", () => {
  // Pendiente de T-28. Función: calcularDemanda(estadio, contexto) en explotacion/demanda.ts.
  // it("AC-23.5-01 · club de referencia: f_reputacion 1,06; f_aficion 1,02; f_fans 1,02; demanda 37.760,69; asistencia 37.761; ocupación 0,8823", () => {
  //   const d = calcularDemanda(ESTADIO_REFERENCIA, CONTEXTO_REFERENCIA);
  //   expect(d.factores.f_reputacion).toBeCloseTo(1.06, 10);
  //   expect(d.factores.f_aficion).toBeCloseTo(1.02, 10);
  //   expect(d.factores.f_fans).toBeCloseTo(1.02, 10);
  //   expect(d.demanda).toBeCloseTo(37_760.69, 2);
  //   expect(d.asistencia).toBe(37_761);
  //   expect(d.ocupacion.toFixed(4)).toBe("0.8823");
  // });
  it.todo("AC-23.5-01 · demanda 37.760,69 y asistencia 37.761 con sus factores (T-28)");

  // Pendiente de T-28. Función: calcularDemanda. El producto de factores llega a 1,1131 o 1,1129.
  // it("AC-23.5-02 · el tope de 38.110 solo se alcanza si el producto de factores supera 1,1130 (38.110 / 34.240)", () => {
  //   expect(38_110 / 34_240).toBeCloseTo(1.113, 4);
  //   const debajo = calcularDemanda(ESTADIO_REFERENCIA, CONTEXTO_CON_PRODUCTO(1.1129));
  //   expect(debajo.asistencia).toBeLessThan(38_110);
  //   const encima = calcularDemanda(ESTADIO_REFERENCIA, CONTEXTO_CON_PRODUCTO(1.1131));
  //   expect(encima.asistencia).toBe(38_110);
  // });
  it.todo("AC-23.5-02 · el tope de asistencia se alcanza solo por encima de 1,1130 (T-28)");

  // Pendiente de T-32. Función: ingresosPartido(asistencia, club, estadio, p) en matchday.ts.
  // it("AC-23.5-03 · palcos del club de referencia: tasa 0,79, 95 palcos y 285.000 € por partido; hospitality 395 plazas y 59.250 €", () => {
  //   const ingresos = ingresosPartido(37_761, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(ingresos.palcos.tasa).toBeCloseTo(0.79, 10);
  //   expect(ingresos.palcos.unidades).toBe(95);
  //   expect(ingresos.palcos.importe_cent).toBe(28_500_000);
  //   expect(ingresos.hospitality.plazas).toBe(395);
  //   expect(ingresos.hospitality.importe_cent).toBe(5_925_000);
  // });
  it.todo(
    "AC-23.5-03 · palcos (95 unidades, 285.000 €) y hospitality (395 plazas, 59.250 €) (T-32)",
  );

  // Pendiente de T-32. Función: ingresosPartido.
  // it("AC-23.5-04 · restauración de día de partido: 36.250,56 € por partido", () => {
  //   const ingresos = ingresosPartido(37_761, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(ingresos.restauracion.importe_cent).toBe(3_625_056);
  // });
  it.todo("AC-23.5-04 · restauración de día de partido: 36.250,56 € (T-32)");

  // Sin fila en el Anexo A (8.1). Función propuesta: merchandisingTemporada(club, estadio, p, { cambioEquipacion }).
  // it("AC-23.5-05 · merchandising de temporada normal: 5.785.342 € (tienda 451.999 €, online 4.089.454 €, camisetas 1.092.269 €, fuera de día 151.620 €); en temporada de cambio, 6.331.477 €", () => {
  //   const normal = merchandisingTemporada(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA, { cambioEquipacion: false });
  //   expect(normal.tienda_dia_cent).toBe(45_199_900);
  //   expect(normal.online_cent).toBe(408_945_400);
  //   expect(normal.camisetas_cent).toBe(109_226_900);
  //   expect(normal.tienda_fuera_dia_cent).toBe(15_162_000);
  //   expect(normal.total_cent).toBe(578_534_200);
  //   const cambio = merchandisingTemporada(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA, { cambioEquipacion: true });
  //   expect(cambio.total_cent).toBe(633_147_700);
  // });
  it.todo(
    "AC-23.5-05 · merchandising de temporada normal (5.785.342 €) y de cambio (6.331.477 €) (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (8.4). Funciones propuestas: museoAnual, toursAnual, museoMes.
  // it("AC-23.5-06 · museo 1.216.350 € al año y tours 154.800 €; en julio, museo × 1,4 / 12,2 = 139.581,15 €", () => {
  //   expect(museoAnual(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA)).toBe(121_635_000);
  //   expect(toursAnual(ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA)).toBe(15_480_000);
  //   expect(museoMes(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA, "julio")).toBe(13_958_115);
  // });
  it.todo(
    "AC-23.5-06 · museo de 1.216.350 €, tours de 154.800 € y reparto de julio (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (8.3). Funciones propuestas: multiplicadorPatrocinio(R), ofertaTrasVencer(contrato, semana).
  // it("AC-23.5-07 · patrocinio: multiplicador 0,52 + 0,008 × R (1,00 con R = 60); al vencer, oferta la semana siguiente y, si se rechaza, otra 4 semanas después", () => {
  //   expect(multiplicadorPatrocinio(60)).toBeCloseTo(1, 10);
  //   const oferta = ofertaTrasVencer(CONTRATO_PATROCINIO_VENCIDO_S10, 10);
  //   expect(oferta.semana).toBe(11);
  //   expect(ofertaTrasRechazo(oferta).semana).toBe(15);
  // });
  it.todo("AC-23.5-07 · multiplicador de patrocinio y ofertas tras vencer (sin fila en Anexo A)");

  // Sin fila en el Anexo A (8.6.3). Función propuesta: ingresoEvento(evento, club, estadio, p, llenado).
  // it("AC-23.5-08 · concierto de 8.6.3: 1.927.392 € con llenado 0,8904 y 1.927.402 € con 0,890421", () => {
  //   expect(ingresoEvento(CONCIERTO_8_6_3, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA, 0.8904).importe_cent).toBe(192_739_200);
  //   expect(ingresoEvento(CONCIERTO_8_6_3, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA, 0.890421).importe_cent).toBe(192_740_200);
  // });
  it.todo("AC-23.5-08 · concierto de 8.6.3 con llenado 0,8904 y 0,890421 (sin fila en Anexo A)");

  // Sin fila en el Anexo A (8.6.1). Función: ingresoEvento. Multa de horario: sin cifra en 23.5.
  // it("AC-23.5-09 · eventos con R = 60: concierto 1 = 666.954 €; concierto 3 = 3.801.379 €; corporativo 150.000 €; competición no futbolística 221.624 €; cancelado = 0", () => {
  //   expect(ingresoEvento(CONCIERTO_1, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA).importe_cent).toBe(66_695_400);
  //   expect(ingresoEvento(CONCIERTO_3, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA).importe_cent).toBe(380_137_900);
  //   expect(ingresoEvento(EVENTO_CORPORATIVO, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA).importe_cent).toBe(15_000_000);
  //   expect(ingresoEvento(COMPETICION_NO_FUTBOL, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA).importe_cent).toBe(22_162_400);
  //   expect(ingresoEvento({ ...CONCIERTO_1, estado: "cancelado" }, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA).importe_cent).toBe(0);
  // });
  it.todo(
    "AC-23.5-09 · ingresos de eventos con R = 60 y evento cancelado sin cobro (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (8.6.2). Función propuesta: puedeProgramarEvento(calendario, evento).
  // it("AC-23.5-10 · un concierto no se programa en semana con partido de local ni a menos de 2 semanas de otro evento", () => {
  //   expect(puedeProgramarEvento(CALENDARIO_PARTIDO_LOCAL_EN_12, { ...CONCIERTO_1, semana: 12 }).ok).toBe(false);
  //   expect(puedeProgramarEvento(CALENDARIO_EVENTO_EN_20, { ...CONCIERTO_1, semana: 21 }).ok).toBe(false);
  //   expect(puedeProgramarEvento(CALENDARIO_EVENTO_EN_20, { ...CONCIERTO_1, semana: 22 }).ok).toBe(true);
  // });
  it.todo(
    "AC-23.5-10 · no se programa un concierto con partido de local ni a menos de 2 semanas de otro evento (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (14.8). Función propuesta: tablaIngresos(club, estadio, p) en explotacion/tabla-ingresos.ts.
  // it("AC-23.5-11 · tabla 14.8 del club de referencia: total 221,62 M€ (221 M€ ± 1 M€); cada fila dentro de su rango", () => {
  //   const t = tablaIngresos(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(t.total_m).toBeCloseTo(221.62, 2);
  //   expect(t.total_m).toBeGreaterThanOrEqual(220);
  //   expect(t.total_m).toBeLessThanOrEqual(222);
  //   const rangos = { derechos: [26, 32], comercializacion: [28, 33], matchday: [9, 18], patrocinio: [4, 11], naming: [4, 6], vallas: [7, 9], merchandising: [2, 3], otros: [0.5, 4] };
  //   for (const [fila, [min, max]] of Object.entries(rangos)) {
  //     const pct = t.filas[fila].porcentaje;
  //     expect(pct).toBeGreaterThanOrEqual(min);
  //     expect(pct).toBeLessThanOrEqual(max);
  //   }
  // });
  it.todo(
    "AC-23.5-11 · tabla 14.8: total 221,62 M€ y cada fila dentro de su rango (sin fila en Anexo A)",
  );
});
