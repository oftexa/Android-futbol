// Uso:
//   pnpm spec:split   regenera docs/spec/modulos/*.md y docs/spec/criterios.md
//   pnpm spec:check   falla si lo generado no coincide con lo que hay en disco
import { readdir, readFile, rm, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { compararSalida, generarArchivos, leerMapa } from "./split";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const DIR_SPEC = path.join(RAIZ, "docs", "spec");
const DIR_MODULOS = path.join(DIR_SPEC, "modulos");

async function leerSiExiste(ruta: string): Promise<string | undefined> {
  try {
    return await readFile(ruta, "utf8");
  } catch (error) {
    if (esErrorDeFichero(error, "ENOENT")) {
      return undefined;
    }
    throw error;
  }
}

function esErrorDeFichero(error: unknown, codigo: string): boolean {
  return error instanceof Error && "code" in error && error.code === codigo;
}

async function generar(): Promise<Map<string, string>> {
  const md = await readFile(path.join(DIR_SPEC, "especificacion.md"), "utf8");
  const mapa = leerMapa(await readFile(path.join(DIR_SPEC, "mapa-secciones.json"), "utf8"));
  return generarArchivos(md, mapa);
}

/** Lo que hay ahora en disco para las rutas que el script genera (modulos/*.md y criterios.md). */
async function leerActual(): Promise<Map<string, string>> {
  const actual = new Map<string, string>();
  let nombres: string[] = [];
  try {
    nombres = await readdir(DIR_MODULOS);
  } catch (error) {
    if (!esErrorDeFichero(error, "ENOENT")) {
      throw error;
    }
  }
  for (const nombre of nombres.filter((n) => n.endsWith(".md")).sort()) {
    const contenido = await readFile(path.join(DIR_MODULOS, nombre), "utf8");
    actual.set(`modulos/${nombre}`, contenido);
  }
  const criterios = await leerSiExiste(path.join(DIR_SPEC, "criterios.md"));
  if (criterios !== undefined) {
    actual.set("criterios.md", criterios);
  }
  return actual;
}

async function dividir(): Promise<void> {
  const archivos = await generar();
  await mkdir(DIR_MODULOS, { recursive: true });

  // Quita los módulos que ya no genera el mapa (p. ej. tras renombrar uno).
  for (const ruta of (await leerActual()).keys()) {
    if (!archivos.has(ruta)) {
      await rm(path.join(DIR_SPEC, ruta));
    }
  }
  for (const [ruta, contenido] of archivos) {
    await writeFile(path.join(DIR_SPEC, ruta), contenido, "utf8");
    const lineas = contenido.split("\n").length - 1;
    console.log(`${ruta}  ${String(lineas)} líneas`);
  }
}

async function comprobar(): Promise<number> {
  const problemas = compararSalida(await generar(), await leerActual());
  if (problemas.length === 0) {
    console.log("spec:check correcto: docs/spec/modulos y criterios.md están al día.");
    return 0;
  }
  console.error("spec:check falla:");
  for (const problema of problemas) {
    console.error(`- ${problema}`);
  }
  console.error("Edita docs/spec/especificacion.md (no los módulos) y ejecuta `pnpm spec:split`.");
  return 1;
}

async function main(): Promise<number> {
  const orden = process.argv[2] ?? "split";
  if (orden === "split") {
    await dividir();
    return 0;
  }
  if (orden === "check") {
    return comprobar();
  }
  console.error(`Orden desconocida: ${orden}. Usa "split" o "check".`);
  return 2;
}

main().then(
  (codigo) => {
    process.exitCode = codigo;
  },
  (error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  },
);
