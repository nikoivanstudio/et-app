'use server';

import { FC } from 'react';

import { PageHeadLayout } from '@/entities/page-head/ui/page-head-layout';

type Props = {
  /** Тип шапки — он же выбирает фото в styles.scss. */
  page: string;
  /** Надзаголовок: что за раздел и сколько в нём всего. */
  kicker?: string;
  title: string;
  /** Подзаголовок — показываем от md, где под него есть место. */
  lead?: string;
};

/**
 * Шапка раздела: полоса 300/420 со скрим-бэндом, надзаголовок и H1 слева.
 *
 * Было: `PageHeadLayout` с `pt-[35vh]` и `PageTitle`, у которого заголовок
 * прижат вправо 40px с трекингом 4px — «КОНТАКТЫ» и «УСЛУГИ» обрезало правым
 * краем окна, а на /posts H1 целиком уходил под первую карточку, потому что
 * контент поднимался на −90px. Сюда же переехал единственный разрешённый
 * наезд контента: −32px, он задаётся в `SectionBody`.
 */
export const SectionHead: FC<Props> = async ({ page, kicker, title, lead }) => (
  <PageHeadLayout
    page={page}
    title={null}
    content={
      <div className='relative flex h-full items-end pb-11 md:pb-14'>
        <div className='relative z-2 mx-auto w-full max-w-[1120px] px-4 md:px-6'>
          {!!kicker && (
            <p className='font-oswald mb-2 text-[12.5px] tracking-[1.8px] text-white/80 uppercase md:text-[13px] md:tracking-[2px]'>
              {kicker}
            </p>
          )}
          <h1 className='font-poiret text-gold-photo text-[34px] leading-[1.05] tracking-[3px] uppercase md:text-[56px] md:tracking-[5px]'>
            {title}
          </h1>
          {!!lead && (
            <p className='font-caladea mt-4 hidden max-w-[520px] text-base leading-relaxed text-white/90 md:block'>
              {lead}
            </p>
          )}
        </div>
      </div>
    }
  />
);
