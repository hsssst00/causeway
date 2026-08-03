# Bitácora — Sprint 1 (S1)

**Fase:** F0
**Objetivo del sprint:** Repos y CI esqueleto; estructura de monolito modular; primer borrador del CKS (nodo, arista).
**Épicas activas:** E0 (CKS v1), E1 (Arquitectura Causeway y CI de contenido)
**Fecha de Sprint Planning:** 2026-08-02

---

## 1. Decisiones de arranque heredadas

Ver [`bitacora/decisiones-arranque-scrum.md`](decisiones-arranque-scrum.md) (copiada al repo en S2, Tarea 1.3 del brief de corrección de la auditoría independiente — Hallazgo A3; antes vivía solo como documento externo fuera de control de versiones). Resumen operativo:
- El repositorio `causeway` aún no existe; su creación es el contenido mismo de S1.
- Riesgo R1 (revisión económica no independiente): abierto, no bloqueante. PO en gestiones con docentes de cátedra.

## 2. Alcance cerrado en Sprint Planning

| # | Historia | Épica | Ref. cruzada | Fase | Estado |
|---|---|---|---|---|---|
| 1 | Esquema JSON de `relacion` con `explicacion_si_error` obligatoria | E0 | Doc. 0 §3.6, Doc. 3 §7.3 | F0 | **Hecho** |
| 2 | Esquemas de `evento`, `agente`, `supuesto`, `escenario` | E0 | Doc. 3 §7.3 | F0 | **Hecho** |
| 3 | Reglas de integridad automatizadas, validadas contra los fragmentos ilustrativos de Doc. 3 §7.3 (no contra el catálogo real del EKG, que corresponde a S2) | E0 | Doc. 2 §8.2, Doc. 3 §7.3 | F0 | **Hecho** |
| 4 | Monolito modular con fronteras de importación verificables en CI | E1 | Doc. 0 §4, Doc. 5 §2.1 | F0 | **Hecho** (job placeholder activo; `import-boundaries` queda listo pero inactivo hasta S2) |
| 5 | Pipeline que valida un bundle EKG contra CKS y lo publica versionado | E1 | Doc. 5 §3.2 | F0 | **Hecho** (solución puente en `causeway`; se traslada a `ekg-macro` cuando ese repo exista) |

**Decisión de scope tomada en planning:** la historia 3 del backlog original (Doc. 4 §7) dependía del catálogo de variables del EKG (Doc. 2 §4.3), que no existe hasta S2 — violaría DoR (§6.1: dependencias de datos deben existir). Se redefinió su criterio de aceptación para validar contra los fragmentos ilustrativos de Doc. 3 §7.3, preservando el resto del alcance de S1 sin bloqueo.

**Nota de secuencia interna:** las historias 1–2 deben completarse antes de que la historia 5 sea demostrable (necesita al menos un esquema CKS publicado).

## 3. Primeros pasos concretos (Doc. 5 §5)

- [ ] Crear `causeway` con la estructura de Doc. 5 §2 vacía + CI de fronteras (`.ci/fronteras.yml`) fallando intencionalmente hasta que exista al menos un paquete real.
- [ ] Crear `ekg-macro` con la estructura de Doc. 5 §3 vacía + plantilla de PR de curación.
- [ ] Crear el tablero con las cinco columnas de Doc. 5 §4.1, los campos de §4.2, y veinte Milestones (S1–S20) vacíos.
- [ ] Cargar en el tablero las historias de E0 y E1 (tabla §2 de esta bitácora) como tarjetas en "Backlog", usando la plantilla de Doc. 5 §4.3.

## 4. Entradas de trabajo

_(Esta sección se completa a medida que avanza el sprint — Claude Code y Claude registran aquí cada sesión de trabajo, ya que ninguno conserva memoria entre sesiones. Formato sugerido: fecha, quién, qué se hizo, qué queda pendiente.)_

### 2026-08-03 — Claude

**Qué se hizo:**
- Revisión del repositorio `causeway` recién creado: estructura de carpetas correcta (coincide con Doc. 5 §2), pero `packages/cks/schema/*.json`, `.ci/*.yml` y `docs/adr/0001-monorepo-vs-dos-repos.md` existían como archivos vacíos.
- Primer borrador de los cinco esquemas CKS (historias 1 y 2, E0):
  - `relacion.schema.json` y `evento.schema.json`: transcritos del fragmento ilustrativo literal de Doc. 3 §7.3.
  - `agente.schema.json`, `supuesto.schema.json`, `escenario.schema.json`: sin fragmento previo en el corpus; diseñados siguiendo la estructura conceptual de Doc. 2 §3 (agentes), §5.1/§7 (supuestos) y §10 (tipos de escenario).
- Primer borrador de `.ci/fronteras.yml` (historia 4, E1): workflow con dos jobs — uno activo que **falla intencionalmente** mientras `packages/*/src` no tenga código real (Doc. 5 §5), y uno inactivo (`import-boundaries`, `if: false`) con la lógica completa de la tabla de dependencias de Doc. 5 §2.1, listo para activarse cuando exista código.

**Qué queda pendiente:**
- Harold debe copiar los 6 archivos generados a las rutas correspondientes del repo y hacer commit (Claude no tiene push directo al repositorio de GitHub).
- Validar los 5 esquemas contra un documento de prueba real, incluyendo el caso negativo exigido por el criterio de aceptación de la historia 1 (`relacion` sin `explicacion_si_error` debe fallar la validación de CI).
- `packages/cks/validate/` sigue vacío: la librería de validación que consumirá también la CI de `ekg-macro` (Doc. 5 §2, historia de integridad de E0) aún no se ha escrito.
- Activar `import-boundaries` en `.ci/fronteras.yml` en cuanto exista al menos un archivo de código real en cualquier `packages/*/src`.
- `docs/adr/0001-monorepo-vs-dos-repos.md` sigue vacío; no es parte del alcance de S1, pero el README ya lo referencia — señalarlo para no perderlo de vista. **[Resuelto 2026-08-03, ver entrada siguiente.]**

### 2026-08-03 (sesión 2) — Claude

**Qué se hizo:**
- Redactado y subido `docs/adr/0001-monorepo-vs-dos-repos.md` (decisión ya tomada en Doc. 5 §1, formalizada como ADR).
- **S1 completado.** Las 5 historias de E0/E1 quedan cerradas:
  - Historia 1 y 2 (esquemas CKS): se detectó y corrigió un bug real al implementar la validación — `evento.schema.json` referenciaba `cks/agente-ref/v1`, que nunca estaba definido. Se centralizaron `variable-ref`, `agente-ref` y `supuesto-ref` en `packages/cks/schema/refs.schema.json`. Además, los `$id` con forma de ruta (`cks/relacion/v1`) causaban resolución relativa de URI ambigua en ajv (`cks/relacion/v1` + `cks/variable-ref/v1` → `cks/cks/variable-ref/v1`); se renombraron todos a identificadores planos sin `/` (`cks-relacion-v1`, etc.).
  - Historia 3 (reglas de integridad, redefinida en Sprint Planning): implementada en `packages/cks/validate/reglas-integridad.js` (`variablesSinAgente`, `aristasFueraDelGrafoDelModelo`), validada contra el fixture ilustrativo del mecanismo monetario de Doc. 2 §5.2 — no contra el catálogo real del EKG, como se decidió.
  - Historia 4 (fronteras): sin cambios respecto a la sesión anterior.
  - Historia 5 (pipeline valida + publica bundle versionado): implementada en `.ci/cks-lib.yml` dentro de `causeway` como solución puente, ya que `ekg-macro` todavía no existe. Documentado explícitamente que este job se traslada a `ekg-macro/.ci/validar-cks.yml` cuando ese repositorio se cree.
- `packages/cks/validate` es ahora una librería real (ajv + ajv-formats), con 13 tests de Jest, todos en verde, incluyendo el caso negativo exigido literalmente por el criterio de aceptación de la historia 1 (relación sin `explicacion_si_error` falla la validación).
- `.ci/tests.yml` creado: corre `npm test` en cada paquete que tenga `package.json`, sin fallo intencional (a diferencia de `fronteras.yml`, aquí un paquete vacío no es una violación de ninguna regla).

**Qué queda pendiente para S2:**
- Activar el job `import-boundaries` de `.ci/fronteras.yml` en cuanto exista código real en algún `packages/*/src` (hoy solo existe código en `packages/cks`, que no está en la tabla de fronteras porque `cks/validate` es consumido por todos, no un paquete con reglas de importación restringidas).
- Crear el repositorio `ekg-macro` (Doc. 5 §3) y trasladar la lógica de `validate-bundle-fixture` de `.ci/cks-lib.yml` a `ekg-macro/.ci/validar-cks.yml`, operando sobre bundles reales.
- El catálogo real de variables del EKG (Doc. 2 §4.3) sigue sin existir — es lo que desbloquea, en S2, volver a `reglas-integridad.js` para que reciba el catálogo real en vez del fixture ilustrativo.
- Ningún contenido económico de E2 se ha tocado en esta sesión (fuera del alcance elegido para S1).

## 5. Riesgos y bloqueos observados durante el sprint

_(Vacío al inicio del sprint.)_

## 6. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-02 | Creación de la bitácora tras Sprint Planning de S1. |
| 1.1 | 2026-08-03 | Se agrega entrada de trabajo: primer borrador de los 5 esquemas CKS y de `.ci/fronteras.yml` (historias 1, 2 y 4). |
| 1.2 | 2026-08-03 | **S1 cerrado.** Se agregan `docs/adr/0001`, `.ci/tests.yml`, `.ci/cks-lib.yml` (historia 5), `packages/cks/validate` (librería + 13 tests en verde), `reglas-integridad.js` (historia 3) y `packages/cks/schema/refs.schema.json` (corrección de un bug de referencias cruzadas detectado al implementar los tests). |
| 1.3 | 2026-08-03 | §1: referencia a `decisiones-arranque-scrum.md` actualizada a su ruta dentro del repo (`bitacora/decisiones-arranque-scrum.md`), copiada verbatim en S2 (Tarea 1.3 del brief de corrección de la auditoría independiente, Hallazgo A3). |