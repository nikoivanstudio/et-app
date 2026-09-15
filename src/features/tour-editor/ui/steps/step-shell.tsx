import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/** Обёртка шага редактора: заголовок, подпись и одна сетка отступов. */
export const StepShell: FC<{
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}> = ({ title, hint, children, className }) => (
  <section
    className={cn(
      'border-cab-line bg-cab-panel flex flex-col gap-4 rounded-2xl border p-4 sm:p-5',
      className
    )}
  >
    <div className='flex flex-wrap items-baseline gap-2.5'>
      <h2 className='text-[15.5px] font-semibold'>{title}</h2>
      {!!hint && <span className='text-cab-mute text-[12px]'>{hint}</span>}
    </div>
    {children}
  </section>
);
