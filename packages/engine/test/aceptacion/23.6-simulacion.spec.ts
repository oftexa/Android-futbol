// Sección 23.6 de la especificación (simulación). Todos los criterios están pendientes: cada
// `it.todo` va precedido del código completo del test, comentado. Probabilidades y medias de 5.5.
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.6 · Simulación (sección 5.5)", () => {
  // Pendiente de T-21. Función: elegirTitulares(jugadores, p) en sim/titulares.ts.
  // it("AC-23.6-01 · exactamente un portero y 10 de campo; los titulares suman 90 minutos cada uno", () => {
  //   const t = elegirTitulares(PLANTILLA_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(t.titulares.filter((j) => j.posicion === "portero")).toHaveLength(1);
  //   expect(t.titulares.filter((j) => j.posicion !== "portero")).toHaveLength(10);
  //   for (const j of t.titulares) expect(j.minutos).toBe(90);
  // });
  it.todo("AC-23.6-01 · un portero, diez de campo y 90 minutos por titular (T-21)");

  // Pendiente de T-22 y T-23. Funciones: fuerza(titulares, moral, p) (sim/fuerza.ts),
  // jugarPartido(golesLocal, golesVisitante, rng, p) (sim/partido.ts).
  // it("AC-23.6-02 · S_club en [0, 105]; con diferencia d = 0, p_local = 0,37 y p_visitante = 0,37", () => {
  //   const s = fuerza(TITULARES_REFERENCIA, 60, PARAMETROS_REFERENCIA);
  //   expect(s.total).toBeGreaterThanOrEqual(0);
  //   expect(s.total).toBeLessThanOrEqual(105);
  //   const r = jugarPartido(50, 50, crearRng(SEMILLA_REFERENCIA, 3), PARAMETROS_REFERENCIA);
  //   expect(r.p_local).toBeCloseTo(0.37, 10);
  //   expect(r.p_visitante).toBeCloseTo(0.37, 10);
  // });
  it.todo("AC-23.6-02 · S_club en [0, 105] y probabilidades 0,37 con d = 0 (T-22, T-23)");

  // Pendiente de T-23. Función: jugarPartido.
  // it("AC-23.6-03 · el marcador concuerda siempre con el resultado sorteado", () => {
  //   const rng = crearRng(SEMILLA_REFERENCIA, 4);
  //   for (let i = 0; i < 10_000; i++) {
  //     const r = jugarPartido(60, 45, rng, PARAMETROS_REFERENCIA);
  //     const esperado = r.goles_local > r.goles_visitante ? "local" : r.goles_local < r.goles_visitante ? "visitante" : "empate";
  //     expect(r.resultado).toBe(esperado);
  //   }
  // });
  it.todo("AC-23.6-03 · el marcador concuerda con el resultado sorteado (T-23)");

  // Pendiente de T-42. Función: simular(n, estrategia) en tools/balance (herramienta, no el núcleo).
  // it("AC-23.6-04 · 200 temporadas: diferencia primero-último entre 35 y 75 puntos en el 90 % de ellas", () => {
  //   const informe = simular(200, "referencia");
  //   const dentro = informe.diferencias_primero_ultimo.filter((d) => d >= 35 && d <= 75).length;
  //   expect(dentro / 200).toBeGreaterThanOrEqual(0.9);
  // });
  it.todo(
    "AC-23.6-04 · 200 temporadas: diferencia primero-último de 35 a 75 puntos en el 90 % (T-42)",
  );

  // Pendiente de T-26. Función: sortearLesion(jugador, plan, medico, rng, p) en sim/lesiones.ts.
  // it("AC-23.6-05 · lesiones con CF 80, plan normal y médico 3: p = 0,012 por semana; en 100.000 sorteos de días, mediana 21, media 39,3 ± 0,5 y 28,4 % ± 1 % por encima de 56 días", () => {
  //   expect(probabilidadLesionSemanal(JUGADOR_CF80, "normal", 3)).toBeCloseTo(0.012, 10);
  //   const rng = crearRng(SEMILLA_REFERENCIA, 5);
  //   const dias: number[] = [];
  //   for (let i = 0; i < 100_000; i++) dias.push(diasLesion(rng, PARAMETROS_REFERENCIA));
  //   const orden = [...dias].sort((a, b) => a - b);
  //   expect(orden[50_000]).toBe(21);
  //   const media = dias.reduce((a, b) => a + b, 0) / dias.length;
  //   expect(media).toBeGreaterThanOrEqual(38.8);
  //   expect(media).toBeLessThanOrEqual(39.8);
  //   const mayores = dias.filter((d) => d > 56).length / dias.length;
  //   expect(mayores).toBeGreaterThanOrEqual(0.274);
  //   expect(mayores).toBeLessThanOrEqual(0.294);
  // });
  it.todo(
    "AC-23.6-05 · lesiones: p = 0,012 semanal, mediana 21, media 39,3 y 28,4 % por encima de 56 días (T-26)",
  );

  // Pendiente de T-27. Función: actualizarForma(jugador, plan, p) en sim/forma.ts (B-3, 9.12.1).
  // it("AC-23.6-06 · condición física (B-3): titular con partido +1/0/−1 (suave/normal/intenso); no titular +3/+2/+1; semana sin partido +5 con cualquier plan (tope 100)", () => {
  //   const titular = { ...JUGADOR_REFERENCIA, condicion_fisica: 50, titular: true };
  //   expect(actualizarForma(titular, "suave", PARAMETROS_REFERENCIA, { conPartido: true }).condicion_fisica).toBe(51);
  //   expect(actualizarForma(titular, "normal", PARAMETROS_REFERENCIA, { conPartido: true }).condicion_fisica).toBe(50);
  //   expect(actualizarForma(titular, "intenso", PARAMETROS_REFERENCIA, { conPartido: true }).condicion_fisica).toBe(49);
  //   const suplente = { ...titular, titular: false };
  //   expect(actualizarForma(suplente, "suave", PARAMETROS_REFERENCIA, { conPartido: true }).condicion_fisica).toBe(53);
  //   expect(actualizarForma(suplente, "normal", PARAMETROS_REFERENCIA, { conPartido: true }).condicion_fisica).toBe(52);
  //   expect(actualizarForma(suplente, "intenso", PARAMETROS_REFERENCIA, { conPartido: true }).condicion_fisica).toBe(51);
  //   expect(actualizarForma(titular, "intenso", PARAMETROS_REFERENCIA, { conPartido: false }).condicion_fisica).toBe(55);
  //   expect(actualizarForma({ ...titular, condicion_fisica: 98 }, "suave", PARAMETROS_REFERENCIA, { conPartido: false }).condicion_fisica).toBe(100);
  // });
  it.todo(
    "AC-23.6-06 · condición física con partido (+1/0/−1 y +3/+2/+1) y sin partido (+5, tope 100) (T-27)",
  );
});
