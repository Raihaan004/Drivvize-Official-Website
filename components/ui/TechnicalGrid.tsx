import React from 'react';

interface TechnicalGridProps {
  theme?: 'light' | 'dark';
  showNodes?: boolean;
  showParticles?: boolean;
  opacityClass?: string;
  className?: string;
}

const PARTICLES = [
  { left: '14%', top: '22%', delay: '0s', color: '#06B6D4' },
  { left: '34%', top: '68%', delay: '-2.5s', color: '#2563EB' },
  { left: '62%', top: '28%', delay: '-4.2s', color: '#06B6D4' },
  { left: '81%', top: '62%', delay: '-1.8s', color: '#FACC15' },
  { left: '48%', top: '18%', delay: '-5.5s', color: '#0D9488' },
];

export const TechnicalGrid: React.FC<TechnicalGridProps> = ({
  theme = 'dark',
  showNodes = false,
  showParticles = false,
  opacityClass = 'opacity-70',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Animated Grid Layer */}
      <div
        className={`absolute inset-0 ${
          isDark ? 'engineering-grid-dark' : 'engineering-grid-light'
        } ${opacityClass}`}
      />

      {/* Connected Glowing Technical Nodes & Fine Lines */}
      {showNodes && (
        <svg
          className="hidden md:block absolute inset-0 w-full h-full opacity-55"
          viewBox="0 0 1440 720"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 560 H360 L420 500 H920 L980 560 H1440"
            stroke={isDark ? '#315B7D' : '#DCE3EA'}
            strokeWidth="1"
            strokeOpacity={isDark ? '0.45' : '0.8'}
          />
          <path
            d="M0 560 H360 L420 500 H920 L980 560 H1440"
            stroke="#06B6D4"
            strokeWidth="1.6"
            strokeOpacity="0.65"
            className="svg-trace-line"
          />
          <path
            d="M180 140 H540 L600 200 H1160"
            stroke={isDark ? '#315B7D' : '#DCE3EA'}
            strokeWidth="1"
            strokeOpacity={isDark ? '0.35' : '0.6'}
          />
          <path
            d="M180 140 H540 L600 200 H1160"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeOpacity="0.65"
            className="svg-trace-line-delayed"
          />
          {/* Glowing Connection Points */}
          <circle cx="420" cy="500" r="3" fill="#06B6D4" />
          <circle cx="920" cy="500" r="3" fill="#FACC15" />
          <circle cx="540" cy="140" r="2.5" fill="#2563EB" />
          <circle cx="600" cy="200" r="2.5" fill="#0D9488" />
        </svg>
      )}

      {/* Subtle Floating Technical Particles (Hidden on small mobile screens for performance) */}
      {showParticles && (
        <div className="hidden sm:block absolute inset-0">
          {PARTICLES.map((p, index) => (
            <span
              key={index}
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                backgroundColor: p.color,
              }}
              className="particle-float absolute w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.55)]"
            />
          ))}
        </div>
      )}
    </div>
  );
};

