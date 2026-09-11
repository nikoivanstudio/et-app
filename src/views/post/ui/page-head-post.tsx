'use server';

import { cn } from '@bem-react/classname';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FC, Fragment, ReactNode } from 'react';

import { PageHeadLayout } from '@/entities/page-head/ui/page-head-layout';

import src from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { Title } from '@/shared/ui/title';

import styles from '../assets/styles.module.scss';

export type Crumb = { label: string; href?: string };

type Props = {
  id: number;
  title: string;
  mainPhoto: string | StaticImageData | null;
  /** Крошки над заголовком: раздел, в котором лежит страница. */
  crumbs?: Crumb[];
  /** Факт-ряд под заголовком: цена · длительность · место. */
  facts?: ReactNode;
};

const cnPagePost = cn('PagePost');

export const PageHeadPost: FC<Props> = async ({
  title,
  mainPhoto,
  crumbs,
  facts
}) => {
  const imageSrc = mainPhoto || src;

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
            {/* Крошек на страницах услуг и постов не было совсем: попав сюда
                из поиска, подняться в раздел можно было только через бургер. */}
            {!!crumbs?.length && (
              <p className='font-oswald mb-3 text-[12.5px] tracking-[1.2px] text-white'>
                {crumbs.map(({ label, href }, idx) => (
                  <Fragment key={label}>
                    {idx > 0 && <span className='px-1.5 opacity-60'>·</span>}
                    {href ? (
                      <Link className='hover:text-gold-photo' href={href}>
                        {label}
                      </Link>
                    ) : (
                      <span>{label}</span>
                    )}
                  </Fragment>
                ))}
              </p>
            )}

            <Title
              className={cnPagePost('Title', [
                'text-left',
                styles.PagePost__Title
              ])}
              type='h1'
            >
              {title}
            </Title>

            {!!facts && (
              <p className='font-oswald mt-3 flex flex-wrap items-baseline gap-x-2 text-[14px] text-white'>
                {facts}
              </p>
            )}
          </div>
        </div>
      }
    />
  );
};
