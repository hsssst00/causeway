# ADR 0001 — Dos repositorios (`causeway` y `ekg-macro`), no uno

## Estado

Aceptado — 2026-08-01 (documentado en prosa en Doc. 5 §1; formalizado como ADR el 2026-08-03).

## Contexto

Causeway (motor + cliente) y el EKG (contenido económico) tienen ciclos de vida, ritmos de cambio y perfiles de revisión distintos:

- El **contenido económico** lo cambia y revisa un economista (el PO). Un ajuste de texto en `explicacion_si_error` no debería depender de que compile TypeScript ni de un pipeline de build (Doc. 2 §11.2).
- El **motor y el cliente** los cambia Claude Code. Su ritmo de release está ligado a los sprints (Doc. 4 §8); el del contenido está ligado a cuándo un lote pasa el proceso de curación de Doc. 2 §11.3, no al sprint.
- El equipo es de tres integrantes, y el PO es simultáneamente quien más cuello de botella genera en ambas revisiones (riesgo R3, Doc. 4 §9). Mezclar ambos ritmos en el mismo flujo de PRs de un único repositorio generaría fricción evitable entre revisiones de código y revisiones de contenido.

## Decisión

Se separan en dos repositorios:

| Repositorio | Contiene | Lo cambia principalmente | Ritmo de release |
|---|---|---|---|
| `causeway` | CKS (esquemas), CRE, ATE, LSM, API de orquestación, cliente PolicyLab, CI de fronteras, infraestructura | Claude Code, con especificación de Claude | Ligado a sprints (Doc. 4 §8) |
| `ekg-macro` | Contenido del EKG: agentes, variables, relaciones, eventos, escenarios | El PO (autoría), Claude (borradores) | Bundles versionados, publicados cuando un lote pasa curación (Doc. 2 §11.3) |

## Alternativas consideradas

**Monorepo único.** Funcionaría técnicamente, pero mezclaría dos ritmos de revisión distintos en el mismo flujo de PRs. En un equipo de tres, donde el PO ya es el cuello de botella de ambas revisiones, esto habría generado fricción sin beneficio compensatorio claro para este tamaño de equipo.

## Consecuencias

- Un único tablero de gestión sigue cubriendo ambos repositorios (Doc. 5 §4.4), filtrable por el campo "Repositorio" — no se duplica la gestión por dividir el código.
- `packages/cks/schema/` vive en `causeway` y es la fuente de verdad que la CI de `ekg-macro` (`ekg-macro/.ci/validar-cks.yml`) consume para validar contenido — esto crea una dependencia de `ekg-macro` hacia un artefacto publicado de `causeway`, nunca al revés.
- La extracción futura de un módulo de `causeway` a servicio independiente (p. ej. si otra aplicación de la plataforma necesita solo el CRE) no está bloqueada por esta decisión: es ortogonal a la separación código/contenido.

## Referencias

Doc. 5 §1; Doc. 2 §11.2, §11.3; Doc. 4 §8, §9 (riesgo R3).