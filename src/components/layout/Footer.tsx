import React from 'react';
import { Download, Upload } from 'lucide-react';
import { ConnectedApp } from '../../types';

interface FooterProps {
  apps: ConnectedApp[];
  onImportApps: (imported: ConnectedApp[]) => void;
}

export const Footer: React.FC<FooterProps> = ({ apps, onImportApps }) => {
  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `educraft-innovate-apps-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportApps(parsed);
        }
      } catch {
        // error handling
      }
    };
    reader.readAsText(file);
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span className="font-semibold text-slate-700">EduCraft Innovate</span> · Hệ sinh thái ứng dụng sư phạm đổi mới sáng tạo theo chuẩn GDPT 2018 & Công văn 5512/BGDĐT.
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={exportData}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            title="Sao lưu toàn bộ app và bài giảng ra file JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sao lưu dữ liệu</span>
          </button>

          <label className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Khôi phục từ file</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </footer>
  );
};
