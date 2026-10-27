import React, { useEffect, useState } from 'react';
import { searchSpreadsheetsInDrive } from '../services/sheetsService';
import { FileSpreadsheet, Search, RefreshCw, X, Check } from 'lucide-react';

interface Props {
  accessToken: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string, name: string) => void;
}

export const DrivePickerModal: React.FC<Props> = ({
  accessToken,
  isOpen,
  onClose,
  onSelect,
}) => {
  const [spreadsheets, setSpreadsheets] = useState<
    Array<{ id: string; name: string; modifiedTime?: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles();
    }
  }, [isOpen, accessToken]);

  const loadFiles = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const files = await searchSpreadsheetsInDrive(accessToken);
      setSpreadsheets(files);
    } catch (err: any) {
      setError('Gagal memuat daftar file spreadsheet dari Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filtered = spreadsheets.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Pilih Spreadsheet dari Google Drive
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Refresh */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama spreadsheet..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={loadFiles}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Muat Ulang"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* List of files */}
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
              <span>Memindai Google Drive Anda...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-xs text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Tidak ditemukan file spreadsheet di Google Drive Anda.
            </div>
          ) : (
            filtered.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  onSelect(file.id, file.name);
                  onClose();
                }}
                className="p-3 hover:bg-emerald-50/70 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-bold bg-white group-hover:bg-emerald-600 group-hover:text-white border border-slate-200 group-hover:border-emerald-600 rounded text-slate-700 transition-all"
                >
                  Pilih
                </button>
              </div>
            ))
          )}
        </div>

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
