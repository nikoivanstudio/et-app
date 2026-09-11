import { FC, PropsWithChildren } from 'react';

import { cn } from '@/shared/lib/css';
import type { Crumb } from '@/shared/lib/seo/breadcrumbs';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

type Props = {
  className?: string;
  /**
   * Крошки раздела. Здесь, а не в `SectionHead`: шапка раздела — это фото
   * со скримом, и мелкий служебный текст поверх кадра не читается. Тот же
   * порядок у служебных страниц (`views/legal`), и разметка едет вместе
   * с видимой навигацией — внутри `Breadcrumbs`, из одного массива.
   */
  crumbs?: Crumb[];
};

/**
 * Тело раздела под `SectionHead`: бумага наезжает на фото на 32px и закрывает
 * его скруглением сверху — тот же и единственный наезд, что на главной и в
 * каталоге. Ширина контента везде одна: 1120.
 */
export const SectionBody: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  crumbs
}) => (
  <div className='bg-page relative z-3 -mt-8 rounded-t-[32px] pt-6 md:pt-10'>
    <div className={cn('mx-auto max-w-[1120px] px-4 md:px-6', className)}>
      {!!crumbs?.length && <Breadcrumbs className='mb-5' items={crumbs} />}
      {children}
    </div>
  </div>
);
