# PolicyLab / Causeway — Corpus de diseño
 
**PolicyLab** es una simulación educativa basada en navegador en la que estudiantes de macroeconomía actúan como analistas que reconstruyen, paso a paso, los mecanismos causales detrás de eventos de política económica. El sistema evalúa el proceso de razonamiento — no la respuesta final — y valida la consistencia interna de cada cadena causal propuesta, no su coincidencia con una única respuesta canónica. PolicyLab es la primera aplicación construida sobre **Causeway**, una plataforma de orquestación diseñada para ser genérica respecto al dominio disciplinar.
 
Este repositorio contiene el corpus completo de diseño del programa: seis documentos que cubren desde la identidad arquitectónica hasta la infraestructura operativa de desarrollo.
 
---
 
## Orden de lectura
 
Los documentos se escribieron —y se leen mejor— en este orden:
 
| # | Documento | Qué responde |
|---|---|---|
| 0 | [Identidad y Arquitectura](documento-0-identidad-y-arquitectura.md) | Qué componentes existen, cómo se llaman, qué naturaleza tiene cada uno y qué reglas de dependencia los gobiernan. **Documento normativo: fija la nomenclatura de todo el corpus.** |
| 1 | [Diseño Pedagógico](documento-1-diseno-pedagogico.md) | Cómo se aprende en el sistema: niveles, andamiaje, retroalimentación, motivación y qué se mide (y qué se prohíbe medir). |
| 2 | [Diseño Económico](documento-2-diseno-economico.md) | Cómo se modela el conocimiento macroeconómico: agentes, variables, relaciones causales, supuestos, modelos y el proceso de curación del contenido. |
| 3 | [Game Design Document](documento-3-gdd-policylab.md) | Cómo se juega PolicyLab: experiencia central, sistemas, interfaz, arquitectura de software y plan de producción. |
| 4 | [Programa de Gestión Scrum](documento-4-programa-gestion-scrum.md) | Cómo se construye: sprints, backlog por épicas, roles adaptados a un equipo con agentes de IA, y riesgos de proceso. |
| 5 | [Repositorio y Tablero](documento-5-repositorio-y-tablero.md) | Cómo se organiza el trabajo: estructura de repositorios, CI que hace verificables las reglas de dependencia, y tablero de gestión. |
 
Un lector con interés **pedagógico** puede leer 1 → 3 y consultar 0 solo como glosario. Un lector con interés **técnico** puede leer 0 → 5 → 3 (§7). Un lector con interés en la **gestión de proyectos con agentes de IA** puede ir directo al 4.
 
---
 
## Glosario de componentes
 
La nomenclatura completa y su justificación están en el Documento 0, §6. Resumen:
 
| Sigla / Nombre | Significado | Naturaleza |
|---|---|---|
| **CMR** | Causal Mechanism Reconstruction Framework — marco teórico del programa | Documento de investigación |
| **CMR-RA** | Arquitectura de Referencia del CMR | Especificación |
| **CRE** | Causal Reasoning Engine — motor genérico de razonamiento sobre grafos causales | Software |
| **ATE** | Adaptive Tutoring Engine — motor pedagógico (andamiaje, timing de retroalimentación) | Software |
| **LSM** | Learner State Model — modelo persistente del estado del aprendiz | Software y datos |
| **CKS** | Causal Knowledge Schema — esquema formal que separa lo genérico de lo disciplinar | Especificación |
| **EKG** | Economic Knowledge Graph — grafo de conocimiento macroeconómico, instancia del CKS | Contenido |
| **Causeway** | Plataforma de orquestación que integra CRE, ATE y LSM tras una API | Software |
| **PolicyLab** | Aplicación educativa de macroeconomía, cliente de Causeway | Producto |
 
Los nombres de componentes se mantienen en inglés (siglas citables y versionables); el contenido narrativo y pedagógico del programa está en español.
 
---
 
## Estado del corpus
 
- Los seis documentos están en versión 1.x y cubren las fases **F0–F2** del roadmap (preproducción → corte vertical → MVP).
- El **piloto de validación con estudiantes reales (F3)** está deliberadamente fuera del alcance de este corpus: requiere un protocolo de investigación propio (diseño pre/post, coordinación docente, consentimiento informado) que se elaborará por separado.
- Cada documento cierra con una tabla de **control de versiones**; los cambios de contenido posteriores a la publicación inicial quedan registrados ahí.
---
 
## Autoría, licencia y contacto
 
*Pendiente de definir por el responsable del programa antes de la publicación: autoría formal, licencia del corpus documental (p. ej. CC BY-SA para documentos, licencia de software separada para el código cuando exista) y punto de contacto.*