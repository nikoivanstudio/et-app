import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/**
 * Пустой экран кабинета. Говорит, что делать дальше, а не «данных нет»:
 * пустой список у гида чаще всего означает незаконченную настройку,
 * а не поломку.
 */
export const CabinetEmpty: FC<{
  icon: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  tone?: 'default' | 'alert';
  className?: string;
}> = ({ icon, title, text, action, tone = 'default', className }) => (
  <div
    className={cn('flex flex-col items-center px-4 py-10 text-center', className)}
  >
    <span
      className={cn(
        'grid size-12 place-items-center rounded-2xl',
        tone === 'alert'
          ? 'bg-cab-bad/12 text-cab-bad'
          : 'bg-cab-gold/12 text-cab-gold'
      )}
    >
      {icon}
    </span>
    <p className='mt-3.5 text-[15px] font-semibold'>{title}</p>
    {!!text && (
      <p className='text-cab-faint mx-auto mt-2 max-w-[46ch] text-[12.5px] leading-relaxed'>
        {text}
      </p>
    )}
    {!!action && <div className='mt-4'>{action}</div>}
  </div>
);
