import { TeacherProfile, GroupContext } from '../types';

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Validates CCT (Clave de Centro de Trabajo) format for Mexican schools:
 * Standard format: 2 digits (state code) + 3 letters (school type) + 4 digits (consecutive) + 1 letter (check letter)
 * e.g. 09DPR1423Z
 */
export function isValidCCT(cct: string): boolean {
  if (!cct) return false;
  const clean = cct.trim().toUpperCase();
  const cctRegex = /^[0-3][0-9][A-Z]{3}[0-9]{4}[A-Z]$/;
  return cctRegex.test(clean);
}

/**
 * Validates Teacher Profile configuration
 */
export function validateTeacherProfile(profile: TeacherProfile): ValidationResult<TeacherProfile> {
  const errors: Partial<Record<keyof TeacherProfile, string>> = {};

  if (!profile.nombre?.trim()) {
    errors.nombre = 'El nombre completo del docente es obligatorio.';
  } else if (profile.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!profile.escuela?.trim()) {
    errors.escuela = 'El nombre de la escuela primaria es obligatorio.';
  } else if (profile.escuela.trim().length < 3) {
    errors.escuela = 'El nombre de la escuela debe tener al menos 3 caracteres.';
  }

  if (!profile.cct?.trim()) {
    errors.cct = 'La Clave de Centro de Trabajo (CCT) es obligatoria.';
  } else if (!isValidCCT(profile.cct)) {
    errors.cct = 'Ingresa una CCT oficial válida de 10 caracteres (ej. 09DPR1423Z).';
  }

  if (!profile.entidad?.trim()) {
    errors.entidad = 'La entidad federativa es obligatoria.';
  }

  if (!profile.municipio?.trim()) {
    errors.municipio = 'El municipio o alcaldía es obligatorio.';
  }

  if (!profile.grado?.trim()) {
    errors.grado = 'Selecciona el grado escolar atendido.';
  }

  if (!profile.grupo?.trim()) {
    errors.grupo = 'El grupo es obligatorio (ej. A, B o C).';
  }

  if (!profile.cicloEscolar?.trim()) {
    errors.cicloEscolar = 'El ciclo escolar es obligatorio (ej. 2026-2027).';
  } else if (!/^[0-9]{4}-[0-9]{4}$/.test(profile.cicloEscolar.trim())) {
    errors.cicloEscolar = 'El formato del ciclo escolar debe ser AAAA-AAAA (ej. 2026-2027).';
  }

  if (!profile.turno?.trim()) {
    errors.turno = 'Selecciona el turno escolar.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Group Diagnosis and Context configuration
 */
export function validateGroupContext(group: GroupContext): ValidationResult<GroupContext> {
  const errors: Partial<Record<keyof GroupContext, string>> = {};

  if (!group.grado?.trim()) {
    errors.grado = 'Selecciona el grado del grupo.';
  }

  if (!group.grupo?.trim()) {
    errors.grupo = 'El grupo es obligatorio (ej. A).';
  }

  if (group.numeroAlumnos === undefined || group.numeroAlumnos === null || isNaN(group.numeroAlumnos)) {
    errors.numeroAlumnos = 'Ingresa la cantidad de alumnos.';
  } else if (group.numeroAlumnos < 1 || group.numeroAlumnos > 70) {
    errors.numeroAlumnos = 'El número de alumnos debe estar entre 1 y 70.';
  }

  if (!group.fortalezas?.trim()) {
    errors.fortalezas = 'Describe al menos una fortaleza del grupo para que la IA contextualice las actividades.';
  } else if (group.fortalezas.trim().length < 10) {
    errors.fortalezas = 'Describe con mayor detalle las fortalezas (mínimo 10 caracteres).';
  }

  if (!group.necesidades?.trim()) {
    errors.necesidades = 'Especifica las necesidades prioritarias de aprendizaje.';
  } else if (group.necesidades.trim().length < 10) {
    errors.necesidades = 'Detalla las necesidades educativas (mínimo 10 caracteres).';
  }

  if (!group.areasOportunidad?.trim()) {
    errors.areasOportunidad = 'Indica las áreas de oportunidad o aspectos a mejorar.';
  } else if (group.areasOportunidad.trim().length < 8) {
    errors.areasOportunidad = 'Describe las áreas de oportunidad (mínimo 8 caracteres).';
  }

  if (!group.problematicas?.trim()) {
    errors.problematicas = 'Indica las problemáticas del contexto escolar o comunitario a vincular.';
  } else if (group.problematicas.trim().length < 10) {
    errors.problematicas = 'Describe la problemática detectada (mínimo 10 caracteres).';
  }

  if (!group.caracteristicasContexto?.trim()) {
    errors.caracteristicasContexto = 'Describe las características del contexto sociocultural de las familias.';
  } else if (group.caracteristicasContexto.trim().length < 10) {
    errors.caracteristicasContexto = 'Describe el contexto sociocultural (mínimo 10 caracteres).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface AIAssistantParams {
  instrucciones: string;
  grado: string;
  campoFormativo: string;
  numeroSesiones: number;
}

/**
 * Validates AI Assistant Planning prompt configuration
 */
export function validateAIAssistantForm(data: AIAssistantParams): {
  isValid: boolean;
  errors: Partial<Record<keyof AIAssistantParams, string>>;
} {
  const errors: Partial<Record<keyof AIAssistantParams, string>> = {};

  if (!data.instrucciones?.trim()) {
    errors.instrucciones = 'La instrucción para el Asistente IA es obligatoria.';
  } else if (data.instrucciones.trim().length < 15) {
    errors.instrucciones = 'Escribe una instrucción más específica (al menos 15 caracteres) para que la IA genere un proyecto coherente.';
  }

  if (!data.grado?.trim()) {
    errors.grado = 'Selecciona el grado escolar.';
  }

  if (!data.campoFormativo?.trim()) {
    errors.campoFormativo = 'Selecciona el campo formativo prioritario.';
  }

  if (!data.numeroSesiones || isNaN(data.numeroSesiones)) {
    errors.numeroSesiones = 'El número de sesiones es obligatorio.';
  } else if (data.numeroSesiones < 1 || data.numeroSesiones > 15) {
    errors.numeroSesiones = 'El número de sesiones debe estar entre 1 y 15.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
