'use server';

import { cn } from '@bem-react/classname';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import { PageHeadLayout } from '@/entities/page-head/ui/page-head-layout';

import src from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { Title } from '@/shared/ui/title';

import { PriceBanner } from '@/views/legacy/ui/price-banner';

import styles from '../assets/styles.module.scss';

type Props = {
  title: string;
  mainPhoto: string | StaticImageData;
};

const cnJeepTourKrym = cn('JeepTourKrym');

export const Header: FC<Props> = async ({ title, mainPhoto }) => {
  const imageSrc = !!mainPhoto ? mainPhoto : src;

  return (
    <PageHeadLayout
      title={null}
      page='tour'
      content={
        <div
          className={cnJeepTourKrym(null, [
            'h-[75vh]',
            'bg-white',
            'relative',
            'flex',
            'justify-center',
            'items-end',
            'pb-[5vh]'
          ])}
        >
          <Image
            className={cnJeepTourKrym('MainImage', [
              styles.JeepTourKrym__MainImage,
              'absolute',
              'top-0',
              'right-0',
              'bottom-0',
              'left-0',
              'z-1',
              'w-full',
              'h-full'
            ])}
            alt={title}
            src={imageSrc}
            width={500}
            height={500}
          />
          <div
            className={cnJeepTourKrym('Filter', [
              'absolute',
              'z-2',
              'top-0',
              'right-0',
              'bottom-0',
              'left-0',
              'bg-[#0000007a]'
            ])}
          ></div>
          <Title
            className={cnJeepTourKrym('Title', [
              'z-2',
              'relative',
              'px-4',
              'mt-auto',
              'pt-22',
              'text-center',
              styles.JeepTourKrym__Title
            ])}
            type='h1'
          >
            {title}
            <PriceBanner />
          </Title>
        </div>
      }
    />
  );
};
