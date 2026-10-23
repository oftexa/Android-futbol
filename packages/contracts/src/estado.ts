import { z } from "zod";
import { Abonado, Club, PersonalTecnico } from "./club";
import { Clasificacion, Competicion, Partido } from "./competicion";
import { Clausula, Cesion, Contrato } from "./contrato";
import { Entrenador, Objetivo, Oferta } from "./entrenador";
import { Caja, ContratoDerechos, Movimiento, Patrocinio, Prestamo } from "./economia";
import { Estadio, EventoEstadio, Obra, SeccionEstadio } from "./estadio";
import { Jugador, Seguro } from "./jugador";
import { Partida } from "./partida";
import { Temporada, VentanaMercado } from "./temporada";
import { entero } from "./base";
import { ModoJuego } from "./enumeraciones";

/** Parámetros de equilibrio aplanados (packs, 5.1 de la arquitectura). Clave → valor numérico. */
export const Parametros = z.record(z.string(), z.number());

/** Paquetes ya validados que recibe `crearPartida`. Forma provisional: se afina con el cargador de packs. */
export const PaquetesCargados = z.strictObject({
  equilibrio: Parametros,
  datos_temporada: z.record(z.string(), z.unknown()),
});

/** Opciones de una partida nueva. */
export const OpcionesPartida = z.strictObject({
  semilla: z.bigint().min(0n),
  club_codigo: z.string().regex(/^[PST]\d{2}$/),
  modo_juego: ModoJuego,
  renovacion_automatica: z.boolean(),
});

/**
 * Estado completo de una partida: un array por entidad, cada uno ordenado por `codigo` o por `id`
 * cuando la entidad no tiene código (regla de oro 7).
 */
export const EstadoPartida = z.strictObject({
  partida: Partida,
  temporadas: z.array(Temporada),
  competiciones: z.array(Competicion),
  clubes: z.array(Club),
  abonados: z.array(Abonado),
  estadios: z.array(Estadio),
  secciones: z.array(SeccionEstadio),
  obras: z.array(Obra),
  eventos: z.array(EventoEstadio),
  jugadores: z.array(Jugador),
  seguros: z.array(Seguro),
  personal: z.array(PersonalTecnico),
  contratos: z.array(Contrato),
  clausulas: z.array(Clausula),
  cesiones: z.array(Cesion),
  entrenadores: z.array(Entrenador),
  objetivos: z.array(Objetivo),
  ofertas: z.array(Oferta),
  cajas: z.array(Caja),
  movimientos: z.array(Movimiento),
  derechos: z.array(ContratoDerechos),
  patrocinios: z.array(Patrocinio),
  prestamos: z.array(Prestamo),
  ventanas: z.array(VentanaMercado),
  partidos: z.array(Partido),
  clasificaciones: z.array(Clasificacion),
});

/** Consulta a `consultar` (3.3). Las consultas concretas se definen en su tarea. */
export const Consulta = z.looseObject({
  tipo: z.string().regex(/^[a-z][a-z0-9_]*$/),
});

/** Proyección de caja a N semanas (6.1, sin sorteos). Forma provisional. */
export const Proyeccion = z.strictObject({
  semanas: entero(1, 520),
  saldos_cent: z.array(z.number().int()),
  minimo_cent: z.number().int(),
});

export type Parametros = z.infer<typeof Parametros>;
export type PaquetesCargados = z.infer<typeof PaquetesCargados>;
export type OpcionesPartida = z.infer<typeof OpcionesPartida>;
export type EstadoPartida = z.infer<typeof EstadoPartida>;
export type Consulta = z.infer<typeof Consulta>;
export type Proyeccion = z.infer<typeof Proyeccion>;
