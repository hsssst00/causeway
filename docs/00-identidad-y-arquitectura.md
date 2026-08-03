# Documento 0 — Identidad y Arquitectura del Programa
## Componentes, nomenclatura definitiva y delimitación de alcances

---

### 0. Ficha del documento

| Campo | Descripción |
|---|---|
| **Pregunta que responde** | ¿Qué componentes constituyen el programa, cómo se llaman y dónde termina la responsabilidad de cada uno? |
| **Audiencia principal** | Dirección del proyecto, investigadores, arquitectos de software, futuros colaboradores de otros dominios |
| **Naturaleza** | Documento normativo de identidad. Toda documentación posterior (incluidos los Documentos 1, 2 y 3) debe usar la nomenclatura y los límites aquí definidos. |
| **Relación con Documento 1 (Pedagógico)** | El Documento 1 define el *contenido* del componente pedagógico. Este documento define *en qué componente de software vive* cada exigencia pedagógica (andamiaje, modelo del estudiante, retroalimentación). |
| **Relación con Documento 2 (Económico)** | El Documento 2 define el contenido del Economic Knowledge Graph y los principios del motor. Este documento formaliza la separación que el Documento 2 ya practica (§1.3) y la eleva a regla de todo el programa. |
| **Alcance** | Identidad de componentes, nomenclatura, delimitación de responsabilidades, reglas de dependencia, criterio de validación de generalidad. |
| **Fuera de alcance** | Contenido pedagógico (Doc. 1), contenido económico (Doc. 2), diseño del videojuego (Doc. 3), decisiones de implementación técnica (documento técnico posterior). |

---

### 1. Propósito y principios de esta identidad

Este documento reemplaza una propuesta preliminar de arquitectura, discutida internamente en una fase temprana del proyecto. Conserva su intuición central — separar teoría reutilizable, motor genérico, conocimiento disciplinar y producto — y corrige tres defectos identificados en el análisis crítico de esa propuesta:

1. **Solapamiento entre "arquitectura" y "motor":** se resuelve distinguiendo la *naturaleza* de cada componente (documento, especificación, software, contenido o aplicación). Dos componentes de naturaleza distinta no pueden solaparse en responsabilidades ejecutables.
2. **Ausencia del modelo del estudiante y del motor pedagógico:** se incorporan como componentes de primera clase, siguiendo la arquitectura clásica de Sistemas Tutores Inteligentes (modelo de dominio, modelo del estudiante, modelo tutor, interfaz), que es el marco de referencia estructural de este programa.
3. **Cadena lineal engañosa:** la relación entre componentes no es una tubería (Framework → Arquitectura → Motor → KB → Plataforma → Juego) sino una **arquitectura de núcleo y adaptadores**: motores genéricos al centro, grafos de conocimiento disciplinares como contenido intercambiable, aplicaciones como clientes.

**Principio de nomenclatura.** Cada nombre debe (a) comunicar la función real del componente, (b) no colisionar con términos ya ocupados en la literatura, (c) no compartir siglas ni raíz con otro componente del programa, y (d) distinguir claramente artefactos de investigación (citables) de artefactos de ingeniería (versionables) y de productos (con marca).

---

### 2. Mapa general del programa

```
+---------------------------------------------------------------------+
|  INVESTIGACIÓN (artefactos citables)                                 |
|                                                                       |
|  +-----------------------------------------------------------------+ |
|  |  CMR — Causal Mechanism Reconstruction Framework                | |
|  |  (marco teórico y metodológico)                                  | |
|  +-----------------------------------------------------------------+ |
+---------------------------------+-----------------------------------+
                                   | fundamenta
+---------------------------------v-----------------------------------+
|  ESPECIFICACIÓN (artefactos normativos, no ejecutables)              |
|                                                                       |
|  +---------------------------+   +---------------------------------+ |
|  |  CMR-RA                   |   |  CKS                            | |
|  |  Arquitectura de          |   |  Causal Knowledge Schema        | |
|  |  referencia               |   |  (contrato de todo grafo        | |
|  |                           |   |  de conocimiento)                | |
|  +-------------+-------------+   +----------------+------------------+ |
+----------------+----------------------------------+--------------------+
                 | especifica                        | es cumplido por
+----------------v------------------------------------v-----------------+
|  PLATAFORMA: Causeway (software de orquestación)                      |
|                                                     |                  |
|  +----------+  +----------+  +----------+  +---------------------+   |
|  |  CRE     |  |  ATE     |  |  LSM     |  |  EKG                 |   |
|  |  Motor   |  |  Motor   |  |  Modelo  |  |  Grafo de cono-      |   |
|  |  de razo-|  |  pedagó- |  |  del     |  |  cimiento eco-       |   |
|  |  namiento|  |  gico    |  |  apren-  |  |  nómico (conte-      |   |
|  |  causal  |  |          |  |  diz     |  |  nido, Doc. 2)       |   |
|  +----------+  +----------+  +----------+  +---------------------+   |
|   (genérico)    (genérico)    (genérico)    (disciplinar)             |
+----------------------------------+------------------------------------+
                                   | expone servicios a
+----------------------------------v------------------------------------+
|  APLICACIONES (productos)                                              |
|                                                                         |
|  +-----------------------------+   +-----------------------------+     |
|  |  PolicyLab                  |   |  (aplicaciones futuras:     |     |
|  |  (primera aplicación,       |   |  otros dominios, otros      |     |
|  |  dominio: macroeconomía)    |   |  formatos educativos)       |     |
|  +-----------------------------+   +-----------------------------+     |
+--------------------------------------------------------------------------+
```

Lectura correcta del mapa: **CRE, ATE y LSM son pares que Causeway orquesta**; ninguno depende del contenido del EKG, y el EKG es una *instancia* del contrato CKS. Incorporar un dominio nuevo significa crear un grafo nuevo conforme a CKS — sin tocar los motores.

---

### 3. Componentes: nombre definitivo, naturaleza y alcance

#### 3.1. CMR — Causal Mechanism Reconstruction Framework

*Antes: CLF (Causal Learning Framework).*

| Campo | Definición |
|---|---|
| **Naturaleza** | Marco teórico y metodológico. Documento de investigación, citable de forma independiente del software. |
| **Motivo del cambio de nombre** | "Causal learning" es un término ya ocupado en psicología cognitiva y en aprendizaje automático, y no comunica lo distintivo del proyecto. Lo distintivo no es que el estudiante "aprenda causalidad": es que aprende **reconstruyendo mecanismos** eslabón por eslabón, con evaluación paso a paso del razonamiento. El nombre debe contener "mechanism reconstruction". Adicionalmente, la sigla CLF colisionaba con "CLF Platform", violando la separación entre artefacto de investigación y producto. |

**Alcance (incluye):**
- La tesis central del programa: el aprendizaje profundo de sistemas complejos se produce mediante la reconstrucción activa de mecanismos causales, con evaluación del proceso de razonamiento y no solo del resultado.
- La integración de marcos pedagógicos que la sustenta (constructivismo, ABP, carga cognitiva, evaluación formativa, SDT — Documento 1, §1 y §12).
- La tipología abstracta de errores de razonamiento causal (polaridad, salto, supuesto, agente, alcance — generalización de Documento 1, §5, sin vocabulario económico).
- La metodología de validación: cómo se demuestra empíricamente que un sistema construido bajo CMR produce aprendizaje transferible (Documento 1, §10).
- Los criterios que debe cumplir cualquier dominio candidato para ser modelable bajo CMR (conocimiento expresable como grafo causal con supuestos explícitos).

**Fuera de alcance (excluye):**
- Cualquier decisión de software, tecnología o interfaz.
- Cualquier contenido disciplinar específico (economía o cualquier otro).
- La afirmación de generalidad multidominio **hasta que se cumpla el criterio de la sección 5** de este documento. Hasta entonces, CMR se declara formalmente como "marco con una instanciación validada (macroeconomía) y diseño orientado a generalización".

---

#### 3.2. CMR-RA — Arquitectura de Referencia CMR

*Antes: CRA (Causal Reconstruction Architecture).*

| Campo | Definición |
|---|---|
| **Naturaleza** | Especificación normativa: diagramas de componentes, contratos entre módulos, decisiones de arquitectura registradas (ADRs). **No es software y no ejecuta nada.** |
| **Motivo del cambio de nombre** | El acrónimo CRA era casi indistinguible de CRE y su descripción original reclamaba responsabilidades ejecutables ("evaluación", "retroalimentación") que pertenecen a los motores. Al renombrarla como *arquitectura de referencia* y fijar su naturaleza como especificación, el solapamiento desaparece por definición: CMR-RA dice *cómo deben interactuar* los componentes; nunca *hace* lo que los componentes hacen. |

**Alcance (incluye):**
- La definición de los contratos e interfaces entre CRE, ATE, LSM, los grafos de conocimiento y las aplicaciones cliente.
- Las reglas de dependencia de la sección 4 de este documento, desarrolladas a nivel técnico.
- Los requisitos de calidad transversales: determinismo de la propagación (Doc. 2, §8.2), reproducibilidad de la retroalimentación, versionado del contenido.

**Fuera de alcance (excluye):**
- Implementación de cualquier lógica.
- Contenido pedagógico o disciplinar.
- Decisiones de producto (esas pertenecen a cada aplicación).

---

#### 3.3. CRE — Causal Reasoning Engine

*Nombre sin cambios: es preciso y no colisiona con nada del programa.*

| Campo | Definición |
|---|---|
| **Naturaleza** | Software. Motor genérico, sin estado por estudiante, agnóstico al dominio. |

**Alcance (incluye):**
- Interpretar cualquier grafo conforme a CKS: nodos, aristas, polaridad, supuestos, perfiles de modelo (Doc. 2, §5 y §7).
- Validar **caminos consistentes** propuestos por el usuario contra el subgrafo activo (Doc. 2, §5.3), aceptando cualquier camino válido, no solo una respuesta modelo.
- Clasificar errores estructurales de razonamiento según la tipología abstracta de CMR (¿la polaridad es incorrecta?, ¿falta un eslabón?, ¿la arista existe pero sus supuestos no están activos?).
- Ejecutar la propagación determinista de efectos con control de ciclos (Doc. 2, §5.4).
- Recorridos inversos (diagnóstico, Doc. 2, §10) y recorridos dinámicos (simulación).

**Fuera de alcance (excluye):**
- **Todo vocabulario económico.** El CRE no conoce la palabra "inversión" ni "tasa de interés"; solo conoce nodos, aristas y supuestos. Esta es la regla de disciplina que hace verificable la aspiración de generalidad (sección 5).
- Decidir *cuándo* mostrar retroalimentación, *cuánto* andamiaje ofrecer o *qué* escenario proponer a continuación: eso es responsabilidad del ATE. El CRE detecta y clasifica el error; no decide qué hacer pedagógicamente con él.
- Persistir historial de estudiantes (responsabilidad del LSM).
- Redactar explicaciones de error: las explicaciones son contenido autorado que vive en el grafo (`explicacion_si_error`, Doc. 2, §5.1); el CRE solo las selecciona y entrega.

---

#### 3.4. ATE — Adaptive Tutoring Engine

*Componente nuevo. No existía en la propuesta preliminar.*

| Campo | Definición |
|---|---|
| **Naturaleza** | Software. Motor genérico, agnóstico al dominio, que implementa el "modelo tutor" de la arquitectura ITS. |
| **Motivo de su creación** | El Documento 1 exige funcionalidad que no es razonamiento sobre grafos (CRE) ni conocimiento disciplinar (EKG): retiro progresivo de andamiaje (§4.2), retroalimentación en tres capas con distinto timing según nivel (§6.2), reglas de motivación (§7). En la propuesta preliminar estas responsabilidades no tenían dónde vivir. |

**Alcance (incluye):**
- Implementar como reglas de sistema el retiro de andamiaje del Documento 1, §4.2 (qué apoyo está disponible en cada nivel, cuándo se retira).
- Orquestar el timing de la retroalimentación: inmediata por paso, por mecanismo completo o por sesión, según nivel (Doc. 1, §6.2).
- Seleccionar la estrategia de corrección adecuada al tipo de error clasificado por el CRE (Doc. 1, §5, columna "estrategia de corrección").
- Aplicar interleaving y práctica espaciada en la selección de escenarios (Doc. 1, §8.1), consultando el estado del LSM.
- Hacer cumplir las reglas de motivación (Doc. 1, §7.2): qué se recompensa y qué se prohíbe recompensar.

**Fuera de alcance (excluye):**
- Validar razonamiento causal (CRE).
- Definir el contenido pedagógico de las estrategias (eso lo define el Documento 1; el ATE lo ejecuta).
- Renderizar la retroalimentación en pantalla (aplicación cliente).

---

#### 3.5. LSM — Learner State Model

*Componente nuevo. No existía en la propuesta preliminar.*

| Campo | Definición |
|---|---|
| **Naturaleza** | Software y datos persistentes. El "modelo del estudiante" de la arquitectura ITS. |
| **Motivo del nombre** | Se evita la sigla "LM" (colisiona con *language model* en toda la literatura actual) y se explicita que su objeto es el **estado** del aprendiz a lo largo del tiempo, no una sesión aislada. |

**Alcance (incluye):**
- Registro por estudiante de: caminos intentados, tipos de error cometidos, uso de andamiaje, desempeño por nivel y por mecanismo.
- Detección de patrones de error recurrentes entre sesiones (Doc. 1, §6.2, capa 3 — feed forward).
- Estimación del dominio actual por mecanismo, insumo del ATE para calibrar la Zona de Desarrollo Próximo (Doc. 1, §1.1 y §4.2).
- Agregación anónima por grupo para el panel docente (Doc. 1, §9.2).

**Fuera de alcance (excluye):**
- Interpretar pedagógicamente el estado (ATE) o clasificar errores (CRE): el LSM registra y agrega; no decide.
- Cualquier dato no derivado de la interacción de aprendizaje (el LSM no es un sistema de gestión académica ni de identidad).
- La interfaz del panel docente (aplicación cliente, Doc. 3).

---

#### 3.6. CKS — Causal Knowledge Schema

*Componente nuevo: existía de forma implícita, sin nombre.*

| Campo | Definición |
|---|---|
| **Naturaleza** | Especificación versionada: el contrato formal (esquema de datos) que todo grafo de conocimiento disciplinar debe cumplir para ser interpretable por el CRE. |
| **Motivo de su creación** | Sin un esquema abstracto nombrado, cada dominio nuevo reinventaría su estructura y la generalidad de CMR sería inverificable. El CKS es la frontera exacta entre "lo genérico" y "lo disciplinar". |

**Alcance (incluye):**
- La definición formal de las entidades del Documento 2 en términos abstractos: nodo, arista (polaridad, fuerza, condiciones de validez, explicación de error), agente, supuesto, perfil de modelo, mecanismo curado, evento, escenario (Doc. 2, §5.1, §7.1, §9).
- Las reglas de integridad: ninguna variable sin agente, ninguna arista de mecanismo fuera del grafo público del modelo, etc. (Doc. 2, §8.2).
- El proceso de curación exigible a todo grafo: validación de esquema — revisión disciplinar — revisión pedagógica — publicación (Doc. 2, §11.3, generalizado).

**Fuera de alcance (excluye):**
- Contenido de dominio alguno.
- Lógica de recorrido o validación (CRE).

---

#### 3.7. EKG — Economic Knowledge Graph

*Nombre sin cambios.*

| Campo | Definición |
|---|---|
| **Naturaleza** | Contenido versionado. Primera instancia del CKS. Es, en su totalidad, el objeto que el Documento 2 diseña. |

**Alcance (incluye):**
- Agentes, variables, aristas, supuestos, perfiles de modelo (IS-LM y extensiones), mecanismos curados, eventos y escenarios de macroeconomía (Doc. 2, §3—§10).
- Las explicaciones de error autoradas por economistas (Doc. 2, §5.1).
- El checklist de incorporación de modelos económicos nuevos (Doc. 2, §7.3).

**Fuera de alcance (excluye):**
- Lógica pedagógica, lógica de juego, lógica de motor. **Esta triple exclusión de la propuesta preliminar se conserva íntegramente: era correcta.**

---

#### 3.8. Causeway — Plataforma

*Antes: "CLF Platform".*

| Campo | Definición |
|---|---|
| **Naturaleza** | Software de orquestación: integra CRE, ATE, LSM y uno o más grafos conforme a CKS, y expone sus servicios mediante una API a las aplicaciones cliente. |
| **Motivo del cambio de nombre** | "CLF Platform" reutilizaba la sigla del marco teórico, mezclando artefacto de investigación con producto de ingeniería. La plataforma requiere identidad propia. Se propone **Causeway** (en inglés, "camino elevado"; contiene *cause* + *way*, el camino causal): comunica la función, es memorable y es marca registrable. Si el equipo prefiere otra marca, la regla normativa es solo esta: **el nombre de la plataforma no debe contener las siglas CMR ni derivar del nombre del marco teórico.** |

**Alcance (incluye):**
- Composición e integración de los motores y el grafo activo por sesión.
- API de servicios para aplicaciones: iniciar escenario, proponer eslabón, solicitar validación, recibir retroalimentación estructurada, consultar estado del aprendiz.
- Gestión de versiones de contenido publicado (qué versión del EKG usa cada curso).
- Autenticación, sesiones y multi-aplicación.

**Fuera de alcance (excluye):**
- Toda experiencia de usuario final: la plataforma no tiene interfaz de estudiante; sirve datos y servicios.
- Contenido y motores en sí mismos (los aloja y orquesta; no los define).

---

#### 3.9. PolicyLab — Primera aplicación

*Nombre sin cambios: comunica dominio (policy) y naturaleza (lab), y es marca sólida.*

| Campo | Definición |
|---|---|
| **Naturaleza** | Aplicación cliente. Producto educativo completo: experiencia de usuario, narrativa, progresión visible, panel docente. |
| **Posicionamiento (decisión que la propuesta preliminar dejó abierta)** | PolicyLab se define como **laboratorio de simulación con estructura de juego**, no como uno u otro. Se conserva íntegra la fundamentación GBL y motivacional del Documento 1 (la progresión por niveles, el bajo riesgo del fallo, la retroalimentación inmediata *son* mecánicas de juego y son las que producen el aprendizaje). Lo que se adopta de la propuesta preliminar es la **capa de presentación**: el usuario se denomina **Analista**, el resultado central de cada escenario es el **Informe de Razonamiento**, y el sistema de logros del Documento 3 se implementa como **credenciales de dominio dentro del Informe** (p. ej. "cero errores de supuesto en cinco escenarios consecutivos", Doc. 1, §7.2) — nunca como puntajes de velocidad o volumen. Así, la exigencia académica del posicionamiento "laboratorio" y la eficacia motivacional del diseño de juego dejan de estar en tensión: son capas distintas del mismo producto. |

**Alcance (incluye):**
- Toda la experiencia del Analista: pantallas, flujo, visualización del grafo y de los supuestos activos (Doc. 2, §8.1), animación de stocks y flujos (Doc. 2, §4.2), narrativa y dirección de arte (Documento 3).
- El Informe de Razonamiento como artefacto central de cierre de escenario: reconstrucción del camino, errores cometidos y corregidos, credenciales obtenidas.
- El panel docente (interfaz; la lógica de agregación vive en LSM).
- La configuración de qué modelos y escenarios del EKG están habilitados para cada curso.

**Fuera de alcance (excluye):**
- Validación de razonamiento, decisiones de andamiaje, persistencia de estado del aprendiz: PolicyLab **consume** los servicios de Causeway; no reimplementa ningún motor.
- Contenido económico: PolicyLab presenta el EKG; no lo autora.

---

### 4. Reglas de dependencia (normativas)

Estas reglas son verificables en revisión de arquitectura y de código, y ningún documento posterior puede relajarlas:

1. **CRE, ATE y LSM no pueden contener vocabulario disciplinar.** Cualquier término económico en su código o configuración es un defecto de arquitectura, no un detalle.
2. **CRE es sin estado respecto al estudiante; LSM es el único dueño del estado del aprendiz; ATE consulta a ambos y no persiste nada propio.**
3. **Todo grafo de conocimiento debe validar contra el CKS antes de publicarse.** El EKG no tiene privilegios: es una instancia más.
4. **Las aplicaciones solo acceden a los motores a través de la API de Causeway.** Ninguna aplicación importa un motor directamente.
5. **Las dependencias apuntan hacia adentro:** aplicaciones — plataforma — motores/esquema. Ningún motor conoce a la plataforma; la plataforma no conoce a ninguna aplicación concreta; el CKS no conoce a nadie.
6. **CMR y CMR-RA no aparecen en el software:** son marcos normativos que el software debe *cumplir*, no módulos que el software *contiene*.

---

### 5. Criterio de validación de generalidad

La aspiración multidominio de CMR se declara como **hipótesis del programa de investigación, no como propiedad ya lograda.** Para evitar la abstracción prematura, se fija el siguiente criterio verificable:

> CMR podrá declararse "framework multidominio" únicamente cuando exista al menos un segundo grafo de conocimiento, de un dominio estructuralmente distinto a la macroeconomía (candidatos naturales: epidemiología, ecología, circuitos, fisiología), que (a) valide contra el CKS **sin requerir modificaciones del CRE ni del ATE**, y (b) haya sido usado en al menos un piloto con estudiantes reales. Toda modificación de los motores que ese segundo dominio exija se documentará como evidencia de qué partes del diseño eran "economía disfrazada de genérica".

Hasta cumplir ese criterio, toda publicación y documentación del programa usará la fórmula: *"marco con una instanciación validada y arquitectura orientada a generalización"*. Este segundo dominio no forma parte del alcance del MVP (Documento 3, Roadmap), pero sí de la línea de investigación a diez años.

---

### 6. Tabla de decisión de nombres (resumen ejecutivo)

| Componente | Nombre anterior | Nombre definitivo | Cambio | Razón principal |
|---|---|---|---|---|
| Marco teórico | CLF | **CMR** — Causal Mechanism Reconstruction Framework | Renombrado | "Causal learning" es término ocupado; lo distintivo es la reconstrucción de mecanismos; la sigla CLF colisionaba con la plataforma |
| Arquitectura | CRA | **CMR-RA** — Arquitectura de Referencia | Renombrado y reclasificado | Sigla casi idéntica a CRE; se fija su naturaleza como especificación, eliminando el solapamiento de responsabilidades |
| Motor causal | CRE | **CRE** — Causal Reasoning Engine | Sin cambios | Nombre preciso y sin colisiones |
| Motor pedagógico | *(no existía)* | **ATE** — Adaptive Tutoring Engine | Nuevo | El Doc. 1 (§4.2, §6.2, §7) exige un modelo tutor que no tenía componente |
| Modelo del estudiante | *(no existía)* | **LSM** — Learner State Model | Nuevo | El Doc. 1 (§6.2 capa 3, §9.2) exige estado persistente por aprendiz; se evita la sigla "LM" |
| Esquema abstracto | *(implícito)* | **CKS** — Causal Knowledge Schema | Nuevo | Frontera formal entre lo genérico y lo disciplinar; hace verificable la generalidad |
| Grafo económico | EKG | **EKG** — Economic Knowledge Graph | Sin cambios | Correcto; se reclasifica como instancia del CKS |
| Plataforma | CLF Platform | **Causeway** | Renombrado | La plataforma requiere identidad propia, separada del marco teórico |
| Aplicación | PolicyLab | **PolicyLab** | Sin cambios | Marca sólida; se resuelve su posicionamiento: laboratorio de simulación con estructura de juego |

---

### 7. Impacto sobre los documentos existentes

- **Documento 1:** sin cambios de contenido. Se añade en su próxima revisión la anotación de qué componente implementa cada exigencia: §4.2 y §6.2 — ATE; §6.2 capa 3 y §9.2 — LSM; §5 (clasificación de errores) — CRE; §5 (estrategias de corrección) — ATE.
- **Documento 2:** sin cambios de contenido. Sus secciones §5.1, §7.1, §8.2 y §9 pasan a ser la fuente principal para la especificación formal del CKS; su §11 (base de conocimiento) se entiende como la definición del EKG.
- **Documento 3 (pendiente):** debe redactarse ya con esta nomenclatura. Su sección de arquitectura de software especifica Causeway y la integración CRE→ATE→LSM→EKG; su alcance de producto es exclusivamente PolicyLab conforme a §3.9 de este documento.

---

**Este documento es normativo.** Cualquier propuesta futura de renombrar componentes, fusionar responsabilidades o añadir capas debe tramitarse como una revisión explícita del Documento 0, con registro de la decisión y su justificación.

---

### 8. Marcos de referencia utilizados

Este documento usa como marco estructural la arquitectura clásica de los **Sistemas Tutores Inteligentes** (ITS: modelo de dominio, modelo del estudiante, modelo tutor e interfaz), que fundamenta la separación entre EKG (dominio), LSM (estudiante), ATE (tutor) y las aplicaciones cliente (interfaz). La decisión de núcleo y adaptadores (§1) sigue el patrón general de arquitecturas hexagonales/de puertos y adaptadores de la ingeniería de software, aplicado aquí a la separación entre motores genéricos y conocimiento disciplinar. No se propone un marco arquitectónico nuevo: el aporte de este documento es la asignación de responsabilidades y nombres, no la invención de la estructura.

---

### 9. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-01 | Publicación inicial |
| 1.0.1 | 2026-08-01 | Se elimina la referencia nominal a `new-approach.md` (§1) para el registro público; se conserva la explicación de qué corrige esta identidad respecto a la propuesta preliminar. |
| 1.1 | 2026-08-01 | Se agrega §8 "Marcos de referencia utilizados" para alinear la estructura con los Documentos 1–5; Control de versiones pasa a §9. |
