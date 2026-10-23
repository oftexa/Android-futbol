import { z } from "zod";
import { CentNoNegativo, decimal, entero, entidad, Fecha, Uuid } from "./base";
import { EstadoContrato, FormaPago, FormulaClausula, TipoClausula } from "./enumeraciones";

/** Tramo (semana, porcentaje) de un cobro aplazado. Los porcentajes deben sumar 1 (4.9). */
const TramoAplazado = z.strictObject({ semana: entero(1, 52), porcentaje: decimal(0, 1) });

/** Entidad Contrato (4.9). */
export const Contrato = entidad({
  id: Uuid,
  jugador_id: Uuid,
  club_id: Uuid,
  salario_anual_bruto_cent: z.number().int().min(0).max(2_000_000_000).brand<"Cent">(),
  fecha_inicio: Fecha,
  anios_duracion: entero(1, 6),
  anios_restantes: entero(0, 6),
  fecha_fin: Fecha,
  forma_pago: FormaPago,
  plazos_aplazado: z
    .array(TramoAplazado)
    .refine((tramos) => Math.abs(tramos.reduce((s, t) => s + t.porcentaje, 0) - 1) < 1e-9, {
      message: "los porcentajes de plazos_aplazado deben sumar 1",
    })
    .nullable(),
  coste_fichaje_cent: CentNoNegativo,
  amortizacion_restante_cent: CentNoNegativo,
  clausulas_ids: z.array(Uuid),
  estado: EstadoContrato,
});

/** Entidad Clausula (4.10). Fuente de verdad de las cláusulas económicas de contrato. */
export const Clausula = entidad({
  id: Uuid,
  contrato_id: Uuid,
  tipo: TipoClausula,
  activa: z.boolean(),
  importe_cent: CentNoNegativo,
  formula: FormulaClausula,
  pagado: z.boolean(),
});

/** Entidad Cesion (4.27). `id` coincide con `Jugador.cesion_id`. */
export const Cesion = entidad({
  id: Uuid,
  jugador_id: Uuid,
  club_origen_id: Uuid,
  club_destino_id: Uuid,
  temporada_id: Uuid,
  cuota_cesion_cent: CentNoNegativo,
  porcentaje_salario_tercero: decimal(0, 1),
  semana_inicio: entero(1, 52),
});

export type Contrato = z.infer<typeof Contrato>;
export type Clausula = z.infer<typeof Clausula>;
export type Cesion = z.infer<typeof Cesion>;
