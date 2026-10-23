// Generador aleatorio del núcleo: PCG32 (XSH RR, estado de 64 bits), especificación 4.1.
//
// Aritmética de 64 bits con BigInt. No usa Math.random, Math.pow, Math.exp ni Math.log: la
// exponencial de Poisson sale de expDet (core/detmath). Cada subsistema usa su propio flujo k,
// con initstate = semilla de la partida e initseq = k (decisión 38).

import { expDet } from "./detmath";

const MASCARA_64 = (1n << 64n) - 1n;
const MULTIPLICADOR = 6364136223846793005n;
const DOS_A_32 = 4294967296; // 2^32

/** Estado del generador como cadenas decimales (BigInt no se serializa en JSON). */
export interface EstadoRng {
  readonly state: string;
  readonly inc: string;
}

export interface Rng {
  /** Siguiente salida de 32 bits, entero en [0, 2^32). */
  siguienteU32(): number;
  /** Uniforme en [0, 1): entero de 32 bits / 2^32. */
  u(): number;
  /** Entero uniforme en [min, max] sin sesgo (rechazo de pcg32_boundedrand_r). */
  entero(min: number, max: number): number;
  /** Poisson de media lambda por el método de Knuth, con el mismo flujo. */
  poisson(lambda: number): number;
  /** Estado actual, para guardarlo dentro de la partida. */
  estado(): EstadoRng;
  /** Vuelve a un estado previamente devuelto por estado(). */
  restaurar(estado: EstadoRng): void;
}

// Rotación a derecha de 32 bits; r es el entero de 5 bits de pcg32_random_r.
function rotr32(x: number, r: number): number {
  return ((x >>> r) | (x << ((32 - r) & 31))) >>> 0;
}

// Función de salida XSH RR aplicada al estado anterior a la transición.
function salida(antiguo: bigint): number {
  const xorshifted = Number((((antiguo >> 18n) ^ antiguo) >> 27n) & 0xffffffffn);
  const rot = Number(antiguo >> 59n);
  return rotr32(xorshifted, rot);
}

/**
 * Crea un flujo PCG32 con la semilla de la partida y el índice de flujo k
 * (pcg32_srandom_r(initstate = semilla, initseq = k)).
 */
export function crearRng(semilla: bigint, k: number): Rng {
  if (!Number.isSafeInteger(k) || k < 0) {
    throw new RangeError(`Índice de flujo no válido: ${String(k)}`);
  }

  let state = 0n;
  let inc = ((BigInt(k) << 1n) | 1n) & MASCARA_64;

  // Inicialización de pcg32_srandom_r: primer paso, suma de la semilla y segundo paso.
  state = (state * MULTIPLICADOR + inc) & MASCARA_64;
  state = (state + BigInt.asUintN(64, semilla)) & MASCARA_64;
  state = (state * MULTIPLICADOR + inc) & MASCARA_64;

  function siguienteU32(): number {
    const antiguo = state;
    state = (state * MULTIPLICADOR + inc) & MASCARA_64;
    return salida(antiguo);
  }

  function u(): number {
    return siguienteU32() / DOS_A_32;
  }

  function entero(min: number, max: number): number {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max < min) {
      throw new RangeError(`Rango de entero no válido: [${String(min)}, ${String(max)}]`);
    }
    const rango = max - min + 1;
    if (rango > DOS_A_32) {
      throw new RangeError(`Rango de entero demasiado grande: ${String(rango)}`);
    }
    // pcg32_boundedrand_r: se descartan las salidas por debajo de 2^32 mod rango.
    const umbral = (DOS_A_32 - rango) % rango;
    let r: number;
    do {
      r = siguienteU32();
    } while (r < umbral);
    return min + (r % rango);
  }

  function poisson(lambda: number): number {
    if (!Number.isFinite(lambda) || lambda < 0) {
      throw new RangeError(`Media de Poisson no válida: ${String(lambda)}`);
    }
    // Knuth: multiplicar uniformes hasta que el producto baje de e^-lambda.
    const limite = expDet(-lambda);
    let n = 0;
    let p = 1;
    do {
      n += 1;
      p *= u();
    } while (p > limite);
    return n - 1;
  }

  function estado(): EstadoRng {
    return { state: state.toString(), inc: inc.toString() };
  }

  function restaurar(nuevo: EstadoRng): void {
    const s = BigInt(nuevo.state);
    const i = BigInt(nuevo.inc);
    if (s < 0n || s > MASCARA_64 || i < 0n || i > MASCARA_64 || (i & 1n) === 0n) {
      throw new RangeError("Estado de RNG no válido");
    }
    state = s;
    inc = i;
  }

  return { siguienteU32, u, entero, poisson, estado, restaurar };
}

/**
 * UUID v4 derivado del flujo: 4 salidas de 32 bits, con los bits de versión (4) y de
 * variante (10xx) fijados según RFC 9562. Regla DET-1 (docs/preguntas.md).
 */
export function uuidDesdeRng(rng: Rng): string {
  const hex = Array.from({ length: 4 }, () =>
    rng.siguienteU32().toString(16).padStart(8, "0"),
  ).join("");
  // Posición 12: versión 4. Posición 16: variante, uno de 8, 9, a, b.
  const variante = ((Number.parseInt(hex.charAt(16), 16) & 0x3) | 0x8).toString(16);
  const h = `${hex.slice(0, 12)}4${hex.slice(13, 16)}${variante}${hex.slice(17)}`;
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
