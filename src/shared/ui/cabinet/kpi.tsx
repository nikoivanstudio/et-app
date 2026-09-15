import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/** Плитка сводки на «Обзоре»: подпись, крупное число и пояснение под ним. */
export const KpiCard: FC<{
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  /** Золотая рамка — для того, что требует действия прямо сейчас. */
  accent?: boolean;
  className?: string;
}> = ({ icon, label, value, hint, accent, className }) => (
  <div
    className={cn(
      'rounded-2xl border p-4',
      accent
        ? 'border-cab-gold/30 bg-linear-to-b from-cab-gold/8 to-cab-panel'
        : 'border-cab-line bg-cab-panel',
      className
    )}
  >
    <span className='text-cab-faint flex items-center gap-2 text-[12px]'>
      {icon}
      {label}
    </span>
    <p className='mt-2 text-[27px] leading-none font-semibold tracking-tight'>
      {value}
    </p>
    {!!hint && <p className='text-cab-mute mt-2 text-[11.5px]'>{hint}</p>}
  </div>
);
