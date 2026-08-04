# Bitácora — Sprint 2 (S2)

**Fase:** F0
**Objetivo del sprint:** Arrancar el catálogo de agentes y variables del EKG (Doc. 4 §8 — el resto del objetivo original de S2, "CKS v1 completo validado", ya quedó cerrado en S1 antes de lo previsto por el roadmap).
**Épicas activas:** E0 (CKS v1), E2 (EKG IS-LM v0)
**Fecha de Sprint Planning:** 2026-08-03

---

## 1. Decisiones de arranque heredadas

Ver `sprint-01.md` para el cierre completo de S1. Resumen operativo verificado hoy contra el estado real del repo (no solo contra la bitácora):

- Los 5 esquemas CKS de S1 (relación, evento, agente, supuesto, escenario) siguen en verde: `packages/cks/validate` — 13 tests, todos pasan (`npm test`, verificado 2026-08-03).
- `import-boundaries` (`.ci/fronteras.yml`) sigue con `if: false`. Verificado: `packages/api/src`, `packages/ate/src`, `packages/cre/src`, `packages/lsm/src` y los subdirectorios de `packages/policylab-client/src` solo contienen `.gitkeep` — no hay código real todavía en ningún paquete salvo `cks`. Sigue bloqueado, sin acción posible en S2.
- `ekg-macro` (Doc. 5 §3) sigue sin existir — confirmado (no hay directorio hermano ni archivos `.yaml` de contenido en ningún lado del árbol).
- Riesgo R1 (revisión económica no independiente, Doc. 4 §9): sigue abierto, no bloqueante, sin cambios este sprint.

## 2. Alcance cerrado en Sprint Planning

| # | Historia | Épica | Ref. cruzada | Fase | Estado |
|---|---|---|---|---|---|
| 1 | Esquema JSON de `variable` (nombre, agente(s), tipo, naturaleza, modelos_validos) + extensión de `reglas-integridad.js` con detección de variables duplicadas | E0 | Doc. 2 §4.3, Doc. 4 §7 (criterio de aceptación de la historia de catálogo de E2) | F0 | En revisión — CI en verde, sin firma de contenido pendiente (es trabajo técnico, no económico) |
| 2 | Catálogo completo de los seis agentes (Doc. 2 §3) y sus variables típicas (Doc. 2 §4.3), autorado como solución puente dentro de `causeway` | E2 | Doc. 2 §3, §4.3; Doc. 4 §7; Doc. 5 §3 | F0 | En revisión — borrador completo, CI en verde, **firma económica firme** (los cuatro puntos confirmados; reserva del punto 4 cerrada por consulta externa 2026-08-04 — ver §4) — pendiente solo de demostración en Sprint Review |

**Decisiones de scope tomadas en planning (confirmadas por el PO, 2026-08-03):**

- **`ekg-macro` sigue sin crearse en S2.** La arquitectura (Doc. 5 §3) dicta que el catálogo debe vivir en `ekg-macro/agentes/*.yaml` y `ekg-macro/variables/*.yaml`, pero ese repositorio no existe todavía. Se decidió, igual que con la historia 5 de E1 en S1, autorar el contenido como **solución puente dentro de `causeway`** (ubicación exacta a definir por Claude Code durante la implementación, consistente con el patrón ya usado por `packages/cks/validate/index.js` y `.ci/cks-lib.yml`), documentando explícitamente que se traslada a `ekg-macro` cuando ese repositorio se cree. Esto acumula una segunda migración pendiente junto a la de `validate-bundle-fixture` (ver `sprint-01.md` §4).
- **Se añade la historia 1 (esquema de `variable`) que no estaba en el backlog original de Doc. 4 §7 E0.** Refinamiento detectado en este planning: sin un esquema de forma para la ficha de variable, el criterio de aceptación de la historia de catálogo de E2 ("sin duplicados detectados por CI") no es verificable automáticamente. Es trabajo técnico (Claude Code), no contenido económico, por lo que no está sujeto a la restricción de revisión del PO de DoR §6.1.
- **DoR §6.1, disponibilidad de revisión del PO:** confirmada para S2. La historia 2 (contenido) puede entrar a "Lista para sprint".
- **Recordatorio de proceso (Doc. 2 §11.3):** todo contenido de tipo `relacion` generado en `causeway` o `ekg-macro` queda marcado como pendiente de "revisión económica" hasta la firma del PO. Ninguna variable ni agente del catálogo de la historia 2 se marca como económicamente validado por Claude o Claude Code — es responsabilidad exclusiva del PO, aplicable también a metadata de variables (tipo, naturaleza), no solo a aristas.

**Explícitamente fuera de alcance de S2:** el mecanismo completo de política monetaria expansiva (historia 2 de E2, Doc. 2 §5.2) — Doc. 4 §8 lo ubica en S3, no en S2, y depende de que el catálogo de variables (historia 2 de esta bitácora) exista primero.

**Nota de secuencia interna:** la historia 1 (esquema de `variable`) debe completarse antes de que la historia 2 (catálogo) sea demostrable contra CI — mismo patrón que historias 1–2 antes de la historia 5 en S1.

## 3. Primeros pasos concretos

- [ ] Diseñar y publicar `variable.schema.json` en `packages/cks/schema/`, registrarlo en `packages/cks/validate/index.js` (`TIPOS`).
- [ ] Extender `packages/cks/validate/reglas-integridad.js` con una función de detección de variables duplicadas (mismo `id` o mismo `nombre` normalizado) y su caso de prueba correspondiente.
- [ ] Autorar los 6 agentes de Doc. 2 §3 (Banco Central, Gobierno, Empresas, Hogares, Sistema financiero, Sector externo con `activo: false`) conforme a `agente.schema.json`, en la ubicación puente dentro de `causeway`.
- [ ] Autorar el catálogo de variables típicas por agente conforme al nuevo `variable.schema.json`, validado contra CI (incluye el caso negativo de duplicado).
- [ ] Documentar en el propio contenido (o en un README del directorio puente) que esta ubicación es temporal y se traslada a `ekg-macro/agentes/` y `ekg-macro/variables/` cuando ese repositorio se cree.
- [ ] Marcar explícitamente el catálogo como pendiente de "revisión económica" (Doc. 2 §11.3) hasta que el PO lo firme.

## 4. Entradas de trabajo

_(Esta sección se completa a medida que avanza el sprint — Claude Code y Claude registran aquí cada sesión de trabajo, ya que ninguno conserva memoria entre sesiones. Formato sugerido: fecha, quién, qué se hizo, qué queda pendiente.)_

### 2026-08-03 — Claude Code

**Qué se hizo (Brief de corrección, auditoría independiente 2026-08-03 — todas las tareas del brief, Bloque 1 y Bloque 2):**
- **Tarea 1.1 (Hallazgo B2):** cobertura de test agregada para `evento` (caso positivo con el fixture ilustrativo — se añadió el campo `evento` a `fixtures/mecanismo-monetario-ilustrativo.json` — y dos negativos: `familia` fuera de enum, `variables_afectadas` vacío), `agente` (caso positivo, faltaba), `supuesto` (caso negativo — falta `explicacion_corta` —, faltaba). `packages/cks/validate`: 13 → **18 tests**, todos en verde (verificado con `npm test`, no solo declarado).
- **Tarea 1.2 (Hallazgo B1):** lógica de `import-boundaries` extraída de `.ci/fronteras.yml` a `scripts/check-import-boundaries.sh` (recibe una carpeta raíz como argumento). Nuevo `scripts/test-check-import-boundaries.sh` construye fixtures sintéticos temporales (`cre` importando de `ate` → debe rechazar; `cre` importando de `cks/validate` → debe aceptar) y verifica ambos casos — corrido localmente, ambos pasan. `.ci/fronteras.yml` gana un job nuevo (`test-import-boundaries-logic`) que corre siempre, sin depender de `if: false`; el job `import-boundaries` ahora invoca el script en vez de tener la lógica inline. El job sigue con `if: false` — correcto, no se activa hasta que exista código real (Doc. 5, roadmap S5+).
- **Tarea 1.3 (Hallazgo A3):** el PO proporcionó el contenido de `decisiones-arranque-scrum.md`. Se copió verbatim a `bitacora/decisiones-arranque-scrum.md` (sin reescribir ni resumir) y `sprint-01.md` §1 actualizó su referencia para apuntar a la ruta dentro del repo, con nota de procedencia. Antes vivía solo como documento externo fuera de control de versiones.
- **Tarea 1.4 (Hallazgo A5):** `.claude/settings.local.json` sacado del índice de git (`git rm --cached`, el archivo local se conserva) y agregado a un `.gitignore` nuevo en la raíz del repo (no existía ninguno).
- **Tarea 1.5 (Hallazgo A4):** `README.md` actualizado — ya no se describe el repositorio únicamente como "corpus de diseño"; se agregó la sección "Estado del repositorio" (fase F0, S1 cerrado, S2 en curso, contenido real de `packages/cks/schema`, `packages/cks/validate` y los tres workflows de `.ci/`). No se tocaron "Orden de lectura" ni "Glosario de componentes".
- **Tarea 2.1 (Hallazgo A1):** el PO eligió la opción (b) — completar Doc. 3 §7.3 en vez de relajar el criterio de Doc. 4 §7. Se agregaron los fragmentos ilustrativos de `agente` y `supuesto` a `docs/03-gdd-policylab.md` §7.3 (faltaban; solo `relacion` y `evento` estaban cubiertos), con nota de diseño (d) explicando el enum cerrado de `agente.id` y el campo `activo`. Se actualizó §10 (cierre de referencias cruzadas) para reflejar los cuatro esquemas, y se agregó entrada 1.1 a la tabla de control de versiones de Doc. 3. Doc. 4 §7 queda sin cambios — su criterio original ya era correcto.
- **Tarea 2.2 (Hallazgo B4), borrador:** creado `retro/sprint-01.md` como borrador explícito con la lista de preguntas abiertas para que el PO complete su reflexión — no se fabricó una retrospectiva completa sin ese insumo (habría repetido el problema que el propio hallazgo señala). Queda marcado como "BORRADOR" hasta que el PO la complete. **[Cerrada 2026-08-03: el PO respondió las 5 preguntas abiertas — ver `retro/sprint-01.md` v1.0.]**

**Qué queda pendiente:**
- **Tarea 2.3 (Hallazgo C3):** sin acción en S2, correctamente — es una decisión de alcance para el Sprint Planning de S3 (fijar sprint límite para crear `ekg-macro`), no algo ejecutable a mitad de S2.
- **Retro de S1** (`retro/sprint-01.md`): sigue en borrador hasta que el PO responda las preguntas abiertas. **[Cerrada 2026-08-03 — ver `retro/sprint-01.md` v1.0.]**

**Verificación de cierre:** `cd packages/cks/validate && npm test` → 18/18 en verde; `./scripts/test-check-import-boundaries.sh` → ambos casos pasan; `./scripts/check-import-boundaries.sh .` → sin violaciones contra el repo real.

**Fuente del brief de corrección:** el informe completo de la auditoría independiente se agregó al repo en [`auditorias/auditoria-independiente-causeway-2026-08-03.md`](../auditorias/auditoria-independiente-causeway-2026-08-03.md) — es un documento histórico (fotografía del repo en el commit `a8bfd29`); no se reescribe con los cambios posteriores, aunque varios de sus hallazgos (A1, A3, A4, A5, B1, B2) ya quedaron corregidos por las tareas de esta misma entrada.

### 2026-08-03 — Claude

**Qué se hizo (historias 1 y 2 de esta bitácora, con el PO dando el visto bueno explícito para retomar S2 tras dar por concluida la auditoría):**

- **Historia 1 (E0):** creado `packages/cks/schema/variable.schema.json` (campos: `id`, `nombre`, `agentes` [array de `cks-agente-ref-v1`], `tipo` [`politica`|`endogena`|`resultado`, Doc. 2 §4.1], `naturaleza` [`stock`|`flujo`|`precio_tasa`, Doc. 2 §4.2], `modelos`). Registrado en `packages/cks/validate/index.js` (`TIPOS`). Extendido `reglas-integridad.js` con `variablesDuplicadas(catalogoVariables)`, que detecta (a) `id` repetido y (b) `nombre` normalizado (sin tildes/mayúsculas/espacios sobrantes) repetido bajo `id` distinto. `packages/cks/validate`: 18 → **29 tests**, todos en verde (`npm test`, verificado localmente contra el repo clonado).
- **Historia 2 (E2):** creada la ubicación puente `packages/cks/content-puente/` (con README explicando su carácter temporal hasta que `ekg-macro` exista, mismo patrón que la migración pendiente de S1). Autorados los 6 agentes de Doc. 2 §3 (`agentes/*.json`, uno por archivo, `sector-externo.json` con `activo: false`) y 25 variables típicas (`variables/*.json`, uno por archivo) cubriendo íntegramente las columnas "controla" y "recibe" de la tabla de Doc. 2 §3, con **una excepción deliberada:** "Expectativas" (recibida por Banco Central y Hogares) se excluyó del catálogo de variables porque ya está modelada como *supuesto* (`expectativas_estaticas`, Doc. 3 §4.4), no como variable — está documentado en el README, no decidido en silencio.
- Verificación de cierre ejecutada localmente contra el repo real: los 6 agentes y las 25 variables validan en verde contra sus esquemas; `variablesDuplicadas` sobre el catálogo completo devuelve `[]`; consistencia cruzada agente↔variable verificada con un script ad hoc (toda variable referenciada por un agente existe en el catálogo, y toda variable del catálogo es referenciada por al menos un agente) — sin fallas.

**Qué queda pendiente — bloqueante para Definition of Done (Doc. 4 §6.2), no para CI:**

- **Firma económica del PO** sobre el catálogo completo de la historia 2, incluyendo tres puntos de clasificación marcados explícitamente como aproximaciones en `content-puente/README.md` (`tasa-interes` como `endogena` en vez de `politica`; `ciclo-economico` y `riesgo` forzados a la taxonomía de tres naturalezas de Doc. 2 §4.2) y la decisión de modelado de excluir "Expectativas" como variable. Sin esta firma, la historia 2 no puede marcarse Hecha aunque ya pase CI (Doc. 3 §7.3, nota a: el esquema valida forma, no verdad económica).
- Aplicar estos cambios al repositorio real (`main`) — esta entrada documenta trabajo verificado localmente contra un clon del repo, pendiente de que el PO lo aplique vía Claude Code, igual que en S1.

### 2026-08-03 — PO + Claude — sesión de revisión económica

**Qué se hizo:** el PO revisó económicamente el catálogo de agentes y variables de la historia 2 (E2) y tomó tres decisiones de clasificación: `tasa-interes: endogena`, `ciclo-economico: stock`, `riesgo: precio_tasa` — las tres coinciden con lo ya autorado en el patch de la sesión anterior, así que no se tocó ningún archivo de `content-puente/variables/`. Se aplicó el patch `sprint-02-historias-1-2.patch` sobre `main` (limpio contra el checkout, sin conflictos) y se reescribió `packages/cks/content-puente/README.md`: los puntos 1–3 de "Puntos que requieren criterio del PO" pasan de abiertos a confirmados, con el razonamiento de cada decisión documentado; el punto 4 ("Expectativas" excluida del catálogo como variable) sigue abierto sin resolver.

ciclo-economico (y la ambigüedad de régimen de tasa-interes) quedan como candidatas a revisión de taxonomía de naturaleza si en el futuro aparecen más variables categóricas que no calcen en stock/flujo/precio_tasa — decisión tomada para no asumir el costo de tocar Doc. 2 §4.2 y Doc. 3 §5.3 en S2.

Se detectó, durante esta revisión, una inconsistencia en Doc. 2 §3 sobre `tasa-interes` (listada como controlada por el Banco Central, lo cual solo es correcto bajo régimen de Taylor Rule — Doc. 2 §7.2 — no en el modelo IS-LM base): queda marcada explícitamente como pendiente de corrección, no corregida en esta sesión. El punto de "Expectativas" sigue abierto. **[Confirmado provisionalmente 2026-08-04 — ver entrada "PO + Claude Code — confirmación provisional del punto 4" en §4.]** **[Reserva cerrada 2026-08-04 — ver entrada "PO + Claude Code — cierre de la reserva del punto 4" en §4.]**

**Verificación de cierre:** `cd packages/cks/validate && npm test` → **29/29 en verde**, sin cambios respecto al conteo tras aplicar el patch (los cambios de esta sesión fueron solo a `content-puente/README.md` y a esta bitácora, ninguno de los dos afecta la suite).

### 2026-08-03 — PO + Claude Code — corrección de Doc. 2 §3

**Qué se hizo:** la inconsistencia de `tasa-interes` en Doc. 2 §3 (entrada anterior de esta bitácora) se corrigió en la misma sesión de revisión, a pedido explícito del PO — deja de estar "pendiente de corrección". Cambios en `docs/02-diseno-economico.md`:
- Tabla de agentes (§3): la celda de "Variables típicas que controla" del Banco Central ahora condiciona "tasa de interés de referencia" a régimen de Regla de Taylor activo, en vez de listarla sin condición junto a "oferta monetaria".
- Nueva nota bajo la tabla, análoga a la ya existente para Sector externo/Mundell-Fleming: explica que la variable de control directo del Banco Central depende del régimen (oferta monetaria en IS-LM base, tasa de interés de referencia solo bajo Regla de Taylor, §7.2), y que la tabla lista ambas en la misma celda porque el catálogo de agentes es fijo y compartido por todos los regímenes (§7.1), no porque ambas estén activas a la vez.
- Entrada 1.2 agregada a la tabla de control de versiones de Doc. 2.
- `packages/cks/content-puente/README.md` actualizado: el punto 1 de "Decisiones confirmadas por el PO" ya no dice "no se corrige aquí, pendiente" — dice "Corregido en Doc. 2 §3 (v1.2)".

**Verificación de cierre:** `cd packages/cks/validate && npm test` → **29/29 en verde** (cambio es solo de documentación, no toca `packages/cks/schema` ni `packages/cks/validate`).

### 2026-08-03 — Claude Code — migración a ekg-macro

**Qué se hizo:**
- Creado el repositorio `ekg-macro` (`hsssst00/ekg-macro`, Doc. 5 §1/§3), resolviendo la deuda de migración registrada en §5 de esta bitácora y en el Hallazgo C3 de `auditorias/auditoria-independiente-causeway-2026-08-03.md`.
- Migrado verbatim el catálogo puente de `packages/cks/content-puente/` (6 agentes, 25 variables, historia 2 de E2) a `ekg-macro/agentes/` y `ekg-macro/variables/`. Formato: se mantiene JSON, no se convierte a YAML pese a que Doc. 5 §3 muestra `*.yaml` y `content-puente/README.md` declaraba esa intención — decisión explícita, documentada en `ekg-macro/README.md` ("Nota de formato") como discrepancia pendiente de reconciliar con Doc. 5 en una sesión futura.
- Migrado el job `validate-bundle-fixture` de `.ci/cks-lib.yml` a `ekg-macro/.ci/validar-cks.yml`, ahora validando el catálogo real en vez del fixture ilustrativo. `package-cks-lib.needs` actualizado de `validate-bundle-fixture` a `test-cks-lib`.
- Formalizado el "script ad hoc" mencionado en la entrada "Claude" del 2026-08-03 de esta misma bitácora: `variablesFantasmaOHuerfanas(catalogoAgentes, catalogoVariables)`, nueva en `packages/cks/validate/reglas-integridad.js`, con fixture de regresión (`fixtures/agentes-y-variables-puente.json`, snapshot del catálogo real) y tres tests nuevos (positivo contra el catálogo completo, dos negativos sintéticos). `packages/cks/validate`: 29 → **32 tests**, todos en verde.
- Generado el primer bundle de `ekg-macro`, `bundles/is-lm-v0.1.0.json` (`agentes` y `variables` poblados; `relaciones`/`eventos`/`escenarios` vacíos, fuera de alcance hasta S3, Doc. 4 §8).
- Eliminado `packages/cks/content-puente/` de `causeway` (`git rm`), ya migrado.
- Actualizados `README.md` (raíz, "Estado del repositorio") y `bitacora/sprint-01.md` (nota de resolución en la fila de historia 5, §2).

**Qué explícitamente NO se decidió ni se cambió:**
- El punto 4 de `content-puente/README.md` ("Expectativas" excluida del catálogo de variables, Doc. 3 §4.4) sigue **abierto** — se trasladó verbatim a `ekg-macro/README.md`, sin resolverlo. No era objeto de esta migración (que es estructural, Doc. 5 §3), y sigue requiriendo firma económica del PO. **[Confirmado provisionalmente 2026-08-04 — ver entrada "PO + Claude Code — confirmación provisional del punto 4" en §4.]** **[Reserva cerrada 2026-08-04 — ver entrada "PO + Claude Code — cierre de la reserva del punto 4" en §4.]**
- La historia 2 de §2 de esta bitácora permanece **"En revisión"**, no pasa a "Hecho". Esta migración traslada dónde vive el contenido; no aporta la firma económica que exige la Definition of Done (Doc. 4 §6.2) sobre el punto 4 pendiente — el esquema valida forma, no verdad económica (Doc. 3 §7.3, nota a).
- `ekg-macro` no recibe `bitacora/` ni `retro/` propios — decisión documentada con su razonamiento en `ekg-macro/README.md`, sección "Bitácora y tablero".

**Verificación de cierre:** `cd packages/cks/validate && npm test` → 32/32 en verde (verificado antes y después de eliminar `content-puente/`, confirmando que la nueva fixture es independiente de esa carpeta); `node scripts/validar-y-publicar-bundle.js` corrido localmente dentro de `ekg-macro` (con `causeway` como checkout hermano) → agentes y variables válidos, sin duplicados, sin inconsistencias agente↔variable, bundle `is-lm-v0.1.0.json` generado.

### 2026-08-03 — Claude Code — conversión JSON → YAML en `ekg-macro` (cierre de excepción)

**Qué se hizo:** el PO decidió resolver la excepción documentada en
`ekg-macro/README.md` ("Nota de formato: JSON, no YAML") desde la
migración registrada más arriba en esta misma entrada §4. Se convirtieron
`ekg-macro/agentes/*.json` (6 archivos) y `ekg-macro/variables/*.json` (25
archivos) a `*.yaml`, transcripción 1:1 (mismo orden de campos, 2 espacios
de indentación, sin flow style) — **es una conversión de serialización,
no una edición de contenido.** Verificación de round-trip realizada antes
de borrar cada `.json`: se cargó el YAML recién escrito y se comparó como
objeto (`assert.deepStrictEqual`) contra el JSON original — los 31
archivos coinciden exactamente. Los `.json` originales se borraron tras
la verificación; `agentes/` y `variables/` de `ekg-macro` contienen ahora
solo `.yaml`.

`ekg-macro/scripts/validar-y-publicar-bundle.js` actualizado:
`leerCatalogo()` filtra `.yaml` y parsea con `js-yaml.load()` en vez de
`.json`/`JSON.parse()`; `VERSION` pasa de `'0.1.0'` a `'0.1.1'`. Se agregó
`ekg-macro/package.json` (nuevo en ese repositorio) con `js-yaml` como
dependencia, y `ekg-macro/.ci/validar-cks.yml` gana un paso `npm install`
en `ekg-macro` (antes de correr el script) en ambos jobs
(`validar-catalogo` y `publicar-bundle`). La lógica de inmutabilidad del
bundle (`if (fs.existsSync(destino))`) no se tocó — sigue protegiendo
`is-lm-v0.1.0.json` y ahora también `is-lm-v0.1.1.json`.

Se corrió `node scripts/validar-y-publicar-bundle.js` dentro de
`ekg-macro` (con `causeway` como checkout hermano): validó los 6 agentes
y 25 variables contra sus esquemas leyendo desde YAML, sin duplicados, sin
inconsistencias agente↔variable, y publicó `bundles/is-lm-v0.1.1.json`.
Diff estructural contra `is-lm-v0.1.0.json` (comparación campo por campo)
confirma que `agentes`, `variables`, `relaciones`, `eventos` y
`escenarios` son idénticos entre ambos bundles — solo difieren `version`
(`0.1.0` → `0.1.1`) y `generado` (timestamp). `is-lm-v0.1.0.json` no se
editó ni se borró.

`ekg-macro/README.md` (sección "Nota de formato") y `CHANGELOG.md`
(`[0.1.1]`, sección "Cambiado" — no hay contenido nuevo) actualizados
para registrar el cierre. **Doc. 5 §3 no se editó**: ya especificaba
`agentes/*.yaml` y `variables/*.yaml` correctamente; era la
implementación de `ekg-macro` la que estaba en excepción respecto al
documento, no al revés — cerrar la excepción significó ajustar el
repositorio, no el documento.

`packages/cks/validate` en `causeway` no se tocó — sigue en
**32/32 tests en verde** (`npm test`, verificado tras la conversión); los
esquemas de `packages/cks/schema/` no cambiaron, validan objetos ya
parseados sin importar si el origen fue JSON o YAML.

**Qué explícitamente NO se decidió ni se cambió:**
- El punto 4 heredado ("Expectativas" excluida del catálogo de variables,
  `ekg-macro/README.md`, "Historial de curación heredado") sigue
  **abierto** — sin relación con esta tarea, que es puramente de formato.
  **[Confirmado provisionalmente 2026-08-04 — ver entrada "PO + Claude
  Code — confirmación provisional del punto 4" en §4.]** **[Reserva
  cerrada 2026-08-04 — ver entrada "PO + Claude Code — cierre de la
  reserva del punto 4" en §4.]**
- La historia 2 de §2 de esta bitácora permanece **"En revisión"**, no
  pasa a "Hecho" — este cambio no aporta la firma económica pendiente.

**Verificación de cierre:** round-trip de los 31 archivos (script ad hoc,
`assert.deepStrictEqual` contra cada JSON original antes de borrarlo);
`node scripts/validar-y-publicar-bundle.js --solo-validar` y luego sin la
bandera → agentes y variables válidos, `bundles/is-lm-v0.1.1.json`
publicado; diff estructural `0.1.0` vs `0.1.1` → solo `version` y
`generado` distintos; `cd packages/cks/validate && npm test` → 32/32 en
verde, sin cambios respecto al conteo anterior.

### 2026-08-04 — PO + Claude Code — confirmación provisional del punto 4

**Qué se hizo:** el PO confirmó, de forma **provisional**, el punto 4
pendiente del catálogo de agentes/variables (Doc. 2 §11.3, Doc. 4 §6.2):
"Expectativas" se excluye del catálogo de variables y sigue modelada
como *supuesto* (`expectativas_estaticas`, Doc. 3 §4.4), no como
variable del grafo. La confirmación queda condicionada a una reserva
explícita: el PO no tiene acceso a profesionales de macroeconomía para
validar la decisión, así que va a consultar una instancia externa de
Claude (modelo Fable 5) sobre este punto; si esa consulta contradice la
confirmación provisional, la decisión se revisa.

`ekg-macro/README.md` gana una sección nueva ("Actualización del punto 4
(post-migración, 2026-08-04)") inmediatamente después del historial de
curación heredado, sin editar el bloque verbatim — mismo patrón de
anotación ya usado en esta bitácora para no reescribir el registro
histórico.

**Qué explícitamente NO cambia:**
- La historia 2 de §2 de esta bitácora permanece **"En revisión"**, no
  pasa a "Hecho" — la confirmación es provisional y está sujeta a la
  reserva de consulta externa; una confirmación condicional no es la
  firma económica firme que exige la Definition of Done (Doc. 4 §6.2).

**Verificación de cierre:** cambio de documentación únicamente
(`ekg-macro/README.md`); no toca `packages/cks/schema`,
`packages/cks/validate` ni ningún archivo de `agentes/`/`variables/` —
no se re-corrió la suite de tests por no haber cambios de código.

**[Reserva cerrada 2026-08-04 — ver entrada "PO + Claude Code — cierre de
la reserva del punto 4" en §4.]**

### 2026-08-04 — PO + Claude Code — cierre de la reserva del punto 4 (consulta externa realizada)

**La consulta externa se realizó.** La reserva registrada en la entrada
anterior ("confirmación provisional del punto 4") era condicional a
consultar una instancia externa de Claude (modelo Fable 5) por falta de
acceso a profesionales de macroeconomía. **Esa consulta se hizo el
2026-08-04**, en una sesión PO + Claude (Fable 5) dentro del proyecto de
Claude.ai.

**Qué resolvió la consulta:** **respalda** la decisión del punto 4, con
condiciones. Bajo `expectativas_estaticas`, "expectativas" no puede ser un
nodo del grafo sin contradecir el propio supuesto que lo habilita; el
tratamiento como supuesto es el económicamente correcto para IS-LM base y
es consistente con la secuencia de los manuales de referencia de Doc. 2
§13 (Blanchard, Mankiw, Dornbusch-Fischer-Startz); y "expectativas" como
variable genérica está mal definida — lo que existe son expectativas
*sobre algo*. La exclusión es **temporal por diseño**: al incorporar
modelos que relajen el supuesto (AD-AS, Phillips, Taylor — Doc. 2 §7), las
expectativas entran al grafo como variables **específicas** (p. ej.
`inflacion-esperada`, `tipo-cambio-esperado`) vía el campo `modelos` de
`variable.schema.json`, sin refactorización. El respaldo vino con dos
condiciones documentales (A y B, abajo) y una anotación menor de
taxonomía.

**Causa → efecto.** Esta actualización de documentos es **consecuencia
directa de esa consulta**: cada archivo tocado abajo ejecuta una condición
impuesta por ella o deja constancia de ella. No es una revisión rutinaria
de documentación ni una decisión tomada de nuevo en esta sesión — la
decisión ya estaba tomada de forma provisional el 2026-08-04 por la mañana
y lo que la vuelve firme es el resultado de la consulta.

**Firma económica del punto 4: provisional → firme.** Con las condiciones
ejecutadas, el PO ratifica el punto 4. Los cuatro puntos de clasificación
del catálogo quedan confirmados en firme.

**Advertencia conservada (riesgo R1, Doc. 4 §9):** la instancia consultada
es también un modelo Claude. La consulta **mitiga pero no elimina** R1 —
**no equivale a una revisión por un economista humano independiente**, que
es lo que exige Doc. 2 §11.3. R1 sigue abierto y declarado.

**Archivos tocados:**

- `consultas/consulta-externa-expectativas-2026-08-04.md` — **nuevo**
  (directorio `consultas/` también nuevo, siguiendo el precedente de
  `auditorias/`). Registro histórico de la consulta: metadatos,
  advertencia de no-independencia, veredicto y fundamento económico, las
  dos condiciones, la anotación de taxonomía y la resolución del PO. Es
  una fotografía de la consulta — no se reescribe con cambios
  posteriores.
- `ekg-macro/README.md` — **Condición A**. Sección nueva "Cierre de la
  reserva del punto 4 (2026-08-04)", inmediatamente después de
  "Actualización del punto 4 (post-migración, 2026-08-04)", sin editar
  ningún bloque existente (mismo patrón aditivo ya establecido). Deja
  constancia de que la consulta se realizó y respalda la decisión, del
  paso provisional → firme, de que la exclusión es **explícitamente
  temporal** (solo mientras el único modelo activo sea IS-LM base), de la
  anotación de taxonomía para S3+ y de la advertencia sobre R1.
- `docs/02-diseno-economico.md` — **Condición B**, con autorización
  explícita del PO para tocar un documento cerrado. Nota nueva bajo la
  tabla de agentes de §3, con el mismo patrón de las notas ya existentes
  (Sector externo/Mundell-Fleming; Banco Central/Regla de Taylor):
  "expectativas" figura en la columna "recibe" del Banco Central y de los
  Hogares porque el catálogo de agentes es fijo y compartido entre
  regímenes (§7.1), pero en IS-LM base no es variable del grafo sino
  supuesto (`expectativas_estaticas`, Doc. 3 §4.4); entra como variable(s)
  específica(s) solo en los modelos que relajan el supuesto (§7).
  Referencia cruzada a `ekg-macro/README.md` y al documento de consulta.
  Entrada **1.3** en la tabla de control de versiones (§14).
- `bitacora/sprint-02.md` — esta entrada; fila de la historia 2 en §2
  actualizada a "firma económica firme"; anotación aditiva
  `[Reserva cerrada 2026-08-04 …]` en las cuatro menciones previas al
  punto 4 en §4; entrada 1.7 en §6.

**Anotación de taxonomía registrada (no bloqueante, S3+):** la naturaleza
de las futuras variables de expectativas no calza limpiamente en
`stock`/`flujo`/`precio_tasa` (Doc. 2 §4.2) — una expectativa *sobre* una
tasa no es una tasa. Se suma como candidata a la **misma** revisión de
taxonomía ya abierta por `ciclo-economico` en la sesión de revisión
económica del 2026-08-03 (§4 de esta bitácora). No se abre una revisión
nueva ni se toca Doc. 2 §4.2.

**Qué explícitamente NO cambia:**

- La historia 2 de §2 permanece **"En revisión"**, no pasa a "Hecho" —
  queda pendiente **únicamente** de demostración en Sprint Review
  (Doc. 4 §6.2). Marcar Hecho es decisión del PO en la ceremonia, no de
  esta entrada.
- El catálogo (`ekg-macro/agentes/`, `ekg-macro/variables/`), los esquemas
  CKS (`packages/cks/schema/`) y la librería de validación
  (`packages/cks/validate/`) **no se tocan**. Todo el brief es
  documentación.
- **Doc. 2 §9 no se modifica**: la familia de eventos "choques de
  expectativas" ya era correcta y es precisamente la que fundamenta la
  temporalidad de la exclusión.
- **Doc. 3 no se edita**: ya modela las expectativas como supuesto
  correctamente (§4.4); no hay inconsistencia que corregir ahí. Docs. 0,
  1, 4 y 5 tampoco — la constancia transversal la dan el documento de
  consulta, esta bitácora y las referencias cruzadas de las notas.
- **No se crean las variables de expectativas** (`inflacion-esperada`,
  etc.): son contenido de modelos futuros (Doc. 2 §7), fuera del alcance
  de S2.
- El riesgo R1 (Doc. 4 §9) **sigue abierto** — ver advertencia arriba.

**Verificación de cierre:**

1. `grep` contra los archivos reales, todos confirmados presentes:
   sección `## Cierre de la reserva del punto 4 (2026-08-04)` en
   `ekg-macro/README.md`; nota nueva de "expectativas" bajo la tabla de
   §3 en `docs/02-diseno-economico.md`; entrada `| 1.3 | 2026-08-04 |` en
   la tabla de versiones de Doc. 2 (§14); archivo
   `consultas/consulta-externa-expectativas-2026-08-04.md`; esta entrada
   y la entrada `| 1.7 | 2026-08-04 |` en `bitacora/sprint-02.md`.
2. `git status` / `git diff --stat` en **ambos** repositorios: en
   `causeway`, modificados solo `bitacora/sprint-02.md` y
   `docs/02-diseno-economico.md`, más el archivo nuevo sin seguimiento
   `consultas/consulta-externa-expectativas-2026-08-04.md`; en
   `ekg-macro`, modificado solo `README.md`. Confirmado que **ningún**
   archivo de `ekg-macro/agentes/`, `ekg-macro/variables/`,
   `packages/cks/schema/` ni `packages/cks/validate/` cambió.
3. `cd packages/cks/validate && npm test` → **32/32 en verde**, sin
   cambios de conteo. Verificación de no-regresión, no formalidad: todo
   este trabajo es documental y la suite debe quedar exactamente donde
   estaba.

**Actualización documental verificada: ejecutada el 2026-08-04 como
consecuencia directa de la consulta externa registrada en
`consultas/consulta-externa-expectativas-2026-08-04.md`.**

## 5. Riesgos y bloqueos observados durante el sprint

- Migración pendiente acumulada: `validate-bundle-fixture` (desde S1) + el catálogo puente de agentes/variables (desde S2) ambos deben trasladarse a `ekg-macro` cuando ese repositorio se cree. Riesgo de que la creación de `ekg-macro` siga postergándose sprint tras sprint si no se prioriza explícitamente — a vigilar en Sprint Planning de S3. **[Resuelto 2026-08-03: `ekg-macro` (`hsssst00/ekg-macro`) creado; ambas migraciones completadas — ver entrada "2026-08-03 — Claude Code — migración a ekg-macro" en §4.]**
- `import-boundaries` sigue sin poder activarse: ningún paquete de código (`cre`, `ate`, `lsm`, `api`, `policylab-client`) tiene implementación real todavía. No es un bloqueo de S2, pero convergerá con E4 (CRE) recién en S5.

## 6. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-03 | Creación de la bitácora tras Sprint Planning de S2. |
| 1.1 | 2026-08-03 | Entrada de trabajo: Bloque 1 del brief de corrección de la auditoría independiente (tareas 1.1, 1.2, 1.4, 1.5 cerradas; 2.2 en borrador). Tareas 1.3 y 2.1 bloqueadas pendientes de insumo/decisión del PO. |
| 1.2 | 2026-08-03 | Tareas 1.3 (PO proporcionó `decisiones-arranque-scrum.md`) y 2.1 (PO eligió opción b) cerradas. Del brief de corrección solo queda 2.3, correctamente diferida a Sprint Planning de S3, y la retro de S1 en borrador a la espera del PO. **[Cerrada 2026-08-03 — ver `retro/sprint-01.md` v1.0.]** |
| 1.3 | 2026-08-03 | Historias 1 y 2 de S2 pasan a "En revisión": `variable.schema.json`, `reglas-integridad.js` (regla de duplicados) y el catálogo puente de agentes/variables quedan implementados y en verde en CI. Historia 2 queda explícitamente bloqueada para Hecho hasta firma económica del PO (cuatro puntos de clasificación documentados en `content-puente/README.md`). |
| 1.4 | 2026-08-03 | Se crea `ekg-macro` (Doc. 5 §3) y se completan ambas migraciones pendientes de §5: `validate-bundle-fixture` → `ekg-macro/.ci/validar-cks.yml`; catálogo puente de agentes/variables → `ekg-macro/agentes/` y `ekg-macro/variables/`. `packages/cks/content-puente/` eliminado de `causeway`. Se formaliza `variablesFantasmaOHuerfanas()` en `reglas-integridad.js` (29 → 32 tests). Historia 2 de §2 permanece "En revisión" — la migración es estructural, no resuelve el punto 4 (Expectativas) pendiente de firma del PO. |
| 1.5 | 2026-08-03 | `ekg-macro/agentes/*.json` y `variables/*.json` convertidos a `*.yaml` (31 archivos, round-trip verificado), cerrando la excepción documentada en `ekg-macro/README.md`. `validar-y-publicar-bundle.js` lee YAML vía `js-yaml` (dependencia nueva en `ekg-macro/package.json`, también nuevo); `VERSION` → `0.1.1`; `.ci/validar-cks.yml` gana paso `npm install` en `ekg-macro`. Bundle `is-lm-v0.1.1.json` publicado, idéntico a `0.1.0` salvo `version`/`generado` (diff estructural verificado); `is-lm-v0.1.0.json` intacto. Doc. 5 sin cambios — ya especificaba YAML correctamente. Historia 2 de §2 permanece "En revisión", sin relación con este cambio. |
| 1.6 | 2026-08-04 | El PO confirma provisionalmente el punto 4 (Expectativas excluida del catálogo de variables), con reserva de consulta a una instancia externa de Claude (Fable 5). `ekg-macro/README.md` anota la actualización sin reescribir el historial verbatim. Historia 2 de §2 permanece "En revisión", pero su columna Estado pasa de "esperando firma económica" a "firma económica completa — pendiente solo de demostración en Sprint Review" (los cuatro puntos de clasificación ya tienen confirmación del PO, el punto 4 de forma provisional). No pasa a "Hecho" — confirmación condicional, no firma económica firme. |
| 1.7 | 2026-08-04 | **Reserva del punto 4 cerrada.** La consulta a la instancia externa de Claude (Fable 5) se realizó el 2026-08-04 y **respalda** la decisión, con dos condiciones documentales y una anotación de taxonomía. Se registra la consulta como documento histórico en `consultas/consulta-externa-expectativas-2026-08-04.md` (directorio nuevo, precedente de `auditorias/`). Condición A: `ekg-macro/README.md` gana la sección "Cierre de la reserva del punto 4 (2026-08-04)", que deja la exclusión como **explícitamente temporal** (solo mientras el único modelo activo sea IS-LM base; las expectativas entran como variables específicas al relajar el supuesto en AD-AS/Phillips/Taylor). Condición B: Doc. 2 §3 gana una nota bajo la tabla de agentes sobre "expectativas" (v1.3), con autorización explícita del PO; §9 no se toca. Firma económica del punto 4: provisional → **firme**; la fila de la historia 2 en §2 pasa a "firma económica firme". La historia 2 permanece **"En revisión"** — pendiente únicamente de demostración en Sprint Review (Doc. 4 §6.2). Catálogo, esquemas y `packages/cks/validate` sin tocar (32/32 en verde, sin cambios de conteo). Riesgo R1 (Doc. 4 §9) sigue abierto: la instancia consultada es también un modelo Claude — mitiga, no elimina. |
