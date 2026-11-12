'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  start: boolean;
  reducedMotion: boolean;
  durationMs?: number;
  suffixClassName?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = '',
  start,
  reducedMotion,
  durationMs = 1250,
  suffixClassName = 'text-[#06B6D4]',
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || reducedMotion) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [start, target, reducedMotion, durationMs]);

  const displayValue = reducedMotion ? target : count;

  return (
    <span className="inline-flex items-baseline">
      <span>{displayValue}</span>
      {suffix && <span className={`ml-0.5 ${suffixClassName}`}>{suffix}</span>}
    </span>
  );
};

