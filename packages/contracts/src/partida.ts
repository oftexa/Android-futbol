import { z } from "zod";
import { entero, entidad, Uuid } from "./base";

/** Límite superior de la semilla: 2^63 − 1 (4.24). Se usa bigint porque no cabe en un número seguro. */
const SEMILLA_MAX = 9223372036854775807n;

/**
 * Entidad Partida (4.24). Se guarda como cabecera de la partida.
 * `semilla` es bigint en memoria; al serializar a JSON debe codificarse como cadena decimal.
 */
export const Partida = entidad({
  id: Uuid,
  semilla: z.bigint().min(0n).max(SEMILLA_MAX),
  club_jugador_id: Uuid,
  entrenador_jugador_id: Uuid,
  temporada_actual_id: Uuid,
  semana_actual: entero(1, 52),
  impuesto_tesoreria_activo: z.boolean(),
  prima_gol_activa: z.boolean(),
  derechos_imagen_activos: z.boolean(),
});

export type Partida = z.infer<typeof Partida>;
