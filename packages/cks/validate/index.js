'use strict';

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const path = require('path');

const refs = require('../schema/refs.schema.json');
const relacion = require('../schema/relacion.schema.json');
const evento = require('../schema/evento.schema.json');
const agente = require('../schema/agente.schema.json');
const supuesto = require('../schema/supuesto.schema.json');
const escenario = require('../schema/escenario.schema.json');
const variable = require('../schema/variable.schema.json');

// Ref.: Doc. 3 §7.3. Cada tipo del CKS tiene su propio esquema publicado.
// Este módulo es el punto único de validación de forma, consumido tanto
// por la CI de `causeway` como (más adelante) por la CI de `ekg-macro`
// (Doc. 5 §1, §3.1: "validación de esquema" del proceso de curación).
// `variable` se agrega en S2 (historia 1, E0, Doc. 2 §4.3).
const TIPOS = { relacion, evento, agente, supuesto, escenario, variable };

function crearValidador() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  // refs.schema.json define variable-ref, agente-ref y supuesto-ref bajo
  // "definitions" con sus propios $id; se registran como sub-esquemas
  // independientes para que los $ref de los 5 esquemas los resuelvan.
  for (const subEsquema of Object.values(refs.definitions)) {
    ajv.addSchema(subEsquema);
  }
  const validadoresPorTipo = {};
  for (const [nombre, esquema] of Object.entries(TIPOS)) {
    validadoresPorTipo[nombre] = ajv.compile(esquema);
  }
  return validadoresPorTipo;
}

const validadores = crearValidador();

/**
 * Valida un documento contra el esquema CKS del tipo indicado.
 * @param {'relacion'|'evento'|'agente'|'supuesto'|'escenario'|'variable'} tipo
 * @param {object} documento
 * @returns {{valido: boolean, errores: Array}}
 */
function validarDocumento(tipo, documento) {
  const validador = validadores[tipo];
  if (!validador) {
    throw new Error(`Tipo de documento CKS desconocido: ${tipo}. Tipos válidos: ${Object.keys(TIPOS).join(', ')}`);
  }
  const valido = validador(documento);
  return { valido, errores: valido ? [] : validador.errors };
}

/**
 * Valida un arreglo de documentos del mismo tipo y devuelve el detalle por documento.
 */
function validarLote(tipo, documentos) {
  return documentos.map((doc) => ({ id: doc.id, ...validarDocumento(tipo, doc) }));
}

module.exports = { validarDocumento, validarLote, TIPOS: Object.keys(TIPOS) };
