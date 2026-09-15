'use client';

import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { useLocalBookings } from '@/features/booking/hooks/use-local-bookings';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';

const STATUS_STYLE: Record<string, string> = {
  [BookingDomain.BookingStatus.NEW]:
    'bg-[var(--cream)] text-[var(--gold-head)] border-[var(--cta)]',
  [BookingDomain.BookingStatus.CONTACTED]:
    'bg-[#eaf2fb] text-[#3b6ea5] border-[#9cc0e6]',
  [BookingDomain.BookingStatus.CONFIRMED]:
    'bg-[#eef4e6] text-[var(--free-ink)] border-[#a7c178]',
  [BookingDomain.BookingStatus.COMPLETED]:
    'bg-[#f0ede6] text-[var(--ink-muted)] border-[#cabfa3]',
  [BookingDomain.BookingStatus.CANCELLED]:
    'bg-[#fbecea] text-[var(--alert-ink)] border-[#e0a99c]',
  [BookingDomain.BookingStatus.EXPIRED]:
    'bg-[#f0ede6] text-[var(--ink-muted)] border-[#cabfa3]',
  [BookingDomain.BookingStatus.SPAM]:
    'bg-[#fbecea] text-[var(--alert-ink)] border-[#e0a99c]'
};

const formatDate = (iso: string | null): string | null =>
  iso
    ? new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(new Date(iso))
    : null;

const Empty: FC = () => (
  <div className='rounded-3xl border border-[var(--rule)] bg-white p-6 text-center'>
    <p className='text-[14px] text-[var(--ink)]'>
      На этом устройстве заявок нет.
    </p>
    <p className='mt-2 text-[13px] leading-relaxed text-[var(--ink-muted)]'>
      Список собирается в браузере. Если вы оставляли заявку с другого
      устройства, откройте ссылку из письма — мы отправляем её сразу после
      отправки заявки.
    </p>
    <Link
      href='/tours'
      className='mt-4 inline-flex min-h-12 items-center rounded-pill bg-cta px-6 font-oswald text-base font-medium tracking-wide text-on-cta hover:bg-cta-press'
    >
      Смотреть туры
    </Link>
  </div>
);

/**
 * Список заявок этого устройства.
 *
 * Единственная страница, с которой гость может вернуться в переписку,
 * не имея на руках ссылки с токеном: токены лежат в его же браузере,
 * а статусы и непрочитанное подтягиваются с сервера.
 */
export const MyBookingsView: FC = () => {
  const { bookings, hasTokens, isLoading, error } = useLocalBookings();

  return (
    <div className='mx-auto max-w-md px-4 pb-12 pt-24 font-caladea'>
      <h1 className='font-poiret text-[26px] leading-tight tracking-wide text-[var(--ink)]'>
        Мои заявки
      </h1>
      <p className='mt-2 text-[13.5px] text-[var(--ink-muted)]'>
        Заявки, оставленные из этого браузера, и переписка с гидами по ним.
      </p>

      <div className='mt-5 space-y-3'>
        {isLoading && (
          <p className='text-[13.5px] text-[var(--ink-muted)]'>Загружаем…</p>
        )}

        {!isLoading && !!error && (
          <p className='rounded-control bg-alert-bg px-3 py-2 text-[13px] text-alert-ink'>
            {error.message}
          </p>
        )}

        {!isLoading && !error && !hasTokens && <Empty />}

        {!isLoading && !error && hasTokens && !bookings.length && (
          <p className='text-[13.5px] text-[var(--ink-muted)]'>
            Заявки не найдены — возможно, они уже удалены.
          </p>
        )}

        {bookings.map(booking => (
          <Link
            key={booking.id}
            href={`/booking/${booking.accessToken}`}
            className='block rounded-3xl border border-[var(--rule)] bg-white p-4 transition-colors hover:border-[var(--cta)]'
          >
            <div className='flex items-center gap-2'>
              <span
                className={cn(
                  'inline-block rounded-full border px-2.5 py-0.5 font-oswald text-[11.5px] tracking-wide',
                  STATUS_STYLE[booking.status]
                )}
              >
                {BookingDomain.BOOKING_STATUS_LABELS[booking.status] ??
                  booking.status}
              </span>
              {!!booking.unreadCount && (
                <span className='ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--cta)] px-2 py-0.5 font-oswald text-[11.5px] text-on-cta'>
                  <MessageSquare className='size-3' />
                  {booking.unreadCount}
                </span>
              )}
            </div>

            <p className='mt-2 font-poiret text-[18px] tracking-wide text-[var(--ink)]'>
              {booking.tour.title}
            </p>

            <p className='mt-1 text-[12.5px] text-[var(--ink-muted)]'>
              {formatDate(booking.desiredDate) ?? 'дата не выбрана'} ·{' '}
              {booking.peopleCount} чел.
              {!!booking.guide && ` · ${booking.guide.displayName}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
