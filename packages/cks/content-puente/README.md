# Contenido puente (agentes y variables)

**Ubicación temporal.** Este directorio existe porque `ekg-macro` (Doc. 5 §3) todavía no se ha creado. Cuando ese repositorio exista, este contenido debe trasladarse a `ekg-macro/agentes/*.yaml` y `ekg-macro/variables/*.yaml` (convirtiendo JSON → YAML), y este directorio se elimina de `causeway`.

Este es el mismo patrón puente ya usado en S1 para `.ci/cks-lib.yml` (job `validate-bundle-fixture`) — ver `bitacora/sprint-01.md` §4 y `bitacora/sprint-02.md` §5, donde ambas migraciones pendientes están registradas como riesgo a vigilar en Sprint Planning de S3.

## Contenido

- `agentes/*.json` — los seis agentes de Doc. 2 §3, uno por archivo, validado contra `packages/cks/schema/agente.schema.json`. `sector-externo.json` declara `activo: false` (Doc. 2 §3: sin aristas habilitadas hasta activar Mundell-Fleming).
- `variables/*.json` — ficha mínima de cada variable típica de Doc. 2 §3 (agente(s), tipo, naturaleza, modelos), uno por archivo, validado contra `packages/cks/schema/variable.schema.json` (nuevo en S2, historia 1 de E0).

## Estado de revisión económica (Doc. 2 §11.3, Doc. 4 §6.2)

**Revisión económica del PO sobre este catálogo: parcialmente completada.** El PO revisó los tres puntos de clasificación de dato en una sesión de discusión (2026-08-03) y confirmó las tres. El punto 4 (decisión de modelado, no de clasificación) sigue abierto. El esquema JSON valida forma, no verdad económica (Doc. 3 §7.3, nota a).

**Decisiones confirmadas por el PO:**

1. **`tasa-interes` como `endogena` — confirmado.** Es la lectura correcta de IS-LM base: el Banco Central controla la oferta monetaria (M); la tasa de interés se determina endógenamente en el mercado de dinero. En esta misma revisión se identificó que Doc. 2 §3 tenía una inconsistencia: listaba "tasa de interés de referencia" como variable controlada por el Banco Central sin condicionarla al régimen, lo cual solo es correcto bajo Regla de Taylor (Doc. 2 §7.2), no en el modelo base. **Corregido en Doc. 2 §3 (v1.2)** — la tabla de agentes y la nota explicativa bajo ella ahora condicionan esa variable al régimen monetario activo. Mismo tipo de hallazgo que los reportados por la auditoría independiente (ver Hallazgo B, `auditorias/auditoria-independiente-causeway-2026-08-03.md`).
2. **`ciclo-economico` con `naturaleza: stock` — confirmado.** Con la lectura de "valor de la variable en el momento t", no como acervo económico literal. Decisión explícita de no ampliar la taxonomía de tres categorías de Doc. 2 §4.2 / Doc. 3 §5.3 para no asumir el costo de tocar documentos ya cerrados por una sola variable.
3. **`riesgo` con `naturaleza: precio_tasa` — confirmado**, como simplificación deliberada: en rigor es un score/índice cualitativo, pero se asume como la tasa de riesgo que el agente está dispuesto a asumir (spread/prima sobre la tasa base).

**Punto que sigue abierto:**

4. **"Expectativas" (Doc. 2 §3, recibida por Banco Central y Hogares) se excluyó por completo del catálogo de variables.** Doc. 3 §4.4 y la fixture ilustrativa de escenario ya modelan "expectativas" a nivel de **supuesto** (`expectativas_estaticas`, vía `supuesto.schema.json`), no como una variable del grafo con `naturaleza` stock/flujo/precio_tasa. Se decidió no crear una variable-fantasma para no duplicar un concepto que ya vive correctamente en otra capa del esquema — pero es una decisión de modelado, no una mera clasificación de dato, y conviene que el PO la confirme.

Los cuatro puntos pasan CI (todo valida en verde) independientemente de su estado de revisión. Con los puntos 1–3 confirmados, solo el punto 4 sigue bloqueando que la historia 2 de S2 se marque Hecha según Doc. 4 §6.2.
