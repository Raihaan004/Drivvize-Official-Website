import React from 'react';

interface SectionHeaderProps {
  headingId: string;
  eyebrow: string;
  title: string;
  description?: string;
  theme?: 'light' | 'dark';
  eyebrowDotClass?: string;
  eyebrowBadgeClass?: string;
  layout?: 'split' | 'stacked';
  rightSlot?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  headingId,
  eyebrow,
  title,
  description,
  theme = 'light',
  eyebrowDotClass = 'bg-[#06B6D4]',
  eyebrowBadgeClass = 'bg-white border border-[#DCE3EA] shadow-2xs',
  layout = 'split',
  rightSlot,
  className = 'mb-10 sm:mb-12',
}) => {
  const isDark = theme === 'dark';

  if (layout === 'stacked') {
    return (
      <div className={`max-w-[740px] ${className}`}>
        <div
          className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full ${eyebrowBadgeClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${eyebrowDotClass}`} />
          <span
            className={`text-[11.5px] font-bold tracking-[0.11em] uppercase ${
              isDark ? 'text-[#06B6D4]' : 'text-[#315B7D]'
            }`}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          id={headingId}
          className={`text-[32px] sm:text-[40px] lg:text-[46px] font-bold leading-[1.12] tracking-[-0.022em] ${
            isDark ? 'text-white' : 'text-[#0B2545]'
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`text-[16px] sm:text-[18px] mt-4 leading-[1.65] ${
              isDark ? 'text-[#DCE3EA]' : 'text-[#202B36]'
            }`}
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 ${className}`}
    >
      <div>
        {isDark ? (
          <div className="inline-flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${eyebrowDotClass}`} />
            <span className="text-[12px] font-bold tracking-[0.11em] uppercase text-[#06B6D4]">
              {eyebrow}
            </span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full ${eyebrowBadgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${eyebrowDotClass}`} />
            <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
              {eyebrow}
            </span>
          </div>
        )}
        <h2
          id={headingId}
          className={`text-[32px] sm:text-[40px] lg:text-[46px] font-bold leading-[1.12] tracking-[-0.022em] ${
            isDark ? 'text-white' : 'text-[#0B2545]'
          }`}
        >
          {title}
        </h2>
      </div>

      {rightSlot ??
        (description && (
          <p
            className={`text-[15px] sm:text-[16px] leading-[1.6] ${
              isDark ? 'text-[#DCE3EA]' : 'text-[#315B7D]'
            } max-w-[460px]`}
          >
            {description}
          </p>
        ))}
    </div>
  );
};

