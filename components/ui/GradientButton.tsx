import React from 'react';

export type GradientButtonVariant =
  | 'primary-gradient'
  | 'secondary-glass-dark'
  | 'secondary-outline-light'
  | 'accent-yellow';

interface GradientButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: GradientButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-4 py-2 text-[13.5px] rounded-[10px]',
  md: 'px-5 py-2.5 text-[14px] rounded-[10px]',
  lg: 'px-7 py-4 text-[15px] rounded-[12px]',
};

const VARIANT_CLASSES: Record<GradientButtonVariant, string> = {
  'primary-gradient':
    'bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#06B6D4] bg-[length:180%_100%] bg-left hover:bg-right text-white font-semibold border border-white/15 shadow-[0_10px_28px_-6px_rgba(37,99,235,0.52)] hover:shadow-[0_14px_34px_-6px_rgba(6,182,212,0.58)] hover:-translate-y-0.5',
  'secondary-glass-dark':
    'bg-white/10 hover:bg-white/16 backdrop-blur-md text-white font-semibold border border-white/25 hover:border-[#06B6D4]/75 shadow-[0_8px_24px_-8px_rgba(11,37,69,0.4)] hover:-translate-y-0.5',
  'secondary-outline-light':
    'bg-white hover:bg-[#F1F5F9] text-[#0B2545] hover:text-[#2563EB] font-semibold border-[1.5px] border-[#0B2545] hover:border-[#2563EB] hover:-translate-y-0.5',
  'accent-yellow':
    'bg-[#FACC15] hover:bg-[#FDE047] text-[#0B2545] font-bold border border-[#FACC15] shadow-[0_10px_26px_-6px_rgba(250,204,21,0.45)] hover:-translate-y-0.5',
};

export const GradientButton: React.FC<GradientButtonProps> = ({
  variant = 'primary-gradient',
  size = 'lg',
  className = '',
  children,
  ...rest
}) => {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2.5 transition-all duration-300 ease-out group ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
};

