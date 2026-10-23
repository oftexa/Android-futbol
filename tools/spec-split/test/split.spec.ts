import { describe, expect, it } from "vitest";
import {
  compararSalida,
  generarArchivos,
  leerMapa,
  type Mapa,
  parsearEspecificacion,
} from "../src/split";

const ESPECIFICACION = `# Especificación de ejemplo

| Campo | Valor |
|---|---|
| Documento | Especificación de prueba, versión 2.3 |

---

## 1. Alcance

Texto del alcance.

### 1.1 Incluido

- uno

#### 1.1.1 Detalle

Detalle del incluido.

## 2. Glosario

| Término | Definición |
|---|---|
| Caja | Dinero disponible (ver 4.1). |
| Otro | Sin referencias a secciones. |

## 4. Modelo

### 4.1 Convenciones

\`\`\`
## 9. falso encabezado dentro de código
\`\`\`

### 0.3 Decisiones de producto aplicadas

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Primera decisión. | 1.1, 4.1 |
| 2 | Segunda decisión. | 4.1 |

## 23. Checklist

### 23.1 Datos (sección 4)

- [ ] Primer criterio, con 4.1 citado.
- [ ] Segundo criterio.
`;

const MAPA: Mapa = {
  modulos: { uno: "Módulo uno", dos: "Módulo dos", comun: "Común" },
  secciones: {
    "0.3": "comun",
    "1": "uno",
    "1.1": "uno",
    "2": "comun",
    "4": "dos",
    "4.1": "dos",
    "23": "comun",
    "23.1": "dos",
  },
};

describe("parsearEspecificacion", () => {
  it("lee la versión y las secciones de primer y segundo nivel, sin tratar el código como encabezados", () => {
    const esp = parsearEspecificacion(ESPECIFICACION);
    expect(esp.version).toBe("2.3");
    expect(esp.secciones.map((s) => s.clave)).toEqual([
      "1",
      "1.1",
      "2",
      "4",
      "4.1",
      "0.3",
      "23",
      "23.1",
    ]);
  });

  it("rechaza un encabezado de sección sin número", () => {
    expect(() => parsearEspecificacion(`${ESPECIFICACION}\n## Anexo sin número\n`)).toThrow(
      /sin número/,
    );
  });
});

describe("generarArchivos", () => {
  const archivos = generarArchivos(ESPECIFICACION, MAPA);

  it("genera un archivo por módulo más criterios.md", () => {
    expect([...archivos.keys()]).toEqual([
      "modulos/uno.md",
      "modulos/dos.md",
      "modulos/comun.md",
      "criterios.md",
    ]);
  });

  it("pone la cabecera de generación con la versión y solo las secciones del módulo", () => {
    const uno = archivos.get("modulos/uno.md") ?? "";
    expect(uno).toContain("Generado desde especificacion.md v2.3 — no editar");
    expect(uno).toContain("## 1. Alcance");
    expect(uno).toContain("#### 1.1.1 Detalle");
    expect(uno).not.toContain("## 4. Modelo");
  });

  it("copia las secciones literalmente, incluido el bloque de código con un falso encabezado", () => {
    const dos = archivos.get("modulos/dos.md") ?? "";
    expect(dos).toContain("```\n## 9. falso encabezado dentro de código\n```");
  });

  it("añade al final solo las decisiones y entradas del glosario que citan secciones del módulo", () => {
    const uno = archivos.get("modulos/uno.md") ?? "";
    expect(uno).toContain("| 1 | Primera decisión. | 1.1, 4.1 |");
    expect(uno).not.toContain("| 2 | Segunda decisión.");
    expect(uno).not.toContain("## Glosario relacionado");

    const dos = archivos.get("modulos/dos.md") ?? "";
    expect(dos).toContain("| 2 | Segunda decisión. | 4.1 |");
    expect(dos).toContain("## Glosario relacionado (sección 2)");
    expect(dos).toContain("| Caja | Dinero disponible (ver 4.1). |");
    expect(dos).not.toContain("| Otro |");
  });

  it("deja la sección 0.3 completa en comun.md", () => {
    const comun = archivos.get("modulos/comun.md") ?? "";
    expect(comun).toContain("| 1 | Primera decisión. | 1.1, 4.1 |");
    expect(comun).toContain("| 2 | Segunda decisión. | 4.1 |");
  });

  it("genera un criterio por casilla con identificador posicional", () => {
    const criterios = archivos.get("criterios.md") ?? "";
    expect(criterios).toContain("Total: 2 criterios.");
    expect(criterios).toContain(
      "| AC-23.1-01 | Datos | Primer criterio, con 4.1 citado. | 4, 4.1 |",
    );
    expect(criterios).toContain("| AC-23.1-02 | Datos | Segundo criterio. | 4 |");
  });

  it("falla si una sección queda sin asignar", () => {
    const sinUna = Object.fromEntries(
      Object.entries(MAPA.secciones).filter(([clave]) => clave !== "4.1"),
    );
    expect(() => generarArchivos(ESPECIFICACION, { ...MAPA, secciones: sinUna })).toThrow(
      /sin asignar a ningún módulo: 4\.1/,
    );
  });

  it("falla si el mapa cita una sección que no existe o un módulo no declarado", () => {
    expect(() =>
      generarArchivos(ESPECIFICACION, { ...MAPA, secciones: { ...MAPA.secciones, "7": "uno" } }),
    ).toThrow(/no existe en la especificación: 7/);
    expect(() =>
      generarArchivos(ESPECIFICACION, { ...MAPA, secciones: { ...MAPA.secciones, "1.1": "nada" } }),
    ).toThrow(/módulo no declarado: nada/);
  });
});

describe("compararSalida (spec:check)", () => {
  const esperado = new Map([
    ["modulos/uno.md", "contenido"],
    ["criterios.md", "criterios"],
  ]);

  it("no reporta problemas cuando lo generado coincide con lo que hay en disco", () => {
    expect(compararSalida(esperado, new Map(esperado))).toEqual([]);
  });

  it("detecta un módulo editado a mano", () => {
    const actual = new Map([
      ["modulos/uno.md", "contenido editado"],
      ["criterios.md", "criterios"],
    ]);
    expect(compararSalida(esperado, actual)).toEqual([
      "difiere modulos/uno.md (editado a mano o especificación cambiada sin regenerar)",
    ]);
  });

  it("detecta archivos que faltan o sobran", () => {
    const actual = new Map([
      ["criterios.md", "criterios"],
      ["modulos/a-mano.md", "nuevo"],
    ]);
    expect(compararSalida(esperado, actual)).toEqual([
      "falta modulos/uno.md",
      "sobra modulos/a-mano.md (no lo genera el script)",
    ]);
  });
});

describe("leerMapa", () => {
  it("acepta el formato esperado", () => {
    expect(leerMapa(JSON.stringify(MAPA))).toEqual(MAPA);
  });

  it("rechaza un JSON con otra forma", () => {
    expect(() => leerMapa(JSON.stringify({ secciones: { "1": 3 } }))).toThrow(/forma/);
  });
});
