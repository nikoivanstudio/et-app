import { FC } from 'react';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';

const TONE: Record<string, string> = {
  [BookingDomain.BookingStatus.NEW]:
    'bg-[#d19331]/15 text-[#e0a955] border-[#d19331]/40',
  [BookingDomain.BookingStatus.CONTACTED]:
    'bg-sky-500/15 text-sky-300 border-sky-500/35',
  [BookingDomain.BookingStatus.CONFIRMED]:
    'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  [BookingDomain.BookingStatus.COMPLETED]:
    'bg-zinc-500/15 text-zinc-300 border-zinc-500/35',
  [BookingDomain.BookingStatus.CANCELLED]:
    'bg-red-500/15 text-red-300 border-red-500/35',
  [BookingDomain.BookingStatus.EXPIRED]:
    'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  [BookingDomain.BookingStatus.SPAM]:
    'bg-red-500/15 text-red-300 border-red-500/35'
};

export const BookingStatusBadge: FC<{ status: string; className?: string }> = ({
  status,
  className
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide',
      TONE[status] ?? TONE[BookingDomain.BookingStatus.EXPIRED],
      className
    )}
  >
    {BookingDomain.isNewBooking(status) && '● '}
    {(BookingDomain.BOOKING_STATUS_LABELS[status] ?? status).toUpperCase()}
  </span>
);
