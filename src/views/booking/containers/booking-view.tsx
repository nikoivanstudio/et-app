import Link from 'next/link';
import { FC } from 'react';

import { bookingService } from '@/features/booking/server';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';

type Props = {
  params: Promise<{ token: string }>;
};

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

const STATUS_HINT: Record<string, string> = {
  [BookingDomain.BookingStatus.NEW]:
    'Заявка отправлена. Гид скоро свяжется с вами по телефону.',
  [BookingDomain.BookingStatus.CONTACTED]:
    'Гид связался с вами и обрабатывает заявку.',
  [BookingDomain.BookingStatus.CONFIRMED]: 'Бронь подтверждена. До встречи на туре!',
  [BookingDomain.BookingStatus.COMPLETED]:
    'Тур завершён. Будем рады вашему отзыву!',
  [BookingDomain.BookingStatus.CANCELLED]: 'Заявка отменена.',
  [BookingDomain.BookingStatus.EXPIRED]: 'Срок заявки истёк.',
  [BookingDomain.BookingStatus.SPAM]: 'Заявка отклонена.'
};

const formatDate = (iso: string | null): string | null => {
  if (!iso) return null;

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));
};

const Row: FC<{ label: string; value?: string | null }> = ({
  label,
  value
}) =>
  value ? (
    <div className='flex items-center justify-between border-b border-[var(--rule)] py-2.5 last:border-0'>
      <span className='font-oswald text-[12px] tracking-wide text-[var(--ink-muted)]'>
        {label}
      </span>
      <span className='text-[14px] font-medium text-[var(--ink)]'>{value}</span>
    </div>
  ) : null;

export const BookingView: FC<Props> = async ({ params }) => {
  const { token } = await params;
  const either = await bookingService.getBookingByToken(token);

  if (either.type === 'left') {
    return (
      <div className='mx-auto max-w-md px-4 py-24 text-center font-caladea text-[var(--ink-muted)]'>
        Заявка не найдена. Проверьте ссылку.
      </div>
    );
  }

  const booking = either.value;
  const status = booking.status;

  return (
    <div className='mx-auto max-w-md px-4 pb-12 pt-24 font-caladea'>
      <span
        className={cn(
          'inline-block rounded-full border px-3 py-1 font-oswald text-[12px] tracking-wide',
          STATUS_STYLE[status]
        )}
      >
        {BookingDomain.BOOKING_STATUS_LABELS[status] ?? status}
      </span>

      <h1 className='mt-3 font-poiret text-[26px] leading-tight tracking-wide text-[var(--ink)]'>
        Заявка на тур
      </h1>
      <p className='mt-2 text-[14px] text-[var(--ink-muted)]'>{STATUS_HINT[status]}</p>

      <div className='mt-5 rounded-3xl border border-[var(--rule)] bg-white p-5'>
        <Link
          href={`/tour/${booking.tour.slug}`}
          className='font-poiret text-[18px] tracking-wide text-[var(--ink)] underline-offset-2 hover:underline'
        >
          {booking.tour.title}
        </Link>

        <div className='mt-3'>
          <Row label='Дата' value={formatDate(booking.desiredDate)} />
          <Row label='Гостей' value={`${booking.peopleCount} чел.`} />
          <Row label='Имя' value={booking.guestName} />
          <Row label='Телефон' value={booking.guestPhone} />
          {booking.guide && <Row label='Гид' value={booking.guide.displayName} />}
          <Row label='Заявка создана' value={formatDate(booking.createdAt)} />
          {status === BookingDomain.BookingStatus.CANCELLED && (
            <Row label='Причина' value={booking.cancelReason} />
          )}
        </div>
      </div>

      {booking.guide && (
        <Link
          href={`/guide/${booking.guide.slug}`}
          className='mt-4 block rounded-block border border-[var(--rule)] bg-[var(--cream)] px-4 py-3 text-center font-oswald text-[14px] tracking-wide text-[var(--gold-head)]'
        >
          Профиль гида · {booking.guide.displayName}
        </Link>
      )}

      <p className='mt-6 text-center text-[12px] text-[#9b8e72]'>
        Чат с гидом появится здесь в ближайшее время.
      </p>
    </div>
  );
};
