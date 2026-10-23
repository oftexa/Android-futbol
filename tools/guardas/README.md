# guardas

Comprueba en la CI que un cambio de agente (etiqueta `agente`) no toca rutas protegidas sin el permiso indicado en `src/reglas.ts`, y que no supera 400 líneas. Uso local: `pnpm guardas --base origin/main --etiquetas agente`.
