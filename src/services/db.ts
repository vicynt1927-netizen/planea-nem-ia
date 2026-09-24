import {
  DidacticPlan,
  ActivityBankItem,
  EvaluationInstrument,
  MaterialItem,
  FolderItem,
  TeacherProfile,
  GroupContext,
  AppSettings,
  PlanVersionHistory,
} from '../types';
import {
  DEMO_PLANS,
  DEMO_ACTIVITIES,
  DEMO_EVALUATIONS,
  DEMO_FOLDERS,
  DEMO_MATERIALS,
} from '../data/nemCatalogs';

const DB_NAME = 'PlaneaNemDB';
const DB_VERSION = 1;

export const DEFAULT_PROFILE: TeacherProfile = {
  nombre: 'Mtra. Alejandra Morales Estrada',
  escuela: 'Escuela Primaria "Benito Juárez"',
  cct: '09DPR1423Z',
  entidad: 'Ciudad de México',
  municipio: 'Iztapalapa',
  grado: '4°',
  grupo: 'A',
  cicloEscolar: '2026-2027',
  turno: 'Matutino',
};

export const DEFAULT_GROUP: GroupContext = {
  grado: '4°',
  grupo: 'A',
  numeroAlumnos: 28,
  fortalezas:
    'Grupo participativo, creativo, con notable disposición para actividades artísticas, dramatizaciones y trabajo en equipo.',
  necesidades:
    'Consolidar la comprensión lectora en nivel inferencial, formulación de argumentos lógicos y resolución de problemas multiplicativos.',
  areasOportunidad:
    'Manejo de tiempos en producciones escritas, autorregulación en dinámicas de juego libre y ortografía básica.',
  problematicas:
    'Poco hábito de lectura en el hogar y consumo frecuente de alimentos chatarra durante el receso escolar.',
  caracteristicasContexto:
    'Comunidad escolar urbana de nivel socioeconómico medio-bajo, con familias trabajadoras donde los abuelos apoyan frecuentemente en las tareas.',
  observaciones:
    'Dos alumnos con barreras de aprendizaje (BAP) en lectoescritura que requieren adecuaciones de acceso y lectura guiada.',
};

export const DEFAULT_SETTINGS: AppSettings = {
  tema: 'claro',
  tamanoLetra: 'mediana',
  nombreDocenteEnHeader: true,
  autoGuardadoSegundos: 30,
  inicializado: false,
};

let dbPromise: Promise<IDBDatabase> | null = null;
let useMemoryFallback = false;
const memoryStore: Record<string, Map<string, any>> = {
  plans: new Map(),
  activities: new Map(),
  evaluations: new Map(),
  materials: new Map(),
  folders: new Map(),
  profile: new Map(),
  group: new Map(),
  history: new Map(),
  settings: new Map(),
};

// Try loading any fallback memory store from localStorage if available
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = localStorage.getItem('planeanem_fallback_storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      for (const [key, items] of Object.entries(parsed)) {
        if (memoryStore[key] && Array.isArray(items)) {
          items.forEach((item: any) => {
            const id = item.id || 'current';
            memoryStore[key].set(id, item);
          });
        }
      }
    }
  }
} catch {
  // localStorage may also be blocked in some sandboxes
}

function persistMemoryStore() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const exportObj: Record<string, any[]> = {};
      for (const [key, map] of Object.entries(memoryStore)) {
        exportObj[key] = Array.from(map.values());
      }
      localStorage.setItem('planeanem_fallback_storage', JSON.stringify(exportObj));
    }
  } catch {
    // ignore
  }
}

function getDB(): Promise<IDBDatabase> {
  if (useMemoryFallback) {
    return Promise.reject(new Error('Modo respaldo en memoria activo'));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      useMemoryFallback = true;
      return reject(new Error('IndexedDB no está disponible en este entorno'));
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('plans')) {
          db.createObjectStore('plans', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('activities')) {
          db.createObjectStore('activities', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('evaluations')) {
          db.createObjectStore('evaluations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('materials')) {
          db.createObjectStore('materials', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('folders')) {
          db.createObjectStore('folders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('group')) {
          db.createObjectStore('group', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        useMemoryFallback = true;
        reject(request.error);
      };
    } catch (e) {
      useMemoryFallback = true;
      reject(e);
    }
  });

  return dbPromise;
}

// Generic transaction helpers with transparent fallback
async function performTx<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  if (!useMemoryFallback) {
    try {
      const db = await getDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        let req: IDBRequest<T> | void;
        try {
          req = callback(store);
        } catch (err) {
          return reject(err);
        }

        tx.oncomplete = () => {
          if (req && 'result' in req) {
            resolve(req.result);
          } else {
            resolve(undefined as unknown as T);
          }
        };
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } catch (err) {
      console.warn(`IndexedDB falló para '${storeName}'. Conmutando a almacenamiento en memoria.`, err);
      useMemoryFallback = true;
    }
  }

  // Memory fallback logic
  const store = memoryStore[storeName] || new Map<string, any>();
  memoryStore[storeName] = store;

  // Emulate getAll, get, put, delete
  return new Promise((resolve) => {
    const fakeStore: any = {
      getAll: () => Array.from(store.values()),
      get: (id: string) => store.get(id),
      put: (item: any) => {
        const id = item.id || 'current';
        store.set(id, item);
        persistMemoryStore();
        return item;
      },
      delete: (id: string) => {
        store.delete(id);
        persistMemoryStore();
      },
      clear: () => {
        store.clear();
        persistMemoryStore();
      },
    };

    const res = callback(fakeStore);
    resolve((res && (res as any).result !== undefined ? (res as any).result : res) as T);
  });
}

export const dbService = {
  // Initialization & seeding
  async init(): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.inicializado) {
      // Seed Demo Data
      for (const p of DEMO_PLANS) {
        await this.savePlan(p);
      }
      for (const a of DEMO_ACTIVITIES) {
        await this.saveActivity(a);
      }
      for (const e of DEMO_EVALUATIONS) {
        await this.saveEvaluation(e);
      }
      for (const m of DEMO_MATERIALS) {
        await this.saveMaterial(m);
      }
      for (const f of DEMO_FOLDERS) {
        await this.saveFolder(f);
      }

      await this.saveProfile(DEFAULT_PROFILE);
      await this.saveGroup(DEFAULT_GROUP);

      await this.saveSettings({
        ...DEFAULT_SETTINGS,
        inicializado: true,
      });
    }
  },

  // PLANS
  async getPlans(): Promise<DidacticPlan[]> {
    return performTx<DidacticPlan[]>('plans', 'readonly', (store) => store.getAll());
  },

  async getPlan(id: string): Promise<DidacticPlan | undefined> {
    return performTx<DidacticPlan>('plans', 'readonly', (store) => store.get(id));
  },

  async savePlan(plan: DidacticPlan): Promise<void> {
    const updatedPlan: DidacticPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };
    await performTx('plans', 'readwrite', (store) => store.put(updatedPlan));

    // Also record version history
    await this.recordPlanVersion(updatedPlan);
  },

  async deletePlan(id: string): Promise<void> {
    await performTx('plans', 'readwrite', (store) => store.delete(id));
  },

  async duplicatePlan(id: string): Promise<DidacticPlan> {
    const original = await this.getPlan(id);
    if (!original) throw new Error('Planeación no encontrada');

    const duplicated: DidacticPlan = {
      ...original,
      id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      titulo: `${original.titulo} (Copia)`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sesiones: original.sesiones.map((s, idx) => ({
        ...s,
        id: 's-' + Date.now() + '-' + idx,
      })),
    };

    await this.savePlan(duplicated);
    return duplicated;
  },

  // PLAN HISTORY
  async recordPlanVersion(plan: DidacticPlan): Promise<void> {
    const historyItem: PlanVersionHistory = {
      id: `ver-${plan.id}-${Date.now()}`,
      planId: plan.id,
      version: plan.version || 1,
      nombre: `Versión ${plan.version || 1} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      fecha: new Date().toISOString(),
      planData: JSON.parse(JSON.stringify(plan)),
    };
    await performTx('history', 'readwrite', (store) => store.put(historyItem));
  },

  async getPlanHistory(planId: string): Promise<PlanVersionHistory[]> {
    const allHistory = await performTx<PlanVersionHistory[]>('history', 'readonly', (store) =>
      store.getAll()
    );
    return allHistory
      .filter((h) => h.planId === planId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  },

  // ACTIVITIES
  async getActivities(): Promise<ActivityBankItem[]> {
    return performTx<ActivityBankItem[]>('activities', 'readonly', (store) => store.getAll());
  },

  async saveActivity(act: ActivityBankItem): Promise<void> {
    await performTx('activities', 'readwrite', (store) => store.put(act));
  },

  async deleteActivity(id: string): Promise<void> {
    await performTx('activities', 'readwrite', (store) => store.delete(id));
  },

  // EVALUATIONS
  async getEvaluations(): Promise<EvaluationInstrument[]> {
    return performTx<EvaluationInstrument[]>('evaluations', 'readonly', (store) => store.getAll());
  },

  async saveEvaluation(evaluation: EvaluationInstrument): Promise<void> {
    await performTx('evaluations', 'readwrite', (store) => store.put(evaluation));
  },

  async deleteEvaluation(id: string): Promise<void> {
    await performTx('evaluations', 'readwrite', (store) => store.delete(id));
  },

  // MATERIALS
  async getMaterials(): Promise<MaterialItem[]> {
    return performTx<MaterialItem[]>('materials', 'readonly', (store) => store.getAll());
  },

  async saveMaterial(material: MaterialItem): Promise<void> {
    await performTx('materials', 'readwrite', (store) => store.put(material));
  },

  async deleteMaterial(id: string): Promise<void> {
    await performTx('materials', 'readwrite', (store) => store.delete(id));
  },

  // FOLDERS
  async getFolders(): Promise<FolderItem[]> {
    return performTx<FolderItem[]>('folders', 'readonly', (store) => store.getAll());
  },

  async saveFolder(folder: FolderItem): Promise<void> {
    await performTx('folders', 'readwrite', (store) => store.put(folder));
  },

  async deleteFolder(id: string): Promise<void> {
    await performTx('folders', 'readwrite', (store) => store.delete(id));
  },

  // PROFILE
  async getProfile(): Promise<TeacherProfile> {
    const res = await performTx<{ id: string; profile: TeacherProfile }>(
      'profile',
      'readonly',
      (store) => store.get('main-profile')
    );
    return res ? res.profile : DEFAULT_PROFILE;
  },

  async saveProfile(profile: TeacherProfile): Promise<void> {
    await performTx('profile', 'readwrite', (store) =>
      store.put({ id: 'main-profile', profile })
    );
  },

  // GROUP CONTEXT
  async getGroup(): Promise<GroupContext> {
    const res = await performTx<{ id: string; group: GroupContext }>(
      'group',
      'readonly',
      (store) => store.get('main-group')
    );
    return res ? res.group : DEFAULT_GROUP;
  },

  async saveGroup(group: GroupContext): Promise<void> {
    await performTx('group', 'readwrite', (store) =>
      store.put({ id: 'main-group', group })
    );
  },

  // SETTINGS
  async getSettings(): Promise<AppSettings> {
    const res = await performTx<{ id: string; settings: AppSettings }>(
      'settings',
      'readonly',
      (store) => store.get('app-settings')
    );
    return res ? res.settings : DEFAULT_SETTINGS;
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await performTx('settings', 'readwrite', (store) =>
      store.put({ id: 'app-settings', settings })
    );
  },

  // RESET ALL DATA TO DEMO
  async resetToDemo(): Promise<void> {
    const db = await getDB();
    const stores = [
      'plans',
      'activities',
      'evaluations',
      'materials',
      'folders',
      'profile',
      'group',
      'history',
      'settings',
    ];
    for (const storeName of stores) {
      await performTx(storeName, 'readwrite', (store) => store.clear());
    }
    await this.saveSettings({ ...DEFAULT_SETTINGS, inicializado: false });
    await this.init();
  },
};
