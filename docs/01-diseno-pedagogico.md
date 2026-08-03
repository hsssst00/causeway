# Documento 1 — Diseño Pedagógico
## Fundamentación del Aprendizaje en el Videojuego

---

### 0. Ficha del documento

| Campo | Descripción |
|---|---|
| **Pregunta que responde** | ¿Cómo aprenderá el estudiante? |
| **Audiencia principal** | Diseñadores instruccionales, investigadores educativos, diseñadores de niveles, equipo docente colaborador |
| **Relación con Documento 2 (Económico)** | Este documento no redefine el conocimiento económico (grafo, agentes, mecanismos): los toma como dados y define cómo se secuencian, evalúan y retroalimentan pedagógicamente. La tabla de la sección 4 de este documento extiende directamente la tabla de la sección 6 del Documento 2. |
| **Relación con Documento 3 (GDD)** | Este documento define *qué* debe evaluarse, *cuándo* dar retroalimentación y *qué tipo* de progresión cognitiva debe reflejar la interfaz. El Documento 3 decide *cómo* se traduce eso en pantallas, animaciones y sistemas de puntuación. |
| **Alcance** | Marco pedagógico, taxonomía de niveles cognitivos, tipología de errores, evaluación y motivación. |
| **Fuera de alcance** | Wireframes, especificación técnica de UI, sistema de puntuación numérico (Documento 3). |

---

### 1. Fundamentación pedagógica y filosofía educativa

El proyecto no adopta un único marco teórico, sino una integración deliberada de cuatro corrientes, cada una responsable de un aspecto distinto del diseño. Esto se justifica porque ninguna de las cuatro, por sí sola, cubre simultáneamente el contenido (economía), el mecanismo de aprendizaje (cómo se construye el conocimiento) y el vehículo (el juego).

**1.1. Constructivismo (Piaget; Vygotsky).** El estudiante no recibe la relación causal ya explicada: la reconstruye activamente al elegir el siguiente eslabón de un mecanismo de transmisión (Documento 2, sección 6). Esto es coherente con la premisa explícita del proyecto: "el estudiante debe aprender reconstruyendo relaciones de causa y efecto." De la vertiente social del constructivismo (Vygotsky) se adopta específicamente el concepto de **Zona de Desarrollo Próximo**: cada nivel debe presentar un reto ligeramente por encima de lo que el estudiante puede resolver sin apoyo, con andamiaje (scaffolding) que se retira progresivamente — principio que estructura toda la sección 4.

**1.2. Aprendizaje Basado en Problemas — ABP (Barrows).** Cada escenario económico se presenta como un problema auténtico y no resuelto de antemano ("ocurre un evento o una decisión de política"), y el estudiante debe generar la explicación, no seleccionarla de una lista de definiciones. Se prefiere ABP sobre un enfoque expositivo-luego-práctica porque la evidencia en educación económica muestra que los estudiantes retienen mejor los mecanismos de transmisión cuando los reconstruyen frente a un caso concreto que cuando memorizan el modelo de forma abstracta primero.

**1.3. Game-Based Learning — GBL (Gee; Plass, Homer & Kinzer; Squire).** El juego no es un envoltorio motivacional sobre una lección tradicional: la mecánica *es* la actividad cognitiva objetivo. Gee describe cómo los buenos juegos generan aprendizaje mediante ensayo-error de bajo riesgo, retroalimentación inmediata y sistemas que hacen visibles reglas internas complejas — las tres características que la mecánica del grafo causal (Documento 2) está diseñada para explotar: el estudiante puede "fallar" un camino causal sin consecuencia real y recibir de inmediato por qué falló.

**1.4. Aprendizaje activo.** Se prioriza sistemáticamente que el estudiante *produzca* una secuencia causal (acción) por sobre que *reconozca* una ya construida (opción múltiple pasiva), en línea con la literatura de aprendizaje activo que asocia mayor involucramiento cognitivo con mecánicas de producción y decisión frente a mecánicas de mero reconocimiento.

**Cómo se integran sin contradicción:** el constructivismo y el ABP definen *qué tipo de actividad cognitiva* debe ocurrir (construir, no recibir); el GBL define *el vehículo* mediante el cual esa actividad se vuelve motivante y de bajo riesgo; el aprendizaje activo es el criterio transversal que se aplica a cada decisión de mecánica en el Documento 3 ("¿esta pantalla hace que el estudiante produzca razonamiento, o solo lo reconozca?").

---

### 2. Taxonomía de Bloom aplicada

Se utiliza la **taxonomía revisada** (Anderson & Krathwohl, 2001) por ser el estándar actual en diseño instruccional universitario, con sus seis niveles de proceso cognitivo: Recordar, Comprender, Aplicar, Analizar, Evaluar, Crear.

| Nivel del juego (Doc. 2, §6) | Nivel de Bloom dominante | Justificación |
|---|---|---|
| **Nivel 0** — Agentes económicos | Recordar / Comprender | Identificar agentes y qué controla cada uno es conocimiento declarativo previo, no razonamiento causal todavía. |
| **Nivel I** — Relaciones causales simples | Aplicar | El estudiante aplica una relación causal aislada a un caso concreto (una arista del grafo). |
| **Nivel II** — Mecanismos completos | Analizar | Requiere descomponer un mecanismo en sus partes y ordenar su interdependencia (un camino completo del grafo). |
| **Nivel III** — Interacción entre políticas | Analizar / Evaluar | Requiere comparar el peso relativo de dos mecanismos que convergen o compiten. |
| **Nivel IV** — Diagnóstico macroeconómico | Evaluar | Inferir la causa más plausible de un resultado observado es un juicio evaluativo bajo incertidumbre, no una aplicación directa. |
| **Nivel V** — Simulación de escenarios complejos | Crear | El estudiante genera una estrategia propia de política ante un sistema dinámico, la forma más alta de la taxonomía. |

Esta correspondencia no es solo descriptiva: es una restricción de diseño. Ningún escenario de Nivel I debe exigir Evaluar o Crear (sobrecarga prematura), y ningún escenario de Nivel V debe poder resolverse con Recordar (bajo desafío, riesgo de aburrimiento). El Documento 3 debe validar cada escenario nuevo contra esta tabla antes de asignarle un nivel.

---

### 3. Competencias, objetivos y resultados de aprendizaje

Se distinguen tres niveles de especificidad, siguiendo la práctica estándar en diseño curricular universitario:

- **Competencia** (transversal, se desarrolla a lo largo de todo el juego): *Razonar sobre relaciones de causa y efecto en sistemas económicos para explicar y anticipar los mecanismos de transmisión de la política económica.*
- **Objetivo de aprendizaje** (por nivel, orienta el diseño de escenarios): expresado con verbo de Bloom + contenido + condición.
- **Resultado de aprendizaje** (observable y medible, orienta la evaluación): lo que el sistema puede efectivamente registrar como evidencia.

**Ejemplos por nivel** (formato objetivo-resultado):

| Nivel | Objetivo de aprendizaje | Resultado de aprendizaje (observable) |
|---|---|---|
| I | Aplicar la relación entre oferta monetaria y tasa de interés ante un escenario de política monetaria expansiva. | El estudiante selecciona correctamente la arista tasa de interés— como efecto directo, en al menos el 80% de los escenarios de Nivel I intentados. |
| II | Reconstruir el mecanismo completo de transmisión de una política monetaria expansiva hasta el ingreso agregado. | El estudiante completa un camino consistente (Doc. 2, §5.3) de al menos 5 eslabones sin más de un error de tipo "salto" (§5 de este documento). |
| IV | Diagnosticar la política más probable que originó un resultado macroeconómico observado. | El estudiante identifica el evento de origen correcto o uno económicamente equivalente, con una justificación que cita al menos dos eslabones del mecanismo inverso. |

Competencias transversales adicionales que el juego desarrolla de forma acumulativa: razonamiento contrafactual ("¿qué habría pasado si...?"), y comunicación de un argumento económico como cadena causal explícita — habilidad de transferencia directa a la argumentación escrita en el curso presencial (ver sección 8).

---

### 4. Progresión del aprendizaje y andamiaje cognitivo

**4.1. Principio rector: carga cognitiva (Sweller).** Introducir simultáneamente vocabulario de agentes, dirección de relaciones causales y ambigüedad de caminos múltiples desde el Nivel 0 saturaría la carga cognitiva extrínseca del estudiante novato. Por eso el Nivel 0 aísla deliberadamente la carga *declarativa* (quién es quién) de la carga *relacional* (qué causa qué), que se introduce recién en el Nivel I.

**4.2. Retiro progresivo del andamiaje (cognitive apprenticeship — Collins, Brown & Newman).** La progresión de niveles no solo aumenta la complejidad del contenido económico (eso lo define el Documento 2), sino que retira sistemáticamente el apoyo estructural:

| Nivel | Tipo de apoyo disponible |
|---|---|
| 0–I | Ejemplo resuelto visible (worked example) + retroalimentación inmediata en cada paso |
| II | Retroalimentación solo al completar el mecanismo, no en cada eslabón individual |
| III | Sin ejemplo resuelto; pistas disponibles bajo demanda (costo en puntuación, Documento 3) |
| IV–V | Sin apoyo estructural; retroalimentación únicamente al final del escenario |

Este retiro progresivo es lo que operacionaliza la Zona de Desarrollo Próximo (§1.1) de forma medible y no solo declarativa.

---

### 5. Tipología de errores y estrategias de corrección

La tipología de errores se deriva directamente de la estructura del grafo causal definida en el Documento 2 (§5.1, §5.3), de modo que cada tipo de error tiene una causa estructural identificable y no es una categoría genérica de "respuesta incorrecta".

| Tipo de error | Descripción | Causa conceptual típica | Estrategia de corrección |
|---|---|---|---|
| **Error de polaridad** | El estudiante identifica la variable correcta pero invierte la dirección del efecto. | Confusión entre relaciones directas e inversas (ej. cree que tasa de interés— aumenta la inversión). | Mostrar la arista correcta aislada, sin avanzar en el mecanismo, y pedir que la re-explique con sus palabras antes de continuar (no solo mostrar la respuesta). |
| **Error de salto** | Omite un eslabón intermedio del mecanismo (pasa de oferta monetaria directamente a producción). | El estudiante conoce el resultado final pero no el mecanismo que lo produce — riesgo típico de haber memorizado conclusiones. | Insertar el eslabón faltante como paso obligatorio antes de continuar, marcado explícitamente como "paso omitido", nunca simplemente aceptar el salto como correcto. |
| **Error de supuesto** | Aplica una relación válida en otro modelo o bajo otro supuesto (p. ej. asume precios flexibles en un escenario IS-LM de precios fijos). | Transferencia incorrecta de una relación aprendida en un contexto distinto (ver Documento 2, §7 y §8.1). | Mostrar explícitamente el supuesto violado, no solo marcar el paso como incorrecto — es el mecanismo definido en Documento 2, §5.1, campo `explicacion_si_error`. |
| **Error de agente** | Atribuye una decisión al agente equivocado (p. ej. asigna política monetaria al Gobierno). | Falta de consolidación del Nivel 0. | Retroceder al mapa de agentes (sin penalizar como si fuera un error de razonamiento causal) antes de continuar el escenario. |
| **Error de alcance en diagnóstico inverso** | En escenarios de Nivel IV, infiere una causa plausible pero no la más consistente con toda la evidencia disponible. | Sobreajuste a una sola pista en vez de considerar el conjunto de indicadores. | Solicitar que enumere qué otras causas consideró y por qué las descartó, no solo revelar la respuesta correcta. |

**Principio general de corrección:** ningún error se corrige mostrando únicamente la respuesta correcta. Toda corrección reexpone al estudiante al punto exacto de la falla estructural (arista, supuesto o agente) para forzar la reconstrucción, no el reemplazo pasivo de la respuesta — consistente con el objetivo pedagógico del proyecto de que el sistema "explique por qué la relación causal seleccionada no corresponde al modelo económico" y no solo que indique que está mal.

---

### 6. Evaluación formativa y retroalimentación

**6.1. Marco de referencia.** Se adopta la definición de evaluación formativa de Black & Wiliam: evidencia recogida y usada durante el proceso de aprendizaje para ajustarlo, no solo para calificarlo al final. El diseño de retroalimentación sigue el modelo de tres preguntas de Hattie & Timperley: *¿A dónde voy?* (feed up), *¿cómo voy?* (feed back), *¿qué sigue?* (feed forward).

**6.2. Tres capas de retroalimentación**, alineadas a la granularidad del grafo (Documento 2):

1. **Inmediata (por paso):** al elegir un eslabón del mecanismo, señal de correcto/incorrecto con el tipo de error si aplica (§5). Solo disponible en Niveles 0–II, según el andamiaje de §4.2.
2. **De mecanismo (al completar el camino):** resumen de qué eslabones se lograron en el primer intento vs. cuáles requirieron corrección, mostrando el mecanismo completo reconstruido al final independientemente del número de intentos — el estudiante siempre termina viendo la cadena causal correcta completa.
3. **De sesión (feed forward):** patrones de error recurrentes a través de varios escenarios (p. ej. "sistemáticamente comete errores de supuesto al mezclar corto y largo plazo"), que orienta qué nivel o tema repetir. Esta capa es la que alimenta el panel docente (§9).

**6.3. Qué se evita deliberadamente:** retroalimentación binaria sin explicación ("correcto"/"incorrecto"), y retroalimentación que revele la respuesta antes de que el estudiante intente reconstruirla — ambas prácticas están asociadas en la literatura de evaluación formativa con menor beneficio de aprendizaje que la retroalimentación elaborada y contingente al tipo de error.

---

### 7. Motivación

**7.1. Marco: Teoría de la Autodeterminación (Deci & Ryan).** El diseño motivacional prioriza tres necesidades psicológicas básicas sobre la gamificación superficial (puntos y medallas sin sustento):

- **Autonomía:** el estudiante elige el camino a construir dentro del grafo, no selecciona entre opciones predefinidas de una sola vía correcta (Documento 2, §5.3, "camino consistente").
- **Competencia percibida:** el retiro progresivo del andamiaje (§4.2) asegura que la dificultad percibida crezca al ritmo del dominio real, no de forma arbitraria.
- **Relación:** fuera del alcance directo de este documento (el juego es de uso individual en su diseño base), pero se recomienda como extensión futura la posibilidad de comparar razonamientos entre pares en Niveles III–V, sin convertirlo en competencia de puntaje.

**7.2. Regla de diseño para el sistema de logros (Documento 3).** Los logros deben recompensar exclusivamente corrección conceptual y superación de patrones de error (p. ej. "cero errores de supuesto en cinco escenarios consecutivos"), no velocidad ni volumen de escenarios completados — recompensar velocidad incentivaría exactamente la conducta que el diseño busca evitar: adivinar en vez de razonar.

---

### 8. Retención y transferencia del conocimiento

**8.1. Retención — práctica de recuperación y espaciamiento.** Se aplican dos principios con soporte amplio en investigación cognitiva: la práctica de recuperación (retrieval practice) genera mejor retención que la relectura o revisión pasiva, y el espaciado de la práctica en el tiempo es más efectivo que la concentración masiva. En términos de diseño: los niveles superiores no deben limitarse a introducir mecanismos nuevos, sino **reintroducir mecanismos de niveles anteriores en escenarios distintos** (interleaving) — por ejemplo, un escenario de Nivel III de política fiscal expansiva debe volver a exigir el mecanismo de tasa de interés del Nivel I, en un contexto nuevo, no solo apilar contenido nuevo sobre contenido ya evaluado y abandonado.

**8.2. Transferencia — cercana y lejana.** La transferencia cercana (near transfer) se evalúa en Niveles I–II con escenarios estructuralmente similares a los practicados. La transferencia lejana (far transfer) es el propósito explícito de los Niveles IV y V: presentar situaciones no vistas explícitamente en el entrenamiento, de modo que un desempeño alto en esos niveles sea evidencia de comprensión del mecanismo y no de memorización de escenarios específicos. Esta distinción es la base de los indicadores de la sección 10.

---

### 9. Evaluación del aprendizaje dentro del videojuego

**9.1. Evaluación de proceso vs. evaluación de producto.** Se prioriza la evaluación de proceso (analítica de cómo el estudiante construye el camino causal, qué errores comete y en qué punto) sobre la evaluación de producto (si llegó o no al resultado final), siguiendo el enfoque de **evaluación sigilosa** (*stealth assessment*, Shute): la evidencia de aprendizaje se recoge de la interacción natural con el juego, sin interrumpir el flujo con pruebas separadas.

**9.2. Panel docente (referencia cruzada a Documento 3).** La capa de retroalimentación de sesión (§6.2, punto 3) se agrega a nivel de curso en un panel para el docente, con patrones de error por estudiante y por grupo — esto es responsabilidad de diseño de UI del Documento 3, pero el contenido y la lógica de agregación de patrones de error pertenece a este documento.

---

### 10. Indicadores para medir si el estudiante realmente aprendió macroeconomía

Se distinguen tres familias de indicadores, porque ninguna por sí sola es evidencia suficiente de comprensión:

| Familia | Indicador | Qué mide | Riesgo si se usa sola |
|---|---|---|---|
| **Proceso (in-game)** | Tasa de caminos consistentes en primer intento por nivel | Fluidez del razonamiento causal | Puede reflejar memorización de escenarios repetidos, no comprensión |
| **Proceso (in-game)** | Distribución de tipos de error (§5) a lo largo del tiempo | Qué tipo de confusión conceptual persiste | No indica si el estudiante puede transferir el conocimiento a un caso nuevo |
| **Producto (in-game)** | Desempeño en escenarios de Nivel IV–V (transferencia lejana, §8.2) | Comprensión profunda, no memorización | Escenarios de simulación abierta son más difíciles de calificar de forma automática y consistente |
| **Validación externa (recomendada, fuera del juego)** | Evaluación pre/post con un instrumento estandarizado o adaptado de conceptos macroeconómicos, aplicado fuera del juego | Contraste entre lo que el juego mide internamente y la comprensión medida de forma independiente | Sin esta validación externa, los indicadores in-game solo demuestran que el estudiante mejora *dentro del sistema*, no necesariamente que la mejora es transferible al curso |

El último renglón no fue solicitado explícitamente en el planteamiento original del proyecto, pero se incorpora aquí como requisito porque, sin él, el proyecto no tiene forma de distinguir "el estudiante aprendió a jugar el juego" de "el estudiante aprendió macroeconomía" — la pregunta que este documento existe para responder. Se recomienda un piloto con un grupo de estudiantes reales, con medición antes y después de usar el juego, como parte del cronograma de proyecto (referencia cruzada: Documento 3, Roadmap).

---

### 11. Glosario

- **Andamiaje (scaffolding):** apoyo estructural temporal que se retira a medida que el estudiante gana autonomía.
- **Camino consistente:** ver Documento 2, §12 — su evaluación pedagógica se rige por los criterios de esta sección.
- **Evaluación formativa:** evidencia recogida durante el proceso para ajustar el aprendizaje, no solo para calificarlo.
- **Evaluación sigilosa (stealth assessment):** evaluación integrada en la actividad de juego, sin pruebas separadas que interrumpan el flujo.
- **Transferencia cercana / lejana:** aplicación de lo aprendido a situaciones similares vs. estructuralmente distintas a las practicadas.

---

### 12. Marcos de referencia utilizados

Este documento se apoya en marcos ampliamente reconocidos en diseño instruccional y ciencias del aprendizaje: la taxonomía de Bloom revisada (Anderson & Krathwohl), el constructivismo de Piaget y el constructivismo social de Vygotsky (Zona de Desarrollo Próximo), el aprendizaje basado en problemas (Barrows), el aprendizaje cognitivo por aprendizaje (cognitive apprenticeship, Collins, Brown & Newman), la teoría de la carga cognitiva (Sweller), la teoría de la autodeterminación (Deci & Ryan), el modelo de retroalimentación de Hattie & Timperley, la evaluación formativa de Black & Wiliam, la evaluación sigilosa de Shute, y la literatura sobre efecto de la práctica de recuperación (Roediger & Karpicke) y sobre Game-Based Learning (Gee; Plass, Homer & Kinzer). No se propone ninguna metodología nueva: el aporte propio del proyecto es la integración específica de estos marcos sobre la estructura de grafo causal definida en el Documento 2.

---

**Referencias cruzadas pendientes de completar en Documento 3:**
- → GDD, Sistema de progresión: debe implementar el retiro de andamiaje de la sección 4.2 como regla de sistema, no solo como contenido.
- → GDD, Sistema de logros: debe respetar la regla de la sección 7.2 (recompensar corrección conceptual, no velocidad).
- → GDD, UX de retroalimentación: debe implementar las tres capas de la sección 6.2 como componentes de interfaz diferenciados.
- → GDD, Roadmap: debe incluir el piloto de validación externa descrito en la sección 10.

---

### 13. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-01 | Publicación inicial |
