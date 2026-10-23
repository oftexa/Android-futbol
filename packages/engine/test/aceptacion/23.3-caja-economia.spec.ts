// Sección 23.3 de la especificación (caja y motor económico). Todos los criterios están
// pendientes: cada `it.todo` va precedido del código completo del test, comentado.
// Importes en céntimos enteros (regla de oro 2). Valores de check.py y de la sección 6.
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.3 · Caja y motor económico (sección 6)", () => {
  // Pendiente de T-28 y T-32. Funciones: calcularDemanda(e, p) (explotacion/demanda.ts) e
  // ingresosPartido(asistencia, club, estadio, p) (economia/ingresos/matchday.ts).
  // import { calcularDemanda } from "../../src/explotacion/demanda";
  // import { ingresosPartido } from "../../src/economia/ingresos/matchday";
  // import { CLUB_REFERENCIA, DATOS_REFERENCIA, ESTADIO_REFERENCIA } from "../fixtures/club-referencia";
  // it("AC-23.3-01 · taquilla del ejemplo de 6.12: 14.983 localidades y 674.235 €", () => {
  //   const demanda = calcularDemanda(ESTADIO_REFERENCIA, CONTEXTO_REFERENCIA);
  //   expect(demanda.asistencia).toBe(37_761);
  //   const taquilla = ingresosPartido(demanda.asistencia, CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA)
  //     .find((d) => d.categoria === "taquilla");
  //   // 37.761 asistentes − 21.828 abonados que asisten − 950 plazas de palco = 14.983 localidades.
  //   expect(taquilla?.localidades).toBe(14_983);
  //   expect(taquilla?.importe_cent).toBe(67_423_500);
  // });
  it.todo("AC-23.3-01 · taquilla del ejemplo de 6.12: 14.983 localidades y 674.235 € (T-28, T-32)");

  // Pendiente de T-32. Función propuesta: validarPrecioTaquilla(club, precio_cent) en matchday.ts.
  // it("AC-23.3-02 · precio de taquilla: 22,50 € a 90 € en Primera (11 € a 44 € en Segunda); 40,50 € → 620.946 €; 50 € → 524.900 €; en Manager no cambia", () => {
  //   expect(validarPrecioTaquilla(CLUB_REFERENCIA, 2_250).ok).toBe(true);
  //   expect(validarPrecioTaquilla(CLUB_REFERENCIA, 9_000).ok).toBe(true);
  //   expect(validarPrecioTaquilla(CLUB_REFERENCIA, 2_249).ok).toBe(false);
  //   expect(validarPrecioTaquilla(CLUB_REFERENCIA, 9_001).ok).toBe(false);
  //   expect(validarPrecioTaquilla(CLUB_SEGUNDA_REFERENCIA, 1_100).ok).toBe(true);
  //   expect(validarPrecioTaquilla(CLUB_SEGUNDA_REFERENCIA, 4_400).ok).toBe(true);
  //   expect(taquillaAPrecio(CLUB_REFERENCIA, 4_050).importe_cent).toBe(62_094_600);
  //   expect(taquillaAPrecio(CLUB_REFERENCIA, 5_000).importe_cent).toBe(52_490_000);
  //   expect(cambiarPrecioTaquilla(CLUB_MANAGER_REFERENCIA, 5_000).ok).toBe(false);
  // });
  it.todo("AC-23.3-02 · rango del precio de taquilla y taquilla a 40,50 € y 50 € (T-32)");

  // Pendiente de T-30. Funciones: liquidarTick(libro, semana), saldo(libro) (economia/liquidacion.ts).
  // it("AC-23.3-03 · saldo de agosto del ejemplo de 6.12 con saldo inicial de 15,0 M€: 17.961.014,25 €", () => {
  //   const libro = liquidarHasta(LIBRO_EJEMPLO_6_12, "agosto");
  //   expect(saldo(libro)).toBe(1_796_101_425);
  // });
  it.todo("AC-23.3-03 · saldo de agosto del ejemplo de 6.12: 17.961.014,25 € (T-30)");

  // Pendiente de T-30. Función: liquidarTick(libro, semana).
  // it("AC-23.3-04 · liquidación: cobros antes que pagos; pagos 1.º (préstamos e impuestos) a Resto; desempate por secuencia_creacion", () => {
  //   const libro = liquidarTick(LIBRO_COBROS_Y_PAGOS_REFERENCIA, 4);
  //   expect(libro.ejecutados.map((m) => m.codigo)).toEqual(ORDEN_LIQUIDACION_REFERENCIA);
  // });
  it.todo(
    "AC-23.3-04 · orden de liquidación de un tick: cobros, luego pagos, desempate por secuencia (T-30)",
  );

  // Pendiente de T-33. Función propuesta: poolsLiga(temporada, p) en economia/reparto-tv.ts.
  // it("AC-23.3-05 · pools de 2026/27: audiovisual 1.288.908.000 € y 143.212.000 €; comercialización 1.426.050.000 € y 158.450.000 €; digital 40.000.000 € y 4.000.000 €; L_disp = 3,5", () => {
  //   const pools = poolsLiga(TEMPORADA_2026, PARAMETROS_REFERENCIA);
  //   expect(pools.audiovisual_primera_cent).toBe(128_890_800_000);
  //   expect(pools.audiovisual_segunda_cent).toBe(14_321_200_000);
  //   expect(pools.comercializacion_primera_cent).toBe(142_605_000_000);
  //   expect(pools.comercializacion_segunda_cent).toBe(15_845_000_000);
  //   expect(pools.digital_primera_cent).toBe(4_000_000_000);
  //   expect(pools.digital_segunda_cent).toBe(400_000_000);
  //   expect(pools.base_umbral_cent).toBe(306_062_000_000); // 3.060,62 M€
  //   expect(pools.L_disp).toBe(3.5);
  // });
  it.todo("AC-23.3-05 · pools de liga de 2026/27 y L_disp = 3,5 (T-33)");

  // Pendiente de T-31 y T-33. Funciones: preverTemporada(club, contratos, p) (economia/plazos.ts)
  // y repartoPrimera(entradas, pool, p) (economia/reparto-tv.ts).
  // it("AC-23.3-06 · club de referencia (6.9.2): audiovisual 57.195.292,50 € en 10 cobros; comercialización 63.280.968,75 € en 2 cobros; digital 1.775.000 € en 12 cobros", () => {
  //   const previstos = preverTemporada(CLUB_REFERENCIA, [], PARAMETROS_REFERENCIA);
  //   const av = previstos.filter((m) => m.categoria === "derechos_tv" && m.subtipo === "nacional");
  //   expect(av.map((m) => m.semana)).toEqual([5, 9, 14, 18, 22, 27, 31, 35, 40, 44]);
  //   expect(av.every((m) => m.importe_cent === 571_952_925)).toBe(true);
  //   const com = previstos.filter((m) => m.categoria === "comercializacion");
  //   expect(com.map((m) => [m.semana, m.importe_cent])).toEqual([
  //     [1, 3_164_048_438],
  //     [27, 3_164_048_437],
  //   ]);
  //   const dig = previstos.filter((m) => m.categoria === "derechos_tv" && m.subtipo === "digital");
  //   expect(dig).toHaveLength(12);
  //   expect(dig.slice(0, 11).every((m) => m.importe_cent === 14_791_667)).toBe(true);
  //   expect(dig[11]?.importe_cent).toBe(14_791_663);
  // });
  it.todo(
    "AC-23.3-06 · club de referencia: fracción 0,044375 y cobros de audiovisual, comercialización y digital (T-31, T-33)",
  );

  // Pendiente de T-33. Función propuesta: escalaResultados(division, posicion) en reparto-tv.ts.
  // it("AC-23.3-07 · escala de resultados de Primera suma 100 %; 10.ª = 0,0275; en Segunda la temporada no cuenta y los pesos se renormalizan a 1", () => {
  //   expect(sumaEscala("primera")).toBeCloseTo(1, 10);
  //   expect(escalaResultados("primera", 10)).toBeCloseTo(0.0275, 10);
  //   expect(pesosRenormalizados(HISTORIAL_CON_UNA_TEMPORADA_EN_SEGUNDA).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  // });
  it.todo(
    "AC-23.3-07 · escala de resultados de Primera y renormalización al estar en Segunda (T-33)",
  );

  // Pendiente de T-33. Función: repartoPrimera con límite K = 3,5 (mayor resto sobre céntimos).
  // Entradas proporcionales a 1, 2, …, 20 sobre el pool audiovisual de Primera.
  // it("AC-23.3-08 · límite de dispersión: L = 28.642.400 € y 3,5 × L = 100.248.400 €; clubes 1 a 4 cobran L; 17 a 20 cobran 3,5 × L; suma exacta", () => {
  //   const cobros = repartoPrimera(ENTRADAS_PROPORCIONALES_1_A_20, 128_890_800_000, PARAMETROS_REFERENCIA);
  //   expect(cobros.slice(0, 4)).toEqual([2_864_240_000, 2_864_240_000, 2_864_240_000, 2_864_240_000]);
  //   expect(cobros.slice(16)).toEqual([10_024_840_000, 10_024_840_000, 10_024_840_000, 10_024_840_000]);
  //   expect(cobros.reduce((a, b) => a + b, 0)).toBe(128_890_800_000);
  // });
  it.todo("AC-23.3-08 · límite de dispersión L y 3,5 × L en el reparto de Primera (T-33)");

  // Pendiente de T-34. Función: repartoSegunda(pool, descendidos, p) en reparto-tv.ts.
  // it("AC-23.3-09 · reparto de Segunda: 1.º 6.918.116,05 €; 22.º 5.775.674,86 €; fondo 3.580.300 € con descendidos; sin descendidos 2026/27: 1.º 7.095.503,64 €", () => {
  //   const r = repartoSegunda(14_321_200_000, [18, 19, 20], PARAMETROS_REFERENCIA);
  //   expect(r.cobros_cent[0]).toBe(691_811_605);
  //   expect(r.cobros_cent[21]).toBe(577_567_486);
  //   expect(r.fondo_cent).toEqual([135_617_424, 119_343_333, 103_069_243]);
  //   expect(r.total_cent).toBe(14_321_200_000);
  //   const sin = repartoSegunda(14_321_200_000, [], PARAMETROS_REFERENCIA);
  //   expect(sin.cobros_cent[0]).toBe(709_550_364);
  //   expect(sin.cobros_cent[21]).toBe(592_376_909);
  // });
  it.todo("AC-23.3-09 · reparto audiovisual de Segunda con y sin fondo de descendidos (T-34)");

  // Sin fila en el Anexo A (13.2, 13.3). Funciones propuestas: precioVenta, precioCompra, precioRenovacion.
  // it("AC-23.3-10 · mercado: venta de 10 M€ rechazada a 9,9 M€ y aceptada a 10 M€ con 2 años; exige 13 M€ con 5 o más; compra por 8 M€ con 2 años y 10 M€ con 4 o más; renovación de 2 M€ rechaza 2,29 M€ y acepta 2,3 M€ con moral ≥ 35", () => {
  //   expect(ofertaVenta(JUGADOR_VALOR_10M, 2, 990_000_000).aceptada).toBe(false);
  //   expect(ofertaVenta(JUGADOR_VALOR_10M, 2, 1_000_000_000).aceptada).toBe(true);
  //   expect(precioMinimoVenta(JUGADOR_VALOR_10M, 5)).toBe(1_300_000_000);
  //   expect(precioCompraSistema(JUGADOR_VALOR_10M, 2)).toBe(800_000_000);
  //   expect(precioCompraSistema(JUGADOR_VALOR_10M, 4)).toBe(1_000_000_000);
  //   for (let anios = 0; anios <= 6; anios++) {
  //     expect(precioVentaSistema(JUGADOR_VALOR_10M, anios)).toBeLessThan(precioMinimoCompra(JUGADOR_VALOR_10M, anios));
  //   }
  //   expect(aceptaRenovacion(RENOVACION_2M_3_ANIOS, 229_000_000, 35).aceptada).toBe(false);
  //   expect(aceptaRenovacion(RENOVACION_2M_3_ANIOS, 230_000_000, 35).aceptada).toBe(true);
  // });
  it.todo(
    "AC-23.3-10 · mercado: precios de venta, compra y renovación con sus rechazos (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (6.11). Función propuesta: cierreDeMes(club, saldo, n) en economia/descubierto.ts.
  // it("AC-23.3-11 · venta forzosa: aviso en el 2.º cierre seguido por encima del límite; venta automática del vendible de mayor salario en el 3.º, al precio de 13.3", () => {
  //   const c1 = cierreDeMes(CLUB_REFERENCIA, SALDO_SOBRE_LIMITE, 1);
  //   expect(c1.aviso).toBeNull();
  //   const c2 = cierreDeMes(c1.club, SALDO_SOBRE_LIMITE, 2);
  //   expect(c2.aviso).not.toBeNull();
  //   const c3 = cierreDeMes(c2.club, SALDO_SOBRE_LIMITE, 3);
  //   expect(c3.venta?.jugador_id).toBe(JUGADOR_MAYOR_SALARIO_VENDIBLE);
  //   expect(c3.venta?.precio_cent).toBe(PRECIO_13_3_REFERENCIA);
  // });
  it.todo("AC-23.3-11 · venta forzosa tras dos cierres sobre el límite (sin fila en Anexo A)");

  // Sin fila en el Anexo A (6.7). Función propuesta: cuadroPrestamo(principal, anios, tipo, sistema).
  // it("AC-23.3-12 · préstamo de 10 M€ a 5 años y 5 %: lineal, 1.ª cuota 208.333,33 € e intereses 1.270.833,33 €; francesa, cuota 188.712,34 € e intereses 1.322.740,19 €; tipo del club de referencia 4,8 %", () => {
  //   const lineal = cuadroPrestamo(1_000_000_000, 5, 0.05, "lineal");
  //   expect(lineal.cuotas_cent[0]).toBe(20_833_333);
  //   expect(lineal.intereses_totales_cent).toBe(127_083_333);
  //   const francesa = cuadroPrestamo(1_000_000_000, 5, 0.05, "francesa");
  //   expect(francesa.cuotas_cent[0]).toBe(18_871_234);
  //   expect(francesa.intereses_totales_cent).toBe(132_274_019);
  //   expect(tipoInteresClub(CLUB_REFERENCIA)).toBeCloseTo(0.048, 10);
  // });
  it.todo("AC-23.3-12 · préstamo lineal y francés de 10 M€ a 5 años y 5 % (sin fila en Anexo A)");

  // Pendiente de T-35. Función: ingresoVallas(club, p) en economia/ingresos/vallas.ts.
  // it("AC-23.3-13 · vallas: 1.070 × 18.000 € = 19.260.000 € en la semana 1; modalidad B: 947,37 € por valla y partido en Primera", () => {
  //   const movs = ingresoVallas(CLUB_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(movs.find((m) => m.semana === 1)?.importe_cent).toBe(1_926_000_000);
  //   expect(precioVallaPartidoModalidadB("primera")).toBe(94_737);
  // });
  it.todo("AC-23.3-13 · vallas: modalidad A en la semana 1 y modalidad B por partido (T-35)");

  // Sin fila en el Anexo A (6.4). Funciones propuestas: fichaje(...), amortizarTemporadas(...), venderFichaje(...).
  // it("AC-23.3-14 · fichaje de 12 M€ a 4 años: 3 M€ por temporada; tras 2, 6 M€ pendientes; venta por 4 M€: −2 M€ en resultados y +4 M€ en caja", () => {
  //   const f = fichaje(1_200_000_000, 4);
  //   expect(gastoAmortizacion(f, 1)).toBe(300_000_000);
  //   const tras2 = amortizarTemporadas(f, 2);
  //   expect(tras2.pendiente_cent).toBe(600_000_000);
  //   const venta = venderFichaje(tras2, 400_000_000);
  //   expect(venta.resultado_cent).toBe(-200_000_000);
  //   expect(venta.caja_cent).toBe(400_000_000);
  // });
  it.todo(
    "AC-23.3-14 · amortización de fichajes y venta con pérdida contable (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (6.8). Función propuesta: impuestoSociedades(club, beneficio, bases).
  // it("AC-23.3-15 · beneficio de 10 M€ con 6 M€ de bases negativas: compensación de 5 M€ e impuesto de 1,25 M€ cobrado en la semana 4 siguiente", () => {
  //   const r = impuestoSociedades(CLUB_REFERENCIA, 1_000_000_000, [{ anio_inicio: 2026, importe_cent: 600_000_000 }]);
  //   expect(r.compensado_cent).toBe(500_000_000);
  //   expect(r.impuesto_cent).toBe(125_000_000);
  //   expect(r.semana_cobro).toBe(4);
  // });
  it.todo(
    "AC-23.3-15 · impuesto de sociedades con compensación de bases negativas (sin fila en Anexo A)",
  );

  // Pendiente de T-38. Función: interesDescubierto(saldo, p) en economia/descubierto.ts.
  // it("AC-23.3-16 · descubierto: saldo de −4 M€ al cierre de mes → interés de 26.666,67 € en el primer tick del mes siguiente", () => {
  //   expect(interesDescubierto(-400_000_000, PARAMETROS_REFERENCIA)).toBe(2_666_667);
  // });
  it.todo(
    "AC-23.3-16 · interés de descubierto de 26.666,67 € en el primer tick del mes siguiente (T-38)",
  );

  // Sin fila en el Anexo A (8.1, decisión 42). Función propuesta: tiendaFueraDiaPartido(club, estadio, p).
  // it("AC-23.3-17 · tienda física fuera de día de partido: 151.620 € al año en el primer tick de cada mes (julio → junio)", () => {
  //   const meses = tiendaFueraDiaPartido(CLUB_REFERENCIA, ESTADIO_REFERENCIA, PARAMETROS_REFERENCIA);
  //   expect(meses).toEqual([1_739_902, 1_739_902, 1_242_787, 1_242_787, 1_242_787, 869_951, 869_951, 1_242_787, 1_242_787, 1_242_787, 1_242_787, 1_242_785]);
  //   expect(meses.reduce((a, b) => a + b, 0)).toBe(15_162_000);
  //   const sinTienda = tiendaFueraDiaPartido(CLUB_REFERENCIA, ESTADIO_SIN_TIENDA, PARAMETROS_REFERENCIA);
  //   expect(sinTienda.every((c) => c === 0)).toBe(true);
  // });
  it.todo(
    "AC-23.3-17 · tienda física fuera de día de partido: 151.620 € al año por meses (sin fila en Anexo A)",
  );
});
