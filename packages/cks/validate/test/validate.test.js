'use strict';

const { validarDocumento } = require('../index.js');
const { variablesSinAgente, aristasFueraDelGrafoDelModelo } = require('../reglas-integridad.js');

const variablesIlustrativas = require('../fixtures/variables-ilustrativas.json').variables;
const fixtureMecanismo = require('../fixtures/mecanismo-monetario-ilustrativo.json');

describe('Esquema relacion.schema.json (historia 1, E0)', () => {
  test('acepta una relación válida del mecanismo ilustrativo (Doc. 2 §5.2)', () => {
    for (const rel of fixtureMecanismo.relaciones) {
      const { valido, errores } = validarDocumento('relacion', rel);
      expect(errores).toEqual([]);
      expect(valido).toBe(true);
    }
  });

  // Criterio de aceptación literal de la historia 1 (Doc. 4 §7):
  // "un documento de prueba sin explicacion_si_error falla la validación de CI"
  test('RECHAZA una relación sin explicacion_si_error', () => {
    const relacionInvalida = { ...fixtureMecanismo.relaciones[0] };
    delete relacionInvalida.explicacion_si_error;

    const { valido, errores } = validarDocumento('relacion', relacionInvalida);

    expect(valido).toBe(false);
    expect(errores.some((e) => e.params && e.params.missingProperty === 'explicacion_si_error')).toBe(true);
  });

  test('RECHAZA una relación con explicacion_si_error demasiado corta (< 40 caracteres)', () => {
    const relacionInvalida = { ...fixtureMecanismo.relaciones[0], explicacion_si_error: 'muy corta' };
    const { valido } = validarDocumento('relacion', relacionInvalida);
    expect(valido).toBe(false);
  });

  test('RECHAZA una relación con polaridad fuera del enum', () => {
    const relacionInvalida = { ...fixtureMecanismo.relaciones[0], polaridad: 'neutra' };
    const { valido } = validarDocumento('relacion', relacionInvalida);
    expect(valido).toBe(false);
  });
});

describe('Esquemas de evento, agente, supuesto, escenario (historia 2, E0)', () => {
  test('el escenario ilustrativo (Doc. 2 §5.2 / §10) valida contra escenario.schema.json', () => {
    const { valido, errores } = validarDocumento('escenario', fixtureMecanismo.escenario);
    expect(errores).toEqual([]);
    expect(valido).toBe(true);
  });

  test('RECHAZA un escenario con tipo fuera del enum de Doc. 2 §10', () => {
    const escenarioInvalido = { ...fixtureMecanismo.escenario, tipo: 'libre' };
    const { valido } = validarDocumento('escenario', escenarioInvalido);
    expect(valido).toBe(false);
  });

  test('RECHAZA un agente sin variables_controladas', () => {
    const agenteInvalido = { id: 'banco-central', nombre: 'Banco Central', voz_institucional: 'Banco Central de Cordavia' };
    const { valido } = validarDocumento('agente', agenteInvalido);
    expect(valido).toBe(false);
  });

  test('acepta un supuesto mínimo válido', () => {
    const { valido } = validarDocumento('supuesto', {
      id: 'precios_fijos',
      nombre: 'Precios fijos',
      explicacion_corta: 'En el corto plazo de este modelo, las empresas ajustan cantidades, no precios.',
    });
    expect(valido).toBe(true);
  });
});

describe('Reglas de integridad (historia 3, E0 — redefinida contra fragmentos ilustrativos de Doc. 3 §7.3)', () => {
  test('el mecanismo ilustrativo no tiene variables sin agente', () => {
    const violaciones = variablesSinAgente(fixtureMecanismo.relaciones, variablesIlustrativas);
    expect(violaciones).toEqual([]);
  });

  test('DETECTA una variable sin agente en el catálogo', () => {
    const catalogoIncompleto = variablesIlustrativas.filter((v) => v.id !== 'consumo');
    const violaciones = variablesSinAgente(fixtureMecanismo.relaciones, catalogoIncompleto);
    expect(violaciones.length).toBeGreaterThan(0);
    expect(violaciones[0].variable).toBe('consumo');
  });

  test('el escenario ilustrativo no tiene aristas fuera del grafo público del modelo', () => {
    const violaciones = aristasFueraDelGrafoDelModelo(fixtureMecanismo.escenario, fixtureMecanismo.relaciones);
    expect(violaciones).toEqual([]);
  });

  test('DETECTA una arista fuera del grafo público del modelo (modelo distinto)', () => {
    const relacionesConUnaFueraDeModelo = fixtureMecanismo.relaciones.map((r) =>
      r.id === 'rel-ingreso-consumo' ? { ...r, modelos_validos: ['AD-AS'] } : r
    );
    const violaciones = aristasFueraDelGrafoDelModelo(fixtureMecanismo.escenario, relacionesConUnaFueraDeModelo);
    expect(violaciones.length).toBe(1);
    expect(violaciones[0].relacion).toBe('rel-ingreso-consumo');
  });

  test('DETECTA una arista referenciada que no existe en el grafo', () => {
    const escenarioConRelacionFantasma = {
      ...fixtureMecanismo.escenario,
      mecanismo_esperado: [...fixtureMecanismo.escenario.mecanismo_esperado, 'rel-no-existe'],
    };
    const violaciones = aristasFueraDelGrafoDelModelo(escenarioConRelacionFantasma, fixtureMecanismo.relaciones);
    expect(violaciones.some((v) => v.relacion === 'rel-no-existe')).toBe(true);
  });
});
