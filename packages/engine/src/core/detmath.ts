// Matemáticas deterministas del núcleo (sección 3.1, punto 6, y 4.1 de la especificación).
//
// Math.pow, Math.exp y Math.log pueden dar resultados distintos según el motor (V8 frente a
// JavaScriptCore). Aquí se reimplementan exp y log a partir de fdlibm (Sun Microsystems, código
// libre; ficheros e_exp.c y e_log.c), que usa solo suma, resta, multiplicación, división y
// manipulación de bits IEEE 754, todas exactas por norma. Las constantes son las de fdlibm;
// cada una lleva al lado su patrón hexadecimal de la fuente original, y el test unitario
// comprueba que coinciden. No se usa Math.exp, Math.log ni Math.pow.

// Lectura y escritura de las palabras alta y baja de un double mediante DataView (big-endian
// por defecto, así que la palabra alta es siempre la de los bytes 0 a 3).
const vista = new DataView(new ArrayBuffer(8));

function palabraAlta(x: number): number {
  vista.setFloat64(0, x);
  return vista.getUint32(0);
}

function conPalabraAlta(x: number, alta: number): number {
  vista.setFloat64(0, x);
  vista.setUint32(0, alta >>> 0);
  return vista.getFloat64(0);
}

function desdePalabras(alta: number, baja: number): number {
  vista.setUint32(0, alta >>> 0);
  vista.setUint32(4, baja >>> 0);
  return vista.getFloat64(0);
}

// --- Constantes de fdlibm e_exp.c ---------------------------------------------------------------

const O_THRESHOLD = 7.09782712893383973096e2; // 0x40862E42 FEFA39EF, ln(DBL_MAX)
const U_THRESHOLD = -7.4513321910194110842e2; // 0xC0874910 D52D3051, underflow a 0
const LN2_HI = 6.9314718036912381649e-1; // 0x3FE62E42 FEE00000, ln 2 alta (bits bajos a cero)
const LN2_LO = 1.9082149292705877e-10; // 0x3DEA39EF 35793C76, ln 2 baja (resto)
const INV_LN2 = 1.442695040888963387; // 0x3FF71547 652B82FE, 1/ln 2
// Polinomio minimax en r² de fdlibm (coeficientes P1..P5).
const P1 = 1.66666666666666019037e-1; // 0x3FC55555 5555553E
const P2 = -2.77777777770155933842e-3; // 0xBF66C16C 16BEBD93
const P3 = 6.61375632143793436117e-5; // 0x3F11566A AF25DE2C
const P4 = -1.6533902205465251539e-6; // 0xBEBBBD41 C5D26BF1
const P5 = 4.13813679705723846039e-8; // 0x3E663769 72BEA4D0
// 2^-1000, escalado de resultados subnormales (fdlibm: twom1000 = 0x01700000,0).
const TWOM1000 = desdePalabras(0x01700000, 0);

// --- Constantes de fdlibm e_log.c ---------------------------------------------------------------

const LN2_HI_LOG = 6.9314718036912381649e-1; // 0x3FE62E42 FEE00000
const LN2_LO_LOG = 1.90821492927058770002e-10; // 0x3DEA39EF 35793C76
// 2^54, para escalar subnormales en log (fdlibm: two54 = 0x43500000,0).
const TWO54 = desdePalabras(0x43500000, 0);
// Coeficientes de la aproximación de log(1+f) por series de s = f/(2+f) (fdlibm Lg1..Lg7).
const LG1 = 6.66666666666673513e-1; // 0x3FE55555 55555593
const LG2 = 3.999999999940941908e-1; // 0x3FD99999 9997FA04
const LG3 = 2.857142874366239149e-1; // 0x3FD24924 94229359
const LG4 = 2.222219843214978396e-1; // 0x3FCC71C5 1D8E78AF
const LG5 = 1.818357216161805012e-1; // 0x3FC74664 96CB03DE
const LG6 = 1.531383769920937332e-1; // 0x3FC39A09 D078C69F
const LG7 = 1.479819860511658591e-1; // 0x3FC2F112 DF3E5244

const UN_TERCIO = 0.33333333333333333; // 0x3FD55555 55555555

/**
 * e^x, algoritmo e_exp.c de fdlibm: reducción x = k·ln2 + r con |r| ≤ ln2/2 y polinomio
 * de Padé-minimax en r; el resultado se escala sumando k al exponente del double.
 */
export function expDet(x: number): number {
  if (Number.isNaN(x)) return NaN;
  const alta = palabraAlta(x);
  const signo = alta >>> 31; // 1 si x es negativo
  const absAlta = alta & 0x7fffffff;

  if (absAlta >= 0x40862e42) {
    if (absAlta >= 0x7ff00000) {
      // Infinito: exp(+inf) = inf, exp(-inf) = 0.
      return x > 0 ? Infinity : 0;
    }
    if (x > O_THRESHOLD) return Infinity; // desbordamiento
    if (x < U_THRESHOLD) return 0; // subdesbordamiento
  }

  let k = 0;
  let hi = 0;
  let lo = 0;
  let r = x;
  if (absAlta > 0x3fd62e42) {
    // |x| > 0.5·ln2: reducción de argumento.
    if (absAlta < 0x3ff0a2b2) {
      // 0.5·ln2 < |x| < 1.5·ln2: k = ±1 sin multiplicación.
      hi = signo === 0 ? x - LN2_HI : x + LN2_HI;
      lo = signo === 0 ? LN2_LO : -LN2_LO;
      k = 1 - signo - signo;
    } else {
      const medio = signo === 0 ? 0.5 : -0.5;
      k = Math.trunc(INV_LN2 * x + medio);
      const t = k;
      hi = x - t * LN2_HI; // t·LN2_HI es exacto aquí (fdlibm)
      lo = t * LN2_LO;
    }
    r = hi - lo;
  } else if (absAlta < 0x3e300000) {
    // |x| < 2^-28: exp(x) redondea a 1 + x.
    return 1 + x;
  }

  // Polinomio en r: c = r − r²·(P1 + r²·(P2 + … )).
  const t2 = r * r;
  const c = r - t2 * (P1 + t2 * (P2 + t2 * (P3 + t2 * (P4 + t2 * P5))));

  if (k === 0) {
    return 1 - ((r * c) / (c - 2) - r);
  }
  const y = 1 - (lo - (r * c) / (2 - c) - hi);
  if (k >= -1021) {
    // Sumar k al exponente: la palabra alta gana k·2^20.
    return conPalabraAlta(y, palabraAlta(y) + k * 0x100000);
  }
  // Resultado subnormal: escalar en dos pasos para no perder bits antes de tiempo.
  return conPalabraAlta(y, palabraAlta(y) + (k + 1000) * 0x100000) * TWOM1000;
}

/**
 * ln x, algoritmo e_log.c de fdlibm: x = 2^k·(1+f) con √2/2 ≤ 1+f < √2, y log(1+f) por una
 * serie en s = f/(2+f) con los coeficientes Lg1..Lg7.
 * Devuelve NaN para x < 0, −inf para ±0, e inf para +inf.
 */
export function logDet(x: number): number {
  if (x === 0) return -Infinity;
  if (x < 0 || Number.isNaN(x)) return NaN;
  if (x === Infinity) return Infinity;

  let k = 0;
  let w = x;
  let alta = palabraAlta(w);
  if (alta < 0x00100000) {
    // Subnormal: escalar x por 2^54 antes de extraer el exponente.
    k -= 54;
    w = w * TWO54;
    alta = palabraAlta(w);
  }
  k += (alta >>> 20) - 1023;
  alta &= 0x000fffff;
  // Elegir 1 o 2 como mantisa normalizada, para que 1+f esté en [√2/2, √2).
  const i0 = (alta + 0x95f64) & 0x100000;
  w = conPalabraAlta(w, alta | (i0 ^ 0x3ff00000));
  k += i0 >>> 20;
  const f = w - 1;

  if ((0x000fffff & (2 + alta)) < 3) {
    // |f| < 2^-20: serie corta.
    if (f === 0) {
      if (k === 0) return 0;
      const dk = k;
      return dk * LN2_HI_LOG + dk * LN2_LO_LOG;
    }
    const r = f * f * (0.5 - UN_TERCIO * f);
    if (k === 0) return f - r;
    const dk = k;
    return dk * LN2_HI_LOG - (r - dk * LN2_LO_LOG - f);
  }

  const s = f / (2 + f);
  const dk = k;
  const z = s * s;
  let i = alta - 0x6147a;
  const w2 = z * z;
  const j = 0x6b851 - alta;
  const t1 = w2 * (LG2 + w2 * (LG4 + w2 * LG6));
  const t2 = z * (LG1 + w2 * (LG3 + w2 * (LG5 + w2 * LG7)));
  i |= j;
  const r = t2 + t1;
  if (i > 0) {
    const hfsq = 0.5 * f * f;
    if (k === 0) return f - (hfsq - s * (hfsq + r));
    return dk * LN2_HI_LOG - (hfsq - (s * (hfsq + r) + dk * LN2_LO_LOG) - f);
  }
  if (k === 0) return f - s * (f - r);
  return dk * LN2_HI_LOG - (s * (f - r) - dk * LN2_LO_LOG - f);
}

/**
 * b^n para n entero, por exponenciación por cuadrados (sin logaritmos).
 * Devuelve NaN si n no es entero. Para n < 0 calcula 1 / b^|n|.
 */
export function powIntDet(b: number, n: number): number {
  if (!Number.isInteger(n)) return NaN;
  let base = b;
  let resto = Math.abs(n);
  let acumulado = 1;
  while (resto > 0) {
    if (resto % 2 === 1) acumulado *= base;
    resto = Math.floor(resto / 2);
    base *= base;
  }
  return n < 0 ? 1 / acumulado : acumulado;
}

/**
 * b^e siguiendo la semántica de Math.pow de ECMAScript (casos especiales incluidos).
 * Para e entero usa powIntDet. Para e real, exp(e·ln b): el error relativo crece con |e·ln b|,
 * así que es ~1e-13 para exponentes de uso (no alcanza 1 ulp en general; ver el test).
 */
export function powDet(b: number, e: number): number {
  if (Number.isNaN(e)) return NaN;
  if (e === 0) return 1;
  if (Number.isNaN(b)) return NaN;
  if (Math.abs(b) === 1 && !Number.isFinite(e)) return NaN; // regla de JS, no de C
  if (Number.isInteger(e)) return powIntDet(b, e);

  // A partir de aquí e es real no entero o ±infinito.
  if (b < 0 && Number.isFinite(b)) return NaN; // base negativa con exponente no entero
  const a = Math.abs(b);
  if (a === 0) return e > 0 ? 0 : Infinity;
  if (a === Infinity) return e > 0 ? Infinity : 0;
  return expDet(e * logDet(a));
}
