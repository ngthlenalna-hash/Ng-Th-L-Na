import React, { useState } from 'react';
import { LessonPlan, AppType } from '../../types';
import { DEFAULT_LESSON_PLAN } from '../../data/defaultData';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { Sparkles, FileText, Printer, Copy, Check, Loader2, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface LessonPlanAssistantProps {
  initialMethod?: string;
  onLaunchApp?: (type: AppType) => void;
}

const SUBJECT_LIST = [
  'Khoa học Tự nhiên',
  'Toán học',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Ngữ văn',
  'Lịch sử & Địa lý',
  'Tiếng Anh',
  'Tin học & Công nghệ',
  'Giáo dục Công dân',
  'Hoạt động Trải nghiệm',
];

const GRADE_LIST = ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'];

const PEDAGOGY_OPTIONS = [
  'Dạy học theo Trạm kết hợp Ứng dụng số',
  'Lớp học Đảo ngược (Flipped Classroom)',
  'Dạy học theo Dự án (Project-Based Learning - PBL)',
  'Trò chơi hóa Lớp học (Gamification)',
  'Giáo dục STEM / STEAM Liên môn',
  'Kỹ thuật Phòng tranh & Mảnh ghép (Jigsaw & Gallery Walk)',
];

export const LessonPlanAssistant: React.FC<LessonPlanAssistantProps> = ({
  initialMethod = 'Dạy học theo Trạm kết hợp Ứng dụng số',
  onLaunchApp,
}) => {
  const [subject, setSubject] = useState('Khoa học Tự nhiên');
  const [gradeLevel, setGradeLevel] = useState('Lớp 8');
  const [lessonTitle, setLessonTitle] = useState('Bài 15: Năng Lượng Tái Tạo & Phát Triển Bền Vững');
  const [pedagogyMethod, setPedagogyMethod] = useState(initialMethod);
  const [targetOutcomes, setTargetOutcomes] = useState('Phát triển năng lực giải quyết vấn đề thực tế, tư duy xanh và làm việc nhóm');

  const [isLoading, setIsLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>(DEFAULT_LESSON_PLAN);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    sounds.playTick();

    try {
      const response = await fetch('/api/gemini/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          gradeLevel,
          lessonTitle,
          pedagogyMethod,
          targetOutcomes,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setLessonPlan(res.data);
        sounds.playCorrect();
        triggerConfetti();
      }
    } catch (err) {
      console.error('Failed to generate lesson plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMarkdown = () => {
    const text = `# KẾ HOẠCH BÀI DẠY ĐỔI MỚI (CHUẨN CÔNG VĂN 5512/BGDĐT)
**Tên bài dạy:** ${lessonPlan.lessonTitle}
**Môn học:** ${lessonPlan.subject} - **Khối lớp:** ${lessonPlan.gradeLevel}
**Thời lượng:** ${lessonPlan.timeAllocation}
**Phương pháp đổi mới:** ${lessonPlan.pedagogyMethod}

---
## I. MỤC TIÊU BÀI DẠY
### 1. Năng lực
${lessonPlan.objectives.competencies.map((c) => `- ${c}`).join('\n')}

### 2. Phẩm chất
${lessonPlan.objectives.qualities.map((q) => `- ${q}`).join('\n')}

---
## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ
${lessonPlan.digitalTools.map((t) => `- **${t.name}**: ${t.role}`).join('\n')}

---
## III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN 5512)
${lessonPlan.activities
  .map(
    (act) => `### ${act.phase}
- **Mục tiêu:** ${act.goal}
- **Nội dung:** ${act.content}
- **Sản phẩm:** ${act.product}
- **Tổ chức thực hiện:** ${act.implementation}
`
  )
  .join('\n\n')}

---
## IV. PHÂN HÓA ĐỐI TƯỢNG VÀ ĐÁNH GIÁ
- **Phân hóa:** ${lessonPlan.differentiation || 'Giao nhiệm vụ mở rộng theo năng lực'}
- **Đánh giá Rubric:** ${lessonPlan.assessmentRubricSummary || 'Đánh giá quá trình liên tục'}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playCorrect();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Assistant Intro */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Trợ Lý Soạn Kế Hoạch Bài Dạy 5512 Bằng AI Gemini
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Tự động thiết kế kế hoạch bài dạy chuẩn cấu trúc Công văn 5512/BGDĐT của Bộ Giáo dục & Đào tạo, tích hợp phương pháp dạy học tích cực và hệ thống ứng dụng tương tác số cho 4 hoạt động học.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (Left) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Thông tin bài học cần soạn
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Môn học</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {SUBJECT_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Khối lớp</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {GRADE_LIST.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tên bài học / Tiết dạy:
              </label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Ví dụ: Bài 12: Thủy quyển và nước trên Trái Đất..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Phương pháp đổi mới áp dụng:
              </label>
              <select
                value={pedagogyMethod}
                onChange={(e) => setPedagogyMethod(e.target.value)}
                className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {PEDAGOGY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Mục tiêu năng lực trọng tâm cần hướng tới:
              </label>
              <textarea
                rows={2}
                value={targetOutcomes}
                onChange={(e) => setTargetOutcomes(e.target.value)}
                placeholder="Ví dụ: Năng lực mô hình hóa toán học, kỹ năng làm việc nhóm..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-sky-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] shadow-sky-200'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI đang soạn giáo án 5512...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Soạn Kế Hoạch Bài Dạy Chuẩn 5512</span>
                </>
              )}
            </button>
          </form>

          {/* Guidelines Callout */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Cấu trúc 4 hoạt động Công văn 5512:</div>
            <div>· Hoạt động 1: Khởi động / Mở đầu (Khơi gợi tình huống)</div>
            <div>· Hoạt động 2: Hình thành kiến thức mới (Tự chủ nghiên cứu)</div>
            <div>· Hoạt động 3: Luyện tập (Củng cố bằng App Quiz/Game số)</div>
            <div>· Hoạt động 4: Vận dụng (Giải quyết bài toán thực tế)</div>
          </div>
        </div>

        {/* Lesson Plan Output Document (Right) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Document Top Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Kế hoạch bài dạy chuẩn 5512
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {lessonPlan.lessonTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {lessonPlan.subject} · {lessonPlan.gradeLevel} · {lessonPlan.timeAllocation}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                title="Sao chép toàn bộ nội dung giáo án"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                title="In hoặc lưu dạng PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In / Xuất PDF</span>
              </button>
            </div>
          </div>

          {/* Section 1: Objectives */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              I. Mục tiêu bài dạy (Phẩm chất & Năng lực)
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="font-bold text-sky-900">1. Năng lực phát triển:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700">
                  {lessonPlan.objectives.competencies.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-emerald-900">2. Phẩm chất chủ yếu:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700">
                  {lessonPlan.objectives.qualities.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Digital Tools & Connected Apps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              II. Thiết bị dạy học & Học liệu số liên kết
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {lessonPlan.digitalTools.map((tool, idx) => (
                <div key={idx} className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sky-950">{tool.name}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{tool.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 4 Phases of Activities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              III. Tiến trình dạy học (4 Hoạt động chuẩn 5512)
            </h4>

            <div className="space-y-3">
              {lessonPlan.activities.map((act, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-xs">
                  <div className="font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                    {act.phase}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">a) Mục tiêu:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{act.goal}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">b) Nội dung:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{act.content}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">c) Sản phẩm học tập:</span>
                    <p className="text-emerald-800 font-medium mt-0.5 leading-relaxed">{act.product}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">d) Tổ chức thực hiện:</span>
                    <p className="text-slate-600 mt-0.5 p-2 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed font-mono text-[11px]">
                      {act.implementation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Differentiation and Rubric */}
          {lessonPlan.differentiation && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-amber-900">Biện pháp phân hóa đối tượng học sinh:</span>
              <p className="text-amber-950">{lessonPlan.differentiation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
