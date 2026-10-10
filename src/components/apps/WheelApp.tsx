import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../../types';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { RotateCw, Users, Shuffle, Plus, Trash2, CheckCircle2, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

interface WheelAppProps {
  initialStudents?: Student[];
  onStudentsChange?: (students: Student[]) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const COLORS = [
  '#0284C7', '#0D9488', '#10B981', '#F59E0B', 
  '#EA580C', '#E11D48', '#8B5CF6', '#6366F1',
  '#06B6D4', '#84CC16', '#D97706', '#DB2777'
];

export const WheelApp: React.FC<WheelAppProps> = ({
  initialStudents = [],
  onStudentsChange,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [newName, setNewName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [removeAfterPick, setRemoveAfterPick] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mode, setMode] = useState<'wheel' | 'teams'>('wheel');
  const [teamCount, setTeamCount] = useState(4);
  const [generatedTeams, setGeneratedTeams] = useState<Array<{ name: string; members: Student[] }>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);
  const spinSpeedRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTickAngleRef = useRef(0);

  // Active students (not yet called if removeAfterPick is active)
  const activeStudents = removeAfterPick 
    ? students.filter(s => !s.hasBeenCalled)
    : students;

  useEffect(() => {
    if (initialStudents.length > 0 && students.length === 0) {
      setStudents(initialStudents);
    }
  }, [initialStudents]);

  // Redraw canvas whenever active students or angle changes
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.clientWidth, canvas.clientHeight);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 16;

    ctx.clearRect(0, 0, size, size);

    if (activeStudents.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.font = '14px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Đã gọi hết học sinh! Nhấn đặt lại.', centerX, centerY);
      return;
    }

    const sliceAngle = (2 * Math.PI) / activeStudents.length;

    // Draw outer glow/border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    // Draw segments
    activeStudents.forEach((student, index) => {
      const startAngle = angle + index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fill();

      // Border between slices
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(12, Math.min(16, 240 / activeStudents.length))}px Plus Jakarta Sans, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(student.name, radius - 24, 5);
      ctx.restore();
    });

    // Draw center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center icon text
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QUAY', centerX, centerY + 4);

    // Draw pointer at top (fixed at top pointing down)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX - 16, 2);
    ctx.lineTo(centerX + 16, 2);
    ctx.lineTo(centerX, 28);
    ctx.closePath();
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [activeStudents]);

  const spin = () => {
    if (isSpinning || activeStudents.length === 0) return;

    setSelectedStudent(null);
    setIsSpinning(true);

    // Random spin: 5 to 9 full rotations plus a random slice offset
    const randomRotations = 5 + Math.random() * 4;
    const targetDistance = randomRotations * 2 * Math.PI;
    const duration = 4500; // ms
    const startTime = performance.now();
    const initialAngle = currentAngleRef.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newAngle = initialAngle + targetDistance * easeOut;
      currentAngleRef.current = newAngle;

      // Check for tick sound on segment pass
      const sliceAngle = (2 * Math.PI) / activeStudents.length;
      if (Math.abs(newAngle - lastTickAngleRef.current) > sliceAngle) {
        if (soundEnabled) sounds.playTick();
        lastTickAngleRef.current = newAngle;
      }

      drawWheel(newAngle);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // Determine which student is under pointer (top at -PI/2 or 3PI/2)
        const normalizedAngle = (newAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        // The pointer is at 3PI/2 (top)
        const pointerAngle = (1.5 * Math.PI - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(pointerAngle / sliceAngle) % activeStudents.length;
        const winner = activeStudents[winningIndex];

        if (winner) {
          setSelectedStudent(winner);
          if (soundEnabled) sounds.playChime();
          triggerConfetti();

          if (removeAfterPick) {
            setStudents(prev => {
              const updated = prev.map(s => s.id === winner.id ? { ...s, hasBeenCalled: true } : s);
              if (onStudentsChange) onStudentsChange(updated);
              return updated;
            });
          }
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newName.trim(),
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    if (onStudentsChange) onStudentsChange(updated);
    setNewName('');
  };

  const handleRemoveStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    if (onStudentsChange) onStudentsChange(updated);
  };

  const handleResetCalledStatus = () => {
    const updated = students.map(s => ({ ...s, hasBeenCalled: false }));
    setStudents(updated);
    if (onStudentsChange) onStudentsChange(updated);
    setSelectedStudent(null);
  };

  const generateRandomTeams = () => {
    if (students.length === 0) return;
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const teams: Array<{ name: string; members: Student[] }> = [];

    for (let i = 0; i < teamCount; i++) {
      teams.push({ name: `Nhóm ${i + 1}`, members: [] });
    }

    shuffled.forEach((student, index) => {
      teams[index % teamCount].members.push(student);
    });

    setGeneratedTeams(teams);
    if (soundEnabled) sounds.playChime();
    triggerConfetti();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* App Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Vòng Quay Gọi Tên & Chia Nhóm Ngẫu Nhiên</h3>
            <p className="text-xs text-slate-500">Tạo cơ hội phát biểu công bằng · {students.length} học sinh trong danh sách</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Control for Mode */}
          <div className="flex items-center p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMode('wheel')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${mode === 'wheel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Vòng Quay
            </button>
            <button
              onClick={() => setMode('teams')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${mode === 'teams' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Chia Nhóm
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Toàn màn hình máy chiếu"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {mode === 'wheel' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Wheel Stage (Left / Main) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 relative min-h-[380px]">
            <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-pointer transition-transform duration-300"
                onClick={spin}
                title="Nhấn để quay"
              />
            </div>

            {/* Winner Announcement Card */}
            {selectedStudent && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center w-full max-w-sm animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Chúc mừng học sinh phát biểu
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedStudent.name}
                </div>
                {selectedStudent.group && (
                  <div className="text-xs text-amber-700 mt-0.5">{selectedStudent.group}</div>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={spin}
                disabled={isSpinning || activeStudents.length === 0}
                className={`px-8 py-3 rounded-xl font-bold text-base text-white shadow-md transition-all whitespace-nowrap ${
                  isSpinning || activeStudents.length === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-sky-200'
                }`}
              >
                {isSpinning ? 'Đang quay...' : 'QUAY NGAY'}
              </button>

              <button
                onClick={() => {
                  currentAngleRef.current = 0;
                  drawWheel(0);
                }}
                disabled={isSpinning}
                className="p-3 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                title="Cân bằng vòng quay"
              >
                <Shuffle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Roster & Controls Deck (Right) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Options Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Loại bỏ tên sau khi đã gọi</div>
                <div className="text-[11px] text-slate-500">Tránh gọi trùng lặp trong một tiết học</div>
              </div>
              <input
                type="checkbox"
                checked={removeAfterPick}
                onChange={(e) => setRemoveAfterPick(e.target.checked)}
                className="w-4 h-4 accent-sky-600 cursor-pointer rounded"
              />
            </div>

            {removeAfterPick && (
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Còn lại: {activeStudents.length} / {students.length} bạn</span>
                <button
                  onClick={handleResetCalledStatus}
                  className="text-sky-600 hover:underline font-medium"
                >
                  Đặt lại lượt gọi
                </button>
              </div>
            )}

            {/* Quick Add Form */}
            <form onSubmit={handleAddStudent} className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên học sinh mới..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Thêm
              </button>
            </form>

            {/* Students List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
              <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>Danh sách học sinh ({students.length})</span>
                <span className="text-[11px] text-slate-400">Nhấn icon xóa để loại bỏ</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 p-1">
                {students.map((student) => {
                  const isCalled = student.hasBeenCalled && removeAfterPick;
                  return (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between px-3 py-1.5 text-xs rounded transition-colors ${
                        isCalled ? 'bg-slate-100 text-slate-400 line-through' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isCalled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        <span className="font-medium truncate">{student.name}</span>
                        {student.group && (
                          <span className="text-[10px] text-slate-400 font-normal">({student.group})</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Xóa khỏi danh sách"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Team Generator Mode */
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-sm font-semibold text-slate-900">Chia nhóm học tập ngẫu nhiên</div>
              <div className="text-xs text-slate-500">Phân bổ đều học sinh theo số lượng nhóm mong muốn</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span>Số nhóm:</span>
                <select
                  value={teamCount}
                  onChange={(e) => setTeamCount(Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={2}>2 Nhóm</option>
                  <option value={3}>3 Nhóm</option>
                  <option value={4}>4 Nhóm</option>
                  <option value={5}>5 Nhóm</option>
                  <option value={6}>6 Nhóm</option>
                </select>
              </div>

              <button
                onClick={generateRandomTeams}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Shuffle className="w-4 h-4" /> Bốc thăm chia nhóm
              </button>
            </div>
          </div>

          {generatedTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedTeams.map((team, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-sky-800">{team.name}</span>
                    <span className="text-[11px] text-slate-400">{team.members.length} thành viên</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {team.members.map((m, mIdx) => (
                      <li key={m.id} className="flex items-center gap-1.5 py-0.5">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-[10px] text-slate-600 flex items-center justify-center font-medium">
                          {mIdx + 1}
                        </span>
                        <span className="truncate">{m.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nhấn nút "Bốc thăm chia nhóm" để tự động tạo danh sách nhóm ngẫu nhiên minh bạch.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
