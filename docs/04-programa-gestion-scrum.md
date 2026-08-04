# Documento 4 — Programa de Gestión Scrum
## Fases F0–F2 de PolicyLab (preproducción, corte vertical y MVP)

---

### 0. Ficha del documento

| Campo | Descripción |
|---|---|
| **Pregunta que responde** | ¿Cómo se gestiona, sprint a sprint, el desarrollo de PolicyLab desde preproducción hasta un MVP listo para el piloto — con un equipo de tres integrantes, dos de los cuales son agentes de IA sin estado persistente entre sesiones? |
| **Audiencia principal** | El propio equipo (Product Owner humano, Claude, Claude Code); referencia si en el futuro se incorpora un colaborador humano adicional. |
| **Relación con Documento 0** | Usa la nomenclatura normativa (CRE, ATE, LSM, EKG, CKS, Causeway, PolicyLab) y respeta las reglas de dependencia (§4) como criterios de aceptación técnica. |
| **Relación con Documento 1 y 2** | El contenido pedagógico y económico que este programa produce (escenarios, aristas, explicaciones de error) no se diseña aquí: se **autora** aquí, siguiendo lo ya especificado en Doc. 1 y Doc. 2. Este documento no repite esas decisiones, solo las convierte en historias de backlog. |
| **Relación con Documento 3** | Este es el documento que **ejecuta** el roadmap del Documento 3, §8.2. Las fases F0, F1 y F2, sus entregables y sus hitos de salida se toman literalmente de ahí; este documento los descompone en sprints, historias y criterios de aceptación verificables. |
| **Alcance** | Gestión de F0 (preproducción), F1 (corte vertical) y F2 (MVP) — meses 1 a 10 del roadmap de Doc. 3. |
| **Fuera de alcance (deliberado)** | **F3 — Piloto de validación con estudiantes reales** y fases posteriores. La validación en clases reales no es un sprint más: implica diseño pre/post con instrumento externo, coordinación con docentes y, probablemente, consideraciones éticas de investigación con personas (consentimiento informado) que exceden la gestión de producto y merecen su propio protocolo, no una historia de Scrum. Este documento prepara el terreno para F3 (§8, sprint 19) pero no lo gestiona. |

---

### 1. Por qué Scrum, y qué hay que adaptar

El roadmap de Doc. 3 (§8.2) ya tiene la forma de una gestión ágil: fases cortas con entregables verificables, un hito de salida explícito por fase, y un punto de decisión go/no-go real (F1: "decisión go/no-go sobre el constructor causal"). Scrum (Schwaber & Sutherland) es el marco natural porque el mayor riesgo del proyecto no es de alcance sino de **incertidumbre de diseño**: no se sabe de antemano si el constructor causal se entiende en móvil, ni cuántas iteraciones de contenido necesita una explicación de error para ser pedagógicamente correcta. Eso se resuelve con incrementos cortos e inspeccionables, no con una planificación en cascada de 10 meses.

Dicho esto, este equipo no es el equipo para el que Scrum fue escrito, y pretender que sí lo es sería el primer error de gestión del programa. Tres adaptaciones son obligatorias:

**1.1. No hay "daily" sincrónico posible.** Un daily de 15 minutos asume que el equipo comparte contexto tácito de un día para otro. Claude y Claude Code no retienen memoria de trabajo entre sesiones salvo lo que quede escrito. Por eso el ritual diario de este programa no es una reunión: es una **bitácora de sprint** (§5.2), un archivo versionado que cada sesión de trabajo actualiza y que cada sesión de trabajo nueva debe leer antes de continuar. Sin este artefacto, el programa pierde continuidad real, no solo formal.

**1.2. El Product Owner no puede quedar fuera del equipo de desarrollo.** En Scrum "de libro", el PO prioriza pero no ejecuta. Aquí eso es inviable: el PO es, además, el único economista y el único diseñador instruccional del equipo (Doc. 3, §8.3), y la autoría de contenido económico-pedagógico es trabajo de desarrollo, no solo de priorización. Se acepta esta tensión explícitamente en vez de ignorarla (§3).

**1.3. El Scrum Master no protege al equipo de interrupciones externas — protege el proyecto de la ambigüedad.** El riesgo clásico que un Scrum Master mitiga (que el equipo se disperse atendiendo pedidos externos) casi no existe aquí. El riesgo real es el opuesto: que una historia mal especificada produzca contenido económico o código plausible pero incorrecto, porque un agente de IA ejecuta con fluidez incluso una instrucción ambigua. Por eso el rol de Scrum Master en este programa se redefine como **guardián de la Definition of Ready y de la trazabilidad Doc. 0–3** (§6), no como facilitador de reuniones.

---

### 2. Alcance de gestión y no-metas

Este programa gestiona la construcción de: CKS v1, EKG IS-LM v0, Causeway (CRE + ATE mínimo + LSM), el cliente PolicyLab correspondiente al MVP (Doc. 3, §8.1), y la preparación logística del piloto.

No gestiona: la ejecución del piloto F3, la incorporación de un segundo dominio (criterio de generalidad, Doc. 0, §5), ni Nivel III–V (explícitamente fuera del MVP, Doc. 3, §8.1).

---

### 3. Roles

Se mantienen los tres roles de Scrum, pero con una nota de honestidad sobre dónde se traslapan.

| Rol Scrum | Quién | Qué cubre de los seis roles de Doc. 3, §8.3 | Qué NO cubre por sí solo |
|---|---|---|---|
| **Product Owner** | El usuario (tú) | Responsable de proyecto/investigación; economista de contenido (autoría y decisión final); diseñador instruccional (decisión final de nivel y dificultad); todas las decisiones de producto de PolicyLab reservadas al PO por Doc. 0, §3.9 | **Revisión económica independiente.** Doc. 2, §11.3 exige que el proceso de curación incluya una revisión económica distinta de la autoría. Si el PO autora y el PO revisa, esa etapa del proceso de curación queda debilitada por diseño, no por descuido — se trata explícitamente en §9. |
| **Scrum Master + co-diseño** | Claude (esta instancia conversacional) | Diseño instruccional y económico de apoyo (borradores validables por el PO, no autoridad final); arquitectura de contenido (EKG/CKS) en colaboración con Claude Code; diseño UX/UI conceptual; redacción y mantenimiento de este backlog; facilitación de ceremonias; guardián de DoR/DoD | Ejecución de código, pruebas automatizadas, despliegue; **memoria de estado del repositorio entre sesiones** — depende enteramente de la bitácora (§5.2) y de lo que el PO o Claude Code le muestren al abrir cada sesión. |
| **Equipo de desarrollo (implementación)** | Claude Code | Arquitectura de software de Causeway y PolicyLab; CRE, ATE, LSM; cliente TypeScript/React/SVG; CI de validación CKS; pruebas | Juicio de aceptabilidad pedagógica o económica de lo que implementa — ejecuta contra especificación, no decide si una explicación de error es correcta. |

**3.1. Roles de Doc. 3, §8.3 sin dueño fijo en este equipo.** El equipo mínimo de Doc. 3 incluye seis perfiles; este programa cubre cinco con solapamiento deliberado (el PO acumula tres). El sexto — **revisión económica independiente de la autoría** — no tiene dueño dentro del trío. Se trata como riesgo de programa, no se finge resuelto (§9, riesgo R1).

**3.2. Regla de desempate.** Ante cualquier ambigüedad de alcance, prioridad o interpretación de Doc. 1/2/3, decide el PO. Claude puede señalar inconsistencias entre lo que se pide y lo ya documentado (obligación, no cortesía), pero no tiene autoridad de veto.

---

### 4. Artefactos

| Artefacto Scrum | Instanciación en este programa |
|---|---|
| **Product Backlog** | Este documento, §7, mantenido como fuente viva (se actualiza en el repositorio, no solo aquí). |
| **Sprint Backlog** | Subconjunto de historias comprometidas para el sprint activo, con la bitácora de sprint como registro de avance. |
| **Incremento** | Al cierre de cada sprint: código que pasa CI + contenido que pasa validación de esquema CKS + lo que la Sprint Review pueda demostrar en vivo (no diapositivas). |
| **Bitácora de sprint** (no-Scrum estándar, necesaria aquí) | Archivo versionado (`bitacora/sprint-NN.md`) con tres campos por entrada de trabajo: qué se hizo, qué quedó bloqueado, qué sigue. Es la memoria externa que sustituye al contexto tácito que un equipo humano normalmente no necesita escribir. |

---

### 5. Cadencia y ceremonias

**5.1. Duración de sprint: 2 semanas.** Suficientemente corta para inspeccionar contenido y código antes de acumular deuda de ambos tipos; suficientemente larga para que una historia de autoría de mecanismo económico (que requiere ida y vuelta de revisión) quepa completa.

| Ceremonia | Cómo se ejecuta con este equipo | Duración orientativa |
|---|---|---|
| **Sprint Planning** | Sesión de trabajo PO + Claude: se seleccionan historias del backlog (§7), se verifica DoR (§6.1), y Claude produce el brief de tareas que Claude Code ejecutará durante el sprint. | 1 sesión al inicio de cada sprint |
| **Daily** | Sustituido por la bitácora de sprint (§4). Cada sesión de trabajo (con Claude o con Claude Code) abre leyendo la última entrada y cierra escribiendo una nueva. No es opcional: sin esto, el "equipo" pierde coherencia entre sesiones. | Continuo, no programado |
| **Sprint Review** | Demo del incremento contra el criterio de aceptación de cada historia comprometida, no contra una lista de tareas completadas. Si una historia toca contenido (`explicacion_si_error`, un escenario nuevo), la revisión la hace el PO en su rol de economista/diseñador instruccional, no Claude. | 1 sesión al cierre de cada sprint |
| **Retrospectiva** | Documento escrito, no conversación efímera: qué del proceso de este sprint específico hay que cambiar (ej. "las historias de contenido tardan el doble de lo estimado porque cada arista requiere revisión del PO antes de publicarse"). Se apila en `retro/` y alimenta el refinamiento del backlog. | 1 documento al cierre de cada sprint |
| **Refinamiento de backlog** | Continuo, propuesto por Claude sobre §7, aprobado por el PO antes de entrar a un Sprint Planning. | Continuo |

---

### 6. Definition of Ready y Definition of Done

**6.1. Definition of Ready (una historia puede entrar a un sprint si):**
- Tiene objetivo y criterio de aceptación redactados en una frase verificable (no "mejorar el constructor", sí "el constructor rechaza un salto de eslabón y lo marca como paso omitido").
- Cita la sección exacta de Doc. 0/1/2/3 que la fundamenta. Una historia sin referencia cruzada es, por definición, una decisión de diseño nueva no documentada — se rechaza hasta que se documenta primero.
- Sus dependencias de datos existen (no se puede autorar una arista si el catálogo de variables del EKG aún no la contiene, Doc. 2, §4.3).
- Si toca contenido económico o pedagógico: el PO confirma explícitamente que tiene disponibilidad de revisión dentro del sprint. Una historia de contenido sin ventana de revisión del PO no debe entrar — es la causa más probable de arrastre de sprint (§9, riesgo R2).

**6.2. Definition of Done (una historia está terminada si):**
- El código asociado pasa CI, incluida la validación de esquema CKS cuando aplica (Doc. 3, §7.3).
- Todo contenido nuevo de tipo relación cumple el esquema mínimo: `explicacion_si_error` con longitud mínima y, crucialmente, **confirmada como económicamente correcta por el PO** — el esquema JSON valida forma, no verdad económica (Doc. 3, §7.3, nota (a)).
- Toda pantalla nueva cumple las heurísticas de Nielsen aplicables y WCAG 2.2 AA (Doc. 3, §4.5) antes de marcarse como demostrable en Sprint Review, no al final de F2.
- La referencia cruzada que la historia cierra queda marcada como cerrada, en este documento o en la bitácora — evita que "cerrado en el código" y "cerrado en la documentación" diverjan.
- Es demostrable en vivo en la Sprint Review correspondiente.

---

### 7. Product Backlog por épicas

Cada épica corresponde a un entregable de Doc. 3, §8.1—§8.2. Las historias listadas son representativas, no exhaustivas — el detalle completo (p. ej. las 12–16 fichas de escenario individuales) se gestiona como tareas dentro de estas historias durante el refinamiento, no se preenumera aquí.

**E0 — CKS v1 (esquema de conocimiento causal)** · Doc. 0, §3.6, Doc. 3, §7.3 · Responsable primario: Claude (diseño) + Claude Code (implementación)

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Como equipo, necesitamos el esquema JSON de `relacion` (arista) completo con `explicacion_si_error` obligatoria. | Esquema publicado; un documento de prueba sin `explicacion_si_error` falla la validación de CI. | F0 |
| Necesitamos el esquema de `evento`, `agente`, `supuesto` y `escenario`. | Los cuatro esquemas validan contra los fragmentos ilustrativos de Doc. 3, §7.3. | F0 |
| Necesitamos reglas de integridad automatizadas (Doc. 2, §8.2): ninguna variable sin agente, ninguna arista de mecanismo fuera del grafo público del modelo. | CI rechaza un bundle que viole cualquiera de las dos reglas, con caso de prueba para cada una. | F0 |

**E1 — Arquitectura Causeway y CI de contenido** · Doc. 3, §7.1—§7.2 · Responsable primario: Claude Code

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Necesitamos el monolito modular con fronteras de importación verificables en CI (CRE no importa de ATE, ninguno importa vocabulario económico). | Una regla de importación violada rompe el build; caso de prueba incluido. | F0 |
| Necesitamos el pipeline que valida un bundle EKG contra CKS y lo publica versionado. | Un bundle inválido no se publica; uno válido queda accesible por versión semántica. | F0 |

**E2 — EKG IS-LM v0 (contenido económico)** · Doc. 2 completo, Doc. 3, §8.1 · Responsable primario: PO (autoría y validación) + Claude (borradores y estructura)

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Catálogo completo de los seis agentes y sus variables típicas (Doc. 2, §3). | Cada variable declara agente(s), tipo y naturaleza (Doc. 2, §4.3); sin duplicados detectados por CI. | F0 |
| Mecanismo completo de política monetaria expansiva (Doc. 2, §5.2) como aristas independientes con metadato completo. | Las 6 aristas del ejemplo de Doc. 2, §5.2 existen en el grafo, cada una con `explicacion_si_error` validada por el PO. | F0 |
| Mecanismo completo de política fiscal expansiva — **contenido nuevo, no desarrollado en Doc. 2**; se autora siguiendo la estructura del ejemplo monetario de Doc. 2, §5.2. | Camino consistente de 5+ eslabones, con la misma forma que el ejemplo de Doc. 2, §5.2 (agente, variable, relación, `explicacion_si_error` por arista), validado por el PO como económicamente correcto. | F0 |
| Set de 12–16 escenarios curados para Niveles 0–II. | Cada escenario pasa el proceso de curación completo de Doc. 2, §11.3 (validación de esquema — revisión económica — revisión pedagógica) — nota: la etapa de "revisión económica" la ejecuta el PO conforme al riesgo R1 de §9. | F2 |

**E3 — Diseño de alta fidelidad (W1–W3)** · Doc. 3, §4.3 · Responsable primario: Claude (diseño) con validación del PO

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Constructor causal (W1) en alta fidelidad, escritorio y móvil. | Cumple los cinco principios UX de Doc. 3, §4.1; contraste y objetivos táctiles —44px verificados. | F0 |
| Informe de Razonamiento (W2) y Panel docente mínimo (W3) en alta fidelidad. | El primer escenario "en papel" es navegable en prototipo sin código (Doc. 3, hito de salida F0). | F0 |

**E4 — CRE (motor de razonamiento causal)** · Doc. 0, §3.3 · Responsable primario: Claude Code

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Cargar un grafo conforme a CKS y validar un camino de una sola arista. | Dado un grafo sintético sin vocabulario económico, el CRE acepta caminos válidos y rechaza inválidos. | F1 |
| Clasificar error de polaridad, de salto y de agente sobre un camino propuesto. | Tres casos de prueba, uno por tipo de error, con clasificación correcta verificada. | F1 |
| Propagación determinista de efectos con control de ciclos (Doc. 2, §5.4). | Un grafo con ciclo de retroalimentación no entra en bucle infinito; la propagación converge o se detiene por límite de iteraciones. | F1 |

**E5 — ATE mínimo (andamiaje y timing de retroalimentación)** · Doc. 0, §3.4 · Responsable primario: Claude Code, especificado por Claude a partir de Doc. 1, §4.2 y §6.2

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Reglas de andamiaje Niveles 0–I: ejemplo resuelto + feedback por paso. | La tabla de Doc. 1, §4.2 se traduce en configuración del ATE, no en código hardcodeado de PolicyLab (verificable: cambiar el umbral no requiere tocar el cliente). | F1 |
| Reglas de andamiaje Nivel II: feedback solo al completar el mecanismo. | Un intento de leer feedback intermedio en Nivel II es rechazado por el ATE, no por el cliente. | F2 |
| Índice de Dominio v1 (cálculo cualitativo, Doc. 3, §3.2). | Pondera primer intento y tipo de error; excluye verificablemente tiempo, velocidad y volumen (regla dura de Doc. 1, §7.2). | F2 |

**E6 — LSM (registro del estado del aprendiz)** · Doc. 0, §3.5 · Responsable primario: Claude Code

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Registro append-only de eventos de interacción con versión de EKG y timestamp. | Un evento registrado incluye la versión del bundle EKG activo (Doc. 3, §7.3, nota c). | F1 |
| Agregados derivados mínimos: dominio por mecanismo. | Consultable vía la API de Causeway (Doc. 3, §7.7). | F2 |

**E7 — Cliente PolicyLab (MVP)** · Doc. 3, §2, §3, §4 · Responsable primario: Claude Code (implementación), Claude/PO (contenido de interfaz)

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Pantalla Briefing + Constructor causal con bandeja de candidatas y distractores. | El constructor nunca valida localmente (regla de Doc. 0, §4.4); toda validación viaja a Causeway. | F1 |
| Informe de Razonamiento con capas 1 y 2 de retroalimentación (Doc. 3, §3.5). | El mecanismo completo se muestra siempre al cierre, independientemente del número de intentos. | F1 |
| Tablero del Analista con recomendación básica del ATE. | Interleaving simple visible en lenguaje natural (Doc. 3, §3.1). | F2 |
| Chips de supuestos activos persistentes con explicación al toque (Doc. 3, §4.4). | El chip violado se resalta cuando el CRE clasifica un error de supuesto. | F1 |

**E8 — Tipologías de error y estrategias de corrección** · Doc. 1, §5, Doc. 3, §2.2 · Responsable primario: Claude Code + Claude (contenido de corrección)

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Re-explicación estructurada tras error de polaridad. | Presenta 3–4 explicaciones autoradas (una correcta), nunca revela la respuesta directamente. | F1 |
| Eslabón omitido tras error de salto. | El sistema nunca acepta el salto como correcto; inserta el hueco marcado. | F1 |
| Primeras 4 credenciales de dominio (Doc. 3, §3.3). | Ninguna usa tiempo, volumen ni rachas — verificable por inspección del criterio de cada credencial. | F2 |

**E9 — Accesibilidad AA** · Doc. 3, §4.5 · Responsable primario: Claude Code, auditado por Claude

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Auditoría WCAG 2.2 AA del constructor causal y del Informe. | Contraste, foco visible, navegación completa por teclado, polaridad codificada con símbolo y trazo además de color. | F2 |
| `prefers-reduced-motion` respetado en todas las animaciones semánticas de Doc. 3, §5.3. | Variante estática equivalente existe para cada animación. | F2 |

**E10 — Integración LTI 1.3** · Doc. 3, §7.7 · Responsable primario: Claude Code

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Lanzamiento desde un LMS (Moodle/Canvas) con identidad de curso. | El docente no gestiona cuentas manualmente; sesión de prueba con un curso simulado. | F2 |

**E11 — QA y preparación de piloto (sin ejecutar piloto)** · Doc. 3, §8.2 (criterios de salida F2) · Responsable primario: todo el equipo

| Historia | Criterio de aceptación | Fase |
|---|---|---|
| Pruebas de regresión CRE/ATE/LSM sobre el set completo de escenarios del MVP. | Suite de pruebas ejecuta en CI en cada publicación de bundle. | F2 |
| Reproducibilidad de retroalimentación verificada (misma versión de EKG — mismo resultado). | Caso de prueba que repite una interacción con el mismo bundle y compara resultados. | F2 |
| Diseño logístico (no ejecución) del piloto pre/post con instrumento externo (Doc. 1, §10). | Documento de protocolo listo para que el PO lo lleve a un comité o a los docentes colaboradores — **fuera de alcance de este programa ejecutarlo**. | F2 |

---

### 8. Plan de releases y sprints

Veinte sprints de dos semanas (40 semanas — 10 meses), calcados de los rangos de meses de Doc. 3, §8.2.

| Sprint | Fase | Objetivo del sprint | —picas activas |
|---|---|---|---|
| S1 | F0 | Repos y CI esqueleto; estructura de monolito modular; primer borrador del CKS (nodo, arista). | E0, E1 |
| S2 | F0 | CKS v1 completo (relación, evento, agente, supuesto, escenario) validado; arranca catálogo de agentes y variables del EKG. | E0, E2 |
| S3 | F0 | EKG: mecanismos de política monetaria y fiscal completos con explicaciones; wireframes W1–W3 en alta fidelidad. | E2, E3 |
| S4 | F0 | CI de contenido operativa extremo a extremo; primer escenario "en papel" jugable en prototipo; revisión económica del EKG v0. **Hito: salida F0.** | E0, E1, E2, E3 |
| S5 | F1 | CRE mínimo: carga de grafo, validación de un solo eslabón, error de polaridad. | E4 |
| S6 | F1 | CRE: errores de salto y de agente; propagación determinista con control de ciclos. | E4 |
| S7 | F1 | ATE mínimo Niveles 0–I; LSM: registro append-only. | E5, E6 |
| S8 | F1 | Cliente: Briefing + Constructor causal conectado a la API real de Causeway. | E7 |
| S9 | F1 | Cliente: Informe de Razonamiento (capas 1–2), Tablero básico; 5 tipologías de error con corrección conectada. | E7, E8 |
| S10 | F1 | Cierre de contenido Nivel I; **prueba de usabilidad con 8–10 estudiantes** (checkpoint externo, coordinado por el PO — no es el piloto F3); decisión go/no-go sobre el constructor causal. **Hito: salida F1.** | E2, E7 |
| S11 | F2 | Ajustes al constructor tras usabilidad; EKG Nivel II (mecanismos completos). | E2, E7 |
| S12 | F2 | ATE Nivel II (feedback solo al completar); Índice de Dominio v1. | E5 |
| S13 | F2 | Credenciales de dominio (4 primeras); Expediente del Analista. | E7, E8 |
| S14 | F2 | Auditoría y corrección de accesibilidad AA. | E9 |
| S15 | F2 | Integración LTI 1.3 y acceso institucional. | E10 |
| S16 | F2 | Completar el set de 12–16 escenarios curados 0–II; revisión pedagógica formal. | E2 |
| S17 | F2 | QA extremo a extremo: regresión CRE/ATE/LSM, pruebas de accesibilidad con lector de pantalla. | E11 |
| S18 | F2 | Endurecimiento: reproducibilidad de retroalimentación verificada; registro completo de eventos LSM. | E6, E11 |
| S19 | F2 | Diseño logístico del piloto F3 (protocolo pre/post, coordinación con docentes) — **preparar, no ejecutar**. | E11 |
| S20 | F2 | MVP estable en staging; checklist de cierre de referencias cruzadas de Doc. 3, §10 verificado; retrospectiva de programa completa (F0–F2). **Hito: salida F2 — fin del alcance de este documento.** | Todas |

**8.1. Punto de decisión explícito en S10.** El go/no-go del constructor causal (Doc. 3, fase F1) es la única decisión de este programa que depende de datos que el equipo de 3 no puede generar por sí mismo: requiere usuarios reales fuera del equipo. Es distinto del piloto F3 (que mide aprendizaje, no usabilidad), pero comparte con él la misma dependencia externa: alguien tiene que coordinar el acceso a estudiantes. Se marca aquí para que no llegue como sorpresa al llegar a S10.

---

### 9. Riesgos específicos de este programa (extiende Doc. 3, §8.4)

Los riesgos de Doc. 3, §8.4 siguen vigentes; estos son los que nacen específicamente de tener un equipo de tres, dos de ellos agentes de IA.

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| **R1 — Revisión económica no independiente.** El PO autora el contenido económico y también lo revisa; Doc. 2, §11.3 exige que ambas etapas sean distintas. | Alta | Alto | Checklist de revisión estructurado y aplicado en un momento separado de la autoría (nunca revisar el mismo día que se escribe); considerar 1–2 sesiones puntuales con un economista externo antes del cierre de F2, aunque sea remunerado puntualmente — no como rol del equipo base. |
| **R2 — Pérdida de contexto entre sesiones de Claude/Claude Code.** Ninguno de los dos retiene memoria de estado del repositorio entre sesiones de trabajo. | Alta si no se usa la bitácora; baja si se usa | Medio | La bitácora de sprint (§4, §5) no es opcional: es la memoria externa del equipo. Toda sesión de trabajo debe abrir leyéndola. |
| **R3 — El PO es punto único de decisión humana.** El riesgo "dependencia de personas clave" de Doc. 3, §8.4 se agrava aquí: no hay un segundo humano que pueda absorber una decisión bloqueada. | Alta | Alto | Priorización agresiva en Sprint Planning para agrupar decisiones del PO en bloques, en vez de dispersarlas historia por historia; ninguna historia de contenido entra a un sprint sin ventana de revisión confirmada del PO (DoR, §6.1). |
| **R4 — Contenido plausible pero incorrecto.** Un agente de IA puede producir una explicación económica fluida y con apariencia de autoridad que sea conceptualmente errónea. | Media | Alto | La DoD (§6.2) exige validación humana explícita de todo contenido nuevo antes de publicarse; el esquema JSON valida forma, nunca verdad económica — esto se declara aquí para que nunca se confunda una cosa con la otra. |
| **R5 — Conflicto de rol de Claude (Scrum Master y co-autor de contenido a la vez).** | Media | Bajo–Medio | Se deja explícito en §3.2: toda decisión de alcance o prioridad es del PO; Claude puede señalar tensiones pero no resolverlas unilateralmente. |
| **R6 — El checkpoint de usabilidad de S10 (§8.1) requiere personas fuera del equipo de 3.** | Media | Medio | Se planifica con antelación (mínimo un sprint antes) la logística de reclutamiento de 8–10 estudiantes para no bloquear el hito de salida de F1. |

---

### 10. Métricas de seguimiento del programa

Métricas de proceso, no de aprendizaje (las de aprendizaje son objeto del Documento 1, §10, y del piloto F3, fuera de este alcance).

- **Salud del backlog:** % de historias que cumplen DoR antes de entrar a Sprint Planning. Un valor bajo es la señal más temprana de que el programa va a arrastrar sprints.
- **Cierre de trazabilidad:** número de referencias cruzadas pendientes de Doc. 1/2/3 (§10 de cada documento) que siguen abiertas, por sprint. Debe converger a cero antes de S20.
- **Fallas de validación de esquema en CI:** frecuencia de bundles EKG rechazados por CKS — mide si el contenido se está autorando conforme al contrato o si hay fricción sistemática.
- **Velocidad, con advertencia explícita:** contar historias completadas por sprint es útil para planificar, pero **no debe usarse para comparar "rendimiento" entre Claude Code y el PO** — un agente de IA y un humano no producen trabajo comparable en la misma unidad, y tratar la métrica como tal distorsionaría las decisiones de priorización.

---

### 11. Herramientas recomendadas

El repositorio git ya es, por diseño de Doc. 3, §7.1 y §7.3, la fuente única de verdad del contenido y el código — este programa no introduce una herramienta paralela que compita con esa fuente. Se recomienda:

- **Tablero:** un tablero ligero integrado al repositorio (p. ej. GitHub Projects) en vez de una herramienta corporativa pesada — el equipo es de tres y dos de ellos son agentes, no hay necesidad de licencias por asiento ni de permisos granulares.
- **Bitácora y retros:** archivos markdown versionados dentro del repositorio (`bitacora/`, `retro/`), nunca solo en el historial de una conversación de chat — es lo único que sobrevive entre sesiones de Claude o Claude Code.
- **CI:** la ya especificada en Doc. 3, §7.3 (validación de CKS) y §7.2 (reglas de importación entre módulos), extendida con las suites de pruebas de E11.

---

### 12. Marcos de referencia utilizados

Este documento usa el marco Scrum (Schwaber & Sutherland, *The Scrum Guide*) como base normativa, sin proponer un marco de gestión nuevo. La adaptación explícita en §1 y §3 —sustitución del daily por bitácora escrita, fusión del rol de Product Owner con parte del equipo de desarrollo, redefinición del rol de Scrum Master como guardián de trazabilidad— es el aporte propio de este documento, y se declara como adaptación, no como Scrum estándar, siguiendo el mismo principio de honestidad metodológica que rige los Documentos 1 a 3.

---

### 13. Cierre de referencias cruzadas y próximos pasos

Este documento consume el roadmap de Doc. 3, §8.2 y lo convierte en programa ejecutable. Deja abierto, deliberadamente:

- **El protocolo de F3** (piloto con estudiantes reales): diseño pre/post, coordinación docente y consideraciones éticas de investigación con personas — se prepara en S19 pero se gestiona en un documento aparte, porque mezclar gestión de producto con protocolo de investigación con personas sería un error de alcance, no una simplificación.
- **La incorporación de un revisor económico externo puntual** (riesgo R1): decisión que corresponde al PO, no una historia de este backlog.
- **El detalle de las 12–16 fichas de escenario individuales** de E2: se gestionan como tareas dentro de las historias de S3, S11 y S16 durante el refinamiento continuo del backlog, no se preenumeran aquí para que este documento no quede obsoleto en cuanto el contenido evolucione.

---

### 14. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-01 | Publicación inicial |
| 1.0.1 | 2026-08-01 | Normalización del estilo de citas cruzadas al formato del corpus ("Doc. N, §X"). |
| 1.0.2 | 2026-08-04 | §7: corrige la Fase de la historia "Mecanismo completo de política fiscal expansiva" (E2) de F1 a F0. Inconsistencia detectada en Sprint Planning de S3: el texto del objetivo de S3 en §8 (fila de fase F0) ya incluía explícitamente "mecanismos de política monetaria y fiscal completos", contradiciendo la Fase F1 declarada en esta tabla para la historia correspondiente. El PO decidió, en la sesión de Sprint Planning, incluir el mecanismo fiscal en S3 y corregir la Fase aquí en vez de recortar el texto de §8. Ver `bitacora/sprint-03.md` §1–§2. |
