# Android Futbol 4

Juego de gestión de fútbol para un jugador (estilo PC Fútbol, sin motor de partidos). Núcleo TypeScript determinista, con PWA y Android (Capacitor) previstos.

## Requisitos

- Node.js 22.13 o superior
- pnpm 10.28.0 (fijado en `package.json`; con Corepack: `corepack enable`)

## Instalación

```sh
pnpm install
```

## Ejecutar y verificar

```sh
pnpm verify          # typecheck + lint + tests (lo mismo que hace la CI)
pnpm test            # solo tests
pnpm lint            # ESLint y Prettier
pnpm guardas --base origin/main --etiquetas agente   # rutas protegidas de un cambio de agente
```

La interfaz (`pnpm dev`) llegará con la tarea T-07.

## Estructura

- `packages/engine`: núcleo puro y determinista.
- `packages/contracts`: esquemas y tipos públicos.
- `packages/packs`: carga y verificación de paquetes de datos.
- `packs/`: fuente de los datos del juego.
- `apps/web`: interfaz (pendiente).
- `tools/`: herramientas de desarrollo (guardas, etc.).
- `docs/`: especificación, tareas y decisiones.

Reglas para agentes: `CLAUDE.md`. Arquitectura: `docs/`.
