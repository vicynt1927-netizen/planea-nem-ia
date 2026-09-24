import React, { useState, useEffect } from 'react';
import { dbService, DEFAULT_PROFILE, DEFAULT_GROUP, DEFAULT_SETTINGS } from './services/db';
import {
  DidacticPlan,
  TeacherProfile,
  GroupContext,
  ActivityBankItem,
  EvaluationInstrument,
  MaterialItem,
  FolderItem,
  AppSettings,
} from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProfileView } from './components/profile/ProfileView';
import { GroupView } from './components/group/GroupView';
import { PlanWizard } from './components/planner/PlanWizard';
import { PlanEditor } from './components/planner/PlanEditor';
import { PrintableView } from './components/planner/PrintableView';
import { PlanLibrary } from './components/library/PlanLibrary';
import { ActivityBankView } from './components/activities/ActivityBankView';
import { EvaluationsView } from './components/evaluations/EvaluationsView';
import { MaterialsView } from './components/materials/MaterialsView';
import { CalendarView } from './components/calendar/CalendarView';
import { BackupView } from './components/backup/BackupView';
import { SettingsView } from './components/settings/SettingsView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { AIAssistantModal } from './components/planner/AIAssistantModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App Data
  const [profile, setProfile] = useState<TeacherProfile>(DEFAULT_PROFILE);
  const [group, setGroup] = useState<GroupContext>(DEFAULT_GROUP);
  const [plans, setPlans] = useState<DidacticPlan[]>([]);
  const [activities, setActivities] = useState<ActivityBankItem[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationInstrument[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Active Plan States
  const [activePlanForEdit, setActivePlanForEdit] = useState<DidacticPlan | null>(null);
  const [activePlanForPrint, setActivePlanForPrint] = useState<DidacticPlan | null>(null);

  // Modals
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);

  // Initialize DB and load data
  useEffect(() => {
    loadAllData();
  }, []);

  // Theme Sync with HTML tag
  useEffect(() => {
    if (settings.tema === 'oscuro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.tema]);

  const loadAllData = async () => {
    try {
      await dbService.init();
      const [
        loadedProfile,
        loadedGroup,
        loadedPlans,
        loadedActivities,
        loadedEvaluations,
        loadedMaterials,
        loadedFolders,
        loadedSettings,
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

      setProfile(loadedProfile);
      setGroup(loadedGroup);
      setPlans(loadedPlans);
      setActivities(loadedActivities);
      setEvaluations(loadedEvaluations);
      setMaterials(loadedMaterials);
      setFolders(loadedFolders);
      setSettings(loadedSettings);

      // Show onboarding if never completed
      if (!loadedSettings.inicializado) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Error cargando datos de PlaneaNEM:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (updated: TeacherProfile) => {
    await dbService.saveProfile(updated);
    setProfile(updated);
  };

  // Group Save
  const handleSaveGroup = async (updated: GroupContext) => {
    await dbService.saveGroup(updated);
    setGroup(updated);
  };

  // Settings Save
  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    await dbService.saveSettings(updated);
    setSettings(updated);
  };

  // Plan Creation
  const handlePlanCreated = async (newPlan: DidacticPlan) => {
    await dbService.savePlan(newPlan);
    setPlans((prev) => [newPlan, ...prev.filter((p) => p.id !== newPlan.id)]);
    setActivePlanForEdit(newPlan);
    setCurrentTab('editor');
  };

  // Duplicate Plan
  const handleDuplicatePlan = async (id: string) => {
    const duplicated = await dbService.duplicatePlan(id);
    setPlans((prev) => [duplicated, ...prev]);
  };

  // Delete Plan
  const handleDeletePlan = async (id: string) => {
    await dbService.deletePlan(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    if (activePlanForEdit?.id === id) {
      setActivePlanForEdit(null);
      setCurrentTab('library');
    }
  };

  // Move Plan to Folder
  const handleMovePlanToFolder = async (planId: string, folderId: string | undefined) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    const updated = { ...plan, folderId };
    await dbService.savePlan(updated);
    setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
  };

  // Folders
  const handleCreateFolder = async (name: string) => {
    const newFolder: FolderItem = {
      id: 'f-' + Date.now(),
      nombre: name,
      createdAt: new Date().toISOString(),
    };
    await dbService.saveFolder(newFolder);
    setFolders((prev) => [...prev, newFolder]);
  };

  // Activities
  const handleSaveActivity = async (act: ActivityBankItem) => {
    await dbService.saveActivity(act);
    setActivities((prev) => [act, ...prev.filter((a) => a.id !== act.id)]);
  };

  const handleDeleteActivity = async (id: string) => {
    await dbService.deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  // Evaluations
  const handleSaveEvaluation = async (evaluation: EvaluationInstrument) => {
    await dbService.saveEvaluation(evaluation);
    setEvaluations((prev) => [evaluation, ...prev.filter((e) => e.id !== evaluation.id)]);
  };

  const handleDeleteEvaluation = async (id: string) => {
    await dbService.deleteEvaluation(id);
    setEvaluations((prev) => prev.filter((e) => e.id !== id));
  };

  // Materials
  const handleSaveMaterial = async (material: MaterialItem) => {
    await dbService.saveMaterial(material);
    setMaterials((prev) => [material, ...prev.filter((m) => m.id !== material.id)]);
  };

  const handleDeleteMaterial = async (id: string) => {
    await dbService.deleteMaterial(id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Onboarding Complete
  const handleOnboardingComplete = async (completedProfile: TeacherProfile) => {
    await handleSaveProfile(completedProfile);
    await handleUpdateSettings({ inicializado: true });
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Iniciando PLANEANEM IA...
          </p>
        </div>
      </div>
    );
  }

  // Full printable mode
  if (activePlanForPrint) {
    return (
      <PrintableView
        plan={activePlanForPrint}
        profile={profile}
        onBack={() => setActivePlanForPrint(null)}
      />
    );
  }

  const getFontSizeClass = () => {
    if (settings.tamanoLetra === 'pequena') return 'text-[13px]';
    if (settings.tamanoLetra === 'grande') return 'text-[15px]';
    return 'text-sm';
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col ${getFontSizeClass()}`}>
      {/* Top Author Notice Banner */}
      <aside aria-label="Información del autor" className="w-full bg-slate-900 dark:bg-black border-b border-slate-800 text-slate-200 text-xs py-1.5 px-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">autor:</span>
            <span className="font-semibold text-white">Victor Manuel Santigo Abundis</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-300">
            <a href="tel:3841024218" className="hover:text-amber-300 transition-colors">
              <strong className="text-amber-400 font-semibold">tel:</strong> 3841024218
            </a>
            <span className="text-slate-600">|</span>
            <a href="mailto:vicynt1927@gmail.com" className="hover:text-amber-300 transition-colors">
              <strong className="text-amber-400 font-semibold">mail:</strong> vicynt1927@gmail.com
            </a>
          </div>
        </div>
      </aside>

      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        profile={profile}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onNavigate={(tab) => {
          setActivePlanForEdit(null);
          setCurrentTab(tab);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setActivePlanForEdit(null);
            if (tab === 'ai-assistant') {
              setShowAIAssistantModal(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Active Tab Routing */}
          {activePlanForEdit ? (
            <PlanEditor
              initialPlan={activePlanForEdit}
              profile={profile}
              group={group}
              onBack={() => {
                setActivePlanForEdit(null);
                setCurrentTab('library');
              }}
              onOpenPrintView={(p) => setActivePlanForPrint(p)}
            />
          ) : currentTab === 'dashboard' ? (
            <Dashboard
              profile={profile}
              plans={plans}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenPlan={(plan) => setActivePlanForEdit(plan)}
              onNewPlanManual={() => setCurrentTab('wizard')}
              onOpenAIAssistant={() => setShowAIAssistantModal(true)}
            />
          ) : currentTab === 'profile' ? (
            <ProfileView profile={profile} onSave={handleSaveProfile} />
          ) : currentTab === 'group' ? (
            <GroupView group={group} onSave={handleSaveGroup} />
          ) : currentTab === 'wizard' ? (
            <PlanWizard
              profile={profile}
              group={group}
              onPlanCreated={handlePlanCreated}
              onCancel={() => setCurrentTab('dashboard')}
            />
          ) : currentTab === 'library' ? (
            <PlanLibrary
              plans={plans}
              folders={folders}
              profile={profile}
              onOpenPlan={(p) => setActivePlanForEdit(p)}
              onNewPlan={() => setCurrentTab('wizard')}
              onDuplicatePlan={handleDuplicatePlan}
              onDeletePlan={handleDeletePlan}
              onCreateFolder={handleCreateFolder}
              onMovePlanToFolder={handleMovePlanToFolder}
              onPrintPlan={(p) => setActivePlanForPrint(p)}
            />
          ) : currentTab === 'activities' ? (
            <ActivityBankView
              activities={activities}
              onSaveActivity={handleSaveActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          ) : currentTab === 'evaluations' ? (
            <EvaluationsView
              evaluations={evaluations}
              onSaveEvaluation={handleSaveEvaluation}
              onDeleteEvaluation={handleDeleteEvaluation}
            />
          ) : currentTab === 'materials' ? (
            <MaterialsView
              materials={materials}
              onSaveMaterial={handleSaveMaterial}
              onDeleteMaterial={handleDeleteMaterial}
            />
          ) : currentTab === 'calendar' ? (
            <CalendarView
              plans={plans}
              evaluations={evaluations}
              onOpenPlan={(p) => setActivePlanForEdit(p)}
            />
          ) : currentTab === 'backups' ? (
            <BackupView onRefreshAllData={loadAllData} />
          ) : currentTab === 'settings' ? (
            <SettingsView
              settings={settings}
              profile={profile}
              onUpdateSettings={handleUpdateSettings}
              onNavigate={(t) => setCurrentTab(t)}
            />
          ) : null}
        </main>
      </div>

      {/* Bottom Navigation for Mobile Devices */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActivePlanForEdit(null);
          if (tab === 'ai-assistant') {
            setShowAIAssistantModal(true);
          } else {
            setCurrentTab(tab);
          }
        }}
      />

      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        initialProfile={profile}
        onComplete={handleOnboardingComplete}
      />

      {/* Gemini AI Full Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIAssistantModal}
        onClose={() => setShowAIAssistantModal(false)}
        profile={profile}
        group={group}
        onPlanGenerated={handlePlanCreated}
      />
    </div>
  );
}
