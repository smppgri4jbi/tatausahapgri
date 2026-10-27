import React, { useState } from 'react';
import type { LetterRecord, LetterType } from '../types';
import { formatIndonesianDate } from '../utils/numberGenerator';
import {
  Search,
  Filter,
  Printer,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  letters: LetterRecord[];
  activeLetterId: string;
  onSelectLetter: (letter: LetterRecord) => void;
  onDeleteLetter: (id: string) => void;
  onSyncLetter: (letter: LetterRecord) => Promise<void>;
  isSyncing: boolean;
  spreadsheetUrl: string | null;
}

export const LetterArchiveTable: React.FC<Props> = ({
  letters,
  activeLetterId,
  onSelectLetter,
  onDeleteLetter,
  onSyncLetter,
  isSyncing,
  spreadsheetUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter letters
  const filteredLetters = letters.filter((l) => {
    const matchesSearch =
      l.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.dataSiswa?.nama && l.dataSiswa.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.dataGuru?.nama && l.dataGuru.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.tujuanPenerima && l.tujuanPenerima.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedFilter === 'all' || l.jenis === selectedFilter;

    return matchesSearch && matchesType;
  });

  const getBadgeLabel = (type: LetterType) => {
    switch (type) {
      case 'keterangan_aktif':
        return { text: 'Siswa Aktif', color: 'bg-blue-100 text-blue-800' };
      case 'berkelakuan_baik':
        return { text: 'SKKB', color: 'bg-emerald-100 text-emerald-800' };
      case 'dispensasi_kegiatan':
        return { text: 'Dispensasi', color: 'bg-purple-100 text-purple-800' };
      case 'mutasi_keluar':
        return { text: 'Mutasi Keluar', color: 'bg-amber-100 text-amber-800' };
      case 'surat_tugas':
        return { text: 'Tugas Guru', color: 'bg-indigo-100 text-indigo-800' };
      case 'undangan_ortu':
        return { text: 'Undangan Ortu', color: 'bg-teal-100 text-teal-800' };
      case 'panggilan_bk':
        return { text: 'Panggilan BK', color: 'bg-rose-100 text-rose-800' };
      case 'surat_pengantar':
        return { text: 'Pengantar', color: 'bg-slate-100 text-slate-800' };
      default:
        return { text: 'Surat', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // CSV Export utility
  const exportToCSV = () => {
    const headers = [
      'No. Urut',
      'Tanggal Surat',
      'Nomor Surat',
      'Jenis Surat',
      'Perihal',
      'Nama Terkait',
      'NISN / NIP',
      'Tujuan Penerima',
      'Keperluan',
      'Status Sync',
    ];

    const rows = filteredLetters.map((l) => [
      l.noUrut,
      l.tanggalSurat,
      `"${l.nomorSurat}"`,
      `"${l.jenis}"`,
      `"${l.perihal}"`,
      `"${l.dataSiswa?.nama || l.dataGuru?.nama || '-'}"`,
      `"${l.dataSiswa?.nisn || l.dataGuru?.nip || '-'}"`,
      `"${l.tujuanPenerima || '-'}"`,
      `"${(l.keperluan || '').replace(/"/g, '""')}"`,
      l.syncedToSheets ? 'Tersinkron Google Sheets' : 'Lokal',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buku_agenda_surat_smp_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Buku Agenda Arsip Surat Keluar SMP
          </h3>
          <p className="text-xs text-slate-500">
            Daftar seluruh surat dinas resmi yang telah diterbitkan dan tersimpan di database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat di Google Sheets
            </a>
          )}

          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat, nama siswa, guru, perihal..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Semua Jenis Surat</option>
            <option value="keterangan_aktif">Surat Aktif Siswa</option>
            <option value="berkelakuan_baik">SKKB</option>
            <option value="dispensasi_kegiatan">Dispensasi / Lomba</option>
            <option value="mutasi_keluar">Mutasi Siswa</option>
            <option value="surat_tugas">Surat Tugas Guru</option>
            <option value="undangan_ortu">Undangan Orang Tua</option>
            <option value="panggilan_bk">Panggilan BK</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 text-center w-12">No</th>
              <th className="py-3 px-3">Nomor Surat &amp; Tanggal</th>
              <th className="py-3 px-3">Jenis</th>
              <th className="py-3 px-3">Pihak Terkait / Siswa / Guru</th>
              <th className="py-3 px-3">Perihal &amp; Tujuan</th>
              <th className="py-3 px-3 text-center">Status Sync</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLetters.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Tidak ada arsip surat yang sesuai dengan pencarian atau filter.
                </td>
              </tr>
            ) : (
              filteredLetters.map((letter) => {
                const isSelected = letter.id === activeLetterId;
                const badge = getBadgeLabel(letter.jenis);
                const namaTerkait =
                  letter.dataSiswa?.nama || letter.dataGuru?.nama || letter.tujuanPenerima;
                const identitas =
                  letter.dataSiswa?.nisn ? `NISN: ${letter.dataSiswa.nisn} (${letter.dataSiswa.kelas})` :
                  letter.dataGuru?.nip ? `NIP: ${letter.dataGuru.nip}` : '';

                return (
                  <tr
                    key={letter.id}
                    className={`hover:bg-blue-50/50 transition-colors ${
                      isSelected ? 'bg-blue-50 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                      {letter.noUrut}
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-slate-900">{letter.nomorSurat}</p>
                      <p className="text-[11px] text-slate-500">
                        {formatIndonesianDate(letter.tanggalSurat)}
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${badge.color}`}
                      >
                        {badge.text}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{namaTerkait || '-'}</p>
                      {identitas && (
                        <p className="text-[10px] text-slate-500 font-mono">{identitas}</p>
                      )}
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <p className="truncate font-medium text-slate-800">{letter.perihal}</p>
                      <p className="truncate text-[11px] text-slate-500">
                        Keperluan: {letter.keperluan || '-'}
                      </p>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {letter.syncedToSheets ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Sheets
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Lokal
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectLetter(letter)}
                          title="Buka &amp; Cetak Surat"
                          className="p-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {!letter.syncedToSheets && (
                          <button
                            type="button"
                            onClick={() => onSyncLetter(letter)}
                            disabled={isSyncing}
                            title="Sinkronkan ke Google Sheets"
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(letter.id)}
                          title="Hapus Surat dari Agenda"
                          className="p-1.5 rounded-md bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal (Workspace guideline compliance) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Hapus Surat dari Agenda?
                </h4>
                <p className="text-xs text-slate-600">
                  Apakah Anda yakin ingin menghapus surat ini dari buku agenda lokal? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLetter(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer"
              >
                Hapus Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
