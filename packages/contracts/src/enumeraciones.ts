import { z } from "zod";

// Enumeraciones de la especificación, sección 20. Valores en minúscula con guion bajo.
// Las marcadas "no listada en 20" salen de la tabla de su entidad (4.x).

export const Division = z.enum(["primera", "segunda"]);
export const ModoJuego = z.enum(["coach", "manager", "president", "total", "promanager"]);
export const TipoObjetivo = z.enum([
  "posicion_final",
  "puntos_minimos",
  "copa",
  "presupuesto_no_superar",
  "saldo_minimo",
  "aforo_medio_minimo",
  "fichajes_maximos",
  "permanencia",
]);
export const TipoSeccion = z.enum([
  "grada_general",
  "grada_preferente",
  "grada_fondo",
  "palcos",
  "hospitality",
  "zona_vip",
  "museo",
  "tienda_fisica",
  "restauracion",
  "zona_eventos",
  "aparcamiento",
]);
/** Tipos de obra de la tabla 7.2 (enumeración 20: "Ver 7.2"). */
export const TipoObra = z.enum([
  "ampliar_grada_general",
  "ampliar_preferente",
  "construir_palcos",
  "construir_hospitality",
  "construir_museo",
  "tienda_fisica",
  "nueva_cafeteria",
  "cubierta_gradas",
  "insonorizacion_nivel_1",
  "insonorizacion_nivel_2",
  "insonorizacion_nivel_3",
  "cesped_calefactado",
  "pantalla_led",
  "aparcamiento",
  "reforma_general",
]);
export const EstadoObra = z.enum(["planificada", "en_curso", "finalizada", "cancelada"]);
export const EstadoContrato = z.enum(["vigente", "rescindido", "finalizado", "cedido"]);
export const FormaPago = z.enum(["doce_mensualidades", "diez_mensualidades", "aplazado"]);
export const EstadoMovimiento = z.enum(["previsto", "efectivo", "anulado"]);
export const CategoriaMovimiento = z.enum([
  "taquilla",
  "abonos",
  "palcos",
  "hospitality",
  "derechos_tv",
  "comercializacion",
  "patrocinio",
  "vallas",
  "merchandising",
  "restauracion",
  "museo",
  "eventos",
  "naming",
  "traspasos",
  "seguros_cobro",
  "competicion",
  "salarios_jugadores",
  "personal",
  "amortizacion",
  "primas",
  "rescision",
  "seguros_gasto",
  "medico",
  "mantenimiento",
  "obras",
  "prestamos",
  "impuestos",
  "clausula_casa_coche",
  "honorarios_tecnico",
  "intereses_descubierto",
  "explotacion_cafeterias",
  "entrenamientos",
  "sanciones",
  "aparcamiento",
  "derechos_imagen",
]);
export const TipoContratoDerechos = z.enum([
  "nacional",
  "internacional",
  "digital",
  "comercializacion",
]);
export const FormulaClausula = z.enum(["fija", "por_anios_restantes", "por_numero_casa_coche"]);
export const EstadoTemporada = z.enum(["pretemporada", "competicion", "cerrada"]);
export const FormaCobro = z.enum(["mensual", "trimestral", "anual_inicio"]);
/** Subcategoría de `prestamos` (enumeración 20). */
export const SubcategoriaPrestamo = z.enum(["principal", "intereses"]);
export const TipoEvento = z.enum([
  "concierto",
  "evento_corporativo",
  "competicion_no_futbol",
  "otro",
]);
export const EstadoEvento = z.enum(["propuesto", "confirmado", "celebrado", "cancelado", "vetado"]);
export const EstadoEntrenador = z.enum(["activo", "despedido", "dimitido", "en_paro"]);
export const EstadoOferta = z.enum(["pendiente", "aceptada", "rechazada", "caducada"]);
export const ZonaPatrocinio = z.enum([
  "camiseta_pecho",
  "camiseta_manga",
  "camiseta_espalda",
  "estadio_fondo",
  "estadio_led",
  "entrenamiento",
  "digital",
  "naming",
]);
export const PosicionJugador = z.enum(["portero", "defensa", "centrocampista", "delantero"]);
export const IntensidadEntrenamiento = z.enum(["suave", "normal", "intenso"]);

// Enumeraciones que aparecen en las tablas de entidad y no están listadas en la sección 20.

/** Tipo de cláusula económica (4.10). */
export const TipoClausula = z.enum(["casa_coche", "rescision", "prima_gol"]);
/** Rol del personal técnico (4.19). */
export const RolPersonal = z.enum([
  "preparador_fisico",
  "medico",
  "fisioterapeuta",
  "ojeador",
  "analista",
  "ayudante",
]);
/** Tipo de ventana de mercado (4.21, 11.3). */
export const TipoVentana = z.enum(["verano", "invierno"]);
/** Quién lleva la caja (4.4). */
export const GestorCaja = z.enum(["jugador", "directiva"]);
/** Origen de un objetivo (4.12). */
export const OrigenObjetivo = z.enum(["directiva", "automatico", "promanager"]);
/** Sistema de amortización de un préstamo (4.16, 6.7). */
export const AmortizacionPrestamo = z.enum(["lineal", "francesa"]);
/** Unidad de un desglose (3.3 de la arquitectura). */
export const UnidadDesglose = z.enum(["cent", "personas", "ratio", "puntos"]);

export type Division = z.infer<typeof Division>;
export type ModoJuego = z.infer<typeof ModoJuego>;
export type TipoObjetivo = z.infer<typeof TipoObjetivo>;
export type TipoSeccion = z.infer<typeof TipoSeccion>;
export type TipoObra = z.infer<typeof TipoObra>;
export type EstadoObra = z.infer<typeof EstadoObra>;
export type EstadoContrato = z.infer<typeof EstadoContrato>;
export type FormaPago = z.infer<typeof FormaPago>;
export type EstadoMovimiento = z.infer<typeof EstadoMovimiento>;
export type CategoriaMovimiento = z.infer<typeof CategoriaMovimiento>;
export type TipoContratoDerechos = z.infer<typeof TipoContratoDerechos>;
export type FormulaClausula = z.infer<typeof FormulaClausula>;
export type EstadoTemporada = z.infer<typeof EstadoTemporada>;
export type FormaCobro = z.infer<typeof FormaCobro>;
export type SubcategoriaPrestamo = z.infer<typeof SubcategoriaPrestamo>;
export type TipoEvento = z.infer<typeof TipoEvento>;
export type EstadoEvento = z.infer<typeof EstadoEvento>;
export type EstadoEntrenador = z.infer<typeof EstadoEntrenador>;
export type EstadoOferta = z.infer<typeof EstadoOferta>;
export type ZonaPatrocinio = z.infer<typeof ZonaPatrocinio>;
export type PosicionJugador = z.infer<typeof PosicionJugador>;
export type IntensidadEntrenamiento = z.infer<typeof IntensidadEntrenamiento>;
export type TipoClausula = z.infer<typeof TipoClausula>;
export type RolPersonal = z.infer<typeof RolPersonal>;
export type TipoVentana = z.infer<typeof TipoVentana>;
export type GestorCaja = z.infer<typeof GestorCaja>;
export type OrigenObjetivo = z.infer<typeof OrigenObjetivo>;
export type AmortizacionPrestamo = z.infer<typeof AmortizacionPrestamo>;
export type UnidadDesglose = z.infer<typeof UnidadDesglose>;
