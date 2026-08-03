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
| 1 | Esquema JSON de `variable` (nombre, agente(s), tipo, naturaleza, modelos_validos) + extensión de `reglas-integridad.js` con detección de variables duplicadas | E0 | Doc. 2 §4.3, Doc. 4 §7 (criterio de aceptación de la historia de catálogo de E2) | F0 | Pendiente |
| 2 | Catálogo completo de los seis agentes (Doc. 2 §3) y sus variables típicas (Doc. 2 §4.3), autorado como solución puente dentro de `causeway` | E2 | Doc. 2 §3, §4.3; Doc. 4 §7; Doc. 5 §3 | F0 | Pendiente |

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
- **Tarea 2.2 (Hallazgo B4), borrador:** creado `retro/sprint-01.md` como borrador explícito con la lista de preguntas abiertas para que el PO complete su reflexión — no se fabricó una retrospectiva completa sin ese insumo (habría repetido el problema que el propio hallazgo señala). Queda marcado como "BORRADOR" hasta que el PO la complete.

**Qué queda pendiente:**
- **Tarea 2.3 (Hallazgo C3):** sin acción en S2, correctamente — es una decisión de alcance para el Sprint Planning de S3 (fijar sprint límite para crear `ekg-macro`), no algo ejecutable a mitad de S2.
- **Retro de S1** (`retro/sprint-01.md`): sigue en borrador hasta que el PO responda las preguntas abiertas.

**Verificación de cierre:** `cd packages/cks/validate && npm test` → 18/18 en verde; `./scripts/test-check-import-boundaries.sh` → ambos casos pasan; `./scripts/check-import-boundaries.sh .` → sin violaciones contra el repo real.

## 5. Riesgos y bloqueos observados durante el sprint

- Migración pendiente acumulada: `validate-bundle-fixture` (desde S1) + el catálogo puente de agentes/variables (desde S2) ambos deben trasladarse a `ekg-macro` cuando ese repositorio se cree. Riesgo de que la creación de `ekg-macro` siga postergándose sprint tras sprint si no se prioriza explícitamente — a vigilar en Sprint Planning de S3.
- `import-boundaries` sigue sin poder activarse: ningún paquete de código (`cre`, `ate`, `lsm`, `api`, `policylab-client`) tiene implementación real todavía. No es un bloqueo de S2, pero convergerá con E4 (CRE) recién en S5.

## 6. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-03 | Creación de la bitácora tras Sprint Planning de S2. |
| 1.1 | 2026-08-03 | Entrada de trabajo: Bloque 1 del brief de corrección de la auditoría independiente (tareas 1.1, 1.2, 1.4, 1.5 cerradas; 2.2 en borrador). Tareas 1.3 y 2.1 bloqueadas pendientes de insumo/decisión del PO. |
| 1.2 | 2026-08-03 | Tareas 1.3 (PO proporcionó `decisiones-arranque-scrum.md`) y 2.1 (PO eligió opción b) cerradas. Del brief de corrección solo queda 2.3, correctamente diferida a Sprint Planning de S3, y la retro de S1 en borrador a la espera del PO. |
