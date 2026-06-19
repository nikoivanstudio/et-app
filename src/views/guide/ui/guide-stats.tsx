import { FC } from 'react';

import { cn } from '@/shared/lib/css';

const CARD = cn(
  'flex flex-col items-center justify-center gap-1.5 rounded-2xl',
  'border border-[#E2D5B7] bg-[#FBF7EE] px-1.5 py-3.5 text-center'
);
const VALUE = 'text-[15px] font-semibold leading-tight text-[#1F1A12]';
const LABEL = 'text-[10.5px] leading-tight text-[#6B5F47] tracking-wide';

type Stat = { value: string; label: string; accent?: boolean };

export const GuideStats: FC<{ stats: Stat[]; className?: string }> = ({
  stats,
  className
}) => (
  <div
    className={cn('grid gap-2', className)}
    style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
  >
    {stats.map((stat, idx) => (
      <div key={idx} className={CARD}>
        <span className={cn(VALUE, stat.accent && 'text-[#8B6F3D]')}>
          {stat.value}
        </span>
        <span className={LABEL}>{stat.label}</span>
      </div>
    ))}
  </div>
);
