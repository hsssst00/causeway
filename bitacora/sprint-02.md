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

## 5. Riesgos y bloqueos observados durante el sprint

- Migración pendiente acumulada: `validate-bundle-fixture` (desde S1) + el catálogo puente de agentes/variables (desde S2) ambos deben trasladarse a `ekg-macro` cuando ese repositorio se cree. Riesgo de que la creación de `ekg-macro` siga postergándose sprint tras sprint si no se prioriza explícitamente — a vigilar en Sprint Planning de S3.
- `import-boundaries` sigue sin poder activarse: ningún paquete de código (`cre`, `ate`, `lsm`, `api`, `policylab-client`) tiene implementación real todavía. No es un bloqueo de S2, pero convergerá con E4 (CRE) recién en S5.

## 6. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-03 | Creación de la bitácora tras Sprint Planning de S2. |
