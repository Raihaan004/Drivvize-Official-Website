import React from 'react';

interface DrivvizeLogoProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
}

export const DrivvizeLogo: React.FC<DrivvizeLogoProps> = ({
  variant = 'light',
  compact = false,
  className = '',
}) => {
  const isDarkSurface = variant === 'dark';

  return (
    <span
      className={`inline-flex items-center gap-3 select-none group ${className}`}
      aria-label="Drivvize Home"
    >
      {/* Technical Geometric Emblem Placeholder */}
      <span
        className={`relative flex items-center justify-center w-9 h-9 rounded-[10px] transition-all duration-300 ${
          isDarkSurface
            ? 'bg-white/10 border border-white/20 group-hover:border-[#06B6D4] shadow-[0_0_16px_-4px_rgba(6,182,212,0.35)]'
            : 'bg-gradient-to-br from-[#0B2545] via-[#0F315C] to-[#0B2545] border border-[#0B2545] group-hover:border-[#2563EB] shadow-[0_4px_12px_-3px_rgba(11,37,69,0.28)]'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Precision outer shield / chassis path */}
          <path
            d="M4 6.5L11.5 3L19.5 6.5V13.2C19.5 17.2 15.9 20.1 11.75 21.5C7.6 20.1 4 17.2 4 13.2V6.5Z"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Inner technical vector D / circuit path */}
          <path
            d="M9 8.5H12.2C14.1 8.5 15.5 9.9 15.5 11.75C15.5 13.6 14.1 15 12.2 15H9V8.5Z"
            stroke="#06B6D4"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Safety Yellow precision node */}
          <circle cx="9" cy="11.75" r="1.4" fill="#FACC15" />
        </svg>
      </span>

      {/* Wordmark */}
      <span className="flex flex-col">
        <span
          style={{ fontFamily: 'var(--font-heading)' }}
          className={`font-extrabold tracking-[0.11em] text-[18px] sm:text-[19px] leading-none ${
            isDarkSurface ? 'text-white' : 'text-[#0B2545]'
          }`}
        >
          DRIVVIZE
        </span>
        {!compact && (
          <span
            className={`text-[9.5px] font-medium tracking-[0.18em] uppercase mt-1 leading-none ${
              isDarkSurface ? 'text-[#DCE3EA]/75' : 'text-[#315B7D]'
            }`}
          >
            Safety &amp; Cyber Engineering
          </span>
        )}
      </span>
    </span>
  );
};

