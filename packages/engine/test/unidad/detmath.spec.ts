import { describe, expect, it } from "vitest";
import { expDet, logDet, powDet, powIntDet } from "../../src/core/detmath";

// Referencias: solo en tests. El núcleo no usa Math.exp/log/pow (ver eslint.config.mjs).
/* eslint-disable no-restricted-properties -- referencia de test, no código del núcleo */
const refExp = (x: number): number => Math.exp(x);
const refLog = (x: number): number => Math.log(x);
const refPow = (b: number, e: number): number => Math.pow(b, e);
/* eslint-enable no-restricted-properties */

const dv = new DataView(new ArrayBuffer(8));

// Mapea un double a un entero monótono: la distancia entre dos enteros es el número de ulps.
function ordenado(x: number): bigint {
  dv.setFloat64(0, x);
  const bits = dv.getBigInt64(0);
  return bits < 0n ? -(bits & 0x7fffffffffffffffn) : bits;
}

function ulps(a: number, b: number): bigint {
  const d = ordenado(a) - ordenado(b);
  return d < 0n ? -d : d;
}

// Generador congruencial lineal fijo (Numerical Recipes), sin Math.random.
function generadorLcg(semilla: number): () => number {
  let estado = semilla >>> 0;
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

// Double positivo finito con exponente y mantisa aleatorios (cubre todo el rango normal).
function positivoAleatorio(siguiente: () => number): number {
  const exponente = 1 + Math.floor(siguiente() * 2046); // 1..2046: sin subnormales ni inf
  dv.setUint32(0, ((exponente << 20) | Math.floor(siguiente() * 0x100000)) >>> 0);
  dv.setUint32(4, Math.floor(siguiente() * 4294967296) >>> 0);
  return dv.getFloat64(0);
}

const N = 10_000;

describe("detmath: expDet", () => {
  it("valores conocidos y casos especiales", () => {
    expect(expDet(0)).toBe(1);
    expect(expDet(-0)).toBe(1);
    expect(expDet(NaN)).toBeNaN();
    expect(expDet(Infinity)).toBe(Infinity);
    expect(expDet(-Infinity)).toBe(0);
    expect(expDet(709.8)).toBe(Infinity); // desbordamiento
    expect(expDet(-746)).toBe(0); // subdesbordamiento
    expect(ulps(expDet(1), 2.718281828459045)).toBeLessThanOrEqual(1n);
  });

  it("error <= 1 ulp frente a Math.exp en 10.000 entradas", () => {
    const siguiente = generadorLcg(1);
    let maximo = 0n;
    for (let i = 0; i < N; i++) {
      const x = -745 + siguiente() * 1455;
      maximo = maxBig(maximo, ulps(expDet(x), refExp(x)));
    }
    expect(maximo).toBeLessThanOrEqual(1n);
  });
});

describe("detmath: logDet", () => {
  it("valores conocidos y casos especiales", () => {
    expect(logDet(1)).toBe(0);
    expect(logDet(0)).toBe(-Infinity);
    expect(logDet(-0)).toBe(-Infinity);
    expect(logDet(-1)).toBeNaN();
    expect(logDet(-Infinity)).toBeNaN();
    expect(logDet(NaN)).toBeNaN();
    expect(logDet(Infinity)).toBe(Infinity);
    expect(logDet(5e-324)).toBeCloseTo(-744.4400719213812, 9); // subnormal mínimo
    expect(ulps(logDet(10), 2.302585092994046)).toBeLessThanOrEqual(1n);
  });

  it("error <= 1 ulp frente a Math.log en 10.000 entradas", () => {
    const siguiente = generadorLcg(2);
    let maximo = 0n;
    for (let i = 0; i < N; i++) {
      const x = positivoAleatorio(siguiente);
      maximo = maxBig(maximo, ulps(logDet(x), refLog(x)));
    }
    expect(maximo).toBeLessThanOrEqual(1n);
  });
});

describe("detmath: powIntDet y powDet", () => {
  it("potencias enteras exactas y casos especiales", () => {
    expect(powIntDet(2, 10)).toBe(1024);
    expect(powIntDet(3, 4)).toBe(81);
    expect(powIntDet(2, -2)).toBe(0.25);
    expect(powIntDet(2, 0)).toBe(1);
    expect(powIntDet(-2, 3)).toBe(-8);
    expect(powIntDet(2, 0.5)).toBeNaN();
    expect(powDet(0, -1)).toBe(Infinity);
    expect(powDet(-0, -1)).toBe(-Infinity);
    expect(powDet(-8, 1 / 3)).toBeNaN();
    expect(powDet(NaN, 0)).toBe(1);
    expect(powDet(1, NaN)).toBeNaN();
    expect(powDet(1, Infinity)).toBeNaN();
    expect(powDet(0, 0.5)).toBe(0);
    expect(powDet(4, 0.5)).toBe(2);
    expect(powDet(Infinity, 2.5)).toBe(Infinity);
    expect(powDet(-Infinity, 0.5)).toBe(Infinity);
  });

  it("powIntDet <= 5 ulp frente a Math.pow con exponente entero 2..8", () => {
    // Acumula error de redondeo en cada multiplicación; medido: máximo 5 ulp. No cumple 1 ulp.
    const siguiente = generadorLcg(3);
    let maximo = 0n;
    for (let i = 0; i < N; i++) {
      const b = siguiente() * 10;
      const n = 2 + Math.floor(siguiente() * 7);
      maximo = maxBig(maximo, ulps(powIntDet(b, n), refPow(b, n)));
    }
    expect(maximo).toBeLessThanOrEqual(5n);
  });

  it("powDet: exponente real, error relativo <= 1e-13 y <= 2 ulp cuando |e·ln b| < 1", () => {
    // El error de exp(e·log b) crece con |e·log b| (propagación del error de la entrada).
    // Medido: 1 ulp en |y| < 1, 7 en 1 <= |y| < 5 y 32 en |y| >= 5. No cumple 1 ulp en general.
    const siguiente = generadorLcg(4);
    let relativoMaximo = 0;
    let ulpsPequenos = 0n;
    for (let i = 0; i < N; i++) {
      const b = siguiente() * 10;
      const e = -10 + siguiente() * 20;
      if (e === Math.trunc(e)) continue; // los enteros van por powIntDet
      const esperado = refPow(b, e);
      const obtenido = powDet(b, e);
      relativoMaximo = Math.max(relativoMaximo, Math.abs(obtenido - esperado) / esperado);
      if (Math.abs(e * refLog(b)) < 1) {
        ulpsPequenos = maxBig(ulpsPequenos, ulps(obtenido, esperado));
      }
    }
    expect(relativoMaximo).toBeLessThanOrEqual(1e-13);
    expect(ulpsPequenos).toBeLessThanOrEqual(2n);
  });
});

describe("detmath: huella de resultados", () => {
  it("la suma de los bits de 1.000 resultados no cambia", () => {
    const siguiente = generadorLcg(42);
    const MASCARA_64 = (1n << 64n) - 1n;
    let huella = 0n;
    for (let i = 0; i < 1000; i++) {
      let resultado: number;
      if (i % 3 === 0) {
        resultado = expDet(-20 + siguiente() * 40);
      } else if (i % 3 === 1) {
        resultado = logDet(positivoAleatorio(siguiente));
      } else {
        resultado = powDet(siguiente() * 10, -5 + siguiente() * 10);
      }
      dv.setFloat64(0, resultado);
      huella = (huella + dv.getBigUint64(0)) & MASCARA_64;
    }
    expect(huella.toString(16)).toBe("6f8313a5e0797953");
  });
});

function maxBig(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}
