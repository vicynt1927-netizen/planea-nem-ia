/**
 * nemFallbackEngine.ts
 * Motor curricular pedagógico de respaldo de la Nueva Escuela Mexicana (NEM).
 * Garantiza continuidad operativa al 100% cuando los servidores de IA de Google
 * experimentan alta demanda momentánea (error 503 UNAVAILABLE) o falta de conexión.
 */

export interface FallbackPlanParams {
  instrucciones?: string;
  grado?: string;
  fase?: string;
  campoFormativo?: string;
  tipoProyecto?: string;
  numeroSesiones?: number;
  contenido?: string;
  pda?: string;
  ejesArticuladores?: string[];
  metodologia?: string;
  contextoGrupo?: {
    fortalezas?: string;
    necesidades?: string;
    problematicas?: string;
    caracteristicasContexto?: string;
    observaciones?: string;
  };
}

const METODOLOGIAS_MOMENTOS: Record<string, string[]> = {
  'Aprendizaje basado en proyectos comunitarios': [
    'Fase 1: Identificación de la problemática y recuperación de saberes previos',
    'Fase 1: Planificación participativa y acuerdos de trabajo',
    'Fase 2: Acercamiento, exploración e indagación comunitaria',
    'Fase 2: Comprensión, análisis y primeras producciones',
    'Fase 2: Reconocimiento de avances y ajustes colectivos',
    'Fase 3: Concreción e integración del producto final',
    'Fase 3: Difusión y socialización ante la comunidad escolar',
    'Fase 3: Reflexión metacognitiva y evaluación formativa de avances',
  ],
  'Aprendizaje basado en indagación (STEAM)': [
    'Fase 1: Introducción al tema y planteamiento de preguntas detonadoras',
    'Fase 2: Diseño del plan de indagación y recolección de evidencias',
    'Fase 2: Experimentación y construcción de explicaciones científicas',
    'Fase 3: Organización y estructuración de datos y hallazgos',
    'Fase 4: Presentación de prototipos y aplicación práctica',
    'Fase 5: Metacognición y evaluación formativa del proceso',
  ],
  'Aprendizaje Basado en Problemas (ABP)': [
    'Momento 1: Presentemos la situación y sensibilización del grupo',
    'Momento 2: Recolectemos saberes previos y experiencias cotidianas',
    'Momento 3: Formulemos el problema central y preguntas clave',
    'Momento 4: Organicemos la experiencia de trabajo colaborativo',
    'Momento 5: Vivamos la experiencia y búsqueda de soluciones',
    'Momento 6: Resultados, análisis y acuerdos de transformación',
  ],
  'Aprendizaje Servicio (AS)': [
    'Etapa 1: Punto de partida y diagnóstico participativo',
    'Etapa 2: Lo que sé y lo que quiero saber sobre la necesidad comunitaria',
    'Etapa 3: Organicemos las actividades y vinculación con la comunidad',
    'Etapa 4: Creatividad en marcha y ejecución del servicio solidario',
    'Etapa 5: Compartimos y evaluamos lo aprendido con la comunidad',
  ],
  'Secuencia didáctica': [
    'Sesión de Apertura: Exploración y recuperación de ideas previas',
    'Sesión de Desarrollo: Construcción conceptual y práctica guiada',
    'Sesión de Desarrollo: Profundización colaborativa y aplicación contextualizada',
    'Sesión de Desarrollo: Elaboración de evidencias de aprendizaje',
    'Sesión de Cierre: Puesta en común, metacognición y valoración formativa',
  ],
};

export function buildNEMFallbackPlan(params: FallbackPlanParams) {
  const grado = params.grado || '4° de Primaria';
  const fase = params.fase || 'Fase 4';
  const campo = params.campoFormativo || 'Lenguajes';
  const tipoProyecto = params.tipoProyecto || 'Aula';
  const metodologia = params.metodologia || 'Aprendizaje basado en proyectos comunitarios';
  const numSesiones = Math.max(1, Math.min(params.numeroSesiones || 5, 12));
  const tema = params.instrucciones || 'Proyecto Integral de Aprendizaje';
  const contenido = params.contenido || `Estudio y aplicación de conocimientos de ${campo} en el entorno escolar`;
  const pda = params.pda || `Participa reflexivamente en procesos de indagación, diálogo y creación colectiva acordes a ${grado}`;
  const ejes = params.ejesArticuladores && params.ejesArticuladores.length > 0
    ? params.ejesArticuladores
    : ['Inclusión', 'Pensamiento crítico'];

  const momentosBase = METODOLOGIAS_MOMENTOS[metodologia] || METODOLOGIAS_MOMENTOS['Aprendizaje basado en proyectos comunitarios'];

  const sesiones = [];
  for (let i = 1; i <= numSesiones; i++) {
    const momentoIndex = (i - 1) % momentosBase.length;
    const momentoNombre = momentosBase[momentoIndex];

    sesiones.push({
      id: `s-fallback-${Date.now()}-${i}`,
      numero: i,
      momento: momentoNombre,
      proposito: `Sesión ${i}: Desarrollar la fase "${momentoNombre}" enfocada en ${pda.slice(0, 70)}...`,
      tiempo: '60 minutos',
      organizacion: i % 2 === 0 ? 'Equipos colaborativos de 4 a 5 alumnos' : 'Grupo en plenaria e individual',
      inicio: `1. Saludo y activación cognitiva mediante una pregunta generadora vinculada a la vida cotidiana.\n2. Recuperación de saberes previos mediante lluvia de ideas o registro gráfico en el pizarrón.\n3. Presentación clara del propósito de la sesión para orientar el esfuerzo del grupo.`,
      desarrollo: `1. Trabajo guiado con los Libros de Texto Gratuitos (Proyectos de ${tipoProyecto}) y materiales de apoyo.\n2. Indagación y elaboración en equipos: los alumnos contrastan ideas, dialogan y construyen acuerdos.\n3. Registro estructurado en cuadernos de trabajo y acompañamiento docente con retroalimentación formativa inmediata.`,
      cierre: `1. Puesta en común de hallazgos y avances de la sesión.\n2. Dinámica de coevaluación o autoevaluación reflexiva.\n3. Conclusiones breves y registro de compromisos para la siguiente sesión.`,
      actividadesDocente: `Fascilita el diálogo, plantea preguntas desafiantes, monitorea los equipos con atención diferenciada y registra observaciones formativas en lista de cotejo.`,
      actividadesAlumno: `Participa con respeto, comparte experiencias previas, colabora activamente en su equipo y elabora el registro en su cuaderno de trabajo.`,
      materiales: [
        'Libro de texto gratuito de la NEM',
        'Cuaderno de trabajo del alumno',
        'Papel bond, plumones y materiales de reuso',
        'Fichas de registro o bitácora escolar',
      ],
      productoEvidencia: `Evidencia de la sesión ${i}: Registro en cuaderno y avance del producto del proyecto`,
      evaluacion: `Formativa y procesual mediante observación directa del desempeño, diálogo y registro de avances`,
      instrumento: i === numSesiones ? 'Rúbrica analítica integral' : 'Lista de cotejo procesual',
      adecuaciones: params.contextoGrupo?.observaciones || 'Adecuación de tiempos y apoyos visuales para alumnos que requieren mayor acompañamiento.',
    });
  }

  return {
    titulo: tema.length > 5 && !tema.toLowerCase().startsWith('proyecto:')
      ? tema
      : `Proyecto Comunitario de ${campo}: ${grado}`,
    campoFormativo: campo,
    tipoProyecto,
    metodologia,
    grado,
    fase,
    temporalidad: `${Math.ceil(numSesiones / 5)} semanas (${numSesiones} sesiones)`,
    numeroSesiones: numSesiones,
    duracionSesion: '60 minutos',
    ejesArticuladores: ejes,
    contenido,
    pda,
    proposito: `Favorecer en los estudiantes de ${grado} la apropiación crítica de conocimientos vinculados a "${contenido}", mediante el trabajo reflexivo, participativo y colaborativo en el aula.`,
    problematica: params.contextoGrupo?.problematicas || 'Necesidad de fortalecer el pensamiento reflexivo y la convivencia colaborativa en el entorno escolar.',
    situacionContexto: params.contextoGrupo?.caracteristicasContexto || 'Comunidad escolar con diversidad de ritmos de aprendizaje y entusiasmo por proyectos vivenciales.',
    productoFinal: `Compendio ilustrado, cartel informativo o presentación comunitaria de resultados elaborada por los alumnos`,
    sesiones,
    usedFallback: true,
    fallbackNotice: 'Planeación estructurada conforme a la metodología oficial de la NEM (generada por motor pedagógico ante alta demanda temporal de servidores de IA). Totalmente editable.',
  };
}

export function buildNEMFallbackField(params: {
  campo: string;
  temaOProyecto: string;
  grado: string;
  campoFormativo: string;
  datosExistentes?: any;
}): string {
  const tema = params.temaOProyecto || 'el proyecto escolar';
  const grado = params.grado || 'primaria';
  const campo = params.campoFormativo || 'Lenguajes';

  switch (params.campo) {
    case 'proposito':
      return `Desarrollar en las y los estudiantes de ${grado} habilidades integrales de ${campo} mediante la indagación, la reflexión crítica y la creación colaborativa en torno a ${tema}, vinculando los saberes escolares con su contexto comunitario.`;
    case 'problematica':
      return `Dificultades observadas en la comprensión profunda de ${tema} y la necesidad de promover hábitos colaborativos y pensamiento crítico en el aula.`;
    case 'situacionContexto':
      return `Alumnos de ${grado} con diversos ritmos de aprendizaje, que requieren experiencias vivenciales, manipulativas y dialógicas para consolidar su autonomía y sentido de pertenencia comunitaria.`;
    case 'productoFinal':
      return `Muestra comunitaria o periódico mural interactivo con las producciones, textos y reflexiones elaboradas por los estudiantes durante el proyecto.`;
    case 'pda':
      return `Indaga, reflexiona y comunica de forma oral y escrita sus ideas y hallazgos en torno a ${tema}, empleando diversos registros y respetando la diversidad de opiniones de sus pares.`;
    case 'contenido':
      return `Estudio, apreciación y comunicación activa de problemáticas comunitarias y saberes significativos en ${campo}.`;
    default:
      return `Propuesta curricular pertinente para ${grado} en el campo de ${campo}, orientada a fortalecer aprendizajes significativos en el aula.`;
  }
}

export function buildNEMFallbackEvaluation(params: any) {
  const tipo = params.tipo || 'Rúbrica analítica';
  const titulo = params.titulo || 'Evaluación Formativa del Proyecto';
  const grado = params.grado || '4°';

  return {
    titulo,
    instrucciones: `Instrumento formativo para valorar el desempeño y los aprendizajes alcanzados por los alumnos de ${grado}. Marcar el nivel de logro observado y registrar observaciones cualitativas.`,
    escala: ['Sobresaliente', 'Satisfactorio', 'Básico', 'Requiere Apoyo'],
    indicadores: [
      {
        id: `ind-fallback-${Date.now()}-1`,
        descripcion: 'Comprensión y aplicación de los conceptos centrales del proyecto',
        ponderacion: 25,
        criterios: {
          nivelSobresaliente: 'Demuestra dominio cabal, explica con claridad y vincula los conceptos con situaciones reales.',
          nivelSatisfactorio: 'Comprende los conceptos principales y los aplica adecuadamente en las actividades solicitadas.',
          nivelBasico: 'Identifica nociones generales pero requiere apoyos puntuales para relacionarlos con el contexto.',
          nivelRequiereApoyo: 'Muestra dificultad para reconocer los conceptos clave; precisa orientación continua del docente.',
        },
      },
      {
        id: `ind-fallback-${Date.now()}-2`,
        descripcion: 'Participación activa, diálogo respetuoso y trabajo colaborativo',
        ponderacion: 25,
        criterios: {
          nivelSobresaliente: 'Promueve la inclusión, escucha con empatía y aporta propuestas valiosas para el equipo.',
          nivelSatisfactorio: 'Colabora de forma constante y cumple con las tareas asignadas en su equipo.',
          nivelBasico: 'Participa de forma intermitente o requiere mediación para integrarse plenamente.',
          nivelRequiereApoyo: 'Presenta dificultades para integrarse al trabajo colaborativo o respetar turnos de habla.',
        },
      },
      {
        id: `ind-fallback-${Date.now()}-3`,
        descripcion: 'Calidad, pertinencia y creatividad del producto o evidencia elaborada',
        ponderacion: 25,
        criterios: {
          nivelSobresaliente: 'El producto supera las expectativas, muestra originalidad, orden y rigor metodológico.',
          nivelSatisfactorio: 'El producto cumple satisfactoriamente con los criterios y propósitos establecidos.',
          nivelBasico: 'El producto está incompleto en algunos aspectos o carece de profundidad.',
          nivelRequiereApoyo: 'El producto no cumple con los elementos básicos requeridos para la evidencia.',
        },
      },
      {
        id: `ind-fallback-${Date.now()}-4`,
        descripcion: 'Reflexión metacognitiva sobre su propio proceso de aprendizaje',
        ponderacion: 25,
        criterios: {
          nivelSobresaliente: 'Identifica con lucidez sus logros, áreas de mejora y formula compromisos concretos.',
          nivelSatisfactorio: 'Reconoce lo que aprendió y las dificultades superadas durante el proyecto.',
          nivelBasico: 'Expresa de manera incipiente lo aprendido cuando se le pregunta directamente.',
          nivelRequiereApoyo: 'Muestra dificultad para autoevaluar su desempeño y proceso de trabajo.',
        },
      },
    ],
    usedFallback: true,
  };
}

export function buildNEMFallbackMaterial(params: any) {
  const tipo = params.tipo || 'Ficha de trabajo';
  const titulo = params.titulo || 'Actividad Didáctica Imprimible';
  const grado = params.grado || 'Educación Primaria';
  const tema = params.temaOContenido || 'Tema de Aprendizaje';

  return {
    titulo,
    instrucciones: `Lee con atención cada sección, dialoga con tus compañeros y responde en tu cuaderno o en esta ficha con letra clara y dibujos representativos.`,
    contenidoTexto: `
=====================================================
            ${titulo.toUpperCase()}
          Nivel: ${grado} • Proyecto NEM
=====================================================

1. ACTIVIDAD DETONADORA: ¿QUÉ SABEMOS DE ${tema.toUpperCase()}?
Escribe o dibuja dos cosas que conozcas sobre este tema y compártelas con tu compañero de banca:
[___________________________________________________________]
[___________________________________________________________]

2. LECTURA COMPRENSIVA / INDAGACIÓN:
El estudio de "${tema}" nos permite comprender cómo funcionan los fenómenos en nuestra comunidad y cómo podemos colaborar para mejorar nuestro entorno. Al trabajar juntos, descubrimos nuevas ideas y soluciones prácticas.

3. PREGUNTAS DE ANÁLISIS:
a) ¿Cuál es la idea principal que identificas en este tema?
b) ¿Cómo se relaciona este conocimiento con tu vida cotidiana en la escuela o en casa?
c) ¿Qué acción concreta puedes proponer para poner en práctica lo aprendido?

4. DESAFÍO CREATIVO:
Diseña en el recuadro un esquema, mapa mental o cartel breve que comunique una propuesta para compartir lo aprendido con la comunidad escolar.
    `.trim(),
    respuestasSugeridas: `Respuestas abiertas orientadas a la argumentación reflexiva, el rescate de saberes comunitarios y la creatividad del alumno en ${grado}.`,
    usedFallback: true,
  };
}
