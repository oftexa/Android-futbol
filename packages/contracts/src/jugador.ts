import { z } from "zod";
import { CentNoNegativo, decimal, entero, entidad, Uuid } from "./base";
import { PosicionJugador } from "./enumeraciones";

/** Entidad Jugador (4.8). `codigo` es único en la partida (validación de unicidad fuera de este esquema). */
export const Jugador = entidad({
  id: Uuid,
  codigo: z.string().min(1),
  nombre_ficticio: z.string().min(1),
  posicion: PosicionJugador,
  nacionalidad_codigo: z.string().regex(/^[A-Z]{2}$/),
  es_comunitario: z.boolean(),
  edad: entero(15, 45),
  valor_mercado: CentNoNegativo,
  condicion_fisica: entero(0, 100),
  moral: entero(0, 100),
  lesion_dias_restantes: entero(0),
  minutos_temporada: entero(0),
  minutos_semana: entero(0, 90),
  semanas_moral_baja: entero(0),
  solicitud_traspaso_ventanas: entero(0, 2).nullable(),
  inscrito: z.boolean(),
  club_id: Uuid.nullable(),
  contrato_id: Uuid.nullable(),
  cesion_id: Uuid.nullable(),
  calidad: entero(1, 100),
  velocidad: entero(1, 100),
  puntos_entrenamiento: entero(0, 100),
});

/** Entidad Seguro (4.20). */
export const Seguro = entidad({
  id: Uuid,
  jugador_id: Uuid,
  tasa_prima: decimal(0, 0.2),
  cobertura_lesion: decimal(0, 1),
  cobertura_salario_baja: decimal(0, 1),
  activo: z.boolean(),
});

export type Jugador = z.infer<typeof Jugador>;
export type Seguro = z.infer<typeof Seguro>;
