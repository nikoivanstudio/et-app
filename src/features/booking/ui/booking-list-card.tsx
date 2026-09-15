'use client';

import { CalendarDays, MessageSquare, Users } from 'lucide-react';
import { FC } from 'react';

import { bookingChip, formatAgo, formatDate } from '@/features/cabinet/lib/format';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';
import { Chip } from '@/shared/ui/cabinet';

/**
 * Строка списка заявок: всё, по чему гид выбирает, какую открыть — имя,
 * статус, тур, дата, число гостей и есть ли непрочитанное.
 */
export const BookingListCard: FC<{
  booking: BookingDomain.BookingListItem;
  isActive: boolean;
  onSelect: (id: number) => void;
}> = ({ booking, isActive, onSelect }) => {
  const chip = bookingChip(booking.status);
  const isClosed = BookingDomain.TERMINAL_BOOKING_STATUSES.includes(
    booking.status
  );

  return (
    <button
      type='button'
      onClick={() => onSelect(booking.id)}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-colors',
        isActive
          ? 'border-cab-gold/50 from-cab-gold/8 to-cab-panel bg-linear-120 shadow-[0_0_0_1px_rgba(232,176,85,0.18)]'
          : 'border-cab-line bg-cab-panel hover:border-cab-line/80',
        isClosed && !isActive && 'opacity-60'
      )}
    >
      <div className='flex items-center gap-2.5'>
        <span className='text-[13.5px] font-semibold'>{booking.guestName}</span>
        <Chip tone={chip.tone} className='ml-auto'>
          {chip.label}
        </Chip>
      </div>

      <p className='text-cab-mute mt-1 text-[11.5px]'>
        {formatAgo(booking.createdAt)} · № {booking.id}
      </p>

      <p className='mt-2.5 line-clamp-2 text-[13px]'>{booking.tour.title}</p>

      <div className='text-cab-faint mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]'>
        <span className='flex items-center gap-1.5'>
          <CalendarDays className='size-3.5' />
          {formatDate(booking.desiredDate)}
        </span>
        <span className='flex items-center gap-1.5'>
          <Users className='size-3.5' />
          {booking.peopleCount} чел.
        </span>
        {!!booking.unreadCount && (
          <span className='text-cab-gold flex items-center gap-1.5'>
            <MessageSquare className='size-3.5' />
            {booking.unreadCount}
          </span>
        )}
      </div>

      {!!booking.comment && (
        <p className='border-cab-line bg-cab-raise text-cab-dim mt-2.5 line-clamp-2 rounded-[10px] border-l-2 px-3 py-2 text-[12.5px]'>
          «{booking.comment}»
        </p>
      )}
    </button>
  );
};
