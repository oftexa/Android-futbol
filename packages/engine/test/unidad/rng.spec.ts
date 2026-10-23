import { Uuid } from "@af4/contracts";
import { describe, expect, it } from "vitest";
import { crearRng, uuidDesdeRng } from "../../src/core/rng";

// Salidas de referencia de pcg32-demo (pcg32_srandom(42u, 54u)), en hexadecimal.
const REFERENCIA_PCG32_DEMO = [
  0xa15c02b7, 0x7b47f409, 0xba1d3330, 0x83d2f293, 0xbfa4784b, 0xcbed606e,
];

const SEMILLA = 20261023n;

function secuencia(semilla: bigint, k: number, n: number): number[] {
  const rng = crearRng(semilla, k);
  return Array.from({ length: n }, () => rng.siguienteU32());
}

describe("PCG32", () => {
  it("coincide con el vector de referencia de pcg32-demo (initstate 42, initseq 54)", () => {
    expect(secuencia(42n, 54, 6)).toEqual(REFERENCIA_PCG32_DEMO);
  });

  it("dos flujos k distintos con la misma semilla dan secuencias distintas", () => {
    expect(secuencia(SEMILLA, 1, 16)).not.toEqual(secuencia(SEMILLA, 2, 16));
  });

  it("mismo (semilla, k) produce la misma secuencia", () => {
    expect(secuencia(SEMILLA, 3, 32)).toEqual(secuencia(SEMILLA, 3, 32));
  });

  it("estado() y restaurar() reproducen la continuación", () => {
    const rng = crearRng(SEMILLA, 2);
    for (let i = 0; i < 5; i++) rng.siguienteU32();
    const guardado = JSON.parse(JSON.stringify(rng.estado())) as ReturnType<typeof rng.estado>;
    const continuacionA = Array.from({ length: 10 }, () => rng.siguienteU32());

    const otro = crearRng(7n, 9);
    otro.restaurar(guardado);
    const continuacionB = Array.from({ length: 10 }, () => otro.siguienteU32());

    expect(continuacionB).toEqual(continuacionA);
  });

  it("restaurar() rechaza un estado no válido", () => {
    const rng = crearRng(SEMILLA, 1);
    // inc debe ser impar.
    expect(() => {
      rng.restaurar({ state: "1", inc: "2" });
    }).toThrow(RangeError);
  });

  it("rechaza un índice de flujo negativo", () => {
    expect(() => crearRng(SEMILLA, -1)).toThrow(RangeError);
  });

  it("u() está en [0, 1) y entero() no tiene sesgo grosero en [1, 6]", () => {
    const rng = crearRng(SEMILLA, 4);
    for (let i = 0; i < 1000; i++) {
      const x = rng.u();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }

    const cuentas = new Map<number, number>();
    const n = 60000;
    for (let i = 0; i < n; i++) {
      const v = rng.entero(1, 6);
      cuentas.set(v, (cuentas.get(v) ?? 0) + 1);
    }
    for (let cara = 1; cara <= 6; cara++) {
      const observado = cuentas.get(cara) ?? 0;
      // Esperado 10.000 por cara; tolerancia de ±3 %.
      expect(Math.abs(observado - n / 6) / (n / 6)).toBeLessThan(0.03);
    }
  });
});

describe("Poisson (Knuth con expDet)", () => {
  const n = 20000;

  for (const lambda of [1.3, 2.5]) {
    it(`media muestral dentro de ±1 % para lambda ${String(lambda)}`, () => {
      const rng = crearRng(SEMILLA, 2);
      let suma = 0;
      for (let i = 0; i < n; i++) suma += rng.poisson(lambda);
      const media = suma / n;
      expect(Math.abs(media - lambda) / lambda).toBeLessThan(0.01);
    });
  }

  it("lambda 0 devuelve siempre 0", () => {
    const rng = crearRng(SEMILLA, 2);
    for (let i = 0; i < 100; i++) expect(rng.poisson(0)).toBe(0);
  });
});

describe("uuidDesdeRng", () => {
  it("genera UUID v4 con variante RFC y pasa el esquema Uuid de @af4/contracts", () => {
    const rng = crearRng(SEMILLA, 1);
    for (let i = 0; i < 200; i++) {
      const id = uuidDesdeRng(rng);
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      expect(Uuid.safeParse(id).success).toBe(true);
    }
  });

  it("es reproducible desde el mismo flujo", () => {
    const a = uuidDesdeRng(crearRng(SEMILLA, 1));
    const b = uuidDesdeRng(crearRng(SEMILLA, 1));
    expect(a).toBe(b);
  });
});
