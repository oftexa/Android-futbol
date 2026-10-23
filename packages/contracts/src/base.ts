import { z } from "zod";

// Primitivos compartidos por todas las entidades (especificación 4.1).

export const Uuid = z.uuidv4();
export const Fecha = z.iso.date();
export const FechaHora = z.iso.datetime();

/** Entero en [min, max]. */
export function entero(min: number, max: number = Number.MAX_SAFE_INTEGER) {
  return z.number().int().min(min).max(max);
}

/** Decimal en [min, max]. */
export function decimal(min: number, max: number) {
  return z.number().min(min).max(max);
}

/** Porcentaje como decimal en [0, 1]. */
export const Porcentaje = decimal(0, 1);

/** Entero que debe pertenecer a un conjunto cerrado de valores (p. ej. -1, 0, 1). */
export function enteroEn(valores: readonly number[]) {
  return z
    .number()
    .int()
    .refine((v) => valores.includes(v), { message: `debe ser uno de: ${valores.join(", ")}` });
}

/**
 * Importe monetario en céntimos de euro, entero (4.1, regla de oro 2).
 * Nunca es coma flotante: un valor no entero se rechaza al validar.
 */
export const Cent = z.number().int().brand<"Cent">();
export type Cent = z.infer<typeof Cent>;

/** Importe en céntimos en [min, max]. */
export function centEn(min: number, max: number) {
  return z.number().int().min(min).max(max).brand<"Cent">();
}

/** Importe en céntimos, no negativo. */
export const CentNoNegativo = centEn(0, Number.MAX_SAFE_INTEGER);

/** Campos de auditoría comunes a todas las entidades (4.1). */
export const Auditoria = {
  creado_en: FechaHora,
  actualizado_en: FechaHora,
  version: entero(1),
};

/** Entidad estricta (sin campos extra) con auditoría. */
export function entidad<T extends z.ZodRawShape>(forma: T) {
  return z.strictObject({ ...forma, ...Auditoria });
}

/** Par (semana, porcentaje) usado por cobros aplazados y tramos (4.9, 4.14). */
export const TramoPorcentaje = z.strictObject({
  semana: entero(1, 52),
  porcentaje: Porcentaje,
});
