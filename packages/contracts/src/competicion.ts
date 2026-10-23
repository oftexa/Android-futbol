import { z } from "zod";
import { decimal, entero, entidad, enteroEn, Uuid } from "./base";
import { Division, TipoVentana } from "./enumeraciones";

/** Entidad Competicion (4.3). Primera: 20 equipos, 38 jornadas. Segunda: 22 equipos, 42 jornadas. */
export const Competicion = entidad({
  id: Uuid,
  nombre: z.string().min(1),
  division: Division,
  num_equipos: enteroEn([20, 22]),
  num_jornadas: enteroEn([38, 42]),
  partidos_local_por_equipo: entero(19, 21),
  ventanas_mercado: z.array(TipoVentana),
});

/** Entidad Partido (4.25). */
export const Partido = entidad({
  id: Uuid,
  temporada_id: Uuid,
  competicion_id: Uuid,
  jornada: entero(1, 45),
  indice: entero(1),
  semana: entero(1, 52),
  local_id: Uuid,
  visitante_id: Uuid,
  goles_local: entero(0).nullable(),
  goles_visitante: entero(0).nullable(),
  asistencia: entero(0).nullable(),
  demanda: decimal(0, Number.MAX_SAFE_INTEGER).nullable(),
});

/** Entidad Clasificacion (4.26). Clave compuesta temporada_id + club_id (sin id propio). */
export const Clasificacion = entidad({
  temporada_id: Uuid,
  club_id: Uuid,
  competicion_id: Uuid,
  jugados: entero(0),
  ganados: entero(0),
  empatados: entero(0),
  perdidos: entero(0),
  goles_favor: entero(0),
  goles_contra: entero(0),
  puntos: entero(0),
  posicion: entero(1, 22),
});

export type Competicion = z.infer<typeof Competicion>;
export type Partido = z.infer<typeof Partido>;
export type Clasificacion = z.infer<typeof Clasificacion>;
