'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export function useInView<T extends Element>(threshold = 0, rootMargin = '150px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;
    let timer: NodeJS.Timeout | null = null;
    let raf: number | null = null;

    // Check visibility asynchronously via rAF to avoid synchronous setState inside effect
    raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150 && rect.bottom > -150) {
        setSeen(true);
      }
    });

    try {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting || e.intersectionRatio > 0) {
              setSeen(true);
              if (io) io.disconnect();
              break;
            }
          }
        },
        { threshold: 0, rootMargin },
      );
      io.observe(el);
    } catch {
      timer = setTimeout(() => setSeen(true), 0);
    }

    // Safety fallback: Ensure element is revealed even if IO is delayed or blocked
    const fallbackTimer = setTimeout(() => {
      setSeen(true);
    }, 800);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (timer) clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [threshold, rootMargin]);

  return [ref, seen] as const;
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'p' | 'h2' | 'span';
  style?: CSSProperties;
}) {
  const [ref, seen] = useInView<HTMLElement>(0, '100px');
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/** Image that wipes in on scroll and drifts slightly (parallax) while visible. */
export function Photo({
  src,
  alt,
  className = '',
  speed = 0.08,
  delay = 0,
  position = '50% 50%',
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  delay?: number;
  position?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0, '150px');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    const im = imgRef.current;
    if (!wrap || !im) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const c = r.top + r.height / 2 - window.innerHeight / 2;
      im.style.transform = `translate3d(0, ${(-c * speed).toFixed(1)}px, 0) scale(${1 + speed * 2})`;
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
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, speed]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-paper ${className}`}
      style={{
        clipPath: seen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
        opacity: seen ? 1 : 0.85,
        transition: `clip-path 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, opacity 0.8s ease-out ${delay}ms`,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

export function CountUp({
  to,
  suffix = '+',
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

