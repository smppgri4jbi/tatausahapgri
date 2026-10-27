import React, { useState, useEffect } from 'react';
import type { SchoolProfile, LetterRecord } from './types';
import { DEFAULT_SCHOOL_PROFILE, INITIAL_LETTERS } from './data/defaultData';
import { OfficialLetterPreview } from './components/OfficialLetterPreview';
import { LetterForm } from './components/LetterForm';
import { LetterArchiveTable } from './components/LetterArchiveTable';
import { SpreadsheetSyncPanel } from './components/SpreadsheetSyncPanel';
import { DrivePickerModal } from './components/DrivePickerModal';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { PrintOptionsModal } from './components/PrintOptionsModal';
import { executeIframePrint, downloadPrintableLetterHtml } from './utils/printHelper';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from './services/firebaseAuth';
import {
  createSchoolLetterSpreadsheet,
  appendLetterToSpreadsheet,
  batchAppendLettersToSpreadsheet,
} from './services/sheetsService';
import {
  Printer,
  FileSpreadsheet,
  Building2,
  FileText,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Settings,
  Layers,
  Sparkles,
  Share2,
  Image as ImageIcon,
  ArrowLeft,
  Download,
  Maximize2,
} from 'lucide-react';

export default function App() {
  // 1. School Profile State (persisted in localStorage)
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('smp_school_profile');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_PROFILE;
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  });

  // 2. Letters Archive State (persisted in localStorage)
  const [letters, setLetters] = useState<LetterRecord[]>(() => {
    try {
      const saved = localStorage.getItem('smp_letters_archive');
      return saved ? JSON.parse(saved) : INITIAL_LETTERS;
    } catch {
      return INITIAL_LETTERS;
    }
  });

  // 3. Active Letter for Form & Preview
  const [activeLetter, setActiveLetter] = useState<LetterRecord>(() => {
    return letters[0] || INITIAL_LETTERS[0];
  });

  // 4. Google Auth & Spreadsheet Connection State
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('smp_connected_spreadsheet_id') || null;
  });
  const [spreadsheetTitle, setSpreadsheetTitle] = useState<string | null>(() => {
    return localStorage.getItem('smp_connected_spreadsheet_title') || null;
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    return localStorage.getItem('smp_connected_spreadsheet_url') || null;
  });

  // 5. UI Layout & View Controls
  const [activeTab, setActiveTab] = useState<'editor' | 'archive'>('editor');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showKop, setShowKop] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showStamp, setShowStamp] = useState(true);
  const [showQr, setShowQr] = useState(true);

  // 6. Modals & Print Views
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isFullscreenPrint, setIsFullscreenPrint] = useState(false);

  // 7. Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Sync profile & letters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smp_school_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save profile to localStorage', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('smp_letters_archive', JSON.stringify(letters));
    } catch (e) {
      console.warn('Could not save letters to localStorage', e);
    }
  }, [letters]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast(`Berhasil masuk sebagai ${res.user.displayName || res.user.email}`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal login dengan Google', 'error');
    }
  };

  // Google Sign-Out
  const handleGoogleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      showToast('Berhasil keluar dari akun Google', 'info');
    } catch (err: any) {
      showToast('Gagal keluar', 'error');
    }
  };

  // Create new Spreadsheet
  const handleCreateNewSpreadsheet = async () => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      throw new Error('Silakan masuk dengan akun Google terlebih dahulu');
    }

    const result = await createSchoolLetterSpreadsheet(token, profile.namaSekolah);
    setSpreadsheetId(result.spreadsheetId);
    setSpreadsheetTitle(result.title);
    setSpreadsheetUrl(result.spreadsheetUrl);

    localStorage.setItem('smp_connected_spreadsheet_id', result.spreadsheetId);
    localStorage.setItem('smp_connected_spreadsheet_title', result.title);
    localStorage.setItem('smp_connected_spreadsheet_url', result.spreadsheetUrl);

    showToast(`Spreadsheet "${result.title}" berhasil dibuat!`, 'success');

    // Automatically batch sync existing letters to this new spreadsheet
    if (letters.length > 0) {
      try {
        await batchAppendLettersToSpreadsheet(token, result.spreadsheetId, letters);
        setLetters((prev) => prev.map((l) => ({ ...l, syncedToSheets: true })));
        showToast(`${letters.length} data surat berhasil disinkronkan ke Spreadsheet baru`, 'success');
      } catch (e) {
        console.error('Initial sync error:', e);
      }
    }
  };

  // Select existing spreadsheet
  const handleSelectExistingSpreadsheet = (id: string, name?: string) => {
    const title = name || `Spreadsheet Arsip SMP (${id.slice(0, 6)})`;
    const url = `https://docs.google.com/spreadsheets/d/${id}/edit`;
    setSpreadsheetId(id);
    setSpreadsheetTitle(title);
    setSpreadsheetUrl(url);

    localStorage.setItem('smp_connected_spreadsheet_id', id);
    localStorage.setItem('smp_connected_spreadsheet_title', title);
    localStorage.setItem('smp_connected_spreadsheet_url', url);

    showToast(`Spreadsheet "${title}" berhasil dikaitkan!`, 'success');
  };

  // Save or update letter in archive
  const handleSaveLetter = async (savedLetter: LetterRecord) => {
    let updatedLetters: LetterRecord[];
    const exists = letters.some((l) => l.id === savedLetter.id);

    if (exists) {
      updatedLetters = letters.map((l) => (l.id === savedLetter.id ? savedLetter : l));
    } else {
      updatedLetters = [savedLetter, ...letters];
    }

    setLetters(updatedLetters);
    setActiveLetter(savedLetter);
    showToast('Surat berhasil disimpan ke Buku Agenda', 'success');

    // Auto-sync to Google Sheets if spreadsheet is connected
    const token = accessToken || (await getAccessToken());
    if (token && spreadsheetId) {
      try {
        setIsSyncing(true);
        await appendLetterToSpreadsheet(token, spreadsheetId, savedLetter);
        // Mark as synced
        setLetters((prev) =>
          prev.map((l) => (l.id === savedLetter.id ? { ...l, syncedToSheets: true } : l))
        );
        showToast('Data surat otomatis tercatat di Google Sheets!', 'success');
      } catch (err: any) {
        console.warn('Auto sync warning:', err);
        showToast('Surat tersimpan lokal (akan disinkronkan saat koneksi siap)', 'info');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Sync a single letter to Sheets
  const handleSyncSingleLetter = async (letter: LetterRecord) => {
    const token = accessToken || (await getAccessToken());
    if (!token || !spreadsheetId) {
      showToast('Harap hubungkan Google Sheets terlebih dahulu', 'error');
      return;
    }

    try {
      setIsSyncing(true);
      await appendLetterToSpreadsheet(token, spreadsheetId, letter);
      setLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, syncedToSheets: true } : l))
      );
      showToast(`Surat nomor ${letter.nomorSurat} berhasil disinkronkan ke Google Sheets!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyinkronkan surat ke Google Sheets', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync all unsynced letters
  const handleSyncAllLetters = async () => {
    const token = accessToken || (await getAccessToken());
    if (!token || !spreadsheetId) {
      showToast('Harap hubungkan Google Sheets terlebih dahulu', 'error');
      return;
    }

    const unsynced = letters.filter((l) => !l.syncedToSheets);
    if (unsynced.length === 0) {
      showToast('Semua surat sudah tersinkronkan dengan Google Sheets', 'info');
      return;
    }

    try {
      setIsSyncing(true);
      await batchAppendLettersToSpreadsheet(token, spreadsheetId, unsynced);
      setLetters((prev) => prev.map((l) => ({ ...l, syncedToSheets: true })));
      showToast(`Berhasil menyinkronkan ${unsynced.length} surat ke Google Sheets!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyinkronkan massal ke Google Sheets', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete letter
  const handleDeleteLetter = (id: string) => {
    setLetters((prev) => prev.filter((l) => l.id !== id));
    showToast('Surat dihapus dari buku agenda lokal', 'info');
  };

  // Print Letter trigger
  const handlePrint = () => {
    // 1. Trigger isolated iframe print directly
    executeIframePrint('printable-letter-sheet');
    // 2. Show print options modal for download and fullscreen options
    setIsPrintModalOpen(true);
  };

  // Create new fresh draft letter
  const handleNewDraft = () => {
    const nextNo = letters.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const newDraft: LetterRecord = {
      id: `smp-surat-${Date.now()}`,
      nomorSurat: `421.3/${String(nextNo).padStart(3, '0')}/${profile.kodeSuratSekolah}/X/${now.getFullYear()}`,
      kodeKlasifikasi: '421.3',
      noUrut: nextNo,
      bulanRomawi: 'X',
      tahun: now.getFullYear(),
      tanggalSurat: dateStr,
      kotaSurat: profile.kabupatenKota.replace('Kabupaten ', '').replace('Kota ', ''),
      jenis: 'keterangan_aktif',
      perihal: 'Surat Keterangan Aktif Belajar Siswa',
      lampiran: '-',
      tujuanPenerima: 'Pihak yang Berkepentingan',
      alamatPenerima: 'Di Tempat',
      dataSiswa: {
        nama: '',
        nisn: '',
        nis: '',
        kelas: 'VII-A',
        tempatLahir: '',
        tanggalLahir: '',
        jenisKelamin: 'Laki-laki',
        namaOrangTua: '',
        pekerjaanOrangTua: '',
        alamatSiswa: '',
      },
      keperluan: 'Kelengkapan administrasi peserta didik.',
      tembusan: ['Arsip Tata Usaha'],
      createdAt: new Date().toISOString(),
      syncedToSheets: false,
    };

    setActiveLetter(newDraft);
    setActiveTab('editor');
    showToast('Formulir surat baru siap diisi', 'info');
  };

  // Dedicated Fullscreen Print Mode for 100% reliable printing without any UI obstruction
  if (isFullscreenPrint) {
    return (
      <div className="min-h-screen bg-slate-900/90 py-8 px-4 flex flex-col items-center">
        <div className="no-print w-full max-w-[210mm] bg-white rounded-xl shadow-lg p-3 mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsFullscreenPrint(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Editor
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                downloadPrintableLetterHtml(
                  'printable-letter-sheet',
                  activeLetter.nomorSurat,
                  activeLetter.dataSiswa?.nama || activeLetter.dataGuru?.nama || 'Administrasi'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Unduh Berkas Cetak (.html)
            </button>

            <button
              type="button"
              onClick={() => executeIframePrint('printable-letter-sheet')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Sekarang (Ctrl+P)
            </button>
          </div>
        </div>

        <OfficialLetterPreview
          letter={activeLetter}
          profile={profile}
          onPrint={handlePrint}
          showKop={showKop}
          showSignature={showSignature}
          showStamp={showStamp}
          showQr={showQr}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* 1. TOP NAVBAR (Hidden during printing via .no-print) */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & School Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              SMP
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight truncate max-w-xs sm:max-w-md">
                {profile.namaSekolah}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Administrasi Surat &amp; Sinkronisasi Google Sheets
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editor &amp;</span> Cetak
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('archive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'archive'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Buku Agenda &amp;</span> Sheets
                <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
                  {letters.length}
                </span>
              </button>
            </div>

            {/* School Profile & Logo Settings */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors cursor-pointer"
              title="Ganti Logo Sekolah & Atur Kop Surat"
            >
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Ganti Logo &amp; Kop</span>
            </button>

            {/* Print Primary Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak A4</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Bar */}
      {toast && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold bg-white animate-in slide-in-from-bottom-5">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />}
          <span className="text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'editor' ? (
          /* TAB 1: SPLIT VIEW EDITOR & A4 LETTER PREVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: FORM GENERATOR */}
            <div className="no-print lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Panel Penyusunan Surat
                </span>
                <button
                  type="button"
                  onClick={handleNewDraft}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Buat Surat Baru
                </button>
              </div>

              <LetterForm
                initialLetter={activeLetter}
                profile={profile}
                nextNoUrut={letters.length + 1}
                onSave={handleSaveLetter}
                onChange={(updated) => setActiveLetter(updated)}
                onPrintNow={handlePrint}
              />
            </div>

            {/* RIGHT COLUMN: LIVE A4 OFFICIAL LETTER PREVIEW */}
            <div className="lg:col-span-7 flex flex-col items-center space-y-4">
              {/* Preview Options Toolbar (no-print) */}
              <div className="no-print w-full max-w-[210mm] bg-white rounded-xl shadow-xs border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Pratinjau Cetak Kertas A4</span>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={showKop}
                      onChange={(e) => setShowKop(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Kop Surat</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={showStamp}
                      onChange={(e) => setShowStamp(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Cap Stempel</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={showSignature}
                      onChange={(e) => setShowSignature(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Tanda Tangan</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={showQr}
                      onChange={(e) => setShowQr(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>QR Validasi</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold border border-blue-200 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    Ganti Logo
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="ml-1 inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak
                  </button>
                </div>
              </div>

              {/* The Master Paper */}
              <OfficialLetterPreview
                letter={activeLetter}
                profile={profile}
                onPrint={handlePrint}
                showKop={showKop}
                showSignature={showSignature}
                showStamp={showStamp}
                showQr={showQr}
              />
            </div>
          </div>
        ) : (
          /* TAB 2: BUKU AGENDA ARSIP & GOOGLE SHEETS SYNC */
          <div className="space-y-6">
            {/* Google Sheets Connection & Sync Status Banner */}
            <SpreadsheetSyncPanel
              user={user}
              accessToken={accessToken}
              spreadsheetId={spreadsheetId}
              spreadsheetTitle={spreadsheetTitle}
              spreadsheetUrl={spreadsheetUrl}
              letters={letters}
              isSyncing={isSyncing}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
              onCreateNewSpreadsheet={handleCreateNewSpreadsheet}
              onSelectExistingSpreadsheet={handleSelectExistingSpreadsheet}
              onSyncAllLetters={handleSyncAllLetters}
              onOpenDrivePicker={() => setIsDrivePickerOpen(true)}
            />

            {/* Letter Archive Table (Buku Agenda Surat Keluar) */}
            <LetterArchiveTable
              letters={letters}
              activeLetterId={activeLetter.id}
              onSelectLetter={(letter) => {
                setActiveLetter(letter);
                setActiveTab('editor');
                showToast(`Membuka surat: ${letter.nomorSurat}`, 'info');
                setTimeout(() => handlePrint(), 150);
              }}
              onDeleteLetter={handleDeleteLetter}
              onSyncLetter={handleSyncSingleLetter}
              isSyncing={isSyncing}
              spreadsheetUrl={spreadsheetUrl}
            />
          </div>
        )}
      </main>

      {/* 3. MODALS */}
      {/* School Profile Customization Modal */}
      <SchoolProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={(newProfile) => {
          setProfile(newProfile);
          showToast('Profil sekolah dan kop surat berhasil diperbarui', 'success');
        }}
      />

      {/* Google Drive Spreadsheet Picker Modal */}
      <DrivePickerModal
        accessToken={accessToken}
        isOpen={isDrivePickerOpen}
        onClose={() => setIsDrivePickerOpen(false)}
        onSelect={(id, name) => handleSelectExistingSpreadsheet(id, name)}
      />

      {/* Print Options & Dialog Modal */}
      <PrintOptionsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        letter={activeLetter}
        onOpenFullscreen={() => setIsFullscreenPrint(true)}
      />
    </div>
  );
}
