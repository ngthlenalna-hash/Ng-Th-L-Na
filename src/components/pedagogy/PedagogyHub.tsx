import React, { useState } from 'react';
import { PedagogyMethodInfo, AppType } from '../../types';
import { PEDAGOGY_METHODS } from '../../data/defaultData';
import { sounds } from '../../utils/audio';
import { Boxes, RotateCcw, Lightbulb, Trophy, Cpu, Layers, ArrowRight, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

interface PedagogyHubProps {
  onSelectAppType: (type: AppType) => void;
  onOpenLessonPlannerWithMethod: (methodName: string) => void;
}

export const PedagogyHub: React.FC<PedagogyHubProps> = ({
  onSelectAppType,
  onOpenLessonPlannerWithMethod,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PedagogyMethodInfo>(PEDAGOGY_METHODS[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'RotateCcw': return <RotateCcw className="w-5 h-5" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const getAppLabel = (type: AppType) => {
    switch (type) {
      case 'quiz': return 'Đấu Trường Quiz';
      case 'wheel': return 'Vòng Quay Gọi Tên';
      case 'station': return 'Đồng Hồ Trạm';
      case 'flashcard': return 'Thẻ Flashcard 3D';
      case 'exit_ticket': return 'Thẻ Ra Khỏi Lớp';
      case 'rubric': return 'Ma Trận Rubric';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Cẩm Nang Phương Pháp Sư Phạm Đổi Mới & Chuyển Đổi Số
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Tổng hợp các mô hình giáo dục hiện đại theo định hướng phát triển phẩm chất và năng lực học sinh (GDPT 2018).
          Mỗi phương pháp được tích hợp sẵn các ứng dụng công nghệ bổ trợ giúp giáo viên triển khai mượt mà ngay trên lớp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Method Nav List (Left) */}
        <div className="lg:col-span-4 space-y-2">
          {PEDAGOGY_METHODS.map((method) => {
            const isSelected = selectedMethod.id === method.id;
            return (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method);
                  sounds.playTick();
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-1 ring-sky-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {getIcon(method.iconName)}
                  </div>
                  <div className="flex-1 truncate">
                    <h3 className={`text-xs font-bold ${isSelected ? 'text-sky-950' : 'text-slate-900'}`}>
                      {method.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {method.shortDesc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Method Deep Dive (Right) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Mô hình giảng dạy hiện đại
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {selectedMethod.name}
              </h3>
            </div>

            <button
              onClick={() => onOpenLessonPlannerWithMethod(selectedMethod.name)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Soạn Giáo Án Với Phương Pháp Này</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Bản chất sư phạm
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedMethod.fullDesc}
            </p>
          </div>

          {/* Key Implementation Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              5 Bước triển khai thực tế trên lớp học
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {selectedMethod.keySteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Giá trị phát triển năng lực học sinh
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedMethod.benefits.map((b, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real Classroom Example Topic */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              Ví dụ bài học thực tế gợi ý:
            </span>
            <p className="text-xs text-amber-950 font-medium">
              {selectedMethod.exampleTopic}
            </p>
          </div>

          {/* Recommended Connected Apps */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Các App liên kết được đề xuất sử dụng:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedMethod.recommendedApps.map((appType) => (
                <button
                  key={appType}
                  onClick={() => onSelectAppType(appType)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span>Mở {getAppLabel(appType)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
