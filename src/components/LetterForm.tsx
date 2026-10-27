import React, { useState } from 'react';
import type { LetterRecord, LetterType, SchoolProfile } from '../types';
import { SAMPLE_STUDENTS, SAMPLE_TEACHERS } from '../data/defaultData';
import { generateNomorSurat } from '../utils/numberGenerator';
import {
  FileText,
  User,
  GraduationCap,
  Calendar,
  Briefcase,
  Users,
  Sparkles,
  Save,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';

interface Props {
  initialLetter: LetterRecord;
  profile: SchoolProfile;
  nextNoUrut: number;
  onSave: (letter: LetterRecord) => void;
  onChange: (letter: LetterRecord) => void;
  onPrintNow: () => void;
}

export const LetterForm: React.FC<Props> = ({
  initialLetter,
  profile,
  nextNoUrut,
  onSave,
  onChange,
  onPrintNow,
}) => {
  const [formData, setFormData] = useState<LetterRecord>(initialLetter);
  const [tembusanInput, setTembusanInput] = useState('');

  // Handle letter type change
  const handleTypeChange = (newType: LetterType) => {
    const { nomorSurat, kodeKlasifikasi, bulanRomawi, tahun } = generateNomorSurat(
      newType,
      formData.noUrut || nextNoUrut,
      profile.kodeSuratSekolah,
      formData.tanggalSurat
    );

    let perihal = '';
    let keperluan = '';
    let tujuanPenerima = formData.tujuanPenerima;

    if (newType === 'keterangan_aktif') {
      perihal = 'Surat Keterangan Aktif Belajar Siswa';
      keperluan = 'Kelengkapan administrasi beasiswa Program Indonesia Pintar (PIP) / tunjangan gaji orang tua.';
      tujuanPenerima = 'Pihak yang Berkepentingan';
    } else if (newType === 'berkelakuan_baik') {
      perihal = 'Surat Keterangan Berkelakuan Baik (SKKB)';
      keperluan = 'Persyaratan pendaftaran seleksi masuk SMA/SMK (PPDB) Tahun Ajaran Baru.';
      tujuanPenerima = 'Panitia PPDB / Kepala SMA/SMK Tujuan';
    } else if (newType === 'dispensasi_kegiatan') {
      perihal = 'Surat Dispensasi Mengikuti Kegiatan / Lomba';
      keperluan = 'Mewakili sekolah dalam ajang perlombaan tingkat Kabupaten/Kota.';
      tujuanPenerima = 'Bapak/Ibu Guru Pengajar';
    } else if (newType === 'mutasi_keluar') {
      perihal = 'Surat Keterangan Pindah Sekolah (Mutasi Keluar)';
      keperluan = 'Mengikuti kepindahan domisili tugas dinas orang tua.';
      tujuanPenerima = 'Kepala SMP Tujuan';
    } else if (newType === 'surat_tugas') {
      perihal = 'Surat Perintah Tugas Kedinasan Guru';
      keperluan = 'Melaksanakan tugas kedinasan perwakilan sekolah dengan sungguh-sungguh.';
      tujuanPenerima = 'Guru / Tenaga Kependidikan yang Bersangkutan';
    } else if (newType === 'undangan_ortu') {
      perihal = 'Undangan Rapat Orang Tua / Wali Murid';
      keperluan = 'Mengharap kehadiran tepat waktu demi kemajuan program pembelajaran siswa.';
      tujuanPenerima = 'Bapak / Ibu Orang Tua / Wali Peserta Didik';
    } else if (newType === 'panggilan_bk') {
      perihal = 'Surat Panggilan Orang Tua / Wali Siswa';
      keperluan = 'Koordinasi dan pembinaan tatap muka mengenai kehadiran & kedisiplinan peserta didik.';
      tujuanPenerima = 'Orang Tua / Wali Murid';
    } else if (newType === 'surat_pengantar') {
      perihal = 'Surat Pengantar Berkas Administrasi';
      keperluan = 'Penyampaian berkas laporan dan usulan dinas sekolah.';
      tujuanPenerima = 'Kepala Dinas Pendidikan Kabupaten Bogor';
    }

    const updated: LetterRecord = {
      ...formData,
      jenis: newType,
      nomorSurat,
      kodeKlasifikasi,
      bulanRomawi,
      tahun,
      perihal,
      keperluan,
      tujuanPenerima,
    };

    setFormData(updated);
    onChange(updated);
  };

  const updateField = <K extends keyof LetterRecord>(field: K, value: LetterRecord[K]) => {
    const updated = { ...formData, [field]: value };
    // If date changed, regenerate roman month & year
    if (field === 'tanggalSurat') {
      const { nomorSurat, kodeKlasifikasi, bulanRomawi, tahun } = generateNomorSurat(
        formData.jenis,
        formData.noUrut,
        profile.kodeSuratSekolah,
        value as string
      );
      updated.nomorSurat = nomorSurat;
      updated.kodeKlasifikasi = kodeKlasifikasi;
      updated.bulanRomawi = bulanRomawi;
      updated.tahun = tahun;
    }
    setFormData(updated);
    onChange(updated);
  };

  const updateStudentField = (field: string, val: string) => {
    const current = formData.dataSiswa || {
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
    };
    const updated = {
      ...formData,
      dataSiswa: {
        ...current,
        [field]: val,
      },
    };
    setFormData(updated);
    onChange(updated);
  };

  const updateTeacherField = (field: string, val: string) => {
    const current = formData.dataGuru || {
      nama: '',
      nip: '',
      pangkatGolongan: '',
      jabatan: '',
      tugas: '',
      tempatTugas: '',
      waktuMulai: '',
      waktuSelesai: '',
    };
    const updated = {
      ...formData,
      dataGuru: {
        ...current,
        [field]: val,
      },
    };
    setFormData(updated);
    onChange(updated);
  };

  const updateUndanganField = (field: string, val: string) => {
    const current = formData.dataUndangan || {
      hariTanggal: '',
      waktu: '',
      tempat: '',
      agenda: '',
    };
    const updated = {
      ...formData,
      dataUndangan: {
        ...current,
        [field]: val,
      },
    };
    setFormData(updated);
    onChange(updated);
  };

  const updateBKField = (field: string, val: string) => {
    const current = formData.dataBK || {
      masalah: '',
      hariTanggalPanggilan: '',
      waktuPanggilan: '',
      ruangan: 'Ruang Bimbingan dan Konseling (BK)',
      guruBK: 'Guru BK / Konselor Sekolah',
    };
    const updated = {
      ...formData,
      dataBK: {
        ...current,
        [field]: val,
      },
    };
    setFormData(updated);
    onChange(updated);
  };

  // Quick fill preset sample
  const fillSampleStudent = (index: number) => {
    const sample = SAMPLE_STUDENTS[index];
    if (sample) {
      const updated = {
        ...formData,
        dataSiswa: { ...sample },
      };
      setFormData(updated);
      onChange(updated);
    }
  };

  const fillSampleTeacher = (index: number) => {
    const sample = SAMPLE_TEACHERS[index];
    if (sample) {
      const updated = {
        ...formData,
        dataGuru: {
          ...sample,
          tugas: 'Mengikuti Workshop Pembelajaran Berdiferensiasi Kurikulum Merdeka Jenjang SMP.',
          tempatTugas: 'Balai Penjaminan Mutu Pendidikan (BPMP) Jawa Barat',
          waktuMulai: '2026-10-30',
          waktuSelesai: '2026-10-31',
        },
      };
      setFormData(updated);
      onChange(updated);
    }
  };

  const addTembusan = () => {
    if (!tembusanInput.trim()) return;
    const current = formData.tembusan || [];
    const updated = {
      ...formData,
      tembusan: [...current, tembusanInput.trim()],
    };
    setFormData(updated);
    onChange(updated);
    setTembusanInput('');
  };

  const removeTembusan = (idx: number) => {
    const current = formData.tembusan || [];
    const updated = {
      ...formData,
      tembusan: current.filter((_, i) => i !== idx),
    };
    setFormData(updated);
    onChange(updated);
  };

  const isStudentLetter = [
    'keterangan_aktif',
    'berkelakuan_baik',
    'dispensasi_kegiatan',
    'mutasi_keluar',
    'panggilan_bk',
  ].includes(formData.jenis);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Formulir Pembuatan Surat Administrasi SMP
          </h2>
          <p className="text-xs text-slate-500">
            Lengkapi data di bawah ini, pratinjau surat di sebelah kanan akan diperbarui secara otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrintNow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Langsung
          </button>
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan &amp; Catat Surat
          </button>
        </div>
      </div>

      {/* 1. Pilih Template Jenis Surat */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          1. Pilih Jenis Surat Resmi
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'keterangan_aktif', label: 'Surat Aktif Siswa', icon: GraduationCap },
            { id: 'berkelakuan_baik', label: 'SKKB (Kelakuan Baik)', icon: User },
            { id: 'dispensasi_kegiatan', label: 'Dispensasi / Lomba', icon: Sparkles },
            { id: 'mutasi_keluar', label: 'Mutasi Siswa Keluar', icon: FileText },
            { id: 'surat_tugas', label: 'Surat Tugas Guru', icon: Briefcase },
            { id: 'undangan_ortu', label: 'Undangan Orang Tua', icon: Users },
            { id: 'panggilan_bk', label: 'Panggilan Siswa (BK)', icon: Calendar },
            { id: 'surat_pengantar', label: 'Surat Pengantar', icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = formData.jenis === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTypeChange(item.id as LetterType)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Nomor Surat & Metadata Administrasi */}
      <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          2. Penomoran Surat Otomatis &amp; Tanggal Dinas
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nomor Surat Terbuka
            </label>
            <input
              type="text"
              value={formData.nomorSurat}
              onChange={(e) => updateField('nomorSurat', e.target.value)}
              className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. 421.3/048/SMP.01/X/2026"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tanggal Diterbitkan
            </label>
            <input
              type="date"
              value={formData.tanggalSurat}
              onChange={(e) => updateField('tanggalSurat', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kota Kedudukan
            </label>
            <input
              type="text"
              value={formData.kotaSurat}
              onChange={(e) => updateField('kotaSurat', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Bogor"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Perihal / Hal Surat
            </label>
            <input
              type="text"
              value={formData.perihal}
              onChange={(e) => updateField('perihal', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tujuan Penerima (Kepada Yth.)
            </label>
            <input
              type="text"
              value={formData.tujuanPenerima}
              onChange={(e) => updateField('tujuanPenerima', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Kepala SMA Negeri 1 / Orang Tua Siswa"
            />
          </div>
        </div>
      </div>

      {/* 3. Section Data Spesifik: Siswa / Guru / Undangan */}
      {isStudentLetter && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              3. Data Peserta Didik (Siswa SMP)
            </label>

            {/* Quick Fill Student Sample */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 mr-1">Contoh Cepat:</span>
              {SAMPLE_STUDENTS.slice(0, 2).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => fillSampleStudent(idx)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded transition-colors"
                >
                  {s.nama.split(' ')[0]} ({s.kelas})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                value={formData.dataSiswa?.nama || ''}
                onChange={(e) => updateStudentField('nama', e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Ahmad Fauzan Pratama"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Kelas
              </label>
              <select
                value={formData.dataSiswa?.kelas || 'VII-A'}
                onChange={(e) => updateStudentField('kelas', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              >
                {['VII-A', 'VII-B', 'VII-C', 'VIII-A', 'VIII-B', 'VIII-C', 'IX-A', 'IX-B', 'IX-C'].map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                NISN (10 Digit)
              </label>
              <input
                type="text"
                value={formData.dataSiswa?.nisn || ''}
                onChange={(e) => updateStudentField('nisn', e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="0098451230"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                NIS Sekolah
              </label>
              <input
                type="text"
                value={formData.dataSiswa?.nis || ''}
                onChange={(e) => updateStudentField('nis', e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="232407001"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={formData.dataSiswa?.tempatLahir || ''}
                onChange={(e) => updateStudentField('tempatLahir', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Bogor"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.dataSiswa?.tanggalLahir || ''}
                onChange={(e) => updateStudentField('tanggalLahir', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Orang Tua / Wali
              </label>
              <input
                type="text"
                value={formData.dataSiswa?.namaOrangTua || ''}
                onChange={(e) => updateStudentField('namaOrangTua', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Ir. Hendra Pratama"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Pekerjaan Orang Tua
              </label>
              <input
                type="text"
                value={formData.dataSiswa?.pekerjaanOrangTua || ''}
                onChange={(e) => updateStudentField('pekerjaanOrangTua', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Karyawan Swasta / PNS / Wiraswasta"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Alamat Tinggal Siswa
            </label>
            <textarea
              rows={2}
              value={formData.dataSiswa?.alamatSiswa || ''}
              onChange={(e) => updateStudentField('alamatSiswa', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              placeholder="Jl. Melati No. 12, RT 03/RW 05, Kec. Cibinong, Kab. Bogor"
            />
          </div>
        </div>
      )}

      {/* 3B. Section Data Guru (Surat Tugas) */}
      {formData.jenis === 'surat_tugas' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              3. Data Guru / Tenaga Kependidikan Penerima Tugas
            </label>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 mr-1">Pilih Guru:</span>
              {SAMPLE_TEACHERS.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => fillSampleTeacher(idx)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded transition-colors"
                >
                  {t.nama.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Lengkap &amp; Gelar *
              </label>
              <input
                type="text"
                value={formData.dataGuru?.nama || ''}
                onChange={(e) => updateTeacherField('nama', e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Sri Wahyuningsih, S.Pd., M.Pd."
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                NIP Pegawai
              </label>
              <input
                type="text"
                value={formData.dataGuru?.nip || ''}
                onChange={(e) => updateTeacherField('nip', e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="19750819 200212 2 003"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Pangkat / Golongan Ruang
              </label>
              <input
                type="text"
                value={formData.dataGuru?.pangkatGolongan || ''}
                onChange={(e) => updateTeacherField('pangkatGolongan', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Pembina / IV/a"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Jabatan Dinas
              </label>
              <input
                type="text"
                value={formData.dataGuru?.jabatan || ''}
                onChange={(e) => updateTeacherField('jabatan', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Guru Madya / Pembina OSIS"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Rincian Tugas yang Diberikan *
            </label>
            <textarea
              rows={2}
              value={formData.dataGuru?.tugas || ''}
              onChange={(e) => updateTeacherField('tugas', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              placeholder="Mendampingi kontingen siswa dalam ajang OSN tingkat Kabupaten..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Lokasi / Tempat Tugas
              </label>
              <input
                type="text"
                value={formData.dataGuru?.tempatTugas || ''}
                onChange={(e) => updateTeacherField('tempatTugas', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Gedung BPMP / Dinas Pendidikan"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Mulai Tugas
              </label>
              <input
                type="date"
                value={formData.dataGuru?.waktuMulai || ''}
                onChange={(e) => updateTeacherField('waktuMulai', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Selesai Tugas
              </label>
              <input
                type="date"
                value={formData.dataGuru?.waktuSelesai || ''}
                onChange={(e) => updateTeacherField('waktuSelesai', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3C. Section Undangan Orang Tua */}
      {formData.jenis === 'undangan_ortu' && (
        <div className="space-y-3 bg-amber-50/50 p-3.5 rounded-lg border border-amber-200">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-700" />
            3. Rincian Agenda Undangan Rapat Orang Tua / Komite
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Hari / Tanggal Rapat
              </label>
              <input
                type="text"
                value={formData.dataUndangan?.hariTanggal || ''}
                onChange={(e) => updateUndanganField('hariTanggal', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Sabtu, 31 Oktober 2026"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={formData.dataUndangan?.waktu || ''}
                onChange={(e) => updateUndanganField('waktu', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="08.30 WIB s.d. Selesai"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Tempat / Ruangan
              </label>
              <input
                type="text"
                value={formData.dataUndangan?.tempat || ''}
                onChange={(e) => updateUndanganField('tempat', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Aula Utama SMPN 1 Cemerlang"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Agenda Acara / Pembahasan
            </label>
            <input
              type="text"
              value={formData.dataUndangan?.agenda || ''}
              onChange={(e) => updateUndanganField('agenda', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              placeholder="Laporan Hasil PTS, Pembahasan Program ANBK, dan Silaturahmi Komite..."
            />
          </div>
        </div>
      )}

      {/* 3D. Section Panggilan BK */}
      {formData.jenis === 'panggilan_bk' && (
        <div className="space-y-3 bg-red-50/50 p-3.5 rounded-lg border border-red-200">
          <label className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-red-700" />
            3. Detail Panggilan Bimbingan Konseling (BK)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Hari / Tanggal Pertemuan
              </label>
              <input
                type="text"
                value={formData.dataBK?.hariTanggalPanggilan || ''}
                onChange={(e) => updateBKField('hariTanggalPanggilan', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Senin, 02 November 2026"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Waktu &amp; Ruangan
              </label>
              <input
                type="text"
                value={formData.dataBK?.waktuPanggilan || ''}
                onChange={(e) => updateBKField('waktuPanggilan', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
                placeholder="Pukul 09.00 WIB di Ruang BK"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Catatan / Hal yang Perlu Dikonsultasikan
            </label>
            <input
              type="text"
              value={formData.dataBK?.masalah || ''}
              onChange={(e) => updateBKField('masalah', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              placeholder="Konsultasi Perkembangan Absensi &amp; Ketertiban Siswa"
            />
          </div>
        </div>
      )}

      {/* 4. Keperluan & Keterangan Akhir */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          4. Keperluan / Maksud Penerbitan Surat
        </label>
        <textarea
          rows={2}
          value={formData.keperluan}
          onChange={(e) => updateField('keperluan', e.target.value)}
          className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
          placeholder="Tuliskan tujuan formal diterbitkannya surat ini..."
        />
      </div>

      {/* 5. Tembusan Surat */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          5. Tembusan Surat (Opsional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tembusanInput}
            onChange={(e) => setTembusanInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTembusan();
              }
            }}
            placeholder="Tambah tembusan (contoh: Arsip Tata Usaha, Ketua Komite Sekolah)..."
            className="flex-1 text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addTembusan}
            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>

        {formData.tembusan && formData.tembusan.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {formData.tembusan.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeTembusan(idx)}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Surat akan disimpan ke Buku Agenda lokal dan disinkronkan ke Google Sheets Anda.
        </span>

        <button
          type="button"
          onClick={() => onSave(formData)}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Simpan ke Agenda &amp; Update Pratinjau
        </button>
      </div>
    </div>
  );
};
