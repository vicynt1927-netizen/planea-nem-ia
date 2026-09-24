import React from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { DidacticPlan, TeacherProfile } from '../../types';
import { exportPlanToWord } from '../../services/exportWord';

interface PrintableViewProps {
  plan: DidacticPlan;
  profile: TeacherProfile;
  onBack: () => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({ plan, profile, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWordExport = async () => {
    await exportPlanToWord(plan, profile);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-2 sm:px-6">
      {/* Top bar (hidden in print) */}
      <div className="print:hidden max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al editor</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleWordExport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 px-3.5 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Word (.docx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar como PDF</span>
          </button>
        </div>
      </div>

      {/* Sheet view styled as Letter size */}
      <div className="max-w-[216mm] mx-auto bg-white p-8 sm:p-12 shadow-xl border border-slate-200 text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-[11px] font-black tracking-wider text-slate-600 uppercase">
                Secretaría de Educación Pública
              </h3>
              <h1 className="text-lg font-black tracking-tight text-blue-950">
                PLANEACIÓN DIDÁCTICA • NUEVA ESCUELA MEXICANA
              </h1>
              <p className="text-xs font-bold text-slate-700">
                Ciclo Escolar: {profile.cicloEscolar || '2026-2027'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-blue-900">
                {profile.escuela || 'Escuela Primaria'}
              </p>
              <p className="text-[10px] text-slate-600">
                CCT: {profile.cct || 'N/D'} • Turno: {profile.turno || 'Matutino'}
              </p>
              <p className="text-[10px] text-slate-600">
                {profile.municipio ? `${profile.municipio}, ` : ''}{profile.entidad || 'México'}
              </p>
            </div>
          </div>
        </div>

        {/* Project Title Banner */}
        <div className="bg-slate-100 p-3 rounded-lg border border-slate-300 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
              Proyecto de {plan.tipoProyecto}
            </span>
            <span className="text-[10px] font-bold text-blue-900">
              {plan.fase} • {plan.grado} Grado, Grupo "{plan.grupo}"
            </span>
          </div>
          <h2 className="text-base font-black text-blue-900 mt-1">
            "{plan.titulo}"
          </h2>
          <p className="text-xs text-slate-700 mt-0.5 font-medium">
            <strong>Temporalidad:</strong> {plan.temporalidad} ({plan.numeroSesiones} sesiones) • <strong>Duración:</strong> {plan.duracionSesion}
          </p>
        </div>

        {/* General Data Table */}
        <div className="mb-6 overflow-hidden border border-slate-300 rounded-lg text-xs">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/4 bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Docente titular:
                </td>
                <td className="w-3/4 p-2 text-slate-800 font-semibold">{profile.nombre || 'Docente'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Campo Formativo:
                </td>
                <td className="p-2 font-black text-blue-900">{plan.campoFormativo}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Metodología:
                </td>
                <td className="p-2 text-slate-800">{plan.metodologia}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Ejes Articuladores:
                </td>
                <td className="p-2 text-slate-800">{plan.ejesArticuladores?.join(', ') || 'No especificados'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Contenido oficial:
                </td>
                <td className="p-2 text-slate-800 leading-relaxed">{plan.contenido}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  PDA:
                </td>
                <td className="p-2 text-slate-800 leading-relaxed">{plan.pda}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Propósito didáctico:
                </td>
                <td className="p-2 text-slate-800 leading-relaxed">{plan.proposito}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Problemática / Contexto:
                </td>
                <td className="p-2 text-slate-800 leading-relaxed">
                  {plan.problematica} {plan.situacionContexto ? `• ${plan.situacionContexto}` : ''}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-50 p-2 font-bold text-slate-800 border-r border-slate-200">
                  Producto final / Evidencia:
                </td>
                <td className="p-2 font-bold text-teal-800 leading-relaxed">{plan.productoFinal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sessions Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black tracking-wider text-slate-700 uppercase border-b-2 border-slate-400 pb-1">
            SECUENCIA DIDÁCTICA DE SESIONES
          </h3>

          {plan.sesiones?.map((s) => (
            <div
              key={s.id}
              className="border border-slate-300 rounded-lg overflow-hidden text-xs page-break-inside-avoid mb-4"
            >
              <div className="bg-slate-100 p-2 border-b border-slate-300 flex items-center justify-between font-bold">
                <span className="text-blue-900 font-black">
                  Sesión {s.numero}: {s.momento}
                </span>
                <span className="text-slate-600 font-normal">
                  Tiempo: {s.tiempo} • Org: {s.organizacion}
                </span>
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <span className="font-bold text-slate-800">Propósito de la sesión: </span>
                  <span className="text-slate-700">{s.proposito}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2 rounded-sm border border-slate-200">
                  <div>
                    <span className="font-black text-blue-900 block mb-0.5">INICIO:</span>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{s.inicio}</p>
                  </div>
                  <div>
                    <span className="font-black text-blue-900 block mb-0.5">DESARROLLO:</span>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{s.desarrollo}</p>
                  </div>
                  <div>
                    <span className="font-black text-blue-900 block mb-0.5">CIERRE:</span>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{s.cierre}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-800">Actividades del docente: </span>
                    <span className="text-slate-700">{s.actividadesDocente}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Actividades del alumno: </span>
                    <span className="text-slate-700">{s.actividadesAlumno}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800">Materiales: </span>
                    <span className="text-slate-700">{s.materiales?.join(', ') || 'Cuaderno escolar'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Producto/Evidencia: </span>
                    <span className="text-slate-700 font-semibold">{s.productoEvidencia}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Evaluación: </span>
                    <span className="text-slate-700">{s.evaluacion} ({s.instrumento})</span>
                  </div>
                </div>

                {s.adecuaciones && (
                  <div className="text-[11px] bg-amber-50/70 p-1.5 rounded-sm border border-amber-200 text-amber-900">
                    <span className="font-bold">Adecuaciones (BAP): </span>
                    <span>{s.adecuaciones}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Official Signatures Footer */}
        <div className="mt-16 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs page-break-inside-avoid">
          <div>
            <div className="w-48 mx-auto border-b border-slate-400 pb-1 mb-1" />
            <p className="font-bold text-slate-800">{profile.nombre || 'Docente Titular'}</p>
            <p className="text-[10px] text-slate-500">Docente de Grupo</p>
          </div>
          <div>
            <div className="w-48 mx-auto border-b border-slate-400 pb-1 mb-1" />
            <p className="font-bold text-slate-800">Vo. Bo. Dirección Escolar</p>
            <p className="text-[10px] text-slate-500">Sello y Firma</p>
          </div>
        </div>
      </div>
    </div>
  );
};
