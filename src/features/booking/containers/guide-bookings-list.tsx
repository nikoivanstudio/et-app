'use client';

import { FC, useMemo, useState } from 'react';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';
import { Spinner } from '@/shared/ui/spinner';

import { useGuideBookings, useUpdateBooking } from '../hooks/use-bookings';
import { BookingCard } from '../ui/booking-card';

const { BookingStatus } = BookingDomain;

const TABS: { id: string; label: string; statuses: string[] }[] = [
  { id: 'new', label: 'Новые', statuses: [BookingStatus.NEW] },
  { id: 'work', label: 'В работе', statuses: [BookingStatus.CONTACTED] },
  {
    id: 'confirmed',
    label: 'Подтверждённые',
    statuses: [BookingStatus.CONFIRMED]
  },
  {
    id: 'archive',
    label: 'Архив',
    statuses: [
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
      BookingStatus.EXPIRED,
      BookingStatus.SPAM
    ]
  }
];

export const GuideBookingsList: FC = () => {
  const { data, isLoading, isFetching, error } = useGuideBookings();
  const { update, isPending } = useUpdateBooking();
  const [tab, setTab] = useState('new');

  const bookings = useMemo(() => data?.bookings ?? [], [data]);

  const countByTab = (statuses: string[]) =>
    bookings.filter(b => statuses.includes(b.status)).length;

  const active = TABS.find(t => t.id === tab) ?? TABS[0];
  const visible = bookings.filter(b => active.statuses.includes(b.status));

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

  return (
    <div>
      <div className='mb-3 flex flex-wrap gap-2'>
        {TABS.map(t => {
          const count = countByTab(t.statuses);

          return (
            <button
              key={t.id}
              type='button'
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-[12px]',
                t.id === tab
                  ? 'border-[#d19331]/40 bg-[#d19331]/12 text-zinc-100'
                  : 'border-[#2C2C33] bg-[#1B1B1F] text-zinc-400'
              )}
            >
              {t.label}
              {!!count && (
                <span
                  className={cn(
                    'ml-1.5 font-semibold',
                    t.id === 'new' ? 'text-[#e0a955]' : 'text-zinc-300'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <ul className={cn('space-y-2.5', isFetching && 'opacity-60')}>
          {visible.map(booking => (
            <li key={booking.id}>
              <BookingCard
                booking={booking}
                isPending={isPending}
                onAction={update}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className='py-10 text-center text-sm text-zinc-500'>
          Заявок в этой вкладке нет
        </div>
      )}
    </div>
  );
};
