import { z } from "zod";
import { entero, entidad, Fecha, Uuid } from "./base";
import { EstadoTemporada, TipoVentana } from "./enumeraciones";

/** Entidad Temporada (4.2). */
export const Temporada = entidad({
  id: Uuid,
  anio_inicio: entero(2020, 2100),
  etiqueta: z.string().regex(/^\d{4}\/\d{2}$/),
  fecha_inicio: Fecha,
  fecha_fin: Fecha,
  num_jornadas: z
    .number()
    .int()
    .refine((v) => v === 38 || v === 42, { message: "debe ser 38 o 42" }),
  ciclo_derechos: z.string().regex(/^\d{4}-\d{4}$/),
  estado: EstadoTemporada,
});

/** Entidad VentanaMercado (4.21). */
export const VentanaMercado = entidad({
  id: Uuid,
  temporada_id: Uuid,
  tipo: TipoVentana,
  semana_inicio: entero(1, 52),
  semana_fin: entero(1, 52),
  abierta: z.boolean(),
});

export type Temporada = z.infer<typeof Temporada>;
export type VentanaMercado = z.infer<typeof VentanaMercado>;
