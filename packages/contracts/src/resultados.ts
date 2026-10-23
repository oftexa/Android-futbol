import { z } from "zod";
import { Causa } from "./causa";
import { Evento } from "./evento";
import { EstadoPartida } from "./estado";

/** Resultado de `aplicarComando` (3.3): éxito con el estado nuevo o rechazo con causas. */
export const ResultadoComando = z.discriminatedUnion("ok", [
  z.strictObject({
    ok: z.literal(true),
    estado: EstadoPartida,
    eventos: z.array(Evento),
  }),
  z.strictObject({
    ok: z.literal(false),
    causas: z.array(Causa).min(1),
  }),
]);

/** Resultado de `avanzarSemana` (un tick, 5.2). */
export const ResultadoTick = z.strictObject({
  estado: EstadoPartida,
  eventos: z.array(Evento),
});

export type ResultadoComando = z.infer<typeof ResultadoComando>;
export type ResultadoTick = z.infer<typeof ResultadoTick>;
