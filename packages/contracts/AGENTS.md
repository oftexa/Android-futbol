# contracts

Esquemas Zod de las entidades (especificación 4.2 a 4.27), enumeraciones (20), tipos de API (3.3), con los tipos TypeScript inferidos (`z.infer`).

## Qué exporta

- `src/base.ts`: primitivos (`Uuid`, `Fecha`, `FechaHora`, `Cent`, `CentNoNegativo`, `centEn`, `entero`, `decimal`, `Porcentaje`, `enteroEn`, `entidad`, `Auditoria`, `TramoPorcentaje`).
- `src/enumeraciones.ts`: enumeraciones de la sección 20 y las de las tablas de entidad no listadas en ella.
- Entidades, un archivo por grupo: `temporada.ts`, `competicion.ts`, `club.ts`, `estadio.ts`, `jugador.ts`, `contrato.ts`, `entrenador.ts`, `economia.ts`, `partida.ts`.
- Tipos de API: `causa.ts` (`Causa`), `desglose.ts` (`Desglose`), `comando.ts` (`Comando`), `evento.ts` (`Evento`), `estado.ts` (`EstadoPartida`, `Parametros`, `PaquetesCargados`, `OpcionesPartida`, `Consulta`, `Proyeccion`), `resultados.ts` (`ResultadoComando`, `ResultadoTick`).
- `src/index.ts` reexporta todo.

## Reglas

1. Solo tipos y validación. Sin lógica de negocio, sin cálculos, sin E/S.
2. Importes SIEMPRE con `Cent` (entero en céntimos). Nunca `z.number()` a secas para un importe.
3. Objetos estrictos (`z.strictObject`, `entidad()`): los campos extra se rechazan.
4. Toda entidad usa `entidad({...})`, que añade `creado_en`, `actualizado_en` y `version` (4.1).
5. Rangos de la tabla de cada entidad en el esquema. Las reglas cruzadas (p. ej. `precio_taquilla_cent` según la división, `cafeterias_numero <= cafeterias_max`) solo se validan cuando están marcadas en el esquema; el resto queda en `docs/preguntas.md`.
6. `EventoEstadio` es la entidad de 4.17; `Evento` es el evento del núcleo (3.3). No renombrar.
7. Comando y Evento tienen envoltorio genérico (`tipo` + `payload`). El `payload` concreto se define en la tarea de cada comando o evento, nunca aquí sin tarea.
8. Protegido (`tools/guardas`, permiso `modelo-mayor`): cambiarlo requiere etiqueta `modelo-mayor` o una persona.

## Tests

`test/entidades.spec.ts` cubre AC-23.1-01 (rangos rechazados) y AC-23.1-02 (importes enteros). `test/fixtures.ts` tiene ejemplos válidos.
