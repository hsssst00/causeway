# Bitácora — Sprint 3 (S3)

**Fase:** F0
**Objetivo del sprint:** EKG: mecanismos de política monetaria y fiscal completos con explicaciones; wireframes W1–W3 en alta fidelidad (Doc. 4 §8).
**Épicas activas:** E2 (EKG IS-LM v0), E3 (Diseño de alta fidelidad W1–W3)
**Fecha de Sprint Planning:** 2026-08-04

---

## 1. Decisiones de arranque heredadas

Ver `sprint-02.md` para el cierre completo de S2. Resumen operativo verificado hoy contra el estado real del repo (no solo contra la bitácora):

- Historias 1 y 2 de S2 (esquema de `variable` + catálogo completo de agentes/variables) aceptadas como "Hecho" en Sprint Review (2026-08-04) — ver `sprint-02.md` §6.
- `ekg-macro` (`hsssst00/ekg-macro`) existe, contenido en YAML, `bundles/is-lm-v0.1.1.json` publicado — confirmado contra el repo real (`git ls-remote` + clon), no solo contra la bitácora.
- El punto 4 del catálogo ("Expectativas") quedó con firma económica firme, respaldada por consulta externa documentada (`consultas/consulta-externa-expectativas-2026-08-04.md`); Doc. 2 §3 tiene la nota correspondiente (v1.3) — confirmado contra el repo real.
- **Corrección respecto a lo asumido al abrir esta sesión de planning:** `retro/sprint-02.md` no estaba en borrador — ya figuraba `**Estado: CERRADA.**`, v1.0, con las 5 preguntas respondidas por el PO, confirmado por el commit `05dd227` ("Cierra la retro de S2 con la reflexión del PO"). Se registra aquí para que la discrepancia quede en el historial del proyecto, no solo en el chat de planning.
- Riesgo R1 (revisión económica no independiente, Doc. 4 §9): sigue abierto. La retro de S2 (acción 1) recomienda repetir sistemáticamente el patrón de consulta externa para contenido económico que lo requiera — aplica directamente a la historia 2 de este sprint (mecanismo fiscal, ver §2).
- Riesgo R2 (pérdida de contexto entre sesiones): la bitácora como memoria externa siguió siendo suficiente en S2 según la retro (pregunta 5) — sin cambios de proceso para S3.

## 2. Alcance cerrado en Sprint Planning

| # | Historia | Épica | Ref. cruzada | Fase | Estado |
|---|---|---|---|---|---|
| 1 | Mecanismo completo de política monetaria expansiva, como aristas independientes con metadato completo (6 eslabones) | E2 | Doc. 2 §5.2; Doc. 4 §7 | F0 | En revisión |
| 2 | Mecanismo completo de política fiscal expansiva — contenido nuevo, autorado siguiendo la estructura del ejemplo monetario | E2 | Doc. 2 §5.2 (patrón); Doc. 4 §7 (Fase corregida F1→F0 en esta sesión) | F0 | Lista para sprint |
| 3 | Constructor causal (W1) en alta fidelidad, escritorio y móvil | E3 | Doc. 3 §4.1, §4.3; Doc. 4 §7 | F0 | Lista para sprint |
| 4 | Informe de Razonamiento (W2) y Panel docente mínimo (W3) en alta fidelidad | E3 | Doc. 3, hito de salida F0 (§8.2); Doc. 4 §7 | F0 | Lista para sprint |

**Decisiones de scope tomadas en planning (confirmadas por el PO, 2026-08-04):**

- **Corrección de Doc. 4 §7 (Fase F1→F0 de la historia fiscal), con autorización explícita del PO para tocar un documento cerrado.** Se detectó, al preparar este planning, una inconsistencia interna en Doc. 4: el objetivo de S3 en §8 (fila de Fase F0) ya prometía "mecanismos de política monetaria y fiscal completos", pero la historia correspondiente en §7 estaba etiquetada con Fase F1. El PO decidió incluir el mecanismo fiscal en S3 y corregir la Fase en §7 en vez de recortar el texto de §8. Aplicado en `docs/04-programa-gestion-scrum.md`, entrada **1.0.2** de su tabla de control de versiones.
- **DoR §6.1, disponibilidad de revisión del PO:** confirmada para todo S3 (ambas historias de E2 tocan contenido económico). Las cuatro historias de esta tabla pasan a "Lista para sprint".
- **Aplicación de la acción 1 de la retro de S2:** dado que R1 sigue abierto y la retro recomienda repetir el patrón de consulta externa para contenido económico nuevo que requiera un segundo criterio, la historia 2 (mecanismo fiscal) queda marcada para pasar por una consulta a una instancia externa de Claude antes de que el PO la firme como económicamente correcta — mismo patrón que el punto 4 de "Expectativas" en S2, no una novedad de proceso introducida aquí.
- **Recordatorio de proceso (Doc. 2 §11.3, explícita desde v1.1 sobre independencia autor/revisor):** ninguna arista de las historias 1 y 2 se marca como económicamente validada por Claude o Claude Code — es responsabilidad exclusiva del PO, con revisor distinto del autor del contenido.
- **Nota sobre discrepancia de memoria (Hallazgo B):** al preparar este planning se detectó que Doc. 2 §11.3 ya resuelve, desde su versión 1.1 (2026-08-01), la inconsistencia con Doc. 3 §8.4 que constaba como abierta en la memoria de Claude entre sesiones. Se deja registrado aquí porque afecta la confiabilidad de "documentos cerrados" como fuente de verdad y no debe perderse en el chat de planning. No requirió acción en esta sesión — ya estaba resuelto en el repo antes de S3.
- **Hallazgo nuevo — "Demanda agregada" ausente del catálogo, con autorización explícita del PO para tocar Doc. 2 §3 y el catálogo ya aceptado como "Hecho" en S2.** Al preparar la historia 1 se detectó que el cuarto eslabón del mecanismo ilustrativo de Doc. 2 §5.2 ("Demanda agregada") no existe como variable en `ekg-macro/variables/` ni figura en ninguna celda "controla"/"recibe" de la tabla de agentes de Doc. 2 §3 — a diferencia de "expectativas", no por tratarse de un supuesto, sino porque nunca se incorporó al catálogo. El PO aclaró la definición económica (identidad consumo + inversión + gasto público + exportaciones netas, distinta de "demanda esperada", que es el aliciente keynesiano a la inversión) y autorizó agregarla. Se creó `ekg-macro/variables/demanda-agregada.yaml` (`tipo: resultado`, `agente: empresas` — por su rol de receptor causal en §5.2, mismo patrón que `producción`), se agregó a `variables_recibidas` de `agentes/empresas.yaml`, y se agregó una nota bajo la tabla de Doc. 2 §3 (entrada de versión **1.4**) explicando la identidad macro y por qué no aparece como celda "controla"/"recibe" de un único agente. Verificado localmente: `cd ekg-macro && node scripts/validar-y-publicar-bundle.js --solo-validar` — 6 agentes, **26 variables** válidas (antes 25), sin duplicados, catálogo consistente; `cd packages/cks/validate && npm test` — 32/32 sin cambios (la suite valida contra fixtures, no contra el catálogo real, por lo que no refleja el conteo nuevo). Esta adición reabre el alcance de la historia 2 de S2 (catálogo, aceptada "Hecho" en Sprint Review 2026-08-04) — no invalida esa aceptación (el catálogo era correcto y completo respecto a Doc. 2 §3 tal como estaba entonces), pero técnicamente la extiende; se deja constancia explícita para que no quede como un cambio silencioso a un incremento ya cerrado.

**Explícitamente fuera de alcance de S3:** el set de 12–16 escenarios curados (historia 4 de E2, Doc. 4 §7) — Fase F2, no F0; sin cambios de scope respecto a lo ya definido.

## 3. Primeros pasos concretos

- [x] Agregar la variable `demanda-agregada` al catálogo (bloqueaba la historia 1) — hecho en esta sesión de planning, ver más arriba.
- [x] Autorar las 6 aristas del mecanismo monetario expansivo (Doc. 2 §5.2) conforme a `relacion.schema.json`, cada una con `explicacion_si_error`, en `ekg-macro/relaciones/is-lm/monetaria/` — hecho en esta sesión, ver entrada de trabajo en §4.
- [x] Extender `ekg-macro/scripts/validar-y-publicar-bundle.js` para leer y validar `relaciones/is-lm/**/*.yaml` y conectar `variablesSinAgente()` — hecho en esta sesión, ver §4. Bundle `is-lm-v0.1.2.json` publicado.
- [ ] Diseñar la cadena causal del mecanismo fiscal expansivo (mínimo 5 eslabones) siguiendo la forma del ejemplo monetario — borrador de Claude antes de autorado final.
- [ ] Someter el borrador del mecanismo fiscal a consulta con una instancia externa de Claude (mismo patrón que el punto 4 de Expectativas en S2), documentando la consulta en `consultas/`.
- [ ] Autorar las aristas del mecanismo fiscal conforme a `relacion.schema.json` en `ekg-macro/relaciones/is-lm/fiscal/`, solo tras la firma económica del PO posterior a la consulta.
- [ ] Diseño de alta fidelidad de W1 (Constructor causal), escritorio y móvil, contra los cinco principios UX de Doc. 3 §4.1 y objetivos táctiles de 44px.
- [ ] Diseño de alta fidelidad de W2 (Informe de Razonamiento) y W3 (Panel docente mínimo), navegables como prototipo sin código (Doc. 3, hito de salida F0).
- [ ] Actualizar `README.md` ("Estado del repositorio") al cierre del sprint con el estado de S3.

## 4. Entradas de trabajo

_(Esta sección se completa a medida que avanza el sprint — Claude Code y Claude registran aquí cada sesión de trabajo, ya que ninguno conserva memoria entre sesiones. Formato sugerido: fecha, quién, qué se hizo, qué queda pendiente.)_

### 2026-08-04 — Claude (sesión de chat, no Claude Code)

**Qué se hizo (historia 1 de §2, en la misma sesión de planning, con el PO resolviendo en vivo el bloqueo de `demanda-agregada`):**

- Autoradas las 6 aristas del mecanismo monetario expansivo (Doc. 2 §5.2) en `ekg-macro/relaciones/is-lm/monetaria/` (un archivo por relación, mismo patrón que `agentes/` y `variables/`): `oferta-monetaria-tasa-interes`, `tasa-interes-inversion`, `inversion-demanda-agregada`, `demanda-agregada-produccion`, `produccion-ingreso`, `ingreso-consumo`. Contenido adaptado del fixture ilustrativo usado en tests desde S1 (`causeway/packages/cks/validate/fixtures/mecanismo-monetario-ilustrativo.json`), promovido a catálogo real — no es contenido nuevo inventado en esta sesión, es la misma cadena causal de Doc. 2 §5.2 ya usada como referencia desde S1.
- Extendido `ekg-macro/scripts/validar-y-publicar-bundle.js`: `leerRelaciones()` nueva (recorre `relaciones/**/*.yaml` recursivamente, a diferencia de `leerCatalogo()` que asume carpeta plana); valida `relacion` contra el esquema; conecta `variablesSinAgente()` (Doc. 2 §8.2, implementada en `packages/cks/validate/reglas-integridad.js` desde S0/S1 pero nunca invocada aquí antes por falta de relaciones reales). El bundle deja de hardcodear `relaciones: []`.
- `VERSION` → `0.1.2`. Bundle `bundles/is-lm-v0.1.2.json` publicado; `is-lm-v0.1.0.json` e `is-lm-v0.1.1.json` intactos (inmutabilidad verificada). `CHANGELOG.md` y `README.md` (árbol de directorios) actualizados.

**Verificación de cierre:** `cd ekg-macro && node scripts/validar-y-publicar-bundle.js --solo-validar` — 6 agentes, 26 variables, **6 relaciones** válidas, sin duplicados, catálogo consistente, sin variables sin agente. `cd packages/cks/validate && npm test` (causeway) — 32/32 en verde, sin cambios de conteo (la suite valida contra fixtures propios, no contra el catálogo real). Diff estructural `0.1.1` vs `0.1.2`: `variables` 25→26, `relaciones` 0→6, `agentes` cambia (empresas gana `demanda-agregada` en `variables_recibidas`) — cambio de contenido esperado y documentado, no una regresión.

**Qué queda pendiente — bloqueante para DoD (Doc. 4 §6.2), no para CI:**

- **Firma económica del PO** sobre las 6 relaciones y sobre la clasificación de `demanda-agregada` (`tipo: resultado`, agente `empresas`) — el esquema valida forma, no verdad económica (Doc. 3 §7.3, nota a). Sin esta firma la historia 1 no puede marcarse Hecha aunque ya pase CI.
- Aplicar todos los cambios de esta sesión y de la sesión de planning (§2) al repositorio real (`main`, ambos repos) — esta entrada documenta trabajo verificado localmente contra clones de los repos, pendiente de que el PO lo aplique vía Claude Code, igual que en S1 y S2.
- Historia 2 (mecanismo fiscal): sin empezar — depende del borrador + consulta externa según §2 y §3.
- Historias 3 y 4 (E3, wireframes W1–W3): fuera del alcance de esta sesión — responsable primario es Claude en diseño (Doc. 4 §7), no Claude Code; se trabajan en una sesión aparte.

## 5. Riesgos y bloqueos observados en Sprint Planning

- R1 (revisión económica no independiente, Doc. 4 §9): sigue abierto; mitigación planeada para la historia 2 (mecanismo fiscal) vía consulta externa, según acción 1 de la retro de S2 — a ejecutar durante el sprint, no resuelto en este planning.
- Sin bloqueos nuevos detectados en esta sesión de planning.

## 6. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-04 | Creación de la bitácora tras Sprint Planning de S3. |
| 1.1 | 2026-08-04 | Se detecta y resuelve, dentro de la misma sesión de planning, la ausencia de la variable "Demanda agregada" (Doc. 2 §5.2) en el catálogo real. Agregada `ekg-macro/variables/demanda-agregada.yaml`, actualizado `agentes/empresas.yaml`, nota nueva en Doc. 2 §3 (v1.4). Catálogo pasa de 25 a 26 variables, verificado localmente. Checklist de §3 actualizado. |
| 1.2 | 2026-08-04 | Historia 1 de §2 (mecanismo monetario) implementada en la misma sesión: 6 relaciones autoradas en `ekg-macro/relaciones/is-lm/monetaria/`, `validar-y-publicar-bundle.js` extendido para leerlas y validarlas, `variablesSinAgente()` conectada, bundle `is-lm-v0.1.2` publicado. Estado de la historia 1 pasa a "En revisión" — pendiente de firma económica del PO (Doc. 4 §6.2), no de CI. Entrada de trabajo agregada en §4. |
