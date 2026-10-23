# Especificación

- `especificacion.md`: fuente única de verdad. Solo se edita esta versión aprobada (0.9, 1.0...).
- `mapa-secciones.json`: asignación de cada sección a un módulo (tabla 4.1 de la arquitectura).
- `modulos/*.md` y `criterios.md`: generados con `pnpm spec:split`. No los edites; `pnpm spec:check` (dentro de `pnpm verify`) falla si no coinciden.

Ver `tools/spec-split/README.md`.
