import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { formatPrice } from '@/shared/lib/string-utils';
import { SectionHeading } from '@/shared/ui/section-heading';

export type TourLink = {
  slug: string;
  title: string;
  price?: number;
  duration?: number;
};

type Props = {
  items: TourLink[];
  title?: string;
  /** Текст под заголовком: зачем этот список здесь. */
  lead?: string;
  className?: string;
};

/**
 * Список туров ссылками: блок «туры, которые сюда заезжают».
 *
 * Механизм, ради которого затевалась модель `Place` (E1). Справочник —
 * 780 страниц про Крым, которых нет ни у Turnado, ни у Sputnik8, ни
 * у Tripster, — до сих пор был тупиком: человек читал про Мангуп-Кале
 * и уходил, потому что уйти со страницы было некуда. Теперь под текстом
 * стоят туры с ценой и переходом на карточку.
 *
 * Блок не рендерится, когда туров нет: пустой заголовок «Туры сюда»
 * читается как «у нас их нет» и работает против страницы.
 */
export const TourLinks: FC<Props> = ({ items, title, lead, className }) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className={cn(className)}>
      {!!title && <SectionHeading>{title}</SectionHeading>}
      {!!lead && (
        <p className='font-caladea text-ink-muted mb-3 text-[14px] leading-relaxed'>
          {lead}
        </p>
      )}
      <ul className='flex flex-col gap-2'>
        {items.map(({ slug, title: tourTitle, price, duration }) => (
          <li key={slug}>
            <Link
              className='border-rule bg-cream hover:bg-cream-deep rounded-block flex min-h-[54px] items-center gap-3 border p-3 transition-colors'
              href={`/tour/${slug}`}
            >
              <span className='min-w-0 flex-1'>
                <span className='font-caladea text-ink block text-[14.5px] font-bold'>
                  {tourTitle}
                </span>
                <span className='font-oswald text-gold-ink text-[12.5px]'>
                  {!!price && `от ${formatPrice(price)}`}
                  {!!price && !!duration && ' · '}
                  {!!duration && `${duration} ч`}
                </span>
              </span>
              <span className='text-gold-ink shrink-0 text-[15px]'>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
