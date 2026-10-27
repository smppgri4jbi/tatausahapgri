import React from 'react';

export const TutWuriLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => (
  <svg
    viewBox="0 0 200 200"
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`flex-shrink-0 text-blue-900 ${className}`}
    fill="currentColor"
  >
    <circle cx="100" cy="100" r="95" fill="#f0f4f8" stroke="#1e3a8a" strokeWidth="4" />
    <circle cx="100" cy="100" r="82" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="3 3" />
    {/* Stylized Wings and Flame */}
    <path
      d="M100 25 L112 58 L126 50 L118 72 L138 72 L122 88 L142 98 L118 108 L126 128 L100 115 L74 128 L82 108 L58 98 L78 88 L62 72 L82 72 L74 50 L88 58 Z"
      fill="#b45309"
    />
    <circle cx="100" cy="80" r="14" fill="#dc2626" />
    {/* Open Book Foundation */}
    <path
      d="M50 145 C75 130 95 140 100 152 C105 140 125 130 150 145 C150 162 105 168 100 160 C95 168 50 162 50 145 Z"
      fill="#1e3a8a"
    />
    <path
      d="M55 148 C75 136 95 143 100 154 C105 143 125 136 145 148"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
    />
    <text
      x="100"
      y="180"
      textAnchor="middle"
      fontSize="12"
      fontWeight="bold"
      fill="#1e3a8a"
      fontFamily="Arial, sans-serif"
    >
      TUT WURI HANDAYANI
    </text>
  </svg>
);

export const GarudaLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => (
  <svg
    viewBox="0 0 120 120"
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`flex-shrink-0 text-amber-700 ${className}`}
    fill="currentColor"
  >
    <circle cx="60" cy="60" r="56" fill="#fffbeb" stroke="#b45309" strokeWidth="2.5" />
    {/* Stylized Garuda Wings & Shield */}
    <path
      d="M60 20 L70 36 L92 38 L80 54 L86 78 L60 66 L34 78 L40 54 L28 38 L50 36 Z"
      fill="#d97706"
      stroke="#78350f"
      strokeWidth="1.5"
    />
    {/* Shield in center */}
    <path
      d="M48 48 L72 48 L72 65 C72 73 60 78 60 78 C60 78 48 73 48 65 Z"
      fill="#dc2626"
      stroke="#1e293b"
      strokeWidth="1.5"
    />
    <circle cx="60" cy="58" r="4" fill="#fbbf24" />
    {/* Ribbon */}
    <rect x="35" y="86" width="50" height="12" rx="2" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
    <text
      x="60"
      y="95"
      textAnchor="middle"
      fontSize="6"
      fontWeight="bold"
      fill="#1e293b"
      fontFamily="Arial, sans-serif"
    >
      BHINNEKA TUNGGAL IKA
    </text>
  </svg>
);

export const KemenagLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => (
  <svg
    viewBox="0 0 120 120"
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`flex-shrink-0 text-emerald-800 ${className}`}
    fill="currentColor"
  >
    <circle cx="60" cy="60" r="56" fill="#f0fdf4" stroke="#047857" strokeWidth="2.5" />
    {/* Pentagon */}
    <polygon
      points="60,20 95,45 82,88 38,88 25,45"
      fill="#10b981"
      stroke="#065f46"
      strokeWidth="1.5"
    />
    {/* Scale of justice / Book */}
    <circle cx="60" cy="52" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
    <path
      d="M45 68 C55 64 60 67 60 67 C60 67 65 64 75 68 C75 75 60 78 60 78 C60 78 45 75 45 68 Z"
      fill="#ffffff"
      stroke="#065f46"
      strokeWidth="1"
    />
    {/* Ribbon */}
    <rect x="32" y="93" width="56" height="12" rx="2" fill="#ffffff" stroke="#047857" strokeWidth="1" />
    <text
      x="60"
      y="102"
      textAnchor="middle"
      fontSize="6"
      fontWeight="bold"
      fill="#047857"
      fontFamily="Arial, sans-serif"
    >
      IKHLAS BERAMAL
    </text>
  </svg>
);

export const PemdaBadgeLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => (
  <svg
    viewBox="0 0 100 100"
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`flex-shrink-0 text-blue-900 ${className}`}
    fill="currentColor"
  >
    <circle cx="50" cy="50" r="46" fill="#eff6ff" stroke="#1e3a8a" strokeWidth="2.5" />
    <polygon points="50,15 60,38 85,38 65,54 73,78 50,62 27,78 35,54 15,38 40,38" fill="#2563eb" />
    <circle cx="50" cy="50" r="12" fill="#f59e0b" />
    <text x="50" y="90" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1e3a8a">
      DINAS PENDIDIKAN
    </text>
  </svg>
);

interface RenderLogoProps {
  preset?: 'tutwuri' | 'garuda' | 'kemenag' | 'pemda' | 'custom' | 'none';
  customUrl?: string;
  size?: number;
  altText?: string;
}

export const SchoolLogoRenderer: React.FC<RenderLogoProps> = ({
  preset = 'tutwuri',
  customUrl,
  size = 85,
  altText = 'Logo',
}) => {
  if (preset === 'none') {
    return null;
  }

  if (preset === 'custom' || customUrl) {
    if (customUrl) {
      return (
        <div
          style={{ width: `${size}px`, height: `${size}px` }}
          className="flex-shrink-0 flex items-center justify-center overflow-hidden"
        >
          <img
            src={customUrl}
            alt={altText}
            style={{ maxHeight: `${size}px`, maxWidth: `${size}px` }}
            className="object-contain"
          />
        </div>
      );
    }
  }

  if (preset === 'garuda') {
    return <GarudaLogo size={size} />;
  }

  if (preset === 'kemenag') {
    return <KemenagLogo size={size} />;
  }

  if (preset === 'pemda') {
    return <PemdaBadgeLogo size={size} />;
  }

  // Default to Tut Wuri Handayani
  return <TutWuriLogo size={size} />;
};
