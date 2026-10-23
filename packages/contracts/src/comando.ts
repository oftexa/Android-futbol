import { z } from "zod";

/**
 * Comando de entrada al núcleo (3.3). La especificación no fija el catálogo de comandos:
 * cada comando concreto define su `payload` en su tarea (ver docs/preguntas.md).
 * `tipo` en snake_case.
 */
export const Comando = z.strictObject({
  tipo: z.string().regex(/^[a-z][a-z0-9_]*$/),
  payload: z.record(z.string(), z.unknown()),
});

export type Comando = z.infer<typeof Comando>;
