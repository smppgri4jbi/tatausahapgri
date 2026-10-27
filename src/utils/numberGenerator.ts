import type { LetterType } from '../types';

export const ROMAN_MONTHS = [
  'I', 'II', 'III', 'IV', 'V', 'VI',
  'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
];

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_DAYS = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export function getClassificationCode(type: LetterType): string {
  switch (type) {
    case 'keterangan_aktif':
    case 'berkelakuan_baik':
    case 'dispensasi_kegiatan':
    case 'mutasi_keluar':
      return '421.3'; // Kesiswaan
    case 'surat_tugas':
      return '800'; // Kepegawaian
    case 'undangan_ortu':
      return '005'; // Undangan Kedinasan
    case 'panggilan_bk':
      return '421.7'; // Bimbingan & Konseling
    case 'surat_pengantar':
      return '045.2'; // Tata Naskah Pengantar
    default:
      return '421';
  }
}

export function padZero(num: number, size = 3): string {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const month = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatIndonesianDayDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const dayName = INDONESIAN_DAYS[date.getDay()];
  const day = date.getDate();
  const month = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

export function generateNomorSurat(
  type: LetterType,
  noUrut: number,
  kodeSekolah: string,
  dateString: string = new Date().toISOString()
): { nomorSurat: string; kodeKlasifikasi: string; bulanRomawi: string; tahun: number } {
  const d = new Date(dateString);
  const monthIndex = isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth();
  const tahun = isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  const bulanRomawi = ROMAN_MONTHS[monthIndex];
  const kodeKlasifikasi = getClassificationCode(type);
  const formattedNoUrut = padZero(noUrut, 3);
  const cleanKodeSekolah = kodeSekolah.trim() || 'SMP.01';

  // Format baku surat dinas Kemendikbud: 421.3/048/SMP.01/X/2026
  const nomorSurat = `${kodeKlasifikasi}/${formattedNoUrut}/${cleanKodeSekolah}/${bulanRomawi}/${tahun}`;

  return {
    nomorSurat,
    kodeKlasifikasi,
    bulanRomawi,
    tahun,
  };
}
