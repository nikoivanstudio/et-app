import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Inbox,
  MapPin,
  Route,
  Star,
  Users,
  Wallet
} from 'lucide-react';
import Image from 'next/image';
import { FC, ReactNode } from 'react';

import {
  DIFFICULTY_LABELS,
  formatDuration,
  formatMoney,
  formatPriceUnit,
  formatSeasons,
  plural,
  tourChip
} from '@/features/cabinet/lib/format';
import { TourCardActions } from '@/features/tour-editor';
import { CabinetTourItem } from '@/features/tour-editor/server';

import { cn } from '@/shared/lib/css';
import { CabinetNote, Chip } from '@/shared/ui/cabinet';

const Fact: FC<{ icon: ReactNode; children: ReactNode }> = ({
  icon,
  children
}) => (
  <span className='border-cab-line bg-cab-raise inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] text-[#c7c7cd]'>
    {icon}
    {children}
  </span>
);

/**
 * Карточка тура в кабинете.
 *
 * Кроме статуса показывает, чего в туре не хватает: именно эти поля собирают
 * публичную страницу, и из-за них тур возвращается с модерации.
 */
export const CabinetTourCard: FC<{ userId: number; tour: CabinetTourItem }> = ({
  userId,
  tour
}) => {
  const chip = tourChip(tour.status);

  return (
    <article className='border-cab-line bg-cab-panel grid gap-4 rounded-2xl border p-4 lg:grid-cols-[196px_minmax(0,1fr)_200px]'>
      <div className='border-cab-line relative h-32 overflow-hidden rounded-xl border lg:h-full'>
        {tour.cover ? (
          <Image
            src={tour.cover}
            alt={tour.title}
            fill
            sizes='196px'
            className='object-cover'
          />
        ) : (
          <span className='text-cab-mute flex h-full items-center justify-center text-[12px]'>
            Без фото
          </span>
        )}
      </div>

      <div className='min-w-0'>
        <div className='flex flex-wrap items-center gap-2.5'>
          <h3 className='text-[15px] font-semibold'>{tour.title}</h3>
          <Chip tone={chip.tone}>{chip.label}</Chip>
        </div>

        <div className='mt-2.5 flex flex-wrap gap-2'>
          {!!tour.startCity && (
            <Fact icon={<MapPin className='size-3.5' />}>{tour.startCity}</Fact>
          )}
          <Fact icon={<Clock className='size-3.5' />}>
            {formatDuration(tour.durationHours * 3600)}
          </Fact>
          <Fact icon={<Wallet className='size-3.5' />}>
            {formatMoney(tour.price)}{' '}
            <span className='text-cab-mute'>
              {formatPriceUnit(tour.priceUnit)}
            </span>
          </Fact>
          {!!tour.capacity && (
            <Fact icon={<Users className='size-3.5' />}>
              до {tour.capacity} чел.
            </Fact>
          )}
          {!!tour.difficulty && (
            <Fact icon={<Route className='size-3.5' />}>
              {DIFFICULTY_LABELS[tour.difficulty] ?? tour.difficulty}
            </Fact>
          )}
          <Fact icon={<CalendarDays className='size-3.5' />}>
            {formatSeasons(tour.seasons)}
          </Fact>
        </div>

        <div className='text-cab-faint mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]'>
          <span className='flex items-center gap-1.5'>
            <Star className='size-3.5' />
            {tour.reviewsCount
              ? `${tour.rating?.toFixed(1).replace('.', ',') ?? '—'} · ${tour.reviewsCount} ${plural(tour.reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}`
              : 'Отзывов пока нет'}
          </span>
          <span className='flex items-center gap-1.5'>
            <Inbox className='size-3.5' />
            {tour.bookingsCount}{' '}
            {plural(tour.bookingsCount, ['заявка', 'заявки', 'заявок'])} за 30
            дней
          </span>
          {tour.completeness < 100 && (
            <span className='text-cab-gold flex items-center gap-1.5'>
              <AlertTriangle className='size-3.5' />
              Карточка заполнена на {tour.completeness}%
            </span>
          )}
        </div>

        {!!tour.rejectionComment && (
          <CabinetNote tone='bad' className='mt-3'>
            <AlertTriangle className='mt-0.5 size-3.5 shrink-0' />
            <span>
              Причина отклонения: {tour.rejectionComment}
            </span>
          </CabinetNote>
        )}

        {!tour.rejectionComment && tour.missing.length > 0 && (
          <CabinetNote tone='gold' className='mt-3'>
            <AlertTriangle className='mt-0.5 size-3.5 shrink-0' />
            <span>
              Не заполнено: {tour.missing.join(', ').toLowerCase()}. На странице
              тура эти блоки просто не показываются.
            </span>
          </CabinetNote>
        )}
      </div>

      <TourCardActions
        userId={userId}
        tourId={tour.id}
        slug={tour.slug}
        status={tour.status}
        canPublish={tour.completeness >= 100 || !tour.missing.length}
      />
    </article>
  );
};

export const tourMatchesFilter = (
  tour: CabinetTourItem,
  filter?: string
): boolean => {
  if (!filter || filter === 'all') return true;
  if (filter === 'draft') return !tour.status;

  return tour.status === filter;
};

export const tourFilterClass = (isActive: boolean): string =>
  cn(
    'rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors',
    isActive
      ? 'border-cab-gold/45 bg-cab-gold/12 text-cab-ink'
      : 'border-cab-line bg-cab-raise text-cab-dim hover:text-cab-ink'
  );
