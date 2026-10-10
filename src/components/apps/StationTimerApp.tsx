import React, { useState, useEffect, useRef } from 'react';
import { StationItem } from '../../types';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Bell, Volume2, VolumeX, CheckCircle, Boxes } from 'lucide-react';

interface StationTimerAppProps {
  stations?: StationItem[];
  isFullscreen?: boolean;
}

export const StationTimerApp: React.FC<StationTimerAppProps> = ({
  stations = [],
  isFullscreen = false,
}) => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeStation = stations[currentStationIndex] || {
    id: 1,
    name: 'Trạm 1: Khám phá',
    durationMinutes: 7,
    task: 'Nghiên cứu tài liệu và hoàn thành phiếu học tập',
    product: 'Phiếu học tập nhóm',
  };

  const [secondsLeft, setSecondsLeft] = useState(activeStation.durationMinutes * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update seconds when station changes
  useEffect(() => {
    if (activeStation) {
      setSecondsLeft(activeStation.durationMinutes * 60);
      setIsRunning(false);
    }
  }, [currentStationIndex, stations]);

  // Main tick effect
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleStationFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentStationIndex]);

  const handleStationFinished = () => {
    setIsRunning(false);
    if (soundEnabled) sounds.playBell();
    triggerConfetti();

    // Auto-advance or prompt
    if (currentStationIndex + 1 < stations.length) {
      // Prompt user or transition
    }
  };

  const toggleRun = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(activeStation.durationMinutes * 60);
  };

  const nextStation = () => {
    if (currentStationIndex + 1 < stations.length) {
      setCurrentStationIndex((prev) => prev + 1);
    }
  };

  const prevStation = () => {
    if (currentStationIndex > 0) {
      setCurrentStationIndex((prev) => prev - 1);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const totalSeconds = activeStation.durationMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Vòng luân chuyển {currentStationIndex + 1} / {stations.length}
            </div>
            <h3 className="text-base font-bold text-slate-900">Bộ Đếm Thời Gian Trạm Học Tập</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            title={soundEnabled ? 'Tắt âm chuông' : 'Bật âm chuông'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Timer Stage (Left) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
          {/* Circular / Big Digital Display */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-200"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`transition-all duration-1000 ${
                  secondsLeft <= 60 ? 'stroke-red-500' : 'stroke-sky-600'
                }`}
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {isRunning ? 'Đang thực hiện' : 'Tạm dừng'}
              </span>
              <span className="font-mono text-5xl font-black text-slate-900 tabular-nums my-1">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs text-slate-400">
                Chuẩn: {activeStation.durationMinutes} phút
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={prevStation}
              disabled={currentStationIndex === 0}
              className="p-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Trạm trước"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={toggleRun}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                  : 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" /> Tạm dừng
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Bắt đầu
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Đặt lại thời gian"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={nextStation}
              disabled={currentStationIndex + 1 >= stations.length}
              className="p-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Trạm tiếp theo"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Instructions & Roadmap (Right) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded">
                Trạm hiện tại
              </span>
              <span className="text-xs text-slate-400">Luân chuyển theo chiều kim đồng hồ</span>
            </div>

            <h4 className="text-lg font-bold text-slate-900">
              {activeStation.name}
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Nhiệm vụ học tập:</span>
                <p className="mt-0.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed text-slate-700">
                  {activeStation.task}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-800">Sản phẩm đầu ra yêu cầu:</span>
                <p className="mt-0.5 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium">
                  {activeStation.product}
                </p>
              </div>
            </div>
          </div>

          {/* Station List Roadmap */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lộ trình 4 trạm luân chuyển
            </span>
            <div className="grid grid-cols-2 gap-2">
              {stations.map((st, idx) => {
                const isCurrent = idx === currentStationIndex;
                const isPast = idx < currentStationIndex;

                return (
                  <button
                    key={st.id}
                    onClick={() => setCurrentStationIndex(idx)}
                    className={`p-3 text-left rounded-xl border transition-all text-xs ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                        : isPast
                        ? 'border-emerald-200 bg-emerald-50/30 text-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className={isCurrent ? 'text-sky-900' : isPast ? 'text-emerald-800' : 'text-slate-800'}>
                        {st.name.split(':')[0]}
                      </span>
                      {isPast && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {st.durationMinutes} phút · {st.product}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
