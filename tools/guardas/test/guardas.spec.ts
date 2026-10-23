import { describe, expect, it } from "vitest";
import { type CambioArchivo, coincide, evaluar } from "../src/reglas";

const archivo = (ruta: string, anadidas = 1, borradas = 0): CambioArchivo => ({
  ruta,
  anadidas,
  borradas,
});

describe("guardas de rutas protegidas", () => {
  it("detecta que un agente toca un golden (ruta solo de persona)", () => {
    const r = evaluar({
      archivos: [archivo("packages/engine/test/golden/hashes.spec.ts")],
      etiquetas: ["agente"],
    });
    expect(r.ok).toBe(false);
    expect(r.hallazgos).toHaveLength(1);
    expect(r.hallazgos[0]?.ruta).toBe("packages/engine/test/golden/hashes.spec.ts");
  });

  it("bloquea contratos a un agente sin la etiqueta modelo-mayor", () => {
    const r = evaluar({
      archivos: [archivo("packages/contracts/src/entidades.ts")],
      etiquetas: ["agente"],
    });
    expect(r.ok).toBe(false);
  });

  it("permite contratos a un agente con la etiqueta modelo-mayor", () => {
    const r = evaluar({
      archivos: [archivo("packages/contracts/src/entidades.ts")],
      etiquetas: ["agente", "modelo-mayor"],
    });
    expect(r.ok).toBe(true);
  });

  it("no admite que la etiqueta modelo-mayor abra rutas de persona", () => {
    const r = evaluar({
      archivos: [archivo("packages/engine/test/golden/hashes.spec.ts")],
      etiquetas: ["agente", "modelo-mayor"],
    });
    expect(r.ok).toBe(false);
  });

  it("protege CLAUDE.md y los AGENTS.md de cualquier módulo", () => {
    expect(coincide("CLAUDE.md", "CLAUDE.md")).toBe(true);
    expect(coincide("CLAUDE.md", "docs/CLAUDE.md")).toBe(false);
    expect(coincide("**/AGENTS.md", "packages/engine/AGENTS.md")).toBe(true);
    const r = evaluar({
      archivos: [archivo("packages/engine/src/core/AGENTS.md")],
      etiquetas: ["agente", "modelo-mayor"],
    });
    expect(r.ok).toBe(false);
  });

  it("no bloquea rutas libres ni cambios sin la etiqueta agente", () => {
    expect(
      evaluar({ archivos: [archivo("packages/engine/src/core/rng.ts")], etiquetas: ["agente"] }).ok,
    ).toBe(true);
    expect(evaluar({ archivos: [archivo("CLAUDE.md")], etiquetas: [] }).ok).toBe(true);
  });

  it("avisa a partir de 300 líneas y falla por encima de 400 en cambios de agente", () => {
    const aviso = evaluar({
      archivos: [archivo("packages/engine/src/x.ts", 350, 0)],
      etiquetas: ["agente"],
    });
    expect(aviso.ok).toBe(true);
    expect(aviso.hallazgos.map((h) => h.nivel)).toEqual(["aviso"]);

    const error = evaluar({
      archivos: [archivo("packages/engine/src/x.ts", 450, 0)],
      etiquetas: ["agente"],
    });
    expect(error.ok).toBe(false);
  });
});
