import { z } from "zod";
import { UnidadDesglose } from "./enumeraciones";

/** Factor de un desglose: cada cifra que explica un resultado, con su sección (regla de oro 8). */
export const FactorDesglose = z.strictObject({
  clave: z.string().min(1),
  valor: z.number(),
  ref: z.string().min(1),
});

/** Desglose de una cifra (3.3). `ref` de cada factor = sección de la especificación. */
export const Desglose = z.strictObject({
  valor: z.number(),
  unidad: UnidadDesglose,
  factores: z.array(FactorDesglose),
});

export type FactorDesglose = z.infer<typeof FactorDesglose>;
export type Desglose = z.infer<typeof Desglose>;
