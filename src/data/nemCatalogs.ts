import {
  CampoFormativo,
  EjeArticulador,
  FaseNEM,
  MetodologiaNEM,
  MomentoProyecto,
  TipoProyecto,
  DidacticPlan,
  ActivityBankItem,
  EvaluationInstrument,
  MaterialItem,
  FolderItem,
} from '../types';

export const CAMPOS_FORMATIVOS: Array<{
  id: CampoFormativo;
  nombre: string;
  color: string;
  bgLight: string;
  border: string;
  icono: string;
  descripcion: string;
  metodologiaSugerida: MetodologiaNEM;
}> = [
  {
    id: 'Lenguajes',
    nombre: 'Lenguajes',
    color: 'text-amber-700 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-300 dark:border-amber-700',
    icono: 'BookOpen',
    descripcion: 'Español, lenguas indígenas, lenguajes artísticos y lenguaje de señas.',
    metodologiaSugerida: 'Aprendizaje basado en proyectos comunitarios',
  },
  {
    id: 'Saberes y pensamiento científico',
    nombre: 'Saberes y pensamiento científico',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-300 dark:border-emerald-700',
    icono: 'FlaskConical',
    descripcion: 'Ciencias naturales, matemáticas y conocimientos comunitarios.',
    metodologiaSugerida: 'Aprendizaje basado en indagación (STEAM)',
  },
  {
    id: 'Ética, naturaleza y sociedades',
    nombre: 'Ética, naturaleza y sociedades',
    color: 'text-sky-700 dark:text-sky-400',
    bgLight: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-300 dark:border-sky-700',
    icono: 'Globe2',
    descripcion: 'Historia, geografía, formación cívica y ética y cuidado del medio ambiente.',
    metodologiaSugerida: 'Aprendizaje Basado en Problemas (ABP)',
  },
  {
    id: 'De lo humano y lo comunitario',
    nombre: 'De lo humano y lo comunitario',
    color: 'text-rose-700 dark:text-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-300 dark:border-rose-700',
    icono: 'Users',
    descripcion: 'Educación socioemocional, educación física, vida saludable y tutoría.',
    metodologiaSugerida: 'Aprendizaje Servicio (AS)',
  },
];

export const EJES_ARTICULADORES: Array<{
  id: EjeArticulador;
  nombre: string;
  icono: string;
  descripcion: string;
}> = [
  {
    id: 'Inclusión',
    nombre: 'Inclusión',
    icono: 'HeartHandshake',
    descripcion: 'Garantiza el derecho a la educación digna sin discriminación.',
  },
  {
    id: 'Pensamiento crítico',
    nombre: 'Pensamiento crítico',
    icono: 'Brain',
    descripcion: 'Capacidad de interrogar la realidad y oponerse a la injusticia.',
  },
  {
    id: 'Interculturalidad crítica',
    nombre: 'Interculturalidad crítica',
    icono: 'Languages',
    descripcion: 'Reconoce la diversidad epistémica y el diálogo entre saberes.',
  },
  {
    id: 'Igualdad de género',
    nombre: 'Igualdad de género',
    icono: 'Scale',
    descripcion: 'Transformación de patrones de desigualdad y violencia sexista.',
  },
  {
    id: 'Vida saludable',
    nombre: 'Vida saludable',
    icono: 'Apple',
    descripcion: 'Salud comunitaria, autocuidado, alimentación y actividad física.',
  },
  {
    id: 'Apropiación de las culturas a través de la lectura y la escritura',
    nombre: 'Apropiación de las culturas a través de la lectura y la escritura',
    icono: 'BookMarked',
    descripcion: 'Lectura dialógica y escritura comunitaria con sentido social.',
  },
  {
    id: 'Artes y experiencias estéticas',
    nombre: 'Artes y experiencias estéticas',
    icono: 'Palette',
    descripcion: 'Sensibilidad y creación artística con recursos de la comunidad.',
  },
];

export const METODOLOGIAS_NEM: Array<{
  id: MetodologiaNEM;
  nombre: string;
  campoPrincipal: CampoFormativo;
  descripcion: string;
  fasesMomentos: string[];
}> = [
  {
    id: 'Aprendizaje basado en proyectos comunitarios',
    nombre: 'Aprendizaje basado en proyectos comunitarios (11 momentos)',
    campoPrincipal: 'Lenguajes',
    descripcion: 'Metodología sociocrítica idónea para proyectos de aula, escolares y comunitarios en Lenguajes.',
    fasesMomentos: [
      '1. Identificación',
      '2. Recuperación',
      '3. Planificación',
      '4. Acercamiento',
      '5. Comprensión y producción',
      '6. Reconocimiento',
      '7. Concreción',
      '8. Integración',
      '9. Difusión',
      '10. Consideraciones',
      '11. Avances',
    ],
  },
  {
    id: 'Aprendizaje basado en indagación (STEAM)',
    nombre: 'Aprendizaje basado en indagación (STEAM)',
    campoPrincipal: 'Saberes y pensamiento científico',
    descripcion: 'Enfoque de 5 fases orientado a resolver interrogantes científicas y matemáticas del entorno.',
    fasesMomentos: [
      'Fase 1. Introducción al tema y conocimientos previos',
      'Fase 2. Diseño de la investigación / Indagación',
      'Fase 3. Organización y estructuración de respuestas',
      'Fase 4. Presentación de resultados y aplicación',
      'Fase 5. Metacognición y reflexión del proceso',
    ],
  },
  {
    id: 'Aprendizaje Basado en Problemas (ABP)',
    nombre: 'Aprendizaje Basado en Problemas (ABP)',
    campoPrincipal: 'Ética, naturaleza y sociedades',
    descripcion: 'Estructurado en 6 pasos para abordar problemáticas sociales, ambientales y comunitarias.',
    fasesMomentos: [
      '1. Presentemos',
      '2. Recolectemos',
      '3. Formulemos el problema',
      '4. Organicemos la experiencia',
      '5. Vivamos la experiencia',
      '6. Resultados y análisis',
    ],
  },
  {
    id: 'Aprendizaje Servicio (AS)',
    nombre: 'Aprendizaje Servicio (AS)',
    campoPrincipal: 'De lo humano y lo comunitario',
    descripcion: 'Articula aprendizajes curriculares con un servicio solidario y tangible a la comunidad.',
    fasesMomentos: [
      '1. Punto de partida',
      '2. Lo que sé y lo que quiero saber',
      '3. Organicemos las actividades',
      '4. Creatividad en marcha',
      '5. Compartimos y evaluamos lo aprendido',
    ],
  },
  {
    id: 'Secuencia didáctica',
    nombre: 'Secuencia didáctica formativa (Inicio, Desarrollo y Cierre)',
    campoPrincipal: 'Lenguajes',
    descripcion: 'Organización progresiva de actividades centrada en contenidos específicos.',
    fasesMomentos: ['Inicio', 'Desarrollo', 'Cierre'],
  },
  {
    id: 'Otra metodología',
    nombre: 'Otra metodología didáctica',
    campoPrincipal: 'Lenguajes',
    descripcion: 'Estructura flexible adaptada a necesidades específicas del docente.',
    fasesMomentos: ['Inicio', 'Desarrollo', 'Cierre'],
  },
];

export const MOMENTOS_PROYECTOS_COMUNITARIOS: MomentoProyecto[] = [
  '1. Identificación',
  '2. Recuperación',
  '3. Planificación',
  '4. Acercamiento',
  '5. Comprensión y producción',
  '6. Reconocimiento',
  '7. Concreción',
  '8. Integración',
  '9. Difusión',
  '10. Consideraciones',
  '11. Avances',
];

export const TIPOS_PROYECTO: TipoProyecto[] = [
  'Aula',
  'Escolar',
  'Comunitario',
  'Secuencia didáctica',
  'Situación didáctica',
  'Otro',
];

export const GRADOS_PRIMARIA = [
  { grado: '1°', fase: 'Fase 3' as FaseNEM },
  { grado: '2°', fase: 'Fase 3' as FaseNEM },
  { grado: '3°', fase: 'Fase 4' as FaseNEM },
  { grado: '4°', fase: 'Fase 4' as FaseNEM },
  { grado: '5°', fase: 'Fase 5' as FaseNEM },
  { grado: '6°', fase: 'Fase 5' as FaseNEM },
];

export const CURRICULO_SUGERIDO: Record<
  string,
  Array<{ contenido: string; pda: string; campo: CampoFormativo }>
> = {
  '4°': [
    {
      campo: 'Lenguajes',
      contenido: 'Comprensión y producción de textos instructivos para realizar actividades escolares y participar en diversos juegos.',
      pda: 'Analiza las características de diversos textos instructivos (reglamentos, recetas, instructivos de juegos) e interpreta la información que presentan empleando verbos en infinitivo o imperativo.',
    },
    {
      campo: 'Lenguajes',
      contenido: 'Narración de sucesos del pasado y del presente.',
      pda: 'Reconoce y usa diversos estilos, recursos y estrategias narrativas; establece relaciones causales y temporales entre acontecimientos del entorno comunal y escolar.',
    },
    {
      campo: 'Saberes y pensamiento científico',
      contenido: 'Estructura y funcionamiento del cuerpo humano: sistemas locomotor y digestivo, así como prácticas para su cuidado, desde su contexto sociocultural.',
      pda: 'Identifica y describe la estructura y funciones del sistema digestivo, así como su relación con el sistema circulatorio, a partir de representar la ruta de los alimentos durante la ingestión, digestión y absorción.',
    },
    {
      campo: 'Saberes y pensamiento científico',
      contenido: 'Multiplicación y división, su relación como operaciones inversas.',
      pda: 'Resuelve situaciones problemáticas vinculadas a su contexto que implican multiplicaciones de números naturales de hasta tres por dos cifras a partir de diversas descomposiciones.',
    },
    {
      campo: 'Ética, naturaleza y sociedades',
      contenido: 'La construcción colectiva de la paz: situaciones que generan diferencias y conflictos que afectan la convivencia entre las personas y grupos de pertenencia.',
      pda: 'Comprende que la paz es una construcción colectiva que demanda analizar críticamente las causas de los conflictos y propone alternativas basadas en el diálogo empático y la mediación.',
    },
    {
      campo: 'De lo humano y lo comunitario',
      contenido: 'La escuela como espacio de convivencia, colaboración y aprendizaje.',
      pda: 'Participa en la toma de decisiones sobre el funcionamiento de la escuela y la relación con la comunidad escolar para proponer mejoras en la convivencia y el bienestar común.',
    },
  ],
};

// 3 PRELOADED REAL DEMO PLANS AS REQUESTED IN REQ 41
export const DEMO_PLANS: DidacticPlan[] = [
  {
    id: 'demo-plan-1',
    titulo: 'Club de Jóvenes Lectores y Creadores de Cuentos',
    tipoProyecto: 'Aula',
    campoFormativo: 'Lenguajes',
    camposSecundarios: ['De lo humano y lo comunitario'],
    grado: '4°',
    grupo: 'A',
    fase: 'Fase 4',
    temporalidad: '2 semanas (10 sesiones)',
    numeroSesiones: 10,
    duracionSesion: '60 minutos',
    ejesArticuladores: [
      'Inclusión',
      'Pensamiento crítico',
      'Apropiación de las culturas a través de la lectura y la escritura',
      'Artes y experiencias estéticas',
    ],
    metodologia: 'Aprendizaje basado en proyectos comunitarios',
    contenido: 'Comprensión y producción de textos narrativos del entorno y la comunidad.',
    pda: 'Reconoce y emplea recursos literarios en la narración; identifica ideas principales, infiere intenciones de personajes y crea cuentos ilustrados para compartirlos con la comunidad escolar.',
    proposito: 'Fomentar la comprensión lectora crítica y la expresión escrita a través del diseño colectivo de una antología ilustrada de relatos de su comunidad.',
    problematica: 'Bajo nivel de inferencia lectora y dificultad para organizar secuencialmente hechos en textos propios detectado en el diagnóstico inicial.',
    situacionContexto: 'Comunidad semiurbana con ricas tradiciones orales transmitidas por abuelos y familias que no han sido recopiladas por los estudiantes.',
    productoFinal: 'Antología Ilustrada de Cuentos y Leyendas Locales "Las voces de nuestra escuela".',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evaluacionGeneral: {
      criterios: [
        'Identificación de ideas principales y secundarias en lecturas modelo.',
        'Uso de conectores temporales y causales en redacción.',
        'Creatividad en la creación del borrador y producto final.',
      ],
      instrumentos: ['Rúbrica de producción de textos', 'Lista de cotejo de lectura dialógica'],
      evidencias: ['Fichas de lectura reflexiva', 'Borradores corregidos', 'Cuento ilustrado encuadernado'],
    },
    materialesGenerales: [
      'Libros de texto gratuitos (Múltiples Lenguajes y Proyectos de Aula)',
      'Hojas blancas y de colores',
      'Colores, plumones y pegamento',
      'Cuaderno del alumno',
    ],
    sesiones: [
      {
        id: 's1-1',
        numero: 1,
        momento: '1. Identificación',
        proposito: 'Explorar los saberes previos de los alumnos sobre qué es narrar y qué leyendas conocen de su comunidad.',
        tiempo: '60 min',
        organizacion: 'Plenaria y equipos pequeños',
        inicio: 'El docente presenta una caja misteriosa con objetos tradicionales de la región. Se plantean preguntas detonadoras: ¿Qué historia puede contar este objeto? ¿Quién nos ha contado un relato inolvidable?',
        desarrollo: 'Lectura compartida en voz alta del relato "El Guardián del Maizal" del libro Múltiples Lenguajes. En parejas, los alumnos identifican: ¿Quién es el protagonista? ¿Qué problema enfrentó? ¿Cómo se resolvió?',
        cierre: 'Puesta en común donde cada pareja comparte una palabra clave anotada en el pizarrón. Registro en el cuaderno de la definición colectiva de "narración".',
        actividadesDocente: 'Modela lectura con entonación y modulación, formula preguntas inferenciales y guía la síntesis.',
        actividadesAlumno: 'Escuchan con atención, dialogan en binas y registran ideas en su cuaderno de trabajo.',
        materiales: ['Caja misteriosa con 3 objetos', 'Libro Múltiples Lenguajes 4°', 'Cuaderno del alumno'],
        productoEvidencia: 'Mapa conceptual inicial en el cuaderno sobre los elementos de la narración.',
        evaluacion: 'Formativa: participación activa e inferencias durante el diálogo guiado.',
        instrumento: 'Guía de observación dialógica',
        adecuaciones: 'Uso de pictogramas y apoyo personalizado para alumnos que requieren afianzar lectura fluida.',
      },
      {
        id: 's1-2',
        numero: 2,
        momento: '2. Recuperación',
        proposito: 'Reconocer la diferencia entre idea principal e ideas secundarias a través del análisis de textos breves.',
        tiempo: '60 min',
        organizacion: 'Equipos de 4 alumnos',
        inicio: 'Juego relámpago: "El telegrama". Se da un párrafo largo y los alumnos deben resumirlo en máximo 10 palabras sin perder el sentido.',
        desarrollo: 'Análisis guiado con el texto "La fiesta de San Juan". Cada equipo resalta con marca-textos amarillo la idea central y con verde los detalles. El docente pasa mesa por mesa guiando la justificación de elecciones.',
        cierre: 'Confrontación de hallazgos. Se reflexiona: ¿Por qué es importante no confundir el detalle curioso con la idea esencial?',
        actividadesDocente: 'Asesora a los equipos, modela la técnica del subrayado selectivo.',
        actividadesAlumno: 'Debaten en equipo, subrayan y justifican su selección ante sus compañeros.',
        materiales: ['Ficha de lectura impresa', 'Marca-textos bicolor', 'Plumones para pizarrón'],
        productoEvidencia: 'Ficha de trabajo con identificación justificada de idea principal.',
        evaluacion: 'Formativa: precisión al diferenciar mensaje nuclear de complementos.',
        instrumento: 'Lista de cotejo',
        adecuaciones: 'Lectura asistida en binas mixtas tutor-tutorado.',
      },
      {
        id: 's1-3',
        numero: 3,
        momento: '3. Planificación',
        proposito: 'Organizar el cronograma y comisiones para la creación de la antología comunitaria.',
        tiempo: '60 min',
        organizacion: 'Asamblea grupal',
        inicio: 'Presentación de la meta del proyecto: "Crearemos la primera Antología Ilustrada de nuestro grupo para donarla a la biblioteca escolar".',
        desarrollo: 'Construcción participativa del planificador visual en papel bond: fechas de entrevistas a familiares, días de redacción de borradores, revisión entre pares y encuadernación.',
        cierre: 'Cada estudiante firma simbólicamente el compromiso en el mural y copia la ruta de trabajo en su libreta.',
        actividadesDocente: 'Facilita la asamblea, registra acuerdos y distribuye roles equitativos.',
        actividadesAlumno: 'Proponen tareas, eligen comisiones y registran acuerdos.',
        materiales: ['Papel bond cuadrícula', 'Marcadores', 'Hojas de notas'],
        productoEvidencia: 'Planificador grupal visible en aula y ruta individual en cuaderno.',
        evaluacion: 'Autoevaluación sobre la disposición al trabajo colaborativo.',
        instrumento: 'Escala estimativa de participación',
        adecuaciones: 'Asignación de roles según talentos específicos (dibujo, caligrafía, organización).',
      },
      {
        id: 's1-4',
        numero: 4,
        momento: '4. Acercamiento',
        proposito: 'Analizar entrevistas realizadas en casa y seleccionar la anécdota o leyenda que transformarán en cuento.',
        tiempo: '60 min',
        organizacion: 'Individual y binas de intercambio',
        inicio: 'Dinámica "El micrófono de oro": 3 alumnos comparten anécdotas sorprendentes que les contaron sus abuelos o padres.',
        desarrollo: 'Taller de fichas de personajes: cada alumno define quién será el protagonista, antagonista, lugar y conflicto central de su relato basándose en su entrevista.',
        cierre: 'Lectura cruzada en binas: el compañero brinda una sugerencia para hacer el inicio más intrigante.',
        actividadesDocente: 'Orienta la selección de temas respetando la identidad cultural de cada familia.',
        actividadesAlumno: 'Diseñan la ficha técnica de su personaje y esquema de inicio-desarrollo-desenlace.',
        materiales: ['Entrevistas previas familiares', 'Ficha esquemática de personajes'],
        productoEvidencia: 'Esquema narrativo inicial (inicio, nudo, desenlace).',
        evaluacion: 'Formativa: coherencia de la estructura básica del relato.',
        instrumento: 'Rúbrica diagnóstica de estructura narrativa',
        adecuaciones: 'Opción de grabar notas de voz para alumnos con barreras de lectoescritura.',
      },
      {
        id: 's1-5',
        numero: 5,
        momento: '5. Comprensión y producción',
        proposito: 'Redactar el primer borrador del cuento empleando nexos temporales y descripciones adjetivadas.',
        tiempo: '60 min',
        organizacion: 'Individual con asesoría focalizada',
        inicio: 'Mini-lección docente: Uso de palabras mágicas temporales (Había una vez, de pronto, más adelante, finalmente).',
        desarrollo: 'Redacción silenciosa acompañada. Los alumnos escriben su borrador a renglón abierto dejando espacio para futuras correcciones. El docente brinda retroalimentación al paso.',
        cierre: 'Ronda de aplausos y lectura de los tres párrafos de inicio más impactantes.',
        actividadesDocente: 'Brinda apoyo ortográfico y semántico sin juzgar, estimula la imaginación.',
        actividadesAlumno: 'Escriben su primer borrador concentrándose en el flujo de ideas.',
        materiales: ['Cuaderno de rayas', 'Diccionario escolar', 'Ficha de nexos temporales'],
        productoEvidencia: 'Borrador completo N° 1 del cuento.',
        evaluacion: 'Formativa procesual: presencia de secuencia lógica temporal.',
        instrumento: 'Lista de cotejo procesual',
        adecuaciones: 'Plantilla de inicio de frases para estudiantes que experimenten bloqueo creativo.',
      },
    ],
  },
  {
    id: 'demo-plan-2',
    titulo: 'Guardianes del Cuerpo Humano y la Alimentación Consciente',
    tipoProyecto: 'Escolar',
    campoFormativo: 'Saberes y pensamiento científico',
    camposSecundarios: ['De lo humano y lo comunitario'],
    grado: '4°',
    grupo: 'A',
    fase: 'Fase 4',
    temporalidad: '2 semanas (10 sesiones)',
    numeroSesiones: 10,
    duracionSesion: '60 minutos',
    ejesArticuladores: ['Pensamiento crítico', 'Vida saludable', 'Inclusión'],
    metodologia: 'Aprendizaje basado en indagación (STEAM)',
    contenido: 'Estructura y funcionamiento del cuerpo humano: sistema digestivo y locomotor.',
    pda: 'Identifica y describe la estructura y funciones del sistema digestivo, así como su relación con el sistema circulatorio, a partir de representar la ruta de los alimentos durante la ingestión, digestión y absorción.',
    proposito: 'Comprender cómo viajan y se absorben los nutrientes en el cuerpo humano mediante modelos interactivos para promover una lonchera escolar balanceada.',
    problematica: 'Alto consumo de bebidas azucaradas y alimentos ultraprocesados durante el recreo escolar que afecta la energía y salud de los educandos.',
    situacionContexto: 'Tiendita escolar y puestos externos con amplia oferta de frituras y escasa fruta fresca.',
    productoFinal: 'Maqueta interactiva del sistema digestivo con materiales reciclados y Guía ilustrada "Mi Lonchera Nutritiva".',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evaluacionGeneral: {
      criterios: [
        'Explicación secuencial del trayecto del bolo alimenticio y quimo.',
        'Comprensión del papel de la saliva, estómago, hígado e intestinos.',
        'Propuesta argumentada de menús saludables basados en el Plato del Bien Comer.',
      ],
      instrumentos: ['Rúbrica de indagación STEAM', 'Lista de cotejo de maqueta'],
      evidencias: ['Bitácora de indagación científica', 'Maqueta con materiales reutilizados', 'Folleto de lonchera'],
    },
    materialesGenerales: [
      'Material de reúso (mangueras transparentes, botellas, cartón, plastilina)',
      'Libro Nuestros Saberes 4°',
      'Espejos pequeños para observar cavidad bucal',
      'Alimentos muestra (pan, manzana, agua)',
    ],
    sesiones: [
      {
        id: 's2-1',
        numero: 1,
        momento: 'Fase 1. Introducción al tema y conocimientos previos',
        proposito: 'Explorar qué sucede con la comida una vez que entra en nuestra boca mediante un experimento sensorial.',
        tiempo: '60 min',
        organizacion: 'Equipos de 4 y plenaria',
        inicio: 'Se entrega a cada alumno un trozo pequeño de tortilla o pan. Se pide masticarlo 30 veces sin tragar. ¿Qué sienten? ¿Por qué cambia de sabor y consistencia?',
        desarrollo: 'Indagación en el libro Nuestros Saberes sobre la saliva y los dientes. Elaboración en equipos de una hipótesis gráfica: ¿A dónde va el alimento después de tragar?',
        cierre: 'Plenaria de contraste de hipótesis. Registro en el cuaderno de la "Pregunta investigable de la semana".',
        actividadesDocente: 'Facilita el experimento sensorial, registra preguntas de los alumnos en el pizarrón.',
        actividadesAlumno: 'Experimentan con calma, anotan observaciones y dialogan en equipo.',
        materiales: ['Pan integral o galletas', 'Agua potable', 'Cuaderno de indagación'],
        productoEvidencia: 'Dibujo y registro de hipótesis sobre el camino de la comida.',
        evaluacion: 'Formativa: curiosidad científica y formulación de preguntas.',
        instrumento: 'Registro anecdótico',
        adecuaciones: 'Atención a alergias alimentarias previas en la selección de la muestra.',
      },
    ],
  },
  {
    id: 'demo-plan-3',
    titulo: 'Comunidad en Armonía: Mediación Pacífica y Convivencia',
    tipoProyecto: 'Comunitario',
    campoFormativo: 'Ética, naturaleza y sociedades',
    camposSecundarios: ['De lo humano y lo comunitario', 'Lenguajes'],
    grado: '4°',
    grupo: 'A',
    fase: 'Fase 4',
    temporalidad: '2 semanas (8 sesiones)',
    numeroSesiones: 8,
    duracionSesion: '50 minutos',
    ejesArticuladores: ['Inclusión', 'Pensamiento crítico', 'Igualdad de género'],
    metodologia: 'Aprendizaje Basado en Problemas (ABP)',
    contenido: 'La construcción colectiva de la paz: situaciones que generan diferencias y conflictos en el aula y patio escolar.',
    pda: 'Comprende que la paz es una construcción colectiva; analiza críticamente las causas de desacuerdos cotidianos y propone alternativas basadas en la escucha activa y la mediación pacífica.',
    proposito: 'Instalar la "Mesa de la Paz y el Diálogo" en el aula para resolver controversias escolares sin gritos ni exclusión.',
    problematica: 'Discusiones frecuentes en los juegos de pelota a la hora del recreo por desacuerdos en las reglas y falta de mediadores.',
    situacionContexto: 'Patio escolar compartido con otros grupos de primaria alta y baja.',
    productoFinal: 'Reglamento de convivencia ilustrado y buzón de acuerdos "La Mesa de la Paz".',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evaluacionGeneral: {
      criterios: [
        'Diferenciación entre conflicto natural y violencia.',
        'Habilidad de escucha activa y empatía.',
        'Participación equitativa en la toma de acuerdos de aula.',
      ],
      instrumentos: ['Escala estimativa de convivencia', 'Guía de observación'],
      evidencias: ['Árbol de causas y consecuencias del conflicto', 'Decálogo de paz ilustrado'],
    },
    materialesGenerales: ['Cartulinas', 'Plumones', 'Caja para buzón de acuerdos', 'Libro Ética, Naturaleza y Sociedades 4°'],
    sesiones: [
      {
        id: 's3-1',
        numero: 1,
        momento: '1. Presentemos',
        proposito: 'Analizar un caso hipotético de desacuerdo escolar para identificar emociones y reacciones.',
        tiempo: '50 min',
        organizacion: 'Círculo de diálogo en plenaria',
        inicio: 'Dramatización guiada por dos alumnos: "El balón que dos querían al mismo tiempo". Se congela la escena antes del desenlace.',
        desarrollo: 'Preguntas para la reflexión: ¿Cómo se sentían ambos? ¿Qué pasaría si se gritan? ¿Qué pasaría si conversan? Creación del termómetro de emociones.',
        cierre: 'Reflexión escrita: "El conflicto no es malo, lo malo es cómo reaccionamos".',
        actividadesDocente: 'Modera el círculo de la palabra garantizando turnos de voz respetuosos.',
        actividadesAlumno: 'Expresan opiniones honestas sin juzgar a los compañeros.',
        materiales: ['Balón de fútbol', 'Tarjetas de emociones'],
        productoEvidencia: 'Termómetro emocional dibujado en el cuaderno.',
        evaluacion: 'Formativa: capacidad de empatía ante perspectivas ajenas.',
        instrumento: 'Guía de observación',
        adecuaciones: 'Validación emocional y apoyo a alumnos con timidez para hablar en público.',
      },
    ],
  },
];

export const DEMO_ACTIVITIES: ActivityBankItem[] = [
  {
    id: 'act-1',
    titulo: 'Taller del Detective de Ideas Principales',
    campoFormativo: 'Lenguajes',
    grado: '4°',
    contenido: 'Comprensión y producción de textos informativos.',
    pda: 'Identifica ideas centrales y secundarias en textos de divulgación científica.',
    descripcion: 'Los alumnos reciben "expedientes secretos" (textos breves) y con una lupa de cartón deben rastrear las oraciones que responden a ¿De qué trata principalmente? Diferenciando pistas accesorias de la revelación principal.',
    tiempo: '45 minutos',
    materiales: ['Textos breves impresos', 'Lupas de cartulina', 'Marca-textos'],
    producto: 'Expediente resuelto con justificación de la idea principal.',
    evaluacion: 'Rúbrica analítica de comprensión inferencial.',
    etiquetas: ['Lectura', 'Comprensión', 'Inferencia', 'Lúdico'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-2',
    titulo: 'Simulador del Viaje de la Manzana (Digestión)',
    campoFormativo: 'Saberes y pensamiento científico',
    grado: '4°',
    contenido: 'Estructura y funcionamiento del cuerpo humano.',
    pda: 'Describe la función de la boca, esófago, estómago e intestinos en la asimilación.',
    descripcion: 'En equipos de 5, cada alumno asume el rol de un órgano del cuerpo humano y se pasan una pelota de estambre realizando los movimientos peristálticos correspondientes y explicando la transformación química.',
    tiempo: '50 minutos',
    materiales: ['Gafetes de órganos', 'Pelota suave', 'Cinta para marcar en el piso'],
    producto: 'Esquema secuencial narrado y dibujado en la libreta.',
    evaluacion: 'Lista de cotejo de dominio conceptual.',
    etiquetas: ['Ciencias', 'Cuerpo Humano', 'Kinestésico', 'Juego de rol'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-3',
    titulo: 'El Semáforo de la Resolución Pacífica',
    campoFormativo: 'Ética, naturaleza y sociedades',
    grado: '4°',
    contenido: 'Construcción colectiva de la paz y resolución de conflictos.',
    pda: 'Aplica técnicas de autorregulación y diálogo empático ante discrepancias.',
    descripcion: 'Construcción de un semáforo interactivo donde el rojo es "Alto y respiro", el amarillo es "Pienso y escucho", y el verde es "Propongo una solución justa".',
    tiempo: '40 minutos',
    materiales: ['Círculos de foami rojo, amarillo y verde', 'Palitos de madera', 'Cuaderno'],
    producto: 'Semáforo personal de autocontrol y diálogo.',
    evaluacion: 'Escala estimativa de actitudes socioemocionales.',
    etiquetas: ['Paz', 'Convivencia', 'Socioemocional', 'Valores'],
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_EVALUATIONS: EvaluationInstrument[] = [
  {
    id: 'eval-1',
    titulo: 'Rúbrica Analítica de Comprensión Lectora y Redacción',
    tipo: 'Rúbrica',
    campoFormativo: 'Lenguajes',
    grado: '4°',
    contenido: 'Comprensión y producción de textos narrativos.',
    pda: 'Reconoce y usa diversos estilos narrativos e infiere ideas principales.',
    proposito: 'Evaluar formativamente el nivel de profundidad inferencial y la coherencia en la redacción.',
    productoEvidencia: 'Cuento ilustrado individual.',
    instrucciones: 'Marque el nivel de desempeño alcanzado por el alumno en cada uno de los criterios formativos.',
    escala: ['Sobresaliente (10)', 'Satisfactorio (8-9)', 'Básico (6-7)', 'Requiere Apoyo (5)'],
    indicadores: [
      {
        id: 'ind-1',
        descripcion: 'Identificación y desarrollo de ideas principales',
        criterios: {
          nivelSobresaliente: 'Identifica con total claridad la idea central e infiere mensajes implícitos con sustento textual.',
          nivelSatisfactorio: 'Identifica la idea principal de forma autónoma pero requiere leve guía en inferencias sutiles.',
          nivelBasico: 'Localiza información explícita pero confunde detalles accesorios con la idea central.',
          nivelRequiereApoyo: 'Dificultad para localizar la idea principal aun con apoyo individualizado.',
        },
        ponderacion: 30,
      },
      {
        id: 'ind-2',
        descripcion: 'Coherencia y cohesión temporal en la narración',
        criterios: {
          nivelSobresaliente: 'Emplea variados nexos temporales y causales; las oraciones se articulan con fluidez y sentido.',
          nivelSatisfactorio: 'Utiliza nexos temporales básicos (luego, después) manteniendo la secuencia lógica.',
          nivelBasico: 'Presenta saltos temporales que dificultan parcialmente la comprensión del relato.',
          nivelRequiereApoyo: 'Ideas aisladas sin conectores que evidencien orden temporal.',
        },
        ponderacion: 30,
      },
      {
        id: 'ind-3',
        descripcion: 'Creatividad y uso de adjetivos / descripciones',
        criterios: {
          nivelSobresaliente: 'Enriquece su historia con vívidas descripciones de personajes, ambientes y emociones.',
          nivelSatisfactorio: 'Describe las características principales de los personajes y escenarios.',
          nivelBasico: 'Descripciones muy escuetas limitadas a colores o tamaños.',
          nivelRequiereApoyo: 'No incluye descripciones de personajes ni del contexto.',
        },
        ponderacion: 20,
      },
      {
        id: 'ind-4',
        descripcion: 'Convenciones ortográficas y puntuación',
        criterios: {
          nivelSobresaliente: 'Aplica adecuadamente puntos, mayúsculas, comas y signos de interrogación/admiración.',
          nivelSatisfactorio: 'Comete pocos errores que no impiden la lectura fluida del texto.',
          nivelBasico: 'Ocurrencias frecuentes de falta de mayúsculas y puntos finales.',
          nivelRequiereApoyo: 'Escritura continua sin signos de puntuación.',
        },
        ponderacion: 20,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'eval-2',
    titulo: 'Lista de Cotejo para Modelo del Sistema Digestivo',
    tipo: 'Lista de cotejo',
    campoFormativo: 'Saberes y pensamiento científico',
    grado: '4°',
    contenido: 'Estructura y funcionamiento del sistema digestivo.',
    pda: 'Identifica y describe la estructura y funciones de los órganos del aparato digestivo.',
    proposito: 'Verificar la inclusión de órganos clave y la explicación correcta del trayecto de los alimentos.',
    productoEvidencia: 'Maqueta interactiva con material reciclado.',
    instrucciones: 'Señale Sí o No según se observe el cumplimiento del indicador.',
    escala: ['Cumple con suficiencia', 'En proceso de logro', 'No observado'],
    indicadores: [
      {
        id: 'ind-c1',
        descripcion: 'Representa en orden secuencial: boca, esófago, estómago, hígado, páncreas e intestinos.',
      },
      {
        id: 'ind-c2',
        descripcion: 'Explica de forma clara la diferencia entre absorción de nutrientes y expulsión de desechos.',
      },
      {
        id: 'ind-c3',
        descripcion: 'Utilizó prioritariamente materiales reciclados y cuidó la limpieza de la presentación.',
      },
      {
        id: 'ind-c4',
        descripcion: 'Responde acertadamente a preguntas sobre la función de la saliva y jugos gástricos.',
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_FOLDERS: FolderItem[] = [
  { id: 'f-1', nombre: '4° Primaria - Primer Periodo', color: '#3b82f6', createdAt: new Date().toISOString() },
  { id: 'f-2', nombre: 'Proyectos Comunitarios', color: '#10b981', createdAt: new Date().toISOString() },
  { id: 'f-3', nombre: 'Comprensión Lectora y Español', color: '#f59e0b', createdAt: new Date().toISOString() },
  { id: 'f-4', nombre: 'Evaluaciones y Rúbricas', color: '#8b5cf6', createdAt: new Date().toISOString() },
];

export const DEMO_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    titulo: 'Ficha de Comprensión: Los Guardianes de la Selva Maya',
    tipo: 'Ficha de trabajo',
    grado: '4°',
    campoFormativo: 'Lenguajes',
    instrucciones: 'Lee atentamente el texto y responde las preguntas de inferencia en tu cuaderno.',
    contenidoTexto: `
LECTURA COMPRENSIVA: "LOS GUARDIANES DE LA SELVA MAYA"

En el corazón de la península de Yucatán, don Jacinto y su nieta Itzel caminan al amanecer entre ceibas centenarias. Itzel lleva en su mano una pequeña libreta donde dibuja cada ave que canta entre las ramas.
—Abuelo, ¿por qué cuidamos tanto a las abejas meliponas? —preguntó la niña señalando los jobones de madera.
—Porque ellas no tienen aguijón, Itzel, pero tienen el poder más grande: polinizan las flores de la selva y nos dan una miel sagrada que sana a nuestra comunidad desde tiempos de nuestros bisabuelos. Si la selva florece, florecemos nosotros.

De pronto, un sonido metálico interrumpió el canto del pájaro relojero. A lo lejos, una máquina talaba árboles viejos. Don Jacinto tomó aire, apretó la mano de su nieta y dijo con voz firme:
—Es hora de convocar a la asamblea del ejido. La tierra no se vende, la tierra se defiende con la palabra.

PREGUNTAS DE COMPRENSIÓN:
1. ¿Cuál es la idea principal de la conversación entre Itzel y su abuelo?
2. ¿Qué representan las abejas meliponas para la comunidad de don Jacinto?
3. ¿Por qué el autor menciona que "la tierra se defiende con la palabra"?
4. Si estuvieras en la asamblea del ejido, ¿qué propuesta pacífica harías para proteger la selva?
    `.trim(),
    respuestasSugeridas: '1. El cuidado comunitario de la naturaleza y la importancia de la identidad cultural. 2. La vida comunitaria y la salud. 3. El uso del diálogo y la mediación pacífica en lugar de la violencia.',
    createdAt: new Date().toISOString(),
  },
];
