import Link from 'next/link';
import { FC, Fragment } from 'react';

import { cn } from '@/shared/lib/css';
import { buildBreadcrumbJsonLd, type Crumb } from '@/shared/lib/seo/breadcrumbs';
import { JsonLd } from '@/shared/ui/json-ld';

type Props = {
  items: Crumb[];
  /**
   * `photo` — поверх фотографии в шапке (белый текст),
   * `paper` — на светлом фоне страницы.
   */
  variant?: 'photo' | 'paper';
  className?: string;
};

/**
 * Хлебные крошки: видимая навигация и разметка BreadcrumbList одним
 * компонентом.
 *
 * Вместе, а не по отдельности, намеренно: разметка, которая описывает не то,
 * что видит пользователь, — повод для санкций, и разъезжаются такие пары
 * всегда. Здесь оба вывода берутся из одного массива.
 *
 * Раньше крошки были обычным `<p>` с точками-разделителями: для
 * скринридера это один абзац текста, а для поисковика — не навигация.
 * Теперь `nav` + `ol`, у текущей страницы `aria-current`, разделители
 * скрыты от озвучки.
 */
export const Breadcrumbs: FC<Props> = ({
  items,
  variant = 'paper',
  className
}) => {
  if (!items.length) {
    return null;
  }

  const isPhoto = variant === 'photo';

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(items)} />
      <nav
        aria-label='Хлебные крошки'
        className={cn(
          'font-oswald text-[12.5px] tracking-[1.2px]',
          isPhoto ? 'text-white' : 'text-ink-muted',
          className
        )}
      >
        <ol className='flex flex-wrap items-baseline gap-y-1'>
          {items.map(({ label, href }, index) => {
            const isLast = index === items.length - 1;

            return (
              <Fragment key={`${label}-${index}`}>
                {index > 0 && (
                  <li aria-hidden='true' className='px-1.5 opacity-60'>
                    ·
                  </li>
                )}
                <li className={isLast ? 'min-w-0' : undefined}>
                  {href && !isLast ? (
                    <Link
                      className={cn(
                        'transition-colors',
                        isPhoto ? 'hover:text-gold-photo' : 'hover:text-gold-ink'
                      )}
                      href={href}
                    >
                      {label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? 'page' : undefined}>
                      {label}
                    </span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
