import React, { useState } from 'react';
import { ConnectedApp, AppType } from '../../types';
import { WheelApp } from '../apps/WheelApp';
import { QuizArenaApp } from '../apps/QuizArenaApp';
import { StationTimerApp } from '../apps/StationTimerApp';
import { FlashcardApp } from '../apps/FlashcardApp';
import { ExitTicketApp } from '../apps/ExitTicketApp';
import { RubricApp } from '../apps/RubricApp';
import { sounds } from '../../utils/audio';
import { X, Maximize2, Minimize2, Tv, RotateCw, Trophy, Boxes, BookOpen, MessageSquare, ClipboardCheck } from 'lucide-react';

interface ClassroomPresentationModalProps {
  apps: ConnectedApp[];
  initialAppId?: string;
  onClose: () => void;
}

export const ClassroomPresentationModal: React.FC<ClassroomPresentationModalProps> = ({
  apps,
  initialAppId,
  onClose,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(initialAppId || apps[0]?.id || '');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeApp = apps.find((a) => a.id === selectedAppId) || apps[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const getIcon = (type: AppType) => {
    switch (type) {
      case 'wheel': return <RotateCw className="w-4 h-4" />;
      case 'quiz': return <Trophy className="w-4 h-4" />;
      case 'station': return <Boxes className="w-4 h-4" />;
      case 'flashcard': return <BookOpen className="w-4 h-4" />;
      case 'exit_ticket': return <MessageSquare className="w-4 h-4" />;
      case 'rubric': return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden text-slate-100">
      {/* Smartboard Presentation Top Control Strip */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Chế Độ Máy Chiếu / Màn Hình Tương Tác Lớp Học
            </h3>
            <p className="text-[11px] text-slate-400">
              Đang trình chiếu: <span className="text-sky-300 font-semibold">{activeApp?.title}</span>
            </p>
          </div>
        </div>

        {/* Quick App Switcher for Teacher */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
          {apps.slice(0, 6).map((app) => {
            const isSelected = app.id === selectedAppId;
            return (
              <button
                key={app.id}
                onClick={() => {
                  setSelectedAppId(app.id);
                  sounds.playTick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {getIcon(app.type)}
                <span>{app.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900/90 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
          {activeApp.type === 'wheel' && (
            <WheelApp
              initialStudents={activeApp.students}
              isFullscreen={true}
            />
          )}

          {activeApp.type === 'quiz' && (
            <QuizArenaApp
              questions={activeApp.quizQuestions}
              isFullscreen={true}
            />
          )}

          {activeApp.type === 'station' && (
            <StationTimerApp
              stations={activeApp.stations}
              isFullscreen={true}
            />
          )}

          {activeApp.type === 'flashcard' && (
            <FlashcardApp
              cards={activeApp.flashcards}
              isFullscreen={true}
            />
          )}

          {activeApp.type === 'exit_ticket' && (
            <ExitTicketApp
              questions={activeApp.exitTicketQuestions}
              isFullscreen={true}
            />
          )}

          {activeApp.type === 'rubric' && (
            <RubricApp
              criteria={activeApp.rubricCriteria}
              isFullscreen={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
