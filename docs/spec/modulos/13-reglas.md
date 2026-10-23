# Reglas de negocio y casos límite

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 12, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10, 12.11.

## 12. Reglas de negocio y casos límite

### 12.1 Plantilla

| Regla | Valor [D] |
|---|---|
| Plantilla registrada (inscritos en competición) | Mínimo 18, máximo 25 |
| Jugadores de cantera | Máximo 4 por plantilla (sin contratos profesionales vigentes). Reservada: la versión base no genera jugadores de cantera ni tiene campo para ellos, así que la regla no se aplica [D] (v0.8). |
| Porteros inscritos | Mínimo 2 |
| Jugadores sin contrato vigente | No pueden estar inscritos |
| Jugadores cedidos | No cuentan para la plantilla registrada |
| Límite de cláusulas casa y coche | 6 por club |

### 12.2 Extranjeros no comunitarios

**Regla de juego**: el número de jugadores no comunitarios inscritos en plantilla no puede superar 6 [NV; D].

**Definición de comunitario** [D]: nacional de un Estado de la Unión Europea o del Espacio Económico Europeo, o de Suiza. Es una regla propia del juego (A-15 y A-19, cerradas en v1.0); no pretende reproducir la normativa vigente de la liga.

**Casos**:

- Doble nacionalidad: cuenta como comunitario si al menos una nacionalidad es comunitaria. [D]
- Jugador con nacionalidad no comunitaria que adquiere nacionalidad comunitaria durante la temporada: pasa a comunitario desde la fecha de adquisición. [D]
- Cesión entrante: cuenta en el límite del club cedente y del receptor según el lado del contrato. [D] Simplificación: cuenta para el receptor.
- Intento de inscribir un séptimo no comunitario: el sistema bloquea la inscripción y muestra la causa. [D]
- Venta de un no comunitario que deja la plantilla con seis o menos: se libera el hueco. [D]

### 12.3 Límite de plantilla

- Límite de inscritos: 25 (regla de competición de juego) [D].
- Si la plantilla inscrita supera 25 por cesiones o contrataciones de emergencia: la inscripción excedente se bloquea.
- Lesionados de larga duración siguen inscritos. [D]

### 12.4 Casos de contrato

| Caso | Comportamiento [D] |
|---|---|
| Jugador vence contrato en junio sin renovación | Pasa a libre al cierre de temporada (semana 52); no genera ingreso. Desde la semana 1 de la temporada siguiente puede firmar con cualquier club. |
| Jugador lesionado durante la negociación | Se mantiene la negociación; la prima de firma se reduce 10 %. |
| Jugador con contrato vigente que pide rescisión sin ventana | Solo si es baja muy larga (más de 120 días). |
| Venta de jugador en fecha límite de ventana | Operación en vigor si se formaliza antes del cierre. |
| Doble cesión | No permitida. |
| Jugador mayor de 40 años | No se puede firmar contrato nuevo. Se mantiene el vigente. |

### 12.5 Casos de cláusulas económicas

- Cláusula casa y coche con jugador vendido: el bonus ya pagado no se devuelve. El número de cláusulas del club baja en uno. [D]
- Renovación con cláusula: se paga de nuevo el bonus con el número de cláusulas vigente en la renovación. [D]
- Cláusula de rescisión con contrato a punto de vencer (`anios_restantes = 1`): factor de 0,30 (6.6.2). [D]

### 12.6 Casos de patrocinio

- Patrocinio con objetivo no cumplido: solo se cobra la parte fija.
- Patrocinio de zona ocupada: no se puede firmar otro en la misma zona. [D]
- Naming de estadio al cambiar de club: el contrato sigue vigente en la propiedad del estadio. [D] No se aplica en la versión base.

### 12.7 Casos de estadio

- Obra cancelada con cuota a medias: se pierde el 50 % del coste pagado.
- Estadio sin aforo suficiente para partido: se pide trasladar el partido (7.4).
- Estadio con césped inutilizable: ver 7.6.
- Evento vetado por insonorización: no se puede programar. Si se programó antes de la obra, se cancela con indemnización del 20 % del canon fijo. [D]

### 12.8 Casos de descenso y ascenso

- Descenso de Primera: el club pasa a Segunda al cierre. Los contratos no se reducen. Si la masa salarial supera el ratio de 10.1 en Segunda, se aplica 10.2. El tope de 14.2 solo es aviso. [D] Cláusula de rescisión sin efecto por descenso. [D]
- Fondo de compensación: 2,5 % del pool audiovisual de Segunda para descendidos de Primera (6.9.3). [C] para el porcentaje; [D] para la base.
- Ascenso a Primera: contratos de jugadores de cantera o del club pasan a vigentes con su salario. [D]

### 12.9 Casos de caja

- Saldo negativo dentro del descubierto: se pagan los gastos, con interés (6.11).
- Saldo negativo superior al descubierto: se bloquean fichajes, obras y préstamos. Se pagan salarios y cuotas.
- Saldo nulo al cierre de temporada: sin efecto especial.

### 12.10 Casos de entrenador

- Despido durante la temporada: si `confianza_directiva` ≤ 20, probabilidad 0,25 cada semana. Como máximo un despido por temporada; si ya lo hubo, no hay cese adicional al cierre (9.7) [D].
- Oferta aceptada con contrato actual vigente: se paga la rescisión (9.8).
- Dos ofertas aceptadas el mismo día: prevalece la primera aceptada. [D]

### 12.11 Casos límite técnicos

- Un movimiento de caja que deja saldo exactamente igual al descubierto: permitido.
- Ingresos y pagos en el mismo tick: los cobros se aplican antes que los pagos, y los pagos siguen el orden de la columna "Orden" de 6.5 (regla de 5.2 y 6.5). [D]
- Dos eventos en el mismo tick que superan el aforo: se procesan en orden de `secuencia_creacion` ascendente, no por id. [D]

---

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 13 | Baja muy larga: más de 120 días. Rango de lesiones: 3 a 150 días. | 5.5.5, 6.6.2, 9.12.4, 12.4 |

## Glosario relacionado (sección 2)

| Término | Definición |
|---|---|
| Comunitario | Nacional de un Estado de la Unión Europea o del Espacio Económico Europeo, o de Suiza. [D] Ver 12.2. |
