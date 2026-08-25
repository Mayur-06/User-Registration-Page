import React from 'react';

export const Logo = ({
  size = 'md',
  showText = true,
  withBadge = true,
  className = '',
  textClassName = '',
  onClick,
}) => {
  // Proportional sizing scale
  const sizeMap = {
    sm: {
      badge: 'w-8 h-8 rounded-xl',
      svg: 'w-4.5 h-4.5',
      text: 'text-sm font-bold tracking-tight',
      glow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]',
      borderGlow: 'before:from-[#38bdf8] before:via-[#0ea5e9] before:to-[#818cf8]',
    },
    md: {
      badge: 'w-10 h-10 rounded-xl',
      svg: 'w-5.5 h-5.5',
      text: 'text-lg font-bold tracking-tight',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.35)]',
      borderGlow: 'before:from-[#38bdf8] before:via-[#0284c7] before:to-[#818cf8]',
    },
    lg: {
      badge: 'w-14 h-14 rounded-2xl',
      svg: 'w-8 h-8',
      text: 'text-2xl font-bold tracking-tight',
      glow: 'shadow-[0_0_28px_rgba(56,189,248,0.45)]',
      borderGlow: 'before:from-[#38bdf8] before:via-[#0284c7] before:to-[#818cf8]',
    },
    xl: {
      badge: 'w-20 h-20 rounded-3xl',
      svg: 'w-11 h-11',
      text: 'text-3xl font-extrabold tracking-tight',
      glow: 'shadow-[0_0_40px_rgba(56,189,248,0.55)]',
      borderGlow: 'before:from-[#38bdf8] before:via-[#0ea5e9] before:to-[#818cf8]',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const iconElement = (
    <div
      className={`relative flex items-center justify-center shrink-0 ${
        withBadge
          ? `${currentSize.badge} p-[1px] bg-gradient-to-br from-[#38bdf8] via-[#0284c7] to-[#818cf8] ${currentSize.glow} transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.65)]`
          : ''
      }`}
    >
      {/* Subtle Holographic Shine Angle Overlay */}
      {withBadge && (
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      )}

      <div
        className={`w-full h-full ${
          withBadge ? 'bg-[#08101d] rounded-[inherit]' : ''
        } flex items-center justify-center relative overflow-hidden backdrop-blur-sm`}
      >
        {/* Radial Center Light */}
        {withBadge && (
          <div className="absolute inset-0 bg-radial from-[#38bdf8]/15 via-transparent to-transparent pointer-events-none" />
        )}

        <svg
          className={`${currentSize.svg} text-[#38bdf8] transition-transform duration-300 group-hover:rotate-6`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Matrix Orbit */}
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="1.2"
            className="opacity-30"
          />
          {/* Equatorial Ellipses */}
          <path
            d="M12 2.5C15.5 6.5 15.5 17.5 12 21.5M12 2.5C8.5 6.5 8.5 17.5 12 21.5"
            stroke="currentColor"
            strokeWidth="1.2"
            className="opacity-70"
          />
          <path
            d="M2.5 12C6.5 15.5 17.5 15.5 21.5 12M2.5 12C6.5 8.5 17.5 8.5 21.5 12"
            stroke="currentColor"
            strokeWidth="1.2"
            className="opacity-70"
          />

          {/* Central Neural Quantum Core */}
          <circle cx="12" cy="12" r="2.5" fill="#38bdf8" className="animate-pulse" />

          {/* Cardinal Orbital Nodes */}
          <circle cx="12" cy="2.5" r="1.4" fill="#818cf8" />
          <circle cx="21.5" cy="12" r="1.4" fill="#818cf8" />
          <circle cx="12" cy="21.5" r="1.4" fill="#818cf8" />
          <circle cx="2.5" cy="12" r="1.4" fill="#818cf8" />

          {/* Diagonals */}
          <circle cx="5.3" cy="5.3" r="1.1" fill="#38bdf8" />
          <circle cx="18.7" cy="18.7" r="1.1" fill="#38bdf8" />
          <circle cx="18.7" cy="5.3" r="1.1" fill="#38bdf8" />
          <circle cx="5.3" cy="18.7" r="1.1" fill="#38bdf8" />
        </svg>
      </div>
    </div>
  );

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 group select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {iconElement}

      {showText && (
        <span
          className={`text-[#f4f4f5] group-hover:text-white transition-colors duration-200 ${currentSize.text} ${textClassName}`}
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          LucyChat
        </span>
      )}
    </div>
  );
};

export default Logo;
