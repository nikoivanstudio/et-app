import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { RatingPill, yearsLabel } from '@/entities/guide';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';

import type { GuideProfile } from '@/kernel/guide/domain';
import { GuideHero } from '@/views/guide/ui/guide-hero';
import { GuideReviews } from '@/views/guide/ui/guide-reviews';
import { GuideSectionHeading } from '@/views/guide/ui/guide-section-heading';
import { GuideStats } from '@/views/guide/ui/guide-stats';
import { GuideTours } from '@/views/guide/ui/guide-tours';

const TAG =
  'rounded-full border border-[#E2D5B7] bg-[#FBF7EE] px-3 py-1.5 text-xs text-[#1F1A12]';

export const GuideMain: FC<GuideProfile> = guide => {
  const stats = [
    { value: `★ ${guide.rating.toFixed(1)}`, label: 'рейтинг', accent: true },
    { value: String(guide.toursCount), label: 'туров' },
    ...(guide.experienceYears
      ? [{ value: yearsLabel(guide.experienceYears), label: 'опыта' }]
      : []),
    { value: String(guide.reviewsCount), label: 'отзывов' }
  ];

  const hasSpecializations =
    guide.specializations.length > 0 || guide.languages.length > 0;

  return (
    <AppMain
      mainHead={
        <GuideHero
          name={guide.displayName}
          headline={guide.headline}
          avatarPhoto={guide.avatarPhoto}
          coverPhoto={guide.coverPhoto}
          verified={guide.isVerified}
        />
      }
      mainContent={
        <div className='relative z-3 mt-[-3vh] rounded-4xl bg-white p-2'>
          <section className='px-2 pt-2'>
            <div className='flex items-center justify-between'>
              <span className={cn(styles.poiret_text_black, 'block text-2xl')}>
                Информация
              </span>
              <RatingPill rating={guide.rating} withMax />
            </div>
            <GuideStats stats={stats} className='mt-4' />
          </section>

          <section className='px-2 pb-14'>
            {!!guide.bio && (
              <>
                <GuideSectionHeading>О гиде</GuideSectionHeading>
                <p className='text-[15px] leading-relaxed text-[#1F1A12]'>
                  {guide.bio}
                </p>
              </>
            )}

            {hasSpecializations && (
              <>
                <GuideSectionHeading>Специализация</GuideSectionHeading>
                <ul className='flex flex-wrap gap-2'>
                  {guide.specializations.map((item, idx) => (
                    <li key={`spec-${idx}`} className={TAG}>
                      {item}
                    </li>
                  ))}
                  {guide.languages.length > 0 && (
                    <li className={TAG}>{guide.languages.join(' · ')}</li>
                  )}
                </ul>
              </>
            )}

            {guide.tours.length > 0 && (
              <>
                <GuideSectionHeading>Туры гида</GuideSectionHeading>
                <GuideTours tours={guide.tours} />
              </>
            )}

            {guide.reviews.length > 0 && (
              <>
                <GuideSectionHeading>Отзывы клиентов</GuideSectionHeading>
                <GuideReviews reviews={guide.reviews} />
              </>
            )}
          </section>
        </div>
      }
      mainBottom={null}
    />
  );
};
