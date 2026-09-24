import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  Clock,
  Tag,
  BookOpen,
  Sparkles,
  Edit2,
  X,
  Check,
} from 'lucide-react';
import { ActivityBankItem, CampoFormativo } from '../../types';
import { CAMPOS_FORMATIVOS, GRADOS_PRIMARIA } from '../../data/nemCatalogs';

interface ActivityBankViewProps {
  activities: ActivityBankItem[];
  onSaveActivity: (activity: ActivityBankItem) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
  onInsertIntoPlan?: (activity: ActivityBankItem) => void;
}

export const ActivityBankView: React.FC<ActivityBankViewProps> = ({
  activities,
  onSaveActivity,
  onDeleteActivity,
  onInsertIntoPlan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampo, setSelectedCampo] = useState<string>('todos');
  const [selectedGrado, setSelectedGrado] = useState<string>('todos');

  // Modal create/edit
  const [editingItem, setEditingItem] = useState<ActivityBankItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.etiquetas?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCampo = selectedCampo === 'todos' || act.campoFormativo === selectedCampo;
    const matchesGrado = selectedGrado === 'todos' || act.grado === selectedGrado;

    return matchesSearch && matchesCampo && matchesGrado;
  });

  const handleOpenNew = () => {
    setEditingItem({
      id: 'act-' + Date.now(),
      titulo: '',
      campoFormativo: 'Lenguajes',
      grado: '4°',
      contenido: '',
      pda: '',
      descripcion: '',
      tiempo: '45 minutos',
      materiales: ['Cuaderno'],
      producto: '',
      evaluacion: 'Lista de cotejo',
      etiquetas: ['Dinámica', 'Equipo'],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (act: ActivityBankItem) => {
    const duplicated: ActivityBankItem = {
      ...act,
      id: 'act-' + Date.now(),
      titulo: `${act.titulo} (Copia)`,
      createdAt: new Date().toISOString(),
    };
    await onSaveActivity(duplicated);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await onSaveActivity(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-purple-600" />
            Banco de Actividades Docentes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Colección de dinámicas pedagógicas listas para reutilizar o insertar en proyectos escolares
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Actividad</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, dinámica o etiquetas (ej. lúdico, inferencia)..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-purple-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCampo}
            onChange={(e) => setSelectedCampo(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="todos">Todos los campos</option>
            {CAMPOS_FORMATIVOS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={selectedGrado}
            onChange={(e) => setSelectedGrado(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="todos">Todos los grados</option>
            {GRADOS_PRIMARIA.map((g) => (
              <option key={g.grado} value={g.grado}>
                {g.grado} Primaria
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-800/40 space-y-3">
          <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No hay actividades que coincidan con la búsqueda
          </h3>
          <p className="text-xs text-slate-500">Crea tu primera actividad en el banco.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-xs space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:text-purple-300">
                    {act.campoFormativo}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {act.grado} Primaria • {act.tiempo}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {act.titulo}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                  {act.descripcion}
                </p>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2.5 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <p>
                    <strong>Producto:</strong> {act.producto || 'En libreta'}
                  </p>
                  <p>
                    <strong>Evaluación:</strong> {act.evaluacion || 'Formativa'}
                  </p>
                </div>

                {act.etiquetas && act.etiquetas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {act.etiquetas.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-300 flex items-center gap-0.5"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <button
                  onClick={() => {
                    setEditingItem(act);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(act)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    title="Duplicar actividad"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la actividad "${act.titulo}"?`)) {
                        onDeleteActivity(act.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit / Create */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-purple-600" />
                {editingItem.titulo ? 'Editar Actividad' : 'Nueva Actividad Docente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="overflow-y-auto space-y-4 py-4 flex-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la actividad *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.titulo}
                  onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                  placeholder="Ej. El detective de ideas principales"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campo Formativo
                  </label>
                  <select
                    value={editingItem.campoFormativo}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        campoFormativo: e.target.value as CampoFormativo,
                      })
                    }
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
                    Grado
                  </label>
                  <select
                    value={editingItem.grado}
                    onChange={(e) => setEditingItem({ ...editingItem, grado: e.target.value })}
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
                  Descripción didáctica de la actividad *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingItem.descripcion}
                  onChange={(e) => setEditingItem({ ...editingItem, descripcion: e.target.value })}
                  placeholder="Describe los momentos, dinámicas y pasos para el alumno..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tiempo estimado
                  </label>
                  <input
                    type="text"
                    value={editingItem.tiempo}
                    onChange={(e) => setEditingItem({ ...editingItem, tiempo: e.target.value })}
                    placeholder="45 min"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Producto / Entregable
                  </label>
                  <input
                    type="text"
                    value={editingItem.producto}
                    onChange={(e) => setEditingItem({ ...editingItem, producto: e.target.value })}
                    placeholder="Esquema en cuaderno"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={editingItem.etiquetas?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      etiquetas: e.target.value.split(',').map((t) => t.trim()),
                    })
                  }
                  placeholder="Lectura, Lúdico, Equipo, Arte"
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
                  className="rounded-xl bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-700"
                >
                  Guardar en Banco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
