# Documento 3 — Game Design Document
## PolicyLab: Laboratorio de Simulación de Política Económica

---

### 0. Ficha del documento

| Campo | Descripción |
|---|---|
| **Pregunta que responde** | ¿Cómo será el videojuego? |
| **Audiencia principal** | Equipo de desarrollo (ingeniería, arte, UX), dirección de producto, docentes colaboradores |
| **Relación con Documento 0 (Identidad)** | Este documento usa la nomenclatura normativa del Documento 0 y respeta sus reglas de dependencia (§4): PolicyLab es una aplicación cliente que consume los servicios de **Causeway** (CRE, ATE, LSM, EKG) y no reimplementa ningún motor. Su posicionamiento es el fijado en Documento 0, §3.9: *laboratorio de simulación con estructura de juego*. |
| **Relación con Documento 1 (Pedagógico)** | Este documento implementa como sistemas de juego lo que el Documento 1 exige como principios: el retiro de andamiaje (§4.2) se convierte en reglas de sistema (aquí, §3.1); las tres capas de retroalimentación (§6.2) en componentes de interfaz diferenciados (§3.5); la regla de logros (§7.2) en el diseño de credenciales (§3.3); y el piloto de validación externa (§10) en un hito del roadmap (§8.2). |
| **Relación con Documento 2 (Económico)** | Este documento traduce las entidades del EKG en pantallas y mecánicas: define el esquema de datos que implementa las estructuras conceptuales de Doc. 2, §5.1 y §9 (aquí, §7.3), la visualización de supuestos activos de Doc. 2, §8.1 (aquí, §4.4) y la representación de stocks, flujos y tasas de Doc. 2, §4.2 (aquí, §5.3). |
| **Alcance** | Experiencia de usuario completa de PolicyLab, sistemas de juego, dirección visual y sonora, arquitectura de software de la aplicación y de su integración con Causeway, plan de producción. |
| **Fuera de alcance** | Contenido económico (EKG, Doc. 2), lógica pedagógica (Doc. 1 y ATE), calibración numérica de modelos (documento técnico posterior). |

---

### 1. Visión general

**1.1. Concepto en una frase.** PolicyLab es un laboratorio virtual donde un **Analista** recibe escenarios de política económica y debe reconstruir, eslabón por eslabón, el mecanismo de transmisión que explica sus efectos — con un sistema que evalúa el razonamiento paso a paso y produce, al cierre de cada escenario, un **Informe de Razonamiento** en lugar de una puntuación tradicional.

**1.2. Posicionamiento.** Conforme al Documento 0, §3.9, PolicyLab no se comunica como "videojuego" ni como "curso": es un laboratorio de simulación con estructura de juego. Las mecánicas de juego (progresión por niveles, fallo de bajo riesgo, retroalimentación inmediata, credenciales) no son decoración: son, según la fundamentación GBL del Documento 1, §1.3, el vehículo que produce el aprendizaje. Lo que se elimina deliberadamente es la capa de presentación arcade: no hay vidas, ni cronómetros, ni tablas de clasificación por velocidad.

**1.3. Público y contexto de uso.** Estudiantes universitarios de un curso introductorio de macroeconomía (Documento 1, público objetivo), en dos contextos: (a) uso autónomo asignado como práctica del curso, y (b) uso guiado en sesión de laboratorio con docente. El producto debe funcionar en el equipo que el estudiante ya tiene: navegador de escritorio y móvil, sin instalación (decisión de plataforma justificada en §7.5).

**1.4. Pilares de diseño.** Toda decisión de este documento se valida contra cuatro pilares:

1. **Razonar es la mecánica.** Cada interacción central del juego debe hacer que el Analista *produzca* un paso de razonamiento causal, no que lo reconozca pasivamente (Documento 1, §1.4). Si una pantalla puede resolverse adivinando o por eliminación trivial, está mal diseñada.
2. **El error es material de trabajo.** Fallar un eslabón nunca interrumpe, castiga ni avergüenza: abre la corrección correspondiente al tipo de error (Documento 1, §5) y queda registrado como parte del Informe, no como mancha.
3. **Los supuestos siempre visibles.** El Analista nunca razona sobre un modelo cuyas condiciones no puede ver (Documento 2, §8.1).
4. **Sobriedad con carácter.** Estética de gabinete técnico contemporáneo — precisa, cálida, con personalidad — nunca infantil ni corporativa genérica.

**1.5. Referencia de marcos.** El diseño de mecánicas y dinámicas de este documento usa el marco MDA (Mechanics-Dynamics-Aesthetics; Hunicke, LeBlanc & Zubek) como vocabulario de análisis, y las heurísticas de usabilidad de Nielsen y WCAG 2.2 nivel AA como criterios de UX y accesibilidad.

---

### 2. Experiencia central

#### 2.1. Gameplay loop

**Loop central (por escenario):**

```
1. BRIEFING
   El Analista recibe un memo: contexto, evento inicial,
   supuestos activos del escenario (chips visibles).
                         |
                         v
2. CONSTRUCCIÓN
   Construye la cadena causal eslabón por eslabón sobre
   el lienzo del grafo: elige variable destino y polaridad.
                         |
                         v
3. VALIDACIÓN (CRE, vía Causeway)
   El sistema valida consistencia del camino — no
   coincidencia con una única respuesta modelo
   (Doc. 2, §5.3).
                         |
                         v
4. RETROALIMENTACIÓN (ATE)
   Según nivel y tipo de error: corrección inmediata,
   resumen de mecanismo o silencio hasta el cierre
   (Doc. 1, §4.2 y §6.2).
                         |
                         v
5. INFORME DE RAZONAMIENTO
   Cadena completa reconstruida, errores y correcciones,
   credenciales obtenidas, recomendación de siguiente paso.
```

**Loop de sesión (varios escenarios):** Tablero del Analista — selección de escenario (curada por el ATE con interleaving, Doc. 1, §8.1) — loop central — actualización de dominio por mecanismo (LSM) — nueva recomendación. El jugador siempre puede desviarse de la recomendación y elegir libremente entre los escenarios desbloqueados (autonomía, Doc. 1, §7.1).

**Loop de largo plazo (curso completo):** progresión por los Niveles 0–V, acumulación de credenciales de dominio, evolución visible del "Expediente del Analista" (historial de informes), y — para el docente — lectura agregada en el panel de curso.

#### 2.2. Mecánicas

| Mecánica | Descripción | Actividad cognitiva que produce | Fundamento |
|---|---|---|---|
| **Construir eslabón** | Desde la variable activa, el Analista elige la siguiente variable afectada *y* la dirección del efecto (↑/↓) antes de confirmar. | Aplicar una relación causal con polaridad — no basta señalar la variable. | Doc. 2, §5.1 (la polaridad es parte de la arista); Doc. 1, §5 (permite distinguir error de polaridad de error de variable) |
| **Bandeja de candidatas** | Las variables disponibles para el siguiente eslabón se presentan en una bandeja que incluye distractores plausibles (variables reales del grafo que *no* siguen causalmente). | Discriminar, no reconocer: el conjunto de opciones nunca delata la respuesta. | Doc. 1, §1.4 (producción sobre reconocimiento) |
| **Consulta de agentes** | Panel lateral siempre disponible con la ficha de los seis agentes y qué controla cada uno. Consultarlo no penaliza. | Consolidar el mapa agente-variable (Nivel 0) sin castigar la duda. | Doc. 2, §3; Doc. 1, §5 (error de agente se corrige volviendo al mapa, sin penalización de razonamiento) |
| **Pista bajo demanda** | Desde Nivel III, el Analista puede pedir una pista (p. ej. "el siguiente eslabón pertenece al sistema financiero"). Tiene costo en el Índice de Dominio del escenario, nunca lo bloquea. | Autorregulación: decidir cuándo se necesita apoyo. | Doc. 1, §4.2 (andamiaje bajo demanda con costo, Niveles III+) |
| **Re-explicación estructurada** | Tras un error de polaridad, antes de continuar, el Analista debe elegir entre 3–4 explicaciones autoradas cuál justifica la relación correcta (una correcta, distractores con errores conceptuales típicos). | Reconstruir el porqué, no solo corregir el qué. | Doc. 1, §5 (estrategia de corrección de polaridad: "que la re-explique antes de continuar") |
| **Eslabón omitido** | Cuando el CRE detecta un salto, el sistema inserta un hueco marcado "paso omitido" que el Analista debe completar antes de avanzar. | Exponer el mecanismo que la conclusión memorizada ocultaba. | Doc. 1, §5 (error de salto: nunca aceptar el salto como correcto) |
| **Diagnóstico inverso** | (Nivel IV) Se muestra un tablero de indicadores finales; el Analista recorre el grafo hacia atrás, propone la causa de origen y debe citar al menos dos eslabones del mecanismo inverso como evidencia. | Inferencia abductiva bajo incertidumbre. | Doc. 2, §10 (escenario tipo Diagnóstico); Doc. 1, §3 (resultado de aprendizaje de Nivel IV) |
| **Simulación por turnos** | (Nivel V) El Analista actúa como un agente (p. ej. Banco Central) durante varios turnos; los demás agentes reaccionan según reglas del EKG; el sistema propaga efectos de forma determinista. | Estrategia y anticipación en sistema dinámico (nivel Crear de Bloom). | Doc. 2, §10 (Simulación abierta); Doc. 2, §8.2 (propagación determinista) |
| **Autoexplicación libre (no calificada)** | Al cerrar escenarios de Nivel III+, campo opcional de texto libre: "resume tu razonamiento en dos frases". Se adjunta al Informe y es visible para el docente; el sistema no lo califica automáticamente. | Verbalizar el argumento causal — transferencia a la argumentación escrita del curso. | Doc. 1, §3 (competencia de comunicación); decisión de MVP en §8.1 de este documento |

#### 2.3. Dinámicas

En términos MDA, las dinámicas esperadas (comportamientos emergentes de las mecánicas anteriores) y las que el diseño debe vigilar:

- **Dinámica deseada — experimentación sin miedo:** dado que el error abre corrección y no castigo, se espera que el Analista pruebe hipótesis en lugar de paralizarse. El indicador de que esto funciona: la tasa de abandono de escenario tras el primer error debe ser baja (métrica de diseño, §8.5).
- **Dinámica deseada — lectura de supuestos antes de actuar:** los chips de supuestos (§4.4) más los errores de supuesto con explicación explícita deben producir, con el tiempo, el hábito de revisar condiciones antes de construir. Medible: reducción de errores de supuesto por sesión (LSM).
- **Dinámica de riesgo — ensayo y error mecánico:** probar variables al azar hasta acertar. Mitigaciones de diseño: el Índice de Dominio pondera el primer intento (§3.2), la bandeja incluye distractores plausibles, y la re-explicación estructurada convierte el acierto casual en trabajo conceptual igualmente. El LSM detecta el patrón (secuencias de intentos rápidos fallidos) y el ATE responde bajando el nivel de escenario recomendado, no puniendo.
- **Dinámica de riesgo — dependencia del panel de agentes:** consultar la ficha de agentes es gratuito; si el LSM detecta consulta sistemática en Nivel II+, el ATE recomienda repasar Nivel 0 (corrección de causa raíz, no síntoma).

#### 2.4. Tipos de preguntas e interacciones por nivel

| Nivel (Doc. 1/2) | Interacción principal | Formato | Bloom dominante |
|---|---|---|---|
| **0 — Agentes** | Emparejar variables con el agente que las controla; clasificar decisiones ("¿quién sube los impuestos?") | Arrastrar tarjetas a paneles de agente; selección directa | Recordar / Comprender |
| **I — Relación simple** | Dado el evento, elegir la variable afectada directa **y** su polaridad | Bandeja de candidatas + selector —/— | Aplicar |
| **II — Mecanismo completo** | Construir la cadena completa (5+ eslabones) desde el evento hasta el resultado | Constructor causal sobre lienzo | Analizar |
| **III — Interacción de políticas** | Construir dos cadenas concurrentes e identificar el nodo de convergencia y el efecto neto cualitativo | Constructor con dos cadenas de color distinto; pregunta de convergencia | Analizar / Evaluar |
| **IV — Diagnóstico** | Del tablero de resultados, inferir el evento origen; justificar citando eslabones inversos | Recorrido inverso + selección de evidencia | Evaluar |
| **V — Simulación** | Decidir política por turno como agente; leer reacciones; ajustar estrategia; informe final de gestión | Simulación por turnos con tablero dinámico | Crear |
| **Transversal** | Re-explicación estructurada tras error de polaridad; autoexplicación libre al cierre (III+) | Opción múltiple autorada / texto libre no calificado | Comprender / comunicación |

Regla de validación de contenido: todo escenario nuevo se valida contra la tabla de Bloom del Documento 1, §2 antes de asignarle nivel — ningún escenario de Nivel I puede exigir Evaluar; ninguno de Nivel V puede resolverse Recordando.

---

### 3. Sistemas de juego

#### 3.1. Sistema de progresión

**Regla central: se progresa por dominio, no por completitud.** Terminar escenarios no desbloquea el nivel siguiente; demostrar consistencia sí. El umbral por defecto es el definido en los resultados de aprendizaje del Documento 1, §3 (p. ej., Nivel I — II requiere —80% de aristas correctas al primer intento en los escenarios del nivel; Nivel II — III requiere caminos consistentes de 5+ eslabones con no más de un error de salto). Los umbrales son configuración del ATE por curso, no constantes del cliente.

**El retiro de andamiaje es regla de sistema, no contenido** (cumple la referencia cruzada pendiente del Documento 1). PolicyLab no decide qué apoyo mostrar: consulta al ATE, que aplica la tabla del Documento 1, §4.2. A nivel de interfaz, esto se traduce así:

| Nivel | Regla de sistema (ATE) | Traducción en interfaz (PolicyLab) |
|---|---|---|
| 0–I | Ejemplo resuelto visible + feedback por paso | Panel "mecanismo de ejemplo" anclado y consultable; cada eslabón confirma/corrige al instante |
| II | Feedback solo al completar el mecanismo | El constructor acepta todos los eslabones sin señal; la validación ocurre al pulsar "Presentar análisis" |
| III | Sin ejemplo; pistas bajo demanda con costo | Botón "Solicitar pista" visible con su costo declarado antes de usarlo |
| IV–V | Sin apoyo estructural; feedback al cierre | Sin panel de ejemplo ni pistas; solo la consulta de agentes permanece (nunca se retira) |

**Estructura visible de progresión:** el Tablero del Analista muestra los seis niveles como áreas de un mapa de gabinete, con el dominio por mecanismo (barras por mecanismo, no estrellas por escenario) y la recomendación del ATE destacada ("hoy conviene repasar transmisión monetaria en un contexto fiscal" — interleaving del Doc. 1, §8.1, explicado al usuario en lenguaje natural).

#### 3.2. Sistema de puntuación: Índice de Dominio

Se sustituye la puntuación arcade por un **Índice de Dominio (0–100) por mecanismo**, calculado por el LSM y mostrado por PolicyLab. Composición cualitativa (la fórmula exacta se calibra en el documento técnico):

- **Pondera:** proporción de eslabones correctos al primer intento; ausencia de errores por tipo (con peso mayor para errores de supuesto y de polaridad, por ser los conceptualmente más graves según Doc. 1, §5); consistencia sostenida entre escenarios distintos del mismo mecanismo (evidencia de transferencia cercana, Doc. 1, §8.2).
- **Descuenta:** pistas solicitadas (costo declarado y moderado — pedir ayuda debe ser racional, no ruinoso).
- **Excluye por regla (Doc. 1, §7.2):** tiempo empleado, velocidad de respuesta, número de escenarios jugados, rachas de días. Ninguna métrica de volumen o velocidad puede entrar al Índice ni a ninguna credencial. Esta exclusión es verificable en revisión de diseño: cualquier propuesta futura de "bonus por rapidez" contradice este documento y el Documento 1.

El Índice nunca se presenta como nota del curso: es un instrumento de orientación del Analista y del docente. La calificación académica, si el docente decide usarla, se deriva del panel docente bajo su criterio — PolicyLab no califica personas.

#### 3.3. Credenciales de dominio (sistema de logros)

Conforme al Documento 0, §3.9, los logros se implementan como **credenciales de dominio dentro del Informe de Razonamiento**: reconocimientos con nombre propio que certifican corrección conceptual o superación de un patrón de error. Ejemplos del set inicial:

| Credencial | Condición | Patrón que refuerza |
|---|---|---|
| **Cartógrafa/o de agentes** | Nivel 0 dominado sin errores de agente en los tres últimos escenarios | Mapa agente-variable consolidado |
| **Cadena íntegra** | Mecanismo de 5+ eslabones, consistente al primer intento | Fluidez del razonamiento completo |
| **Cinco sin supuestos** | Cero errores de supuesto en cinco escenarios consecutivos | El hábito de leer condiciones antes de razonar (Doc. 1, §7.2, ejemplo literal) |
| **Polaridad firme** | Diez aristas consecutivas con polaridad correcta al primer intento | Superación del error conceptual más frecuente |
| **Ojo clínico** | Diagnóstico de Nivel IV correcto con justificación de 2+ eslabones, en primer intento | Inferencia inversa con evidencia |
| **Contrafactual** | Responder correctamente la pregunta "¿qué habría pasado si...?" opcional de un escenario de Nivel III+ | Razonamiento contrafactual (Doc. 1, §3) |

Reglas del sistema: ninguna credencial usa tiempo, volumen ni rachas de calendario; toda credencial es alcanzable en repetición (perderla una vez no la bloquea para siempre); las credenciales aparecen en el Informe y en el Expediente, nunca como pop-up interruptor durante la construcción (protección del flujo de razonamiento).

#### 3.4. Informe de Razonamiento

Artefacto central de cierre de cada escenario. Estructura fija:

1. **El mecanismo completo**, siempre mostrado correcto al final, independientemente del número de intentos (Doc. 1, §6.2, capa 2: el estudiante siempre termina viendo la cadena causal completa).
2. **Tu reconstrucción:** qué eslabones logró al primer intento, cuáles requirieron corrección y de qué tipo fue cada error (con el lenguaje de la tipología del Doc. 1, §5, en versión legible: "confundiste la dirección del efecto", no "error tipo 2").
3. **Los supuestos que importaron:** qué condiciones del escenario habilitaron o inhabilitaron relaciones relevantes.
4. **Credenciales obtenidas** (si las hay).
5. **Siguiente paso sugerido** (feed forward del ATE, Doc. 1, §6.2, capa 3).
6. **Tu resumen** (autoexplicación libre, si el Analista la escribió).

El Informe es exportable (PDF) y se acumula en el **Expediente del Analista** — el historial navegable que sustituye a la "pantalla de estadísticas" de un juego convencional y que da continuidad narrativa al progreso.

#### 3.5. Retroalimentación: tres componentes de interfaz

Cumpliendo la referencia pendiente del Documento 1 (§6.2 — "componentes de interfaz diferenciados"):

| Capa (Doc. 1, §6.2) | Componente de UI | Comportamiento | Disponibilidad |
|---|---|---|---|
| **1. Inmediata (por paso)** | *Señal de eslabón*: el eslabón recién colocado se asienta (correcto) o se destaca con la corrección del tipo de error, in situ, sin modal | Nunca revela la respuesta: abre la interacción correctiva correspondiente (re-explicación, eslabón omitido, mapa de agentes) | Niveles 0–II según ATE |
| **2. De mecanismo** | *Panel de cierre*: resumen visual de la cadena con marcas de primer intento vs. corregido | Siempre termina mostrando el mecanismo completo correcto | Todos los niveles, al cerrar |
| **3. De sesión (feed forward)** | *Notas del gabinete* en el Tablero: patrones detectados entre escenarios ("sueles omitir el eslabón del sistema financiero") + recomendación | Redactadas en segunda persona, tono de mentoría, nunca de reproche | Tablero del Analista; se agrega al panel docente |

Prohibiciones de diseño (Doc. 1, §6.3): nada de "¡Incorrecto!" binario sin explicación; nada de revelar la respuesta antes del intento de reconstrucción; nada de efectos sonoros o visuales punitivos en el error (ver §5.4).

---

### 4. Experiencia de usuario (UX)

#### 4.1. Principios UX

1. **Una decisión cognitiva por momento.** Cada pantalla pide exactamente un tipo de razonamiento a la vez (gestión de carga cognitiva, Doc. 1, §4.1). El constructor causal nunca convive con formularios, menús de configuración ni notificaciones.
2. **Estado del sistema siempre visible** (heurística 1 de Nielsen): qué escenario, qué modelo activo, qué supuestos rigen, cuántos eslabones lleva la cadena — todo visible sin navegar.
3. **El error nunca destruye trabajo.** Corregir un eslabón conserva el resto de la cadena construida; salir de un escenario guarda el estado.
4. **Lenguaje del dominio, no del sistema.** La interfaz habla de "mecanismos", "supuestos", "análisis" — nunca de "niveles superados", "puntos" ni "vidas".
5. **Móvil de primera clase.** El constructor causal se diseña primero para pantalla táctil vertical (tocar para elegir, no arrastres de precisión) y se expande a escritorio, no al revés — el contexto real de estudio del público objetivo lo exige.

#### 4.2. Flujo de pantallas

```
                    Acceso
             (institucional / LTI desde el LMS
              del curso, ver §7.7)
                       |
                       v
      TABLERO DEL ANALISTA
       · Mapa de niveles y dominio
       · Recomendación del ATE
       · Notas del gabinete (feed forward)
       · Expediente (informes previos)
             |                    |
             v                    v
   SELECCIÓN DE            EXPEDIENTE
   ESCENARIO               (informes, credenciales,
   (filtrado por           autoexplicaciones)
    nivel/mecanismo)
             |
             v
   BRIEFING
   memo + supuestos + agentes implicados
             |
             v
   CONSTRUCTOR CAUSAL  <—> validación / corrección (loop)
             |
             v
   INFORME DE RAZONAMIENTO   (cierre — vuelve al Tablero)

   Ruta docente (rol separado):
   Acceso — PANEL DOCENTE (curso — grupo — estudiante — informe)
```

#### 4.3. Wireframes conceptuales

**W1 — Constructor causal (pantalla principal, escritorio):**

```
+----------------------------------------------------------------------+
| Escenario 12 · Política monetaria expansiva      Modelo: IS-LM       |
| [precios fijos] [economía cerrada] [expectativas estáticas]  <chips> |
+---------------+--------------------------------------------+---------+
| MEMO          |  LIENZO DEL MECANISMO                       | AGENTES |
|               |                                              |         |
| "El Banco     |   (Oferta monetaria ↑)                       | · Banco |
| Central       |          |                                   |   Central|
| anuncia un    |          v                                   | · Gobierno|
| aumento de    |   (Tasa de interés ↓)                        | · Empresas|
| la oferta     |          |                                   | · Hogares|
| monetaria..." |          v                                   | · Sist. fin.|
|               |   [ ? ? ? ? ]                                | · Sector ext.|
| Objetivo:     |     ¿siguiente?   <- eslabón activo          |         |
| explicar el   |                                              | (ficha al|
| efecto sobre  |                                              |  tocar; no|
| el consumo    |                                              |  penaliza)|
+---------------+----------------------------------------------+---------+
| BANDEJA:  [Inversión ↑↓] [Gasto público ↑↓] [Tipo de cambio ↑↓]      |
|           [Consumo ↑↓]  [Nivel de precios ↑↓]   … (con distractores) |
|                                    [ Presentar análisis ]  (Nivel II+)|
+------------------------------------------------------------------------+
```

En móvil, el memo y el panel de agentes se pliegan en pestañas inferiores; el lienzo ocupa la pantalla y la bandeja es un carrusel táctil.

**W2 — Informe de Razonamiento:**

```
+------------------------------------------------------------------+
| INFORME DE RAZONAMIENTO · Escenario 12                           |
+------------------------------------------------------------------+
| EL MECANISMO                                                     |
|  OM↑ → i↓ → I↑ → DA↑ → Y↑ → Ingreso↑ → C↑   (siempre completo)   |
|                                                                    |
| TU RECONSTRUCCIÓN                                                 |
|  ✓ OM↑ → i↓          primer intento                              |
|  ✗ i↓ → I↑           corregido: dirección del efecto             |
|  ✓ I↑ → DA↑ …                                                    |
|                                                                    |
| LOS SUPUESTOS QUE IMPORTARON                                      |
|  · precios fijos: por eso el efecto llega a producción,          |
|    no a precios                                                  |
|                                                                    |
| CREDENCIAL OBTENIDA: ★ (Polaridad firme: 7/10)                    |
| SIGUIENTE PASO: repasar la relación tasa de interés→inversión     |
| TU RESUMEN: [texto libre del Analista]                            |
|                              [Exportar PDF] [Volver al tablero]   |
+------------------------------------------------------------------+
```

**W3 — Panel docente (vista de curso):**

```
+------------------------------------------------------------------+
| PANEL DOCENTE · Macroeconomía I · Grupo B (34 analistas)         |
+------------------------------------------------------------------+
| PATRONES DEL GRUPO (LSM, agregado)                                |
|  · Error dominante: supuesto (41% de los errores, ↑ vs sem.)     |
|  · Mecanismo más débil: transmisión fiscal con crowding-out      |
|  · Distribución de dominio por nivel  [gráfico de barras]        |
+------------------------------------------------------------------+
| ESTUDIANTES  (ordenables por patrón de error, no por ranking     |
|  de puntaje: el panel orienta docencia, no clasifica)            |
|  Nombre · nivel actual · patrón dominante · último informe ⟶   |
+------------------------------------------------------------------+
```

Estos tres wireframes fijan la estructura; el diseño de alta fidelidad se produce en la fase F0 del roadmap (§8.2).

#### 4.4. Visualización de los supuestos activos

Cumple la referencia pendiente del Documento 2, §8.1. Especificación:

- **Chips persistentes** en la cabecera de todo escenario: cada supuesto activo (`precios_fijos`, `economia_cerrada`, `expectativas_estaticas`, régimen cambiario—) es un chip siempre visible, nunca colapsado por defecto.
- **Explicación al toque:** tocar un chip abre una tarjeta de dos frases en lenguaje llano ("Precios fijos: en el corto plazo de este modelo, las empresas ajustan cantidades, no precios") autorada en el EKG, no generada.
- **Vínculo con el error de supuesto:** cuando el CRE clasifica un error de supuesto, la corrección resalta el chip violado con una línea que lo conecta al eslabón rechazado — el Analista *ve* qué condición invalidó su relación (operacionaliza `explicacion_si_error`, Doc. 2, §5.1).
- **Cambio de modelo visible:** al activar un modelo que relaja un supuesto (p. ej. AD-AS libera precios fijos), el chip correspondiente aparece tachado en la transición, haciendo explícita la extensión del modelo (valor pedagógico de la progresión IS-LM — AD-AS, Doc. 2, §1.2).

#### 4.5. Accesibilidad

- WCAG 2.2 AA como requisito de aceptación, no aspiración: contraste, foco visible, navegación completa por teclado en escritorio, objetivos táctiles —44 px en móvil.
- **La polaridad nunca se codifica solo con color:** toda arista positiva/negativa lleva símbolo (+/—) y estilo de trazo distinto (continuo/discontinuo), además del color. Paleta verificada para los tres tipos de daltonismo.
- El sonido jamás porta información única (ver §5.4); toda animación relevante tiene equivalente estático; se respeta `prefers-reduced-motion`.
- Textos del EKG con nivel de lectura revisado en el proceso de curación (Doc. 2, §11.3, revisión pedagógica).

---

### 5. UI, dirección visual, animación y sonido

#### 5.1. Diseño visual

**Dirección de arte: "gabinete técnico contemporáneo".** Referencias de tono: cartografía editorial, tableros de instrumentos, papel técnico. Concreción:

- **Layout** de retícula clara con generoso espacio en blanco; densidad de información alta solo donde el razonamiento la exige (lienzo del grafo), nunca en cabeceras ni menús.
- **Tipografía:** una familia humanista para lectura (memos, informes) y una monoespaciada o semi-mono para variables y datos — la distinción tipográfica separa "narración" de "sistema económico" en cada pantalla.
- **Color:** base neutra cálida (papel), un color de identidad institucional del gabinete, y un sistema semántico reservado: polaridad positiva/negativa, estado de eslabón (propuesto/validado/corregido), y familias de evento (fiscal, monetaria, choque externo, expectativas — las cuatro familias del Doc. 2, §9, cada una con su matiz).
- **Los agentes** tienen identidad visual propia (color + emblema) consistente en todo el producto: en la ficha, en los nodos de variables que controlan y en sus voces institucionales (§6.2).
- Nada de estética infantil, insignias doradas brillantes ni confeti: la celebración de una credencial es sobria (sello sobre el Informe).

#### 5.2. Iconografía

Sistema de iconos propio, de trazo uniforme, con tres familias:

1. **Agentes (6):** emblemas tipo sello — columna/banco (Banco Central), edificio de gobierno, engranaje (Empresas), casa (Hogares), flujo entre nodos (Sistema financiero), rosa de los vientos (Sector externo).
2. **Naturaleza de variable (3):** tanque/nivel (stock), flecha en movimiento (flujo), dial (precio/tasa) — coherentes con la representación animada (§5.3 y Doc. 2, §4.2).
3. **Sistema (estados y acciones):** validado, corregido, paso omitido, pista, supuesto, credencial.

Todos los iconos se entregan con etiqueta de texto en su primer uso por sesión; ningún icono significa nada que no se haya presentado.

#### 5.3. Animaciones

Las animaciones son semánticas: cada una comunica un concepto económico o un estado del sistema, nunca son ornamento.

| Animación | Qué comunica | Especificación |
|---|---|---|
| **Pulso de propagación** | El efecto viaja por la cadena | Al validar un mecanismo, un pulso recorre las aristas en orden causal, con pausa breve en cada nodo |
| **Stocks como niveles** | La variable es un acervo | El nodo stock sube/baja su nivel de llenado (Doc. 2, §4.2: "un stock se representa como nivel/barra") |
| **Flujos como corriente** | La variable es un ritmo por período | Partículas en movimiento cuya velocidad cambia con la magnitud cualitativa |
| **Tasas como diales** | Precio/tasa que rota | Aguja de dial con dirección de giro = polaridad |
| **Asentamiento de eslabón** | Confirmación sin juicio | El eslabón correcto "se asienta" con una transición breve y silenciosa |
| **Corrección** | Error como apertura, no castigo | El eslabón rechazado no estalla ni tiembla en rojo: se desplaza a un costado y se abre la tarjeta de corrección; si es error de supuesto, línea animada hacia el chip violado (§4.4) |
| **Transición de modelo** | Un modelo extiende al anterior | Al activar AD-AS/M-F, los nodos y aristas nuevos se despliegan desde el grafo existente — el grafo crece, no se reemplaza (Doc. 2, §1.2) |

Presupuesto de movimiento: ninguna animación bloquea la entrada del usuario más de 400 ms; todas respetan `prefers-reduced-motion` con variante estática equivalente.

#### 5.4. Sonido

Diseño sonoro **funcional y mínimo**, con tres decisiones justificadas:

1. **Sin música de fondo por defecto.** El contexto de uso real (biblioteca, aula, transporte) es mayoritariamente silenciado, y la música compite por carga cognitiva en una tarea de razonamiento (coherente con Doc. 1, §4.1). Existe una capa ambiental opcional, desactivada por defecto.
2. **Paleta de UI reducida:** confirmación de eslabón (neutra, breve), cierre de informe (cadencia cálida), credencial (sello discreto). **El error no tiene sonido punitivo** — a lo sumo la misma señal neutra de "atención" que cualquier apertura de tarjeta: sonorizar el fallo como castigo contradiría el pilar 2 (§1.4).
3. **El audio nunca es canal único de información** (accesibilidad, §4.5): todo lo sonoro tiene manifestación visual.

---

### 6. Narrativa y voces del mundo

#### 6.1. Marco narrativo

**Premisa:** el Analista acaba de incorporarse al **Gabinete de Análisis Económico de la República de Cordavia**, un país ficticio de economía reconocible. Cada escenario llega como memo del gabinete; cada cierre produce un Informe que "se archiva" en el Expediente. La ficción es un contenedor ligero: da continuidad y tono, pero jamás introduce contenido económico propio — todo hecho económico proviene del EKG.

**Por qué país ficticio:** usar una economía real obligaría a tomar partido sobre datos y políticas reales y contaminaría el modelo con expectativas de actualidad. Cordavia permite neutralidad política deliberada: los escenarios presentan políticas de todo signo (expansivas y contractivas, fiscales y monetarias) con el mismo tratamiento analítico, sin valorar ideológicamente ninguna — requisito para uso universitario plural.

**La narrativa no es progresión.** No hay "historia que avanza" ni finales: la única progresión es la del dominio del Analista. Esto es deliberado: una trama con estados bloqueados entraría en conflicto con la libre selección de escenarios (autonomía, Doc. 1, §7.1) y con el rejugado que exige la práctica espaciada (Doc. 1, §8.1).

#### 6.2. Voces institucionales (sin personajes antropomórficos)

**Decisión de diseño: los agentes económicos no se personifican.** No hay personajes con nombre, rostro ni personalidad individual. Cada agente (Doc. 2, §3) se representa como **institución o sector agregado**, con emblema propio (§5.2) y una *voz institucional* que firma comunicados. Esta decisión tiene una justificación pedagógica, además de estética: personificar a "Hogares" o "Empresas" en un individuo refuerza exactamente la confusión que el Nivel 0 combate — tratar agregados macroeconómicos como si fueran decisiones de una persona concreta. La voz institucional mantiene al estudiante razonando en el nivel de abstracción correcto del modelo. Beneficios secundarios: menor alcance de arte y guion, y mayor coherencia con la sobriedad del pilar 4 (§1.4).

| Voz institucional | Agente | Función narrativa | Registro de escritura |
|---|---|---|---|
| **Banco Central de Cordavia** | Banco Central | Comunicados de política monetaria; en Nivel V con Regla de Taylor activa, sus decisiones pasan a comportamiento reglado (Doc. 2, §7.2) | Comunicado oficial: preciso, lacónico |
| **Ministerio de Hacienda** | Gobierno | Anuncios de política fiscal y presupuesto | Boletín oficial: formal, con urgencia política |
| **Cámara de Industria y Comercio** | Empresas | Encuestas de inversión, producción y empleo del sector | Informe gremial: pragmático |
| **Observatorio de Consumo de los Hogares** | Hogares | Indicadores agregados de consumo, ahorro y expectativas | Nota estadística: concreta, cotidiana en sus ejemplos |
| **Asociación de Banca de Cordavia** | Sistema financiero | Reportes de crédito y tasas de mercado | Circular técnica: cauta |
| **Boletín de Comercio Exterior** | Sector externo | Inactivo en IS-LM (como su agente, Doc. 2, §3); comienza a publicarse al activar Mundell-Fleming | Despacho informativo: neutro |

Los memos de escenario, las reacciones en la simulación de Nivel V y las fichas del panel de agentes se atribuyen siempre a estas voces institucionales, nunca a individuos. Regla de guion: las voces reportan *decisiones y reacciones del agente*, nunca explican el mecanismo por el estudiante — explicar es trabajo del Analista; corregir, del ATE con contenido del EKG.

#### 6.3. Tono y redacción

Registro sobrio con calidez: segunda persona, frases cortas, cero condescendencia. Los memos plantean el problema con lenguaje profesional accesible; las correcciones jamás usan reproche ("revisemos esta relación" y no "te equivocaste"). Toda la redacción de contenido pasa por la revisión pedagógica del proceso de curación (Doc. 2, §11.3).

---

### 7. Arquitectura de software

#### 7.1. Visión general

La arquitectura implementa literalmente el mapa del Documento 0, §2, y hereda sus reglas de dependencia (§4) como restricciones verificables en revisión de código:

```
+-------------------------------+      +------------------------------+
|  PolicyLab (cliente web SPA)  |      |  Panel Docente (mismo        |
|  TypeScript + React           |      |  cliente, rol distinto)      |
+---------------+---------------+      +---------------+--------------+
                |            HTTPS / JSON (API de Causeway)
+---------------v------------------------------------------v-----------+
|  CAUSEWAY — backend de orquestación (monolito modular)               |
|                                                                       |
|   +-------------+  +-------------+  +-------------+  +------------+  |
|   | módulo CRE  |  | módulo ATE  |  | módulo LSM  |  | módulo     |  |
|   | (validación |  | (andamiaje, |  | (estado del |  | contenido  |  |
|   |  de caminos,|  |  timing de  |  |  aprendiz,  |  | (carga y   |  |
|   |  clasific.  |  |  feedback,  |  |  patrones,  |  |  sirve el  |  |
|   |  de errores,|  |  selección  |  |  agregados  |  |  EKG       |  |
|   |  propagac.) |  |  de escen.) |  |  docentes)  |  |  publicado)|  |
|   +-------------+  +-------------+  +-------------+  +-----+------+  |
|         sin estado      consulta CRE y LSM    PostgreSQL    |        |
+---------------------------------------------------------------------+
                                                              | carga bundles
                                              +---------------v------------+
                                              | Repositorio de contenido    |
                                              | EKG (YAML/JSON en git),     |
                                              | CI valida contra CKS        |
                                              | (JSON Schema) y publica     |
                                              | bundles versionados         |
                                              +------------------------------+
```

#### 7.2. Monolito modular, no microservicios (justificación)

Se evaluaron dos topologías para Causeway. **Microservicios** (CRE, ATE, LSM como servicios independientes) ofrecen despliegue y escalado separados, pero imponen costos que este proyecto no puede pagar en su fase actual: operación distribuida con un equipo pequeño, latencia entre servicios en un loop (validar eslabón — clasificar error — decidir feedback) que debe responder en interacción humana, y fronteras difíciles de mover cuando el diseño aún evoluciona. **Monolito modular** (un solo despliegue, módulos con fronteras estrictas que espejan los componentes del Documento 0) mantiene la separación conceptual — verificable con reglas de importación en CI: el módulo CRE no puede importar del ATE, ninguno puede importar del EKG como código, etc. (Doc. 0, §4) — con la operación de un solo sistema. Se adopta el monolito modular; la extracción futura de un módulo a servicio (p. ej. si otra aplicación de la plataforma necesita solo el CRE) queda habilitada precisamente por esas fronteras.

#### 7.3. Esquema de datos del contenido (cumple Doc. 2, referencias pendientes)

El CKS se materializa como un conjunto de JSON Schema versionados. Fragmentos ilustrativos de las dos estructuras que el Documento 2 dejó pendientes (§5.1 relación; §9 evento) — el esquema completo es entregable de la fase F0:

```json
// cks/relacion.schema.json (fragmento)
{
  "$id": "cks/relacion/v1",
  "type": "object",
  "required": ["id", "origen", "destino", "polaridad",
               "modelos_validos", "explicacion_si_error"],
  "properties": {
    "id":                 { "type": "string" },
    "origen":             { "$ref": "cks/variable-ref/v1" },
    "destino":            { "$ref": "cks/variable-ref/v1" },
    "polaridad":          { "enum": ["positiva", "negativa"] },
    "fuerza_cualitativa": { "enum": ["fuerte", "moderada", "condicional"] },
    "modelos_validos":    { "type": "array", "items": { "type": "string" },
                            "minItems": 1 },
    "supuestos_requeridos": { "type": "array",
                              "items": { "$ref": "cks/supuesto-ref/v1" } },
    "explicacion_si_error": { "type": "string", "minLength": 40 },
    "explicaciones_distractoras": {
      "type": "array", "items": { "type": "string" },
      "description": "Opciones para la re-explicación estructurada (§2.2)"
    }
  }
}
```

```json
// cks/evento.schema.json (fragmento)
{
  "$id": "cks/evento/v1",
  "type": "object",
  "required": ["id", "nombre", "familia", "agente_origen",
               "variables_afectadas"],
  "properties": {
    "id":            { "type": "string" },
    "nombre":        { "type": "string" },
    "familia":       { "enum": ["fiscal", "monetaria",
                                "choque_externo", "choque_expectativas"] },
    "agente_origen": { "$ref": "cks/agente-ref/v1" },
    "variables_afectadas": {
      "type": "array", "minItems": 1,
      "items": {
        "type": "object",
        "required": ["variable", "direccion", "magnitud_cualitativa"],
        "properties": {
          "variable":  { "$ref": "cks/variable-ref/v1" },
          "direccion": { "enum": ["sube", "baja"] },
          "magnitud_cualitativa": { "enum": ["leve", "moderada", "fuerte"] }
        }
      }
    },
    "modelos_disponibles": { "type": "array", "items": { "type": "string" } }
  }
}
```

Notas de diseño: (a) `explicacion_si_error` es obligatoria con longitud mínima — el esquema fuerza el requisito pedagógico central del proyecto; (b) los identificadores usan referencias (`variable-ref`) validadas contra el catálogo de variables, lo que automatiza el control de duplicados previsto en Doc. 2, §4.3; (c) todo bundle publicado lleva versión semántica y el LSM registra con qué versión de contenido se produjo cada interacción (reproducibilidad de la retroalimentación, Doc. 2, §8.2).

#### 7.4. Base de datos

**PostgreSQL** como única base operacional, con dos áreas:

- **Plataforma:** cuentas, roles (analista/docente), cursos, sesiones, configuración de curso (qué modelos y umbrales del ATE están activos).
- **LSM:** registro *append-only* de eventos de interacción (eslabón propuesto, resultado de validación, tipo de error, pista usada, escenario cerrado — cada uno con versión de EKG y timestamp) más tablas de agregados derivados (dominio por mecanismo, patrones de error, vistas del panel docente). El registro inmutable de eventos es la base de la evaluación sigilosa (Doc. 1, §9.1): permite recalcular cualquier métrica futura sin haberla previsto, y auditar cómo se llegó a cada Informe.

**Por qué no una base de grafos (Neo4j o similar):** el grafo económico es pequeño (decenas a pocas centenas de nodos incluso con todos los modelos futuros), estático durante la sesión y se consulta como estructura completa, no con consultas parciales de gran escala. El CRE lo carga en memoria desde el bundle publicado y opera sobre él directamente; una base de grafos añadiría un sistema que operar sin ninguna consulta que lo justifique. El contenido, además, ya vive versionado en git (Doc. 2, §11.2) — la "base de datos del conocimiento" es el repositorio, no un servidor.

#### 7.5. Plataforma de cliente ("motor de juego" recomendado)

Se evaluaron tres opciones contra los requisitos reales del producto — interfaz densa en texto, visualización de grafos, formularios y paneles, acceso sin fricción para cohortes universitarias, accesibilidad AA, integración con API y con LMS:

| Criterio | Unity (WebGL) | Godot (export web) | Web nativo (TypeScript + React + SVG) |
|---|---|---|---|
| Acceso sin instalación | Sí, pero cargas iniciales pesadas (decenas de MB) | Sí, más ligero que Unity | Sí, carga de una SPA convencional |
| Texto, formularios, i18n | Débil (render propio, no DOM) | Débil | Nativo del navegador |
| Accesibilidad (lector de pantalla, teclado, WCAG) | Muy limitada en canvas | Muy limitada | Plena (DOM semántico + ARIA) |
| Visualización del grafo causal | Potente pero artesanal | Potente pero artesanal | SVG con layouts autorados; sobrada para grafos de este tamaño |
| Animación rica / "juice" | Excelente | Buena | Suficiente (bibliotecas de animación web); requiere más oficio manual |
| Integración API / LTI / LMS | Incómoda | Incómoda | Directa |
| Perfil de equipo requerido | Especialistas de motor | Especialistas de motor | Desarrolladores web (perfil más disponible) |

**Recomendación: cliente web nativo** — TypeScript + React, grafo en SVG con layouts autorados por escenario (los mecanismos son cadenas y DAGs pequeños; un layout curado es más legible que cualquier disposición automática por fuerzas, que introduce ruido visual sin valor pedagógico), animación con una biblioteca declarativa estándar. Unity/Godot solo serían defendibles si el producto pivotara hacia simulación visual 3D/tiempo real, que no está en ninguna fase del roadmap. Esta decisión es coherente con el pilar de acceso (§1.3) y con la accesibilidad como requisito (§4.5).

#### 7.6. Diseño modular y escalabilidad

- **Escalar contenido** (nuevos modelos económicos): publicar una nueva versión del bundle EKG que pase la CI contra el CKS y el proceso de curación (Doc. 2, §7.3 y §11.3). Cero cambios en Causeway ni en PolicyLab, salvo contenido de presentación (iconos de variables nuevas).
- **Escalar dominio** (más allá de la economía): un nuevo grafo conforme al CKS + una nueva aplicación cliente (o una configuración de PolicyLab). El criterio de validación de generalidad es el del Documento 0, §5, y no forma parte del alcance de este documento.
- **Escalar carga** (más cursos y universidades): el CRE es sin estado y el ATE casi sin estado (lee LSM): Causeway escala horizontalmente detrás de un balanceador con PostgreSQL gestionado. Para las cohortes previstas (cientos a pocos miles de usuarios concurrentes) esto es holgado.
- **Escalar equipo:** las fronteras de módulo (§7.2) permiten que contenido (economistas), tutor (diseño instruccional + backend) y cliente (frontend) avancen en paralelo con contratos estables.

#### 7.7. Contrato de API e integración académica

Superficie mínima de la API de Causeway que PolicyLab consume (nombres ilustrativos):

```
POST /sesiones/{id}/escenarios/{eid}/eslabones   — veredicto del CRE +
                                                    directiva de feedback del ATE
POST /sesiones/{id}/escenarios/{eid}/cierre       — Informe de Razonamiento
GET  /analistas/{id}/tablero                      — dominio, recomendación,
                                                    notas de gabinete
GET  /cursos/{id}/panel                           — agregados docentes (rol docente)
GET  /contenido/{version}/escenarios—             — bundles del EKG publicados
```

Regla heredada del Documento 0, §4: el cliente jamás valida razonamiento localmente — toda validación viaja a Causeway, garantizando una sola fuente de verdad pedagógica y económica. **Integración LMS:** soporte de **LTI 1.3** para lanzamiento desde Moodle/Canvas con identidad de curso, de modo que el docente no gestione cuentas manualmente; la exportación de resultados al libro de calificaciones queda deliberadamente fuera del MVP (PolicyLab no califica personas, §3.2) y se decidirá con los docentes del piloto.

---

### 8. Plan de producción

#### 8.1. MVP

**Incluye:** Niveles 0, I y II completos con el EKG de IS-LM (política monetaria y fiscal básicas, ~12–16 escenarios curados); constructor causal con las mecánicas de eslabón, bandeja, re-explicación estructurada y eslabón omitido; capas de retroalimentación 1 y 2; Informe de Razonamiento y Expediente; Índice de Dominio y las cuatro primeras credenciales; Tablero con recomendación básica del ATE (progresión por dominio + interleaving simple); acceso institucional + LTI 1.3; registro completo de eventos en LSM.

**Excluye (con fase asignada):** Niveles III–V (F4 y posterior); panel docente completo (beta en F3); pistas bajo demanda (F4, entran con Nivel III); autoexplicación libre (F3, con el panel que la hace útil); AD-AS y modelos posteriores (F4+); capa sonora ambiental; exportación a libro de calificaciones.

Criterio de corte: el MVP debe bastar para el piloto de validación externa del Documento 1, §10 — medir si estudiantes reales aprenden mecanismos de transmisión — no para desplegar el producto completo.

#### 8.2. Roadmap y cronograma (18 meses)

| Fase | Meses | Entregables | Hito de salida |
|---|---|---|---|
| **F0 — Preproducción** | 1–2 | CKS v1 (JSON Schema completo); EKG IS-LM v0 validado por economista revisor; diseño de alta fidelidad de W1–W3; arquitectura de Causeway y CI de contenido operativa | El primer escenario "en papel" es jugable en prototipo de diseño y su contenido pasa la CI |
| **F1 — Corte vertical** | 3–5 | Nivel I jugable de punta a punta: cliente + CRE + ATE mínimo + LSM registrando; las cinco tipologías de error clasificadas y con corrección | Prueba de usabilidad con 8–10 estudiantes; decisión go/no-go sobre el constructor causal |
| **F2 — MVP** | 6–10 | Alcance completo de §8.1; pruebas de contenido con docentes; accesibilidad AA auditada | MVP estable en staging con el set completo de escenarios 0–II |
| **F3 — Piloto de validación** | 11–12 | Piloto con al menos un grupo de curso real: diseño pre/post con instrumento externo de conceptos macro (Doc. 1, §10); panel docente beta; autoexplicación libre | Informe de resultados del piloto: evidencia de aprendizaje transferible y lista de correcciones |
| **F4 — Expansión** | 13–18 | Niveles III–IV; pistas bajo demanda; panel docente completo; segundo modelo económico (AD-AS) publicado vía checklist del Doc. 2, §7.3 — primera prueba real de la escalabilidad de contenido | Release 1.0 para adopción en más cursos |
| **Post-1.0 (investigación)** | 18+ | Nivel V (simulación por turnos); Mundell-Fleming; exploración del segundo dominio del programa (criterio del Doc. 0, §5) | Línea de investigación continua |

El Nivel V se sitúa deliberadamente después del 1.0: es el componente de mayor riesgo técnico y de contenido (Doc. 2, §10, simulación abierta) y ninguna evidencia del piloto depende de él.

#### 8.3. Equipo mínimo

1 líder técnico/backend (Causeway, CRE), 1 desarrollador/a frontend (PolicyLab), 1 diseñador/a UX-UI, 1 economista de contenido (media jornada, autoría y revisión del EKG), 1 diseñador/a instruccional (media jornada, ATE y curación pedagógica), 1 responsable de proyecto/investigación (dirección del piloto). Roles de refuerzo en F4: segundo perfil frontend y apoyo de QA.

#### 8.4. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| **Cuello de botella de autoría:** la calidad depende de explicaciones de error autoradas por expertos, que son lentas de producir | Alta | Alto | Plantillas de autoría por tipo de error; la CI exige `explicacion_si_error` desde el primer escenario (el esquema lo fuerza, §7.3); presupuesto de horas de economista desde F0, no "cuando haga falta" |
| **El constructor causal no se entiende** (la interacción central resulta confusa en móvil) | Media | Crítico | Es exactamente lo que F1 valida con usuarios reales antes de construir el resto; criterio go/no-go explícito |
| **Ensayo y error mecánico** en lugar de razonamiento | Media | Alto | Mitigaciones de §2.3 (ponderación de primer intento, distractores, re-explicación); el LSM lo detecta y el piloto lo mide |
| **El piloto no muestra transferencia** (mejoran en el juego, no en el instrumento externo) | Media | Alto para la línea de investigación | El diseño ya separa in-game de validación externa (Doc. 1, §10); un resultado negativo es hallazgo publicable y dirige la revisión del diseño — el riesgo real sería no medirlo |
| **Sobrealcance del Nivel V** arrastra al resto del proyecto | Media | Medio | Nivel V fuera del 1.0 por roadmap; cualquier adelanto requiere revisión de este documento |
| **Deuda de accesibilidad** descubierta tarde | Media | Medio | AA como criterio de aceptación por historia de usuario desde F1, auditoría en F2 |
| **Dependencia de personas clave** (economista único) | Media | Medio | Proceso de curación con revisor externo (Doc. 2, §11.3) y contenido versionado en git legible por terceros |
| **Fricción institucional LMS/datos de estudiantes** | Baja | Medio | LTI 1.3 estándar; minimización de datos (el LSM solo guarda interacción de aprendizaje, Doc. 0, §3.5); acuerdo de datos con la universidad antes del piloto |

#### 8.5. Métricas de diseño (telemetría de producto, no de aprendizaje)

Complementarias a los indicadores pedagógicos del Documento 1, §10: tasa de abandono tras primer error (<15% objetivo, §2.3), tiempo hasta el primer eslabón en el primer escenario (fricción de arranque), uso del panel de agentes por nivel, tasa de finalización de Informes leídos vs. saltados. Ninguna de estas métricas alimenta el Índice de Dominio ni credenciales.

---

### 9. Tecnologías recomendadas (resumen)

| —rea | Recomendación | Justificación principal |
|---|---|---|
| Cliente | TypeScript, React, SVG para el grafo, biblioteca declarativa de animación | §7.5: acceso, accesibilidad, perfil de equipo |
| Backend (Causeway) | Monolito modular; lenguaje con tipado fuerte según equipo (TypeScript/Node o Python tipado) | §7.2; fronteras de módulo verificables en CI |
| Persistencia | PostgreSQL (plataforma + LSM con registro append-only) | §7.4 |
| Contenido | EKG en YAML/JSON, git, CI con validación JSON Schema (CKS) y publicación de bundles versionados | §7.3; Doc. 2, §11.2 |
| Integración académica | LTI 1.3 | §7.7 |
| Calidad | Reglas de importación entre módulos en CI (Doc. 0, §4); pruebas del CRE con grafos sintéticos sin vocabulario económico (verifica la regla de genericidad) | Doc. 0, §4.1 |

---

### 10. Cierre de referencias cruzadas

Este documento salda las referencias pendientes declaradas por los documentos anteriores:

- **Doc. 1 — progresión:** retiro de andamiaje implementado como regla de sistema del ATE con traducción de interfaz (§3.1). ✓
- **Doc. 1 — logros:** credenciales sin tiempo/volumen/rachas; exclusiones verificables (§3.2, §3.3). ✓
- **Doc. 1 — UX de retroalimentación:** tres componentes de interfaz diferenciados (§3.5). ✓
- **Doc. 1 — roadmap:** piloto de validación externa como fase F3 con instrumento pre/post (§8.2). ✓
- **Doc. 2 — arquitectura:** JSON Schema de relación y evento (§7.3). ✓
- **Doc. 2 — UI de supuestos:** chips persistentes con explicación y vínculo al error (§4.4). ✓
- **Doc. 0 — nomenclatura y dependencias:** aplicadas en todo el documento; PolicyLab consume Causeway y no reimplementa motores (§7.1, §7.7). ✓

**Referencias pendientes que este documento abre (documento técnico de implementación):** CKS completo con todos los esquemas (§7.3); fórmula calibrada del Índice de Dominio (§3.2); especificación de la simulación por turnos del Nivel V (§2.2), incluyendo agentes con regla de reacción (Regla de Taylor, Doc. 2, §7.2).

---

### 11. Marcos de referencia utilizados

Además de los marcos pedagógicos y económicos heredados de los Documentos 1 y 2, este documento emplea: el marco MDA (Hunicke, LeBlanc & Zubek) como vocabulario de mecánicas/dinámicas; las heurísticas de usabilidad de Nielsen y WCAG 2.2 AA como criterios de UX y accesibilidad; la arquitectura clásica de Sistemas Tutores Inteligentes (vía Documento 0) como patrón estructural; y prácticas estándar de la industria — contenido dirigido por datos (*data-driven content*), monolito modular con fronteras verificadas, registro de eventos inmutable para analítica — sin proponer metodologías nuevas: el aporte propio es, de nuevo, la integración específica sobre la arquitectura CMR.

---

### 12. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-01 | Publicación inicial |
