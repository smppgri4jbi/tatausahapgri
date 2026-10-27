export type LetterType =
  | 'keterangan_aktif'
  | 'berkelakuan_baik'
  | 'dispensasi_kegiatan'
  | 'mutasi_keluar'
  | 'surat_tugas'
  | 'undangan_ortu'
  | 'panggilan_bk'
  | 'surat_pengantar';

export interface SchoolProfile {
  pemerintahDaerah: string; // e.g. "PEMERINTAH KABUPATEN BOGOR"
  dinasPendidikan: string; // e.g. "DINAS PENDIDIKAN DAN KEBUDAYAAN"
  namaSekolah: string; // e.g. "SMP NEGERI 1 CEMERLANG"
  akreditasi: string; // e.g. "Akreditasi A"
  npsn: string;
  nss: string;
  alamat: string;
  kelurahanKecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kodeSuratSekolah: string; // e.g. "SMP.01"
  kepalaSekolah: {
    nama: string;
    nip: string;
    pangkatGolongan: string;
    jabatan: string;
  };
  logoPreset: 'tutwuri' | 'garuda' | 'kemenag' | 'custom';
  customLogoUrl?: string;
  logoKananPreset?: 'none' | 'garuda' | 'tutwuri' | 'pemda' | 'custom';
  customLogoKananUrl?: string;
  logoSize?: number; // size in pixels, default 85
  showStamp: boolean;
  showSignature: boolean;
  showQrCode: boolean;
}

export interface LetterRecord {
  id: string;
  nomorSurat: string;
  kodeKlasifikasi: string; // e.g. "421.3"
  noUrut: number;
  bulanRomawi: string;
  tahun: number;
  tanggalSurat: string; // YYYY-MM-DD
  kotaSurat: string;
  jenis: LetterType;
  perihal: string;
  lampiran: string;
  tujuanPenerima: string; // Kepada Yth...
  alamatPenerima?: string;
  
  // Dynamic fields depending on letter type
  dataSiswa?: {
    nama: string;
    nisn: string;
    nis: string;
    kelas: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: 'Laki-laki' | 'Perempuan';
    namaOrangTua: string;
    pekerjaanOrangTua?: string;
    alamatSiswa: string;
  };

  dataGuru?: {
    nama: string;
    nip: string;
    pangkatGolongan: string;
    jabatan: string;
    tugas: string;
    tempatTugas: string;
    waktuMulai: string;
    waktuSelesai: string;
  };

  dataKegiatan?: {
    namaKegiatan: string;
    penyelenggara: string;
    tingkat: string; // Sekolah / Kecamatan / Kabupaten / Provinsi / Nasional
    tempatKegiatan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
  };

  dataPindah?: {
    alasanPindah: string;
    sekolahTujuan: string;
    kabupatenKotaTujuan: string;
  };

  dataUndangan?: {
    hariTanggal: string;
    waktu: string;
    tempat: string;
    agenda: string;
  };

  dataBK?: {
    masalah: string;
    hariTanggalPanggilan: string;
    waktuPanggilan: string;
    ruangan: string;
    guruBK: string;
  };

  keperluan: string;
  keteranganTambahan?: string;
  tembusan?: string[];
  
  // Status
  createdAt: string;
  syncedToSheets: boolean;
  sheetsSpreadsheetId?: string;
  sheetRowIndex?: number;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}
