'use client';

import React, { useEffect, useRef } from 'react';
import { BAND } from './data';

/** A strip of photographs that glides sideways as you scroll past it. */
export default function Band() {
  const wrap = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const w = wrap.current;
      const r = row.current;
      if (!w || !r) return;
      const b = w.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - b.top) / (window.innerHeight + b.height)));
      const max = Math.max(0, r.scrollWidth - window.innerWidth);
      r.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  return (
    <div ref={wrap} className="overflow-hidden pb-32 lg:pb-44">
      <div ref={row} className="flex w-max gap-4 px-4 will-change-transform">
        {BAND.map((src, i) => (
          <div
            key={src}
            className={`h-[46vh] min-h-[280px] overflow-hidden bg-paper ${
              i % 2 ? 'mt-12 w-[26vw] min-w-[220px]' : 'w-[34vw] min-w-[280px]'
            }`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

