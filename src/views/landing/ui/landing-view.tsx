'use server';

import Link from 'next/link';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import type { Landing } from '@/entities/landing/server';
import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { cn } from '@/shared/lib/css';
import type { Crumb } from '@/shared/lib/seo/breadcrumbs';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { FaqSection } from '@/shared/ui/faq-section';
import { LeadActions } from '@/shared/ui/lead-actions';
import { SectionHeading } from '@/shared/ui/section-heading';
import { TourLinks } from '@/shared/ui/tour-links';

import { linkingService } from '@/kernel/linking/server';

type Props = {
  landing: Landing;
  crumbs: Crumb[];
  /** Тип шапки — он же выбирает фото в styles.scss. */
  page?: string;
};

const cardClassName =
  'border-rule bg-cream hover:bg-cream-deep rounded-block flex h-full min-h-[64px] flex-col justify-center gap-1 border p-3.5 transition-colors';

/**
 * Посадочная фазы E: гео-страница (E3), связка «откуда → куда» (E4)
 * или форматная страница (E5).
 *
 * Один компонент на три задачи — различаются они содержимым, а не
 * устройством: заголовок, свой вводный текст, объекты, туры, соседние
 * страницы и заявка.
 *
 * Все блоки под текстом собираются перелинковкой по правилам (E7):
 * ни один список ссылок здесь не написан руками, иначе на двух десятках
 * страниц он прожил бы до первой правки.
 */
export const LandingView: FC<Props> = async ({
  landing,
  crumbs,
  page = 'geo'
}) => {
  const [places, tours] = await Promise.all([
    linkingService.getLandingPlaces(landing),
    linkingService.getLandingTours(landing)
  ]);

  const related = linkingService.getRelatedLandings(landing);

  return (
    <AppMain
      mainHead={
        <SectionHead
          page={page}
          kicker={landing.kicker}
          title={landing.title}
          lead={landing.metaDescription}
        />
      }
      mainContent={
        <SectionBody className='pb-16'>
          <div className='mx-auto w-full max-w-[720px]'>
            <Breadcrumbs className='mb-5' items={crumbs} />

            {/* Свой текст на каждой странице — условие задачи, а не
                пожелание: подстановка города в общий шаблон и есть тот
                малополезный контент, за который снимают раздел. */}
            <div className='et-post'>
              {landing.intro.map(paragraph => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <TourLinks
              className='mt-2'
              items={tours}
              title='Маршруты отсюда'
              lead='Цена за машину до шести человек, выезд от места проживания.'
            />

            {!!places.length && (
              <section className='mt-2'>
                <SectionHeading>Что смотрим</SectionHeading>
                <ul className='flex flex-col gap-2 md:grid md:grid-cols-2'>
                  {places.map(place => (
                    <li key={place.slug}>
                      <Link
                        className={cardClassName}
                        href={`/mesta/${place.slug}`}
                      >
                        <span className='font-caladea text-ink text-[14.5px] font-bold'>
                          {place.title}
                        </span>
                        <span className='font-oswald text-ink-muted text-[12.5px]'>
                          {[place.kind, place.district ?? place.city]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <LeadActions
              className='mt-9'
              entityName={landing.title}
              entityId={landing.path}
            />

            {!!landing.faq?.length && <FaqSection items={landing.faq} />}

            {!!related.length && (
              <section className='mt-2'>
                <SectionHeading>Смотрите также</SectionHeading>
                <ul
                  className={cn('flex flex-col gap-2 md:grid md:grid-cols-2')}
                >
                  {related.map(item => (
                    <li key={item.path}>
                      <Link className={cardClassName} href={item.path}>
                        <span className='font-caladea text-ink text-[14.5px] font-bold'>
                          {item.title}
                        </span>
                        {!!item.kicker && (
                          <span className='font-oswald text-ink-muted text-[12.5px]'>
                            {item.kicker}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </SectionBody>
      }
      mainBottom={null}
    />
  );
};
