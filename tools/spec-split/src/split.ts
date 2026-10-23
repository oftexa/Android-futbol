// Troceado de docs/spec/especificacion.md en módulos (sección 13.5 de la arquitectura).
// Lógica pura: no toca el disco. La entrada/salida está en cli.ts.
// Solo usa expresiones regulares; no hay dependencias.

/** Id del módulo que recibe las secciones comunes (preámbulo, glosario, decisiones, fuentes, criterios). */
export const MODULO_COMUN = "comun";

/** Sección con la tabla de decisiones de producto (0.3). */
const SECCION_DECISIONES = "0.3";
/** Sección del glosario (2). */
const SECCION_GLOSARIO = "2";
/** Bloques de criterios de aceptación (23.x). */
const PREFIJO_CRITERIOS = "23.";

/** Mapa de secciones a módulos (docs/spec/mapa-secciones.json). */
export interface Mapa {
  /** Id de módulo (p. ej. "01-modelo-datos") -> título. */
  modulos: Record<string, string>;
  /** Clave de sección de primer o segundo nivel (p. ej. "4.1") -> id de módulo. */
  secciones: Record<string, string>;
}

export interface Seccion {
  /** Clave numérica del encabezado, p. ej. "5", "5.1" o "23.3". */
  clave: string;
  nivel: 2 | 3;
  /** Encabezado completo, sin el prefijo de almohadillas, p. ej. "Simulación ... [D]". */
  titulo: string;
  /** Líneas literales de la sección, encabezado incluido, hasta el siguiente ## o ###. */
  lineas: string[];
}

export interface Especificacion {
  version: string;
  /** Líneas anteriores a la primera sección (título, tabla de estado). */
  preambulo: string[];
  secciones: Seccion[];
}

// Encabezados de primer y segundo nivel con número de sección: "## 4. X" o "### 4.1 X".
const RE_SECCION = /^(#{2,3}) (\d+(?:\.\d+)*)\.?(?=\s|$)(.*)$/;
const RE_FENCE = /^\s*(```|~~~)/;
// Referencias numéricas a secciones ("4.4", "5.1.1"), sin ser parte de otra cifra ni de "v0.9" o "A-02".
const RE_REF = /(?<![\w.,-])\d{1,2}(?:\.\d{1,2})*(?!\w|[.,]\d)/g;
const RE_CRITERIO = /^- \[ \] (.+)$/;
const LONGITUD_RESUMEN = 140;

/** Divide el Markdown en preámbulo y secciones de primer y segundo nivel. Respeta los bloques de código. */
export function parsearEspecificacion(md: string): Especificacion {
  const preambulo: string[] = [];
  const secciones: Seccion[] = [];
  let actual: Seccion | null = null;
  let enCodigo = false;

  for (const linea of md.split("\n")) {
    if (RE_FENCE.test(linea)) {
      enCodigo = !enCodigo;
    }
    if (!enCodigo) {
      const m = RE_SECCION.exec(linea);
      if (m) {
        const nivel = m[1]?.length === 2 ? 2 : 3;
        actual = {
          clave: m[2] ?? "",
          nivel,
          titulo: (m[3] ?? "").trim(),
          lineas: [linea],
        };
        secciones.push(actual);
        continue;
      }
      if (/^#{2,3} /.test(linea)) {
        throw new Error(`Encabezado de sección sin número: "${linea}"`);
      }
    }
    if (actual === null) {
      preambulo.push(linea);
    } else {
      actual.lineas.push(linea);
    }
  }

  const version = /versión (\d+\.\d+)/.exec(preambulo.join("\n"))?.[1];
  if (version === undefined) {
    throw new Error("No se encuentra 'versión X.Y' en el preámbulo de la especificación.");
  }
  return { version, preambulo, secciones };
}

/** Comprueba que el mapa cubre exactamente las secciones de la especificación. Lanza un error con todos los fallos. */
export function validarMapa(claves: readonly string[], mapa: Mapa): void {
  const errores: string[] = [];
  const existentes = new Set(claves);

  for (const clave of claves) {
    if (!Object.hasOwn(mapa.secciones, clave)) {
      errores.push(`sección sin asignar a ningún módulo: ${clave}`);
    }
  }
  for (const [clave, modulo] of Object.entries(mapa.secciones)) {
    if (!existentes.has(clave)) {
      errores.push(`clave del mapa que no existe en la especificación: ${clave}`);
    }
    if (!Object.hasOwn(mapa.modulos, modulo)) {
      errores.push(`sección ${clave} asignada a un módulo no declarado: ${modulo}`);
    }
  }
  if (errores.length > 0) {
    throw new Error(`mapa-secciones.json no es válido:\n- ${errores.join("\n- ")}`);
  }
}

/** Valida la forma del JSON del mapa. */
export function leerMapa(json: string): Mapa {
  const crudo: unknown = JSON.parse(json);
  if (!esObjeto(crudo) || !esMapaDeTextos(crudo.modulos) || !esMapaDeTextos(crudo.secciones)) {
    throw new Error(
      'mapa-secciones.json debe tener la forma {"modulos": {...}, "secciones": {...}} con valores de texto',
    );
  }
  return { modulos: crudo.modulos, secciones: crudo.secciones };
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function esMapaDeTextos(valor: unknown): valor is Record<string, string> {
  return esObjeto(valor) && Object.values(valor).every((v) => typeof v === "string");
}

/** Genera todos los archivos de salida (relativos a docs/spec): modulos/*.md y criterios.md. */
export function generarArchivos(md: string, mapa: Mapa): Map<string, string> {
  const esp = parsearEspecificacion(md);
  validarMapa(
    esp.secciones.map((s) => s.clave),
    mapa,
  );

  const archivos = new Map<string, string>();
  for (const modulo of Object.keys(mapa.modulos)) {
    archivos.set(`modulos/${modulo}.md`, generarModulo(esp, mapa, modulo));
  }
  archivos.set("criterios.md", generarCriterios(esp, mapa));
  return archivos;
}

/** Compara lo generado con lo que hay en disco. Devuelve los problemas (vacío si está al día). */
export function compararSalida(
  esperado: ReadonlyMap<string, string>,
  actual: ReadonlyMap<string, string>,
): string[] {
  const problemas: string[] = [];
  for (const [ruta, contenido] of esperado) {
    const real = actual.get(ruta);
    if (real === undefined) {
      problemas.push(`falta ${ruta}`);
    } else if (real !== contenido) {
      problemas.push(`difiere ${ruta} (editado a mano o especificación cambiada sin regenerar)`);
    }
  }
  for (const ruta of actual.keys()) {
    if (!esperado.has(ruta)) {
      problemas.push(`sobra ${ruta} (no lo genera el script)`);
    }
  }
  return problemas;
}

function generarModulo(esp: Especificacion, mapa: Mapa, modulo: string): string {
  const propias = esp.secciones.filter((s) => mapa.secciones[s.clave] === modulo);
  const bloques: string[] = [
    `# ${mapa.modulos[modulo] ?? modulo}`,
    [
      `Generado desde especificacion.md v${esp.version} — no editar. Regenerar con \`pnpm spec:split\` tras cambiar la especificación.`,
      `Secciones de este módulo: ${propias.map((s) => s.clave).join(", ") || "(ninguna)"}.`,
    ].join("\n\n"),
  ];

  for (const s of propias) {
    bloques.push(textoLiteral(s.lineas));
  }

  if (modulo !== MODULO_COMUN) {
    const decisiones = decisionesRelacionadas(esp, mapa, modulo);
    if (decisiones !== null) {
      bloques.push(decisiones);
    }
    const glosario = glosarioRelacionado(esp, mapa, modulo);
    if (glosario !== null) {
      bloques.push(glosario);
    }
  }

  return bloques.join("\n\n") + "\n";
}

/** Filas de la tabla 0.3 cuya columna "Dónde se aplica" cita alguna sección de este módulo. */
function decisionesRelacionadas(esp: Especificacion, mapa: Mapa, modulo: string): string | null {
  const seccion = esp.secciones.find((s) => s.clave === SECCION_DECISIONES);
  if (seccion === undefined) {
    throw new Error(`Falta la sección ${SECCION_DECISIONES} (decisiones de producto).`);
  }
  const { cabecera, filas } = tablaMarkdown(seccion.lineas);
  const relacionadas = filas.filter((fila) => {
    const celdas = celdasDe(fila);
    return modulosDeTexto(celdas[2] ?? "", mapa).includes(modulo);
  });
  if (relacionadas.length === 0) {
    return null;
  }
  return [
    "## Decisiones de producto que afectan a este módulo (tabla 0.3)",
    [...cabecera, ...relacionadas].join("\n"),
  ].join("\n\n");
}

/** Entradas del glosario cuya definición cita alguna sección de este módulo. */
function glosarioRelacionado(esp: Especificacion, mapa: Mapa, modulo: string): string | null {
  const seccion = esp.secciones.find((s) => s.clave === SECCION_GLOSARIO);
  if (seccion === undefined) {
    throw new Error(`Falta la sección ${SECCION_GLOSARIO} (glosario).`);
  }
  const { cabecera, filas } = tablaMarkdown(seccion.lineas);
  const relacionadas = filas.filter((fila) => {
    const celdas = celdasDe(fila);
    return modulosDeTexto(celdas[1] ?? "", mapa).includes(modulo);
  });
  if (relacionadas.length === 0) {
    return null;
  }
  return ["## Glosario relacionado (sección 2)", [...cabecera, ...relacionadas].join("\n")].join(
    "\n\n",
  );
}

/** Primera tabla Markdown de un bloque: cabecera (encabezado y separador) y filas literales. */
function tablaMarkdown(lineas: readonly string[]): { cabecera: string[]; filas: string[] } {
  const tabla = lineas.filter((l) => l.startsWith("|"));
  const cabecera = tabla.slice(0, 2);
  const filas = tabla.slice(2);
  if (cabecera.length < 2 || filas.length === 0) {
    throw new Error("Se esperaba una tabla Markdown con cabecera y filas.");
  }
  return { cabecera, filas };
}

/** Celdas de una fila de tabla, sin espacios sobrantes. */
function celdasDe(fila: string): string[] {
  return fila
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());
}

/** Módulos a los que pertenecen las secciones citadas en un texto (sin repetir, en orden de aparición). */
function modulosDeTexto(texto: string, mapa: Mapa): string[] {
  const modulos: string[] = [];
  for (const ref of texto.match(RE_REF) ?? []) {
    const modulo = moduloDeReferencia(ref, mapa);
    if (modulo !== undefined && !modulos.includes(modulo)) {
      modulos.push(modulo);
    }
  }
  return modulos;
}

/** Resuelve una cita como "5.1.1" a la sección de su nivel más cercano en el mapa ("5.1"). */
function moduloDeReferencia(ref: string, mapa: Mapa): string | undefined {
  let clave = ref;
  for (;;) {
    if (Object.hasOwn(mapa.secciones, clave)) {
      return mapa.secciones[clave];
    }
    const corte = clave.lastIndexOf(".");
    if (corte < 0) {
      return undefined;
    }
    clave = clave.slice(0, corte);
  }
}

/** Índice de criterios de aceptación (23.x) con identificadores posicionales AC-23.x-yy. */
function generarCriterios(esp: Especificacion, mapa: Mapa): string {
  const filas: string[] = [];
  for (const s of esp.secciones) {
    if (s.nivel !== 3 || !s.clave.startsWith(PREFIJO_CRITERIOS)) {
      continue;
    }
    const bloque = s.titulo.replace(/\s*\(.*$/, "").trim();
    const refsBloque = referenciasExistentes(s.titulo, mapa);
    let n = 0;
    for (const linea of s.lineas) {
      const m = RE_CRITERIO.exec(linea);
      if (m === null) {
        continue;
      }
      n += 1;
      const texto = m[1] ?? "";
      const refs = [...new Set([...refsBloque, ...referenciasExistentes(texto, mapa)])].sort(
        compararClaves,
      );
      const id = `AC-${s.clave}-${String(n).padStart(2, "0")}`;
      filas.push(
        `| ${id} | ${bloque} | ${resumir(texto).replaceAll("|", "\\|")} | ${refs.join(", ") || "—"} |`,
      );
    }
  }

  return (
    [
      "# Criterios de aceptación (sección 23)",
      `Generado desde especificacion.md v${esp.version} — no editar. Regenerar con \`pnpm spec:split\`.`,
      [
        `Total: ${String(filas.length)} criterios. Cada identificador AC-23.x-yy es la posición del criterio dentro de su bloque 23.x.`,
        "Si se inserta o quita un criterio, cambian los identificadores posteriores: revisar el backlog (REF-1) al hacerlo.",
      ].join(" "),
      [
        "| ID | Bloque | Criterio (resumen) | Sección de la especificación |",
        "|---|---|---|---|",
        ...filas,
      ].join("\n"),
    ].join("\n\n") + "\n"
  );
}

/** Claves de sección citadas en un texto que existen en el mapa (evita números sueltos como "R = 60"). */
function referenciasExistentes(texto: string, mapa: Mapa): string[] {
  const refs = texto.match(RE_REF) ?? [];
  return [...new Set(refs.filter((r) => Object.hasOwn(mapa.secciones, r)))];
}

/** Orden numérico de claves de sección: "4" < "4.2" < "15" < "23.1". */
function compararClaves(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  const largo = Math.max(pa.length, pb.length);
  for (let i = 0; i < largo; i++) {
    const diferencia = (pa[i] ?? -1) - (pb[i] ?? -1);
    if (diferencia !== 0) {
      return diferencia;
    }
  }
  return 0;
}

/** Texto de una línea, sin espacios repetidos y recortado a una longitud razonable. */
function resumir(texto: string): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= LONGITUD_RESUMEN) {
    return limpio;
  }
  const corte = limpio.lastIndexOf(" ", LONGITUD_RESUMEN);
  return `${limpio.slice(0, corte > 0 ? corte : LONGITUD_RESUMEN)} …`;
}

/** Líneas de una sección sin líneas vacías finales, tal cual están en la especificación. */
function textoLiteral(lineas: readonly string[]): string {
  let fin = lineas.length;
  while (fin > 0 && lineas[fin - 1]?.trim() === "") {
    fin -= 1;
  }
  return lineas.slice(0, fin).join("\n");
}
