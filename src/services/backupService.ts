import { dbService } from './db';
import { FullBackup } from '../types';

export const backupService = {
  async createFullBackup(): Promise<FullBackup> {
    const [
      perfil,
      grupo,
      planeaciones,
      actividades,
      evaluaciones,
      materiales,
      carpetas,
      configuracion,
    ] = await Promise.all([
      dbService.getProfile(),
      dbService.getGroup(),
      dbService.getPlans(),
      dbService.getActivities(),
      dbService.getEvaluations(),
      dbService.getMaterials(),
      dbService.getFolders(),
      dbService.getSettings(),
    ]);

    return {
      app: 'PLANEANEM IA',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      perfil,
      grupo,
      planeaciones,
      actividades,
      evaluaciones,
      materiales,
      carpetas,
      configuracion,
    };
  },

  async downloadBackupFile(): Promise<void> {
    const backup = await this.createFullBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'planeanem-respaldo.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  async restoreFromFile(file: File): Promise<{ success: boolean; message: string; countPlans: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const backup = JSON.parse(content) as FullBackup;

          if (!backup || (!backup.planeaciones && !backup.perfil)) {
            return reject(new Error('El archivo no parece ser un respaldo válido de PLANEANEM IA.'));
          }

          // Restore Profile
          if (backup.perfil) {
            await dbService.saveProfile(backup.perfil);
          }

          // Restore Group
          if (backup.grupo) {
            await dbService.saveGroup(backup.grupo);
          }

          // Restore Plans
          if (Array.isArray(backup.planeaciones)) {
            for (const p of backup.planeaciones) {
              await dbService.savePlan(p);
            }
          }

          // Restore Activities
          if (Array.isArray(backup.actividades)) {
            for (const a of backup.actividades) {
              await dbService.saveActivity(a);
            }
          }

          // Restore Evaluations
          if (Array.isArray(backup.evaluaciones)) {
            for (const e of backup.evaluaciones) {
              await dbService.saveEvaluation(e);
            }
          }

          // Restore Materials
          if (Array.isArray(backup.materiales)) {
            for (const m of backup.materiales) {
              await dbService.saveMaterial(m);
            }
          }

          // Restore Folders
          if (Array.isArray(backup.carpetas)) {
            for (const f of backup.carpetas) {
              await dbService.saveFolder(f);
            }
          }

          // Restore Settings
          if (backup.configuracion) {
            await dbService.saveSettings(backup.configuracion);
          }

          resolve({
            success: true,
            message: 'Respaldo restaurado exitosamente.',
            countPlans: backup.planeaciones?.length || 0,
          });
        } catch (err: any) {
          reject(new Error(err?.message || 'Error al procesar el archivo JSON'));
        }
      };

      reader.onerror = () => reject(new Error('No fue posible leer el archivo seleccionado.'));
      reader.readAsText(file);
    });
  },
};
