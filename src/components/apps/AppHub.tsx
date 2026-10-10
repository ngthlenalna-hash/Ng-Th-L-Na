import React, { useState } from 'react';
import { ConnectedApp, AppType } from '../../types';
import { WheelApp } from './WheelApp';
import { QuizArenaApp } from './QuizArenaApp';
import { StationTimerApp } from './StationTimerApp';
import { FlashcardApp } from './FlashcardApp';
import { ExitTicketApp } from './ExitTicketApp';
import { RubricApp } from './RubricApp';
import { sounds } from '../../utils/audio';
import { RotateCw, Trophy, Boxes, BookOpen, MessageSquare, ClipboardCheck, Share2, Play, Sparkles, Plus, Edit3, Trash2 } from 'lucide-react';

interface AppHubProps {
  apps: ConnectedApp[];
  onOpenAppStudio: (editingApp?: ConnectedApp) => void;
  onOpenShareModal: (app: ConnectedApp) => void;
  onDeleteApp: (id: string) => void;
  onLaunchPresentation: (appId: string) => void;
}

export const AppHub: React.FC<AppHubProps> = ({
  apps,
  onOpenAppStudio,
  onOpenShareModal,
  onDeleteApp,
  onLaunchPresentation,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [activePlayApp, setActivePlayApp] = useState<ConnectedApp | null>(apps[0] || null);

  const filteredApps = apps.filter((app) => {
    const matchType = selectedTypeFilter === 'all' || app.type === selectedTypeFilter;
    const matchSubject = selectedSubjectFilter === 'all' || app.subject === selectedSubjectFilter;
    return matchType && matchSubject;
  });

  const getIcon = (type: AppType) => {
    switch (type) {
      case 'wheel': return <RotateCw className="w-4 h-4 text-sky-600" />;
      case 'quiz': return <Trophy className="w-4 h-4 text-emerald-600" />;
      case 'station': return <Boxes className="w-4 h-4 text-indigo-600" />;
      case 'flashcard': return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'exit_ticket': return <MessageSquare className="w-4 h-4 text-teal-600" />;
      case 'rubric': return <ClipboardCheck className="w-4 h-4 text-purple-600" />;
    }
  };

  const getAppTypeName = (type: AppType) => {
    switch (type) {
      case 'wheel': return 'Vòng Quay Gọi Tên';
      case 'quiz': return 'Đấu Trường Quiz';
      case 'station': return 'Đồng Hồ Trạm';
      case 'flashcard': return 'Thẻ Ghi Nhớ 3D';
      case 'exit_ticket': return 'Thẻ Ra Khỏi Lớp';
      case 'rubric': return 'Ma Trận Rubric';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Hệ sinh thái EdTech & Đổi mới phương pháp dạy học
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
              Giáo Viên Đổi Mới & Xưởng Tạo App Giảng Dạy Liên Kết
            </h1>

            <p className="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed">
              Tạo lập và liên kết các ứng dụng tương tác đa phương thức cho tiết học: Vòng quay gọi tên ngẫu nhiên, Đấu trường Quiz, Bộ đếm trạm học tập luân chuyển và Rubric đánh giá năng lực theo chuẩn GDPT 2018.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAppStudio()}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Ứng Dụng Mới</span>
              </button>

              <button
                onClick={() => {
                  if (activePlayApp) onLaunchPresentation(activePlayApp.id);
                }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Chiếu Trực Tiếp Trên Lớp</span>
              </button>
            </div>
          </div>

          {/* Educational Visual Composition (High-fidelity clean SVG diagram with zero external image risk) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-sky-50/60 p-6 rounded-2xl border border-slate-200 shadow-inner flex flex-col justify-between min-h-[280px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Liên Kết Sư Phạm 4 Hoạt Động (CV 5512)</span>
              </div>
              <span className="text-[11px] text-slate-400">Tương tác số</span>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                  <RotateCw className="w-3.5 h-3.5 text-sky-600" /> 1. Khởi động
                </div>
                <div className="text-[11px] text-slate-500">Vòng quay gọi tên & Mini Quiz mở bài</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                  <Boxes className="w-3.5 h-3.5 text-indigo-600" /> 2. Hình thành
                </div>
                <div className="text-[11px] text-slate-500">Đồng hồ luân chuyển 4 trạm học tập</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Trophy className="w-3.5 h-3.5 text-emerald-600" /> 3. Luyện tập
                </div>
                <div className="text-[11px] text-slate-500">Đấu trường trắc nghiệm & Bảng điểm</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                  <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" /> 4. Vận dụng
                </div>
                <div className="text-[11px] text-slate-500">Thẻ Exit Ticket & Rubric năng lực</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-200/60">
              ✓ Hoạt động ngoại tuyến & Trình chiếu mượt mà trên mọi màn hình thông minh
            </div>
          </div>
        </div>
      </section>

      {/* Active Interactive Stage */}
      {activePlayApp && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ứng dụng đang phát trên màn hình:
              </span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                {activePlayApp.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenShareModal(activePlayApp)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Chia sẻ & Mã nhúng</span>
              </button>

              <button
                onClick={() => onLaunchPresentation(activePlayApp.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toàn màn hình</span>
              </button>
            </div>
          </div>

          <div>
            {activePlayApp.type === 'wheel' && (
              <WheelApp
                initialStudents={activePlayApp.students}
                onToggleFullscreen={() => onLaunchPresentation(activePlayApp.id)}
              />
            )}
            {activePlayApp.type === 'quiz' && (
              <QuizArenaApp questions={activePlayApp.quizQuestions} />
            )}
            {activePlayApp.type === 'station' && (
              <StationTimerApp stations={activePlayApp.stations} />
            )}
            {activePlayApp.type === 'flashcard' && (
              <FlashcardApp cards={activePlayApp.flashcards} />
            )}
            {activePlayApp.type === 'exit_ticket' && (
              <ExitTicketApp questions={activePlayApp.exitTicketQuestions} />
            )}
            {activePlayApp.type === 'rubric' && (
              <RubricApp criteria={activePlayApp.rubricCriteria} />
            )}
          </div>
        </section>
      )}

      {/* Filter Bar & App Catalog */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Kho Ứng Dụng Giảng Dạy Liên Kết ({filteredApps.length})
            </h2>
            <p className="text-xs text-slate-500">
              Lựa chọn ứng dụng sẵn sàng hoặc mở rộng kịch bản theo nội dung bài học
            </p>
          </div>

          {/* Interactive Filter Tabs (Buttons allowed per Frontend Design Constitution Section 1.A) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setSelectedTypeFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả loại app
              </button>
              <button
                onClick={() => setSelectedTypeFilter('wheel')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'wheel'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vòng quay
              </button>
              <button
                onClick={() => setSelectedTypeFilter('quiz')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'quiz'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setSelectedTypeFilter('station')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'station'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trạm
              </button>
              <button
                onClick={() => setSelectedTypeFilter('flashcard')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'flashcard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flashcard
              </button>
              <button
                onClick={() => setSelectedTypeFilter('exit_ticket')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'exit_ticket'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Exit Ticket
              </button>
              <button
                onClick={() => setSelectedTypeFilter('rubric')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedTypeFilter === 'rubric'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rubric
              </button>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map((app) => {
            const isPlaying = activePlayApp?.id === app.id;

            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                  isPlaying ? 'border-sky-500 ring-2 ring-sky-300' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata (strictly compliant with zero-pill rule) */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-sky-700">{getAppTypeName(app.type)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{app.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>{app.gradeLevel}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {app.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Phương pháp: </span>
                    {app.pedagogyMethod}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setActivePlayApp(app);
                        sounds.playTick();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        isPlaying
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isPlaying ? 'Đang mở' : 'Khởi chạy'}</span>
                    </button>

                    <button
                      onClick={() => onOpenShareModal(app)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Lấy mã QR & Liên kết chia sẻ"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenAppStudio(app)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Chỉnh sửa kịch bản app"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {app.isCustom && (
                      <button
                        onClick={() => onDeleteApp(app.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Xóa ứng dụng tự tạo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
