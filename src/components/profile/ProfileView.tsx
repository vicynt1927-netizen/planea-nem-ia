import React, { useState, useRef } from 'react';
import { User, Check, Save } from 'lucide-react';
import { TeacherProfile } from '../../types';
import { validateTeacherProfile } from '../../utils/validation';
import { FormFieldError } from '../common/FormFieldError';
import { FormErrorSummary } from '../common/FormErrorSummary';

interface ProfileViewProps {
  profile: TeacherProfile;
  onSave: (updatedProfile: TeacherProfile) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [touched, setTouched] = useState<Partial<Record<keyof TeacherProfile, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [submittedWithErrors, setSubmittedWithErrors] = useState(false);

  // Focus ref for accessible error jump
  const firstErrorRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  // Real-time validation computation
  const validation = validateTeacherProfile(formData);
  const errors = validation.errors;

  const handleBlur = (field: keyof TeacherProfile) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof TeacherProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (submittedWithErrors) {
      setSubmittedWithErrors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched upon submission attempt
    const allTouched: Partial<Record<keyof TeacherProfile, boolean>> = {
      nombre: true,
      escuela: true,
      cct: true,
      entidad: true,
      municipio: true,
      grado: true,
      grupo: true,
      cicloEscolar: true,
      turno: true,
    };
    setTouched(allTouched);

    if (!validation.isValid) {
      setSubmittedWithErrors(true);
      // Accessible auto-focus on first invalid input
      if (firstErrorRef.current) {
        firstErrorRef.current.focus();
      }
      return;
    }

    setSubmittedWithErrors(false);
    setIsSaving(true);
    try {
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getInputClass = (fieldName: keyof TeacherProfile) => {
    const isFieldInvalid = (touched[fieldName] || submittedWithErrors) && !!errors[fieldName];
    return `w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 dark:text-white transition focus:outline-hidden ${
      isFieldInvalid
        ? 'border-rose-400 dark:border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/10'
    }`;
  };

  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-600" aria-hidden="true" />
            Perfil Docente
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tus datos se vincularán automáticamente al encabezado oficial de todas tus planeaciones didácticas y documentos exportables.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Formulario de Perfil Docente"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-xs space-y-6"
      >
        {submittedWithErrors && errorList.length > 0 && (
          <FormErrorSummary
            errors={errorList}
            title={`Se encontraron ${errorList.length} campo(s) que requieren atención:`}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label htmlFor="profile-nombre" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nombre completo del docente <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="profile-nombre"
              type="text"
              required
              aria-required="true"
              aria-invalid={(touched.nombre || submittedWithErrors) && !!errors.nombre}
              aria-describedby={
                (touched.nombre || submittedWithErrors) && errors.nombre ? 'profile-nombre-error' : undefined
              }
              ref={(el) => {
                if (errors.nombre && !firstErrorRef.current) firstErrorRef.current = el;
              }}
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              onBlur={() => handleBlur('nombre')}
              className={getInputClass('nombre')}
              placeholder="Ej. Mtra. Alejandra Morales Estrada"
            />
            <FormFieldError
              id="profile-nombre-error"
              error={(touched.nombre || submittedWithErrors) ? errors.nombre : undefined}
            />
          </div>

          {/* Escuela */}
          <div>
            <label htmlFor="profile-escuela" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nombre de la Escuela Primaria <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="profile-escuela"
              type="text"
              required
              aria-required="true"
              aria-invalid={(touched.escuela || submittedWithErrors) && !!errors.escuela}
              aria-describedby={
                (touched.escuela || submittedWithErrors) && errors.escuela ? 'profile-escuela-error' : undefined
              }
              ref={(el) => {
                if (errors.escuela && !errors.nombre && !firstErrorRef.current) firstErrorRef.current = el;
              }}
              value={formData.escuela}
              onChange={(e) => handleChange('escuela', e.target.value)}
              onBlur={() => handleBlur('escuela')}
              className={getInputClass('escuela')}
              placeholder="Ej. Escuela Primaria Benito Juárez"
            />
            <FormFieldError
              id="profile-escuela-error"
              error={(touched.escuela || submittedWithErrors) ? errors.escuela : undefined}
            />
          </div>

          {/* CCT */}
          <div>
            <label htmlFor="profile-cct" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>
                Clave de Centro de Trabajo (CCT) <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">10 caracteres</span>
            </label>
            <input
              id="profile-cct"
              type="text"
              required
              maxLength={10}
              aria-required="true"
              aria-invalid={(touched.cct || submittedWithErrors) && !!errors.cct}
              aria-describedby={
                (touched.cct || submittedWithErrors) && errors.cct ? 'profile-cct-error' : undefined
              }
              value={formData.cct}
              onChange={(e) => handleChange('cct', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('cct')}
              className={`${getInputClass('cct')} uppercase font-mono tracking-wider`}
              placeholder="Ej. 09DPR1423Z"
            />
            <FormFieldError
              id="profile-cct-error"
              error={(touched.cct || submittedWithErrors) ? errors.cct : undefined}
            />
          </div>

          {/* Entidad */}
          <div>
            <label htmlFor="profile-entidad" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Entidad federativa (Estado) <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="profile-entidad"
              type="text"
              required
              aria-required="true"
              aria-invalid={(touched.entidad || submittedWithErrors) && !!errors.entidad}
              aria-describedby={
                (touched.entidad || submittedWithErrors) && errors.entidad ? 'profile-entidad-error' : undefined
              }
              value={formData.entidad}
              onChange={(e) => handleChange('entidad', e.target.value)}
              onBlur={() => handleBlur('entidad')}
              className={getInputClass('entidad')}
              placeholder="Ej. Ciudad de México / Jalisco / Nuevo León"
            />
            <FormFieldError
              id="profile-entidad-error"
              error={(touched.entidad || submittedWithErrors) ? errors.entidad : undefined}
            />
          </div>

          {/* Municipio */}
          <div>
            <label htmlFor="profile-municipio" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Municipio o Alcaldía <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="profile-municipio"
              type="text"
              required
              aria-required="true"
              aria-invalid={(touched.municipio || submittedWithErrors) && !!errors.municipio}
              aria-describedby={
                (touched.municipio || submittedWithErrors) && errors.municipio ? 'profile-municipio-error' : undefined
              }
              value={formData.municipio}
              onChange={(e) => handleChange('municipio', e.target.value)}
              onBlur={() => handleBlur('municipio')}
              className={getInputClass('municipio')}
              placeholder="Ej. Iztapalapa / Guadalajara / Monterrey"
            />
            <FormFieldError
              id="profile-municipio-error"
              error={(touched.municipio || submittedWithErrors) ? errors.municipio : undefined}
            />
          </div>

          {/* Grado y Grupo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="profile-grado" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Grado <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <select
                id="profile-grado"
                required
                aria-required="true"
                aria-invalid={(touched.grado || submittedWithErrors) && !!errors.grado}
                aria-describedby={
                  (touched.grado || submittedWithErrors) && errors.grado ? 'profile-grado-error' : undefined
                }
                value={formData.grado}
                onChange={(e) => handleChange('grado', e.target.value)}
                onBlur={() => handleBlur('grado')}
                className={getInputClass('grado')}
              >
                <option value="1°">1° Primaria (Fase 3)</option>
                <option value="2°">2° Primaria (Fase 3)</option>
                <option value="3°">3° Primaria (Fase 4)</option>
                <option value="4°">4° Primaria (Fase 4)</option>
                <option value="5°">5° Primaria (Fase 5)</option>
                <option value="6°">6° Primaria (Fase 5)</option>
              </select>
              <FormFieldError
                id="profile-grado-error"
                error={(touched.grado || submittedWithErrors) ? errors.grado : undefined}
              />
            </div>
            <div>
              <label htmlFor="profile-grupo" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Grupo <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="profile-grupo"
                type="text"
                required
                maxLength={4}
                aria-required="true"
                aria-invalid={(touched.grupo || submittedWithErrors) && !!errors.grupo}
                aria-describedby={
                  (touched.grupo || submittedWithErrors) && errors.grupo ? 'profile-grupo-error' : undefined
                }
                value={formData.grupo}
                onChange={(e) => handleChange('grupo', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('grupo')}
                className={getInputClass('grupo')}
                placeholder="A"
              />
              <FormFieldError
                id="profile-grupo-error"
                error={(touched.grupo || submittedWithErrors) ? errors.grupo : undefined}
              />
            </div>
          </div>

          {/* Ciclo Escolar y Turno */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="profile-ciclo" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Ciclo Escolar <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="profile-ciclo"
                type="text"
                required
                aria-required="true"
                aria-invalid={(touched.cicloEscolar || submittedWithErrors) && !!errors.cicloEscolar}
                aria-describedby={
                  (touched.cicloEscolar || submittedWithErrors) && errors.cicloEscolar ? 'profile-ciclo-error' : undefined
                }
                value={formData.cicloEscolar}
                onChange={(e) => handleChange('cicloEscolar', e.target.value)}
                onBlur={() => handleBlur('cicloEscolar')}
                className={getInputClass('cicloEscolar')}
                placeholder="2026-2027"
              />
              <FormFieldError
                id="profile-ciclo-error"
                error={(touched.cicloEscolar || submittedWithErrors) ? errors.cicloEscolar : undefined}
              />
            </div>
            <div>
              <label htmlFor="profile-turno" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Turno <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <select
                id="profile-turno"
                required
                aria-required="true"
                aria-invalid={(touched.turno || submittedWithErrors) && !!errors.turno}
                aria-describedby={
                  (touched.turno || submittedWithErrors) && errors.turno ? 'profile-turno-error' : undefined
                }
                value={formData.turno}
                onChange={(e) => handleChange('turno', e.target.value as any)}
                onBlur={() => handleBlur('turno')}
                className={getInputClass('turno')}
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Jornada Ampliada">Jornada Ampliada</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
              </select>
              <FormFieldError
                id="profile-turno-error"
                error={(touched.turno || submittedWithErrors) ? errors.turno : undefined}
              />
            </div>
          </div>
        </div>

        {/* Submit & Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <div>
            {savedSuccess && (
              <span
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                ¡Información del perfil guardada exitosamente!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer focus:ring-2 focus:ring-blue-500/20"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>{isSaving ? 'Guardando...' : 'Guardar perfil docente'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
