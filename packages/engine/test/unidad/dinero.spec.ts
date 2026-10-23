import { describe, expect, it } from "vitest";
import type { Cent } from "@af4/contracts";
import {
  cuotas,
  multiplicarCent,
  redondearCent,
  repartirMayorResto,
  sumarCent,
} from "../../src/core/dinero";

// Generador congruencial lineal fijo (Numerical Recipes), sin Math.random.
function generadorLcg(semilla: number): () => number {
  let estado = semilla >>> 0;
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

function suma(valores: readonly number[]): number {
  return valores.reduce((acc, v) => acc + v, 0);
}

describe("redondearCent (4.1: mitades hacia arriba en valor absoluto)", () => {
  it("redondea las mitades alejándose de cero", () => {
    expect(redondearCent(2.5)).toBe(3);
    expect(redondearCent(0.5)).toBe(1);
    expect(redondearCent(1.5)).toBe(2);
    expect(redondearCent(-2.5)).toBe(-3);
    expect(redondearCent(-0.5)).toBe(-1);
  });

  it("redondea al entero más próximo fuera de las mitades", () => {
    expect(redondearCent(2.4999)).toBe(2);
    expect(redondearCent(2.5001)).toBe(3);
    expect(redondearCent(-2.4)).toBe(-2);
    expect(redondearCent(-2.6)).toBe(-3);
    expect(redondearCent(7)).toBe(7);
  });

  it("no se deja engañar por 0,49999999999999994 (la mitad falsa de x + 0,5)", () => {
    expect(redondearCent(0.49999999999999994)).toBe(0);
    expect(redondearCent(-0.49999999999999994)).toBe(0);
  });

  it("devuelve 0 sin signo negativo para valores que redondean a cero", () => {
    expect(Object.is(redondearCent(-0.2), 0)).toBe(true);
    expect(Object.is(redondearCent(-0), 0)).toBe(true);
  });

  it("rechaza valores no finitos", () => {
    expect(() => redondearCent(Number.NaN)).toThrow(RangeError);
    expect(() => redondearCent(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("sumarCent y multiplicarCent", () => {
  it("suma importes enteros", () => {
    expect(sumarCent([100, 250, -50] as Cent[])).toBe(300);
    expect(sumarCent([] as Cent[])).toBe(0);
  });

  it("multiplica por un factor y redondea a céntimo con mitades hacia arriba", () => {
    expect(multiplicarCent(1001 as Cent, 0.5)).toBe(501);
    expect(multiplicarCent(-1001 as Cent, 0.5)).toBe(-501);
    expect(multiplicarCent(1000 as Cent, 0.1234)).toBe(123);
  });
});

describe("repartirMayorResto", () => {
  it("reparte proporcionalmente cuando la división es exacta", () => {
    expect(repartirMayorResto(100 as Cent, [1, 2, 3, 4])).toEqual([10, 20, 30, 40]);
  });

  it("da el céntimo sobrante al mayor resto y desempata por índice", () => {
    // 10 entre tres pesos iguales: 3,33… cada una, el sobrante va al menor índice.
    expect(repartirMayorResto(10 as Cent, [1, 1, 1])).toEqual([4, 3, 3]);
    // 1 céntimo entre tres pesos iguales: lo recibe el índice 0.
    expect(repartirMayorResto(1 as Cent, [1, 1, 1])).toEqual([1, 0, 0]);
    // 7 entre dos pesos iguales: 3,5 cada una, desempate al índice 0.
    expect(repartirMayorResto(7 as Cent, [1, 1])).toEqual([4, 3]);
  });

  it("prioriza el mayor resto, no el mayor peso", () => {
    // Pesos 1, 1, 1, 1, 2 (suma 6). Con 6 céntimos la división es exacta.
    expect(repartirMayorResto(6 as Cent, [1, 1, 1, 1, 2])).toEqual([1, 1, 1, 1, 2]);
    // Con 7: cuotas exactas 7/6 (x4) y 14/6. Suelos [1,1,1,1,2], sobrante 1. Restos 1/6 y 2/6:
    // gana el de mayor resto (índice 4), aunque el desempate por índice daría el céntimo al 0.
    expect(repartirMayorResto(7 as Cent, [1, 1, 1, 1, 2])).toEqual([1, 1, 1, 1, 3]);
  });

  it("un peso igual a 0 nunca recibe céntimos", () => {
    expect(repartirMayorResto(5 as Cent, [0, 1, 0])).toEqual([0, 5, 0]);
    expect(repartirMayorResto(1 as Cent, [0, 1, 1])).toEqual([0, 1, 0]);
  });

  it("reparte el valor absoluto de un total negativo y niega cada parte", () => {
    expect(repartirMayorResto(-7 as Cent, [1, 1])).toEqual([-4, -3]);
  });

  it("un total cero da partes cero", () => {
    expect(repartirMayorResto(0 as Cent, [3, 1, 2])).toEqual([0, 0, 0]);
  });

  it("rechaza pesos vacíos, negativos, no finitos o todos cero", () => {
    expect(() => repartirMayorResto(10 as Cent, [])).toThrow(RangeError);
    expect(() => repartirMayorResto(10 as Cent, [1, -1])).toThrow(RangeError);
    expect(() => repartirMayorResto(10 as Cent, [1, Number.NaN])).toThrow(RangeError);
    expect(() => repartirMayorResto(10 as Cent, [0, 0])).toThrow(RangeError);
  });

  it("rechaza totales que no son enteros seguros", () => {
    expect(() => repartirMayorResto(1.5 as Cent, [1])).toThrow(RangeError);
  });

  it("1.000 casos con pesos y totales generados por un LCG fijo: la suma cuadra siempre", () => {
    const aleatorio = generadorLcg(20260123);
    for (let caso = 0; caso < 1000; caso++) {
      const n = 1 + Math.floor(aleatorio() * 20);
      const pesos: number[] = [];
      for (let i = 0; i < n; i++) {
        // Pesos con decimales y magnitudes muy distintas, incluido algún 0.
        const r = aleatorio();
        pesos.push(r < 0.1 ? 0 : Math.floor(aleatorio() * 1000) / 7 + aleatorio() * 1e-3);
      }
      if (!pesos.some((p) => p > 0)) pesos[0] = 1;

      const magnitud = Math.floor(aleatorio() * 4294967296) * 256 + Math.floor(aleatorio() * 256);
      const total = aleatorio() < 0.5 ? magnitud : -magnitud;
      const partes = repartirMayorResto(total as Cent, pesos);

      expect(partes).toHaveLength(n);
      expect(suma(partes)).toBe(total);

      // Cada parte es la cuota exacta redondeada hacia abajo o hacia arriba (error < 1 céntimo).
      const sumaPesos = suma(pesos);
      partes.forEach((parte, i) => {
        const ideal = (total * (pesos[i] ?? 0)) / sumaPesos;
        expect(Math.abs(parte - ideal)).toBeLessThan(1 + 1e-6 * Math.abs(ideal));
        if ((pesos[i] ?? 0) === 0) expect(parte).toBe(0);
      });
    }
  });
});

describe("cuotas (4.1: última cuota absorbe la diferencia)", () => {
  it("63.280.968,75 € en 2 cuotas: 31.640.484,38 € y 31.640.484,37 € (club de referencia, 6.9.2)", () => {
    expect(cuotas(6328096875 as Cent, 2)).toEqual([3164048438, 3164048437]);
  });

  it("1.775.000 € en 12 cobros: 11 de 147.916,67 € y el último de 147.916,63 € (6.9.2, digital)", () => {
    const serie = cuotas(177500000 as Cent, 12);
    expect(serie.slice(0, 11).every((c) => c === 14791667)).toBe(true);
    expect(serie[11]).toBe(14791663);
    expect(suma(serie)).toBe(177500000);
  });

  it("57.195.292,50 € en 10 cobros exactos de 5.719.529,25 € (6.9.2, audiovisual)", () => {
    expect(cuotas(5719529250 as Cent, 10)).toEqual(Array<number>(10).fill(571952925));
  });

  it("AC-23.3-05 (arquitectura, T-03): 12 cobros de 166.666,67 €, el último absorbe", () => {
    // 2.000.000,00 € en 12 cobros: 11 cobros de 166.666,67 € y el último de 166.666,63 €.
    const serie = cuotas(200000000 as Cent, 12);
    expect(serie.slice(0, 11).every((c) => c === 16666667)).toBe(true);
    expect(serie[11]).toBe(16666663);
    expect(suma(serie)).toBe(200000000);
  });

  it("principal lineal de 10 M€ en 60 cuotas (6.7): 166.666,67 € al mes y 166.666,47 € la última", () => {
    const serie = cuotas(1000000000 as Cent, 60);
    expect(serie.slice(0, 59).every((c) => c === 16666667)).toBe(true);
    expect(serie[59]).toBe(16666647);
    expect(suma(serie)).toBe(1000000000);
  });

  it("n = 1 devuelve el total entero", () => {
    expect(cuotas(12345 as Cent, 1)).toEqual([12345]);
  });

  it("reparte mitades en valor absoluto también con totales negativos", () => {
    // −5 céntimos en 2 cuotas: −2,5 → −3 y la última absorbe: −3 y −2.
    expect(cuotas(-5 as Cent, 2)).toEqual([-3, -2]);
  });

  it("rechaza n menor que 1 o no entero", () => {
    expect(() => cuotas(100 as Cent, 0)).toThrow(RangeError);
    expect(() => cuotas(100 as Cent, 1.5)).toThrow(RangeError);
  });
});
