# Bitácora — Sprint 1 (S1)

**Fase:** F0
**Objetivo del sprint:** Repos y CI esqueleto; estructura de monolito modular; primer borrador del CKS (nodo, arista).
**Épicas activas:** E0 (CKS v1), E1 (Arquitectura Causeway y CI de contenido)
**Fecha de Sprint Planning:** 2026-08-02

---

## 1. Decisiones de arranque heredadas

Ver `decisiones-arranque-scrum.md` (memoria de proyecto). Resumen operativo:
- El repositorio `causeway` aún no existe; su creación es el contenido mismo de S1.
- Riesgo R1 (revisión económica no independiente): abierto, no bloqueante. PO en gestiones con docentes de cátedra.

## 2. Alcance cerrado en Sprint Planning

| # | Historia | Épica | Ref. cruzada | Fase | Estado |
|---|---|---|---|---|---|
| 1 | Esquema JSON de `relacion` con `explicacion_si_error` obligatoria | E0 | Doc. 0 §3.6, Doc. 3 §7.3 | F0 | Backlog → Lista para sprint |
| 2 | Esquemas de `evento`, `agente`, `supuesto`, `escenario` | E0 | Doc. 3 §7.3 | F0 | Backlog → Lista para sprint |
| 3 | Reglas de integridad automatizadas, validadas contra los fragmentos ilustrativos de Doc. 3 §7.3 (no contra el catálogo real del EKG, que corresponde a S2) | E0 | Doc. 2 §8.2, Doc. 3 §7.3 | F0 | Backlog → Lista para sprint |
| 4 | Monolito modular con fronteras de importación verificables en CI | E1 | Doc. 0 §4, Doc. 5 §2.1 | F0 | Backlog → Lista para sprint |
| 5 | Pipeline que valida un bundle EKG contra CKS y lo publica versionado | E1 | Doc. 5 §3.2 | F0 | Backlog → Lista para sprint |

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
- `docs/adr/0001-monorepo-vs-dos-repos.md` sigue vacío; no es parte del alcance de S1, pero el README ya lo referencia — señalarlo para no perderlo de vista.

## 5. Riesgos y bloqueos observados durante el sprint

_(Vacío al inicio del sprint.)_

## 6. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-02 | Creación de la bitácora tras Sprint Planning de S1. |
| 1.1 | 2026-08-03 | Se agrega entrada de trabajo: primer borrador de los 5 esquemas CKS y de `.ci/fronteras.yml` (historias 1, 2 y 4). |