# Documento 2 — Diseño Económico
## Arquitectura Conceptual del Motor Económico del Videojuego

---

### 0. Ficha del documento

| Campo | Descripción |
|---|---|
| **Pregunta que responde** | ¿Cómo funciona la economía dentro del videojuego? |
| **Audiencia principal** | Arquitectos de software, ingenieros de gameplay, economistas colaboradores, diseñadores de contenido |
| **Relación con Documento 1 (Pedagógico)** | El Documento 1 define *cómo se enseña y se evalúa* el razonamiento del estudiante. Este documento define *qué relaciones causales existen* y *bajo qué condiciones son válidas* — es decir, el material sobre el que opera la evaluación pedagógica. Cada nivel cognitivo del Documento 1 (relación simple, mecanismo completo, interacción de políticas, diagnóstico, simulación) se apoya en una estructura específica de este grafo, referenciada en la sección 6 y 10. |
| **Relación con Documento 3 (GDD)** | El Documento 3 traduce las entidades definidas aquí (agentes, variables, eventos, escenarios) en pantallas, mecánicas y sistemas de software concretos. La arquitectura de software del motor económico (sección 5 del GDD) implementa literalmente el modelo conceptual descrito aquí. |
| **Alcance** | Arquitectura conceptual: entidades, relaciones, reglas de composición y reglas de extensión. |
| **Fuera de alcance** | Ecuaciones completas, calibración numérica, código de producción. Estos se desarrollan en un documento técnico posterior de implementación, una vez validada esta arquitectura. |

---

### 1. Principios de diseño

Antes de describir las entidades del sistema, se explicitan los principios que gobiernan las decisiones de arquitectura de este documento, porque de ellos depende toda decisión posterior.

**1.1. El conocimiento económico se modela como grafo causal dirigido, no como árbol de decisión ni como máquina de estados.**

Se evaluaron tres alternativas:

- *Árbol de decisión* (cada escenario tiene una secuencia fija de opciones correcta/incorrecta): fácil de implementar, pero no representa que una misma variable pueda ser afectada por múltiples causas ni que un efecto se propague en cascada. Además, un árbol nuevo por escenario no escala: cada modelo nuevo multiplicaría el contenido a mano sin reutilización.
- *Máquina de estados finitos* (el "estado de la economía" transiciona según eventos): representa bien la evolución temporal, pero no representa explícitamente el *razonamiento* del estudiante sobre por qué una variable afecta a otra, que es el objetivo pedagógico central del proyecto (Documento 1, sección "evaluación paso a paso").
- *Grafo causal dirigido y ponderado* (nodos = variables, aristas = relaciones causales con dirección, condición de validez y polaridad): permite representar múltiples caminos, reutilizar relaciones entre escenarios y modelos, y evaluar al estudiante sobre la *estructura del razonamiento* (qué nodo eligió después de cuál), no solo sobre un resultado final.

Se adopta el grafo causal dirigido porque es la única de las tres alternativas que satisface simultáneamente el requisito pedagógico ("evaluar el razonamiento paso a paso") y el requisito de escalabilidad ("incorporar nuevos modelos sin modificar la estructura principal"). Esta decisión es el eje de todo el documento.

**1.2. Un modelo económico (IS-LM, AD-AS, etc.) no es un grafo separado: es un *perfil de validez* sobre un único grafo compartido.**

La alternativa de crear un grafo independiente por modelo se descarta porque produciría duplicación de variables (la inversión existe en IS-LM, en Mundell-Fleming y en Solow) y porque dificultaría enseñar cómo un modelo *extiende* al anterior, que es justamente el valor pedagógico de mostrar la progresión IS-LM — AD-AS — Mundell-Fleming. El detalle de este mecanismo se desarrolla en la sección 7.

**1.3. Separación estricta entre motor y contenido.**

El motor de evaluación (cómo se recorre y valida el grafo) es agnóstico al contenido económico específico. El contenido (qué variables existen, qué aristas hay, qué escenarios se definen) vive en una base de conocimiento versionada, independiente del código del motor (sección 11). Esto es una práctica estándar en sistemas de tutoría inteligente y en motores de juego basados en datos (*data-driven design*): permite que un economista amplíe el contenido sin tocar código, y que el motor se pruebe una sola vez de forma exhaustiva.

**1.4. Toda relación causal declara explícitamente sus supuestos.**

Ninguna arista del grafo es "verdadera en general". Toda arista es verdadera *bajo ciertos supuestos* (precios fijos, economía cerrada, expectativas estáticas, etc.). Esto es lo que permite que el mismo par de variables tenga relaciones distintas en modelos distintos sin contradicción — el sistema no dice "A causa B", dice "A causa B *cuando* se cumplen los supuestos X".

---

### 2. Arquitectura conceptual en capas

El motor económico se organiza en cinco capas, cada una construida sobre la anterior:

```
Capa 5 — ESCENARIOS
          (combinaciones de eventos + condiciones iniciales + objetivo pedagógico)
                              ↑ se construyen con
Capa 4 — EVENTOS Y POLÍTICAS
          (disparadores que alteran variables: fiscales, monetarias, choques externos)
                              ↑ actúan sobre
Capa 3 — MECANISMOS DE TRANSMISIÓN
          (caminos ordenados dentro del grafo causal)
                              ↑ compuestos por
Capa 2 — GRAFO CAUSAL
          (variables como nodos, relaciones como aristas con condiciones de validez)
                              ↑ pertenecen a
Capa 1 — AGENTES ECONÓMICOS
          (quién controla o es afectado por cada variable)
```

Esta separación en capas es la que permite que "incorporar un nuevo modelo" (Documento del prompt original, requisito de escalabilidad) signifique *añadir nodos y aristas nuevas a la Capa 2*, sin tocar las capas 3, 4 y 5 salvo para extender contenido. La lógica de mecanismos, eventos y escenarios es genérica y opera sobre cualquier grafo válido.

---

### 3. Agentes económicos

Los agentes son las entidades que controlan, originan o reciben el efecto de las variables. Modelarlos explícitamente cumple dos funciones: (a) ayuda al estudiante a entender *quién decide qué* — un error conceptual frecuente en estudiantes principiantes es no distinguir política fiscal de política monetaria por no saber qué agente la ejecuta —, y (b) determina qué acciones puede tomar el jugador frente a cuáles son exógenas al escenario.

| Agente | Rol conceptual | Variables típicas que controla | Variables que recibe (afectan sus decisiones) |
|---|---|---|---|
| **Banco Central** | Ejecuta política monetaria | Oferta monetaria (control directo en el modelo IS-LM base); tasa de interés de referencia (control directo solo bajo Regla de Taylor activa — ver nota bajo la tabla) | Inflación, producción, expectativas |
| **Gobierno** | Ejecuta política fiscal | Gasto público, impuestos | Déficit, deuda, ciclo económico |
| **Empresas** | Deciden producción e inversión | Inversión, producción, empleo | Tasa de interés, demanda esperada, costos |
| **Hogares** | Deciden consumo y ahorro | Consumo, ahorro, oferta de trabajo | Ingreso, tasa de interés, expectativas |
| **Sistema financiero** | Intermedia entre ahorro e inversión | Crédito, tasas de mercado | Tasa de referencia del Banco Central, riesgo |
| **Sector externo** | Introduce relaciones con el resto del mundo | Tipo de cambio, flujos de capital, exportaciones netas | Tasa de interés doméstica vs. externa, términos de intercambio |

En la versión IS-LM (cerrada, corto plazo) el **Sector externo** puede mantenerse presente en el grafo pero *inactivo* (sin aristas habilitadas), de modo que al activar Mundell-Fleming no se introduce un agente nuevo sino que se habilitan relaciones ya previstas. Esto es consistente con el principio 1.2.

De forma análoga, la variable de control directo del **Banco Central** depende del régimen monetario activo, no es fija. En el modelo IS-LM base, el Banco Central controla la oferta monetaria; la tasa de interés es una variable **endógena**, determinada por el equilibrio del mercado de dinero (mecanismo completo en §5.2: un aumento de la oferta monetaria reduce la tasa de interés de equilibrio). Solo bajo una Regla de Taylor activa (§7.2) la tasa de interés de referencia pasa a ser la variable que el Banco Central fija directamente, y su rol cambia de "agente controlado por el jugador" a "agente con regla de reacción". La tabla anterior lista ambas variables en la misma celda porque el catálogo de agentes es un catálogo fijo compartido por todos los regímenes (§7.1); no implica que el Banco Central controle ambas a la vez en un mismo perfil de modelo.

Una aclaración análoga aplica a **"expectativas"**, que aparece en la columna "recibe" del **Banco Central** y de los **Hogares**. Figura ahí porque el catálogo de agentes es fijo y compartido entre regímenes (§7.1) —igual que en los dos casos anteriores—, pero en el modelo **IS-LM base "expectativas" no es una variable del grafo**: está modelada como *supuesto* (`expectativas_estaticas`, Doc. 3 §4.4), no como nodo con `tipo` y `naturaleza` según §4.1–§4.2. Bajo ese supuesto las expectativas son constantes por definición, de modo que un nodo "expectativas" contradiría el supuesto que lo habilita. Entran al grafo como variable(s) **específica(s)** —p. ej. inflación esperada, tipo de cambio esperado, no un nodo genérico "expectativas"— únicamente en los modelos que relajan ese supuesto (§7: AD-AS, Curva de Phillips, Regla de Taylor), que es lo que la familia de eventos "choques de expectativas" de §9 presupone. La decisión de curación correspondiente está documentada en `ekg-macro/README.md` (secciones "Historial de curación heredado" y "Cierre de la reserva del punto 4") y en `causeway/consultas/consulta-externa-expectativas-2026-08-04.md`.

**Nivel 0 del juego** (Documento 1) se apoya directamente en esta capa: su objetivo es que el estudiante identifique agentes y qué controla cada uno, antes de razonar sobre relaciones causales entre variables.

---

### 4. Variables económicas: taxonomía

No se listan aquí todas las variables de todos los modelos futuros (eso corresponde a la base de conocimiento, sección 11), sino la **taxonomía** que toda variable debe cumplir para poder incorporarse al grafo.

**4.1. Por origen causal**

- **Variables de política (exógenas / controlables):** las decide un agente directamente. Ej.: oferta monetaria, gasto público, impuestos. Son el punto de entrada de casi todo escenario.
- **Variables endógenas intermedias:** resultan de otras variables dentro del mecanismo de transmisión. Ej.: tasa de interés, inversión, tipo de cambio.
- **Variables de resultado (indicadores macro):** son los efectos finales que el estudiante debe explicar. Ej.: producción, ingreso, empleo, nivel de precios.

**4.2. Por naturaleza**

- **Stock** (medidas en un punto del tiempo: oferta monetaria, deuda pública).
- **Flujo** (medidas por período: inversión, consumo, exportaciones).
- **Precio/tasa** (tasa de interés, tipo de cambio, nivel de precios).

Esta distinción no es decorativa: es la que en el futuro (Documento técnico de implementación) determinará cómo se anima y visualiza cada variable en el GDD (un stock se representa como nivel/barra; un flujo, como una tasa de cambio o velocidad; ver Documento 3, sección UI).

**4.3. Metadato obligatorio de toda variable**

Toda variable, para poder incorporarse al grafo, debe declarar: nombre, agente(s) relacionado(s), tipo (política / endógena / resultado), naturaleza (stock / flujo / precio), y el o los modelos en los que existe. Esta ficha mínima es lo que permite validar automáticamente si una variable nueva (al incorporar, por ejemplo, Solow) es realmente nueva o es una variable existente reutilizada bajo otro nombre — error común al ampliar contenido con múltiples colaboradores.

---

### 5. El grafo causal de conocimiento económico

Este es el núcleo del sistema. Cada arista del grafo no es solo "A afecta a B": es una afirmación económica completa con condiciones de validez.

**5.1. Estructura conceptual de una arista**

Una relación causal se define conceptualmente con estos campos (se muestra como esquema ilustrativo, no como código de producción):

```
Relación:
  origen: <variable>
  destino: <variable>
  polaridad: positiva | negativa
  fuerza_cualitativa: fuerte | moderada | condicional
  modelos_validos: [IS-LM, AD-AS, ...]
  supuestos_requeridos: [precios_fijos, economia_cerrada, ...]
  explicacion_si_error: texto que el sistema muestra cuando el estudiante
                         propone esta relación en un contexto donde no aplica
```

El campo `explicacion_si_error` es lo que operacionaliza el requisito pedagógico central del proyecto ("cuando el estudiante se equivoque, el sistema debe explicar por qué la relación causal seleccionada no corresponde al modelo económico"): la explicación no se genera dinámicamente en tiempo de juego, se autora junto con la relación, porque una explicación económicamente precisa requiere criterio experto, no solo lógica de grafo.

**5.2. Ejemplo ilustrativo (IS-LM, política monetaria expansiva)**

Usando el ejemplo del planteamiento original del proyecto, el mecanismo se representa como una cadena de aristas del grafo:

```
Oferta monetaria
   ↓ (polaridad negativa, fuerte, IS-LM)
Tasa de interés
   ↓ (polaridad negativa, fuerte, IS-LM)
Inversión
   ↓ (polaridad positiva, fuerte, IS-LM)
Demanda agregada
   ↓ (polaridad positiva, fuerte, IS-LM)
Producción
   ↓ (polaridad positiva, fuerte, IS-LM)
Ingreso
   ↓ (polaridad positiva, moderada, IS-LM)
Consumo
```

Cada flecha de este diagrama es, en el grafo, una arista independiente con su propio metadato. Esto permite que el motor detecte con precisión en qué eslabón específico se equivocó el estudiante (Documento 1: "evaluar el razonamiento paso a paso, no únicamente la respuesta final"), en vez de solo validar si llegó al nodo final correcto.

**5.3. Multiplicidad de caminos válidos**

Un riesgo identificado en la valoración previa del proyecto es que la economía real admite más de un camino causal defendible según los supuestos activos. La arquitectura lo resuelve así: el grafo no exige un único camino correcto por escenario, sino que valida si la secuencia propuesta por el estudiante es un **camino consistente** dentro del subgrafo habilitado por el modelo y los supuestos del escenario. Dos secuencias distintas pueden ser ambas válidas si ambas respetan polaridad y condiciones; el sistema debe aceptar cualquier camino que sea consistente, no solo el que el diseñador tenía "en mente". Esto se traduce en un requisito de implementación explícito para el Documento técnico posterior: el evaluador debe operar por *validación de consistencia de camino*, no por *comparación exacta contra una respuesta modelo*.

**5.4. Control de ciclos**

El grafo permite ciclos de retroalimentación reales de la economía (ej.: ingreso — consumo — demanda agregada — producción — ingreso). Para que el motor de propagación no entre en bucles infinitos, toda propagación automática de efectos (fuera de la interacción explícita del estudiante) debe ejecutarse con un número máximo de iteraciones o hasta alcanzar una condición de variación marginal decreciente ("estado aproximadamente estable"). Esta es una restricción técnica que el Documento de implementación debe heredar sin excepción.

---

### 6. Mecanismos de transmisión

Un **mecanismo de transmisión** es un camino ordenado y con sentido económico dentro del grafo, que conecta un evento inicial con uno o más efectos finales. No es una entidad nueva de datos: es una *vista* sobre secuencias del grafo, autorada y curada para tener valor pedagógico (no cualquier camino técnicamente válido en el grafo es un buen mecanismo para enseñar — algunos son triviales o irrelevantes).

Correspondencia directa con la progresión de niveles del Documento 1:

| Nivel (Doc. 1) | Unidad del grafo que se evalúa |
|---|---|
| Nivel I — Relaciones causales simples | Una sola arista |
| Nivel II — Mecanismos completos | Un camino completo (mecanismo de transmisión) |
| Nivel III — Interacción entre políticas | Dos o más mecanismos que comparten o convergen en nodos |
| Nivel IV — Diagnóstico macroeconómico | Recorrido inverso: dado un nodo de resultado, inferir el evento de origen más probable |
| Nivel V — Simulación de escenarios complejos | Subgrafo dinámico con múltiples eventos concurrentes y agentes reaccionando |

Esta tabla es la referencia cruzada explícita que el Documento 1 debe usar al diseñar la evaluación de cada nivel, y que el Documento 3 debe usar al diseñar las pantallas correspondientes.

---

### 7. Modelos económicos como perfiles de validez sobre el grafo

Este apartado resuelve directamente el requisito de "reglas para incorporar nuevos modelos" y "compatibilidad futura".

**7.1. Un modelo se define como:**
1. Un subconjunto de nodos habilitados.
2. Un subconjunto de aristas habilitadas (aquellas cuyo campo `modelos_validos` incluye ese modelo).
3. Un conjunto de supuestos activos que determinan cuáles aristas condicionales se habilitan o no.

**7.2. Matriz conceptual de compatibilidad**

| Modelo | Qué relaja o añade respecto al anterior | Agentes que activa/expande | Riesgo de conflicto con IS-LM |
|---|---|---|---|
| **IS-LM** (base) | — | Banco Central, Gobierno, Empresas, Hogares, Sistema financiero | — |
| **AD-AS** | Libera el supuesto de precios fijos; introduce nivel de precios como variable endógena | Ninguno nuevo | Alto: varias relaciones de IS-LM asumen precios fijos y deben reetiquetarse como "válidas solo en el corto plazo con AD-AS activo" |
| **Mundell-Fleming** | Añade sector externo y régimen cambiario (fijo/flexible) | Activa Sector externo | Medio: introduce nuevas aristas, pero no contradice las existentes si el sector externo estaba modelado como inactivo desde el inicio (sección 3) |
| **Curva de Phillips** | Vincula inflación y desempleo/producción | Ninguno nuevo | Bajo: extiende nodos de resultado, no reescribe mecanismos existentes |
| **Regla de Taylor** | Convierte la decisión del Banco Central de exógena a endógena (reacciona a inflación y brecha de producto) | Cambia el rol del Banco Central de "agente controlado por el jugador" a "agente con regla de reacción" | Medio: requiere que el sistema soporte agentes con comportamiento reglado, no solo variables controladas por el jugador — se documenta como extensión del modelo de agentes, no del grafo |
| **Solow** | Cambia el horizonte temporal (largo plazo) y elimina el supuesto de ciclo económico | Introduce variables de acumulación de capital y tecnología | Alto: varias variables de corto plazo (tasa de interés como estabilizador cíclico) pierden relevancia; se resuelve declarando el horizonte temporal como un supuesto más, igual que precios fijos |

**7.3. Checklist de incorporación de un modelo nuevo**

1. Identificar qué supuestos de los modelos existentes relaja, mantiene o contradice.
2. Listar variables nuevas y clasificarlas según la taxonomía de la sección 4.
3. Listar variables existentes que el modelo reutiliza sin cambios.
4. Para cada arista existente que un supuesto nuevo pueda invalidar, añadir la condición correspondiente en `supuestos_requeridos` (nunca eliminar la arista original: los modelos anteriores deben seguir funcionando).
5. Definir los eventos/políticas nuevos que habilita (sección 9).
6. Validar con al menos un economista revisor que los mecanismos nuevos sean pedagógicamente correctos antes de publicarlos en la base de conocimiento (sección 11).

Este checklist es lo que garantiza el requisito explícito del proyecto: "todo el diseño debe ser escalable para incorporar nuevos modelos sin modificar la estructura principal del juego." La estructura principal (grafo, capas, motor) no cambia; solo se extiende el contenido de las capas 2 y 4.

---

### 8. Supuestos y restricciones

**8.1. Supuestos que deben ser explícitos para el jugador, no solo para el sistema**

Un error pedagógico común en la enseñanza de macro es que el estudiante memoriza relaciones sin saber bajo qué condiciones dejan de cumplirse. Por eso, cada supuesto activo en un escenario (precios fijos, economía cerrada, expectativas estáticas, tipo de cambio fijo/flexible, etc.) debe mostrarse explícitamente en la interfaz del escenario (referencia cruzada: Documento 3, pantalla de "condiciones iniciales del escenario"), no quedar oculto en el motor.

**8.2. Restricciones técnicas heredadas de esta arquitectura**

- Toda arista sin supuestos declarados se considera válida en todos los modelos que la referencian (evitar sobre-especificación innecesaria).
- Ninguna variable puede existir sin al menos un agente asociado.
- Ningún mecanismo de transmisión usado en un escenario puede depender de una arista no presente en el grafo público de ese modelo (evita mecanismos "mágicos" no verificables por el estudiante).
- La propagación automática de efectos (fuera de las elecciones explícitas del estudiante) es una función del motor, no del contenido, y debe ser determinista dado el mismo grafo y las mismas condiciones iniciales — esto es indispensable para poder dar retroalimentación reproducible y comparable entre estudiantes (Documento 1, evaluación formativa).

---

### 9. Eventos y políticas

Un **evento** es el disparador que introduce un cambio inicial en una o más variables de política. Se clasifican en cuatro familias:

| Familia | Ejemplos | Agente originador |
|---|---|---|
| **Política fiscal** | Aumento/reducción de gasto público, cambio de impuestos | Gobierno |
| **Política monetaria** | Cambio en oferta monetaria, cambio en tasa de referencia | Banco Central |
| **Choques externos** | Shock de precios internacionales, variación de flujos de capital, crisis en socio comercial | Sector externo (exógeno al jugador) |
| **Choques de expectativas** | Cambio en expectativas de inflación, de crecimiento o de riesgo | Hogares / Empresas (reacción, no decisión) |

**Estructura conceptual de un evento:**

```
Evento:
  nombre: <texto>
  familia: fiscal | monetaria | choque_externo | choque_expectativas
  agente_origen: <agente>
  variables_afectadas_directamente: [ {variable, magnitud_cualitativa, direccion} ]
  modelos_en_los_que_esta_disponible: [...]
```

Los eventos son el punto de entrada de todo escenario (Capa 4 — Capa 5): un escenario nunca empieza "en frío", siempre empieza con uno o más eventos que perturban el estado inicial del grafo.

---

### 10. Tipos de escenario

| Tipo | Descripción | Nivel asociado (Doc. 1) |
|---|---|---|
| **Simple** | Un solo evento, un solo mecanismo de transmisión a reconstruir | Nivel I–II |
| **Compuesto** | Dos o más eventos concurrentes cuyos mecanismos interactúan o convergen | Nivel III |
| **Diagnóstico** | Se muestra un resultado final observado y el estudiante debe inferir el evento/política de origen más probable, recorriendo el grafo en sentido inverso | Nivel IV |
| **Simulación abierta** | El estudiante toma decisiones sucesivas como agente (p. ej. como Banco Central) y observa cómo evoluciona el sistema en el tiempo, con reacciones de otros agentes | Nivel V |

Cada tipo de escenario es una configuración distinta de cómo se recorre el mismo grafo — no requiere estructuras de datos distintas, solo distintas reglas de recorrido e interacción, lo cual vuelve a apoyarse en el principio de separación motor/contenido (sección 1.3).

---

### 11. Base de conocimiento económica (KB)

**11.1. Qué contiene**

La base de conocimiento es el conjunto de datos versionados que instancia todo lo definido en las secciones 3 a 9: agentes, variables, aristas del grafo, mecanismos curados, eventos y escenarios. No contiene lógica: es contenido puro, análogo a los archivos de niveles en un motor de videojuego convencional.

**11.2. Por qué separada del motor (justificación)**

Se consideraron dos alternativas: (a) codificar las relaciones económicas directamente en la lógica del programa, o (b) mantenerlas como datos externos versionados y validados contra un esquema. La opción (a) es más rápida de prototipar pero acopla el conocimiento económico al ciclo de despliegue del software — cualquier corrección de un economista requeriría un ingeniero y un nuevo release. La opción (b) permite que el contenido evolucione, se audite y se corrija de forma independiente del motor, y es la práctica estándar en la industria de videojuegos para contenido de niveles y diálogos (*data-driven content*). Se adopta la opción (b).

**11.3. Proceso de curación**

Toda incorporación o modificación de contenido en la KB (nueva arista, nuevo mecanismo, nuevo escenario) debe pasar por: validación de esquema (automática) — revisión económica (un economista **distinto del autor del contenido** confirma que la relación es correcta y que los supuestos están bien declarados) — revisión pedagógica (Documento 1: confirma que el nivel de dificultad y la explicación de error son adecuados) — publicación. La independencia entre autoría y revisión económica es parte del control, no un detalle operativo: cuando el equipo no pueda garantizarla, la limitación debe declararse explícitamente como riesgo del programa de gestión, no absorberse en silencio. Esta secuencia evita el riesgo, identificado en la valoración inicial del proyecto, de que el motor sea técnicamente correcto pero el contenido económico contenga errores conceptuales no detectados.

---

### 12. Glosario técnico del motor económico

- **Nodo:** una variable económica dentro del grafo.
- **Arista / relación causal:** conexión dirigida entre dos nodos, con polaridad, fuerza y condiciones de validez.
- **Mecanismo de transmisión:** camino curado de aristas con sentido pedagógico, entre un evento y uno o más efectos.
- **Perfil de modelo:** subconjunto de nodos, aristas y supuestos activos que define un modelo económico (IS-LM, AD-AS, etc.).
- **Supuesto:** condición que habilita o inhabilita una arista (p. ej. `precios_fijos`).
- **Evento:** disparador que introduce una perturbación inicial en una o más variables.
- **Escenario:** combinación de evento(s), condiciones iniciales y objetivo pedagógico presentada al estudiante.
- **Camino consistente:** secuencia de nodos propuesta por el estudiante que respeta polaridad y condiciones de validez del grafo activo, sin necesidad de coincidir exactamente con una única "respuesta modelo".

---

### 13. Marcos de referencia utilizados

La estructura de modelos macroeconómicos (IS-LM como base de corto plazo con precios fijos, su extensión hacia AD-AS al liberar el nivel de precios, y hacia Mundell-Fleming al abrir la economía) sigue la secuencia convencional con la que se enseña macroeconomía intermedia en manuales universitarios estándar (p. ej. Blanchard, Mankiw, Dornbusch-Fischer-Startz), lo que garantiza que la progresión de modelos del juego sea reconocible y transferible a un curso real, no una taxonomía inventada para el proyecto. El uso de un grafo causal como estructura de representación del conocimiento es consistente con el enfoque de mapas conceptuales y diagramas causales usados en enseñanza de sistemas complejos y pensamiento sistémico, aplicado aquí específicamente al dominio macroeconómico.

---

**Referencias cruzadas pendientes de completar en documentos futuros:**
- → Documento 1, sección "Diseño de niveles cognitivos": debe formalizar los criterios de evaluación para cada tipo de camino descrito en la sección 5.3 de este documento.
- → Documento 3, sección "Arquitectura de software": debe definir el esquema de datos real (JSON Schema) que implementa las estructuras conceptuales de las secciones 5.1 y 9 de este documento.
- → Documento 3, sección UI: debe definir cómo se visualizan los supuestos activos (sección 8.1) en pantalla.

---

### 14. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-01 | Publicación inicial |
| 1.1 | 2026-08-01 | §11.3: se explicita que el revisor económico debe ser distinto del autor del contenido, y que la imposibilidad de garantizar esa independencia debe declararse como riesgo de gestión. Resuelve la inconsistencia con la cita de Doc. 3, §8.4. |
| 1.2 | 2026-08-03 | §3: corrige la tabla de agentes — "tasa de interés de referencia" listada como controlada por el Banco Central solo era correcta bajo Regla de Taylor (§7.2), no en el modelo IS-LM base (donde el Banco Central controla la oferta monetaria y la tasa es endógena, §5.2). Se agrega nota explicativa bajo la tabla. Inconsistencia detectada por el PO en revisión económica de la historia 2 de S2 (`bitacora/sprint-02.md`), del mismo tipo que los hallazgos de la auditoría independiente de 2026-08-03. |
| 1.3 | 2026-08-04 | §3: nueva nota bajo la tabla de agentes sobre **"expectativas"** (columna "recibe" del Banco Central y de los Hogares). Aclara que aparece ahí porque el catálogo de agentes es fijo y compartido entre regímenes (§7.1), pero que en IS-LM base no es una variable del grafo sino un supuesto (`expectativas_estaticas`, Doc. 3 §4.4), y que entra como variable(s) específica(s) solo en los modelos que relajan ese supuesto (§7), consistente con la familia de eventos de §9. Condición documental impuesta por la consulta externa del 2026-08-04 que cerró la reserva del punto 4 del catálogo de agentes/variables (`consultas/consulta-externa-expectativas-2026-08-04.md`; `bitacora/sprint-02.md` §4). §9 no se modifica: ya era correcta y es precisamente la que fundamenta la temporalidad de la exclusión. |
