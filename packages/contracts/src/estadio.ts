import { z } from "zod";
import { CentNoNegativo, decimal, entero, entidad, Uuid } from "./base";
import { EstadoEvento, EstadoObra, TipoEvento, TipoObra, TipoSeccion } from "./enumeraciones";

/** Entidad Estadio (4.5). `aforo_disponible_hoy` es derivado y se guarda como caché. */
export const Estadio = entidad({
  id: Uuid,
  club_id: Uuid,
  nombre: z.string().min(1),
  naming_contrato_id: Uuid.nullable(),
  aforo_total: entero(5_000, 120_000),
  aforo_disponible_hoy: entero(0, 120_000),
  cesped_estado: entero(0, 100),
  insonorizacion_nivel: entero(0, 3),
  cubierta: z.boolean(),
  pantalla_led: z.boolean(),
  cesped_calefactado: z.boolean(),
  antiguedad_anios: entero(0, 120),
  cafeterias_max: entero(20, 20),
  cafeterias_numero: entero(1, 20),
  obras_activas_max: entero(1, 3),
});

/** Entidad SeccionEstadio (4.6). */
export const SeccionEstadio = entidad({
  id: Uuid,
  estadio_id: Uuid,
  tipo: TipoSeccion,
  plazas: entero(0, 60_000),
  precio_base_partido_cent: CentNoNegativo.nullable(),
  ocupacion_maxima: decimal(0, 1),
  estado_fisico: entero(0, 100),
  activa: z.boolean(),
});

/**
 * Entidad Obra (4.7).
 * Regla cruzada de la tabla: `semanas_pagadas` ∈ [0, semanas_duracion].
 */
export const Obra = entidad({
  id: Uuid,
  estadio_id: Uuid,
  tipo: TipoObra,
  coste_total: CentNoNegativo,
  semanas_duracion: entero(1, 260),
  temporada_inicio_id: Uuid,
  semana_inicio: entero(1, 52),
  unidades: entero(1),
  semanas_pagadas: entero(0, 260),
  progreso: decimal(0, 1),
  aforo_delta: entero(-120_000, 120_000),
  bloqueo_aforo: entero(0),
  estado: EstadoObra,
  efectos: z.record(z.string(), z.unknown()),
}).superRefine((obra, ctx) => {
  if (obra.semanas_pagadas > obra.semanas_duracion) {
    ctx.addIssue({
      code: "custom",
      path: ["semanas_pagadas"],
      message: "semanas_pagadas no puede superar semanas_duracion (4.7)",
    });
  }
});

/** Entidad Evento / concierto del estadio (4.17). Se llama EventoEstadio para no chocar con el tipo `Evento` de la API. */
export const EventoEstadio = entidad({
  id: Uuid,
  estadio_id: Uuid,
  tipo: TipoEvento,
  nivel: entero(0, 3),
  semana: entero(1, 52),
  dias_preparacion: entero(1, 14),
  dias_desmontaje: entero(1, 7),
  aforo_evento: entero(1_000, 120_000),
  precio_medio_cent: CentNoNegativo,
  canon_fijo_cent: CentNoNegativo,
  porcentaje_club: decimal(0, 1),
  coste_cesped_cent: CentNoNegativo,
  estado: EstadoEvento,
});

export type Estadio = z.infer<typeof Estadio>;
export type SeccionEstadio = z.infer<typeof SeccionEstadio>;
export type Obra = z.infer<typeof Obra>;
export type EventoEstadio = z.infer<typeof EventoEstadio>;
