'use server';

import { cn } from '@bem-react/classname';
import Image from 'next/image';
import { FC } from 'react';

import { PageHeadLayout } from '@/entities/page-head/ui/page-head-layout';

import src from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { Title } from '@/shared/ui/title';

import styles from '../assets/styles.module.scss';

type Props = {
  id: number;
  title: string;
  mainPhoto: string;
};

const cnPagePost = cn('PagePost');

export const PageHeadPost: FC<Props> = async ({ title, mainPhoto }) => {
  const imageSrc = !!mainPhoto ? mainPhoto : src;

  return (
    <PageHeadLayout
      title={null}
      page='tour'
      content={
        <div
          className={cnPagePost(null, [
            'h-full',
            'bg-white',
            'relative',
            'flex',
            'items-end',
            'pb-[10vh]'
          ])}
        >
          <Image
            className={cnPagePost('MainImage', [
              styles.PagePost__MainImage,
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
            className={cnPagePost('Scrim', [
              'absolute',
              'z-2',
              'top-0',
              'right-0',
              'bottom-0',
              'left-0',
              styles.PagePost__Scrim
            ])}
          ></div>

          {/* Заголовок держим в той же колонке, что и контент, — на десктопе
              он прижимался к левому краю окна. */}
          <div
            className={cnPagePost('TitleWrap', [
              'relative',
              'z-2',
              'mt-auto',
              'w-full',
              'mx-auto',
              'max-w-[720px]',
              'px-4',
              'md:px-6'
            ])}
          >
            <Title
              className={cnPagePost('Title', [
                'text-left',
                styles.PagePost__Title
              ])}
              type='h1'
            >
              {title}
            </Title>
          </div>
        </div>
      }
    />
  );
};
