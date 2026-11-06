import React from 'react';
import { ConnectedApp } from '../../types';
import { WheelApp } from '../apps/WheelApp';
import { PedagogyHub } from '../pedagogy/PedagogyHub';
import { LessonPlanAssistant } from '../pedagogy/LessonPlanAssistant';
import { Play, Plus, Sparkles, BookOpen, Layers, Cpu, ArrowRight, CheckCircle2, Tv, Trophy, RotateCw, Boxes } from 'lucide-react';

interface HomeViewProps {
  apps: ConnectedApp[];
  onNavigateTab: (tab: 'home' | 'apps' | 'studio' | 'pedagogy' | 'lesson_plan') => void;
  onLaunchPresentation: (appId: string) => void;
  onOpenAppStudio: (editingApp?: ConnectedApp) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  apps,
  onNavigateTab,
  onLaunchPresentation,
  onOpenAppStudio,
}) => {
  const defaultWheelApp = apps.find((a) => a.type === 'wheel') || apps[0];

  return (
    <div className="space-y-12">
      {/* Hero Welcome Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Nền tảng Giáo Viên Đổi Mới Sáng Tạo Việt Nam
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight text-balance">
              Hệ Sinh Thái Ứng Dụng Giảng Dạy & Dạy Học Tương Tác Số
            </h1>

            <p className="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed">
              Giải pháp toàn diện giúp giáo viên đổi mới phương pháp giảng dạy: Tích hợp ứng dụng tương tác trực quan vào 4 hoạt động học, thiết kế mini-app bằng trợ lý AI Gemini, và chuyển đổi số theo chuẩn Công văn 5512/BGDĐT.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('apps')}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Khám Phá App Lớp Học</span>
              </button>

              <button
                onClick={() => onOpenAppStudio()}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo App Mới</span>
              </button>

              <button
                onClick={() => onLaunchPresentation(apps[0]?.id || '')}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Tv className="w-4 h-4 text-sky-600" />
                <span>Chế Độ Giảng Dạy</span>
              </button>
            </div>
          </div>

          {/* Infographic Overview Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-sky-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hệ Thống 4 Hoạt Động GDPT 2018</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">CV 5512</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-slate-800">1. Khởi động (Mở đầu)</span>
                </div>
                <span className="text-[11px] text-slate-500">Vòng quay gọi tên & Mini Quiz</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800">2. Hình thành kiến thức</span>
                </div>
                <span className="text-[11px] text-slate-500">Bộ đếm thời gian 4 trạm học tập</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">3. Luyện tập (Củng cố)</span>
                </div>
                <span className="text-[11px] text-slate-500">Đấu trường trắc nghiệm số</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-slate-800">4. Vận dụng & Đánh giá</span>
                </div>
                <span className="text-[11px] text-slate-500">Thẻ Exit Ticket & Rubric năng lực</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 text-center border-t border-slate-200/60">
              Tối ưu cho TV, máy chiếu, bảng tương tác thông minh (Smartboard)
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            3 Trụ Cột Đổi Mới Sáng Tạo Cho Thầy Cô
          </h2>
          <p className="text-xs text-slate-500">
            Mọi công cụ đều được liên kết chặt chẽ để áp dụng ngay vào từng tiết dạy thực tế
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div
            onClick={() => onNavigateTab('apps')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Kho App Lớp Học Tương Tác
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                6 ứng dụng chuyên biệt: Vòng quay gọi tên, Đấu trường trắc nghiệm, Bộ đếm thời gian trạm, Thẻ ghi nhớ 3D, Thẻ ra khỏi lớp và Rubric đánh giá.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-sky-600">
              <span>Mở Kho App Lớp Học</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onOpenAppStudio()}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Xưởng Tạo App Bằng AI Gemini
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhập tên bài học và môn học, trợ lý Gemini AI tự động thiết kế trọn bộ kịch bản app tương tác trong 3 giây. Hỗ trợ xuất mã QR và mã nhúng iFrame.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-purple-600">
              <span>Bắt Đầu Tạo App Mới</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onNavigateTab('pedagogy')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Phương Pháp 5512 & Soạn Bài AI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cẩm nang 6 mô hình dạy học hiện đại (Lớp học đảo ngược, Trạm học tập, PBL, Gamification, STEM, Mảnh ghép) và trợ lý soạn giáo án chuẩn 5512.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span>Khám Phá Phương Pháp & Soạn Bài</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Playground On Home Page */}
      {defaultWheelApp && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Trải Nghiệm Trực Tiếp: {defaultWheelApp.title}
              </h2>
              <p className="text-xs text-slate-500">
                Thầy cô có thể thử nghiệm tính năng ngay trên trang chủ hoặc mở toàn màn hình máy chiếu
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('apps')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Xem tất cả {apps.length} ứng dụng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <WheelApp
            initialStudents={defaultWheelApp.students}
            onToggleFullscreen={() => onLaunchPresentation(defaultWheelApp.id)}
          />
        </section>
      )}
    </div>
  );
};
