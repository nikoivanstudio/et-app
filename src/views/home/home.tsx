import { FC } from 'react';

import { UpcomingActivities } from '@/widgets/activities/server';
import { AppMain } from '@/widgets/app-main/server';
import { HomePosts } from '@/widgets/posts/containers/home-posts';
import { PopularTours } from '@/widgets/tours/server';

import { PageHeadLayout } from '@/entities/page-head/server';
import { PageTitle } from '@/entities/page-title/server';

import { LinkButton } from '@/shared/ui/link-button';

export const HomeView: FC = async () => {
  return (
    <AppMain
      mainHead={
        <PageHeadLayout
          title={
            /* Контейнер 1120: на 1440 заголовок упирался в правый край окна
               (x=1424), потому что PageTitle прижат вправо. */
            <div className='mx-auto w-full max-w-[1120px] px-4 pt-30 md:px-6'>
              <PageTitle
                topTitle={{ text: 'Джип туры' }}
                middleTitle={{ text: 'Экскурсии по Крыму' }}
              />
            </div>
          }
          content={
            /* Кнопка внизу шапки, на плотной части скрима: там её находят
               пальцем, и она не висит посреди кадра. */
            <div className='absolute inset-x-0 bottom-22'>
              <div className='mx-auto w-full max-w-[1120px] px-4 text-center md:px-6'>
                {/* Было: пилюля во всю ширину окна — 1372px на 1440. */}
                {/* A5: ведёт в единственный каталог `/tours`, а не
                    в легаси `/category/vse_tury` — один из семи
                    конкурирующих каталогов (B7). */}
                <LinkButton
                  className='w-full shadow-[0_6px_20px_#00000059] md:w-[280px]'
                  href='/tours'
                >
                  Все туры
                </LinkButton>
                <p className='font-oswald mt-3.5 text-[13px] tracking-widest text-white/85'>
                  Джип-туры и экскурсии · выезд из Бахчисарая и Севастополя
                </p>
              </div>
            </div>
          }
        />
      }
      mainContent={
        /* Единственное наложение на странице: контент поднимается на 32px и
           закрывает фото скруглением сверху — тот же приём, что на туре.
           Было -15vh и стопка отрицательных отступов внутри виджетов. */
        <div className='bg-page relative z-3 -mt-8 rounded-t-[32px] pt-12'>
          <PopularTours />
          <HomePosts />
          <UpcomingActivities />
        </div>
      }
      mainBottom={null}
    />
  );
};
