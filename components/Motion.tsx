'use client';

import type { ReactNode } from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

/** Slow 3° float for the hero cutout. Static when the user prefers reduced motion. */
export function HeroFloat({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className="relative h-full w-full"
        animate={reduce ? undefined : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/** Fade-and-rise section reveal (below the fold only — never wrap the hero/LCP). Static with reduced motion. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
