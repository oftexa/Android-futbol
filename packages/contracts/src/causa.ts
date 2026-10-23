import { z } from "zod";

/**
 * Causa de un rechazo (3.3). `codigo` en mayúsculas con guion bajo (p. ej. VENTANA_CERRADA);
 * `ref` es la sección de la especificación que la origina (p. ej. "11.3").
 */
export const Causa = z.strictObject({
  codigo: z.string().regex(/^[A-Z][A-Z0-9_]*$/),
  ref: z.string().min(1),
});

export type Causa = z.infer<typeof Causa>;
