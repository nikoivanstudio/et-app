'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { MockReviewsAvatars } from '@/entities/mock-reviews-avatars';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';
import { TextContent } from '@/shared/ui/text-content';

import { PageHeadPost } from '@/views/post/ui/page-head-post';

import { ServiceViewProps } from '../domain';

const cnPageService = cnBem('PageService');

export const ServiceMain: FC<ServiceViewProps> = async props => {
  const { id, title, mainImage, content } = props;

  return (
    <AppMain
      mainHead={<PageHeadPost {...{ id, title, mainPhoto: mainImage }} />}
      mainContent={
        <div
          className={cnPageService('Content', [
            'bg-white',
            'rounded-4xl',
            'p-2',
            'mt-[-3vh]',
            'relative',
            'z-3'
          ])}
        >
          <section className={cnPageService('DescriptionBlock')}>
            <div className='flex justify-between pr-5'>
              <span
                className={cn(
                  styles.poiret_text_black,
                  'text-2xl',
                  'block',
                  'p-2'
                )}
              >
                Информация
              </span>
              <MockReviewsAvatars rating={4.9} />
            </div>
          </section>
          <section className={cnPageService('Content', ['mt-1', 'pb-14'])}>
            <div>
              <TextContent content={content as TrustedHTML} />
            </div>
          </section>
        </div>
      }
      mainBottom={null}
    />
  );
};
