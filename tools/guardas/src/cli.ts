// Uso: pnpm guardas --base origin/main --etiquetas "agente,modelo-mayor"
import { execFileSync } from "node:child_process";
import process from "node:process";
import { type CambioArchivo, evaluar } from "./reglas";

function argumento(nombre: string, porDefecto: string): string {
  const i = process.argv.indexOf(nombre);
  const valor = i === -1 ? undefined : process.argv[i + 1];
  return valor ?? porDefecto;
}

function leerCambios(base: string): CambioArchivo[] {
  const salida = execFileSync("git", ["diff", "--numstat", `${base}...HEAD`], {
    encoding: "utf8",
  });
  return salida
    .split("\n")
    .filter((linea) => linea.trim() !== "")
    .map((linea) => {
      const [anadidas, borradas, ruta = ""] = linea.split("\t");
      // Los binarios aparecen como "-"; cuentan como 0 líneas.
      return {
        ruta,
        anadidas: Number(anadidas) || 0,
        borradas: Number(borradas) || 0,
      };
    });
}

const base = argumento("--base", "origin/main");
const etiquetas = argumento("--etiquetas", process.env["ETIQUETAS"] ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter((e) => e !== "");

const resultado = evaluar({ archivos: leerCambios(base), etiquetas });

for (const h of resultado.hallazgos) {
  const donde = h.ruta === null ? "" : `${h.ruta}: `;
  console.log(`[${h.nivel}] ${donde}${h.mensaje}`);
}
console.log(resultado.ok ? "Guardas: correcto" : "Guardas: el cambio incumple las reglas");
process.exitCode = resultado.ok ? 0 : 1;
