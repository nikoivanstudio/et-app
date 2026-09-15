'use client';

import { Copy, Eye, Pencil, Power, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

import { TourStatus } from '@/entities/tour/domain';

import { cabinetAction } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { useTourActions, useTourStatus } from '../hooks/use-tour-editor';

/**
 * Быстрые действия над туром в списке.
 *
 * Набор зависит от статуса: опубликованный можно снять с публикации,
 * отклонённый — исправить и отправить снова, черновик — отправить на проверку.
 */
export const TourCardActions: FC<{
  userId: number;
  tourId: number;
  slug: string;
  status: string | null;
  canPublish: boolean;
}> = ({ userId, tourId, slug, status, canPublish }) => {
  const { setStatus, isPending: isStatusPending } = useTourStatus();
  const { remove, duplicate, isPending } = useTourActions(userId);
  const [confirming, setConfirming] = useState(false);

  const isApproved = status === TourStatus.APPROVED;
  const isPendingReview = status === TourStatus.PENDING;

  return (
    <div className='flex flex-wrap gap-2 lg:flex-col lg:items-stretch'>
      <Link
        href={routes.cabinet.tourEditor(userId, tourId)}
        className={cabinetAction({ tone: 'solid', size: 'sm' })}
      >
        <Pencil className='size-4' />
        Редактировать
      </Link>

      {isApproved && (
        <Link
          href={routes.tour(slug)}
          className={cabinetAction({ tone: 'line', size: 'sm' })}
        >
          <Eye className='size-4' />
          На сайте
        </Link>
      )}

      {/* Тур на проверке уже отправлен: второй раз отправлять нечего,
          а вот вернуть его в черновик и дописать — обычное дело. */}
      {isPendingReview && (
        <button
          type='button'
          disabled={isStatusPending}
          onClick={() => setStatus({ id: tourId, status: 'DRAFT' })}
          className={cabinetAction({ tone: 'line', size: 'sm' })}
        >
          <Power className='size-4' />
          Вернуть в черновик
        </button>
      )}

      {!isApproved && !isPendingReview && (
        <button
          type='button'
          disabled={isStatusPending || !canPublish}
          title={
            canPublish
              ? undefined
              : 'Сначала заполните обязательные поля в редакторе'
          }
          onClick={() => setStatus({ id: tourId, status: TourStatus.PENDING })}
          className={cabinetAction({ tone: 'gold', size: 'sm' })}
        >
          <Send className='size-4' />
          Отправить на проверку
        </button>
      )}

      {isApproved && (
        <button
          type='button'
          disabled={isStatusPending}
          onClick={() => setStatus({ id: tourId, status: 'DRAFT' })}
          className={cabinetAction({ tone: 'line', size: 'sm' })}
        >
          <Power className='size-4' />
          Снять с публикации
        </button>
      )}

      <button
        type='button'
        disabled={isPending}
        onClick={() => duplicate(tourId)}
        className={cabinetAction({ tone: 'line', size: 'sm' })}
      >
        <Copy className='size-4' />
        Дублировать
      </button>

      {confirming ? (
        <span className='flex gap-2'>
          <button
            type='button'
            disabled={isPending}
            onClick={() => remove(tourId)}
            className={cabinetAction({ tone: 'bad', size: 'sm' })}
          >
            Удалить навсегда
          </button>
          <button
            type='button'
            onClick={() => setConfirming(false)}
            className={cabinetAction({ tone: 'line', size: 'sm' })}
          >
            Отмена
          </button>
        </span>
      ) : (
        <button
          type='button'
          onClick={() => setConfirming(true)}
          className={cabinetAction({ tone: 'line', size: 'sm' })}
        >
          <Trash2 className='size-4' />
          Удалить
        </button>
      )}
    </div>
  );
};
