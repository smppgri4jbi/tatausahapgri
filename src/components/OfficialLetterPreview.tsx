import React from 'react';
import type { SchoolProfile, LetterRecord } from '../types';
import { formatIndonesianDate } from '../utils/numberGenerator';
import { Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { SchoolLogoRenderer } from './SchoolLogos';

interface Props {
  letter: LetterRecord;
  profile: SchoolProfile;
  onPrint?: () => void;
  showKop?: boolean;
  showSignature?: boolean;
  showStamp?: boolean;
  showQr?: boolean;
}

export const OfficialLetterPreview: React.FC<Props> = ({
  letter,
  profile,
  onPrint,
  showKop = true,
  showSignature = true,
  showStamp = true,
  showQr = true,
}) => {
  const isKeterangan = [
    'keterangan_aktif',
    'berkelakuan_baik',
    'dispensasi_kegiatan',
    'mutasi_keluar',
  ].includes(letter.jenis);

  const isSuratTugas = letter.jenis === 'surat_tugas';
  const isUndangan = letter.jenis === 'undangan_ortu' || letter.jenis === 'panggilan_bk';

  const getLetterTitle = () => {
    switch (letter.jenis) {
      case 'keterangan_aktif':
        return 'SURAT KETERANGAN AKTIF BELAJAR';
      case 'berkelakuan_baik':
        return 'SURAT KETERANGAN BERKELAKUAN BAIK (SKKB)';
      case 'dispensasi_kegiatan':
        return 'SURAT DISPENSASI SISWA';
      case 'mutasi_keluar':
        return 'SURAT KETERANGAN PINDAH SEKOLAH';
      case 'surat_tugas':
        return 'SURAT PERINTAH TUGAS';
      case 'undangan_ortu':
        return 'SURAT UNDANGAN ORANG TUA / WALI';
      case 'panggilan_bk':
        return 'SURAT PANGGILAN ORANG TUA / WALI (BK)';
      case 'surat_pengantar':
        return 'SURAT PENGANTAR DINAS';
      default:
        return 'SURAT RESMI SEKOLAH';
    }
  };

  return (
    <div className="letter-preview-container flex flex-col items-center">
      {/* Visual A4 Paper Container */}
      <div
        id="printable-letter-sheet"
        className="letter-paper w-full max-w-[210mm] min-h-[297mm] bg-white text-black font-formal p-8 sm:p-12 shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-0 relative flex flex-col justify-between"
        style={{ boxSizing: 'border-box' }}
      >
        {/* TOP SECTION: KOP SURAT DINAS */}
        <div>
          {showKop && (
            <div className="mb-4">
              <div className="flex items-center justify-between gap-4 pb-2">
                {/* Logo Utama Kiri (Logo Sekolah / Tut Wuri / Kemenag / Kustom) */}
                <div
                  style={{ width: `${profile.logoSize || 85}px`, minWidth: `${profile.logoSize || 85}px` }}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  <SchoolLogoRenderer
                    preset={profile.logoPreset || 'tutwuri'}
                    customUrl={profile.customLogoUrl}
                    size={profile.logoSize || 85}
                    altText="Logo Sekolah"
                  />
                </div>

                {/* Kop Text */}
                <div className="flex-1 text-center">
                  <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black leading-tight">
                    {profile.pemerintahDaerah}
                  </h3>
                  <h4 className="text-xs sm:text-sm font-bold uppercase text-black leading-tight">
                    {profile.dinasPendidikan}
                  </h4>
                  <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-black my-0.5">
                    {profile.namaSekolah}
                  </h2>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800 italic">
                    NPSN: {profile.npsn} | NSS: {profile.nss} | {profile.akreditasi}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-800 leading-snug">
                    {profile.alamat}, {profile.kelurahanKecamatan}, {profile.kabupatenKota}, {profile.provinsi} {profile.kodePos}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-800 leading-snug">
                    Telp: {profile.telepon} | Pos-el: {profile.email} | Laman: {profile.website}
                  </p>
                </div>

                {/* Logo Kanan (Logo Daerah / Garuda / SMP Bisa / Kustom / Kosong seimbang) */}
                <div
                  style={{ width: `${profile.logoSize || 85}px`, minWidth: `${profile.logoSize || 85}px` }}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  {profile.logoKananPreset && profile.logoKananPreset !== 'none' ? (
                    <SchoolLogoRenderer
                      preset={profile.logoKananPreset}
                      customUrl={profile.customLogoKananUrl}
                      size={profile.logoSize || 85}
                      altText="Logo Sekunder"
                    />
                  ) : (
                    /* Invisible balance placeholder so title remains mathematically centered */
                    <div style={{ width: `${profile.logoSize || 85}px` }} />
                  )}
                </div>
              </div>

              {/* Official Double Border Underline (Dinas Line) */}
              <div className="w-full mt-1">
                <div className="border-b-[3px] border-black w-full" />
                <div className="border-b-[1px] border-black w-full mt-[2px]" />
              </div>
            </div>
          )}

          {/* LETTER BODY CONTENT */}
          <div className="text-[13px] sm:text-[14px] leading-relaxed text-black mt-4">
            {/* FORMAT A: SURAT KETERANGAN / MUTASI / SKKB */}
            {isKeterangan && (
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-base sm:text-lg font-bold underline uppercase tracking-wider inline-block">
                    {getLetterTitle()}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold mt-1">
                    Nomor: {letter.nomorSurat}
                  </p>
                </div>

                <p className="mb-3 text-justify indent-8">
                  Yang bertanda tangan di bawah ini Kepala {profile.namaSekolah}, {profile.kabupatenKota}, menerangkan dengan sesungguhnya bahwa:
                </p>

                {/* Data Siswa Table */}
                {letter.dataSiswa && (
                  <div className="my-3 pl-6 pr-2">
                    <table className="w-full text-left text-[13px] sm:text-[14px] border-collapse">
                      <tbody>
                        <tr className="align-top">
                          <td className="w-44 py-1">Nama Lengkap</td>
                          <td className="w-4 py-1">:</td>
                          <td className="font-bold py-1 uppercase">{letter.dataSiswa.nama}</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-1">NISN / NIS</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{letter.dataSiswa.nisn} / {letter.dataSiswa.nis}</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-1">Tempat, Tanggal Lahir</td>
                          <td className="py-1">:</td>
                          <td className="py-1">
                            {letter.dataSiswa.tempatLahir}, {formatIndonesianDate(letter.dataSiswa.tanggalLahir)}
                          </td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-1">Jenis Kelamin</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{letter.dataSiswa.jenisKelamin}</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-1">Tingkat / Kelas</td>
                          <td className="py-1">:</td>
                          <td className="font-semibold py-1">Kelas {letter.dataSiswa.kelas}</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-1">Nama Orang Tua / Wali</td>
                          <td className="py-1">:</td>
                          <td className="py-1">{letter.dataSiswa.namaOrangTua}</td>
                        </tr>
                        {letter.dataSiswa.pekerjaanOrangTua && (
                          <tr className="align-top">
                            <td className="py-1">Pekerjaan Orang Tua</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{letter.dataSiswa.pekerjaanOrangTua}</td>
                          </tr>
                        )}
                        <tr className="align-top">
                          <td className="py-1">Alamat Tinggal</td>
                          <td className="py-1">:</td>
                          <td className="py-1 text-justify">{letter.dataSiswa.alamatSiswa}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Substantive statement */}
                <div className="my-4 space-y-3 text-justify">
                  {letter.jenis === 'keterangan_aktif' && (
                    <p className="indent-8">
                      Adalah benar yang bersangkutan merupakan peserta didik yang tercatat aktif belajar pada{' '}
                      <strong>{profile.namaSekolah}</strong> pada Semester Ganjil/Genap Tahun Pelajaran 2026/2027.
                    </p>
                  )}

                  {letter.jenis === 'berkelakuan_baik' && (
                    <p className="indent-8">
                      Berdasarkan catatan tata tertib dan bimbingan konseling pada sekolah kami, peserta didik tersebut selama belajar di{' '}
                      <strong>{profile.namaSekolah}</strong> senantiasa <strong>berkelakuan baik</strong>, tidak pernah terlibat tindak pidana, tawuran, maupun penyalahgunaan narkotika, serta patuh terhadap peraturan tata tertib sekolah.
                    </p>
                  )}

                  {letter.jenis === 'dispensasi_kegiatan' && (
                    <>
                      <p className="indent-8">
                        Diberikan izin dan dispensasi untuk tidak mengikuti kegiatan belajar mengajar (KBM) sementara waktu sehubungan dengan keikutsertaannya dalam mewakili sekolah pada kegiatan:
                      </p>
                      {letter.dataKegiatan && (
                        <div className="pl-6 border-l-2 border-slate-300 my-2 text-[13px]">
                          <p><strong>Kegiatan:</strong> {letter.dataKegiatan.namaKegiatan}</p>
                          <p><strong>Penyelenggara / Tingkat:</strong> {letter.dataKegiatan.penyelenggara} ({letter.dataKegiatan.tingkat})</p>
                          <p><strong>Tempat:</strong> {letter.dataKegiatan.tempatKegiatan}</p>
                          <p><strong>Waktu Pelaksanaan:</strong> {formatIndonesianDate(letter.dataKegiatan.tanggalMulai)} s.d. {formatIndonesianDate(letter.dataKegiatan.tanggalSelesai)}</p>
                        </div>
                      )}
                    </>
                  )}

                  {letter.jenis === 'mutasi_keluar' && (
                    <>
                      <p className="indent-8">
                        Telah mengajukan permohonan pindah sekolah (mutasi keluar) atas permohonan orang tua/wali murid dengan alasan:{' '}
                        <em>{letter.dataPindah?.alasanPindah || 'Mengikuti kepindahan tugas orang tua'}</em>.
                      </p>
                      <div className="pl-6 border-l-2 border-slate-300 my-2 text-[13px]">
                        <p><strong>Sekolah Tujuan:</strong> {letter.dataPindah?.sekolahTujuan || '-'}</p>
                        <p><strong>Kabupaten / Kota:</strong> {letter.dataPindah?.kabupatenKotaTujuan || '-'}</p>
                      </div>
                      <p className="indent-8">
                        Selama menjadi siswa di {profile.namaSekolah}, yang bersangkutan telah memenuhi kewajiban administrasi akademik dan kesiswaan.
                      </p>
                    </>
                  )}

                  <p className="indent-8">
                    Surat keterangan ini diterbitkan untuk keperluan:{' '}
                    <strong>{letter.keperluan}</strong>.
                  </p>

                  <p className="indent-8">
                    {letter.keteranganTambahan ||
                      'Demikian surat keterangan ini dibuat dengan sebenarnya dan penuh rasa tanggung jawab agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.'}
                  </p>
                </div>
              </div>
            )}

            {/* FORMAT B: SURAT PERINTAH TUGAS GURU / TENDIK */}
            {isSuratTugas && (
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-base sm:text-lg font-bold underline uppercase tracking-wider inline-block">
                    {getLetterTitle()}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold mt-1">
                    Nomor: {letter.nomorSurat}
                  </p>
                </div>

                <div className="my-3 pl-4">
                  <table className="w-full text-left text-[13px] sm:text-[14px]">
                    <tbody>
                      <tr className="align-top">
                        <td className="w-28 font-bold py-1">Dasar</td>
                        <td className="w-4 py-1">:</td>
                        <td className="py-1 text-justify">
                          Program Kerja Sekolah Tahun Anggaran 2026/2027 dan Surat Edaran / Disposisi Dinas Pendidikan mengenai peningkatan kompetensi dan partisipasi kegiatan kependidikan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center my-4 font-bold tracking-widest uppercase text-sm">
                  MEMERINTAHKAN:
                </div>

                <div className="my-2 pl-4">
                  <table className="w-full text-left text-[13px] sm:text-[14px]">
                    <tbody>
                      <tr className="align-top">
                        <td className="w-28 font-bold py-1">Kepada</td>
                        <td className="w-4 py-1">:</td>
                        <td className="py-1">
                          {letter.dataGuru ? (
                            <div>
                              <p className="font-bold text-[14px] uppercase">{letter.dataGuru.nama}</p>
                              <p className="text-xs text-gray-700">NIP. {letter.dataGuru.nip}</p>
                              <p className="text-xs text-gray-700">Pangkat/Gol: {letter.dataGuru.pangkatGolongan}</p>
                              <p className="text-xs text-gray-700">Jabatan: {letter.dataGuru.jabatan}</p>
                            </div>
                          ) : (
                            <p>Nama Guru / Pegawai Terlampir</p>
                          )}
                        </td>
                      </tr>
                      <tr className="align-top">
                        <td className="font-bold py-2">Untuk</td>
                        <td className="py-2">:</td>
                        <td className="py-2 text-justify">
                          <ol className="list-decimal list-outside pl-4 space-y-1">
                            <li>
                              {letter.dataGuru?.tugas || letter.keperluan || 'Melaksanakan tugas kedinasan sesuai dengan arahan Kepala Sekolah.'}
                            </li>
                            {letter.dataGuru?.tempatTugas && (
                              <li>
                                Bertempat di: <strong>{letter.dataGuru.tempatTugas}</strong>.
                              </li>
                            )}
                            {letter.dataGuru?.waktuMulai && (
                              <li>
                                Waktu pelaksanaan:{' '}
                                <strong>
                                  {formatIndonesianDate(letter.dataGuru.waktuMulai)}
                                  {letter.dataGuru.waktuSelesai && letter.dataGuru.waktuSelesai !== letter.dataGuru.waktuMulai
                                    ? ` s.d. ${formatIndonesianDate(letter.dataGuru.waktuSelesai)}`
                                    : ''}
                                </strong>.
                              </li>
                            )}
                            <li>
                              Melaksanakan tugas kedinasan ini dengan penuh rasa disiplin dan tanggung jawab.
                            </li>
                            <li>
                              Melaporkan hasil pelaksanaan tugas kedinasan secara tertulis kepada Kepala Sekolah setelah selesai kegiatan.
                            </li>
                          </ol>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 indent-8 text-justify">
                  Demikian surat perintah tugas ini diberikan kepada yang bersangkutan untuk dilaksanakan sebaik-baiknya.
                </p>
              </div>
            )}

            {/* FORMAT C: SURAT UNDANGAN / PANGGILAN ORANG TUA / PENGANTAR */}
            {(isUndangan || letter.jenis === 'surat_pengantar') && (
              <div>
                {/* Meta header: Nomor, Lampiran, Hal & Tanggal */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-1/2">
                    <table className="text-left text-[13px] sm:text-[14px]">
                      <tbody>
                        <tr>
                          <td className="w-20 font-medium">Nomor</td>
                          <td className="w-3">:</td>
                          <td className="font-semibold">{letter.nomorSurat}</td>
                        </tr>
                        <tr>
                          <td className="font-medium">Lampiran</td>
                          <td className="w-3">:</td>
                          <td>{letter.lampiran || '-'}</td>
                        </tr>
                        <tr>
                          <td className="font-medium align-top">Hal</td>
                          <td className="w-3 align-top">:</td>
                          <td className="font-bold align-top">{letter.perihal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-right">
                    <p className="text-[13px] sm:text-[14px]">
                      {letter.kotaSurat || profile.kabupatenKota.replace('Kabupaten ', '').replace('Kota ', '')},{' '}
                      {formatIndonesianDate(letter.tanggalSurat)}
                    </p>
                  </div>
                </div>

                {/* Recipient info */}
                <div className="mb-6 pl-1">
                  <p>Kepada Yth.</p>
                  <p className="font-bold text-[14px]">{letter.tujuanPenerima}</p>
                  {letter.alamatPenerima ? (
                    <p>{letter.alamatPenerima}</p>
                  ) : (
                    <p>di Tempat</p>
                  )}
                </div>

                {/* Body Paragraph */}
                <div className="space-y-3 text-justify">
                  <p className="indent-8">Dengan hormat,</p>
                  <p className="indent-8">
                    {letter.jenis === 'panggilan_bk'
                      ? 'Sehubungan dengan adanya beberapa hal penting yang perlu dikoordinasikan dan dibicarakan bersama pihak sekolah terkait perkembangan peserta didik kami:'
                      : 'Dalam rangka mempererat komunikasi serta kelancaran program pendidikan di lingkungan sekolah, dengan ini Kepala SMP Negeri 1 Cemerlang Mandiri mengundang Bapak/Ibu untuk berkenan hadir pada:'}
                  </p>

                  {/* Student info if BK call */}
                  {letter.jenis === 'panggilan_bk' && letter.dataSiswa && (
                    <div className="pl-8 my-2">
                      <table className="text-[13px]">
                        <tbody>
                          <tr>
                            <td className="w-36">Nama Siswa</td>
                            <td className="w-4">:</td>
                            <td className="font-bold">{letter.dataSiswa.nama}</td>
                          </tr>
                          <tr>
                            <td>Kelas</td>
                            <td className="w-4">:</td>
                            <td>{letter.dataSiswa.kelas}</td>
                          </tr>
                          <tr>
                            <td>Permasalahan/Hal</td>
                            <td className="w-4">:</td>
                            <td className="italic text-gray-800">{letter.dataBK?.masalah || 'Konsultasi Akademik & Tata Tertib'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Event schedule details */}
                  {letter.dataUndangan && (
                    <div className="pl-8 my-3 space-y-1 bg-slate-50/50 p-3 border-l-2 border-black print:bg-transparent">
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Hari / Tanggal</span>
                        <span>:</span>
                        <span>{letter.dataUndangan.hariTanggal}</span>
                      </div>
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Waktu</span>
                        <span>:</span>
                        <span>{letter.dataUndangan.waktu}</span>
                      </div>
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Tempat</span>
                        <span>:</span>
                        <span>{letter.dataUndangan.tempat}</span>
                      </div>
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Acara / Agenda</span>
                        <span>:</span>
                        <span className="font-bold">{letter.dataUndangan.agenda}</span>
                      </div>
                    </div>
                  )}

                  {letter.jenis === 'panggilan_bk' && letter.dataBK && (
                    <div className="pl-8 my-3 space-y-1 border-l-2 border-black">
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Hari / Tanggal</span>
                        <span>:</span>
                        <span>{letter.dataBK.hariTanggalPanggilan}</span>
                      </div>
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Waktu</span>
                        <span>:</span>
                        <span>{letter.dataBK.waktuPanggilan}</span>
                      </div>
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Tempat</span>
                        <span>:</span>
                        <span>{letter.dataBK.ruangan || 'Ruang Bimbingan dan Konseling (BK)'}</span>
                      </div>
                      <div className="grid grid-cols-[130px_15px_1fr] text-[13px] sm:text-[14px]">
                        <span className="font-semibold">Menemui</span>
                        <span>:</span>
                        <span>{letter.dataBK.guruBK || 'Guru BK / Wali Kelas'}</span>
                      </div>
                    </div>
                  )}

                  <p className="indent-8">
                    {letter.keperluan ||
                      'Mengingat pentingnya agenda tersebut di atas, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktu yang telah ditentukan.'}
                  </p>

                  <p className="indent-8">
                    Demikian surat undangan ini kami sampaikan, atas perhatian dan kerjasama Bapak/Ibu kami haturkan terima kasih.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: TANDA TANGAN, CAP STEMPEL & QR VALIDASI */}
        <div className="mt-8 pt-4">
          <div className="flex justify-between items-end">
            {/* Left: Tembusan & QR Code Verifikasi */}
            <div className="w-1/2 text-left">
              {showQr && (
                <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-300 rounded print:border-none print:bg-transparent print:p-0 max-w-xs mb-3">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white border border-slate-400 p-0.5">
                    {/* Authentic mini SVG QR Code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" />
                      
                      <rect x="70" y="0" width="30" height="30" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" />

                      <rect x="0" y="70" width="30" height="30" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" />

                      <rect x="40" y="10" width="10" height="10" />
                      <rect x="50" y="20" width="10" height="10" />
                      <rect x="40" y="30" width="20" height="10" />
                      <rect x="10" y="40" width="15" height="10" />
                      <rect x="35" y="50" width="15" height="15" />
                      <rect x="60" y="45" width="10" height="20" />
                      <rect x="75" y="40" width="20" height="10" />
                      <rect x="75" y="65" width="15" height="15" />
                      <rect x="45" y="75" width="20" height="15" />
                    </svg>
                  </div>
                  <div className="text-[9px] leading-tight text-gray-700">
                    <p className="font-bold uppercase tracking-wider text-black">Verifikasi Dokumen</p>
                    <p>Sistem Administrasi {profile.namaSekolah}</p>
                    <p className="text-[8px] font-mono text-gray-500">ID: {letter.id}</p>
                  </div>
                </div>
              )}

              {letter.tembusan && letter.tembusan.length > 0 && (
                <div className="text-[11px] leading-normal text-gray-800">
                  <p className="font-semibold underline">Tembusan Yth:</p>
                  <ol className="list-decimal list-outside pl-4">
                    {letter.tembusan.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Right: Signature & Stamp block */}
            <div className="w-56 sm:w-64 text-left relative">
              <p className="text-[13px] sm:text-[14px]">
                {isKeterangan || isSuratTugas ? (
                  <span>
                    Ditetapkan di: {letter.kotaSurat || 'Bogor'}
                    <br />
                    Pada tanggal: {formatIndonesianDate(letter.tanggalSurat)}
                  </span>
                ) : (
                  <span>Kepala Sekolah,</span>
                )}
              </p>

              {(isKeterangan || isSuratTugas) && (
                <p className="text-[13px] sm:text-[14px] font-semibold mt-1">
                  {profile.kepalaSekolah.jabatan},
                </p>
              )}

              {/* Signature + Authentic Stamp Container */}
              <div className="h-24 relative flex items-center">
                {/* Official Stamp (Cap Dinas Stempel Sekolah) */}
                {showStamp && (
                  <div
                    className="absolute -left-6 top-1 pointer-events-none select-none z-10 opacity-85 rotate-[-12deg]"
                    style={{ width: '110px', height: '110px' }}
                  >
                    <svg viewBox="0 0 120 120" className="w-full h-full text-indigo-700" fill="none">
                      {/* Outer double circle */}
                      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="60" cy="60" r="49" stroke="currentColor" strokeWidth="1" />
                      
                      {/* Circular Text paths */}
                      <path id="stamp-curve-top" d="M 16,60 A 44,44 0 0,1 104,60" fill="none" />
                      <path id="stamp-curve-bot" d="M 104,60 A 44,44 0 0,1 16,60" fill="none" />

                      <text fill="currentColor" fontSize="7.5" fontWeight="bold" letterSpacing="0.8">
                        <textPath href="#stamp-curve-top" startOffset="50%" textAnchor="middle">
                          DINAS PENDIDIKAN &amp; KEBUDAYAAN
                        </textPath>
                      </text>

                      <text fill="currentColor" fontSize="7.5" fontWeight="bold" letterSpacing="0.8">
                        <textPath href="#stamp-curve-bot" startOffset="50%" textAnchor="middle">
                          {profile.namaSekolah.toUpperCase()}
                        </textPath>
                      </text>

                      {/* Center Star and Label */}
                      <polygon points="60,35 63,42 70,42 65,47 67,54 60,50 53,54 55,47 50,42 57,42" fill="currentColor" />
                      <text x="60" y="65" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="extrabold">
                        SEKOLAH
                      </text>
                      <text x="60" y="74" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold">
                        SMP
                      </text>
                      <line x1="32" y1="58" x2="88" y2="58" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="32" y1="78" x2="88" y2="78" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
                    </svg>
                  </div>
                )}

                {/* Digital Signature */}
                {showSignature && (
                  <div className="absolute left-6 top-2 z-0">
                    <svg viewBox="0 0 200 80" className="w-36 h-16 text-blue-950" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 20 50 Q 40 10 70 30 T 110 50 Q 130 15 150 45 T 180 50" />
                      <path d="M 40 40 Q 60 70 100 65 Q 140 60 170 35" strokeWidth="1.8" />
                      <path d="M 120 40 L 145 65" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Headmaster Name & NIP */}
              <div className="relative z-20">
                <p className="font-bold underline text-[14px] uppercase text-black tracking-wide">
                  {profile.kepalaSekolah.nama}
                </p>
                <p className="text-[12px] text-gray-900">
                  NIP. {profile.kepalaSekolah.nip}
                </p>
                <p className="text-[11px] text-gray-700">
                  {profile.kepalaSekolah.pangkatGolongan}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
