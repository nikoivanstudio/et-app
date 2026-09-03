'use server';

import { cn } from '@bem-react/classname';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import { PageHeadLayout } from '@/entities/page-head/ui/page-head-layout';

import src from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { Title } from '@/shared/ui/title';

import styles from '../assets/styles.module.scss';

type Props = {
  title: string;
  mainPhoto: string | StaticImageData;
  /** `catalog` — компактная шапка списка; `hero` — высокая шапка статьи. */
  variant?: 'catalog' | 'hero';
  kicker?: string;
  /** Подзаголовок шапки каталога — показывается от md, где есть место. */
  lead?: string;
};

const cnJeepTourKrym = cn('JeepTourKrym');

export const Header: FC<Props> = async ({
  title,
  mainPhoto,
  variant = 'hero',
  kicker,
  lead
}) => {
  const imageSrc = !!mainPhoto ? mainPhoto : src;
  const isCatalog = variant === 'catalog';

  return (
    <PageHeadLayout
      title={null}
      page={isCatalog ? 'tours' : 'tour'}
      content={
        <div
          className={cnJeepTourKrym(null, [
            'relative',
            'flex',
            'h-full',
            'items-end',
            isCatalog ? 'pb-13' : 'pb-[5vh]'
          ])}
        >
          <Image
            className={cnJeepTourKrym('MainImage', [
              styles.JeepTourKrym__MainImage,
              'absolute',
              'inset-0',
              'z-1',
              'w-full',
              'h-full'
            ])}
            alt={title}
            src={imageSrc}
            width={500}
            height={500}
          />
          {/* Своя подложка: фото лежит внутри ContentWrap, то есть выше
              секционного скрима PageHead. Было bg-[#0000007a] — плоские 70%
              чёрного, которые убивали кадр. */}
          <div
            className={cnJeepTourKrym('Scrim', [
              'absolute',
              'inset-0',
              'z-2',
              isCatalog
                ? styles.JeepTourKrym__ScrimBand
                : styles.JeepTourKrym__Scrim
            ])}
          ></div>

          {isCatalog ? (
            <div className='relative z-2 mx-auto w-full max-w-[1120px] px-4 md:px-6'>
              {!!kicker && (
                <p className='font-oswald mb-2 text-[12.5px] tracking-[1.8px] text-white/80 uppercase md:text-[13px] md:tracking-[2px]'>
                  {kicker}
                </p>
              )}
              <h1 className='font-poiret text-gold-photo text-[38px] leading-none tracking-[4px] uppercase md:text-[58px] md:tracking-[5px]'>
                {title}
              </h1>
              {!!lead && (
                <p className='font-caladea mt-4 hidden max-w-[520px] text-base leading-relaxed text-white/90 md:block'>
                  {lead}
                </p>
              )}
            </div>
          ) : (
            <Title
              className={cnJeepTourKrym('Title', [
                'z-2',
                'relative',
                'px-4',
                'mt-auto',
                'text-center',
                styles.JeepTourKrym__Title
              ])}
              type='h1'
            >
              {title}
            </Title>
          )}
        </div>
      }
    />
  );
};
