# Documento 5 — Repositorio Git y Tablero de Gestión
## Infraestructura operativa del programa: código, contenido y flujo de trabajo

---

### 0. Ficha del documento

| Campo | Descripción |
|---|---|
| **Pregunta que responde** | ¿Cómo se organiza el código y el contenido en repositorios git, y cómo se estructura el tablero que hace operativo el backlog del Documento 4? |
| **Audiencia principal** | El propio equipo (Product Owner, Claude, Claude Code); referencia para cualquier colaborador técnico que se incorpore a los repositorios. |
| **Relación con Documento 0** | Las reglas de dependencia (§4) dejan de ser prosa y se convierten aquí en reglas de CI verificables por carpeta/paquete. |
| **Relación con Documento 3** | El diagrama de arquitectura de §7.1 ya distinguía Causeway del "Repositorio de contenido EKG" como dos cajas separadas — este documento formaliza esa intuición en dos repositorios reales. |
| **Relación con Documento 4** | Cada columna del tablero es un estado de la Definition of Ready/Done (§6); cada Milestone del tablero es un sprint (§8). |
| **Alcance** | Estructura de carpetas, reglas de CI por dependencia, convención de ramas y versionado, y diseño del tablero (columnas, campos, plantillas). |
| **Fuera de alcance** | Elección de proveedor concreto de hosting/CI (se asume GitHub por ser gratuito para repos privados pequeños y compatible con Claude Code, pero la estructura es portable a GitLab u otro). |

---

### 1. Decisión: dos repositorios, no uno

Se separan **código** (motores + cliente) y **contenido** (EKG) en dos repositorios, no por dogma sino porque Doc. 2 ya justificó por qué deben tener ciclos de vida distintos: el contenido económico lo cambia y revisa un economista (el PO), sin que eso deba pasar por el mismo pipeline que compila TypeScript; el motor lo cambia Claude Code, sin que un ajuste de explicación de una arista deba requerir un despliegue de software (Doc. 2, §11.2). Un único repositorio funcionaría, pero mezclaría dos ritmos de revisión distintos en el mismo flujo de PRs, lo que en un equipo de tres —donde el PO es el cuello de botella de ambas revisiones (Documento 4, riesgo R3)— generaría fricción evitable.

| Repositorio | Contiene | Lo cambia principalmente | Ritmo de release |
|---|---|---|---|
| **`causeway`** | CKS (esquemas), CRE, ATE, LSM, API de orquestación, cliente PolicyLab, CI de fronteras, infraestructura | Claude Code, con especificación de Claude | Ligado a sprints (Documento 4, §8) |
| **`ekg-macro`** | Contenido del EKG: agentes, variables, relaciones, eventos, escenarios | El PO (autoría), Claude (borradores) | Bundles versionados, publicados cuando un lote de contenido pasa curación (Doc. 2, §11.3) — no necesariamente al ritmo del sprint |

---

### 2. Repositorio `causeway`

```
causeway/
├── docs/                              # Documentos 0-5, fuente de verdad versionada
│   ├── 00-identidad-y-arquitectura.md
│   ├── 01-diseno-pedagogico.md
│   ├── 02-diseno-economico.md
│   ├── 03-gdd-policylab.md
│   ├── 04-programa-gestion-scrum.md
│   ├── 05-repositorio-y-tablero.md
│   └── adr/                           # Architecture Decision Records — decisiones no cubiertas por Doc. 0-3
│       └── 0001-monorepo-vs-dos-repos.md
├── packages/
│   ├── cks/                           # Causal Knowledge Schema (Doc. 0, §3.6)
│   │   ├── schema/
│   │   │   ├── relacion.schema.json
│   │   │   ├── evento.schema.json
│   │   │   ├── agente.schema.json
│   │   │   ├── supuesto.schema.json
│   │   │   └── escenario.schema.json
│   │   └── validate/                  # librería de validación — la consume también la CI de ekg-macro
│   ├── cre/                           # Causal Reasoning Engine (Doc. 0, §3.3)
│   │   ├── src/
│   │   └── test/synthetic-graphs/     # grafos sintéticos SIN vocabulario económico (verifica genericidad, Doc. 0, §5)
│   ├── ate/                           # Adaptive Tutoring Engine (Doc. 0, §3.4)
│   │   ├── src/
│   │   └── test/
│   ├── lsm/                           # Learner State Model (Doc. 0, §3.5)
│   │   ├── src/
│   │   └── migrations/                # esquema Postgres (Doc. 3, §7.4)
│   ├── api/                           # orquestación Causeway (Doc. 3, §7.7)
│   │   └── src/
│   └── policylab-client/              # cliente TS + React + SVG (Doc. 3, §7.5)
│       └── src/
│           ├── constructor-causal/
│           ├── informe/
│           ├── tablero/
│           └── panel-docente/
├── .ci/
│   ├── fronteras.yml                  # reglas de importación entre paquetes (tabla §2.1)
│   ├── tests.yml
│   └── cks-lib.yml
├── infra/
├── bitacora/                          # bitácora de sprint (Documento 4, §4-§5)
├── retro/                             # retrospectivas escritas (Documento 4, §5)
└── README.md
```

**2.1. Reglas de dependencia como CI, no como intención**

Doc. 0, §4 es normativo pero, sin verificación automática, se degrada con el tiempo. Se traduce así:

| Paquete origen | Puede importar | No puede importar | Regla de Doc. 0 que aplica |
|---|---|---|---|
| `cre` | `cks/validate` | `ate`, `lsm`, `api`, `policylab-client`, cualquier cosa de `ekg-macro` | §4.1 (sin vocabulario disciplinar), §4.5 (dependencias hacia adentro) |
| `ate` | `cks/validate`, tipos de salida de `cre`, tipos de lectura de `lsm` | `policylab-client`, `ekg-macro` como contenido crudo | §3.4 (consulta a ambos, no persiste nada propio) |
| `lsm` | `cks/validate` | `cre`, `ate`, `policylab-client` | §3.5 (registra y agrega; no decide) |
| `api` | `cre`, `ate`, `lsm` | `policylab-client` | §4.4 (las aplicaciones solo acceden vía API) |
| `policylab-client` | Nada de `causeway` salvo el contrato HTTP publicado de `api` | `cre`, `ate`, `lsm` como código | §4.4, literal: "ninguna aplicación importa un motor directamente" |

Cada regla de esta tabla es un job de CI (`.ci/fronteras.yml`) que falla el build si detecta una ruta de importación prohibida — no una convención de código de revisión manual.

**2.2. Ramas y versionado en `causeway`**

Trunk-based, ramas de corta vida por historia del backlog (`feat/E4-cre-validacion-eslabon`), `main` protegido: requiere CI en verde. Dado que el equipo de código es en la práctica una sola entidad ejecutora (Claude Code) supervisada por dos revisores (PO y Claude), no se justifica un flujo de ramas de larga vida por integrante — la complejidad de gitflow no tiene a quién servir aquí.

---

### 3. Repositorio `ekg-macro`

```
ekg-macro/
├── agentes/
│   └── *.yaml                         # los seis agentes de Doc. 2, §3
├── variables/
│   └── *.yaml                         # ficha mínima por variable, Doc. 2, §4.3
├── relaciones/
│   └── is-lm/
│       ├── monetaria/*.yaml           # mecanismo de Doc. 2, §5.2
│       └── fiscal/*.yaml
├── eventos/
│   └── *.yaml
├── escenarios/
│   ├── nivel-0/
│   ├── nivel-1/
│   └── nivel-2/
├── bundles/                           # NO se edita a mano — lo genera la CI al publicar
│   └── is-lm-v0.1.0.json
├── .ci/
│   └── validar-cks.yml                # valida contra el esquema publicado en causeway/packages/cks
├── .github/PULL_REQUEST_TEMPLATE.md   # checklist de curación, ver §3.1
├── CHANGELOG.md                       # versión semántica por bundle publicado
└── README.md
```

**3.1. El proceso de curación de Doc. 2, §11.3 como plantilla de PR, no como memoria**

Doc. 2 exige: validación de esquema (automática) — revisión económica — revisión pedagógica — publicación. Convertido en checklist de PR obligatorio antes de fusionar a `main`:

```markdown
## Checklist de curación (Doc. 2, §11.3)

- [ ] Validación de esquema: CI en verde contra CKS
- [ ] Revisión económica: la relación/escenario es correcta y los supuestos
      están bien declarados — firmado por: __________ (fecha)
- [ ] Revisión pedagógica: el nivel de dificultad y `explicacion_si_error`
      son adecuados (Documento 1) — firmado por: __________ (fecha)
- [ ] Referencia cruzada: ¿qué sección de Doc. 1/2 fundamenta este contenido?
```

Nota honesta (Documento 4, riesgo R1): en este equipo, "revisión económica" y "autoría" suelen ser la misma persona (el PO). La plantilla no resuelve eso — lo hace visible en cada PR en vez de dejarlo implícito, que es lo mínimo exigible mientras no se incorpore un revisor externo.

**3.2. Versionado semántico de bundles**

| Cambio | Versión | Ejemplo |
|---|---|---|
| Corrección de texto en `explicacion_si_error`, ajuste menor sin cambiar semántica | PATCH | `0.1.0 → 0.1.1` |
| Nuevo escenario o mecanismo que no modifica contenido existente | MINOR | `0.1.1 → 0.2.0` |
| Cambio que invalida contenido existente o introduce un modelo nuevo (Doc. 2, §7.3) | MAJOR | `0.9.0 → 1.0.0` |

El LSM registra la versión exacta del bundle usada en cada interacción (Doc. 3, §7.3, nota c) — por eso `bundles/` nunca se edita a mano ni se sobrescribe: cada versión publicada es inmutable.

---

### 4. Tablero

**4.1. Columnas** (mapean directamente a DoR/DoD, Documento 4, §6)

| Columna | Significa |
|---|---|
| **Backlog** | Historia existe en Documento 4, §7 pero no cumple DoR todavía |
| **Lista para sprint** | Cumple DoR (§6.1): objetivo, criterio de aceptación, referencia cruzada y dependencias resueltas |
| **En curso** | Dentro de un sprint activo; la bitácora de sprint tiene entradas asociadas |
| **En revisión** | Código en CI o contenido esperando firma del PO (revisión económica/pedagógica, §3.1) |
| **Hecho** | Cumple DoD (§6.2) y fue demostrado en Sprint Review |

**4.2. Campos personalizados por ítem**

- **Épica:** E0–E11 (Documento 4, §7)
- **Fase:** F0 / F1 / F2
- **Sprint:** S1–S20 — se modela como *Milestone* del tablero, no como campo libre, para que el progreso por sprint sea consultable directamente
- **Tipo:** código / contenido / diseño / QA — determina qué firma exige la columna "En revisión" (código — CI; contenido — PO)
- **Responsable primario:** PO / Claude / Claude Code
- **Repositorio:** `causeway` / `ekg-macro`

**4.3. Plantilla de issue ("Historia")**

```markdown
### Historia
Como [rol] quiero [objetivo] para [razón].

### Criterio de aceptación
- [ ] ...

### Referencia cruzada
Doc. __ §__

### Dependencias
- [ ] ...
```

Un issue sin referencia cruzada completada no se acepta en "Lista para sprint" — es la aplicación literal de la regla de DoR (Documento 4, §6.1: "una historia sin referencia cruzada es, por definición, una decisión de diseño nueva no documentada").

**4.4. Un solo tablero, no uno por repositorio**

Aunque el código y el contenido viven en repos distintos (§1), se gestionan en un único tablero: dividir el tablero replicaría la fricción que la separación de repos ya resolvió de otra forma, y con tres integrantes no hay volumen que justifique dos tableros. El campo "Repositorio" (§4.2) permite filtrar cuando haga falta ver solo contenido o solo código.

---

### 5. Primeros pasos concretos para S1

1. Crear `causeway` con la estructura de §2 vacía + CI de fronteras (`.ci/fronteras.yml`) fallando intencionalmente hasta que exista al menos un paquete real — evita que el pipeline quede "verde por default" sin verificar nada.
2. Crear `ekg-macro` con la estructura de §3 vacía + plantilla de PR de curación.
3. Crear el tablero con las cinco columnas de §4.1, los campos de §4.2, y veinte Milestones (S1–S20) vacíos.
4. Cargar en el tablero las historias de E0 y E1 (Documento 4, §7) como primeras tarjetas en "Backlog", y correr Sprint Planning de S1 contra ellas.

---

### 6. Marcos de referencia utilizados

Este documento no propone convenciones nuevas de control de versiones: usa trunk-based development y versionado semántico (SemVer), ambos estándares ampliamente adoptados en ingeniería de software, aplicados aquí a la distinción específica entre repositorio de motor y repositorio de contenido que ya establecía Doc. 3, §7.1.

---

### 7. Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-01 | Publicación inicial |
| 1.0.1 | 2026-08-01 | Se agrega subtítulo y campo "Audiencia principal" a la ficha; normalización del estilo de citas cruzadas. |
