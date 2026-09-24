import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  X,
  Loader2,
  Copy,
  BookOpen,
} from 'lucide-react';
import { MaterialItem, TipoMaterial, CampoFormativo } from '../../types';
import { CAMPOS_FORMATIVOS, GRADOS_PRIMARIA } from '../../data/nemCatalogs';
import { geminiService } from '../../services/geminiService';

interface MaterialsViewProps {
  materials: MaterialItem[];
  onSaveMaterial: (material: MaterialItem) => Promise<void>;
  onDeleteMaterial: (id: string) => Promise<void>;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onSaveMaterial,
  onDeleteMaterial,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(
    materials[0] || null
  );

  // Generator Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<TipoMaterial>('Ficha de trabajo');
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalGrado, setModalGrado] = useState('4°');
  const [modalCampo, setModalCampo] = useState<CampoFormativo>('Lenguajes');
  const [modalTema, setModalTema] = useState('');
  const [modalInstrucciones, setModalInstrucciones] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const materialTypes: TipoMaterial[] = [
    'Ficha de trabajo',
    'Cuestionario',
    'Lectura',
    'Preguntas de comprensión',
    'Sopa de letras',
    'Crucigrama',
    'Problemas matemáticos',
    'Tarjetas',
    'Organizador gráfico',
    'Actividad para colorear',
    'Ejercicios',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const generated = await geminiService.generateMaterial({
        tipo: modalTipo,
        titulo: modalTitulo.trim() || `Material: ${modalTipo}`,
        grado: modalGrado,
        campoFormativo: modalCampo,
        temaOContenido: modalTema,
        instruccionesEspecificas: modalInstrucciones,
      });

      const newMaterial: MaterialItem = {
        id: 'mat-' + Date.now(),
        titulo: generated.titulo || modalTitulo || `Material ${modalTipo}`,
        tipo: modalTipo,
        grado: modalGrado,
        campoFormativo: modalCampo,
        instrucciones:
          generated.instrucciones ||
          'Lee cuidadosamente y responde en tu cuaderno o en la ficha impresa.',
        contenidoTexto: generated.contenidoTexto || '',
        respuestasSugeridas: generated.respuestasSugeridas || '',
        createdAt: new Date().toISOString(),
      };

      await onSaveMaterial(newMaterial);
      setSelectedMaterial(newMaterial);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al generar el material didáctico.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Texto copiado al portapapeles!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-600" />
            Generador de Material Didáctico Imprimible
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Crea lecturas, fichas de trabajo, crucigramas, sopas de letras y problemas con IA
          </p>
        </div>

        <button
          onClick={() => {
            setModalTitulo('');
            setModalTema('');
            setModalInstrucciones('');
            setErrorMsg(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-700 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generar con IA</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: List of Materials */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Materiales Creados ({materials.length})
          </h3>
          <div className="space-y-2">
            {materials.map((m) => {
              const isSelected = selectedMaterial?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMaterial(m)}
                  className={`rounded-2xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-cyan-100 dark:bg-cyan-900/50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-300">
                      {m.tipo}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {m.grado} • {m.campoFormativo}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">
                    {m.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {m.instrucciones}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Viewer & Print */}
        <div className="lg:col-span-2">
          {selectedMaterial ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="rounded-md bg-cyan-100 dark:bg-cyan-900/50 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                    {selectedMaterial.tipo}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {selectedMaterial.titulo}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedMaterial.grado} Primaria • Campo: {selectedMaterial.campoFormativo}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(selectedMaterial.contenidoTexto)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 rounded-xl bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-cyan-700 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar el material "${selectedMaterial.titulo}"?`)) {
                        onDeleteMaterial(selectedMaterial.id);
                        setSelectedMaterial(null);
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
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-700/80 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Instrucciones para el alumno:</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{selectedMaterial.instrucciones}</p>
              </div>

              {/* Printable Body Sheet */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50/30 dark:bg-slate-900/30">
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedMaterial.contenidoTexto}
                </pre>
              </div>

              {/* Teacher key / Answers */}
              {selectedMaterial.respuestasSugeridas && (
                <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-4 text-xs space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-300">
                    Clave de respuestas y sugerencias pedagógicas:
                  </p>
                  <p className="text-amber-800 dark:text-amber-200/80 whitespace-pre-wrap">
                    {selectedMaterial.respuestasSugeridas}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
              Selecciona un material didáctico de la lista o genera uno nuevo con Gemini.
            </div>
          )}
        </div>
      </div>

      {/* Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Generador de Material con Gemini
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="overflow-y-auto space-y-4 py-4 flex-1 text-xs">
              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de material didáctico *
                  </label>
                  <select
                    value={modalTipo}
                    onChange={(e) => setModalTipo(e.target.value as TipoMaterial)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {materialTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grado escolar
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
                  Título del material
                </label>
                <input
                  type="text"
                  value={modalTitulo}
                  onChange={(e) => setModalTitulo(e.target.value)}
                  placeholder="Ej. Ficha de lectura: El viaje de la semilla"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tema, contenido o lectura base *
                </label>
                <textarea
                  rows={3}
                  required
                  value={modalTema}
                  onChange={(e) => setModalTema(e.target.value)}
                  placeholder="Ej. Texto sobre las abejas y la polinización en la península de Yucatán con 4 preguntas de inferencia."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instrucciones o enfoque específico
                </label>
                <input
                  type="text"
                  value={modalInstrucciones}
                  onChange={(e) => setModalInstrucciones(e.target.value)}
                  placeholder="Ej. Letra grande, vocabulario accesible y preguntas reflexivas"
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
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2 font-bold text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generando material con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generar Material</span>
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
