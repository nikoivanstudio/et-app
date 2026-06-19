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
    'bg-[#FBF7EE] text-[#8B6F3D] border-[#B8915A]',
  [BookingDomain.BookingStatus.CONTACTED]:
    'bg-[#eaf2fb] text-[#3b6ea5] border-[#9cc0e6]',
  [BookingDomain.BookingStatus.CONFIRMED]:
    'bg-[#eef4e6] text-[#5C7A2E] border-[#a7c178]',
  [BookingDomain.BookingStatus.COMPLETED]:
    'bg-[#f0ede6] text-[#6B5F47] border-[#cabfa3]',
  [BookingDomain.BookingStatus.CANCELLED]:
    'bg-[#fbecea] text-[#b4452f] border-[#e0a99c]',
  [BookingDomain.BookingStatus.EXPIRED]:
    'bg-[#f0ede6] text-[#6B5F47] border-[#cabfa3]',
  [BookingDomain.BookingStatus.SPAM]:
    'bg-[#fbecea] text-[#b4452f] border-[#e0a99c]'
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
    <div className='flex items-center justify-between border-b border-[#E2D5B7] py-2.5 last:border-0'>
      <span className='font-[Oswald,sans-serif] text-[12px] tracking-wide text-[#6B5F47]'>
        {label}
      </span>
      <span className='text-[14px] font-medium text-[#1F1A12]'>{value}</span>
    </div>
  ) : null;

export const BookingView: FC<Props> = async ({ params }) => {
  const { token } = await params;
  const either = await bookingService.getBookingByToken(token);

  if (either.type === 'left') {
    return (
      <div className='mx-auto max-w-md px-4 py-24 text-center font-[Caladea,serif] text-[#6B5F47]'>
        Заявка не найдена. Проверьте ссылку.
      </div>
    );
  }

  const booking = either.value;
  const status = booking.status;

  return (
    <div className='mx-auto max-w-md px-4 pb-12 pt-24 font-[Caladea,serif]'>
      <span
        className={cn(
          'inline-block rounded-full border px-3 py-1 font-[Oswald,sans-serif] text-[12px] tracking-wide',
          STATUS_STYLE[status]
        )}
      >
        {BookingDomain.BOOKING_STATUS_LABELS[status] ?? status}
      </span>

      <h1 className='mt-3 font-[Century_Gothic,Questrial,sans-serif] text-[26px] leading-tight tracking-wide text-[#1F1A12]'>
        Заявка на тур
      </h1>
      <p className='mt-2 text-[14px] text-[#6B5F47]'>{STATUS_HINT[status]}</p>

      <div className='mt-5 rounded-3xl border border-[#E2D5B7] bg-white p-5'>
        <Link
          href={`/tour/${booking.tour.slug}`}
          className='font-[Century_Gothic,Questrial,sans-serif] text-[18px] tracking-wide text-[#1F1A12] underline-offset-2 hover:underline'
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
          className='mt-4 block rounded-2xl border border-[#E2D5B7] bg-[#FBF7EE] px-4 py-3 text-center font-[Oswald,sans-serif] text-[14px] tracking-wide text-[#8B6F3D]'
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
