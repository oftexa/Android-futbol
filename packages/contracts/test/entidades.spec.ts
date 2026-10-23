import { describe, expect, it } from "vitest";
import {
  Caja,
  Clausula,
  Club,
  Contrato,
  Entrenador,
  Estadio,
  Jugador,
  Movimiento,
  Obra,
  Partida,
  Temporada,
} from "../src/index";
import { ejemplos } from "./fixtures";

/** Copia el ejemplo válido y reemplaza un campo. */
function con(
  entidad: keyof typeof ejemplos,
  campo: string,
  valor: unknown,
): Record<string, unknown> {
  return { ...ejemplos[entidad](), [campo]: valor };
}

describe("AC-23.1-01 · valores fuera de rango se rechazan al validar", () => {
  it("los ejemplos válidos pasan la validación", () => {
    expect(Temporada.safeParse(ejemplos.Temporada()).success).toBe(true);
    expect(Club.safeParse(ejemplos.Club()).success).toBe(true);
    expect(Estadio.safeParse(ejemplos.Estadio()).success).toBe(true);
    expect(Jugador.safeParse(ejemplos.Jugador()).success).toBe(true);
    expect(Contrato.safeParse(ejemplos.Contrato()).success).toBe(true);
    expect(Entrenador.safeParse(ejemplos.Entrenador()).success).toBe(true);
    expect(Obra.safeParse(ejemplos.Obra()).success).toBe(true);
    expect(Movimiento.safeParse(ejemplos.Movimiento()).success).toBe(true);
    expect(Caja.safeParse(ejemplos.Caja()).success).toBe(true);
    expect(Clausula.safeParse(ejemplos.Clausula()).success).toBe(true);
    expect(Partida.safeParse(ejemplos.Partida()).success).toBe(true);
  });

  const casos: [string, Parameters<typeof con>, unknown][] = [
    ["Temporada: num_jornadas fuera de {38, 42}", ["Temporada", "num_jornadas", 40], Temporada],
    ["Club: reputacion > 100", ["Club", "reputacion", 101], Club],
    ["Club: racha fuera de {-1, 0, 1}", ["Club", "racha", 2], Club],
    ["Estadio: aforo_total < 5.000", ["Estadio", "aforo_total", 4999], Estadio],
    ["Jugador: edad < 15", ["Jugador", "edad", 14], Jugador],
    ["Contrato: anios_duracion > 6", ["Contrato", "anios_duracion", 7], Contrato],
    [
      "Entrenador: estado en_paro con club asignado",
      ["Entrenador", "estado", "en_paro"],
      Entrenador,
    ],
    ["Obra: semanas_pagadas > semanas_duracion", ["Obra", "semanas_pagadas", 13], Obra],
    ["Movimiento: semana 53 (no se usa, 5.1.1)", ["Movimiento", "semana", 53], Movimiento],
    ["Partida: semana_actual 0", ["Partida", "semana_actual", 0], Partida],
  ];

  for (const [descripcion, [entidad, campo, valor], esquema] of casos) {
    it(`rechaza ${descripcion}`, () => {
      const datos = con(entidad, campo, valor);
      expect((esquema as typeof Club).safeParse(datos).success).toBe(false);
    });
  }
});

describe("AC-23.1-02 · importes no enteros se rechazan", () => {
  // Cada importe se prueba con un decimal (debe fallar) y con un entero válido dentro de rango (debe pasar).
  const importes: [string, Record<string, unknown>, string, number][] = [
    ["Movimiento.importe_cent", ejemplos.Movimiento(), "importe_cent", 100],
    ["Caja.saldo_cent", ejemplos.Caja(), "saldo_cent", 100],
    ["Contrato.salario_anual_bruto_cent", ejemplos.Contrato(), "salario_anual_bruto_cent", 100],
    ["Clausula.importe_cent", ejemplos.Clausula(), "importe_cent", 100],
    ["Club.precio_taquilla_cent", ejemplos.Club(), "precio_taquilla_cent", 2000],
    ["Obra.coste_total", ejemplos.Obra(), "coste_total", 100],
    ["Jugador.valor_mercado", ejemplos.Jugador(), "valor_mercado", 100],
  ];
  const esquemas = { Movimiento, Caja, Contrato, Clausula, Club, Obra, Jugador };

  for (const [descripcion, base, campo, entero] of importes) {
    const esquema = esquemas[descripcion.split(".")[0] as keyof typeof esquemas];

    it(`rechaza un decimal en ${descripcion}`, () => {
      expect(esquema.safeParse({ ...base, [campo]: entero + 0.5 }).success).toBe(false);
    });

    it(`acepta un entero en ${descripcion}`, () => {
      expect(esquema.safeParse({ ...base, [campo]: entero }).success).toBe(true);
    });
  }
});
