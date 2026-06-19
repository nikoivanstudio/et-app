'use client';

import { ChevronDown } from 'lucide-react';
import { FC, useState } from 'react';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';
import { Spinner } from '@/shared/ui/spinner';

import { useAllBookings, useUpdateBooking } from '../hooks/use-bookings';
import { BookingCard } from '../ui/booking-card';

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');

const GuideGroup: FC<{
  group: BookingDomain.GuideBookingsGroup;
  isPending: boolean;
  onAction: ReturnType<typeof useUpdateBooking>['update'];
}> = ({ group, isPending, onAction }) => {
  const [open, setOpen] = useState(group.newCount > 0);

  return (
    <div className='overflow-hidden rounded-xl border border-[#2C2C33] bg-[#1B1B1F]'>
      <button
        type='button'
        onClick={() => setOpen(v => !v)}
        className='flex w-full items-center gap-3 bg-[#202026] px-3.5 py-3 text-left'
      >
        <span className='grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#caa66a] to-[#7d6234] text-[12px] font-semibold text-white'>
          {initials(group.guide.displayName)}
        </span>
        <span>
          <span className='block text-[13.5px] font-semibold text-zinc-100'>
            {group.guide.displayName}
          </span>
          <span className='block text-[11px] text-zinc-500'>
            {group.guide.rating ? `★ ${group.guide.rating} · ` : ''}
            {group.total} заявок
          </span>
        </span>
        <span
          className={cn(
            'ml-auto rounded-full border px-2.5 py-1 text-[11px]',
            group.newCount
              ? 'border-[#d19331]/40 bg-[#d19331]/10 text-[#e0a955]'
              : 'border-[#2C2C33] bg-[#0C0C0E] text-zinc-500'
          )}
        >
          {group.newCount ? `${group.newCount} новых` : 'нет новых'}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-zinc-500 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <ul className='space-y-2.5 p-3'>
          {group.bookings.map(booking => (
            <li key={booking.id}>
              <BookingCard
                booking={booking}
                isPending={isPending}
                onAction={onAction}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const AdminBookingsList: FC = () => {
  const { data, isLoading, isFetching, error } = useAllBookings();
  const { update, isPending } = useUpdateBooking();

  if (isLoading) {
    return (
      <div className='flex min-h-48 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-400'>{error.message}</div>;
  }

  const groups = data?.groups ?? [];

  if (!groups.length) {
    return (
      <div className='py-10 text-center text-sm text-zinc-500'>Заявок пока нет</div>
    );
  }

  return (
    <div className={cn('space-y-3', isFetching && 'opacity-60')}>
      {groups.map(group => (
        <GuideGroup
          key={group.guide.id}
          group={group}
          isPending={isPending}
          onAction={update}
        />
      ))}
    </div>
  );
};
