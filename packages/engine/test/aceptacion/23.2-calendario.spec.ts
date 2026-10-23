// Sección 23.2 de la especificación (calendario y determinismo). Un `it` por criterio AC-23.2-yy.
// Los pendientes llevan el código completo comentado encima de su `it.todo`; al implementar,
// descomenta el bloque (con sus imports), borra el `it.todo` y añade `expect` a vitest si falta.

import { describe, expect, it } from "vitest";
import { crearRng } from "../../src/core/rng";

// Salidas de referencia de pcg32-demo: pcg32_srandom(initstate = 42, initseq = 54), decisión 38.
// Son las 6 primeras; el criterio pide 1.000. Ver el resto en el vector completo cuando exista.
const REFERENCIA_PCG32_DEMO = [
  0xa15c02b7, 0x7b47f409, 0xba1d3330, 0x83d2f293, 0xbfa4784b, 0xcbed606e,
];

describe("23.2 · Calendario y determinismo (secciones 5 y 11)", () => {
  // Pendiente de T-10. Funciones: esPrimerTick(s), esUltimoTick(s), mesDeSemana(s) en calendario/meses.ts.
  // import { esPrimerTick, esUltimoTick } from "../../src/calendario/meses";
  // it("AC-23.2-01 · 52 ticks; primeros ticks de mes y últimos ticks de mes", () => {
  //   const semanas = Array.from({ length: 52 }, (_, i) => i + 1);
  //   expect(semanas.filter((s) => esPrimerTick(s))).toEqual([1, 5, 9, 14, 18, 22, 27, 31, 35, 40, 44, 48]);
  //   expect(semanas.filter((s) => esUltimoTick(s))).toEqual([4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47, 52]);
  // });
  it.todo("AC-23.2-01 · 52 ticks y primeros y últimos ticks de mes (T-10)");

  // Pendiente de T-11. Función: semanasConJornada(div) en calendario/jornadas.ts.
  // import { semanasConJornada } from "../../src/calendario/jornadas";
  // it("AC-23.2-02 · jornadas de Primera, Segunda y promoción", () => {
  //   const sinPrimera = [10, 15, 25, 26, 37];
  //   const primera = Array.from({ length: 43 }, (_, i) => i + 5).filter((s) => !sinPrimera.includes(s));
  //   expect(semanasConJornada("primera")).toEqual(primera);
  //   expect(semanasConJornada("primera")).toHaveLength(38);
  //   expect(semanasConJornada("segunda")).toHaveLength(42);
  //   expect(semanasConJornada("segunda")).not.toContain(25);
  //   expect(semanasConJornada("promocion")).toEqual([48, 49]);
  // });
  it.todo("AC-23.2-02 · 38 jornadas en Primera, 42 en Segunda, promoción en 48 y 49 (T-11)");

  // Pendiente de T-12. Función: generarCalendario(clubes, rng) en calendario/circulo.ts.
  // import { generarCalendario } from "../../src/calendario/circulo";
  // import { crearRng } from "../../src/core/rng";
  // it("AC-23.2-03 · 19 partidos de local en Primera, 21 en Segunda; cada pareja una vez por campo", () => {
  //   const primera = generarCalendario(CODIGOS_PRIMERA, crearRng(SEMILLA_REFERENCIA, 1));
  //   for (const club of CODIGOS_PRIMERA) {
  //     expect(primera.filter((p) => p.local === club)).toHaveLength(19);
  //   }
  //   const segunda = generarCalendario(CODIGOS_SEGUNDA, crearRng(SEMILLA_REFERENCIA, 2));
  //   for (const club of CODIGOS_SEGUNDA) {
  //     expect(segunda.filter((p) => p.local === club)).toHaveLength(21);
  //   }
  // });
  it.todo("AC-23.2-03 · 19 partidos de local en Primera y 21 en Segunda (T-12)");

  // Pendiente de T-13. Funciones: ventanaAbierta(s), validarVentana(s) en calendario/ventanas.ts.
  // import { ventanaAbierta, validarVentana } from "../../src/calendario/ventanas";
  // it("AC-23.2-04 · ventanas abiertas en las semanas 1 a 6 y 27 a 29; fuera, se rechaza con causa", () => {
  //   const abiertas = Array.from({ length: 52 }, (_, i) => i + 1).filter((s) => ventanaAbierta(s));
  //   expect(abiertas).toEqual([1, 2, 3, 4, 5, 6, 27, 28, 29]);
  //   expect(validarVentana(10)).not.toHaveLength(0);
  //   expect(validarVentana(2)).toHaveLength(0);
  // });
  it.todo("AC-23.2-04 · ventanas de mercado y causa de rechazo fuera de ellas (T-13)");

  // Pendiente de T-39. Función: avanzarSemana(e) de api.ts; hashEstado(e) propuesta en el pipeline.
  // import { avanzarSemana } from "../../src/api";
  // it("AC-23.2-05 · misma semilla y mismas decisiones dan el mismo hash en dos ejecuciones", () => {
  //   const a = ejecutarTemporada(CREAR_REFERENCIA(), 1);
  //   const b = ejecutarTemporada(CREAR_REFERENCIA(), 1);
  //   expect(hashEstado(a)).toBe(hashEstado(b));
  // });
  it.todo(
    "AC-23.2-05 · mismo hash de calendario, resultados, lesiones y saldo en dos ejecuciones (T-39)",
  );

  // Parcial: 6 de los 1.000 valores que pide el criterio. El vector completo no está en el repositorio.
  it("AC-23.2-06 · PCG32 con initstate = semilla e initseq = k: primeros valores de pcg32-demo", () => {
    const rng = crearRng(42n, 54);
    const salidas = Array.from({ length: REFERENCIA_PCG32_DEMO.length }, () => rng.siguienteU32());
    expect(salidas).toEqual(REFERENCIA_PCG32_DEMO);
  });

  // Pendiente, sin función del núcleo. Se comprueba con ESLint (no-restricted-properties y
  // no-restricted-syntax sobre packages/engine/**). Un test de vitest que lea el código fuente
  // chocaría con la regla de imports de node:* para engine, así que queda fuera de este bloque.
  // La decisión de si se duplica aquí queda abierta.
  it.todo(
    "AC-23.2-07 · el núcleo no usa Math.pow, Math.exp, Math.log ni ** (decisión 39; ESLint, T-00)",
  );

  // Pendiente de T-41. Función: crearPartida, avanzarSemana y saldo de Caja del club del jugador.
  // it("AC-23.2-08 · misma semilla y mismos datos: tras 3 temporadas, saldo, clasificación y reputación idénticos al céntimo", () => {
  //   const a = simularTemporadas(PARTIDA_REFERENCIA(SEMILLA_REFERENCIA), 3, GUION_VACIO);
  //   const b = simularTemporadas(PARTIDA_REFERENCIA(SEMILLA_REFERENCIA), 3, GUION_VACIO);
  //   expect(a.caja_jugador_cent).toBe(b.caja_jugador_cent);
  //   expect(a.clasificacion).toEqual(b.clasificacion);
  //   expect(a.reputaciones).toEqual(b.reputaciones);
  // });
  it.todo(
    "AC-23.2-08 · tras 3 temporadas, saldo al céntimo idéntico con la misma semilla (decisión 39) (T-41)",
  );

  // Pendiente de T-39. Función: avanzarSemana(e) con 11 pasos (5.2) y el resultado de cada uno.
  // it("AC-23.2-09 · el tick ejecuta los 11 pasos de 5.2 en orden", () => {
  //   const r = avanzarSemana(ESTADO_REFERENCIA);
  //   expect(r.pasos.map((p) => p.codigo)).toEqual(PASOS_TICK_5_2);
  // });
  it.todo("AC-23.2-09 · el tick ejecuta los 11 pasos de 5.2 en orden (T-39)");
});
