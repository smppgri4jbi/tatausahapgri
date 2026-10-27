import React, { useState } from 'react';
import type { LetterRecord } from '../types';
import { executeIframePrint, downloadPrintableLetterHtml } from '../utils/printHelper';
import {
  Printer,
  Download,
  Maximize2,
  X,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterRecord;
  onOpenFullscreen: () => void;
}

export const PrintOptionsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  letter,
  onOpenFullscreen,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrintDirect = () => {
    executeIframePrint('printable-letter-sheet');
  };

  const handleDownloadHtml = () => {
    downloadPrintableLetterHtml(
      'printable-letter-sheet',
      letter.nomorSurat,
      letter.dataSiswa?.nama || letter.dataGuru?.nama || 'Administrasi'
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Opsi Cetak Surat Resmi A4
              </h3>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-[240px]">
                {letter.nomorSurat}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options */}
        <div className="space-y-3">
          {/* Method 1: Print Dialog Browser */}
          <button
            type="button"
            onClick={handlePrintDirect}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-600 bg-blue-50/80 hover:bg-blue-100/80 text-blue-900 transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-950">
                  Cetak Langsung ke Printer / PDF
                </p>
                <p className="text-[11px] text-blue-700">
                  Membuka kotak dialog cetak browser Anda
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-1 rounded-md shadow-2xs">
              Cetak
            </span>
          </button>

          {/* Method 2: Download Standalone HTML/PDF document */}
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Unduh Dokumen Siap Cetak (.html / PDF)
                </p>
                <p className="text-[11px] text-slate-500">
                  100% Berfungsi di semua browser &amp; bisa dicetak kapan saja
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
              {downloadSuccess ? 'Tersimpan!' : 'Unduh'}
            </span>
          </button>

          {/* Method 3: Fullscreen Clean Preview */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullscreen();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Tampilan Layar Penuh (Fullscreen)
                </p>
                <p className="text-[11px] text-slate-500">
                  Tampilan bersih untuk cetak manual (Ctrl+P / Cmd+P)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
              Buka
            </span>
          </button>
        </div>

        {/* Tips for Best Print Results */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-950">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            Tips Pengaturan Cetak Browser (A4):
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1">
            <li>Pilih ukuran kertas: <strong>A4</strong> (Orientasi: Portrait).</li>
            <li>Pastikan centang: <strong>Grafik latar belakang</strong> (Background graphics) agar stempel dan logo tampil jernih.</li>
            <li>Margin disarankan: <strong>Default</strong> atau <strong>Minimum</strong>.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
