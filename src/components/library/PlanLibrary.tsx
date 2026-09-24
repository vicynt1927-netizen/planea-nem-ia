import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  FolderPlus,
  Folder,
  Copy,
  Trash2,
  Printer,
  Download,
  Calendar,
  Layers,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import { DidacticPlan, FolderItem, CampoFormativo, TeacherProfile } from '../../types';
import { CAMPOS_FORMATIVOS } from '../../data/nemCatalogs';
import { exportPlanToWord } from '../../services/exportWord';

interface PlanLibraryProps {
  plans: DidacticPlan[];
  folders: FolderItem[];
  profile: TeacherProfile;
  onOpenPlan: (plan: DidacticPlan) => void;
  onNewPlan: () => void;
  onDuplicatePlan: (id: string) => Promise<void>;
  onDeletePlan: (id: string) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
  onMovePlanToFolder: (planId: string, folderId: string | undefined) => Promise<void>;
  onPrintPlan: (plan: DidacticPlan) => void;
}

export const PlanLibrary: React.FC<PlanLibraryProps> = ({
  plans,
  folders,
  profile,
  onOpenPlan,
  onNewPlan,
  onDuplicatePlan,
  onDeletePlan,
  onCreateFolder,
  onMovePlanToFolder,
  onPrintPlan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampo, setSelectedCampo] = useState<string>('todos');
  const [selectedFolder, setSelectedFolder] = useState<string>('todas');
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Filter logic
  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.proposito.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCampo =
      selectedCampo === 'todos' || p.campoFormativo === selectedCampo;

    const matchesFolder =
      selectedFolder === 'todas' ||
      (selectedFolder === 'sin-carpeta' ? !p.folderId : p.folderId === selectedFolder);

    return matchesSearch && matchesCampo && matchesFolder;
  });

  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setShowFolderModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Mis Planeaciones Didácticas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consulta, edita, organiza en carpetas, duplica e imprime tus planes curriculares
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFolderModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span>Nueva Carpeta</span>
          </button>

          <button
            onClick={onNewPlan}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Planeación</span>
          </button>
        </div>
      </div>

      {/* Folders Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedFolder('todas')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            selectedFolder === 'todas'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todas ({plans.length})</span>
        </button>

        {folders.map((f) => {
          const count = plans.filter((p) => p.folderId === f.id).length;
          const isSelected = selectedFolder === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span>{f.nombre} ({count})</span>
            </button>
          );
        })}

        <button
          onClick={() => setSelectedFolder('sin-carpeta')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition cursor-pointer ${
            selectedFolder === 'sin-carpeta'
              ? 'bg-blue-600 text-white shadow-2xs font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Sin carpeta</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, contenido o propósito didáctico..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCampo}
            onChange={(e) => setSelectedCampo(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-hidden font-medium"
          >
            <option value="todos">Todos los campos formativos</option>
            {CAMPOS_FORMATIVOS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-800/40 space-y-3">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No se encontraron planeaciones con estos criterios
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Prueba ajustando los filtros de búsqueda o crea una nueva planeación con el asistente.
          </p>
          <button
            onClick={onNewPlan}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear planeación</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-200 line-clamp-1">
                    {plan.campoFormativo}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {plan.grado} "{plan.grupo}" • {plan.sesiones.length} sesiones
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3
                    onClick={() => onOpenPlan(plan)}
                    className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {plan.titulo}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {plan.proposito || plan.contenido}
                  </p>
                </div>

                {/* Project type & methodology */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2.5 text-[11px] space-y-1 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60">
                  <p>
                    <strong>Proyecto:</strong> {plan.tipoProyecto}
                  </p>
                  <p className="line-clamp-1">
                    <strong>Producto:</strong> {plan.productoFinal || 'Por definir'}
                  </p>
                </div>

                {/* Folder assignment */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    value={plan.folderId || ''}
                    onChange={(e) => onMovePlanToFolder(plan.id, e.target.value || undefined)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="">Sin carpeta</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <button
                  onClick={() => onOpenPlan(plan)}
                  className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  <span>Abrir / Editar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicatePlan(plan.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    title="Duplicar planeación"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => exportPlanToWord(plan, profile)}
                    className="rounded-lg p-1.5 text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="Exportar a Word (.docx)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onPrintPlan(plan)}
                    className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    title="Imprimir o exportar a PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Seguro que deseas eliminar la planeación "${plan.titulo}"?`)) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer"
                    title="Eliminar planeación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-500" />
              Crear Nueva Carpeta
            </h3>
            <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ej. Septiembre / Proyectos STEAM / 4° A"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="rounded-xl px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Crear Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
