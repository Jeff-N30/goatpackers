'use client';

import { useEffect, useRef } from 'react';

type Direction = 'bottom' | 'left' | 'right' | 'top' | 'fade' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const dirClass: Record<Direction, string> = {
  bottom: 'from-bottom',
  left:   'from-left',
  right:  'from-right',
  top:    'from-top',
  fade:   'fade',
  scale:  'scale-in',
};

export default function ScrollReveal({
  children,
  direction = 'bottom',
  delay = 0,
  className = '',
  threshold = 0.12,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('visible');
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const staggerCls = delay > 0 ? `stagger-${delay}` : '';
  const combinedClass = `reveal ${dirClass[direction]} ${staggerCls} ${className}`.trim();

  return (
    <div ref={ref} className={combinedClass}>
      {children}
    </div>
  );
}
