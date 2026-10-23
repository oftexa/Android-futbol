import { z } from "zod";
import { CentNoNegativo, entero, entidad, Fecha, Uuid } from "./base";
import {
  Division,
  EstadoEntrenador,
  EstadoOferta,
  OrigenObjetivo,
  TipoObjetivo,
} from "./enumeraciones";

/**
 * Entidad Entrenador (4.11).
 * Regla de la tabla: `club_id` es nulo si `estado` es `en_paro`.
 */
export const Entrenador = entidad({
  id: Uuid,
  nombre_ficticio: z.string().min(1),
  club_id: Uuid.nullable(),
  reputacion: entero(0, 100),
  penalizacion_honorarios_temporadas: entero(0, 2),
  honorarios_anual_cent: CentNoNegativo,
  contrato_fecha_fin: Fecha,
  contrato_anios_restantes: entero(0, 4),
  confianza_directiva: entero(0, 100),
  moral_plantilla: entero(0, 100),
  estado: EstadoEntrenador,
  historial_despidos: entero(0),
}).refine((e) => e.estado !== "en_paro" || e.club_id === null, {
  message: "club_id debe ser nulo si estado es en_paro",
  path: ["club_id"],
});

/** Entidad Objetivo (4.12). `presupuesto_no_superar` solo existe en modo Manager (regla de negocio, no validada aquí). */
export const Objetivo = entidad({
  id: Uuid,
  temporada_id: Uuid,
  club_id: Uuid,
  tipo: TipoObjetivo,
  valor_objetivo: z.number(),
  peso: z.number().gt(0).max(1),
  cumplido: z.boolean().nullable(),
  evaluado_en: Fecha.nullable(),
  origen: OrigenObjetivo,
});

/** Entidad Oferta (4.18). `club_destino_id` pertenece al pool ficticio (15.5, 15.6); no se valida contra el pool aquí. */
export const Oferta = entidad({
  id: Uuid,
  entrenador_id: Uuid,
  club_origen_id: Uuid,
  club_destino_id: Uuid,
  division_destino: Division,
  honorarios_anual_cent: CentNoNegativo,
  anios: entero(1, 4),
  semana: entero(1),
  caduca_semana: entero(1),
  estado: EstadoOferta,
});

export type Entrenador = z.infer<typeof Entrenador>;
export type Objetivo = z.infer<typeof Objetivo>;
export type Oferta = z.infer<typeof Oferta>;
