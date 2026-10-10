import React, { useState } from 'react';
import { ConnectedApp } from '../../types';
import { sounds } from '../../utils/audio';
import { X, Copy, Check, QrCode, ExternalLink, Code2, Share2 } from 'lucide-react';

interface ShareEmbedModalProps {
  app: ConnectedApp | null;
  onClose: () => void;
}

export const ShareEmbedModal: React.FC<ShareEmbedModalProps> = ({ app, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!app) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://educraft.edu.vn';
  const shareUrl = `${currentOrigin}/#app-${app.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allow="fullscreen" title="${app.title}"></iframe>`;

  // Simple clean SVG QR code visualizer representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playCorrect();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-600" />
            <div>
              <h4 className="text-base font-bold text-slate-900">Liên Kết & Chia Sẻ Ứng Dụng</h4>
              <p className="text-xs text-slate-500 truncate max-w-xs">{app.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* QR Code and Quick Scan Section */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-24 h-24 bg-white p-1 rounded-lg border border-slate-200 shrink-0 flex items-center justify-center">
              <img
                src={qrSvgUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <QrCode className="w-4 h-4 text-sky-600" /> Quét mã tham gia trên điện thoại
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Chiếu mã QR này lên máy chiếu để học sinh dùng điện thoại hoặc máy tính bảng tham gia ngay không cần cài đặt.
              </p>
            </div>
          </div>

          {/* Direct Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Đường dẫn liên kết trực tiếp:</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none select-all"
              />
              <button
                onClick={() => copyToClipboard(shareUrl, setCopiedLink)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>

          {/* Embed iFrame snippet */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Code2 className="w-4 h-4 text-indigo-600" /> Mã nhúng iFrame (Google Sites, LMS, Canvas, Canva):
            </label>
            <div className="flex gap-2">
              <textarea
                readOnly
                rows={2}
                value={embedCode}
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none select-all leading-normal"
              />
              <button
                onClick={() => copyToClipboard(embedCode, setCopiedEmbed)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 self-start"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Đã chép' : 'Chép mã'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
