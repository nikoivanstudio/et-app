import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/** Подпись + поле + подсказка. Один отступ на все формы кабинета. */
export const Field: FC<{
  label: string;
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}> = ({ label, hint, error, htmlFor, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label htmlFor={htmlFor} className='text-[12px] font-medium text-[#c7c7cd]'>
      {label}
    </label>
    {children}
    {!!error && <p className='text-cab-bad text-[11.5px]'>{error}</p>}
    {!error && !!hint && (
      <p className='text-cab-mute text-[11.5px] leading-relaxed'>{hint}</p>
    )}
  </div>
);

/** Общие классы полей ввода кабинета — одна высота и одна рамка на всё. */
export const cabinetInput =
  'w-full rounded-[10px] border border-cab-line bg-[#121215] px-3 py-2.5 text-[13px] text-cab-ink outline-none placeholder:text-cab-mute focus:border-cab-gold/60 disabled:opacity-60';

/** Пара «подпись — значение» для карточек и сводок. */
export const Cell: FC<{
  label: string;
  children: ReactNode;
  className?: string;
}> = ({ label, children, className }) => (
  <span className={cn('text-cab-faint block text-[11.5px]', className)}>
    {label}
    <b className='text-cab-ink mt-0.5 block text-[13px] font-semibold'>
      {children}
    </b>
  </span>
);
