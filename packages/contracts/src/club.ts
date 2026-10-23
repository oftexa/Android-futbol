import { z } from "zod";
import { CentNoNegativo, centEn, entero, entidad, Uuid } from "./base";
import {
  Division,
  GestorCaja,
  IntensidadEntrenamiento,
  ModoJuego,
  RolPersonal,
} from "./enumeraciones";

/**
 * Entidad Club (4.4).
 * Nota: `precio_taquilla_cent` acota a [0,5 × p_ref, 2,0 × p_ref] de su división; aquí se valida
 * solo la envolvente global [1.100, 9.000] cent (2.200 × 0,5 y 4.500 × 2). El rango exacto es cruzado.
 */
export const Club = entidad({
  id: Uuid,
  codigo: z.string().regex(/^[PST]\d{2}$/),
  nombre: z.string().min(1).max(60),
  division_actual: Division,
  reputacion: entero(0, 100),
  seguidores_club: entero(0),
  fans_activos: entero(0),
  ingresos_base_temporada_cent: CentNoNegativo.nullable(),
  precio_taquilla_cent: centEn(1_100, 9_000),
  plan_entrenamiento: IntensidadEntrenamiento,
  plan_entrenamiento_siguiente: IntensidadEntrenamiento,
  victorias_consecutivas: entero(0),
  derrotas_consecutivas: entero(0),
  racha: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
  despidos_temporada: entero(0, 1),
  bases_negativas: z.array(
    z.strictObject({ anio_inicio: entero(2020, 2100), importe_cent: CentNoNegativo }),
  ),
  recaudacion_historica_cent: z.array(CentNoNegativo).length(5),
  historial_posiciones: z
    .array(z.strictObject({ division: Division, posicion: entero(1, 22) }))
    .length(5),
  aforo_medio_anterior: entero(0),
  descubierto_limite_cent: CentNoNegativo,
  secretaria_honorarios_anual_cent: CentNoNegativo,
  personal_costes_anual_cent: CentNoNegativo,
  modo_juego: ModoJuego,
  promanager_desbloqueado: z.boolean(),
  gestor_caja: GestorCaja,
  aficion_moral: entero(0, 100),
  confianza_directiva: entero(0, 100),
  turismo_alto: z.boolean(),
  ciudad_grande: z.boolean(),
  renovacion_automatica: z.boolean(),
});

/** Entidad Abonado (4.23). */
export const Abonado = entidad({
  id: Uuid,
  club_id: Uuid,
  antiguedad_abono_anios: entero(1, 120),
  activo: z.boolean(),
});

/** Entidad PersonalTecnico (4.19). */
export const PersonalTecnico = entidad({
  id: Uuid,
  club_id: Uuid,
  rol: RolPersonal,
  salario_anual_cent: CentNoNegativo,
  calidad: entero(1, 5),
});

export type Club = z.infer<typeof Club>;
export type Abonado = z.infer<typeof Abonado>;
export type PersonalTecnico = z.infer<typeof PersonalTecnico>;
