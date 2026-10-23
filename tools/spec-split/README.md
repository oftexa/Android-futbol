# spec-split

Trocea `docs/spec/especificacion.md` en módulos para los agentes (arquitectura, sección 13.5).

- `pnpm spec:split` regenera `docs/spec/modulos/*.md` y `docs/spec/criterios.md`.
- `pnpm spec:check` falla si esos archivos no coinciden con lo generado (edición a mano o especificación cambiada sin regenerar). Forma parte de `pnpm verify`.

Reglas:

- El mapa `docs/spec/mapa-secciones.json` asigna cada sección de primer y segundo nivel (`## N` y `### N.M`) a un módulo. El script falla si queda alguna sin asignar, si el mapa cita una sección inexistente o un módulo no declarado.
- Cada sección se copia literalmente. Las filas de la tabla 0.3 y las entradas del glosario (sección 2) que citan secciones de un módulo se añaden al final de ese módulo; la sección 0.3 completa va en `comun.md`.
- Los criterios `- [ ]` de la sección 23 se numeran dentro de su bloque (`AC-23.x-yy`). Si se inserta o quita un criterio, cambian los ids posteriores.
- Sin dependencias: solo expresiones regulares y Node. Código en `src/split.ts` (lógica pura) y `src/cli.ts` (E/S). Tests en `test/`.

No edites `docs/spec/modulos/` ni `docs/spec/criterios.md` a mano: cambia `especificacion.md` o el mapa y ejecuta `pnpm spec:split`.
