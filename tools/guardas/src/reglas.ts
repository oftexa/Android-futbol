// Guardas de cambios (sección 8.2 y 13.6 de la arquitectura).
// Lógica pura: recibe la lista de archivos cambiados y las etiquetas del PR.
// Protegido: solo lo modifican personas (ver tools/guardas/README.md).

/**
 * Permiso necesario para tocar una ruta protegida en un cambio de agente:
 * - "modelo-mayor": el PR de agente debe llevar también la etiqueta `modelo-mayor`.
 * - "persona": ningún cambio de agente puede tocarla; solo una persona, con revisión CODEOWNERS.
 */
export type Permiso = "modelo-mayor" | "persona";

export interface ReglaProtegida {
  patron: string;
  permiso: Permiso;
  motivo: string;
}

export const RUTAS_PROTEGIDAS: readonly ReglaProtegida[] = [
  { patron: "CLAUDE.md", permiso: "persona", motivo: "Reglas para el agente (13.1)" },
  { patron: "**/AGENTS.md", permiso: "persona", motivo: "Contratos por módulo (13.2)" },
  { patron: ".github/**", permiso: "persona", motivo: "CI y propietarios (8.2)" },
  {
    patron: "packages/contracts/**",
    permiso: "modelo-mayor",
    motivo: "Contratos Zod e interfaces (13.4)",
  },
  {
    patron: "packages/engine/test/aceptacion/**",
    permiso: "modelo-mayor",
    motivo: "Criterios de aceptación de la sección 23 (8.1)",
  },
  {
    patron: "packages/engine/test/golden/**",
    permiso: "persona",
    motivo: "Hashes de determinismo; solo se cambian con aprobación humana (8.1)",
  },
  { patron: "packs/**/datos/**", permiso: "persona", motivo: "Generado desde el xlsx (4)" },
  { patron: "packs/**/parametros/**", permiso: "persona", motivo: "Parámetros generados (4)" },
  { patron: "eslint.config.mjs", permiso: "persona", motivo: "Reglas de determinismo (3.1)" },
  { patron: "tsconfig.base.json", permiso: "persona", motivo: "Rigor del compilador (2.1)" },
  { patron: "tools/guardas/**", permiso: "persona", motivo: "Las propias guardas" },
];

export const ETIQUETA_AGENTE = "agente";
export const ETIQUETA_MODELO_MAYOR = "modelo-mayor";
export const LIMITE_AVISO_LINEAS = 300;
export const LIMITE_ERROR_LINEAS = 400;

export interface CambioArchivo {
  ruta: string;
  anadidas: number;
  borradas: number;
}

export interface EntradaGuardas {
  archivos: readonly CambioArchivo[];
  etiquetas: readonly string[];
}

export interface Hallazgo {
  nivel: "error" | "aviso";
  ruta: string | null;
  mensaje: string;
}

export interface ResultadoGuardas {
  ok: boolean;
  hallazgos: Hallazgo[];
}

/** Convierte un patrón glob (`*`, `**`, `?`) en una expresión regular anclada. */
export function coincide(patron: string, ruta: string): boolean {
  let re = "";
  for (let i = 0; i < patron.length; i++) {
    const c = patron.charAt(i);
    if (c === "*" && patron.charAt(i + 1) === "*") {
      if (patron.charAt(i + 2) === "/") {
        re += "(?:.*/)?";
        i += 2;
      } else {
        re += ".*";
        i += 1;
      }
    } else if (c === "*") {
      re += "[^/]*";
    } else if (c === "?") {
      re += "[^/]";
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${re}$`).test(ruta);
}

export function reglaDe(ruta: string): ReglaProtegida | undefined {
  return RUTAS_PROTEGIDAS.find((r) => coincide(r.patron, ruta));
}

/**
 * Evalúa un cambio. Solo restringe los cambios de agente (etiqueta `agente`);
 * un cambio humano puede tocar cualquier ruta, y su revisión la hace CODEOWNERS.
 */
export function evaluar(entrada: EntradaGuardas): ResultadoGuardas {
  const hallazgos: Hallazgo[] = [];
  if (!entrada.etiquetas.includes(ETIQUETA_AGENTE)) {
    return { ok: true, hallazgos };
  }
  const tieneModeloMayor = entrada.etiquetas.includes(ETIQUETA_MODELO_MAYOR);

  for (const archivo of entrada.archivos) {
    const regla = reglaDe(archivo.ruta);
    if (regla === undefined) continue;
    if (regla.permiso === "persona" || !tieneModeloMayor) {
      hallazgos.push({
        nivel: "error",
        ruta: archivo.ruta,
        mensaje:
          `ruta protegida (${regla.motivo}); requiere permiso "${regla.permiso}"` +
          (regla.permiso === "modelo-mayor" ? ` y la etiqueta "${ETIQUETA_MODELO_MAYOR}"` : ""),
      });
    }
  }

  const lineas = entrada.archivos.reduce((total, a) => total + a.anadidas + a.borradas, 0);
  if (lineas > LIMITE_ERROR_LINEAS) {
    hallazgos.push({
      nivel: "error",
      ruta: null,
      mensaje: `el cambio toca ${String(lineas)} líneas; el máximo para agentes es ${String(LIMITE_ERROR_LINEAS)}`,
    });
  } else if (lineas > LIMITE_AVISO_LINEAS) {
    hallazgos.push({
      nivel: "aviso",
      ruta: null,
      mensaje: `el cambio toca ${String(lineas)} líneas; a partir de ${String(LIMITE_AVISO_LINEAS)} conviene trocearlo`,
    });
  }

  return { ok: !hallazgos.some((h) => h.nivel === "error"), hallazgos };
}
