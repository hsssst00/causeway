'use strict';

// Ref.: Doc. 2 §8.2, Doc. 4 §7 (E0, historia 3).
//
// Decisión de Sprint Planning S1 (bitácora sprint-01.md): esta historia se
// redefinió para validar contra los FRAGMENTOS ILUSTRATIVOS de Doc. 3 §7.3
// (fixtures/*.json), no contra el catálogo real del EKG (Doc. 2 §4.3), que
// es historia de E2/S2 y todavía no existe. Cuando el catálogo real exista
// en `ekg-macro`, estas mismas funciones deben recibir esos datos en vez
// de los fixtures — la firma de las funciones ya está pensada para eso
// (reciben catálogos como parámetro, no los importan directamente).

/**
 * Regla 1 (Doc. 2 §8.2): "ninguna variable sin agente".
 * Toda variable que aparece como origen o destino de una relación, o en
 * variables_afectadas de un evento, debe tener un agente asociado en el
 * catálogo de variables.
 *
 * @param {Array<{id:string, origen:string, destino:string}>} relaciones
 * @param {Array<{id:string, agente:string}>} catalogoVariables
 * @returns {Array<{variable:string, relacion:string}>} violaciones encontradas (vacío si no hay)
 */
function variablesSinAgente(relaciones, catalogoVariables) {
  const variablesConAgente = new Set(catalogoVariables.map((v) => v.id));
  const violaciones = [];
  for (const rel of relaciones) {
    for (const campo of ['origen', 'destino']) {
      const variable = rel[campo];
      if (!variablesConAgente.has(variable)) {
        violaciones.push({ variable, relacion: rel.id, campo });
      }
    }
  }
  return violaciones;
}

/**
 * Regla 2 (Doc. 2 §8.2): "ninguna arista de mecanismo fuera del grafo
 * público del modelo". Toda relación referenciada en mecanismo_esperado
 * de un escenario debe tener el modelo del escenario en su modelos_validos.
 *
 * @param {{modelo:string, mecanismo_esperado:string[]}} escenario
 * @param {Array<{id:string, modelos_validos:string[]}>} relaciones
 * @returns {Array<{relacion:string, modeloEsperado:string}>} violaciones encontradas
 */
function aristasFueraDelGrafoDelModelo(escenario, relaciones) {
  const porId = new Map(relaciones.map((r) => [r.id, r]));
  const violaciones = [];
  for (const relId of escenario.mecanismo_esperado) {
    const rel = porId.get(relId);
    if (!rel) {
      violaciones.push({ relacion: relId, modeloEsperado: escenario.modelo, motivo: 'relación inexistente en el grafo' });
      continue;
    }
    if (!rel.modelos_validos.includes(escenario.modelo)) {
      violaciones.push({ relacion: relId, modeloEsperado: escenario.modelo, motivo: 'relación no habilitada para este modelo' });
    }
  }
  return violaciones;
}

/**
 * Regla 3 (historia 1, E0, S2 — Doc. 2 §4.3): detección de variables
 * duplicadas en el catálogo. Doc. 2 §4.3 señala explícitamente el riesgo
 * que esta regla operacionaliza: "permite validar automáticamente si una
 * variable nueva es realmente nueva o es una variable existente reutilizada
 * bajo otro nombre — error común al ampliar contenido con múltiples
 * colaboradores". Se detectan dos formas de duplicado:
 *   (a) mismo `id` exacto repetido en el catálogo;
 *   (b) mismo `nombre` normalizado (minúsculas, sin tildes, sin espacios
 *       sobrantes) bajo `id` distinto — el caso que un id-check por sí solo
 *       no detecta.
 *
 * @param {Array<{id:string, nombre:string}>} catalogoVariables
 * @returns {Array<{tipo:'id_duplicado'|'nombre_duplicado', valor:string, ids:string[]}>}
 *          violaciones encontradas (vacío si no hay)
 */
function variablesDuplicadas(catalogoVariables) {
  const normalizarNombre = (nombre) =>
    nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita diacríticos (tildes)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

  const idsVistos = new Map(); // id -> cantidad de ocurrencias
  const nombresVistos = new Map(); // nombre normalizado -> ids que lo usan
  const violaciones = [];
  const idsYaReportados = new Set();
  const nombresYaReportados = new Set();

  for (const variable of catalogoVariables) {
    idsVistos.set(variable.id, (idsVistos.get(variable.id) || 0) + 1);

    const nombreNorm = normalizarNombre(variable.nombre);
    if (!nombresVistos.has(nombreNorm)) nombresVistos.set(nombreNorm, []);
    nombresVistos.get(nombreNorm).push(variable.id);
  }

  for (const variable of catalogoVariables) {
    if (idsVistos.get(variable.id) > 1 && !idsYaReportados.has(variable.id)) {
      violaciones.push({ tipo: 'id_duplicado', valor: variable.id, ids: [variable.id] });
      idsYaReportados.add(variable.id);
    }
  }

  for (const [nombreNorm, ids] of nombresVistos.entries()) {
    if (ids.length > 1 && !nombresYaReportados.has(nombreNorm)) {
      violaciones.push({ tipo: 'nombre_duplicado', valor: nombreNorm, ids });
      nombresYaReportados.add(nombreNorm);
    }
  }

  return violaciones;
}

module.exports = { variablesSinAgente, aristasFueraDelGrafoDelModelo, variablesDuplicadas };
