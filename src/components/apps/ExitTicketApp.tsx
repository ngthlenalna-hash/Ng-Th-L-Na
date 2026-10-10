import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { MessageSquare, Send, CheckCircle2, Star, ThumbsUp, HelpCircle, BarChart3 } from 'lucide-react';

interface ExitTicketAppProps {
  questions?: string[];
  isFullscreen?: boolean;
}

interface SubmittedResponse {
  id: string;
  studentName: string;
  understandingRating: number;
  highlightAnswer: string;
  questionAnswer: string;
  timestamp: string;
}

export const ExitTicketApp: React.FC<ExitTicketAppProps> = ({
  questions = [
    'Điều tâm đắc nhất em học được hôm nay là gì?',
    'Một câu hỏi hoặc băn khoăn em muốn thầy/cô giải đáp thêm?',
    'Hành động cụ thể em sẽ áp dụng bài học này trong thực tế?',
  ],
  isFullscreen = false,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'dashboard'>('submit');
  const [rating, setRating] = useState<number>(4);
  const [studentName, setStudentName] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initial simulated live responses from students in class
  const [responses, setResponses] = useState<SubmittedResponse[]>([
    {
      id: '1',
      studentName: 'Trần Bảo Châu (Tổ 1)',
      understandingRating: 5,
      highlightAnswer: 'Hiểu rõ chu trình năng lượng gió và cách tính công suất lý thuyết.',
      questionAnswer: 'Liệu Việt Nam có thể thay thế hoàn toàn điện than bằng năng lượng sạch không ạ?',
      timestamp: '2 phút trước',
    },
    {
      id: '2',
      studentName: 'Phạm Đức Huy (Tổ 2)',
      understandingRating: 4,
      highlightAnswer: 'Thích nhất phần trải nghiệm tại Trạm 2 khi được đo điện áp tấm pin mini.',
      questionAnswer: 'Em muốn biết thêm về cách bảo dưỡng tấm pin khi trời mưa bão.',
      timestamp: '5 phút trước',
    },
    {
      id: '3',
      studentName: 'Vũ Khánh Linh (Tổ 2)',
      understandingRating: 5,
      highlightAnswer: 'Nhận ra tầm quan trọng của việc tắt các thiết bị điện khi ra khỏi phòng học.',
      questionAnswer: 'Thưa cô, pin lưu trữ năng lượng mặt trời làm bằng chất liệu gì an toàn nhất?',
      timestamp: '7 phút trước',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer1.trim()) return;

    const newResponse: SubmittedResponse = {
      id: Date.now().toString(),
      studentName: studentName.trim() || 'Học sinh ẩn danh',
      understandingRating: rating,
      highlightAnswer: answer1.trim(),
      questionAnswer: answer2.trim() || 'Không có thắc mắc thêm.',
      timestamp: 'Vừa xong',
    };

    setResponses([newResponse, ...responses]);
    setIsSubmitted(true);
    sounds.playCorrect();
    triggerConfetti();
  };

  const handleResetForm = () => {
    setStudentName('');
    setAnswer1('');
    setAnswer2('');
    setRating(4);
    setIsSubmitted(false);
  };

  const averageRating = (
    responses.reduce((sum, r) => sum + r.understandingRating, 0) / (responses.length || 1)
  ).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Thẻ Ra Khỏi Lớp (Exit Ticket)</h3>
            <p className="text-xs text-slate-500">Đo lường mức độ tiếp thu bài học & thu nhận phản hồi 60 giây</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'submit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gửi phản hồi
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
            <span>Màn hình Giáo viên ({responses.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        <div className="p-6 max-w-xl mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên hoặc Nhóm (Có thể để trống để gửi ẩn danh):
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An - Tổ 3"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              {/* Rating Scale */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mức độ làm chủ và hiểu bài hôm nay:
                </label>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg transition-transform active:scale-95 ${
                        rating >= star ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">
                    {rating === 5 ? 'Rất tự tin (5/5)' : rating === 4 ? 'Hiểu tốt (4/5)' : rating === 3 ? 'Khá ổn (3/5)' : 'Còn băn khoăn'}
                  </span>
                </div>
              </div>

              {/* Question 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. {questions[0] || 'Điều tâm đắc nhất em học được hôm nay là gì?'} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  placeholder="Viết 1-2 câu tóm tắt điều em ấn tượng nhất..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. {questions[1] || 'Một câu hỏi em muốn gửi tới thầy/cô?'}
                </label>
                <textarea
                  rows={2}
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  placeholder="Câu hỏi hoặc nội dung em cần hỗ trợ thêm..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Nộp Thẻ Ra Khỏi Lớp
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Đã gửi phản hồi thành công!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Cảm ơn em đã chia sẻ suy nghĩ. Ý kiến của em giúp thầy cô điều chỉnh bài giảng tiết sau tốt hơn.
              </p>
              <button
                onClick={handleResetForm}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Gửi thêm thẻ khác
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Teacher Dashboard View */
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Số lượt nộp thẻ</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {responses.length} học sinh
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-xs text-amber-800 font-medium">Độ tự tin hiểu bài trung bình</div>
              <div className="text-2xl font-bold text-amber-900 mt-1 font-mono tabular-nums flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{averageRating} / 5.0</span>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
              <div className="text-xs text-sky-800 font-medium">Đánh giá chung lớp học</div>
              <div className="text-sm font-bold text-sky-900 mt-1">
                Lớp nắm vững 85% kiến thức trọng tâm
              </div>
            </div>
          </div>

          {/* List of Student Submissions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Phản hồi trực tiếp từ học sinh
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {responses.map((resp) => (
                <div
                  key={resp.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="font-bold text-slate-900 truncate">{resp.studentName}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-mono font-bold text-slate-700">{resp.understandingRating}★</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-emerald-800">Tâm đắc:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{resp.highlightAnswer}</p>
                  </div>

                  {resp.questionAnswer && (
                    <div>
                      <span className="font-semibold text-sky-800">Thắc mắc gửi GV:</span>
                      <p className="text-slate-600 mt-0.5 italic leading-relaxed">"{resp.questionAnswer}"</p>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right">{resp.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
