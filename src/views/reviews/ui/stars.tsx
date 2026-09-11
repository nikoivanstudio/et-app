import { FC } from 'react';

import { cn } from '@/shared/lib/css';

/** Пять звёзд: закрашено столько, сколько в оценке. */
export const Stars: FC<{ value: number; size?: number; className?: string }> = ({
  value,
  size = 14,
  className
}) => (
  <span
    className={cn('inline-flex items-center gap-0.5', className)}
    aria-label={`Оценка ${value.toFixed(1)} из 5`}
  >
    {[1, 2, 3, 4, 5].map(index => (
      <svg
        key={index}
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill={index <= Math.round(value) ? 'var(--cta)' : 'var(--rule)'}
        aria-hidden='true'
      >
        <path d='m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z' />
      </svg>
    ))}
  </span>
);
