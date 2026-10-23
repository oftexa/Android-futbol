// Sección 23.7 de la especificación (entrenador). Todos los criterios están pendientes: cada
// `it.todo` va precedido del código completo del test, comentado.
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.7 · Entrenador (sección 9)", () => {
  // Pendiente de T-40. Función: evaluarObjetivos(objetivos, resultados, modo) en entrenador/objetivos.ts.
  // it("AC-23.7-01 · score_objetivos con pesos normalizados: 0,50 / 0,25 / 0,25 con tres objetivos; Coach con dos (2/3 y 1/3); en Coach no hay presupuesto y copa pesa 0", () => {
  //   const president = evaluarObjetivos(OBJETIVOS_PRESIDENT_REFERENCIA, RESULTADOS_REFERENCIA, "president");
  //   expect(president.pesos).toEqual([0.5, 0.25, 0.25]);
  //   const coach = evaluarObjetivos(OBJETIVOS_COACH_REFERENCIA, RESULTADOS_REFERENCIA, "coach");
  //   expect(coach.pesos[0]).toBeCloseTo(2 / 3, 10);
  //   expect(coach.pesos[1]).toBeCloseTo(1 / 3, 10);
  //   expect(coach.objetivos.some((o) => o.tipo === "presupuesto_no_superar")).toBe(false);
  //   expect(coach.objetivos.find((o) => o.tipo === "copa")?.peso ?? 0).toBe(0);
  // });
  it.todo(
    "AC-23.7-01 · pesos normalizados de score_objetivos y ausencia de presupuesto en Coach (T-40)",
  );

  // Pendiente de T-40. Función: deltaReputacion(score) en entrenador/reputacion.ts.
  // it("AC-23.7-02 · delta_reputacion = round(20 × (score − 0,5)) en [−10, +10]; con score 0,75, +5", () => {
  //   expect(deltaReputacion(0.75)).toBe(5);
  //   expect(deltaReputacion(0)).toBe(-10);
  //   expect(deltaReputacion(1)).toBe(10);
  // });
  it.todo("AC-23.7-02 · delta_reputacion en [−10, +10]; con score 0,75 vale +5 (T-40)");

  // Pendiente de T-40. Función propuesta: objetivoPosicion(division, reputacion) en entrenador/objetivos.ts.
  // it("AC-23.7-03 · objetivo de posición en Primera: R = 60 → 10.ª; 70 → 8.ª; 85 → 6.ª; 100 → 4.ª; 40 → 14.ª", () => {
  //   expect(objetivoPosicion("primera", 60)).toBe(10);
  //   expect(objetivoPosicion("primera", 70)).toBe(8);
  //   expect(objetivoPosicion("primera", 85)).toBe(6);
  //   expect(objetivoPosicion("primera", 100)).toBe(4);
  //   expect(objetivoPosicion("primera", 40)).toBe(14);
  // });
  it.todo("AC-23.7-03 · objetivo de posición en Primera según la reputación (T-40)");

  // Pendiente de T-36. Funciones propuestas: honorariosPartida(division, reputacion, p) y
  // factorOferta(reputacion) = 1 + 0,002 × reputacion (9.5 y 9.8).
  // it("AC-23.7-04 · honorarios de partida en Primera con reputación 55: 1,26 M€; oferta con reputación 70: +14 %", () => {
  //   expect(honorariosPartida("primera", 55, PARAMETROS_REFERENCIA)).toBe(126_000_000);
  //   expect(factorOferta(70)).toBeCloseTo(1.14, 10);
  // });
  it.todo(
    "AC-23.7-04 · honorarios de partida de 1,26 M€ y oferta con reputación 70 (+14 %) (T-36)",
  );

  // Pendiente de T-40. Función propuesta: puedeDespedir(club) en entrenador/reputacion.ts.
  // it("AC-23.7-05 · con confianza_directiva ≤ 20, como máximo un despido por temporada", () => {
  //   const club = { ...CLUB_REFERENCIA, confianza_directiva: 20, despidos_temporada: 1 };
  //   expect(puedeDespedir(club).ok).toBe(false);
  //   expect(puedeDespedir({ ...club, despidos_temporada: 0 }).ok).toBe(true);
  // });
  it.todo("AC-23.7-05 · con confianza ≤ 20 solo un despido por temporada (T-40)");

  // Pendiente de T-40. Función propuesta: objetivosIniciales(modo, division, reputacion) en entrenador/objetivos.ts.
  // it("AC-23.7-06 · objetivos (B-2): President y Total con deportivo, saldo_minimo = 0 y aforo_medio_minimo (0,80 Primera; 0,70 Segunda); Manager con presupuesto_no_superar; Coach y Promanager solo deportivo y ocupación; Segunda: 6.º con R ≥ 60, 12.º con 40 a 59, permanencia con R < 40", () => {
  //   expect(objetivosIniciales("president", "primera", 60).map((o) => o.tipo)).toEqual(["posicion_final", "saldo_minimo", "aforo_medio_minimo"]);
  //   expect(objetivosIniciales("total", "primera", 60).map((o) => o.tipo)).toEqual(["posicion_final", "saldo_minimo", "aforo_medio_minimo"]);
  //   expect(objetivosIniciales("manager", "primera", 60).map((o) => o.tipo)).toContain("presupuesto_no_superar");
  //   expect(objetivosIniciales("manager", "primera", 60).map((o) => o.tipo)).not.toContain("saldo_minimo");
  //   expect(objetivosIniciales("coach", "primera", 60).map((o) => o.tipo)).toEqual(["posicion_final", "aforo_medio_minimo"]);
  //   expect(objetivosIniciales("promanager", "primera", 60).map((o) => o.tipo)).toEqual(["posicion_final", "aforo_medio_minimo"]);
  //   expect(objetivosIniciales("president", "primera", 60)).toContainEqual(expect.objectContaining({ tipo: "aforo_medio_minimo", valor: 0.8 }));
  //   expect(objetivosIniciales("president", "segunda", 60)).toContainEqual(expect.objectContaining({ tipo: "aforo_medio_minimo", valor: 0.7 }));
  //   expect(objetivosIniciales("coach", "segunda", 60)).toContainEqual(expect.objectContaining({ tipo: "posicion_final", valor: 6 }));
  //   expect(objetivosIniciales("coach", "segunda", 40)).toContainEqual(expect.objectContaining({ tipo: "posicion_final", valor: 12 }));
  //   expect(objetivosIniciales("coach", "segunda", 35).map((o) => o.tipo)).toContain("permanencia");
  // });
  it.todo(
    "AC-23.7-06 · objetivos por modo y división, con aforo medio mínimo y posiciones de Segunda (T-40)",
  );

  // Sin fila en el Anexo A (9.8). Función propuesta: ofertasEntrenador(entrenador, semana, clubes, rng) en entrenador/ofertas.ts.
  // it("AC-23.7-07 · en paro con reputación 20: 1 oferta en cada una de las semanas 1, 27 y 52; con 60: 2; los destinos cumplen |R − reputación| ≤ 15 y no incluyen el actual; la rescisión la paga el destino", () => {
  //   for (const semana of [1, 27, 52]) {
  //     expect(ofertasEntrenador(ENTRENADOR_EN_PARO_20, semana, CLUBES_REFERENCIA, crearRng(SEMILLA_REFERENCIA, semana))).toHaveLength(1);
  //   }
  //   const ofertas = ofertasEntrenador(ENTRENADOR_EN_PARO_60, 1, CLUBES_REFERENCIA, crearRng(SEMILLA_REFERENCIA, 1));
  //   expect(ofertas).toHaveLength(2);
  //   for (const o of ofertas) {
  //     expect(Math.abs(o.reputacion_club - 60)).toBeLessThanOrEqual(15);
  //     expect(o.codigo_club).not.toBe(ENTRENADOR_EN_PARO_60.club_actual);
  //     expect(o.rescision_paga_por).toBe("destino");
  //   }
  // });
  it.todo(
    "AC-23.7-07 · ofertas a entrenadores en paro según reputación, destinos y rescisión (sin fila en Anexo A)",
  );
});
