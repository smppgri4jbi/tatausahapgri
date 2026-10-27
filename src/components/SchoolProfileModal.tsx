import React, { useState, useRef } from 'react';
import type { SchoolProfile } from '../types';
import {
  Building2,
  X,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sliders,
  Check,
  Eye,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_SCHOOL_PROFILE } from '../data/defaultData';
import {
  SchoolLogoRenderer,
  TutWuriLogo,
  GarudaLogo,
  KemenagLogo,
  PemdaBadgeLogo,
} from './SchoolLogos';

interface Props {
  profile: SchoolProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: SchoolProfile) => void;
}

export const SchoolProfileModal: React.FC<Props> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const leftFileInputRef = useRef<HTMLInputElement>(null);
  const rightFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof SchoolProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleKepsekChange = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      kepalaSekolah: {
        ...prev.kepalaSekolah,
        [field]: val,
      },
    }));
  };

  // Upload Left Logo from local file
  const handleUploadLeftLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          logoPreset: 'custom',
          customLogoUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Right Logo from local file
  const handleUploadRightLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          logoKananPreset: 'custom',
          customLogoKananUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoPreset: 'tutwuri',
      customLogoUrl: undefined,
    }));
    if (leftFileInputRef.current) leftFileInputRef.current.value = '';
  };

  const handleRemoveCustomLogoKanan = () => {
    setFormData((prev) => ({
      ...prev,
      logoKananPreset: 'none',
      customLogoKananUrl: undefined,
    }));
    if (rightFileInputRef.current) rightFileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleResetDefault = () => {
    setFormData(DEFAULT_SCHOOL_PROFILE);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Pengaturan Profil Sekolah &amp; Logo Kop Surat
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

        {/* Real-time Kop Mini Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Pratinjau Langsung Kop Surat
            </span>
            <span className="text-slate-400 font-normal">Ukuran Logo: {formData.logoSize || 85}px</span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-2xs font-formal text-center">
            <div className="flex items-center justify-between gap-3">
              {/* Left Logo */}
              <div
                style={{ width: `${formData.logoSize || 85}px`, minWidth: `${formData.logoSize || 85}px` }}
                className="flex items-center justify-center flex-shrink-0"
              >
                <SchoolLogoRenderer
                  preset={formData.logoPreset}
                  customUrl={formData.customLogoUrl}
                  size={formData.logoSize || 85}
                  altText="Logo Kiri"
                />
              </div>

              {/* Text */}
              <div className="flex-1 text-black">
                <p className="text-[10px] sm:text-xs font-bold uppercase">{formData.pemerintahDaerah}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase">{formData.dinasPendidikan}</p>
                <p className="text-sm sm:text-base font-extrabold uppercase my-0.5">{formData.namaSekolah}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-700 italic">
                  NPSN: {formData.npsn} | {formData.akreditasi}
                </p>
                <p className="text-[9px] text-gray-600">
                  {formData.alamat}, {formData.kabupatenKota}
                </p>
              </div>

              {/* Right Logo */}
              <div
                style={{ width: `${formData.logoSize || 85}px`, minWidth: `${formData.logoSize || 85}px` }}
                className="flex items-center justify-center flex-shrink-0"
              >
                {formData.logoKananPreset && formData.logoKananPreset !== 'none' ? (
                  <SchoolLogoRenderer
                    preset={formData.logoKananPreset}
                    customUrl={formData.customLogoKananUrl}
                    size={formData.logoSize || 85}
                    altText="Logo Kanan"
                  />
                ) : (
                  <div style={{ width: `${formData.logoSize || 85}px` }} />
                )}
              </div>
            </div>
            {/* Kop line */}
            <div className="mt-2 border-b-[2px] border-black w-full" />
            <div className="mt-[1px] border-b-[1px] border-black w-full" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* SECTION 1: LOGO SEKOLAH (FITUR UTAMA YANG DIMINTA) */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                1. Konfigurasi Logo Utama Sekolah (Sisi Kiri)
              </h4>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
                Kop Surat
              </span>
            </div>

            {/* Logo Presets Selection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Option 1: Tut Wuri */}
              <div
                onClick={() => handleChange('logoPreset', 'tutwuri')}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-between gap-2 ${
                  formData.logoPreset === 'tutwuri'
                    ? 'border-blue-600 bg-white shadow-xs ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="h-14 flex items-center justify-center">
                  <TutWuriLogo size={48} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Tut Wuri Handayani</p>
                  <p className="text-[10px] text-slate-500">Resmi Kemendikbud</p>
                </div>
              </div>

              {/* Option 2: Garuda Pancasila */}
              <div
                onClick={() => handleChange('logoPreset', 'garuda')}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-between gap-2 ${
                  formData.logoPreset === 'garuda'
                    ? 'border-blue-600 bg-white shadow-xs ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="h-14 flex items-center justify-center">
                  <GarudaLogo size={48} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Garuda Pancasila</p>
                  <p className="text-[10px] text-slate-500">Lambang Negara</p>
                </div>
              </div>

              {/* Option 3: Kemenag */}
              <div
                onClick={() => handleChange('logoPreset', 'kemenag')}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-between gap-2 ${
                  formData.logoPreset === 'kemenag'
                    ? 'border-blue-600 bg-white shadow-xs ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="h-14 flex items-center justify-center">
                  <KemenagLogo size={48} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Ikhlas Beramal</p>
                  <p className="text-[10px] text-slate-500">Kemenag / MTs</p>
                </div>
              </div>

              {/* Option 4: Custom Upload */}
              <div
                onClick={() => {
                  handleChange('logoPreset', 'custom');
                  if (!formData.customLogoUrl) {
                    leftFileInputRef.current?.click();
                  }
                }}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-between gap-2 ${
                  formData.logoPreset === 'custom'
                    ? 'border-blue-600 bg-white shadow-xs ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="h-14 flex items-center justify-center">
                  {formData.customLogoUrl ? (
                    <img
                      src={formData.customLogoUrl}
                      alt="Logo Kustom"
                      className="max-h-12 max-w-12 object-contain"
                    />
                  ) : (
                    <Upload className="w-7 h-7 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Logo Kustom</p>
                  <p className="text-[10px] text-slate-500">Unggah Gambar</p>
                </div>
              </div>
            </div>

            {/* Custom Upload Controls Box */}
            <div className="bg-white rounded-lg p-3.5 border border-blue-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <label className="block font-bold text-slate-800 text-xs">
                    Unggah File Logo Resmi Sekolah
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Mendukung format PNG transparan, JPG, SVG, atau WebP (maks. 2MB).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={leftFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleUploadLeftLogo}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => leftFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Pilih File Logo...
                  </button>

                  {formData.customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomLogo}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Logo Kustom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Direct URL input fallback */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Atau Tempel Tautan / URL Logo Online (Opsional):
                </label>
                <input
                  type="url"
                  value={formData.customLogoUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      logoPreset: val ? 'custom' : 'tutwuri',
                      customLogoUrl: val || undefined,
                    }));
                  }}
                  placeholder="https://contoh-domain.sch.id/logo-smp.png"
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Slider Ukuran Logo */}
            <div className="bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Ukuran Logo Kop Surat</p>
                  <p className="text-[10px] text-slate-500">Sesuaikan proporsi logo dengan panjang nama sekolah</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="65"
                  max="115"
                  step="5"
                  value={formData.logoSize || 85}
                  onChange={(e) => handleChange('logoSize', Number(e.target.value))}
                  className="w-32 accent-blue-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-slate-800 text-xs w-12 text-right">
                  {formData.logoSize || 85} px
                </span>
              </div>
            </div>

            {/* Option for Right Logo (Logo Sekunder) */}
            <div className="space-y-2 pt-1 border-t border-blue-100">
              <label className="block font-bold text-slate-800 text-xs">
                Logo Sekunder (Sisi Kanan Kop Surat)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Tidak Ada (Polos)' },
                  { id: 'garuda', label: 'Garuda Pancasila' },
                  { id: 'pemda', label: 'Logo Daerah / Pemda' },
                  { id: 'tutwuri', label: 'Tut Wuri Handayani' },
                  { id: 'custom', label: 'Unggah Kustom' },
                ].map((item) => {
                  const isSelected = (formData.logoKananPreset || 'garuda') === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleChange('logoKananPreset', item.id);
                        if (item.id === 'custom' && !formData.customLogoKananUrl) {
                          rightFileInputRef.current?.click();
                        }
                      }}
                      className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-white font-bold text-blue-900 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                      }`}
                    >
                      <span className="text-[11px] block">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {formData.logoKananPreset === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={rightFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleUploadRightLogo}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => rightFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    Pilih File Logo Kanan...
                  </button>
                  {formData.customLogoKananUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomLogoKanan}
                      className="text-red-600 hover:text-red-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: IDENTITAS KOP SURAT TEKS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Teks Identitas Instansi &amp; Satuan Pendidikan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Pemerintah Daerah (Tingkat I / II)
                </label>
                <input
                  type="text"
                  value={formData.pemerintahDaerah}
                  onChange={(e) => handleChange('pemerintahDaerah', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Dinas Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.dinasPendidikan}
                  onChange={(e) => handleChange('dinasPendidikan', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-600 mb-1">
                  Nama Resmi Sekolah (SMP) *
                </label>
                <input
                  type="text"
                  value={formData.namaSekolah}
                  onChange={(e) => handleChange('namaSekolah', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Kode Singkat Surat
                </label>
                <input
                  type="text"
                  value={formData.kodeSuratSekolah}
                  onChange={(e) => handleChange('kodeSuratSekolah', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  placeholder="SMP.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => handleChange('npsn', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">NSS</label>
                <input
                  type="text"
                  value={formData.nss}
                  onChange={(e) => handleChange('nss', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Akreditasi</label>
                <input
                  type="text"
                  value={formData.akreditasi}
                  onChange={(e) => handleChange('akreditasi', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Alamat Jalan
                </label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => handleChange('alamat', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Kecamatan / Kelurahan
                </label>
                <input
                  type="text"
                  value={formData.kelurahanKecamatan}
                  onChange={(e) => handleChange('kelurahanKecamatan', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Kabupaten / Kota
                </label>
                <input
                  type="text"
                  value={formData.kabupatenKota}
                  onChange={(e) => handleChange('kabupatenKota', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Telepon</label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => handleChange('telepon', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => handleChange('kodePos', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PENANDATANGAN KEPALA SEKOLAH */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              3. Penandatangan Resmi (Kepala Sekolah)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Nama Kepala Sekolah &amp; Gelar *
                </label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.nama}
                  onChange={(e) => handleKepsekChange('nama', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.nip}
                  onChange={(e) => handleKepsekChange('nip', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Pangkat / Golongan Ruang
                </label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.pangkatGolongan}
                  onChange={(e) => handleKepsekChange('pangkatGolongan', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                  placeholder="Pembina Tk. I / IV/b"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Jabatan Formal
                </label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.jabatan}
                  onChange={(e) => handleKepsekChange('jabatan', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2"
                  placeholder="Kepala Sekolah"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Kembalikan Preset Awal
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Profil &amp; Logo Baru
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
