'use strict';

const { validarDocumento } = require('../index.js');
const { variablesSinAgente, aristasFueraDelGrafoDelModelo, variablesDuplicadas } = require('../reglas-integridad.js');

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

describe('Esquema variable.schema.json (historia 1, E0, S2 — Doc. 2 §4.3)', () => {
  test('acepta una variable válida con ficha mínima completa', () => {
    const variableValida = {
      id: 'oferta-monetaria',
      nombre: 'Oferta monetaria',
      agentes: ['banco-central'],
      tipo: 'politica',
      naturaleza: 'stock',
      modelos: ['IS-LM'],
    };
    const { valido, errores } = validarDocumento('variable', variableValida);
    expect(errores).toEqual([]);
    expect(valido).toBe(true);
  });

  test('acepta una variable con más de un agente relacionado', () => {
    const { valido, errores } = validarDocumento('variable', {
      id: 'tasa-interes',
      nombre: 'Tasa de interés',
      agentes: ['banco-central', 'empresas', 'hogares', 'sistema-financiero'],
      tipo: 'endogena',
      naturaleza: 'precio_tasa',
      modelos: ['IS-LM'],
    });
    expect(errores).toEqual([]);
    expect(valido).toBe(true);
  });

  test('RECHAZA una variable sin agentes', () => {
    const { valido } = validarDocumento('variable', {
      id: 'gasto-publico',
      nombre: 'Gasto público',
      agentes: [],
      tipo: 'politica',
      naturaleza: 'flujo',
      modelos: ['IS-LM'],
    });
    expect(valido).toBe(false);
  });

  test('RECHAZA una variable con tipo fuera del enum de Doc. 2 §4.1', () => {
    const { valido } = validarDocumento('variable', {
      id: 'impuestos',
      nombre: 'Impuestos',
      agentes: ['gobierno'],
      tipo: 'exogena',
      naturaleza: 'flujo',
      modelos: ['IS-LM'],
    });
    expect(valido).toBe(false);
  });

  test('RECHAZA una variable con naturaleza fuera del enum de Doc. 2 §4.2', () => {
    const { valido } = validarDocumento('variable', {
      id: 'impuestos',
      nombre: 'Impuestos',
      agentes: ['gobierno'],
      tipo: 'politica',
      naturaleza: 'indice',
      modelos: ['IS-LM'],
    });
    expect(valido).toBe(false);
  });

  test('RECHAZA una variable con id fuera del patrón de slug (minúsculas/guiones)', () => {
    const { valido } = validarDocumento('variable', {
      id: 'Gasto_Publico',
      nombre: 'Gasto público',
      agentes: ['gobierno'],
      tipo: 'politica',
      naturaleza: 'flujo',
      modelos: ['IS-LM'],
    });
    expect(valido).toBe(false);
  });

  test('RECHAZA un agente-ref que no está en el enum de los seis agentes', () => {
    const { valido } = validarDocumento('variable', {
      id: 'variable-fantasma',
      nombre: 'Variable fantasma',
      agentes: ['agente-que-no-existe'],
      tipo: 'endogena',
      naturaleza: 'flujo',
      modelos: ['IS-LM'],
    });
    expect(valido).toBe(false);
  });
});

describe('Regla de integridad: variables duplicadas (historia 1, E0, S2 — Doc. 2 §4.3)', () => {
  test('un catálogo sin duplicados no reporta violaciones', () => {
    const catalogo = [
      { id: 'oferta-monetaria', nombre: 'Oferta monetaria' },
      { id: 'tasa-interes', nombre: 'Tasa de interés' },
      { id: 'gasto-publico', nombre: 'Gasto público' },
    ];
    expect(variablesDuplicadas(catalogo)).toEqual([]);
  });

  test('DETECTA dos entradas con el mismo id', () => {
    const catalogo = [
      { id: 'inversion', nombre: 'Inversión' },
      { id: 'inversion', nombre: 'Inversión (duplicado por error)' },
    ];
    const violaciones = variablesDuplicadas(catalogo);
    expect(violaciones.some((v) => v.tipo === 'id_duplicado' && v.valor === 'inversion')).toBe(true);
  });

  test('DETECTA dos entradas con el mismo nombre normalizado bajo ids distintos (tildes/mayúsculas)', () => {
    const catalogo = [
      { id: 'tasa-interes', nombre: 'Tasa de Interés' },
      { id: 'tasa-de-interes-2', nombre: 'tasa de interes' },
    ];
    const violaciones = variablesDuplicadas(catalogo);
    expect(violaciones.some((v) => v.tipo === 'nombre_duplicado' && v.ids.includes('tasa-interes') && v.ids.includes('tasa-de-interes-2'))).toBe(true);
  });

  test('no confunde nombres distintos con el mismo prefijo', () => {
    const catalogo = [
      { id: 'tasa-interes', nombre: 'Tasa de interés' },
      { id: 'tasas-mercado', nombre: 'Tasas de mercado' },
    ];
    expect(variablesDuplicadas(catalogo)).toEqual([]);
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

  test('acepta el evento ilustrativo (Doc. 2 §9) que dispara el escenario monetario', () => {
    const { valido, errores } = validarDocumento('evento', fixtureMecanismo.evento);
    expect(errores).toEqual([]);
    expect(valido).toBe(true);
  });

  test('RECHAZA un evento con familia fuera del enum de Doc. 2 §9', () => {
    const eventoInvalido = { ...fixtureMecanismo.evento, familia: 'sorpresa' };
    const { valido } = validarDocumento('evento', eventoInvalido);
    expect(valido).toBe(false);
  });

  test('RECHAZA un evento sin variables_afectadas', () => {
    const eventoInvalido = { ...fixtureMecanismo.evento, variables_afectadas: [] };
    const { valido } = validarDocumento('evento', eventoInvalido);
    expect(valido).toBe(false);
  });

  test('acepta un agente válido con variables_controladas (Doc. 2 §3)', () => {
    const agenteValido = {
      id: 'banco-central',
      nombre: 'Banco Central',
      voz_institucional: 'Banco Central de Cordavia',
      variables_controladas: ['oferta-monetaria', 'tasa-interes'],
    };
    const { valido, errores } = validarDocumento('agente', agenteValido);
    expect(errores).toEqual([]);
    expect(valido).toBe(true);
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

  test('RECHAZA un supuesto sin explicacion_corta', () => {
    const { valido, errores } = validarDocumento('supuesto', {
      id: 'precios_fijos',
      nombre: 'Precios fijos',
    });
    expect(valido).toBe(false);
    expect(errores.some((e) => e.params && e.params.missingProperty === 'explicacion_corta')).toBe(true);
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
