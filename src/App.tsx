import React, { useState, useEffect } from 'react';
import { ConnectedApp, AppType } from './types';
import { INITIAL_APPS } from './data/defaultData';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AppHub } from './components/apps/AppHub';
import { AppStudio } from './components/builder/AppStudio';
import { PedagogyHub } from './components/pedagogy/PedagogyHub';
import { LessonPlanAssistant } from './components/pedagogy/LessonPlanAssistant';
import { ShareEmbedModal } from './components/builder/ShareEmbedModal';
import { ClassroomPresentationModal } from './components/presentation/ClassroomPresentationModal';

const STORAGE_KEY = 'educraft_innovate_apps_v1';

export default function App() {
  const [apps, setApps] = useState<ConnectedApp[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // use default
      }
    }
    return INITIAL_APPS;
  });

  const [activeTab, setActiveTab] = useState<'apps' | 'studio' | 'pedagogy' | 'lesson_plan'>('apps');
  const [editingApp, setEditingApp] = useState<ConnectedApp | null>(null);
  const [shareApp, setShareApp] = useState<ConnectedApp | null>(null);
  const [presentationAppId, setPresentationAppId] = useState<string | null>(null);
  const [selectedPedagogyForLesson, setSelectedPedagogyForLesson] = useState<string>('Dạy học theo Trạm kết hợp Ứng dụng số');

  // Sync apps to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch {
      // storage quota fallback
    }
  }, [apps]);

  const handleSaveApp = (newApp: ConnectedApp) => {
    setApps((prev) => {
      const existingIdx = prev.findIndex((a) => a.id === newApp.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newApp;
        return updated;
      }
      return [newApp, ...prev];
    });
    setEditingApp(null);
    setActiveTab('apps');
  };

  const handleDeleteApp = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  const handleImportApps = (imported: ConnectedApp[]) => {
    setApps(imported);
  };

  const handleOpenStudio = (appToEdit?: ConnectedApp) => {
    setEditingApp(appToEdit || null);
    setActiveTab('studio');
  };

  const handleSelectAppTypeFromPedagogy = (type: AppType) => {
    // Find an app of that type or open studio for that type
    const found = apps.find((a) => a.type === type);
    if (found) {
      setActiveTab('apps');
    } else {
      setActiveTab('studio');
    }
  };

  const handleOpenLessonPlannerWithMethod = (methodName: string) => {
    setSelectedPedagogyForLesson(methodName);
    setActiveTab('lesson_plan');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'studio' && activeTab !== 'studio') {
            setEditingApp(null);
          }
          setActiveTab(tab);
        }}
        onEnterPresentationMode={() => {
          setPresentationAppId(apps[0]?.id || null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'apps' && (
          <AppHub
            apps={apps}
            onOpenAppStudio={handleOpenStudio}
            onOpenShareModal={(app) => setShareApp(app)}
            onDeleteApp={handleDeleteApp}
            onLaunchPresentation={(appId) => setPresentationAppId(appId)}
          />
        )}

        {activeTab === 'studio' && (
          <AppStudio
            editingApp={editingApp}
            onSaveApp={handleSaveApp}
            onCancel={() => {
              setEditingApp(null);
              setActiveTab('apps');
            }}
          />
        )}

        {activeTab === 'pedagogy' && (
          <PedagogyHub
            onSelectAppType={handleSelectAppTypeFromPedagogy}
            onOpenLessonPlannerWithMethod={handleOpenLessonPlannerWithMethod}
          />
        )}

        {activeTab === 'lesson_plan' && (
          <LessonPlanAssistant
            initialMethod={selectedPedagogyForLesson}
            onLaunchApp={(type) => {
              handleSelectAppTypeFromPedagogy(type);
            }}
          />
        )}
      </main>

      {/* Share / QR / Embed Modal */}
      {shareApp && (
        <ShareEmbedModal
          app={shareApp}
          onClose={() => setShareApp(null)}
        />
      )}

      {/* Smartboard / Projector Presentation Mode */}
      {presentationAppId && (
        <ClassroomPresentationModal
          apps={apps}
          initialAppId={presentationAppId}
          onClose={() => setPresentationAppId(null)}
        />
      )}

      {/* Footer */}
      <Footer apps={apps} onImportApps={handleImportApps} />
    </div>
  );
}
