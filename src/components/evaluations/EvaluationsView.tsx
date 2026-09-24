import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  X,
  Loader2,
  BookOpen,
} from 'lucide-react';
import {
  EvaluationInstrument,
  TipoInstrumento,
  CampoFormativo,
  IndicadorEvaluacion,
} from '../../types';
import { CAMPOS_FORMATIVOS, GRADOS_PRIMARIA } from '../../data/nemCatalogs';
import { geminiService } from '../../services/geminiService';

interface EvaluationsViewProps {
  evaluations: EvaluationInstrument[];
  onSaveEvaluation: (evaluation: EvaluationInstrument) => Promise<void>;
  onDeleteEvaluation: (id: string) => Promise<void>;
}

export const EvaluationsView: React.FC<EvaluationsViewProps> = ({
  evaluations,
  onSaveEvaluation,
  onDeleteEvaluation,
}) => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationInstrument | null>(
    evaluations[0] || null
  );

  // Modal Generator State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<TipoInstrumento>('Rúbrica');
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalCampo, setModalCampo] = useState<CampoFormativo>('Lenguajes');
  const [modalGrado, setModalGrado] = useState('4°');
  const [modalContenido, setModalContenido] = useState('');
  const [modalPda, setModalPda] = useState('');
  const [modalProposito, setModalProposito] = useState('');
  const [modalEvidencia, setModalEvidencia] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenNewModal = () => {
    setModalTitulo('');
    setModalContenido('');
    setModalPda('');
    setModalProposito('');
    setModalEvidencia('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const generated = await geminiService.generateEvaluation({
        tipo: modalTipo,
        titulo: modalTitulo.trim() || `Instrumento de Evaluación: ${modalTipo}`,
        campoFormativo: modalCampo,
        grado: modalGrado,
        contenido: modalContenido,
        pda: modalPda,
        proposito: modalProposito,
        productoEvidencia: modalEvidencia,
      });

      const newEval: EvaluationInstrument = {
        id: 'eval-' + Date.now(),
        titulo: generated.titulo || modalTitulo || `Evaluación ${modalTipo}`,
        tipo: modalTipo,
        campoFormativo: modalCampo,
        grado: modalGrado,
        contenido: modalContenido,
        pda: modalPda,
        proposito: modalProposito,
        productoEvidencia: modalEvidencia,
        instrucciones:
          generated.instrucciones ||
          'Evalúe el nivel de desempeño alcanzado de acuerdo con los siguientes criterios formativos.',
        escala: generated.escala || ['Sobresaliente', 'Satisfactorio', 'Básico', 'Requiere Apoyo'],
        indicadores: generated.indicadores || [],
        createdAt: new Date().toISOString(),
      };

      await onSaveEvaluation(newEval);
      setSelectedEvaluation(newEval);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al generar la evaluación');
    } finally {
      setIsGenerating(false);
    }
  };

  // Editable Indicator
  const handleUpdateIndicator = (
    indId: string,
    field: string,
    val: any,
    subLevel?: string
  ) => {
    if (!selectedEvaluation) return;
    const updated = {
      ...selectedEvaluation,
      indicadores: selectedEvaluation.indicadores.map((ind) => {
        if (ind.id !== indId) return ind;
        if (subLevel) {
          return {
            ...ind,
            criterios: {
              ...(ind.criterios || {}),
              [subLevel]: val,
            },
          };
        }
        return { ...ind, [field]: val };
      }),
    };
    setSelectedEvaluation(updated);
    onSaveEvaluation(updated);
  };

  const handleAddIndicator = () => {
    if (!selectedEvaluation) return;
    const newInd: IndicadorEvaluacion = {
      id: 'ind-' + Date.now(),
      descripcion: 'Nuevo indicador formativo observable',
      criterios: {
        nivelSobresaliente: 'Desempeño destacado y autónomo',
        nivelSatisfactorio: 'Cumple satisfactoriamente con el indicador',
        nivelBasico: 'Presenta avance parcial con apoyo',
        nivelRequiereApoyo: 'Requiere acompañamiento focalizado',
      },
    };
    const updated = {
      ...selectedEvaluation,
      indicadores: [...selectedEvaluation.indicadores, newInd],
    };
    setSelectedEvaluation(updated);
    onSaveEvaluation(updated);
  };

  const handleDeleteIndicator = (id: string) => {
    if (!selectedEvaluation) return;
    const updated = {
      ...selectedEvaluation,
      indicadores: selectedEvaluation.indicadores.filter((i) => i.id !== id),
    };
    setSelectedEvaluation(updated);
    onSaveEvaluation(updated);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-rose-600" />
            Instrumentos de Evaluación Formativa
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rúbricas analíticas, listas de cotejo, escalas estimativas y registros anecdóticos para la NEM
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Crear con IA</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: List of Instruments */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Instrumentos Guardados ({evaluations.length})
          </h3>
          <div className="space-y-2">
            {evaluations.map((e) => {
              const isSelected = selectedEvaluation?.id === e.id;
              return (
                <div
                  key={e.id}
                  onClick={() => setSelectedEvaluation(e)}
                  className={`rounded-2xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-300">
                      {e.tipo}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {e.grado} • {e.campoFormativo}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">
                    {e.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {e.indicadores?.length || 0} criterios
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Instrument View & Editing */}
        <div className="lg:col-span-2">
          {selectedEvaluation ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="rounded-md bg-rose-100 dark:bg-rose-900/50 px-2.5 py-1 text-xs font-bold text-rose-800 dark:text-rose-300">
                    {selectedEvaluation.tipo}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {selectedEvaluation.titulo}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedEvaluation.grado} Primaria • Campo: {selectedEvaluation.campoFormativo}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la evaluación "${selectedEvaluation.titulo}"?`)) {
                        onDeleteEvaluation(selectedEvaluation.id);
                        setSelectedEvaluation(null);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instrucciones de aplicación docente
                </label>
                <textarea
                  rows={2}
                  value={selectedEvaluation.instrucciones}
                  onChange={(e) => {
                    const updated = { ...selectedEvaluation, instrucciones: e.target.value };
                    setSelectedEvaluation(updated);
                    onSaveEvaluation(updated);
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {/* Indicators List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Indicadores Formativos ({selectedEvaluation.indicadores?.length || 0})
                  </h3>
                  <button
                    onClick={handleAddIndicator}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar indicador</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedEvaluation.indicadores?.map((ind, idx) => (
                    <div
                      key={ind.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={ind.descripcion}
                          onChange={(e) =>
                            handleUpdateIndicator(ind.id, 'descripcion', e.target.value)
                          }
                          className="w-full font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-rose-500 focus:outline-hidden pb-0.5"
                        />
                        <button
                          onClick={() => handleDeleteIndicator(ind.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* If Rubric, show 4 levels */}
                      {selectedEvaluation.tipo === 'Rúbrica' && ind.criterios && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                              Sobresaliente (10):
                            </span>
                            <textarea
                              rows={2}
                              value={ind.criterios.nivelSobresaliente || ''}
                              onChange={(e) =>
                                handleUpdateIndicator(
                                  ind.id,
                                  '',
                                  e.target.value,
                                  'nivelSobresaliente'
                                )
                              }
                              className="w-full bg-transparent text-emerald-950 dark:text-emerald-200 text-xs focus:outline-hidden"
                            />
                          </div>

                          <div className="bg-blue-50/70 dark:bg-blue-950/30 p-2 rounded-xl border border-blue-200 dark:border-blue-800/60">
                            <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">
                              Satisfactorio (8-9):
                            </span>
                            <textarea
                              rows={2}
                              value={ind.criterios.nivelSatisfactorio || ''}
                              onChange={(e) =>
                                handleUpdateIndicator(
                                  ind.id,
                                  '',
                                  e.target.value,
                                  'nivelSatisfactorio'
                                )
                              }
                              className="w-full bg-transparent text-blue-950 dark:text-blue-200 text-xs focus:outline-hidden"
                            />
                          </div>

                          <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-200 dark:border-amber-800/60">
                            <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                              Básico (6-7):
                            </span>
                            <textarea
                              rows={2}
                              value={ind.criterios.nivelBasico || ''}
                              onChange={(e) =>
                                handleUpdateIndicator(
                                  ind.id,
                                  '',
                                  e.target.value,
                                  'nivelBasico'
                                )
                              }
                              className="w-full bg-transparent text-amber-950 dark:text-amber-200 text-xs focus:outline-hidden"
                            />
                          </div>

                          <div className="bg-rose-50/70 dark:bg-rose-950/30 p-2 rounded-xl border border-rose-200 dark:border-rose-800/60">
                            <span className="font-bold text-rose-800 dark:text-rose-300 block mb-0.5">
                              Requiere Apoyo (5):
                            </span>
                            <textarea
                              rows={2}
                              value={ind.criterios.nivelRequiereApoyo || ''}
                              onChange={(e) =>
                                handleUpdateIndicator(
                                  ind.id,
                                  '',
                                  e.target.value,
                                  'nivelRequiereApoyo'
                                )
                              }
                              className="w-full bg-transparent text-rose-950 dark:text-rose-200 text-xs focus:outline-hidden"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
              Selecciona un instrumento de la lista o crea uno nuevo con IA.
            </div>
          )}
        </div>
      </div>

      {/* Modal Generator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Generador de Instrumentos con Gemini
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateAI} className="overflow-y-auto space-y-4 py-4 flex-1 text-xs">
              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de instrumento *
                  </label>
                  <select
                    value={modalTipo}
                    onChange={(e) => setModalTipo(e.target.value as TipoInstrumento)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Rúbrica">Rúbrica analítica</option>
                    <option value="Lista de cotejo">Lista de cotejo</option>
                    <option value="Escala estimativa">Escala estimativa</option>
                    <option value="Guía de observación">Guía de observación</option>
                    <option value="Autoevaluación">Autoevaluación</option>
                    <option value="Coevaluación">Coevaluación</option>
                    <option value="Registro anecdótico">Registro anecdótico</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grado
                  </label>
                  <select
                    value={modalGrado}
                    onChange={(e) => setModalGrado(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {GRADOS_PRIMARIA.map((g) => (
                      <option key={g.grado} value={g.grado}>
                        {g.grado} Primaria
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título del instrumento
                </label>
                <input
                  type="text"
                  value={modalTitulo}
                  onChange={(e) => setModalTitulo(e.target.value)}
                  placeholder="Ej. Rúbrica para Cuento Ilustrado y Comprensión"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campo Formativo
                </label>
                <select
                  value={modalCampo}
                  onChange={(e) => setModalCampo(e.target.value as CampoFormativo)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {CAMPOS_FORMATIVOS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contenido o PDA que se desea evaluar *
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalPda}
                  onChange={(e) => setModalPda(e.target.value)}
                  placeholder="Ej. Identifica ideas principales e infiere intenciones de personajes en textos narrativos."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Producto o evidencia esperada
                </label>
                <input
                  type="text"
                  value={modalEvidencia}
                  onChange={(e) => setModalEvidencia(e.target.value)}
                  placeholder="Ej. Cuento escrito individual o maqueta interactiva"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generando con Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generar Criterios con IA</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
