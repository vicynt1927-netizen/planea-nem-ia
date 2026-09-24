import React, { useState, useRef } from 'react';
import { Sparkles, School, GraduationCap, ArrowRight } from 'lucide-react';
import { TeacherProfile } from '../../types';
import { validateTeacherProfile } from '../../utils/validation';
import { FormFieldError } from '../common/FormFieldError';
import { FormErrorSummary } from '../common/FormErrorSummary';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: TeacherProfile;
  onComplete: (profile: TeacherProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');
  const [formData, setFormData] = useState<TeacherProfile>(initialProfile);
  const [touched, setTouched] = useState<Partial<Record<keyof TeacherProfile, boolean>>>({});
  const [submittedWithErrors, setSubmittedWithErrors] = useState(false);

  const firstErrorRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Real-time validation
  const validation = validateTeacherProfile(formData);
  const errors = validation.errors;

  const handleBlur = (field: keyof TeacherProfile) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof TeacherProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (submittedWithErrors) setSubmittedWithErrors(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      nombre: true,
      escuela: true,
      cct: true,
      entidad: true,
      municipio: true,
      grado: true,
      grupo: true,
      cicloEscolar: true,
      turno: true,
    });

    if (!validation.isValid) {
      setSubmittedWithErrors(true);
      if (firstErrorRef.current) {
        firstErrorRef.current.focus();
      }
      return;
    }

    onComplete(formData);
  };

  const getInputClass = (fieldName: keyof TeacherProfile) => {
    const isInvalid = (touched[fieldName] || submittedWithErrors) && !!errors[fieldName];
    return `w-full rounded-xl border px-3.5 py-2 text-xs text-slate-900 dark:text-white transition focus:outline-hidden ${
      isInvalid
        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500'
    }`;
  };

  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        {step === 'welcome' ? (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-white shadow-xl shadow-blue-500/25">
              <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" aria-hidden="true" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-400/20 mb-2">
                Nueva Escuela Mexicana
              </div>
              <h2 id="onboarding-modal-title" className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Bienvenido a PLANEANEM IA
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                Asistente inteligente diseñado para apoyar a docentes de educación primaria en México. Planea, adapta, evalúa y crea materiales con apoyo de Inteligencia Artificial.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-xs text-slate-600 dark:text-slate-300 text-left space-y-2 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" aria-hidden="true" />
                Vamos a configurar tu espacio docente
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Estos datos se incluirán automáticamente en los encabezados oficiales de tus planeaciones didácticas y en las exportaciones a PDF y Word.
              </p>
            </div>

            <button
              onClick={() => setStep('form')}
              className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition cursor-pointer focus:ring-2 focus:ring-blue-500/20"
            >
              <span>Comenzar configuración</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <School className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <div>
                <h3 id="onboarding-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Datos de tu Escuela y Grupo
                </h3>
                <p className="text-xs text-slate-500">Configuración rápida inicial</p>
              </div>
            </div>

            {submittedWithErrors && errorList.length > 0 && (
              <FormErrorSummary
                errors={errorList}
                title={`Por favor atiende los siguientes ${errorList.length} campos:`}
              />
            )}

            <div>
              <label htmlFor="onboarding-nombre" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre del docente <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="onboarding-nombre"
                type="text"
                required
                ref={(el) => {
                  if (errors.nombre && !firstErrorRef.current) firstErrorRef.current = el;
                }}
                aria-required="true"
                aria-invalid={(touched.nombre || submittedWithErrors) && !!errors.nombre}
                aria-describedby={
                  (touched.nombre || submittedWithErrors) && errors.nombre ? 'onboarding-nombre-error' : undefined
                }
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                onBlur={() => handleBlur('nombre')}
                placeholder="Ej. Mtra. Laura González Gómez"
                className={getInputClass('nombre')}
              />
              <FormFieldError
                id="onboarding-nombre-error"
                error={(touched.nombre || submittedWithErrors) ? errors.nombre : undefined}
              />
            </div>

            <div>
              <label htmlFor="onboarding-escuela" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre de la escuela <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="onboarding-escuela"
                type="text"
                required
                aria-required="true"
                aria-invalid={(touched.escuela || submittedWithErrors) && !!errors.escuela}
                aria-describedby={
                  (touched.escuela || submittedWithErrors) && errors.escuela ? 'onboarding-escuela-error' : undefined
                }
                value={formData.escuela}
                onChange={(e) => handleChange('escuela', e.target.value)}
                onBlur={() => handleBlur('escuela')}
                placeholder="Ej. Esc. Primaria Benito Juárez"
                className={getInputClass('escuela')}
              />
              <FormFieldError
                id="onboarding-escuela-error"
                error={(touched.escuela || submittedWithErrors) ? errors.escuela : undefined}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="onboarding-grado" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Grado <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="onboarding-grado"
                  required
                  aria-required="true"
                  value={formData.grado}
                  onChange={(e) => handleChange('grado', e.target.value)}
                  className={getInputClass('grado')}
                >
                  <option value="1°">1° Primaria (Fase 3)</option>
                  <option value="2°">2° Primaria (Fase 3)</option>
                  <option value="3°">3° Primaria (Fase 4)</option>
                  <option value="4°">4° Primaria (Fase 4)</option>
                  <option value="5°">5° Primaria (Fase 5)</option>
                  <option value="6°">6° Primaria (Fase 5)</option>
                </select>
              </div>
              <div>
                <label htmlFor="onboarding-grupo" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Grupo <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="onboarding-grupo"
                  type="text"
                  required
                  maxLength={4}
                  aria-required="true"
                  aria-invalid={(touched.grupo || submittedWithErrors) && !!errors.grupo}
                  aria-describedby={
                    (touched.grupo || submittedWithErrors) && errors.grupo ? 'onboarding-grupo-error' : undefined
                  }
                  value={formData.grupo}
                  onChange={(e) => handleChange('grupo', e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('grupo')}
                  placeholder="Ej. A"
                  className={getInputClass('grupo')}
                />
                <FormFieldError
                  id="onboarding-grupo-error"
                  error={(touched.grupo || submittedWithErrors) ? errors.grupo : undefined}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="onboarding-ciclo" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ciclo Escolar <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="onboarding-ciclo"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={(touched.cicloEscolar || submittedWithErrors) && !!errors.cicloEscolar}
                  aria-describedby={
                    (touched.cicloEscolar || submittedWithErrors) && errors.cicloEscolar ? 'onboarding-ciclo-error' : undefined
                  }
                  value={formData.cicloEscolar}
                  onChange={(e) => handleChange('cicloEscolar', e.target.value)}
                  onBlur={() => handleBlur('cicloEscolar')}
                  placeholder="2026-2027"
                  className={getInputClass('cicloEscolar')}
                />
                <FormFieldError
                  id="onboarding-ciclo-error"
                  error={(touched.cicloEscolar || submittedWithErrors) ? errors.cicloEscolar : undefined}
                />
              </div>
              <div>
                <label htmlFor="onboarding-turno" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Turno
                </label>
                <select
                  id="onboarding-turno"
                  value={formData.turno}
                  onChange={(e) => handleChange('turno', e.target.value as any)}
                  className={getInputClass('turno')}
                >
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Jornada Ampliada">Jornada Ampliada</option>
                  <option value="Tiempo Completo">Tiempo Completo</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition cursor-pointer focus:ring-2 focus:ring-blue-500/20"
              >
                Guardar y Acceder al Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
