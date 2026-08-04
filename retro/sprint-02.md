# Retrospectiva — Sprint 2 (S2)

**Estado: CERRADA.**

Ref.: Doc. 4 §5 (ceremonia de retrospectiva: "documento escrito, no
conversación efímera... se apila en `retro/` y alimenta el refinamiento
del backlog"), acción 2 de [`retro/sprint-01.md`](sprint-01.md) ("detallar
la bitácora: cada cierre de sprint registra explícitamente el estado de
las ceremonias obligatorias —retro, Sprint Review— como ítems
verificables").

Este documento no se cerró generándolo por completo desde fuera: quedó en
borrador, con la estructura y las preguntas abiertas, hasta que el PO
respondió en sesión de trabajo el 2026-08-04 — sus respuestas se
incorporan abajo.

---

## Preguntas y respuestas del PO

1. **Dos repositorios activos por primera vez** (`causeway` y
   `ekg-macro`, creado durante S2): ¿qué tan bien funcionó operativamente
   — generó fricción (recordar en cuál trabajar, mantenerlos
   sincronizados) o fue transparente?
   **Respuesta:** fue transparente. Claude Code gestiona los commits y el
   push de manera simultánea (en ambos repositorios).
2. **Sprint Review con evidencia escrita:** esta vez la ceremonia se
   apoyó en un documento preparado de antemano
   (`sprint-review/S2-evidencia.md`, output real de tests y de
   demostraciones en vivo) en vez de solo demostrar directamente en el
   chat. ¿Ese formato fue útil como preparación, o fue un paso extra
   innecesario?
   **Respuesta:** útil.
3. **¿Se cumplió en la práctica la acción 2 de la retro de S1**
   ("detallar la bitácora")? ¿La bitácora de S2 quedó con más detalle que
   la de S1, o el nivel no cambió?
   **Respuesta:** se cumplió, y el nivel de detalle ayudó a gestionar la
   consultoría externa.
4. **R1 (revisión económica no independiente, Doc. 4 §9):** este sprint
   se usó por primera vez una consulta a una instancia externa de Claude
   (Fable 5) para el punto 4 del catálogo (Expectativas), como mitigación
   parcial declarada de este riesgo. ¿Es un patrón que valga la pena
   repetir sistemáticamente para contenido económico futuro, o fue
   específico a esa decisión?
   **Respuesta:** vale la pena repetir el proceso.
5. **R2 (pérdida de contexto entre sesiones):** S2 tuvo bastantes más
   sesiones y participantes (Claude, Claude Code, y la consulta externa)
   que S1. ¿La bitácora como documento único siguió siendo suficiente
   para retomar trabajo sin fricción, o el volumen empezó a generar
   problemas de navegación?
   **Respuesta:** sigue siendo suficiente.

## Qué funcionó

- Operar con dos repositorios activos (`causeway`, `ekg-macro`) por
  primera vez no generó fricción — Claude Code gestiona commits y push de
  forma simultánea en ambos, sin que el PO tenga que coordinar manualmente
  cuál repositorio recibe cada cambio.
- La Sprint Review apoyada en evidencia escrita preparada de antemano
  (`sprint-review/S2-evidencia.md`) resultó útil como preparación de la
  ceremonia.
- La acción 2 de la retro de S1 ("detallar la bitácora") se cumplió en la
  práctica, y ese nivel de detalle ayudó directamente a gestionar la
  consulta externa sobre el punto 4 (Expectativas) — la bitácora tenía
  registrado con precisión suficiente el objeto, el origen y el alcance de
  la reserva como para poder consultarla externamente sin reconstruir
  contexto.
- El uso de un único documento de bitácora por sprint siguió siendo
  suficiente para retomar trabajo sin fricción (Riesgo R2, Doc. 4 §9),
  pese a que S2 tuvo bastantes más sesiones y participantes que S1.

## Qué no funcionó

- El PO no reportó fricciones ni problemas de proceso en esta ronda —
  las cinco respuestas son positivas. No se fabrica un hallazgo negativo
  donde el PO no señaló ninguno.

## Riesgos (Doc. 4 §9)

- **R1 (revisión económica no independiente):** mitigado parcialmente
  este sprint mediante la consulta a una instancia externa de Claude
  (Fable 5) sobre el punto 4 del catálogo. El PO confirma que vale la pena
  repetir este patrón sistemáticamente para contenido económico futuro.
  Sigue sin equivaler a una revisión por un economista humano
  independiente (Doc. 2 §11.3;
  `consultas/consulta-externa-expectativas-2026-08-04.md` §1) — R1
  permanece **abierto**, mitigado pero no eliminado.
- **R2 (pérdida de contexto entre sesiones):** sigue mitigado
  correctamente por la bitácora — sin hallazgos, confirmado por el PO
  incluso con mayor volumen de sesiones y participantes que en S1.

## Acciones para S3+

1. Repetir sistemáticamente el patrón de consulta a una instancia externa
   de Claude para contenido económico que requiera un segundo criterio
   cuando no haya acceso a un economista humano independiente —
   mitigación declarada de R1, no un sustituto de la revisión que exige
   Doc. 2 §11.3 cuando esté disponible.
2. Mantener el nivel de detalle de bitácora alcanzado en S2 — confirmado
   por el PO como útil para gestionar procesos externos al equipo
   (consultas, auditorías).
3. Mantener el patrón de commits y push simultáneos de Claude Code sobre
   múltiples repositorios activos (`causeway`, `ekg-macro`) — sin
   fricción reportada, no requiere ajuste de proceso de cara a S3.

---

## Control de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 (borrador) | 2026-08-04 | Estructura y preguntas abiertas preparadas por Claude tras el cierre de S2 en Sprint Review, mismo patrón que `retro/sprint-01.md` v0.1. Pendiente de que el PO complete su reflexión — no cerrar esta retro sin esa parte. |
| 1.0 | 2026-08-04 | Retro cerrada con la reflexión del PO. |
