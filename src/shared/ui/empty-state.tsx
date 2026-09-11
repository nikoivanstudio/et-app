import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

/**
 * Пустое состояние: кремовая карточка вместо пустоты или системной строки.
 *
 * До v2 пустых состояний не было вообще: на главной «Популярные туры»
 * оставляли 280px белого места, каталог из базы отдавал пустой список, а
 * ошибка загрузки печаталась как «Возникла ошибка... попробуйте повторить
 * действие позже» голым текстом 16px в левом верхнем углу.
 */
export const EmptyState: FC<{
  title: string;
  text?: string;
  action?: ReactNode;
  /** `alert` — для ошибок: та же карточка, но в красной паре токенов. */
  variant?: 'default' | 'alert';
  className?: string;
}> = ({ title, text, action, variant = 'default', className }) => (
  <div
    className={cn(
      'rounded-card border px-5 py-10 text-center',
      variant === 'alert'
        ? 'border-alert-ink/25 bg-alert-bg'
        : 'border-rule bg-cream',
      className
    )}
  >
    <p
      className={cn(
        'font-caladea text-base font-bold',
        variant === 'alert' ? 'text-alert-ink' : 'text-ink'
      )}
    >
      {title}
    </p>
    {!!text && (
      <p className='font-caladea text-ink-muted mx-auto mt-2 max-w-[440px] text-[14.5px] leading-relaxed'>
        {text}
      </p>
    )}
    {!!action && <div className='mt-5 flex justify-center'>{action}</div>}
  </div>
);
