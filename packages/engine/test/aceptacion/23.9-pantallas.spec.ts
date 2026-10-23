// Sección 23.9 de la especificación (pantallas). Todos los criterios están pendientes: cada
// `it.todo` va precedido del código completo del test, comentado. Son criterios de interfaz; si
// la pantalla vive en apps/web, su test debe ir allí (aquí solo queda el identificador y la lógica
// de núcleo que consumen, como proyectarCaja y aplicarComando de api.ts).
// Al implementar: descomenta el bloque (y sus imports), borra el `it.todo` y añade `expect` a vitest.

import { describe, it } from "vitest";

describe("23.9 · Pantallas (sección 13)", () => {
  // Pendiente de T-52. Función: pantallasVisibles(modo) (visibilidad-modos.ts, apps/web).
  // it("AC-23.9-01 · cada modo ve exactamente las pantallas de 13.1; Promanager igual que Coach; Manager ve Caja y finanzas en solo lectura", () => {
  //   expect(pantallasVisibles("promanager")).toEqual(pantallasVisibles("coach"));
  //   expect(pantallasVisibles("coach")).toEqual(PANTALLAS_13_1_COACH);
  //   expect(pantallasVisibles("manager")).toContain("caja_finanzas");
  //   expect(modoAccesoPantalla("manager", "caja_finanzas")).toBe("solo_lectura");
  // });
  it.todo("AC-23.9-01 · visibilidad de pantallas por modo según 13.1 (T-52)");

  // Pendiente de T-53. Componentes de apps/web (Importe, Desglose).
  // it("AC-23.9-02 · toda cifra de pantalla abre su desglose de causas (Movimiento.causa, factores de 8.2, sorteos de 5.5)", () => {
  //   const celda = renderCifra(CIFRA_TAQUILLA_REFERENCIA);
  //   expect(celda.desglose.causas.length).toBeGreaterThan(0);
  // });
  it.todo("AC-23.9-02 · toda cifra abre su desglose de causas (T-53)");

  // Sin fila en el Anexo A (3.3). Función: aplicarComando(estado, comando) de api.ts.
  // it("AC-23.9-03 · ninguna acción prohibida por una regla se puede confirmar; se muestra la causa (ventana cerrada, límite, descubierto, plantilla, no comunitarios)", () => {
  //   const r = aplicarComando(ESTADO_VENTANA_CERRADA, COMANDO_FICHAR_FUERA_DE_VENTANA);
  //   expect(r.ok).toBe(false);
  //   expect(r.causas.map((c) => c.codigo)).toContain("ventana_cerrada");
  // });
  it.todo(
    "AC-23.9-03 · ninguna acción prohibida se confirma y se muestra su causa (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (13.2). Función: proyectarCaja(estado, semanas) de api.ts.
  // it("AC-23.9-04 · la proyección de caja de 8 semanas coincide con la suma de movimientos previstos y se etiqueta como estimada", () => {
  //   const p = proyectarCaja(ESTADO_REFERENCIA, 8);
  //   expect(p.semanas).toBe(8);
  //   expect(p.saldos_cent).toHaveLength(8);
  //   expect(p.saldos_cent[7]).toBe(SALDO_FINAL_PREVISTO_REFERENCIA);
  //   expect(p.estimada).toBe(true);
  // });
  it.todo(
    "AC-23.9-04 · proyección de caja de 8 semanas igual a los movimientos previstos y etiquetada (sin fila en Anexo A)",
  );

  // Sin fila en el Anexo A (13.2, 13.3). Pantalla de mercado en apps/web.
  // it("AC-23.9-05 · cada rechazo del vendedor, del jugador o de una regla muestra su causa; la venta muestra el precio de 13.3 y el beneficio contable", () => {
  //   const r = proponerVenta(JUGADOR_VALOR_10M, 990_000_000);
  //   expect(r.rechazo?.causa).toBe("precio_bajo_vendedor");
  //   const v = venderJugador(JUGADOR_VALOR_10M, ESTADO_REFERENCIA);
  //   expect(v.precio_mostrado_cent).toBe(PRECIO_13_3_REFERENCIA);
  //   expect(v.beneficio_contable_cent).toBe(BENEFICIO_CONTABLE_REFERENCIA);
  // });
  it.todo(
    "AC-23.9-05 · rechazos de mercado con causa y precio de venta de 13.3 (sin fila en Anexo A)",
  );
});
