// Redondeo y reparto de importes en céntimos enteros (especificación 4.1, regla de oro 2).
//
// Reglas de 4.1 que implementa este módulo:
// - Importes: a céntimo entero, "mitades hacia arriba en valor absoluto", es decir, las mitades
//   se redondean alejándose de cero (2,5 → 3 y −2,5 → −3).
// - Repartos que deben sumar un total exacto (pools 6.9, bolsas 6.6.3): método del mayor resto
//   sobre céntimos, con desempate determinista por índice (menor índice primero).
// - Series de tramos (10, 12 o N cuotas): todas las cuotas iguales redondeadas a céntimo y la
//   última absorbe la diferencia.
//
// La aritmética de reparto y de cuotas se hace en BigInt para que el resultado sea exacto y no
// dependa de errores de coma flotante. Solo se usan suma, resta, multiplicación, división,
// comparación y `Math.floor`/`Math.abs`, que son deterministas.

import type { Cent } from "@af4/contracts";

const DOBLE_MANTISA_BITS = 52n;
const DOBLE_EXPONENTE_SESGO = 1075;
const DOBLE_MASCARA_FRACCION = (1n << DOBLE_MANTISA_BITS) - 1n;
const DOBLE_BIT_IMPLICITO = 1n << DOBLE_MANTISA_BITS;

const vista = new DataView(new ArrayBuffer(8));

function comprobarFinito(x: number, nombre: string): void {
  if (!Number.isFinite(x)) {
    throw new RangeError(`${nombre} debe ser un número finito: ${String(x)}`);
  }
}

function comprobarEntero(x: number, nombre: string): void {
  if (!Number.isSafeInteger(x)) {
    throw new RangeError(`${nombre} debe ser un entero seguro: ${String(x)}`);
  }
}

/** Devuelve el entero `x` como Cent, normalizando -0 a 0. */
function comoCent(x: number): Cent {
  return (x === 0 ? 0 : x) as Cent;
}

/**
 * Redondea un importe en coma flotante a céntimo entero, con mitades hacia arriba en valor
 * absoluto (4.1, fila «Redondeo»): 2,5 → 3 y −2,5 → −3; −0,4 → 0.
 */
export function redondearCent(x: number): Cent {
  comprobarFinito(x, "x");
  const a = Math.abs(x);
  const parteEntera = Math.floor(a);
  // a − floor(a) es exacto en coma flotante para a ≥ 0, así que la comparación con 0,5 también lo es.
  const redondeado = parteEntera + (a - parteEntera >= 0.5 ? 1 : 0);
  return comoCent(x < 0 ? -redondeado : redondeado);
}

/** Suma de importes en céntimos. Lanza si el resultado no es un entero seguro. */
export function sumarCent(importes: readonly Cent[]): Cent {
  let total = 0;
  for (const importe of importes) {
    comprobarEntero(importe, "importe");
    total += importe;
    comprobarEntero(total, "suma");
  }
  return comoCent(total);
}

/**
 * Multiplica un importe por un factor decimal y redondea a céntimo (4.1). El producto se hace en
 * coma flotante de doble precisión y solo se redondea al final, como indica la tabla de 4.1.
 */
export function multiplicarCent(importe: Cent, factor: number): Cent {
  comprobarEntero(importe, "importe");
  comprobarFinito(factor, "factor");
  return redondearCent(importe * factor);
}

/** Cociente a + b/2 hacia arriba en valor absoluto, exacto con BigInt. b > 0. */
function divisionRedondeada(a: bigint, b: bigint): bigint {
  const magnitud = a < 0n ? -a : a;
  const cociente = magnitud / b;
  const resto = magnitud % b;
  const redondeado = 2n * resto >= b ? cociente + 1n : cociente;
  return a < 0n ? -redondeado : redondeado;
}

/**
 * Descompone un double finito y no negativo en m · 2^e con m y e enteros (BigInt y número).
 * Un double es un racional diádico, así que la descomposición es exacta.
 */
function descomponer(p: number): { m: bigint; e: number } {
  vista.setFloat64(0, p);
  const bits = vista.getBigUint64(0);
  const exponente = Number((bits >> DOBLE_MANTISA_BITS) & 0x7ffn);
  const fraccion = bits & DOBLE_MASCARA_FRACCION;
  if (exponente === 0) {
    return { m: fraccion, e: 1 - DOBLE_EXPONENTE_SESGO };
  }
  return { m: fraccion | DOBLE_BIT_IMPLICITO, e: exponente - DOBLE_EXPONENTE_SESGO };
}

/** Pesos no negativos como enteros BigInt proporcionales (mismo cociente entre ellos, exacto). */
function pesosComoEnteros(pesos: readonly number[]): bigint[] {
  const partes = pesos.map(descomponer);
  const exponenteMinimo = Math.min(...partes.map((parte) => parte.e));
  return partes.map((parte) => parte.m << BigInt(parte.e - exponenteMinimo));
}

/**
 * Reparte `total` (céntimos enteros) en partes proporcionales a `pesos` por el método del mayor
 * resto (4.1). La suma de las partes es exactamente `total`. Cada parte es la cuota exacta
 * redondeada hacia abajo más, para los `total − Σ suelos` céntimos restantes, un céntimo extra
 * en las partes con mayor resto. Empates de resto: gana el menor índice.
 *
 * Un total negativo reparte su valor absoluto y niega cada parte. Un peso igual a 0 nunca recibe
 * céntimos extra.
 */
export function repartirMayorResto(total: Cent, pesos: number[]): Cent[] {
  comprobarEntero(total, "total");
  if (pesos.length === 0) {
    throw new RangeError("pesos no puede estar vacío");
  }
  for (const peso of pesos) {
    if (!Number.isFinite(peso) || peso < 0) {
      throw new RangeError(`peso no válido (debe ser finito y ≥ 0): ${String(peso)}`);
    }
  }

  const enteros = pesosComoEnteros(pesos);
  const sumaPesos = enteros.reduce((acc, peso) => acc + peso, 0n);
  if (sumaPesos === 0n) {
    throw new RangeError("al menos un peso debe ser mayor que 0");
  }

  const magnitud = BigInt(Math.abs(total));
  const signo = total < 0 ? -1n : 1n;
  const suelos = enteros.map((peso) => (magnitud * peso) / sumaPesos);
  const restos = enteros.map((peso) => (magnitud * peso) % sumaPesos);

  const sobrante = magnitud - suelos.reduce((acc, suelo) => acc + suelo, 0n);
  const indicesPorResto = pesos
    .map((_, indice) => indice)
    .sort((a, b) => {
      const ra = restos[a] ?? 0n;
      const rb = restos[b] ?? 0n;
      if (ra !== rb) return ra > rb ? -1 : 1;
      return a - b;
    });

  const partes = [...suelos];
  for (let k = 0n; k < sobrante; k++) {
    const indice = indicesPorResto[Number(k)];
    if (indice === undefined) {
      throw new Error("invariante roto: sobrante mayor que el número de partes");
    }
    partes[indice] = (partes[indice] ?? 0n) + 1n;
  }

  return partes.map((parte) => comoCent(Number(parte * signo)));
}

/**
 * Serie de `n` cuotas de un total en céntimos (4.1, fila «Redondeo»): todas las cuotas iguales
 * redondeadas a céntimo (mitades hacia arriba en valor absoluto) y la última absorbe la diferencia.
 * Ejemplo de 4.1 y 23.3: 63.280.968,75 € en 2 cuotas → 31.640.484,38 € y 31.640.484,37 €.
 */
export function cuotas(total: Cent, n: number): Cent[] {
  comprobarEntero(total, "total");
  comprobarEntero(n, "n");
  if (n < 1) {
    throw new RangeError(`n debe ser al menos 1: ${String(n)}`);
  }

  const base = divisionRedondeada(BigInt(total), BigInt(n));
  const serie: Cent[] = [];
  for (let k = 0; k < n - 1; k++) {
    serie.push(comoCent(Number(base)));
  }
  const ultima = BigInt(total) - base * BigInt(n - 1);
  serie.push(comoCent(Number(ultima)));
  return serie;
}
