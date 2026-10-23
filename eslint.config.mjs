// Reglas de ESLint del proyecto. Protegido (ver tools/guardas/src/reglas.ts).
// El núcleo (packages/engine) debe ser determinista: ver sección 3.1 de la arquitectura.
import tseslint from "typescript-eslint";

// Globales que dependen del entorno o del reloj.
const GLOBALES_PROHIBIDAS = [
  "Date",
  "performance",
  "setTimeout",
  "setInterval",
  "setImmediate",
  "requestAnimationFrame",
  "fetch",
  "XMLHttpRequest",
  "window",
  "document",
  "navigator",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "crypto",
];

// Funciones de Math que no dan el mismo resultado en todos los motores.
// Math.sqrt, +, -, * y / sí son exactos según IEEE 754 y se permiten.
const MATH_NO_DETERMINISTAS = [
  "pow",
  "exp",
  "log",
  "log2",
  "log10",
  "log1p",
  "expm1",
  "cbrt",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "atan2",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  "hypot",
];

const MSG_DETERMINISMO =
  "El núcleo debe ser determinista. Usa core/detmath o el flujo de aleatoriedad (core/rng).";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**"],
  },
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["packages/engine/**/*.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        ...GLOBALES_PROHIBIDAS.map((name) => ({ name, message: MSG_DETERMINISMO })),
      ],
      "no-restricted-properties": [
        "error",
        { object: "Math", property: "random", message: MSG_DETERMINISMO },
        ...MATH_NO_DETERMINISTAS.map((property) => ({
          object: "Math",
          property,
          message: MSG_DETERMINISMO,
        })),
        { object: "Date", property: "now", message: MSG_DETERMINISMO },
        { object: "performance", property: "now", message: MSG_DETERMINISMO },
      ],
      "no-restricted-syntax": [
        "error",
        {
          // Sin enteros garantizados en el exponente, el operador ** no es determinista.
          selector: "BinaryExpression[operator='**']",
          message: "No uses **: usa core/detmath (powDet) para potencias no enteras.",
        },
        {
          selector: "AssignmentExpression[operator='**=']",
          message: "No uses **=: usa core/detmath (powDet) para potencias no enteras.",
        },
        {
          // El orden de for...in depende de las claves numéricas del objeto.
          selector: "ForInStatement",
          message: "Itera colecciones como listas ordenadas por codigo, no con for...in.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["node:*", "react", "react-*", "@capacitor/*", "idb", "**/apps/**"],
              message: "El núcleo no importa UI, red, almacenamiento ni Node (sección 3.1).",
            },
          ],
        },
      ],
    },
  },
);
