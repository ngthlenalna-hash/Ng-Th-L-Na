import React from 'react';
import { Tv } from 'lucide-react';

interface HeaderProps {
  activeTab: 'apps' | 'studio' | 'pedagogy' | 'lesson_plan';
  onSelectTab: (tab: 'apps' | 'studio' | 'pedagogy' | 'lesson_plan') => void;
  onEnterPresentationMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onEnterPresentationMode,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('apps');
        }}
        className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-sky-700 transition-colors"
      >
        EduCraft Innovate
      </a>

      {/* Zone 2: 4 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectTab('apps')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'apps' ? 'text-sky-600 font-semibold' : ''
          }`}
        >
          Kho App Lớp Học
        </button>
        <button
          onClick={() => onSelectTab('studio')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'studio' ? 'text-sky-600 font-semibold' : ''
          }`}
        >
          Xưởng Tạo App
        </button>
        <button
          onClick={() => onSelectTab('pedagogy')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'pedagogy' ? 'text-sky-600 font-semibold' : ''
          }`}
        >
          Phương Pháp 5512
        </button>
        <button
          onClick={() => onSelectTab('lesson_plan')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'lesson_plan' ? 'text-sky-600 font-semibold' : ''
          }`}
        >
          Trợ Lý Soạn Bài AI
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onEnterPresentationMode}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Tv className="w-3.5 h-3.5 text-sky-400" />
          <span>Chế Độ Giảng Dạy</span>
        </button>
      </div>
    </header>
  );
};
