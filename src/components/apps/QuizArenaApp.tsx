import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../../types';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { Trophy, Clock, CheckCircle2, XCircle, RotateCcw, ArrowRight, Volume2, VolumeX, Flame, Award, HelpCircle } from 'lucide-react';

interface QuizArenaAppProps {
  questions?: QuizQuestion[];
  onFinish?: (score: number, total: number) => void;
  isFullscreen?: boolean;
}

export const QuizArenaApp: React.FC<QuizArenaAppProps> = ({
  questions = [],
  onFinish,
  isFullscreen = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [teamScores, setTeamScores] = useState<Record<string, number>>({
    'Tổ 1': 0,
    'Tổ 2': 0,
    'Tổ 3': 0,
    'Tổ 4': 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || isAnswered || isCompleted || totalQuestions === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isTimerRunning, isAnswered, isCompleted, totalQuestions]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setStreak(0);
    if (soundEnabled) sounds.playIncorrect();
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10);
      const streakBonus = streak * 50;
      const pointsEarned = 100 + timeBonus + streakBonus;

      setScore((prev) => prev + pointsEarned);
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (soundEnabled) sounds.playCorrect();
      if (newStreak >= 3) triggerConfetti();
    } else {
      setStreak(0);
      if (soundEnabled) sounds.playIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
      setIsTimerRunning(true);
    } else {
      setIsCompleted(true);
      if (soundEnabled) sounds.playBell();
      triggerConfetti();
      if (onFinish) onFinish(score, totalQuestions);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setIsTimerRunning(true);
    setIsCompleted(false);
  };

  const addPointToTeam = (team: string) => {
    setTeamScores((prev) => ({
      ...prev,
      [team]: (prev[team] || 0) + 100,
    }));
    if (soundEnabled) sounds.playChime();
  };

  if (totalQuestions === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-slate-800">Chưa có câu hỏi trắc nghiệm</h4>
        <p className="text-xs text-slate-500 mt-1">Vui lòng chọn hoặc tạo bộ câu hỏi trong Xưởng tạo App.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Bar Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Câu hỏi {currentIndex + 1} / {totalQuestions}
            </div>
            <div className="text-base font-bold text-slate-900">Đấu Trường Tri Thức Số</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak indicator */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Chuỗi x{streak}</span>
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{score} điểm</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="p-6 space-y-6">
          {/* Timer Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                <span>Thời gian còn lại</span>
              </div>
              <span className={`font-mono tabular-nums text-sm ${timeLeft <= 5 ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${
                  timeLeft > 15 ? 'bg-emerald-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/80">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 text-slate-800';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-900';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left font-medium text-sm transition-all shadow-sm ${btnStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isAnswered && isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1 pt-0.5 leading-relaxed">{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wide mb-1">
                <HelpCircle className="w-4 h-4 text-sky-600" /> Giải thích sư phạm
              </div>
              <p className="text-xs md:text-sm text-sky-950 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all whitespace-nowrap"
              >
                <span>{currentIndex + 1 < totalQuestions ? 'Câu hỏi kế tiếp' : 'Xem kết quả chung cuộc'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Team Scoreboard Quick Add (For classroom group competition) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Điểm thi đua các Tổ trên lớp:</span>
              <span className="text-[11px] text-slate-400">Nhấn để cộng 100đ cho nhóm trả lời đúng</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(teamScores).map(([team, pts]) => (
                <button
                  key={team}
                  onClick={() => addPointToTeam(team)}
                  className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs transition-colors"
                >
                  <span className="font-semibold text-slate-800">{team}</span>
                  <span className="font-mono font-bold text-sky-700 tabular-nums">+{pts}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900">Hoàn Thành Đấu Trường!</h3>
            <p className="text-sm text-slate-500 mt-1">Cả lớp đã xuất sắc hoàn thành trọn vẹn {totalQuestions} câu hỏi thử thách.</p>
          </div>

          <div className="max-w-xs mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Tổng điểm ghi được</div>
            <div className="text-3xl font-extrabold text-sky-600 mt-1 font-mono tabular-nums">
              {score} PTS
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Thi lại vòng mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
