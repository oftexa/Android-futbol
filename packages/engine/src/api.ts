// API pública del núcleo (arquitectura 3.3). Contrato estable: stubs hasta que cada tarea lo implemente.
// Las firmas se tipan con el contrato y los parámetros no se nombran en la implementación,
// para que el lint de parámetros sin uso no falle en los stubs.
import type {
  Comando,
  Consulta,
  EstadoPartida,
  OpcionesPartida,
  PaquetesCargados,
  Proyeccion,
  ResultadoComando,
  ResultadoTick,
} from "@af4/contracts";

/** Respuesta de una consulta concreta. La forma exacta se define con cada consulta (3.3, `consultas/`). */
// TODO(3.3): se concreta cuando exista el primer catálogo de consultas.
export type RespuestaDe<Q extends Consulta> = Q extends Consulta ? unknown : never;

export const crearPartida: (p: PaquetesCargados, o: OpcionesPartida) => EstadoPartida = () => {
  throw new Error("no implementado");
};

export const aplicarComando: (e: EstadoPartida, c: Comando) => ResultadoComando = () => {
  throw new Error("no implementado");
};

/** Un tick (5.2). */
export const avanzarSemana: (e: EstadoPartida) => ResultadoTick = () => {
  throw new Error("no implementado");
};

/** Proyección de caja a N semanas (6.1), sin sorteos. */
export const proyectarCaja: (e: EstadoPartida, semanas: number) => Proyeccion = () => {
  throw new Error("no implementado");
};

export const consultar: <Q extends Consulta>(e: EstadoPartida, q: Q) => RespuestaDe<Q> = () => {
  throw new Error("no implementado");
};
