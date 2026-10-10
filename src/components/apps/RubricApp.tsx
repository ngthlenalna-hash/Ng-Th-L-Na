import React, { useState } from 'react';
import { RubricCriterion } from '../../types';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { ClipboardCheck, CheckCircle, Copy, Check, RotateCcw, Award } from 'lucide-react';

interface RubricAppProps {
  criteria?: RubricCriterion[];
  isFullscreen?: boolean;
}

export const RubricApp: React.FC<RubricAppProps> = ({
  criteria = [],
  isFullscreen = false,
}) => {
  const [selectedLevels, setSelectedLevels] = useState<Record<number, number>>({
    0: 3, // default to Khá (level 3)
    1: 3,
    2: 2,
    3: 3,
  });

  const [studentOrTeamName, setStudentOrTeamName] = useState('Nhóm 1 - Dự án Năng Lượng Xanh');
  const [copied, setCopied] = useState(false);

  // Level scores: Level 1 = 3pts, Level 2 = 6pts, Level 3 = 8pts, Level 4 = 10pts
  const LEVEL_SCORES = [3, 6, 8, 10];
  const LEVEL_NAMES = ['Cần cố gắng', 'Đạt yêu cầu', 'Khá', 'Xuất sắc'];

  const handleSelectLevel = (critIdx: number, levelIdx: number) => {
    setSelectedLevels((prev) => ({
      ...prev,
      [critIdx]: levelIdx,
    }));
    sounds.playTick();
  };

  const totalScore = criteria.reduce((sum, _, idx) => {
    const lvl = selectedLevels[idx] !== undefined ? selectedLevels[idx] : 0;
    return sum + LEVEL_SCORES[lvl];
  }, 0);

  const maxScore = criteria.length * 10;
  const percentage = Math.round((totalScore / (maxScore || 1)) * 100);

  let evaluationTier = 'Đạt yêu cầu';
  if (percentage >= 85) evaluationTier = 'Xuất sắc';
  else if (percentage >= 70) evaluationTier = 'Khá';
  else if (percentage < 50) evaluationTier = 'Cần cố gắng thêm';

  const generatePedagogicalComment = () => {
    const strengths: string[] = [];
    const improvements: string[] = [];

    criteria.forEach((crit, idx) => {
      const lvl = selectedLevels[idx] || 0;
      if (lvl >= 2) {
        strengths.push(crit.criterion.split('.')[1] || crit.criterion);
      } else {
        improvements.push(crit.criterion.split('.')[1] || crit.criterion);
      }
    });

    let comment = `[ĐÁNH GIÁ NĂNG LỰC: ${studentOrTeamName}]\n- Tổng điểm: ${totalScore}/${maxScore} (${percentage}%) - Xếp loại: ${evaluationTier}.\n`;
    if (strengths.length > 0) {
      comment += `- Ưu điểm nổi bật: Thể hiện rất tốt ở ${strengths.join(', ')}.\n`;
    }
    if (improvements.length > 0) {
      comment += `- Hướng hoàn thiện: Cần tăng cường rèn luyện ${improvements.join(', ')}.\n`;
    } else {
      comment += `- Khuyến khích: Phát huy tinh thần sáng tạo và tiếp tục hoàn thiện sản phẩm ở các vòng thi đua tiếp theo!`;
    }
    return comment;
  };

  const handleCopyComment = () => {
    const text = generatePedagogicalComment();
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playCorrect();
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedLevels({ 0: 2, 1: 2, 2: 2, 3: 2 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Ma Trận Rubric Đánh Giá Năng Lực (Chuẩn 5512)</h3>
            <p className="text-xs text-slate-500">Chấm điểm minh bạch theo 4 mức độ · Tự động tính điểm và sinh nhận xét sư phạm</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-mono tabular-nums">{totalScore} / {maxScore} đ ({percentage}%)</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            title="Đặt lại mức điểm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Name input */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <label className="text-xs font-semibold text-slate-700 shrink-0">Đối tượng đánh giá:</label>
          <input
            type="text"
            value={studentOrTeamName}
            onChange={(e) => setStudentOrTeamName(e.target.value)}
            placeholder="Nhập tên học sinh hoặc nhóm báo cáo..."
            className="flex-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Matrix Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3 w-1/4">Tiêu chí đánh giá</th>
                <th className="p-3 w-[18%]">Mức 1: Cần cố gắng (3đ)</th>
                <th className="p-3 w-[18%]">Mức 2: Đạt (6đ)</th>
                <th className="p-3 w-[18%]">Mức 3: Khá (8đ)</th>
                <th className="p-3 w-[21%]">Mức 4: Xuất sắc (10đ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((crit, cIdx) => {
                const currentLevel = selectedLevels[cIdx] !== undefined ? selectedLevels[cIdx] : 1;

                return (
                  <tr key={cIdx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 align-top border-r border-slate-100">
                      {crit.criterion}
                    </td>

                    {[crit.level1, crit.level2, crit.level3, crit.level4].map((desc, lIdx) => {
                      const isSelected = currentLevel === lIdx;

                      return (
                        <td
                          key={lIdx}
                          onClick={() => handleSelectLevel(cIdx, lIdx)}
                          className={`p-3 cursor-pointer transition-all align-top border-r border-slate-100 last:border-r-0 ${
                            isSelected
                              ? 'bg-sky-50/80 text-sky-950 font-medium ring-1 ring-sky-400'
                              : 'text-slate-600 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-start gap-1.5">
                            <input
                              type="radio"
                              name={`crit-${cIdx}`}
                              checked={isSelected}
                              onChange={() => handleSelectLevel(cIdx, lIdx)}
                              className="mt-0.5 accent-sky-600 cursor-pointer"
                            />
                            <span className="leading-relaxed">{desc}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pedagogical Commentary Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Nhận xét sư phạm tự động (Chuẩn học bạ & Sổ tay đánh giá):
            </span>
            <button
              onClick={handleCopyComment}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép nhận xét'}</span>
            </button>
          </div>

          <pre className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed">
            {generatePedagogicalComment()}
          </pre>
        </div>
      </div>
    </div>
  );
};
