import React, { useState } from 'react';
import { ConnectedApp, AppType } from '../../types';
import { WheelApp } from '../apps/WheelApp';
import { QuizArenaApp } from '../apps/QuizArenaApp';
import { StationTimerApp } from '../apps/StationTimerApp';
import { FlashcardApp } from '../apps/FlashcardApp';
import { ExitTicketApp } from '../apps/ExitTicketApp';
import { RubricApp } from '../apps/RubricApp';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { Sparkles, Save, Eye, Layers, BookOpen, Clock, HelpCircle, Check, Loader2, ArrowLeft } from 'lucide-react';

interface AppStudioProps {
  onSaveApp: (app: ConnectedApp) => void;
  onCancel?: () => void;
  editingApp?: ConnectedApp | null;
}

const SUBJECT_OPTIONS = [
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
  'Hoạt động Trải nghiệm / Hướng nghiệp',
];

const GRADE_OPTIONS = ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'];

const APP_TYPE_OPTIONS: Array<{ type: AppType; label: string; desc: string }> = [
  { type: 'quiz', label: 'Đấu Trường Quiz', desc: 'Trắc nghiệm tương tác đếm ngược, tính điểm thi đua và bảng xếp hạng' },
  { type: 'wheel', label: 'Vòng Quay Gọi Tên', desc: 'Chọn học sinh hoặc chia nhóm ngẫu nhiên minh bạch không áp lực' },
  { type: 'station', label: 'Đồng Hồ Trạm', desc: 'Quản lý thời gian di chuyển các trạm học tập có chuông báo' },
  { type: 'flashcard', label: 'Thẻ Ghi Nhớ 3D', desc: 'Lật thẻ thuật ngữ, rèn phản xạ và ghi nhớ sâu bằng Spaced Repetition' },
  { type: 'exit_ticket', label: 'Thẻ Ra Khỏi Lớp', desc: 'Khảo sát 60 giây đo mức độ hiểu bài và thu nhận băn khoăn' },
  { type: 'rubric', label: 'Ma Trận Rubric', desc: 'Bảng đánh giá năng lực 4 mức độ tự động tính điểm và sinh nhận xét' },
];

export const AppStudio: React.FC<AppStudioProps> = ({ onSaveApp, onCancel, editingApp }) => {
  const [appType, setAppType] = useState<AppType>(editingApp?.type || 'quiz');
  const [title, setTitle] = useState(editingApp?.title || '');
  const [subject, setSubject] = useState(editingApp?.subject || 'Khoa học Tự nhiên');
  const [gradeLevel, setGradeLevel] = useState(editingApp?.gradeLevel || 'Lớp 8');
  const [topic, setTopic] = useState('');
  const [extraPrompt, setExtraPrompt] = useState('');
  const [pedagogyMethod, setPedagogyMethod] = useState(
    editingApp?.pedagogyMethod || 'Dạy học tích cực & Đánh giá quá trình (Formative Assessment)'
  );

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<ConnectedApp>>(editingApp || {});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate app script using server-side Gemini endpoint
  const handleGenerateWithAI = async () => {
    setIsLoadingAi(true);
    sounds.playTick();

    try {
      const response = await fetch('/api/gemini/generate-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          gradeLevel,
          topic: topic.trim() || 'Bài học trọng tâm theo SGK',
          appType,
          extraRequirements: extraPrompt.trim(),
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        const generated = result.data;
        setTitle(generated.title || `${topic || subject} - Ứng Dụng Tương Tác`);
        setPedagogyMethod(generated.pedagogyMethod || pedagogyMethod);

        setPreviewData({
          title: generated.title,
          description: generated.description,
          subject,
          gradeLevel,
          type: appType,
          pedagogyMethod: generated.pedagogyMethod,
          quizQuestions: generated.quizData,
          flashcards: generated.flashcards,
          stations: generated.stations,
          rubricCriteria: generated.rubricCriteria,
          exitTicketQuestions: generated.exitTicketQuestions,
          teacherGuide: generated.teacherGuide,
        });

        sounds.playCorrect();
        triggerConfetti();
      }
    } catch (err) {
      console.error('Failed to generate with AI:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSave = () => {
    const finalApp: ConnectedApp = {
      id: editingApp?.id || `custom-app-${Date.now()}`,
      title: title.trim() || `${subject} - Ứng Dụng ${appType.toUpperCase()}`,
      description:
        previewData.description ||
        `Ứng dụng dạy học tương tác kết hợp phương pháp ${pedagogyMethod} cho ${gradeLevel}.`,
      subject,
      gradeLevel,
      type: appType,
      pedagogyMethod,
      tags: [subject, gradeLevel, appType],
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
      quizQuestions: previewData.quizQuestions || (appType === 'quiz' ? editingApp?.quizQuestions : undefined),
      flashcards: previewData.flashcards || (appType === 'flashcard' ? editingApp?.flashcards : undefined),
      stations: previewData.stations || (appType === 'station' ? editingApp?.stations : undefined),
      rubricCriteria: previewData.rubricCriteria || (appType === 'rubric' ? editingApp?.rubricCriteria : undefined),
      exitTicketQuestions: previewData.exitTicketQuestions || (appType === 'exit_ticket' ? editingApp?.exitTicketQuestions : undefined),
      students: previewData.students || (appType === 'wheel' ? editingApp?.students : undefined),
      teacherGuide: previewData.teacherGuide,
    };

    onSaveApp(finalApp);
    setSaveSuccess(true);
    sounds.playCorrect();
    triggerConfetti();
    setTimeout(() => {
      setSaveSuccess(false);
      if (onCancel) onCancel();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Xưởng Tạo Ứng Dụng Dạy Học Số (EdTech App Studio)
            </h2>
            <p className="text-xs text-slate-500">
              Thiết kế ứng dụng giảng dạy liên kết cho từng tiết học hoặc dùng trợ lý AI Gemini sinh kịch bản trong 3 giây
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Đã lưu thành công!' : 'Lưu Ứng Dụng'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters & AI Generator */}
        <div className="lg:col-span-5 space-y-5">
          {/* App Type Selector */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Chọn Loại Ứng Dụng Giảng Dạy:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {APP_TYPE_OPTIONS.map((item) => {
                const isSelected = appType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setAppType(item.type);
                      sounds.playTick();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 text-sky-950 ring-1 ring-sky-400'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curriculum Parameters */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Thông Tin Khối Lớp & Môn Học:
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Môn học</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {SUBJECT_OPTIONS.map((s) => (
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
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Chủ đề / Tên bài học muốn tạo:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Vòng tuần hoàn nước, Kháng chiến chống Pháp, Định luật Ôm..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Yêu cầu sư phạm bổ sung (Tùy chọn):
              </label>
              <textarea
                rows={2}
                value={extraPrompt}
                onChange={(e) => setExtraPrompt(e.target.value)}
                placeholder="Ví dụ: Câu hỏi gắn liền đời sống thực tế, kích thích tư duy phản biện..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            {/* AI Generate Button */}
            <button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isLoadingAi}
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                isLoadingAi
                  ? 'bg-sky-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] shadow-sky-200'
              }`}
            >
              {isLoadingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI đang thiết kế kịch bản...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tự Động Sinh Kịch Bản App Bằng Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Title and Method */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Tinh Chỉnh Tiêu Đề & Phương Pháp:
            </label>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tiêu đề ứng dụng</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề ứng dụng..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phương pháp sư phạm</label>
              <input
                type="text"
                value={pedagogyMethod}
                onChange={(e) => setPedagogyMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Stage: Live Interactive Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-sky-600" /> Xem thử tương tác trực tiếp (Live Preview)
            </span>
            <span className="text-[11px] text-slate-400">Ứng dụng hoạt động ngay tại đây</span>
          </div>

          <div className="bg-slate-100/50 p-2 rounded-2xl border border-slate-200">
            {appType === 'wheel' && (
              <WheelApp
                initialStudents={previewData.students || editingApp?.students}
                onStudentsChange={(st) => setPreviewData((prev) => ({ ...prev, students: st }))}
              />
            )}

            {appType === 'quiz' && (
              <QuizArenaApp
                questions={
                  previewData.quizQuestions && previewData.quizQuestions.length > 0
                    ? previewData.quizQuestions
                    : [
                        {
                          id: 1,
                          question: 'Sinh vật nào đóng vai trò là sinh vật sản xuất trong chuỗi thức ăn?',
                          options: ['Thực vật quang hợp', 'Sâu ăn lá', 'Nấm hoại sinh', 'Chim sẻ'],
                          correctIndex: 0,
                          explanation: 'Thực vật sử dụng ánh sáng mặt trời để tạo ra chất hữu cơ nuôi sống chuỗi thức ăn.',
                        },
                        {
                          id: 2,
                          question: 'Mô hình Lớp học đảo ngược giúp học sinh chủ động điều gì nhất?',
                          options: [
                            'Chép bài nhanh trên lớp',
                            'Tự học lý thuyết trước ở nhà và tập trung thảo luận sâu trên lớp',
                            'Nghỉ học không cần làm bài',
                            'Chỉ làm bài kiểm tra trắc nghiệm',
                          ],
                          correctIndex: 1,
                          explanation: 'Lớp học đảo ngược dành thời gian vàng trên lớp cho hoạt động tương tác và giải quyết vấn đề.',
                        },
                      ]
                }
              />
            )}

            {appType === 'station' && (
              <StationTimerApp
                stations={
                  previewData.stations && previewData.stations.length > 0
                    ? previewData.stations
                    : [
                        { id: 1, name: 'Trạm 1: Khám phá', durationMinutes: 7, task: 'Đọc tài liệu và ghi lại 3 ý chính', product: 'Phiếu KWL' },
                        { id: 2, name: 'Trạm 2: Thực hành', durationMinutes: 7, task: 'Thực hiện thí nghiệm mô phỏng', product: 'Bảng số liệu' },
                        { id: 3, name: 'Trạm 3: Phản biện', durationMinutes: 7, task: 'Giải quyết câu hỏi thách thức', product: 'Luận điểm tranh biện' },
                        { id: 4, name: 'Trạm 4: Đúc kết', durationMinutes: 7, task: 'Vẽ sơ đồ tư duy tổng hợp', product: 'Infographic mini' },
                      ]
                }
              />
            )}

            {appType === 'flashcard' && (
              <FlashcardApp
                cards={
                  previewData.flashcards && previewData.flashcards.length > 0
                    ? previewData.flashcards
                    : [
                        { id: 1, front: 'Quang hợp', back: 'Cơ chế cây xanh dùng năng lượng mặt trời tổng hợp chất hữu cơ', hint: '6CO2 + 6H2O' },
                        { id: 2, front: 'Lớp học đảo ngược', back: 'Chuyển bài giảng về nhà, bài tập thực hành lên lớp', hint: 'Flipped Classroom' },
                      ]
                }
              />
            )}

            {appType === 'exit_ticket' && (
              <ExitTicketApp
                questions={previewData.exitTicketQuestions}
              />
            )}

            {appType === 'rubric' && (
              <RubricApp
                criteria={
                  previewData.rubricCriteria && previewData.rubricCriteria.length > 0
                    ? previewData.rubricCriteria
                    : [
                        {
                          criterion: '1. Nội dung khoa học',
                          level1: 'Chưa đầy đủ (3đ)',
                          level2: 'Đạt yêu cầu (6đ)',
                          level3: 'Phân tích sâu (8đ)',
                          level4: 'Xuất sắc, sáng tạo (10đ)',
                        },
                        {
                          criterion: '2. Kỹ năng thuyết trình',
                          level1: 'Đọc giấy (3đ)',
                          level2: 'Nói rõ ràng (6đ)',
                          level3: 'Lưu loát, tự tin (8đ)',
                          level4: 'Lôi cuốn, truyền cảm hứng (10đ)',
                        },
                      ]
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
