import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/** Карточка кабинета: рамка, тёмная подложка и необязательная шапка. */
export const CabinetPanel: FC<{
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  /** Убрать внутренние отступы — для таблиц и списков во всю ширину. */
  flush?: boolean;
  className?: string;
  bodyClassName?: string;
}> = ({ title, action, children, flush, className, bodyClassName }) => (
  <section
    className={cn(
      'border-cab-line bg-cab-panel rounded-2xl border',
      className
    )}
  >
    {(!!title || !!action) && (
      <header className='border-cab-line-soft flex items-center justify-between gap-4 border-b px-4 py-3.5 sm:px-5'>
        {typeof title === 'string' ? (
          <h2 className='text-[14.5px] font-semibold'>{title}</h2>
        ) : (
          title
        )}
        {action}
      </header>
    )}
    <div className={cn(!flush && 'p-4 sm:p-5', bodyClassName)}>{children}</div>
  </section>
);

/** Подпись-сноска под блоком: почему экран устроен так, а не иначе. */
export const CabinetNote: FC<{
  children: ReactNode;
  tone?: 'plain' | 'gold' | 'bad';
  className?: string;
}> = ({ children, tone = 'plain', className }) => (
  <p
    className={cn(
      'flex gap-2 rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed',
      tone === 'gold' && 'border-cab-gold/28 bg-cab-gold/8 text-[#d8c39c]',
      tone === 'bad' && 'border-cab-bad/28 bg-cab-bad/8 text-[#f2b8b8]',
      tone === 'plain' && 'border-cab-line bg-cab-raise text-cab-faint',
      className
    )}
  >
    {children}
  </p>
);
