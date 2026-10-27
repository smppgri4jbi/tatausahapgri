import React, { useState } from 'react';
import type { SchoolProfile, LetterRecord } from '../types';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  FolderOpen,
  LogOut,
  Sparkles,
  Link2,
} from 'lucide-react';

interface Props {
  user: any | null;
  accessToken: string | null;
  spreadsheetId: string | null;
  spreadsheetTitle: string | null;
  spreadsheetUrl: string | null;
  letters: LetterRecord[];
  isSyncing: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onCreateNewSpreadsheet: () => Promise<void>;
  onSelectExistingSpreadsheet: (id: string, name?: string) => void;
  onSyncAllLetters: () => Promise<void>;
  onOpenDrivePicker: () => void;
}

export const SpreadsheetSyncPanel: React.FC<Props> = ({
  user,
  accessToken,
  spreadsheetId,
  spreadsheetTitle,
  spreadsheetUrl,
  letters,
  isSyncing,
  onLogin,
  onLogout,
  onCreateNewSpreadsheet,
  onSelectExistingSpreadsheet,
  onSyncAllLetters,
  onOpenDrivePicker,
}) => {
  const [manualIdInput, setManualIdInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const syncedCount = letters.filter((l) => l.syncedToSheets).length;
  const unsyncedCount = letters.length - syncedCount;

  const handleCreateNew = async () => {
    setActionError(null);
    setActionSuccess(null);
    setIsCreating(true);
    try {
      await onCreateNewSpreadsheet();
      setActionSuccess('Spreadsheet Buku Agenda Surat berhasil dibuat dan dikaitkan!');
    } catch (err: any) {
      setActionError(err.message || 'Gagal membuat spreadsheet di Google Sheets');
    } finally {
      setIsCreating(false);
    }
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!manualIdInput.trim()) return;

    // Check if input is full URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    let id = manualIdInput.trim();
    const match = id.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      id = match[1];
    }

    onSelectExistingSpreadsheet(id, 'Spreadsheet SMP Tertaut');
    setShowManualInput(false);
    setManualIdInput('');
    setActionSuccess('Spreadsheet berhasil dikaitkan!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Integrasi Google Sheets &amp; Arsip Surat
              <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                Otomatis
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Setiap surat yang dibuat dan diterbitkan akan tercatat rapi ke lembar kerja Google Sheets.
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{user.displayName || 'Pengguna Google'}</p>
              <p className="text-[10px] text-slate-500">{user.email}</p>
            </div>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-slate-200"
              />
            )}
            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari Google"
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* State A: Not Signed In */}
      {!user ? (
        <div className="bg-slate-50 rounded-xl p-5 border border-dashed border-slate-300 text-center space-y-3">
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-bold text-slate-800">
              Kaitkan Akun Google untuk Menyimpan Arsip ke Spreadsheet
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Masuk dengan akun Google Anda untuk membuat atau menghubungkan Spreadsheet Buku Agenda Surat Keluar SMP. Data Anda tersimpan aman langsung di Google Drive Anda.
            </p>
          </div>
          <div className="pt-2">
            <GoogleSignInButton onClick={onLogin} />
          </div>
        </div>
      ) : (
        /* State B: Signed In */
        <div className="space-y-4">
          {/* Status Alert Messages */}
          {actionError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Connected Spreadsheet Card */}
          {spreadsheetId ? (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Spreadsheet Aktif Terhubung
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {spreadsheetTitle || `Buku Agenda Surat Keluar SMP (${spreadsheetId.slice(0, 8)}...)`}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {spreadsheetId}
                  </p>
                </div>

                <a
                  href={
                    spreadsheetUrl ||
                    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka di Google Sheets
                </a>
              </div>

              {/* Sync Metrics Bar */}
              <div className="bg-white rounded-lg p-3 border border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Total Arsip:</span>{' '}
                    <span className="font-bold text-slate-800">{letters.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Tersinkron:</span>{' '}
                    <span className="font-bold text-emerald-600">{syncedCount}</span>
                  </div>
                  {unsyncedCount > 0 && (
                    <div className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {unsyncedCount} belum sinkron
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onSyncAllLetters}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
                  </button>

                  <button
                    type="button"
                    onClick={onOpenDrivePicker}
                    className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Ganti Spreadsheet"
                  >
                    Ganti
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* No Spreadsheet Connected yet */
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Belum Ada Spreadsheet Tertaut
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Pilih salah satu opsi di bawah untuk mulai menyimpan data surat ke Google Sheets:
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCreateNew}
                  disabled={isCreating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <PlusCircle className="w-4 h-4" />
                  {isCreating ? 'Sedang Membuat Spreadsheet...' : 'Buat Spreadsheet Baru Otomatis'}
                </button>

                <button
                  type="button"
                  onClick={onOpenDrivePicker}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  Pilih dari Google Drive
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Input Link / ID Manual
                </button>
              </div>

              {showManualInput && (
                <form onSubmit={handleManualConnect} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={manualIdInput}
                    onChange={(e) => setManualIdInput(e.target.value)}
                    placeholder="Tempel Spreadsheet ID atau URL Google Sheets..."
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                  >
                    Kaitkan
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
