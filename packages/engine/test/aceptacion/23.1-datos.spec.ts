// Sección 23.1 de la especificación (datos). Un `it` por criterio AC-23.1-yy, en el orden de la lista.
// Los criterios pendientes llevan el código completo comentado encima de su `it.todo`:
// al implementar la función, descomenta el bloque (y sus imports), borra el `it.todo` y añade
// `expect` a los imports de vitest si hace falta.

import { describe, expect, it } from "vitest";
import { Club, Estadio, SeccionEstadio } from "@af4/contracts";
import {
  CLUB_REFERENCIA,
  ESTADIO_REFERENCIA,
  SECCIONES_REFERENCIA,
} from "../fixtures/club-referencia";

describe("23.1 · Datos (sección 4 y 15)", () => {
  // Parcial: cubre Club, Estadio y SeccionEstadio. La cobertura de todas las entidades 4.2 a 4.27
  // está en packages/contracts/test/entidades.spec.ts (AC-23.1-01 de contracts).
  it("AC-23.1-01 · un valor fuera de rango se rechaza al validar (Club, Estadio y SeccionEstadio)", () => {
    expect(Club.safeParse(CLUB_REFERENCIA).success).toBe(true);
    expect(Estadio.safeParse(ESTADIO_REFERENCIA).success).toBe(true);
    for (const seccion of SECCIONES_REFERENCIA) {
      expect(SeccionEstadio.safeParse(seccion).success).toBe(true);
    }

    expect(Club.safeParse({ ...CLUB_REFERENCIA, reputacion: 101 }).success).toBe(false);
    expect(Club.safeParse({ ...CLUB_REFERENCIA, racha: 2 }).success).toBe(false);
    expect(Club.safeParse({ ...CLUB_REFERENCIA, precio_taquilla_cent: 1_099 }).success).toBe(false);
    expect(Club.safeParse({ ...CLUB_REFERENCIA, precio_taquilla_cent: 9_001 }).success).toBe(false);
    expect(
      Club.safeParse({
        ...CLUB_REFERENCIA,
        recaudacion_historica_cent: CLUB_REFERENCIA.recaudacion_historica_cent.slice(0, 4),
      }).success,
    ).toBe(false);
    expect(Estadio.safeParse({ ...ESTADIO_REFERENCIA, aforo_total: 4_999 }).success).toBe(false);
    expect(Estadio.safeParse({ ...ESTADIO_REFERENCIA, cafeterias_max: 21 }).success).toBe(false);

    const [grada] = SECCIONES_REFERENCIA;
    expect(SeccionEstadio.safeParse({ ...grada, plazas: 60_001 }).success).toBe(false);
    expect(SeccionEstadio.safeParse({ ...grada, ocupacion_maxima: 1.5 }).success).toBe(false);
  });

  // Parcial: importes de Club y SeccionEstadio. Las demás entidades con importes, en contracts.
  it("AC-23.1-02 · importes en céntimos enteros; ningún importe admite coma flotante", () => {
    expect(Club.parse(CLUB_REFERENCIA).precio_taquilla_cent).toBe(4_500);
    expect(Number.isInteger(CLUB_REFERENCIA.precio_taquilla_cent)).toBe(true);

    expect(Club.safeParse({ ...CLUB_REFERENCIA, precio_taquilla_cent: 4_500.5 }).success).toBe(
      false,
    );
    expect(
      Club.safeParse({ ...CLUB_REFERENCIA, personal_costes_anual_cent: 300_000_000.01 }).success,
    ).toBe(false);
    expect(
      Club.safeParse({
        ...CLUB_REFERENCIA,
        bases_negativas: [{ anio_inicio: 2026, importe_cent: 1_000.5 }],
      }).success,
    ).toBe(false);
    expect(
      Club.safeParse({
        ...CLUB_REFERENCIA,
        recaudacion_historica_cent: [1.5, 0, 0, 0, 0],
      }).success,
    ).toBe(false);

    const [grada] = SECCIONES_REFERENCIA;
    expect(SeccionEstadio.safeParse({ ...grada, precio_base_partido_cent: 1_500.25 }).success).toBe(
      false,
    );
  });

  // Pendiente de T-28. Función propuesta: ocupacionMaxGlobal(secciones) en explotacion/demanda.ts.
  // Esta comprobación sí es real: el aforo sale de las secciones de localidades (7.1).
  // import { ocupacionMaxGlobal } from "../../src/explotacion/demanda";
  // import { ESTADIO_REFERENCIA, SECCIONES_REFERENCIA } from "../fixtures/club-referencia";
  // it("AC-23.1-03 · aforo_total = 42.800 y ocupacion_max_global = 0,890421", () => {
  //   const localidades = SECCIONES_REFERENCIA.filter((s) =>
  //     ["grada_general", "grada_preferente", "grada_fondo", "palcos", "zona_vip"].includes(s.tipo),
  //   );
  //   expect(localidades.reduce((acc, s) => acc + s.plazas, 0)).toBe(42_800);
  //   expect(ESTADIO_REFERENCIA.aforo_total).toBe(42_800);
  //   expect(ocupacionMaxGlobal(SECCIONES_REFERENCIA)).toBe(0.890421); // 38.110 / 42.800
  // });
  it.todo("AC-23.1-03 · aforo_total = 42.800 y ocupacion_max_global = 0,890421 (T-28)");

  // Pendiente de T-17. Función: derivadosClub(club, estadio, parametros) en temporada/derivados.ts.
  // import { derivadosClub } from "../../src/temporada/derivados";
  // import { CLUB_REFERENCIA, ESTADIO_REFERENCIA } from "../fixtures/club-referencia";
  // it("AC-23.1-04 · seguidores_club = 505.680 y fans_activos = 25.680", () => {
  //   const d = derivadosClub(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS);
  //   expect(d.seguidores_club).toBe(505_680);
  //   expect(d.fans_activos).toBe(25_680);
  // });
  it.todo("AC-23.1-04 · seguidores_club = 505.680 y fans_activos = 25.680 (T-17)");

  // Pendiente de T-17. Función: derivadosClub. Caso Segunda: R = 40 y aforo 18.000 (8.100).
  // it("AC-23.1-05 · abonos_objetivo = 25.680 (0,60) y 8.100 en Segunda (0,45)", () => {
  //   const d = derivadosClub(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS);
  //   expect(d.abonos_objetivo).toBe(25_680);
  //   expect(DATOS_REFERENCIA.porcentaje_abonados).toBe(0.6);
  //   // Segunda: club con R = 40 y aforo_total = 18.000 → porcentaje 0,45 (6.2.2).
  //   const segunda = derivadosClub(CLUB_SEGUNDA_R40, ESTADIO_SEGUNDA_18000, PARAMETROS);
  //   expect(segunda.abonos_objetivo).toBe(8_100);
  // });
  it.todo("AC-23.1-05 · abonos_objetivo = 25.680 y 8.100 en Segunda con R = 40 (T-17)");

  // Pendiente de T-16. Función: generarAntiguedades(n, rng) en explotacion/abonados.ts.
  // Con 25.680 abonos, la proporción con 5 años o más es 64,1 % ± 2 %.
  // import { generarAntiguedades } from "../../src/explotacion/abonados";
  // import { crearRng } from "../../src/core/rng";
  // it("AC-23.1-06 · antigüedad 0,9^(k-1): 64,1 % de abonos con 5 años o más (± 2 %)", () => {
  //   const antiguedades = generarAntiguedades(25_680, crearRng(DATOS_REFERENCIA.semilla_carga, 1));
  //   const mayores = antiguedades.filter((a) => a >= 5).length;
  //   expect(mayores / 25_680).toBeGreaterThanOrEqual(0.621);
  //   expect(mayores / 25_680).toBeLessThanOrEqual(0.661);
  // });
  it.todo("AC-23.1-06 · antigüedad inicial de abonos: 64,1 % con 5 años o más (T-16)");

  // Pendiente de T-17. Función: derivadosClub (recaudacion_historica_cent).
  // it("AC-23.1-07 · recaudacion_historica_cent = 28.218.465 € por temporada y 141.092.325 € en 5", () => {
  //   const d = derivadosClub(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS);
  //   expect(d.recaudacion_historica_cent).toEqual([2_821_846_500, 2_821_846_500, 2_821_846_500, 2_821_846_500, 2_821_846_500]);
  //   expect(d.recaudacion_historica_cent.reduce((a, b) => a + b, 0)).toBe(14_109_232_500);
  // });
  it.todo("AC-23.1-07 · recaudacion_historica_cent del club de referencia (T-17)");

  // Pendiente de T-20. Función: crearPartida(paquetes, opciones) en temporada/crear.ts.
  // it("AC-23.1-08 · historial_posiciones: 5 temporadas con la posición del orden de carga", () => {
  //   const partida = crearPartida(PAQUETES_REFERENCIA, OPCIONES_REFERENCIA);
  //   const club = partida.clubes.find((c) => c.codigo === "P10");
  //   expect(club?.historial_posiciones).toEqual(
  //     Array.from({ length: 5 }, () => ({ division: "primera", posicion: 10 })),
  //   );
  // });
  it.todo("AC-23.1-08 · historial_posiciones de la carga (T-20)");

  // Pendiente de T-15. Función: escalarSecciones(aforo, plantilla) en estadio/secciones.ts.
  // import { escalarSecciones } from "../../src/estadio/secciones";
  // it("AC-23.1-09 · escalado a 25.000 plazas: suma exacta y palcos múltiplo de 10", () => {
  //   const secciones = escalarSecciones(25_000, SECCIONES_REFERENCIA);
  //   const suma = secciones
  //     .filter((s) => ["grada_general", "grada_preferente", "grada_fondo", "palcos", "zona_vip"].includes(s.tipo))
  //     .reduce((acc, s) => acc + s.plazas, 0);
  //   expect(suma).toBe(25_000);
  //   const palcos = secciones.find((s) => s.tipo === "palcos");
  //   expect((palcos?.plazas ?? -1) % 10).toBe(0);
  // });
  it.todo("AC-23.1-09 · escalado de secciones a 25.000 plazas (T-15)");

  // Pendiente de T-29. Funciones: registrar(libro, movimiento), saldo(libro) en economia/libro.ts.
  // import { registrar, saldo } from "../../src/economia/libro";
  // it("AC-23.1-10 · amortización con afecta_caja = false no cambia Caja.saldo_cent", () => {
  //   // Entrada: libro con saldo 15.000.000 € y un movimiento de amortización de 3.000.000 € con afecta_caja = false.
  //   const libro = registrar(LIBRO_REFERENCIA, MOVIMIENTO_AMORTIZACION_NO_CAJA);
  //   expect(saldo(libro)).toBe(1_500_000_000);
  // });
  it.todo("AC-23.1-10 · amortización con afecta_caja = false no toca el saldo (T-29)");

  // Pendiente de T-18. Función: generarPool(semilla, p) en tools/generador (no es del núcleo).
  // Sus rangos y valores de la carga se comprueban sobre el paquete generado.
  // it("AC-23.1-11 · generador: reputaciones, caja inicial, personal y turismo de la carga", () => {
  //   const paquete = generarPool(SEMILLA_REFERENCIA, PARAMETROS_B7);
  //   const primera = paquete.clubes.filter((c) => c.division_actual === "primera");
  //   const segunda = paquete.clubes.filter((c) => c.division_actual === "segunda");
  //   for (const c of primera) expect(c.reputacion).toBeGreaterThanOrEqual(40);
  //   for (const c of primera) expect(c.reputacion).toBeLessThanOrEqual(90);
  //   for (const c of segunda) expect(c.reputacion).toBeLessThanOrEqual(60);
  //   const p10 = paquete.clubes.find((c) => c.codigo === "P10");
  //   expect(p10?.reputacion).toBe(60);
  //   expect(p10?.caja_inicial_cent).toBe(1_500_000_000);
  //   expect(p10?.personal_costes_anual_cent).toBe(800_000_000);
  //   expect(paquete.prestamos).toHaveLength(0);
  // });
  it.todo("AC-23.1-11 · generador de carga: reputaciones, caja, personal, sin préstamos (T-18)");

  // Pendiente de T-18. Función propuesta: patrocinioCarga(club, p) y multiplicadorPatrocinio(R).
  // Multiplicador 0,52 + 0,008 × R (8.3): 1,00 con R = 60; 1,24 con R = 90; 0,84 con R = 40.
  // it("AC-23.1-12 · patrocinios de carga: 23 M€ al año en 7 zonas y naming de 12 M€", () => {
  //   const zonas = patrociniosCarga(CLUB_REFERENCIA, PARAMETROS);
  //   expect(zonas.filter((z) => z.zona !== "naming")).toHaveLength(7);
  //   expect(zonas.filter((z) => z.zona !== "naming").reduce((a, z) => a + z.importe_anual_cent, 0)).toBe(2_300_000_000);
  //   expect(zonas.find((z) => z.zona === "naming")?.importe_anual_cent).toBe(1_200_000_000);
  //   expect(multiplicadorPatrocinio(90)).toBe(1.24);
  //   expect(multiplicadorPatrocinio(40)).toBe(0.84);
  // });
  it.todo("AC-23.1-12 · patrocinios de carga y multiplicador por reputación (T-18)");
});
