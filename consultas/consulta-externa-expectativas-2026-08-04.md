# Consulta externa — reserva del punto 4 ("Expectativas")

**Fecha:** 2026-08-04
**Participantes:** PO + instancia externa de Claude (modelo Fable 5), en una
sesión dentro del proyecto de Claude.ai — externa al flujo de autoría del
catálogo de agentes y variables (Doc. 2 §11.3).
**Objeto de la consulta:** el punto 4 del historial de curación del catálogo
—"Expectativas" excluida del catálogo de variables y modelada como supuesto
(`expectativas_estaticas`, Doc. 3 §4.4)—, tal como está registrado en
[`ekg-macro/README.md`](https://github.com/hsssst00/ekg-macro/blob/main/README.md),
secciones "Historial de curación heredado" y "Actualización del punto 4
(post-migración, 2026-08-04)".
**Origen de la reserva:** entrada "2026-08-04 — PO + Claude Code —
confirmación provisional del punto 4" de
[`bitacora/sprint-02.md`](../bitacora/sprint-02.md) §4. El PO confirmó el
punto 4 de forma **provisional**, condicionando la firma a esta consulta por
no tener acceso a profesionales de macroeconomía.

**Naturaleza de este documento.** Es un registro histórico: fotografía de la
consulta tal como ocurrió el 2026-08-04. No se reescribe con cambios
posteriores del catálogo, de los documentos de diseño ni de la bitácora —
mismo criterio que
[`auditorias/auditoria-independiente-causeway-2026-08-03.md`](../auditorias/auditoria-independiente-causeway-2026-08-03.md).

---

## 1. Advertencia de honestidad (registrada en la propia consulta)

La instancia consultada es también un modelo Claude. Por lo tanto esta
consulta **mitiga pero no elimina** el riesgo R1 (revisión económica no
independiente, Doc. 4 §9): **no equivale a una revisión por un economista
humano independiente**, que es lo que exige Doc. 2 §11.3 ("un economista
distinto del autor del contenido"). Esta advertencia se registró dentro de la
consulta misma y debe conservarse en toda constancia escrita que derive de
ella. R1 sigue abierto y declarado como riesgo del programa; no se absorbe en
silencio.

---

## 2. Veredicto

La consulta **respalda** la decisión del punto 4: bajo el supuesto
`expectativas_estaticas`, el tratamiento de "expectativas" como *supuesto* y
no como nodo del grafo es el económicamente correcto para el modelo IS-LM
base.

## 3. Fundamento económico

1. **Contradicción entre supuesto y nodo.** Si el modelo declara activo el
   supuesto `expectativas_estaticas`, las expectativas son, por definición,
   constantes dentro del modelo. Una variable del grafo es algo que toma
   valores y se propaga por aristas; un nodo "expectativas" bajo ese supuesto
   sería un nodo que no puede variar — contradiría el propio supuesto que lo
   habilita. Modelarlo como supuesto (`supuesto.schema.json`, Doc. 3 §4.4) es
   la representación fiel de lo que el modelo afirma.
2. **Consistencia con los manuales de referencia.** La secuencia de modelos
   adoptada por el proyecto (IS-LM de corto plazo con precios fijos → AD-AS →
   Mundell-Fleming, Doc. 2 §13, siguiendo Blanchard, Mankiw y
   Dornbusch-Fischer-Startz) trata las expectativas exactamente así en el
   IS-LM base: como condición mantenida fija, no como variable del modelo.
   Introducirlas como nodo en el modelo base haría al grafo divergir de la
   presentación estándar con la que el estudiante encontrará el material en un
   curso real.
3. **"Expectativas" como variable genérica está mal definida.** No existe una
   magnitud macroeconómica única llamada "expectativas": lo que existe son
   expectativas *sobre algo* (inflación esperada, tipo de cambio esperado,
   demanda esperada). Un nodo genérico "Expectativas" no admitiría una ficha
   mínima coherente conforme a Doc. 2 §4.3 (tipo, naturaleza, modelos), porque
   su naturaleza y su polaridad dependen de sobre qué variable se forma la
   expectativa.

## 4. La exclusión es temporal por diseño, no permanente

La consulta subraya que excluir "expectativas" del catálogo **no** cierra la
puerta a las expectativas en el EKG. La familia de eventos "choques de
expectativas" (Doc. 2 §9; Doc. 3 §5.1) exige que, al incorporar modelos que
relajan `expectativas_estaticas` (AD-AS, Curva de Phillips, Regla de Taylor —
Doc. 2 §7), las expectativas entren al grafo como **variables específicas**
(p. ej. `inflacion-esperada`, `tipo-cambio-esperado`), no como un nodo
genérico "Expectativas".

Esto no requiere refactorización: el campo `modelos` de
`packages/cks/schema/variable.schema.json` ya soporta que una variable exista
solo en un subconjunto de modelos, que es exactamente el mecanismo de
"perfil de validez sobre un grafo compartido" de Doc. 2 §1.2 y §7.1. En ese
momento el chip del supuesto `expectativas_estaticas` se tacha en la
transición de modelo (Doc. 3 §4.4, "cambio de modelo visible") — el sistema
muestra el relajamiento del supuesto en vez de ocultarlo.

## 5. Condiciones impuestas por la consulta

El respaldo es **condicionado**. La consulta exige dos constancias
documentales:

- **Condición A — `ekg-macro/README.md`.** La exclusión debe quedar registrada
  como explícitamente **temporal**: "Expectativas" queda fuera del catálogo
  *mientras el único modelo activo sea IS-LM base*. Sin esa constancia, un
  lector futuro puede leer la exclusión como una decisión permanente y omitir
  las variables de expectativas al incorporar AD-AS/Phillips/Taylor.
- **Condición B — tabla de agentes de Doc. 2 §3.** "Expectativas" figura en la
  columna "recibe" del Banco Central y de los Hogares. Debe agregarse una nota
  bajo la tabla —mismo patrón que las notas ya existentes para Sector
  externo/Mundell-Fleming y Banco Central/Regla de Taylor— aclarando que esa
  aparición responde a que el catálogo de agentes es fijo y compartido entre
  regímenes (§7.1), y que en el IS-LM base "expectativas" no es una variable
  del grafo sino un supuesto. Sin esa nota, la tabla y el catálogo se leen como
  contradictorios.

## 6. Anotación de taxonomía (menor, no bloqueante)

La naturaleza de las futuras variables de expectativas no calza limpiamente en
la taxonomía de tres categorías de Doc. 2 §4.2 (`stock` / `flujo` /
`precio_tasa`): una expectativa *sobre* una tasa no es ella misma una tasa —
`inflacion-esperada` es una creencia sobre una magnitud, no la magnitud. Se
registra como candidata a la **misma revisión de taxonomía ya abierta** para
`ciclo-economico` en la sesión de revisión económica del 2026-08-03
(`bitacora/sprint-02.md` §4), a resolver en S3+ si aparecen más variables que
no calcen. No es bloqueante para S2: ninguna variable de expectativas existe
todavía en el catálogo.

---

## 7. Resolución del PO

Con las condiciones A y B ejecutadas y la anotación de taxonomía registrada,
el PO **ratifica** el punto 4: la firma económica pasa de **provisional a
firme**.

Alcance de la ratificación:

- **Sí cierra:** la reserva del punto 4 y, con ella, la firma económica del
  catálogo de la historia 2 de S2 (los cuatro puntos de clasificación quedan
  confirmados en firme).
- **No cierra:** la historia 2 de S2 **no** pasa a "Hecho" — queda pendiente
  únicamente de demostración en Sprint Review (Doc. 4 §6.2).
- **No cierra:** el riesgo R1 (Doc. 4 §9), por la advertencia de §1 de este
  documento.

La ejecución de las condiciones quedó registrada en la entrada
"2026-08-04 — PO + Claude Code — cierre de la reserva del punto 4 (consulta
externa realizada)" de [`bitacora/sprint-02.md`](../bitacora/sprint-02.md) §4.
