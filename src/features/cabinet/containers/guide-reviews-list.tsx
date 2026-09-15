'use client';

import { Send, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { apiClient } from '@/shared/api/api-client';
import { cn } from '@/shared/lib/css';
import {
  cabinetAction,
  CabinetEmpty,
  cabinetInput,
  CabinetPanel
} from '@/shared/ui/cabinet';

import { formatLongDate } from '../lib/format';
import { CabinetReview, CabinetReviewsSummary } from '../services/reviews-service';

const CRITERIA: { id: keyof CabinetReview['estimation']; label: string }[] = [
  { id: 'guideWork', label: 'Работа гида' },
  { id: 'informationQuality', label: 'Информация' },
  { id: 'trailQuality', label: 'Маршрут' }
];

const MAX_SCORE = 5;

const Stars: FC<{ value: number }> = ({ value }) => (
  <span className='text-cab-gold tracking-[2px]' aria-label={`${value} из 5`}>
    {'★'.repeat(Math.round(value))}
    {'☆'.repeat(Math.max(0, MAX_SCORE - Math.round(value)))}
  </span>
);

const Bar: FC<{ label: string; value: number }> = ({ label, value }) => (
  <span className='grid grid-cols-[86px_minmax(0,1fr)_28px] items-center gap-2.5 text-[11.5px]'>
    <span className='text-cab-faint'>{label}</span>
    <span className='bg-cab-line block h-[5px] overflow-hidden rounded-full'>
      <span
        className='bg-cab-gold block h-full'
        style={{ width: `${(value / MAX_SCORE) * 100}%` }}
      />
    </span>
    <span className='text-right text-[#c7c7cd]'>
      {value.toFixed(1).replace('.', ',')}
    </span>
  </span>
);

const ReviewCard: FC<{ review: CabinetReview; onReplied: () => void }> = ({
  review,
  onReplied
}) => {
  const [reply, setReply] = useState(review.guideReply ?? '');
  const [isSending, setSending] = useState(false);

  const send = async () => {
    if (!reply.trim()) return;

    setSending(true);

    try {
      await apiClient.patch({
        url: 'cabinet/reviews',
        body: JSON.stringify({ reviewId: review.id, reply }),
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Ответ опубликован');
      onReplied();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <article
      className={cn(
        'border-cab-line bg-cab-panel rounded-2xl border p-4 sm:p-5',
        !review.guideReply && 'border-cab-gold/38'
      )}
    >
      <div className='flex flex-wrap items-center gap-2.5'>
        <span>
          <span className='block text-[13.5px] font-semibold'>
            {review.authorName}
          </span>
          <span className='text-cab-mute text-[11.5px]'>
            {formatLongDate(review.createdAt)} · отзыв № {review.id}
          </span>
        </span>
        <Stars value={review.estimateValue} />
      </div>

      <p className='text-cab-mute mt-3 text-[11.5px]'>{review.tourTitle}</p>
      <p className='mt-1.5 text-[13.5px] leading-relaxed text-[#e4e4e7]'>
        {review.content}
      </p>

      <div className='mt-3.5 flex max-w-[260px] flex-col gap-1.5'>
        {CRITERIA.map(item => (
          <Bar
            key={item.id}
            label={item.label}
            value={review.estimation[item.id]}
          />
        ))}
      </div>

      {review.guideReply ? (
        <div className='border-cab-gold/50 bg-cab-raise mt-3.5 rounded-[10px] border-l-2 px-3.5 py-3'>
          <span className='text-cab-mute text-[11.5px]'>
            Ваш ответ · {formatLongDate(review.guideReplyAt)}
          </span>
          <p className='mt-1 text-[13px] leading-relaxed'>{review.guideReply}</p>
        </div>
      ) : (
        <div className='border-cab-gold/40 bg-cab-gold/5 mt-3.5 flex flex-col gap-2.5 rounded-[10px] border border-dashed p-3 sm:flex-row sm:items-end'>
          <textarea
            value={reply}
            onChange={event => setReply(event.target.value)}
            rows={2}
            maxLength={1000}
            placeholder='Ответить на отзыв — ответ увидят все на странице тура'
            aria-label='Ответ на отзыв'
            className={cn(cabinetInput, 'resize-none')}
          />
          <button
            type='button'
            disabled={isSending || !reply.trim()}
            onClick={send}
            className={cabinetAction({ tone: 'gold', size: 'sm' })}
          >
            <Send className='size-4' />
            Ответить
          </button>
        </div>
      )}
    </article>
  );
};

/**
 * Отзывы гида.
 *
 * Отзыв открывается клиенту после выполненной заявки, оценок три —
 * работа гида, информация и маршрут. Ответить можно один раз: ответ
 * показывается под отзывом и на странице тура.
 */
export const GuideReviewsList: FC<{ summary: CabinetReviewsSummary }> = ({
  summary
}) => {
  const router = useRouter();
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  const visible = onlyUnanswered
    ? summary.reviews.filter(review => !review.guideReply)
    : summary.reviews;

  if (!summary.total) {
    return (
      <CabinetEmpty
        icon={<Star className='size-6' />}
        title='Отзывов пока нет'
        text='Отзыв открывается клиенту, когда заявка перешла в «Выполнена». Отмечайте завершённые выезды — так отзывы появятся быстрее.'
      />
    );
  }

  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start'>
      <div className='flex flex-col gap-3'>
        <button
          type='button'
          onClick={() => setOnlyUnanswered(value => !value)}
          className={cn(
            'self-start rounded-full border px-3.5 py-1.5 text-[12.5px]',
            onlyUnanswered
              ? 'border-cab-gold/45 bg-cab-gold/12 text-cab-ink'
              : 'border-cab-line bg-cab-raise text-cab-dim'
          )}
        >
          Только без ответа
          {!!summary.unanswered && (
            <span className='text-cab-gold ml-1.5 font-semibold'>
              {summary.unanswered}
            </span>
          )}
        </button>

        {visible.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            onReplied={() => router.refresh()}
          />
        ))}

        {!visible.length && (
          <CabinetEmpty
            icon={<Star className='size-6' />}
            title='Все отзывы отвечены'
            text='Ответ гида виден всем и поднимает доверие к карточке тура.'
          />
        )}
      </div>

      <aside className='flex flex-col gap-4'>
        <CabinetPanel>
          <span className='text-cab-mute text-[11.5px]'>Общая оценка</span>
          <div className='mt-1.5 flex items-baseline gap-2.5'>
            <b className='text-[40px] leading-none font-semibold tracking-tight'>
              {summary.rating.toFixed(1).replace('.', ',')}
            </b>
            <Stars value={summary.rating} />
          </div>
          <p className='text-cab-mute mt-1.5 text-[11.5px]'>
            {summary.total} отзывов, {summary.unanswered} без ответа
          </p>

          <div className='mt-3.5 flex flex-col gap-1.5'>
            {summary.distribution.map(item => (
              <span
                key={item.score}
                className='grid grid-cols-[24px_minmax(0,1fr)_28px] items-center gap-2.5 text-[11.5px]'
              >
                <span className='text-cab-faint'>{item.score}★</span>
                <span className='bg-cab-line block h-1.5 overflow-hidden rounded-full'>
                  <span
                    className='bg-cab-gold block h-full'
                    style={{
                      width: `${summary.total ? (item.count / summary.total) * 100 : 0}%`
                    }}
                  />
                </span>
                <span className='text-right text-[#c7c7cd]'>{item.count}</span>
              </span>
            ))}
          </div>
        </CabinetPanel>

        <CabinetPanel title='По критериям'>
          <div className='flex flex-col gap-2'>
            {CRITERIA.map(item => (
              <Bar
                key={item.id}
                label={item.label}
                value={summary.criteria[item.id]}
              />
            ))}
          </div>
          <p className='text-cab-mute mt-3 text-[11.5px] leading-relaxed'>
            Самая низкая оценка показывает, что чинить: «маршрут» правится
            расписанием и таймингом, «информация» — текстом тура.
          </p>
        </CabinetPanel>

        <CabinetPanel title='Как это работает'>
          <ul className='text-cab-dim flex flex-col gap-2 text-[12.5px] leading-relaxed'>
            <li>
              Отзыв открывается клиенту, когда заявка перешла в «Выполнена».
            </li>
            <li>
              Удалить отзыв нельзя — можно ответить. Ответ виден под отзывом и на
              странице тура.
            </li>
            <li>
              Если отзыв не о туре или оскорбительный — напишите администратору,
              он разберёт.
            </li>
          </ul>
        </CabinetPanel>
      </aside>
    </div>
  );
};
