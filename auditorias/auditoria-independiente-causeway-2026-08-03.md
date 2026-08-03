# Auditoría externa independiente — PolicyLab / Causeway
**Repositorio auditado:** `github.com/hsssst00/causeway` (commit `a8bfd29`, rama `main`)
**Fecha:** 2026-08-03
**Auditor:** Instancia externa de Claude, sin participación previa en el diseño ni la implementación del proyecto

**Nota metodológica.** Esta auditoría se ejecutó clonando el repositorio real, corriendo `npm test` directamente, leyendo el código y los esquemas fuente, y verificando el historial de git — no a partir de lo que las bitácoras o los documentos afirman. Donde una afirmación no pudo verificarse contra evidencia primaria, se dice explícitamente. Un caso de sospecha propia resultó ser falso positivo (ver C2) y se reporta igual, como evidencia de que la verificación fue real y no una confirmación de lo esperado.

---

## 1. Resumen ejecutivo

El proyecto es, en buena medida, lo que dice ser. El corpus de diseño (Docs. 0–5) es internamente coherente, y la primera pieza de software (CKS: 5 esquemas, librería de validación, 13 tests) existe, funciona y pasa en verde — verificado por ejecución directa, no por lectura de la bitácora. La honestidad metodológica es genuina: Hallazgo A ya corregido, riesgos R1–R6 declarados sin eufemismos, redefiniciones de alcance documentadas con el mismo nivel de detalle que el problema original.

Pero hay grietas reales y verificables: un criterio de aceptación cita fragmentos que no existen en el corpus; un job de CI marcado "Hecho" está de hecho inactivo (`if: false`) sin caso de prueba que lo respalde; la retrospectiva obligatoria de S1 nunca se escribió; y la memoria que sostiene la narrativa de mitigación de R1 vive fuera del repositorio, invisible para cualquiera que audite solo el código. Ninguna es fatal. Todas son corregibles antes de F0.

---

## 2. Hallazgos por dimensión

Convención: **(a)** = lo que el diseño documenta · **(b)** = lo que la bitácora dice · **(c)** = lo que el repo real contiene.

### A. Rigor y coherencia del corpus de diseño

**A1 — Criterio de aceptación que cita algo inexistente en el corpus** · Severidad: **medio** · Tipo: divergencia (a)↔(c), sin resolver
La historia 2 de E0 (Doc. 4 §7, línea 109) fija como criterio de aceptación: *"Los cuatro esquemas [evento, agente, supuesto, escenario] validan contra los fragmentos ilustrativos de Doc. 3, §7.3."* Pero Doc. 3 §7.3 (líneas 442–498) solo contiene fragmentos ilustrativos JSON para `relacion` y `evento` — no existe fragmento ilustrativo alguno para `agente`, `supuesto` ni `escenario`. El criterio, tal como está redactado, es literalmente imposible de cumplir para 3 de los 4 esquemas que nombra. `bitacora/sprint-01.md:47` lo reconoce de facto ("sin fragmento previo en el corpus; diseñados siguiendo la estructura conceptual de Doc. 2") pero Documento 4 nunca fue corregido para reflejarlo — es exactamente el mismo patrón que Hallazgo A (cita a contenido que no existe), sin que nadie lo haya señalado hasta ahora.

**A2 — Tablas de "Control de versiones" no trazables contra el historial real de git** · Severidad: bajo-medio · Tipo: divergencia (a)↔(c)
Doc. 0 declara versiones 1.0 → 1.0.1 → 1.1 y Doc. 2 declara 1.0 → 1.1, cada una con fecha y descripción de cambio. Verificado con `git log --oneline --follow -- docs/00-identidad-y-arquitectura.md` y el equivalente para Doc. 2: ambos documentos aparecen *únicamente* en los commits `28fff4d` y `5d9e14d` — nunca hubo un commit independiente por cada versión declarada. Las tablas no son falsas (el contenido descrito sí cambió respecto a una versión anterior no versionada en git), pero presentan como historial versionado algo que en realidad se escribió de una sola vez, en el mismo commit que "publica" la v1.0.

**A3 — La memoria de arranque del programa no vive en el repositorio que dice gobernar** · Severidad: bajo · Tipo: problema de fondo
`bitacora/sprint-01.md:12` cita `decisiones-arranque-scrum.md` como "memoria de proyecto" a tratar como parte de Doc. 4. Ese archivo no existe en ningún lugar del repositorio (`grep -r "decisiones-arranque-scrum" .` solo encuentra la referencia, no el archivo). Sí existe fuera del repo, en el espacio de proyecto de Claude.ai. La decisión #1 registrada en ese mismo archivo externo dice textualmente: *"la bitácora de sprint vive en el repositorio... nunca solo en el historial de un chat."* El documento que enuncia ese principio no lo cumple sobre sí mismo. Consecuencia práctica: la única justificación citada para no bloquear R1 ("PO en gestiones con docentes de cátedra") es inverificable para cualquiera que audite solo el repositorio, como se supone que debe ser posible (Doc. 5 §1).

**A4 — README desactualizado respecto al estado real del repositorio** · Severidad: bajo · Tipo: divergencia (a)↔(c)
`README.md` no ha sido tocado desde el commit `28fff4d` (`git log --follow -- README.md`), anterior a S1. Describe el repositorio como "el corpus completo de diseño... seis documentos" y no menciona `packages/`, los tres workflows de CI, ni el estado de S1/S2, pese a que S1 ya agregó código real, tests y CI funcional.

**A5 — Archivo de configuración local de herramienta commiteado al repo** · Severidad: bajo · Tipo: problema de fondo (higiene)
`.claude/settings.local.json` está trackeado en git (`git ls-files | grep .claude`). Es un archivo de permisos de herramienta normalmente local/efímero, y expone rutas de scaffolding transitorio (`_tmp_raw/doc0_fixed.md`, etc.) ajenas al corpus documentado.

### B. Fidelidad de la ejecución S1–S2 contra lo declarado

**B1 — Historia marcada "Hecho" cuyo criterio de aceptación literal no se cumple hoy** · Severidad: **medio** · Tipo: divergencia (b)↔(c)
Historia 4 de S1 ("fronteras de importación verificables en CI") está marcada **Hecho** en `bitacora/sprint-01.md:23`. El criterio de aceptación de Doc. 4 §7 es: *"Una regla de importación violada rompe el build; caso de prueba incluido."* Verificado en `.ci/fronteras.yml`: el job `import-boundaries` que contiene toda la lógica de verificación tiene `if: false` — nunca se ejecuta. No existe ningún caso de prueba automatizado (ni en CI ni como test unitario) que ejercite esa lógica. Si alguien violara una regla de importación hoy mismo, ningún job de CI lo detectaría. La bitácora es honesta en su prosa ("inactivo hasta S2"), pero S2 llegó y pasó sin activarlo (`bitacora/sprint-02.md:15` confirma que sigue bloqueado, correctamente, a la espera de E4 en S5) — y el estado del tablero sigue siendo "Hecho" sin matiz, no "hecho parcialmente" ni reabierto.

**B2 — Esquema sin cobertura de test alguna, pese a estar dentro del alcance de la historia** · Severidad: bajo-medio · Tipo: divergencia (b)↔(c)
Verificado corriendo la suite real (`npm test` en `packages/cks/validate`): 13/13 tests pasan, coincide exactamente con lo que dice `bitacora/sprint-01.md:66`. Pero de los 4 esquemas cubiertos por la historia 2 de E0, `evento.schema.json` es el único de los 5 esquemas totales del CKS sin ningún test que lo ejercite — ni positivo ni negativo (`grep "validarDocumento" test/validate.test.js` no arroja ninguna llamada con `'evento'`). Probé manualmente el esquema con un documento evento válido: valida correctamente, no hay bug latente. Pero la ausencia de test significa que el criterio de aceptación literal de la historia ("los cuatro esquemas validan...") no está demostrado en CI para este esquema, y un cambio futuro no tiene red de seguridad.

**B3 — Verificación positiva: el bug de referencias cruzadas reportado en la bitácora es real y la corrección funciona** · Tipo: confirmación
`bitacora/sprint-01.md:62` afirma que `evento.schema.json` referenciaba `cks/agente-ref/v1` sin que existiera, y que se corrigió centralizando referencias en `refs.schema.json` con IDs planos. Esto es consistente con lo que muestra Doc. 3 §7.3 (que usa exactamente `$id` con forma de ruta, `cks/relacion/v1`) y con el código real, que usa IDs planos (`cks-relacion-v1`). La corrección está efectivamente implementada y los 13 tests, incluida la resolución de `$ref`, pasan.

**B4 — Retrospectiva obligatoria de S1 nunca se escribió** · Severidad: **alto** · Tipo: divergencia (a)↔(c)
Doc. 4 §5.1 exige una retrospectiva escrita al cierre de cada sprint, archivada en `retro/`. `bitacora/sprint-01.md` v1.2 declara **"S1 cerrado"**. `retro/` contiene únicamente `.gitkeep` — no existe ningún documento de retrospectiva, y ninguna de las dos bitácoras siquiera menciona la omisión. Es un incumplimiento silencioso de un artefacto de proceso obligatorio; exactamente el tipo de cosa que el rol de Scrum Master redefinido en Doc. 4 §1.3 ("guardián de la ambigüedad", no de reuniones) debería haber capturado y no capturó.

**B5 — Sprint Planning de S2: sin evidencia de historias admitidas por conveniencia narrativa** · Tipo: confirmación
Las dos historias de S2 cumplen DoR formalmente: objetivo y criterio verificable, referencia cruzada, dependencia interna declarada explícitamente (`bitacora/sprint-02.md:35`), ventana de revisión del PO confirmada (`:30`). El único añadido fuera del backlog original de Doc. 4 (esquema de `variable`) tiene una justificación técnica verificable — sin él, "sin duplicados detectados por CI" no es automatizable — y está correctamente exento de la restricción de revisión de contenido económico por no serlo.

### C. Calidad técnica de lo producido

**C1 — Ver B2 y B3.**

**C2 — Sospecha propia descartada tras verificación directa (se reporta por transparencia metodológica)**
Inicialmente sospeché que el job placeholder de `.ci/fronteras.yml` (que debe fallar mientras no exista código real en `packages/*/src`) podía dar un falso negativo: su condición es `find packages -path '*/src/*' -type f ! -name '.gitkeep'`, y tras instalar dependencias localmente ese comando devolvió 82 — porque varios paquetes de `node_modules` (p. ej. `@babel/core/src/...`) contienen carpetas `src/` propias. Verifiqué si esto podía ocurrir en CI real: `node_modules/` está correctamente excluido vía `.gitignore` y no está trackeado en git; en un checkout limpio (sin `npm install` local previo) el mismo comando devuelve 0. El job `fronteras.yml` nunca ejecuta `npm install`, así que en GitHub Actions real este falso positivo no se produce. El mecanismo, tal como está configurado, es robusto.

**C3 — Deuda de migración acumulándose con seguimiento activo, no pasivo** · Severidad: medio (a vigilar) · Tipo: riesgo gestionado correctamente por ahora
El "puente" de `cks-lib.yml` (historia 5, S1) y ahora el catálogo puente de agentes/variables (S2) están documentados como deuda técnica migratoria hacia `ekg-macro`. A diferencia de un job olvidado, `bitacora/sprint-02.md:52` señala explícitamente el riesgo de postergación indefinida y lo marca "a vigilar en Sprint Planning de S3" — es gestión activa, no solo anotación. Pero ya son dos migraciones acumuladas sin fecha límite ni criterio de "basta" definido en ningún documento; si S3 tampoco prioriza la creación de `ekg-macro`, el patrón se normalizará.

### D. Gestión de riesgos del programa (Doc. 4 §9)

**D1 — R1 (revisión económica no independiente): abierto, sin evidencia repositorio-verificable de mitigación activa** · Severidad: **alto** · Tipo: problema de fondo
R1 sigue abierto en ambos sprints sin cambios, declarado honestamente como tal. La única mitigación activa mencionada — "PO en gestiones con docentes de cátedra" — vive únicamente en `decisiones-arranque-scrum.md` (ver A3), que no está en el repositorio. Un auditor con acceso solo al repo (el escenario que Doc. 5 §1 asume como normal, dado que separa código de contenido precisamente para permitir revisión independiente) no tiene forma de verificar que existe gestión real hacia un revisor externo.

**D2 — R4 (contenido plausible pero incorrecto): mitigación aún no puesta a prueba** · Severidad: medio · Tipo: riesgo correctamente etiquetado como pendiente
La mitigación declarada (DoD exige validación humana explícita) todavía no ha sido ejercitada: el único contenido "económico" que existe hoy es el fixture ilustrativo, que es una transcripción literal del ejemplo ya diseñado en Doc. 2 §5.2 — no contenido nuevo generado por un agente de IA sin supervisión previa. La primera prueba real de R4 llega con el mecanismo fiscal (E2 historia 3, Doc. 4 §7), marcado explícitamente como "contenido nuevo, no desarrollado en Doc. 2" — es la historia a observar con más atención cuando llegue.

**D3 — Ver B4.** La ausencia de retrospectiva es, en sí misma, una falla del mecanismo que Doc. 4 diseñó para atender R2/R3 (pérdida de contexto y dependencia de una única persona humana): sin retro, el aprendizaje de proceso entre sprints no queda registrado en ningún artefacto verificable.

---

## 3. Lo que pondría en riesgo la credibilidad del programa si no se corrige antes de S3–S4 (hito F0)

1. **Historia 4 de S1 sigue marcada "Hecho" sin que su criterio de aceptación se cumpla.** Activar `import-boundaries` (aunque sea con un único paquete real) o reabrir explícitamente la historia con estado "hecho parcial" antes de que el patrón de marcar cosas "Hecho" con reservas se normalice.
2. **El criterio de aceptación de historia 2/E0 en Doc. 4 §7 cita algo que no existe en Doc. 3 §7.3.** Corregirlo (o generar los fragmentos faltantes) y añadir cobertura de test para `evento.schema.json` — es la clase de defecto documental que Hallazgo A ya demostró que este corpus puede tener y no detectar solo.
3. **La retrospectiva de S1 no existe.** Escribirla retroactivamente o documentar explícitamente por qué se omite, antes de que S2 se cierre con el mismo vacío — es el mismo riesgo de "puente permanente" que el equipo ya sabe vigilar para `ekg-macro`, aplicado a su propio proceso.
4. **`decisiones-arranque-scrum.md` vive fuera del repositorio.** Moverlo a `bitacora/` o equivalente para que R1 y las decisiones de arranque sean verificables por cualquiera con acceso solo al repo — es el propio principio que ese documento enuncia y no cumple.
5. **Sin fecha límite para `ekg-macro`.** Dos migraciones acumuladas (bundle-fixture, catálogo agentes/variables) sin criterio de "basta" arriesgan convertirse en una tercera antes de que S3 lo priorice explícitamente.
