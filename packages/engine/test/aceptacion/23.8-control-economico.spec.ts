// Sección 23.8 de la especificación (control económico). Todos los criterios están pendientes:
// cada `it.todo` va precedido del código completo del test, comentado. Importes en céntimos.
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.8 · Control económico (sección 10)", () => {
  // Sin fila en el Anexo A (10.1). Función propuesta: calcularIncn(club, estadio, p) en control/indicadores.ts.
  // it("AC-23.8-01 · INCN solo con derechos (nacional, internacional y digital), taquilla y comercialización: 58.970.292,50 + 63.280.968,75 + 12.810.465 € = 135.061.726,25 €", () => {
  //   const incn = calcularIncn(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(incn.total_cent).toBe(13_506_172_625);
  //   expect(incn.componentes.map((c) => c.categoria)).toEqual(["derechos_tv", "comercializacion", "taquilla"]);
  // });
  it.todo(
    "AC-23.8-01 · INCN del club de referencia con sus tres componentes (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (10.1). Función propuesta: indicadoresTemporada(club, estadio, p, { traspasos_netos_cent }).
  // it("AC-23.8-02 · sin traspasos: masa salarial 69,26 M€; ratio 0,513 sin aviso; límite de inversión 1,5 × INCN = 202,59 M€", () => {
  //   const c = indicadoresTemporada(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA, { traspasos_netos_cent: 0 });
  //   expect(c.masa_salarial_cent).toBe(6_926_000_000);
  //   expect(c.ratio_masa_salarial).toBeCloseTo(0.513, 3);
  //   expect(c.aviso).toBeNull();
  //   expect(c.limite_inversion_cent / 100_000_000).toBeCloseTo(202.59, 2);
  // });
  it.todo(
    "AC-23.8-02 · masa salarial 69,26 M€, ratio 0,513 sin aviso y límite de inversión 202,59 M€ (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (10.1, 10.2). Función propuesta: evaluarRatio(ratio) en control/comprobaciones.ts.
  // it("AC-23.8-03 · ratio 0,62 da aviso; 0,65 también; 0,66 bloquea altas salariales hasta la siguiente comprobación con ratio ≤ 0,65", () => {
  //   expect(evaluarRatio(0.62).accion).toBe("aviso");
  //   expect(evaluarRatio(0.65).accion).toBe("aviso");
  //   expect(evaluarRatio(0.66).accion).toBe("bloqueo_altas");
  //   expect(evaluarRatio(0.65, { bloqueado: true }).accion).toBe("levantar_bloqueo");
  // });
  it.todo(
    "AC-23.8-03 · ratio 0,62 y 0,65 con aviso; 0,66 con bloqueo de altas (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (10.2). Función propuesta: evaluarPerdidas(perdidas_cent, club, division, estado).
  // it("AC-23.8-04 · pérdida de 70 M€ en Primera: multa de 1 M€ y confianza −20; de 95 M€: además bloqueo de la siguiente ventana y reputación −5 (una sola vez)", () => {
  //   const a = evaluarPerdidas(7_000_000_000, CLUB_REFERENCIA, "primera", ESTADO_REFERENCIA);
  //   expect(a.multa_cent).toBe(100_000_000);
  //   expect(a.confianza_delta).toBe(-20);
  //   const b = evaluarPerdidas(9_500_000_000, CLUB_REFERENCIA, "primera", ESTADO_REFERENCIA);
  //   expect(b.bloqueo_ventana_siguiente).toBe(true);
  //   expect(b.reputacion_delta).toBe(-5);
  //   const repetida = evaluarPerdidas(9_500_000_000, CLUB_REFERENCIA, "primera", { ...ESTADO_REFERENCIA, reputacion_aplicada: true });
  //   expect(repetida.reputacion_delta).toBe(0);
  // });
  it.todo(
    "AC-23.8-04 · pérdidas de 70 M€ (multa y confianza) y de 95 M€ (bloqueo y reputación una vez) (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (10.3). Función propuesta: comprobacionesDeCierre(club, semana, p).
  // it("AC-23.8-05 · la semana 26 evalúa ratio y límite de inversión; la 52, además, pérdidas", () => {
  //   expect(comprobacionesDeCierre(CLUB_REFERENCIA, 26, PARAMETROS_REFERENCIA).evalua).toEqual(["ratio", "limite_inversion"]);
  //   expect(comprobacionesDeCierre(CLUB_REFERENCIA, 52, PARAMETROS_REFERENCIA).evalua).toEqual(["ratio", "limite_inversion", "perdidas"]);
  // });
  it.todo("AC-23.8-05 · comprobaciones de la semana 26 y de la semana 52 (sin fila en Anexo A)");

  // Sin fila en el Anexo A (6.11, 10.2). Función propuesta: cierreDeMes(club, saldo, n) en economia/descubierto.ts.
  // it("AC-23.8-06 · descubierto sostenido: aviso al 2.º cierre seguido y venta forzosa al 3.º", () => {
  //   const c1 = cierreDeMes(CLUB_REFERENCIA, SALDO_NEGATIVO_SOSTENIDO, 1);
  //   expect(c1.aviso).toBeNull();
  //   const c2 = cierreDeMes(c1.club, SALDO_NEGATIVO_SOSTENIDO, 2);
  //   expect(c2.aviso).not.toBeNull();
  //   const c3 = cierreDeMes(c2.club, SALDO_NEGATIVO_SOSTENIDO, 3);
  //   expect(c3.venta_forzosa).not.toBeNull();
  // });
  it.todo(
    "AC-23.8-06 · aviso en el segundo cierre seguido con descubierto y venta forzosa en el tercero (sin fila en Anexo A)",
  );
});
