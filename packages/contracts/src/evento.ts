import { z } from "zod";
import { entero } from "./base";

/**
 * Evento emitido por el núcleo al aplicar un comando o un tick (3.3).
 * Mismo criterio que Comando: el `payload` concreto se define por evento en su tarea.
 */
export const Evento = z.strictObject({
  tipo: z.string().regex(/^[a-z][a-z0-9_]*$/),
  semana: entero(1, 52),
  payload: z.record(z.string(), z.unknown()),
});

export type Evento = z.infer<typeof Evento>;
