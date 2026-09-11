'use server';

import Link from 'next/link';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';
import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { GuideAvatar } from '@/entities/guide';
import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { DetailBlock } from '@/shared/ui/detail-block';
import { LinkButton } from '@/shared/ui/link-button';

import {
  ReviewsSummary,
  SiteReviewItem
} from '@/views/reviews/services/reviews-service';
import { Stars } from '@/views/reviews/ui/stars';

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));

const SCORES = [5, 4, 3, 2, 1];

type Props = {
  items: SiteReviewItem[];
  summary: ReviewsSummary;
};

/**
 * Страница отзывов.
 *
 * Было: та же вёрстка, что у услуг, — фото храма на 85vh без скрима, H1
 * «Отзывы — Джип туры и индивидуальные экскурсии по Крыму. Лучшие цены»
 * белым по светлому кадру (худший участок 2,48:1 при норме 3:1), в теле та
 * же строка в рамке и мок «★ 4,9/5» с тремя стоковыми аватарами. Ни одного
 * настоящего отзыва.
 */
export const ReviewsView: FC<Props> = async ({ items, summary }) => (
  <AppMain
    mainHead={
      <SectionHead
        page='reviews'
        kicker={
          summary.total
            ? `${summary.total} отзывов · средняя ${summary.average.toFixed(1)}`
            : 'Что пишут после выезда'
        }
        title='Отзывы'
        lead='Оценки ставят те, кто съездил: работа гида, маршрут и то, как всё было рассказано.'
      />
    }
    mainContent={
      <SectionBody>
        <div className='mx-auto w-full max-w-[720px]'>
          {summary.total > 0 && (
            <DetailBlock className='p-4'>
              <div className='flex items-center gap-5'>
                <div className='shrink-0 text-center'>
                  <div className='font-poiret text-ink text-[44px] leading-none'>
                    {summary.average.toFixed(1).replace('.', ',')}
                  </div>
                  <Stars className='mt-1' value={summary.average} />
                  <div className='font-oswald text-ink-faint mt-1.5 text-[11.5px]'>
                    {summary.total} отзывов
                  </div>
                </div>
                <div className='min-w-0 flex-1'>
                  {SCORES.map((score, idx) => {
                    const count = summary.distribution[idx];
                    const pct = summary.total
                      ? (count / summary.total) * 100
                      : 0;

                    return (
                      <div
                        key={score}
                        className='font-oswald text-ink-faint mt-1.5 flex items-center gap-2 text-[11.5px] first:mt-0'
                      >
                        <span className='w-2'>{score}</span>
                        <span className='bg-cream-deep h-1.5 flex-1 overflow-hidden rounded-full'>
                          <span
                            className='bg-cta block h-full rounded-full'
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className='w-7 text-right'>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DetailBlock>
          )}

          {items.length > 0 ? (
            <ul className='mt-5 flex flex-col gap-3'>
              {items.map(review => (
                <li
                  key={review.id}
                  className='border-rule bg-cream rounded-card border p-4'
                >
                  <div className='flex items-center gap-2.5'>
                    <GuideAvatar
                      src={review.authorAvatar}
                      name={review.authorName}
                      size={34}
                      ring={0}
                    />
                    <span className='min-w-0 flex-1'>
                      <span className='font-caladea text-ink block text-[14px] font-bold'>
                        {review.authorName}
                      </span>
                      <span className='font-oswald text-ink-faint text-[11.5px]'>
                        {formatDate(review.createdAt)}
                      </span>
                    </span>
                    <Stars value={review.estimateValue} />
                  </div>

                  {!!review.content && (
                    <p className='font-caladea text-ink mt-3 text-[14.5px] leading-relaxed'>
                      {review.content}
                    </p>
                  )}

                  <Link
                    className='font-oswald text-gold-ink mt-3 inline-flex min-h-11 items-center text-[13px] hover:underline'
                    href={`/tour/${review.tourSlug}`}
                  >
                    {review.tourTitle} →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            /* Пустое состояние вместо мока: отзывов в базе пока нет. */
            <div className='border-rule bg-cream rounded-card mt-5 border px-5 py-10 text-center'>
              <p className='font-caladea text-ink text-base font-bold'>
                Отзывов на сайте пока нет
              </p>
              <p className='font-caladea text-ink-muted mx-auto mt-2 max-w-[420px] text-[14.5px] leading-relaxed'>
                Мы возим группы с 2016 года, но отзывы всё это время оставляли
                во ВКонтакте. Переносим их сюда — а пока почитать можно там.
              </p>
              <LinkButton className='mt-5 w-full md:w-[260px]' href={CONTACTS.vk}>
                Читать отзывы во ВКонтакте
              </LinkButton>
            </div>
          )}

          <div className='border-rule bg-cream rounded-block mt-7 border p-5 text-center'>
            <p className='font-caladea text-ink text-base font-bold'>
              Были с нами?
            </p>
            <p className='font-caladea text-ink-muted mt-1 text-[14.5px] leading-relaxed'>
              Расскажите, как прошёл выезд, — это помогает следующим.
            </p>
            <LinkButton
              className='mt-4 w-full md:w-[260px]'
              href={CONTACTS.telegram}
            >
              Оставить отзыв
            </LinkButton>
          </div>

          <div className='h-14' />
        </div>
      </SectionBody>
    }
    mainBottom={null}
  />
);
