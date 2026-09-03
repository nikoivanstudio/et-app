'use server';

import '../styles/styles.scss';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { PageHeadProps } from '@/entities/page-head/model/types';

const cnPageHead = cn('PageHead');

export const PageHeadLayout: FC<PageHeadProps> = async ({
  title,
  content,
  page = 'home',
  className
}) => (
  <section
    className={cnPageHead({ type: page as string }, [
      'relative',
      'z-1',
      className
    ])}
  >
    <div className={cnPageHead('ContentWrap', ['relative', 'z-3', 'h-full'])}>
      {title}
      {content}
    </div>
    {/* Скрим вместо плоской маски bg-[#0000002a]: плотный сверху и снизу,
        прозрачный в середине — кадр видно, а текст читается. */}
    <div
      className={cnPageHead('Scrim', [
        'absolute',
        'z-2',
        'top-0',
        'right-0',
        'bottom-0',
        'left-0'
      ])}
    ></div>
  </section>
);
