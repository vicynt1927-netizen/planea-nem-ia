import React, { useState, useRef } from 'react';
import { Users, Save, Check, ShieldCheck } from 'lucide-react';
import { GroupContext } from '../../types';
import { validateGroupContext } from '../../utils/validation';
import { FormFieldError } from '../common/FormFieldError';
import { FormErrorSummary } from '../common/FormErrorSummary';

interface GroupViewProps {
  group: GroupContext;
  onSave: (updatedGroup: GroupContext) => Promise<void>;
}

export const GroupView: React.FC<GroupViewProps> = ({ group, onSave }) => {
  const [formData, setFormData] = useState<GroupContext>({ ...group });
  const [touched, setTouched] = useState<Partial<Record<keyof GroupContext, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [submittedWithErrors, setSubmittedWithErrors] = useState(false);

  const firstErrorRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

  // Real-time validation computation
  const validation = validateGroupContext(formData);
  const errors = validation.errors;

  const handleBlur = (field: keyof GroupContext) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof GroupContext, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (submittedWithErrors) {
      setSubmittedWithErrors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Partial<Record<keyof GroupContext, boolean>> = {
      grado: true,
      grupo: true,
      numeroAlumnos: true,
      fortalezas: true,
      necesidades: true,
      areasOportunidad: true,
      problematicas: true,
      caracteristicasContexto: true,
    };
    setTouched(allTouched);

    if (!validation.isValid) {
      setSubmittedWithErrors(true);
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

  const getInputClass = (fieldName: keyof GroupContext) => {
    const isFieldInvalid = (touched[fieldName] || submittedWithErrors) && !!errors[fieldName];
    return `w-full rounded-xl border px-3 py-2.5 text-xs text-slate-900 dark:text-white transition focus:outline-hidden ${
      isFieldInvalid
        ? 'border-rose-400 dark:border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/10'
    }`;
  };

  const getTextareaClass = (fieldName: keyof GroupContext) => {
    const isFieldInvalid = (touched[fieldName] || submittedWithErrors) && !!errors[fieldName];
    return `w-full rounded-xl border p-3 text-xs text-slate-900 dark:text-white transition focus:outline-hidden ${
      isFieldInvalid
        ? 'border-rose-400 dark:border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/10'
    }`;
  };

  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          Diagnóstico y Contexto del Grupo
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          La Inteligencia Artificial utiliza esta caracterización áulica para sugerir actividades contextualizadas a los estilos y necesidades de tus alumnos.
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Protección y privacidad:</strong> No se solicitan nombres ni datos personales de menores. Describe únicamente dinámicas generales del grupo, fortalezas colectivas y requerimientos pedagógicos generales.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Formulario de Diagnóstico del Grupo"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-xs space-y-6"
      >
        {submittedWithErrors && errorList.length > 0 && (
          <FormErrorSummary
            errors={errorList}
            title={`Por favor completa los siguientes ${errorList.length} campos del diagnóstico:`}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Grado */}
          <div>
            <label htmlFor="group-grado" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Grado escolar <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <select
              id="group-grado"
              required
              aria-required="true"
              aria-invalid={(touched.grado || submittedWithErrors) && !!errors.grado}
              aria-describedby={
                (touched.grado || submittedWithErrors) && errors.grado ? 'group-grado-error' : undefined
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
              id="group-grado-error"
              error={(touched.grado || submittedWithErrors) ? errors.grado : undefined}
            />
          </div>

          {/* Grupo */}
          <div>
            <label htmlFor="group-grupo" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Grupo <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="group-grupo"
              type="text"
              required
              maxLength={4}
              aria-required="true"
              aria-invalid={(touched.grupo || submittedWithErrors) && !!errors.grupo}
              aria-describedby={
                (touched.grupo || submittedWithErrors) && errors.grupo ? 'group-grupo-error' : undefined
              }
              value={formData.grupo}
              onChange={(e) => handleChange('grupo', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('grupo')}
              className={getInputClass('grupo')}
              placeholder="Ej. A"
            />
            <FormFieldError
              id="group-grupo-error"
              error={(touched.grupo || submittedWithErrors) ? errors.grupo : undefined}
            />
          </div>

          {/* Número de alumnos */}
          <div>
            <label htmlFor="group-alumnos" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Número de alumnos <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="group-alumnos"
              type="number"
              min={1}
              max={70}
              required
              aria-required="true"
              aria-invalid={(touched.numeroAlumnos || submittedWithErrors) && !!errors.numeroAlumnos}
              aria-describedby={
                (touched.numeroAlumnos || submittedWithErrors) && errors.numeroAlumnos ? 'group-alumnos-error' : undefined
              }
              value={formData.numeroAlumnos || ''}
              onChange={(e) => handleChange('numeroAlumnos', parseInt(e.target.value, 10) || 0)}
              onBlur={() => handleBlur('numeroAlumnos')}
              className={getInputClass('numeroAlumnos')}
              placeholder="Ej. 28"
            />
            <FormFieldError
              id="group-alumnos-error"
              error={(touched.numeroAlumnos || submittedWithErrors) ? errors.numeroAlumnos : undefined}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Fortalezas */}
          <div>
            <label htmlFor="group-fortalezas" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>
                Fortalezas del grupo <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">¿En qué destacan tus alumnos?</span>
            </label>
            <textarea
              id="group-fortalezas"
              rows={3}
              required
              aria-required="true"
              aria-invalid={(touched.fortalezas || submittedWithErrors) && !!errors.fortalezas}
              aria-describedby={
                (touched.fortalezas || submittedWithErrors) && errors.fortalezas ? 'group-fortalezas-error' : undefined
              }
              ref={(el) => {
                if (errors.fortalezas && !firstErrorRef.current) firstErrorRef.current = el;
              }}
              value={formData.fortalezas}
              onChange={(e) => handleChange('fortalezas', e.target.value)}
              onBlur={() => handleBlur('fortalezas')}
              placeholder="Ej. Grupo entusiasta, creativo, les agrada el dibujo, las dinámicas al aire libre y el trabajo por equipos."
              className={getTextareaClass('fortalezas')}
            />
            <FormFieldError
              id="group-fortalezas-error"
              error={(touched.fortalezas || submittedWithErrors) ? errors.fortalezas : undefined}
            />
          </div>

          {/* Necesidades */}
          <div>
            <label htmlFor="group-necesidades" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>
                Necesidades de aprendizaje <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">Habilidades a reforzar</span>
            </label>
            <textarea
              id="group-necesidades"
              rows={3}
              required
              aria-required="true"
              aria-invalid={(touched.necesidades || submittedWithErrors) && !!errors.necesidades}
              aria-describedby={
                (touched.necesidades || submittedWithErrors) && errors.necesidades ? 'group-necesidades-error' : undefined
              }
              value={formData.necesidades}
              onChange={(e) => handleChange('necesidades', e.target.value)}
              onBlur={() => handleBlur('necesidades')}
              placeholder="Ej. Consolidar la inferencia lectora, redacción de párrafos argumentativos y operaciones multiplicativas."
              className={getTextareaClass('necesidades')}
            />
            <FormFieldError
              id="group-necesidades-error"
              error={(touched.necesidades || submittedWithErrors) ? errors.necesidades : undefined}
            />
          </div>

          {/* Áreas de oportunidad */}
          <div>
            <label htmlFor="group-oportunidades" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>
                Áreas de oportunidad <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">Aspectos de mejora</span>
            </label>
            <textarea
              id="group-oportunidades"
              rows={2}
              required
              aria-required="true"
              aria-invalid={(touched.areasOportunidad || submittedWithErrors) && !!errors.areasOportunidad}
              aria-describedby={
                (touched.areasOportunidad || submittedWithErrors) && errors.areasOportunidad ? 'group-oportunidades-error' : undefined
              }
              value={formData.areasOportunidad}
              onChange={(e) => handleChange('areasOportunidad', e.target.value)}
              onBlur={() => handleBlur('areasOportunidad')}
              placeholder="Ej. Gestión de tiempos en actividades escritas y seguimiento de instrucciones en tres pasos."
              className={getTextareaClass('areasOportunidad')}
            />
            <FormFieldError
              id="group-oportunidades-error"
              error={(touched.areasOportunidad || submittedWithErrors) ? errors.areasOportunidad : undefined}
            />
          </div>

          {/* Problemáticas */}
          <div>
            <label htmlFor="group-problematicas" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>
                Problemáticas del entorno escolar o comunitario <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">Vinculación con proyectos NEM</span>
            </label>
            <textarea
              id="group-problematicas"
              rows={2}
              required
              aria-required="true"
              aria-invalid={(touched.problematicas || submittedWithErrors) && !!errors.problematicas}
              aria-describedby={
                (touched.problematicas || submittedWithErrors) && errors.problematicas ? 'group-problematicas-error' : undefined
              }
              value={formData.problematicas}
              onChange={(e) => handleChange('problematicas', e.target.value)}
              onBlur={() => handleBlur('problematicas')}
              placeholder="Ej. Conflictos en juegos de recreo, alto consumo de comida chatarra, falta de agua potable o poca participación de padres en lectura."
              className={getTextareaClass('problematicas')}
            />
            <FormFieldError
              id="group-problematicas-error"
              error={(touched.problematicas || submittedWithErrors) ? errors.problematicas : undefined}
            />
          </div>

          {/* Características del contexto sociocultural */}
          <div>
            <label htmlFor="group-contexto" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>
                Características del contexto sociocultural <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">Entorno y familias</span>
            </label>
            <textarea
              id="group-contexto"
              rows={2}
              required
              aria-required="true"
              aria-invalid={(touched.caracteristicasContexto || submittedWithErrors) && !!errors.caracteristicasContexto}
              aria-describedby={
                (touched.caracteristicasContexto || submittedWithErrors) && errors.caracteristicasContexto ? 'group-contexto-error' : undefined
              }
              value={formData.caracteristicasContexto}
              onChange={(e) => handleChange('caracteristicasContexto', e.target.value)}
              onBlur={() => handleBlur('caracteristicasContexto')}
              placeholder="Ej. Comunidad urbana trabajadora, presencia de mercados sobre ruedas y tradiciones orales."
              className={getTextareaClass('caracteristicasContexto')}
            />
            <FormFieldError
              id="group-contexto-error"
              error={(touched.caracteristicasContexto || submittedWithErrors) ? errors.caracteristicasContexto : undefined}
            />
          </div>

          {/* Observaciones (BAP) - Opcional */}
          <div>
            <label htmlFor="group-observaciones" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Observaciones / Adecuaciones (BAP)</span>
              <span className="text-[10px] font-normal text-slate-400">Opcional • Barreras para el aprendizaje</span>
            </label>
            <textarea
              id="group-observaciones"
              rows={2}
              value={formData.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              placeholder="Ej. Dos alumnos en proceso inicial de lectoescritura que requieren apoyos gráficos y lectura guiada."
              className={getTextareaClass('observaciones')}
            />
          </div>
        </div>

        {/* Submit & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <div>
            {savedSuccess && (
              <span
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                ¡Contexto del grupo guardado exitosamente!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>{isSaving ? 'Guardando...' : 'Guardar contexto de grupo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
