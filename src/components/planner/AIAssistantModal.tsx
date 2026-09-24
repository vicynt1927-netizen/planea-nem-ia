import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  Lightbulb,
  Check,
} from 'lucide-react';
import {
  DidacticPlan,
  TeacherProfile,
  GroupContext,
  CampoFormativo,
  FaseNEM,
} from '../../types';
import { geminiService } from '../../services/geminiService';
import { CAMPOS_FORMATIVOS, GRADOS_PRIMARIA } from '../../data/nemCatalogs';
import { validateAIAssistantForm } from '../../utils/validation';
import { FormFieldError } from '../common/FormFieldError';
import { FormErrorSummary } from '../common/FormErrorSummary';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  group: GroupContext;
  onPlanGenerated: (plan: DidacticPlan) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  profile,
  group,
  onPlanGenerated,
}) => {
  const [instrucciones, setInstrucciones] = useState('');
  const [grado, setGrado] = useState(profile.grado || '4°');
  const [campoFormativo, setCampoFormativo] = useState<CampoFormativo>('Lenguajes');
  const [numeroSesiones, setNumeroSesiones] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  // Field touch state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedWithErrors, setSubmittedWithErrors] = useState(false);

  const firstErrorRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  // Compute validation
  const validation = validateAIAssistantForm({
    instrucciones,
    grado,
    campoFormativo,
    numeroSesiones,
  });
  const errors = validation.errors;

  if (!isOpen) return null;

  const quickPrompts = [
    'Comprensión lectora: inferir ideas principales y redacción de cuentos locales.',
    'Sistema digestivo y nutrición: experimentos prácticos y lonchera saludable.',
    'Resolución pacífica de conflictos y asambleas escolares para la convivencia en el recreo.',
    'Multiplicación y cálculo mental a través de una tiendita escolar comunitaria.',
  ];

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setInstrucciones(promptText);
    setTouched((prev) => ({ ...prev, instrucciones: true }));
    if (submittedWithErrors) {
      setSubmittedWithErrors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      instrucciones: true,
      grado: true,
      campoFormativo: true,
      numeroSesiones: true,
    });

    if (!validation.isValid) {
      setSubmittedWithErrors(true);
      if (firstErrorRef.current) {
        firstErrorRef.current.focus();
      }
      return;
    }

    setSubmittedWithErrors(false);
    setIsLoading(true);
    setApiErrorMsg(null);

    const foundGrado = GRADOS_PRIMARIA.find((g) => g.grado === grado);
    const fase: FaseNEM = foundGrado?.fase || 'Fase 4';

    try {
      const generated = await geminiService.generatePlan({
        instrucciones: instrucciones.trim(),
        grado,
        fase,
        campoFormativo,
        tipoProyecto: 'Aula',
        numeroSesiones,
        contextoGrupo: group,
      });

      const newPlan: DidacticPlan = {
        id: 'plan-' + Date.now(),
        titulo: generated.titulo || 'Proyecto generado con IA',
        tipoProyecto: (generated.tipoProyecto as any) || 'Aula',
        campoFormativo: (generated.campoFormativo as any) || campoFormativo,
        grado,
        grupo: profile.grupo || 'A',
        fase,
        temporalidad: generated.temporalidad || `${Math.ceil(numeroSesiones / 5)} semanas (${numeroSesiones} sesiones)`,
        numeroSesiones: generated.sesiones?.length || numeroSesiones,
        duracionSesion: '60 minutos',
        ejesArticuladores: (generated.ejesArticuladores as any) || [
          'Inclusión',
          'Pensamiento crítico',
        ],
        metodologia:
          (generated.metodologia as any) ||
          'Aprendizaje basado en proyectos comunitarios',
        contenido: generated.contenido || '',
        pda: generated.pda || '',
        proposito: generated.proposito || '',
        problematica: generated.problematica || group.problematicas || '',
        situacionContexto: generated.situacionContexto || group.caracteristicasContexto || '',
        productoFinal: generated.productoFinal || '',
        sesiones: generated.sesiones || [],
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onPlanGenerated(newPlan);
      onClose();
    } catch (err: any) {
      setApiErrorMsg(err?.message || 'No fue posible generar la planeación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-100" aria-hidden="true" />
            </div>
            <div>
              <h2 id="ai-assistant-title" className="text-base font-bold text-slate-900 dark:text-white">
                Asistente IA para Planeación Didáctica
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alimentado por Gemini • Contextualizado a {grado} de Primaria y a tu diagnóstico de grupo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* API error */}
          {apiErrorMsg && (
            <div
              role="alert"
              className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 space-y-2.5 text-xs text-rose-800 dark:text-rose-300"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                <div>
                  <p className="font-bold">Aviso del Asistente:</p>
                  <p className="mt-0.5 leading-relaxed">{apiErrorMsg}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-800/60">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reintentar con IA</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation error summary */}
          {submittedWithErrors && errorList.length > 0 && (
            <FormErrorSummary
              errors={errorList}
              title={`Verifica los siguientes ${errorList.length} datos requeridos:`}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="ai-grado" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Grado escolar <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <select
                id="ai-grado"
                required
                aria-required="true"
                value={grado}
                onChange={(e) => {
                  setGrado(e.target.value);
                  handleBlur('grado');
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden"
              >
                {GRADOS_PRIMARIA.map((g) => (
                  <option key={g.grado} value={g.grado}>
                    {g.grado} Primaria ({g.fase})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ai-campo" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campo Formativo <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <select
                id="ai-campo"
                required
                aria-required="true"
                value={campoFormativo}
                onChange={(e) => {
                  setCampoFormativo(e.target.value as CampoFormativo);
                  handleBlur('campoFormativo');
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden"
              >
                {CAMPOS_FORMATIVOS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ai-sesiones" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sesiones a planear <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="ai-sesiones"
                type="number"
                min={1}
                max={15}
                required
                aria-required="true"
                aria-invalid={(touched.numeroSesiones || submittedWithErrors) && !!errors.numeroSesiones}
                aria-describedby={
                  (touched.numeroSesiones || submittedWithErrors) && errors.numeroSesiones
                    ? 'ai-sesiones-error'
                    : undefined
                }
                value={numeroSesiones || ''}
                onChange={(e) => {
                  setNumeroSesiones(parseInt(e.target.value, 10) || 0);
                  handleBlur('numeroSesiones');
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden ${
                  (touched.numeroSesiones || submittedWithErrors) && !!errors.numeroSesiones
                    ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-amber-500'
                }`}
              />
              <FormFieldError
                id="ai-sesiones-error"
                error={(touched.numeroSesiones || submittedWithErrors) ? errors.numeroSesiones : undefined}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ai-instrucciones" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>
                Escribe tu instrucción en lenguaje natural <span className="text-rose-500" aria-hidden="true">*</span>
              </span>
              <span className={`text-[10px] font-mono ${instrucciones.trim().length >= 15 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                {instrucciones.trim().length} / 15 mín.
              </span>
            </label>
            <textarea
              id="ai-instrucciones"
              ref={(el) => {
                if (errors.instrucciones && !firstErrorRef.current) firstErrorRef.current = el;
              }}
              required
              rows={4}
              aria-required="true"
              aria-invalid={(touched.instrucciones || submittedWithErrors) && !!errors.instrucciones}
              aria-describedby={
                (touched.instrucciones || submittedWithErrors) && errors.instrucciones
                  ? 'ai-instrucciones-error'
                  : undefined
              }
              value={instrucciones}
              onChange={(e) => {
                setInstrucciones(e.target.value);
                setTouched((prev) => ({ ...prev, instrucciones: true }));
                if (submittedWithErrors) setSubmittedWithErrors(false);
              }}
              onBlur={() => handleBlur('instrucciones')}
              placeholder="Ejemplo: Genera una planeación de 10 sesiones para cuarto grado sobre comprensión lectora y textos narrativos. El grupo presenta dificultades para identificar ideas principales e inferir información. Queremos crear una antología colectiva ilustrada como producto final."
              className={`w-full rounded-2xl border p-3.5 text-xs text-slate-900 dark:text-white transition focus:outline-hidden leading-relaxed ${
                (touched.instrucciones || submittedWithErrors) && !!errors.instrucciones
                  ? 'border-rose-400 dark:border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/15'
              }`}
            />
            <FormFieldError
              id="ai-instrucciones-error"
              error={(touched.instrucciones || submittedWithErrors) ? errors.instrucciones : undefined}
            />
          </div>

          {/* Quick Examples */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              Sugerencias rápidas para probar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickPrompt(q)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 text-left text-[11px] text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 text-[11px] text-blue-800 dark:text-blue-300 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              Garantías pedagógicas de la IA:
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Genera sesiones con Inicio, Desarrollo y Cierre, actividades diferenciadas docente/alumno, evidencias del cuaderno, evaluación formativa y coherencia metodológica oficial de la NEM.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md hover:from-amber-400 hover:to-orange-400 transition cursor-pointer disabled:opacity-50 focus:ring-2 focus:ring-amber-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Construyendo planeación didáctica...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Generar Planeación con Gemini</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
