import React, { useState } from 'react';
import { FlashcardItem } from '../../types';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { BookOpen, RotateCw, Check, X, Shuffle, Sparkles, HelpCircle } from 'lucide-react';

interface FlashcardAppProps {
  cards?: FlashcardItem[];
  isFullscreen?: boolean;
}

export const FlashcardApp: React.FC<FlashcardAppProps> = ({
  cards = [],
  isFullscreen = false,
}) => {
  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    sounds.playTick();
  };

  const handleMastered = () => {
    setMasteredCount((prev) => prev + 1);
    sounds.playCorrect();
    advanceCard();
  };

  const handleNeedReview = () => {
    setReviewCount((prev) => prev + 1);
    sounds.playIncorrect();
    advanceCard();
  };

  const advanceCard = () => {
    setIsFlipped(false);
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      triggerConfetti();
      sounds.playBell();
    }
  };

  const shuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    sounds.playChime();
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setReviewCount(0);
  };

  if (!currentCard) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-800">Đã Hoàn Thành Bộ Thẻ!</h4>
        <p className="text-xs text-slate-500 mt-1">
          Ghi nhớ vững: {masteredCount} thẻ · Cần củng cố thêm: {reviewCount} thẻ
        </p>
        <button
          onClick={resetDeck}
          className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition-colors"
        >
          Ôn lại từ đầu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Thẻ {currentIndex + 1} / {deck.length} {currentCard.category && `· ${currentCard.category}`}
            </div>
            <h3 className="text-base font-bold text-slate-900">Thẻ Ghi Nhớ & Kích Hoạt Phản Xạ</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="text-emerald-700">Đã nhớ: {masteredCount}</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-700">Cần ôn: {reviewCount}</span>
          <button
            onClick={shuffleDeck}
            className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            title="Xáo trộn thẻ"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 max-w-xl mx-auto space-y-6">
        {/* Flashcard 3D Card Box */}
        <div
          onClick={handleFlip}
          className="cursor-pointer group relative min-h-[260px] p-8 rounded-2xl border-2 border-slate-200 hover:border-sky-400 bg-gradient-to-b from-white to-slate-50/50 shadow-sm flex flex-col justify-between transition-all duration-300 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">
              {isFlipped ? 'Mặt sau: Giải thích & Định nghĩa' : 'Mặt trước: Thuật ngữ / Hiện tượng'}
            </span>
            <span className="flex items-center gap-1 group-hover:text-sky-600 font-medium">
              <RotateCw className="w-3.5 h-3.5" /> Nhấn để lật
            </span>
          </div>

          <div className="my-auto py-4 text-center">
            {isFlipped ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <p className="text-base md:text-lg text-slate-800 leading-relaxed font-medium">
                  {currentCard.back}
                </p>
                {currentCard.hint && (
                  <div className="text-xs text-sky-700 bg-sky-50 py-1.5 px-3 rounded-lg inline-block border border-sky-100">
                    💡 {currentCard.hint}
                  </div>
                )}
              </div>
            ) : (
              <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                {currentCard.front}
              </h4>
            )}
          </div>

          <div className="text-center text-[11px] text-slate-400">
            {isFlipped ? 'Đã nắm được ý này chưa?' : 'Thử nhớ lại định nghĩa trước khi lật thẻ'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleNeedReview}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4 text-red-500" /> Cần ôn lại
          </button>

          <button
            onClick={handleFlip}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCw className="w-4 h-4" /> Lật thẻ
          </button>

          <button
            onClick={handleMastered}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Đã nhớ vững
          </button>
        </div>
      </div>
    </div>
  );
};
