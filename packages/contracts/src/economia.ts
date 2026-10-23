import { z } from "zod";
import {
  Cent,
  CentNoNegativo,
  decimal,
  entero,
  entidad,
  Fecha,
  TramoPorcentaje,
  Uuid,
} from "./base";
import {
  AmortizacionPrestamo,
  CategoriaMovimiento,
  Division,
  EstadoMovimiento,
  FormaCobro,
  TipoContratoDerechos,
  ZonaPatrocinio,
} from "./enumeraciones";

/**
 * Entidad Caja (4.13). Una fila por club, clave `club_id` (sin id propio).
 * El saldo puede ser negativo dentro del descubierto.
 */
export const Caja = entidad({
  club_id: Uuid,
  saldo_cent: Cent,
  saldo_minimo_semana: Cent,
  saldo_cierre_temporada: Cent,
});

/** Entidad Movimiento (4.13). Importe positivo = ingreso, negativo = gasto. */
export const Movimiento = entidad({
  id: Uuid,
  club_id: Uuid,
  temporada_id: Uuid,
  semana: entero(1, 52),
  fecha_efectiva: Fecha,
  categoria: CategoriaMovimiento,
  subcategoria: z.string(),
  importe_cent: Cent,
  origen_id: Uuid.nullable(),
  estado: EstadoMovimiento,
  causa: z.string().min(1),
  secuencia_creacion: entero(1),
  afecta_caja: z.boolean(),
});

/** Entidad ContratoDerechos (4.14). */
export const ContratoDerechos = entidad({
  id: Uuid,
  temporada_id: Uuid,
  division: Division,
  tipo: TipoContratoDerechos,
  importe_total_temporada_cent: CentNoNegativo,
  tramos_cobro: z.array(TramoPorcentaje),
  operador: z.string(),
});

/** Entidad Patrocinio (4.15). */
export const Patrocinio = entidad({
  id: Uuid,
  club_id: Uuid,
  zona: ZonaPatrocinio,
  importe_fijo_anual_cent: CentNoNegativo,
  importe_variable_max_cent: CentNoNegativo,
  objetivo_variable_id: Uuid.nullable(),
  anios: entero(1, 10),
  fecha_inicio: Fecha,
  fecha_fin: Fecha,
  forma_cobro: FormaCobro,
});

/** Entidad Prestamo (4.16). Límite de 4 préstamos activos por club: constante del sistema (6.7). */
export const Prestamo = entidad({
  id: Uuid,
  club_id: Uuid,
  principal_cent: CentNoNegativo,
  tipo_interes_anual: decimal(0, 0.15),
  anios: entero(1, 10),
  amortizacion: AmortizacionPrestamo,
  saldo_pendiente_cent: CentNoNegativo,
  activo: z.boolean(),
  semana_disposicion: entero(1, 52),
});

export type Caja = z.infer<typeof Caja>;
export type Movimiento = z.infer<typeof Movimiento>;
export type ContratoDerechos = z.infer<typeof ContratoDerechos>;
export type Patrocinio = z.infer<typeof Patrocinio>;
export type Prestamo = z.infer<typeof Prestamo>;
