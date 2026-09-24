export type FaseNEM = 'Fase 3' | 'Fase 4' | 'Fase 5';

export type CampoFormativo =
  | 'Lenguajes'
  | 'Saberes y pensamiento científico'
  | 'Ética, naturaleza y sociedades'
  | 'De lo humano y lo comunitario';

export type EjeArticulador =
  | 'Inclusión'
  | 'Pensamiento crítico'
  | 'Interculturalidad crítica'
  | 'Igualdad de género'
  | 'Vida saludable'
  | 'Apropiación de las culturas a través de la lectura y la escritura'
  | 'Artes y experiencias estéticas';

export type TipoProyecto =
  | 'Aula'
  | 'Escolar'
  | 'Comunitario'
  | 'Secuencia didáctica'
  | 'Situación didáctica'
  | 'Otro';

export type MetodologiaNEM =
  | 'Aprendizaje basado en proyectos comunitarios'
  | 'Aprendizaje basado en indagación (STEAM)'
  | 'Aprendizaje Basado en Problemas (ABP)'
  | 'Aprendizaje Servicio (AS)'
  | 'Secuencia didáctica'
  | 'Otra metodología';

export type MomentoProyecto =
  | '1. Identificación'
  | '2. Recuperación'
  | '3. Planificación'
  | '4. Acercamiento'
  | '5. Comprensión y producción'
  | '6. Reconocimiento'
  | '7. Concreción'
  | '8. Integración'
  | '9. Difusión'
  | '10. Consideraciones'
  | '11. Avances'
  | 'Inicio'
  | 'Desarrollo'
  | 'Cierre'
  | 'Otro';

export interface SesionPlan {
  id: string;
  numero: number;
  momento: MomentoProyecto | string;
  proposito: string;
  tiempo: string; // ej. 60 min
  organizacion: 'Individual' | 'Equipos' | 'Grupal' | 'Plenaria' | string;
  inicio: string;
  desarrollo: string;
  cierre: string;
  actividadesDocente: string;
  actividadesAlumno: string;
  materiales: string[];
  productoEvidencia: string;
  evaluacion: string;
  instrumento: string;
  adecuaciones: string;
}

export interface DidacticPlan {
  id: string;
  titulo: string;
  tipoProyecto: TipoProyecto;
  campoFormativo: CampoFormativo;
  camposSecundarios?: CampoFormativo[];
  grado: string; // ej. "4°"
  grupo: string; // ej. "A"
  fase: FaseNEM;
  temporalidad: string; // ej. "2 semanas (10 sesiones)"
  numeroSesiones: number;
  duracionSesion: string; // ej. "50 a 60 min"
  ejesArticuladores: EjeArticulador[];
  metodologia: MetodologiaNEM;
  contenido: string;
  pda: string;
  proposito: string;
  problematica: string;
  situacionContexto: string;
  productoFinal: string;
  sesiones: SesionPlan[];
  evaluacionGeneral?: {
    criterios: string[];
    instrumentos: string[];
    evidencias: string[];
  };
  materialesGenerales?: string[];
  folderId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  nombre: string;
  escuela: string;
  cct: string;
  entidad: string;
  municipio: string;
  grado: string;
  grupo: string;
  cicloEscolar: string;
  turno: 'Matutino' | 'Vespertino' | 'Jornada Ampliada' | 'Tiempo Completo';
}

export interface GroupContext {
  grado: string;
  grupo: string;
  numeroAlumnos: number;
  fortalezas: string;
  necesidades: string;
  areasOportunidad: string;
  problematicas: string;
  caracteristicasContexto: string;
  observaciones: string;
}

export interface ActivityBankItem {
  id: string;
  titulo: string;
  campoFormativo: CampoFormativo;
  grado: string;
  contenido: string;
  pda: string;
  descripcion: string;
  tiempo: string;
  materiales: string[];
  producto: string;
  evaluacion: string;
  etiquetas: string[];
  createdAt: string;
}

export type TipoInstrumento =
  | 'Lista de cotejo'
  | 'Rúbrica'
  | 'Escala estimativa'
  | 'Guía de observación'
  | 'Autoevaluación'
  | 'Coevaluación'
  | 'Registro anecdótico';

export interface IndicadorEvaluacion {
  id: string;
  descripcion: string;
  criterios?: {
    nivelSobresaliente?: string;
    nivelSatisfactorio?: string;
    nivelBasico?: string;
    nivelRequiereApoyo?: string;
  };
  ponderacion?: number;
}

export interface EvaluationInstrument {
  id: string;
  titulo: string;
  tipo: TipoInstrumento;
  campoFormativo: CampoFormativo;
  grado: string;
  contenido: string;
  pda: string;
  proposito: string;
  productoEvidencia: string;
  indicadores: IndicadorEvaluacion[];
  instrucciones: string;
  escala?: string[];
  createdAt: string;
}

export type TipoMaterial =
  | 'Ficha de trabajo'
  | 'Cuestionario'
  | 'Lectura'
  | 'Preguntas de comprensión'
  | 'Sopa de letras'
  | 'Crucigrama'
  | 'Problemas matemáticos'
  | 'Tarjetas'
  | 'Organizador gráfico'
  | 'Actividad para colorear'
  | 'Ejercicios';

export interface MaterialItem {
  id: string;
  titulo: string;
  tipo: TipoMaterial;
  grado: string;
  campoFormativo: CampoFormativo;
  planId?: string;
  contenidoTexto: string;
  instrucciones: string;
  elementosInteractivos?: any;
  respuestasSugeridas?: string;
  createdAt: string;
}

export interface FolderItem {
  id: string;
  nombre: string;
  color?: string;
  createdAt: string;
}

export interface PlanVersionHistory {
  id: string;
  planId: string;
  version: number;
  nombre: string;
  fecha: string;
  planData: DidacticPlan;
}

export interface ReviewFeedback {
  fortalezas: string[];
  sugerencias: Array<{
    seccion: string;
    descripcion: string;
    cambioPropuesto: string;
    aplicado?: boolean;
  }>;
  posiblesInconsistencias: string[];
  puntuacionCoherencia: number;
}

export interface AppSettings {
  tema: 'claro' | 'oscuro';
  tamanoLetra: 'pequena' | 'mediana' | 'grande';
  nombreDocenteEnHeader: boolean;
  autoGuardadoSegundos: number;
  inicializado: boolean;
}

export interface FullBackup {
  app: string;
  version: string;
  timestamp: string;
  perfil: TeacherProfile;
  grupo: GroupContext;
  planeaciones: DidacticPlan[];
  actividades: ActivityBankItem[];
  evaluaciones: EvaluationInstrument[];
  materiales: MaterialItem[];
  carpetas: FolderItem[];
  configuracion: AppSettings;
}
