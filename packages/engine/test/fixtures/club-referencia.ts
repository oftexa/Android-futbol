// Club de referencia de la especificación 1.0 (sección 23, encabezado: Primera, aforo 42.800,
// R = 60, aficion_moral = 60, fans_activos = 25.680, antigüedad 0, precio de taquilla 45 €,
// posición 10.ª en las 5 temporadas del historial). Datos ficticios (decisiones 5 y 6).
//
// Fuentes: secciones 4.4, 4.5, 4.6, 7.1 y 15.2 de la especificación, y las entradas de
// tools/calc/check.py. Donde un campo obligatorio no tiene valor en la especificación se pone un
// valor razonable y se marca con "[supuesto]".

import type { Cent, Club, Estadio, SeccionEstadio } from "@af4/contracts";

const cent = (importe: number): Cent => importe as Cent;

const AUDITORIA = {
  creado_en: "2026-07-01T00:00:00Z",
  actualizado_en: "2026-07-01T00:00:00Z",
  version: 1,
};

// Identificadores UUID v4 ficticios y fijos (los tests no dependen de su valor).
export const ID_CLUB = "00000000-0000-4000-8000-000000000001";
export const ID_ESTADIO = "00000000-0000-4000-8000-000000000002";
/** Contrato de naming rights del estadio (carga, 8.3: naming de 12 M€ al año). */
export const ID_NAMING = "00000000-0000-4000-8000-000000000003";

function idSeccion(n: number): string {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

/** Club de referencia (4.4). */
export const CLUB_REFERENCIA: Club = {
  id: ID_CLUB,
  codigo: "P10", // [supuesto] código ficticio; la especificación usa "P10" en la carga (15.5).
  nombre: "Club de referencia",
  division_actual: "primera",
  reputacion: 60,
  seguidores_club: 505_680, // aforo_total × 0,6 + reputacion × 8.000 (4.4)
  fans_activos: 25_680, // aforo_total × 0,6 (4.4)
  ingresos_base_temporada_cent: null, // opcional, el motor no lo usa (4.4)
  precio_taquilla_cent: cent(4_500), // p_ref de Primera: 45 € (4.4)
  plan_entrenamiento: "normal",
  plan_entrenamiento_siguiente: "normal",
  victorias_consecutivas: 0,
  derrotas_consecutivas: 0,
  racha: 0,
  despidos_temporada: 0,
  bases_negativas: [],
  // 19 × 674.235 € (taquilla) + 25.680 × 600 € (abonos) = 28.218.465 € por temporada (15.2).
  recaudacion_historica_cent: [
    cent(2_821_846_500),
    cent(2_821_846_500),
    cent(2_821_846_500),
    cent(2_821_846_500),
    cent(2_821_846_500),
  ],
  historial_posiciones: Array.from({ length: 5 }, () => ({ division: "primera", posicion: 10 })),
  // [supuesto] Asistencia de 8.2 con factores neutros: 0,8 × 42.800 = 34.240 (15.2, 6.9.2).
  aforo_medio_anterior: 34_240,
  descubierto_limite_cent: cent(2_000_000_000), // 20 M€ en Primera (4.4)
  // [supuesto] Secretaría 2 M€ (15.5, tabla de 14.2). El campo es el gasto anual de secretaría.
  secretaria_honorarios_anual_cent: cent(200_000_000),
  // Personal de dirección 3 M€ (15.5). Los 6 técnicos se modelan aparte como PersonalTecnico.
  personal_costes_anual_cent: cent(300_000_000),
  modo_juego: "coach", // [supuesto] el MVP solo tiene Coach (Anexo A, F2).
  promanager_desbloqueado: false,
  gestor_caja: "jugador", // Coach (4.4, 9.1).
  aficion_moral: 60, // Inicial 60 (4.4).
  confianza_directiva: 60, // Inicial 60 (4.4).
  // [supuesto] La carga da turismo_alto a los 3 clubes de mayor reputación (15.2) y no hay
  // datos del resto de clubes; se deja falso.
  turismo_alto: false,
  // [supuesto] La carga da ciudad_grande a los 4 clubes de Primera con mayor aforo (15.2). Sin
  // datos del resto de clubes, se deja falso.
  ciudad_grande: false,
  renovacion_automatica: false, // Por defecto (4.4).
  ...AUDITORIA,
};

/** Estadio de referencia (4.5, 7.1). */
export const ESTADIO_REFERENCIA: Estadio = {
  id: ID_ESTADIO,
  club_id: ID_CLUB,
  nombre: "Estadio de referencia",
  naming_contrato_id: ID_NAMING,
  aforo_total: 42_800, // suma de plazas de las secciones de localidades (7.1)
  aforo_disponible_hoy: 42_800, // sin bloqueos de obra ni de evento
  cesped_estado: 90, // empieza en 90 cada temporada (7.6)
  insonorizacion_nivel: 0, // 7.1
  cubierta: false, // 7.1
  pantalla_led: true, // 7.1
  cesped_calefactado: false, // 7.1
  antiguedad_anios: 0, // 6.12, 7.1
  cafeterias_max: 20, // 4.5, valor fijo
  cafeterias_numero: 1, // Inicial 1 (8.5)
  obras_activas_max: 3, // 7.2: 3 por defecto
  ...AUDITORIA,
};

/** Secciones del estadio de referencia (7.1). Los espacios valen 1 plaza, como indica 7.1. */
export const SECCIONES_REFERENCIA: SeccionEstadio[] = [
  { tipo: "grada_general", plazas: 18_000, ocupacion_maxima: 0.95 },
  { tipo: "grada_preferente", plazas: 14_000, ocupacion_maxima: 0.8 },
  { tipo: "grada_fondo", plazas: 9_000, ocupacion_maxima: 0.9 },
  { tipo: "palcos", plazas: 1_200, ocupacion_maxima: 0.95 }, // 120 palcos de 10 plazas
  { tipo: "zona_vip", plazas: 600, ocupacion_maxima: 0.95 },
  // [supuesto] Las secciones que no son de localidades no tienen ocupación en 4.6; se usa 1.
  { tipo: "hospitality", plazas: 500, ocupacion_maxima: 1 },
  { tipo: "museo", plazas: 1, ocupacion_maxima: 1 },
  { tipo: "tienda_fisica", plazas: 1, ocupacion_maxima: 1 },
  { tipo: "restauracion", plazas: 1, ocupacion_maxima: 1 },
  { tipo: "aparcamiento", plazas: 1, ocupacion_maxima: 1 },
].map((seccion, indice) => ({
  id: idSeccion(indice + 1),
  estadio_id: ID_ESTADIO,
  precio_base_partido_cent: null, // reservado (4.6)
  estado_fisico: 100, // valor fijo (4.6)
  activa: true,
  ...seccion,
  ...AUDITORIA,
})) as SeccionEstadio[];

/**
 * Entradas de check.py que no son campos de contrato (23, encabezado y bloques 23.3 a 23.6).
 * No se guardan en el club: son parámetros de cálculo o de la carga.
 */
export const DATOS_REFERENCIA = {
  /** Reputación del rival en agosto (6.12, ejemplo de saldo). */
  reputacion_rival_agosto: 25,
  /** Posición de liga de la temporada anterior, la misma en las 5 del historial (6.9.2). */
  posicion_liga: 10,
  /** Implantación social media del club (6.9.2): reparto de 1/20 del pool de implantación. */
  implantacion_fraccion: 1 / 20,
  /** Saldo inicial de caja con R = 60 en Primera: 15.000.000 € (23.1, generador). */
  caja_inicial_cent: cent(1_500_000_000),
  /** Abonos del club de referencia: 0,60 × 42.800 = 25.680 (4.4, 6.2.2). */
  porcentaje_abonados: 0.6,
  /** Partidos de local por temporada en Primera (4.2). */
  partidos_local_primera: 19,
  /** Semilla de carga usada en los tests de antigüedad (23.1). [supuesto] Propuesta, no fijada en la especificación. */
  semilla_carga: 2026n,
} as const;
