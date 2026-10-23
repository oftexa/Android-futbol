# Control económico

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 10, 10.1, 10.2, 10.3, 10.4, 23.8.

## 10. Control económico

### 10.1 Indicadores

| Indicador | Definición | Umbral (Primera) | Umbral (Segunda) | Confianza |
|---|---|---|---|---|
| Ratio masa salarial | `masa_salarial / (INCN + traspasos_netos)` | 0,60 | 0,60 [D] | [NV, P-10] para 60 % en Primera (fuente sin URL localizada); [D] para Segunda. |
| Ratio UEFA de referencia | Mismo cálculo con umbral de gasto | 0,70 desde 2025/26 | No aplica | [NV, P-10]. Se usa solo como aviso. |
| Pérdidas permitidas | Pérdida neta del ejercicio máxima | 60 M€ | 15 M€ [D] | [NV] para 60 M€ (P-10, sin URL localizada; año no confirmado, ver 17.1). Valor de juego [D] fijado en v1.0: no depende de contrastar la fuente; [D] para Segunda. |
| Deuda neta / EBITDA | Deuda neta dividida entre EBITDA | 1,5 (referencia, no límite) | 2,0 [D] | [NV] para el valor de 2024/25 (17.2, punto 4); no es límite. |
| Límite de inversión en fichajes | Gasto de fichajes de la temporada, según el juego | 1,5 × INCN del ejercicio anterior [D] | 1,5 × INCN del ejercicio anterior [D] | [D]. Umbral operativo. Las cifras de clubes reales no se usan (17.1). Precisión [D] (v0.8): gasto de fichajes = Σ costes de fichaje + comisiones de la temporada. En 2026/27, "INCN del ejercicio anterior" = INCN previsto de 2026/27 al cargar (repartos de 6.9 + taquilla proyectada de 6.1). Club de referencia (v0.9): 1,5 × 135,06 = 202,59 M€. |

**Lectura del ratio de 60 %**: la referencia lo describe como ratio entre plantilla y la suma de INCN y traspasos [NV, P-10]. En el juego se aplica al ejercicio en curso.

**Definiciones**:

```
INCN = Σ importes de las categorías derechos_tv (nacional, internacional y digital), taquilla y comercializacion de la temporada, sin traspasos [D] (decisión de producto 16). Quedan fuera merchandising, restauración, eventos, patrocinios, museo, naming, palcos, hospitality y abonos.
traspasos_netos = Σ ventas − Σ compras de la temporada
masa_salarial = salarios_jugadores + personal (técnico, secretaría y dirección, 6.3.2) + honorarios_tecnico (entrenador) [D]. Es la única definición de masa salarial del documento.
EBITDA = resultado de explotación + amortizaciones
deuda_neta = préstamos_activos − Caja.saldo_cent (con saldo negativo, el descubierto suma a la deuda)
```

Precisiones [D] (v0.8): `préstamos_activos` = Σ `saldo_pendiente_cent`. Si `INCN + traspasos_netos ≤ 0`, el ratio de masa salarial se trata como superior a 0,65. Todos los importes son de la temporada en curso hasta la semana de la comprobación. `resultado de explotación` = `beneficio_contable_ejercicio` de 6.8 sin intereses de préstamo ni de descubierto y sin el apunte de beneficio de traspasos.

### 10.2 Aplicación de sanciones

| Situación | Consecuencia [D] |
|---|---|
| Ratio masa salarial entre 0,60 y 0,65 | Aviso. No hay sanción. |
| Ratio masa salarial superior a 0,65 | Bloqueo de nuevas altas salariales hasta regularizar. |
| Pérdida superior a la permitida | Multa de 10 % del exceso. Confianza de directiva −20. |
| Pérdida superior al 150 % del límite | Bloqueo de fichajes durante una ventana. Coste de reputación del club −5. |
| Descubierto sostenido | Dos cierres seguidos: aviso de venta forzosa. Tres cierres seguidos: venta forzosa automática (6.11, B-1). |
| Límite de inversión superado | Bloqueo de fichajes hasta reducir el gasto del periodo. |

Las sanciones se comunican en la pantalla de control económico, con su causa y su plazo de regularización.

Precisiones [D] (v0.8):

- Descubierto por encima del límite en un solo cierre de mes: bloqueo de fichajes, obras nuevas y préstamos (12.9) y aviso; sin multa.
- "Regularizar" = que la condición deje de cumplirse en la siguiente comprobación del mismo tipo (cierre de mes para el descubierto; semana 26 o 52 para los ratios).
- "Durante una ventana" = la siguiente ventana de mercado completa.
- La multa del 10 % se registra en la semana de la comprobación (fila de multas de 6.5).

**Nota de realismo**: la liga real aplica sanciones y prohibiciones de inscripción según su propio reglamento; la lista anterior es una simplificación de juego. [D]

### 10.3 Comprobaciones

- Comprobación intermedia: al cierre de diciembre (semana 26) [D]. Contenido [D] (v0.8): ratio de masa salarial y límite de inversión con los importes acumulados de las semanas 1 a 26. Las pérdidas permitidas solo se evalúan en la semana 52.
- Comprobación final: al cierre de ejercicio, 30 de junio (semana 52) [D].
- Comprobación mensual del descubierto (6.11).

### 10.4 Techo de gasto por temporada (modos President, Total y Manager)

- En modo Coach (y Promanager) no hay techo de gasto ni aviso de presupuesto: el jugador lleva la caja sin presupuesto fijo (9.1, decisión de producto 1).
- Presupuesto por temporada (President, Total y Manager): ingresos previstos del club + saldo inicial − saldo mínimo de seguridad (propuesta: 5 M€ Primera; 2 M€ Segunda) [D]. En Manager es el valor de `presupuesto_no_superar` (9.3), fijado en la semana 1 con la proyección de 6.1 [D] (v0.9, B-2).
- Si el gasto previsto supera el presupuesto, la pantalla muestra aviso, pero no bloquea (salvo las reglas de 10.2).

---

### 23.8 Control económico (sección 10)

- [ ] INCN solo con derechos (nacional, internacional y digital), taquilla y comercialización.
- [ ] Club de referencia sin traspasos: masa salarial 60 + 8 + 1,26 = 69,26 M€; INCN 58,9703 + 63,2810 + 12,8105 = 135,06 M€; ratio 0,513 (sin aviso); límite de inversión 1,5 × INCN = 202,59 M€.
- [ ] Ratio 0,62: aviso; 0,66: bloqueo de altas salariales hasta la siguiente comprobación con ratio ≤ 0,65.
- [ ] Pérdida de 70 M€ en Primera: multa de 1 M€ y confianza −20; pérdida de 95 M€: además bloqueo de la siguiente ventana y reputación del club −5 (una sola vez).
- [ ] La semana 26 evalúa ratio y límite de inversión; la 52, además, pérdidas.
- [ ] Descubierto sostenido: aviso al 2.º cierre seguido y venta forzosa al 3.º (6.11, 10.2).

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Modo Coach: la caja la gestiona el jugador, sin presupuesto fijo de la directiva. En Coach no existe el objetivo `presupuesto_no_superar` ni techo de gasto, y no hay consecuencias ligadas a ese objetivo. | 4.4 (`gestor_caja`), 9.1, 9.3, 9.13, 10.4, 13.1, A-02 |
| 16 | INCN: solo derechos, taquilla y comercialización. | 10.1 |
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 32 | Ronda 0.9, B-2. Tres objetivos por temporada: deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda). Manager: `presupuesto_no_superar` = presupuesto de 10.4. Un entrenador sin club recibe siempre al menos 1 oferta. En Coach y Promanager no se asigna `saldo_minimo` (decisión 46, v1.0). | 9.1, 9.3, 9.8, 9.9, 10.4, 13.7 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Masa salarial | Definición única en 10.1. |
| Ingresos netos de competición (INCN) | Definición única en 10.1. |
