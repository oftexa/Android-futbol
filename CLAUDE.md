# Android Futbol 4 — Reglas para agentes

## Qué es

Juego de gestión de fútbol para un jugador. Núcleo TS puro y determinista (`packages/engine`) + UI React (pendiente, `apps/web`).
Especificación troceada en `docs/spec/modulos/*.md` (pendiente de T-02). Tu tarea: `docs/tareas/T-xxx.md`.

## Comandos

- `pnpm install` · instalar (usa `pnpm-lock.yaml`; en CI, `--frozen-lockfile`)
- `pnpm verify` · typecheck + lint + tests (DEBE pasar)
- `pnpm test -- <patrón>` · tests concretos, p. ej. `pnpm test -- guardas`
- `pnpm lint` / `pnpm format` · comprobar / formatear
- `pnpm guardas --base origin/main --etiquetas agente` · comprobar rutas protegidas

## Reglas de oro

1. `packages/engine` es PURO: sin DOM, React, red, almacenamiento, `Date`, `Math.random`, `Math.pow/exp/log` ni otras funciones de `Math` que no sean `sqrt`, `setTimeout`, ni el operador `**`. Las potencias y logaritmos irán en `core/detmath` (T-05) y la aleatoriedad en `core/rng` (T-01 en adelante). ESLint lo comprueba.
2. Importes SIEMPRE en céntimos enteros. Redondea solo con `core/dinero` cuando exista.
3. Ninguna cifra de equilibrio en el código: léela de los parámetros. Si falta un parámetro, PARA y escríbelo en `docs/preguntas.md`.
4. NO edites rutas protegidas (`tools/guardas/src/reglas.ts` tiene la lista completa): `CLAUDE.md`, `**/AGENTS.md`, `.github/**`, `eslint.config.mjs`, `tsconfig.base.json`, `packages/contracts/**`, `packages/engine/test/aceptacion/**`, `packages/engine/test/golden/**`, `packs/**/datos/**`, `packs/**/parametros/**`, `tools/guardas/**`. Si crees que hay que cambiarlas, PARA y explícalo.
5. No cambies una fórmula sin que lo pida la tarea. Si un golden falla, NO lo regeneres: informa.
6. Un cambio = una tarea. Máximo ~300 líneas. Solo los archivos que lista la tarea (más tests en `test/unidad/`).
7. Itera colecciones como listas ordenadas por `codigo`; nunca dependas del orden de claves de un objeto ni uses `for...in`.
8. Cada fórmula devolverá un `Desglose` con `ref` a la sección de la especificación.
9. Ante una ambigüedad de la especificación, no inventes: anótala en `docs/preguntas.md` y usa el comportamiento más simple marcado con `TODO(ref)`.
10. Termina solo cuando `pnpm verify` pase. Tras 2 intentos fallidos con el mismo error, detente y pide escalado.

## Estilo

TS estricto (`tsconfig.base.json`), funciones puras pequeñas, nombres en español como en la especificación (snake_case en datos, camelCase en código), sin clases salvo que la tarea lo pida, sin dependencias nuevas sin aprobación.
