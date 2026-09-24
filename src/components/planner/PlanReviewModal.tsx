import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { DidacticPlan, ReviewFeedback } from '../../types';
import { geminiService } from '../../services/geminiService';

interface PlanReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: DidacticPlan;
  onApplySuggestion: (suggestion: { seccion: string; cambioPropuesto: string }) => void;
}

export const PlanReviewModal: React.FC<PlanReviewModalProps> = ({
  isOpen,
  onClose,
  plan,
  onApplySuggestion,
}) => {
  const [review, setReview] = useState<ReviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedIndices, setAppliedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && !review && !isLoading) {
      loadReview();
    }
  }, [isOpen]);

  const loadReview = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await geminiService.reviewPlan(plan);
      setReview(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'No fue posible completar la revisión.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Dictamen Pedagógico y Revisión con IA
                </h2>
                {review && (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                    Coherencia: {review.puntuacionCoherencia}/100
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Análisis de alineación curricular NEM • Propósito, PDA, Actividades y Evaluación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Analizando coherencia didáctica con Gemini...
              </p>
              <p className="text-xs text-slate-500">
                Verificando correlación entre PDA, momentos metodológicos y evidencias de aprendizaje.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 space-y-2">
              <p className="font-bold">No fue posible completar la revisión:</p>
              <p>{errorMsg}</p>
              <button
                onClick={loadReview}
                className="mt-2 text-xs font-bold text-rose-700 underline cursor-pointer"
              >
                Reintentar análisis
              </button>
            </div>
          )}

          {review && !isLoading && (
            <div className="space-y-6">
              {/* FORTALEZAS */}
              <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  FORTALEZAS DE LA PLANEACIÓN ({review.fortalezas.length})
                </h3>
                <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                  {review.fortalezas.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* POSIBLES INCONSISTENCIAS */}
              {review.posiblesInconsistencias && review.posiblesInconsistencias.length > 0 && (
                <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 p-4 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    POSIBLES INCONSISTENCIAS A REVISAR ({review.posiblesInconsistencias.length})
                  </h3>
                  <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                    {review.posiblesInconsistencias.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">⚠</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SUGERENCIAS RECOMENDADAS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  SUGERENCIAS DE MEJORA ({review.sugerencias.length})
                </h3>
                <div className="space-y-3">
                  {review.sugerencias.map((sug, idx) => {
                    const isApplied = appliedIndices.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 space-y-2 transition ${
                          isApplied
                            ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                            Sección: {sug.seccion}
                          </span>

                          <button
                            onClick={() => {
                              onApplySuggestion({
                                seccion: sug.seccion,
                                cambioPropuesto: sug.cambioPropuesto,
                              });
                              setAppliedIndices([...appliedIndices, idx]);
                            }}
                            disabled={isApplied}
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                              isApplied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Sugerencia aplicada</span>
                              </>
                            ) : (
                              <>
                                <span>Aplicar sugerencia</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {sug.descripcion}
                        </p>
                        <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Cambio recomendado: </span>
                          <span>{sug.cambioPropuesto}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-[11px] text-slate-500">
            Ningún cambio se aplica automáticamente sin tu confirmación.
          </p>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 text-white dark:bg-slate-700 px-4 py-2 text-xs font-bold hover:bg-slate-900 cursor-pointer"
          >
            Cerrar revisión
          </button>
        </div>
      </div>
    </div>
  );
};
