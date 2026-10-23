# Pantallas y flujos de usuario

Generado desde especificacion.md v1.0 — no editar. Regenerar con `pnpm spec:split` tras cambiar la especificación.

Secciones de este módulo: 13, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 23.9.

## 13. Pantallas y flujos de usuario (gestión)

Las pantallas describen funciones, no diseño visual. Cada una indica quién la usa (según modo de juego).

### 13.1 Mapa de pantallas

Promanager ve lo mismo que Coach (9.1). Manager consulta la caja en solo lectura, porque `gestor_caja = directiva` (4.4) [D] (v0.8).

| Pantalla | Modos | Función |
|---|---|---|
| Inicio / resumen | Todos | Resumen de la semana, avisos y próximos eventos. |
| Caja y finanzas | Coach, President, Total, Promanager; Manager (solo lectura, con el presupuesto asignado) | Saldo, movimientos, proyección, préstamos. En Coach, sin presupuesto ni techo de gasto (9.1, 10.4). |
| Ingresos | Coach, President, Total, Promanager | Desglose de ingresos por fuente. |
| Gastos | Coach, President, Total, Promanager | Desglose de gastos por categoría. |
| Préstamos | Coach, President, Total, Promanager | Solicitud, amortización, límites. |
| Patrocinios | Coach, President, Total, Promanager | Ofertas de patrocinio y contratos vigentes. |
| Estadio | Todos (lectura); Coach, President, Total y Promanager (decisiones); Manager (solo propuestas) | Secciones, aforo, obras y mantenimiento. |
| Obras | Coach, President, Total, Promanager | Planificación, coste, progreso. |
| Explotación del estadio | Coach, President, Total, Promanager | Palcos, hospitality, restauración, museo, tours, eventos. |
| Tienda y merchandising | Coach, President, Total, Promanager | Estado, estacionalidad, camisetas. |
| Plantilla | Coach, Manager, President, Total, Promanager | Lista de jugadores, contratos, moral y condición física. |
| Mercado | Coach, Manager, President, Total, Promanager | Fichajes, ventas, cesiones, rescisiones. |
| Entrenamientos | Coach, Manager, President, Total, Promanager | Plan semanal y costes. |
| Objetivos | Todos | Objetivos de temporada y progreso. |
| Carrera del entrenador | Todos | Reputación, honorarios, ofertas y renovación. |
| Control económico | Todos (lectura) | Indicadores, avisos, sanciones. |
| Calendario | Todos | Jornadas, ventanas, eventos económicos. |
| Historial de temporada | Todos | Resumen cerrado de cada temporada. |

### 13.2 Flujo: fichar a un jugador

0. Reglas de mercado [D] (v0.9, B-1, decisión 31):
   - Fichables: jugadores con contrato de cualquier club no controlado por el jugador, y jugadores libres (`club_id` nulo).
   - Aceptación del club vendedor: acepta si `oferta ≥ valor_mercado × min(1,3; 0,8 + 0,1 × anios_restantes)`. Ejemplo: valor de 10 M€ y 2 años restantes, mínimo 10 M€; 5 años o más, 13 M€. Un libre no tiene vendedor (coste de fichaje 0).
   - Aceptación del jugador: `salario ≥ 1,10 × salario actual`; un libre, `salario ≥ 0,90 × salario de su último contrato`.
   - Clubes no controlados (IA): sin caja simulada; plan de entrenamiento `normal`; renuevan con el mismo salario los contratos que vencen; no fichan; su reputación sigue 9.6 con el objetivo deportivo de 9.3.
   - Cesiones entrantes: fuera de la versión base.
1. Desde Mercado, el usuario selecciona jugador y oferta de coste de fichaje.
2. El sistema comprueba: ventana abierta; saldo o descubierto disponible; límite de inversión (10.1); plantilla (12.3); no comunitario (12.2); masa salarial (10.1); aceptación del vendedor y del jugador (paso 0).
3. Si alguna comprobación falla, se muestra causa y la opción de corregirla.
4. El usuario define salario, duración, forma de pago, cláusulas (casa y coche, rescisión).
5. El sistema muestra el impacto proyectado: caja de las próximas 8 semanas, cargo de amortización anual, ratio de masa salarial.
6. Confirmación: se crean `Contrato`, `Clausula` y `Movimiento`.

### 13.3 Flujo: vender o ceder a un jugador

1. Desde Plantilla, el usuario elige jugador.
2. Selecciona venta, cesión o rescisión.
3. El sistema calcula ingreso o coste (6.2.14, 6.6.2). Venta [D] (v0.9, B-1): el sistema compra al instante por `valor_mercado × min(1,0; 0,6 + 0,1 × anios_restantes)`. El jugador pasa, con su contrato y su salario, a un club no controlado de su división sorteado con el flujo 6 entre los que tienen menos de 25 inscritos; si no hay ninguno, de la otra división. Margen frente a la recompra: para los mismos `anios_restantes`, el precio de venta (0,6 + 0,1 × años, tope 1,0) es siempre menor que el mínimo de compra del paso 0 de 13.2 (0,8 + 0,1 × años, tope 1,3), así que vender y recomprar no da dinero (sección 19). Un jugador fichado no se puede vender en la misma ventana en que llegó, para que no se pueda comprar con pocos años de contrato, renovar a más años y revender en el acto [D] (v0.9; decisión de producto 47, v1.0).
4. Muestra beneficio o pérdida contable.
5. Confirmación: movimientos y actualización de plantilla.

### 13.4 Flujo: encargar una obra

1. Desde Estadio, se elige tipo de obra.
2. El sistema muestra coste, duración, aforo resultante, efectos y mantenimiento.
3. Comprobación de saldo, obras activas máximas y espacio.
4. Confirmación: obra en estado `planificada`; empieza en la siguiente semana con saldo suficiente.

### 13.5 Flujo: programar un concierto

1. Desde Explotación del estadio, se elige tipo de evento.
2. El sistema comprueba: insonorización, calendario (8.6.2), aforo, césped.
3. El sistema muestra ingreso proyectado (8.6.3) y coste de césped.
4. El promotor (oferta del sistema, con los parámetros por tipo de 8.6.1) acepta si se cumplen todas las comprobaciones del paso 2; si no, rechaza y se muestra la causa [D] (v0.9, B-6). Si acepta, el evento pasa a `confirmado`.

### 13.6 Flujo: préstamo

1. Desde Préstamos, se elige importe, plazo y método de amortización (lineal por defecto o francesa, 6.7).
2. Comprobación de límite de división, número de préstamos activos y límite con objetivos cumplidos (6.7).
3. Muestra cuota mensual, intereses totales y saldo.
4. Confirmación: préstamo activo y entrada de caja.

### 13.7 Flujo: decisión sobre ofertas de entrenador

1. Desde Carrera del entrenador, se lista la oferta con club, división, honorarios, duración y caducidad.
2. Se muestra el coste de rescisión del contrato actual (9.8), que paga el club de destino.
3. Aceptar: se abre cambio de club en el siguiente tick.
4. Rechazar o caducar: sin efecto.

### 13.8 Flujo: fin de temporada

1. Se muestra el resumen de objetivos cumplidos y no cumplidos.
2. Se muestra la evaluación de reputación del entrenador y del club.
3. Se muestra el resultado económico y el cálculo de impuesto.
4. Se muestran ofertas, renovaciones y avisos de control económico.
5. Confirmación: se inicia la siguiente temporada.

### 13.9 Requisitos transversales de pantalla

- Toda cifra de la pantalla debe poder desglosarse en causas (principio 7).
- Las proyecciones se etiquetan como estimadas.
- Ninguna pantalla debe permitir una acción que la regla de negocio prohíbe; se muestra la causa.
- Las pantallas son accesibles por teclado y lector de pantalla; los importes se leen con separadores locales.

---

### 23.9 Pantallas (sección 13)

- [ ] Cada modo ve exactamente las pantallas de 13.1; Promanager igual que Coach; Manager ve "Caja y finanzas" en solo lectura.
- [ ] Toda cifra de pantalla abre su desglose de causas (`Movimiento.causa`, factores de 8.2, sorteos de 5.5).
- [ ] Ninguna acción prohibida por una regla se puede confirmar; se muestra la causa (ventana cerrada, límite, descubierto, plantilla, no comunitarios).
- [ ] La proyección de caja de 8 semanas (13.2) coincide con la suma de movimientos `previsto` y se etiqueta como estimada.
- [ ] Flujos de Mercado (13.2 y 13.3): cada rechazo del vendedor, del jugador o de una regla muestra su causa; la venta muestra el precio de 13.3 y el beneficio contable.

## Decisiones de producto que afectan a este módulo (tabla 0.3)

| N | Decisión | Dónde se aplica |
|---|---|---|
| 1 | Modo Coach: la caja la gestiona el jugador, sin presupuesto fijo de la directiva. En Coach no existe el objetivo `presupuesto_no_superar` ni techo de gasto, y no hay consecuencias ligadas a ese objetivo. | 4.4 (`gestor_caja`), 9.1, 9.3, 9.13, 10.4, 13.1, A-02 |
| 15 | Aforo de conciertos: aforo propio del evento, con el ingreso ajustado a su aforo. Sin límite por el aforo del estadio. | 4.17, 8.6.1, 8.6.3, 13.5 |
| 31 | Ronda 0.9, B-1. Mercado: el vendedor acepta según valor de mercado y años de contrato restantes; el sistema compra con un margen que impide ganar dinero con venta y recompra; renovación de jugadores con subida mínima; clubes no controlados sin caja simulada; venta forzosa al tercer cierre en exceso; sin cesiones entrantes. | 6.11, 9.9, 10.2, 13.2, 13.3, 19, A-11 |
| 32 | Ronda 0.9, B-2. Tres objetivos por temporada: deportivo, `saldo_minimo` = 0 y `aforo_medio_minimo` (0,80 en Primera; 0,70 en Segunda). Manager: `presupuesto_no_superar` = presupuesto de 10.4. Un entrenador sin club recibe siempre al menos 1 oferta. En Coach y Promanager no se asigna `saldo_minimo` (decisión 46, v1.0). | 9.1, 9.3, 9.8, 9.9, 10.4, 13.7 |
| 46 | Ronda 1.0, confirma la elección del redactor de v0.9. En Coach y Promanager no hay objetivo `saldo_minimo` (saldo ≥ 0): solo cuentan el deportivo y la ocupación, con pesos 0,667 y 0,333. | 9.3, 13.1 |
| 47 | Ronda 1.0, confirma la elección del redactor de v0.9. Un jugador no se puede revender en la misma ventana de mercado en que se compró. | 13.3, 19 |
