'use client';

import { CalendarHeart, Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';

import { CreateBookingResult } from '../hooks/use-create-booking';
import { BookingForm } from '../ui/booking-form';

type Props = {
  tourId: number;
  priceLabel?: string;
  className?: string;
};

// Сохраняем токен заявки на устройстве — «мои брони».
const rememberBooking = (token: string) => {
  if (!token) return;
  try {
    const key = 'my-bookings';
    const list = JSON.parse(localStorage.getItem(key) || '[]') as string[];

    if (!list.includes(token)) {
      localStorage.setItem(key, JSON.stringify([token, ...list].slice(0, 50)));
    }
  } catch {
    // localStorage недоступен — не критично
  }
};

export const BookingButton: FC<Props> = ({ tourId, priceLabel, className }) => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<CreateBookingResult | null>(null);

  const bookingPath = result ? `/booking/${result.accessToken}` : '';

  const onSuccess = (data: CreateBookingResult) => {
    rememberBooking(data.accessToken);
    setResult(data);
  };

  const onCopy = () => {
    navigator.clipboard
      ?.writeText(`${window.location.origin}${bookingPath}`)
      .then(() => toast.success('Ссылка скопирована'))
      .catch(() => undefined);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className={[
          'flex min-h-12 items-center justify-center gap-2 rounded-pill bg-cta px-6',
          'font-oswald text-base font-medium tracking-wide text-on-cta transition-colors hover:bg-cta-press',
          className
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <CalendarHeart className='size-5' />
        Забронировать
      </DialogTrigger>

      <DialogContent className='max-w-md border-[var(--rule)] bg-white'>
        {result ? (
          <div className='py-2 text-center font-caladea'>
            <div className='mx-auto grid size-16 place-items-center rounded-full border border-free-ink/30 bg-free-bg text-3xl text-free-ink'>
              <Check className='size-8' />
            </div>
            <h3 className='mt-3 font-poiret text-[22px] tracking-wide text-[var(--ink)]'>
              Заявка отправлена!
            </h3>
            <p className='mt-2 text-[13.5px] text-[var(--ink-muted)]'>
              Гид <b className='text-[var(--ink)]'>{result.guideName}</b>{' '}
              получил вашу заявку и скоро свяжется с вами.
            </p>

            <button
              type='button'
              onClick={onCopy}
              className='mt-4 flex w-full items-center gap-2 rounded-block border border-dashed border-[var(--cta)] bg-[var(--cream)] px-3 py-2.5 text-left font-oswald text-[12.5px] text-[var(--gold-head)]'
            >
              🔗 <span className='flex-1 truncate'>{bookingPath}</span>
              <Copy className='size-4 shrink-0' />
            </button>

            <p className='mt-3 text-left text-[12px] text-[var(--ink-muted)]'>
              По этой ссылке вы сможете отслеживать статус заявки. Мы сохранили
              её на этом устройстве.
            </p>

            <Link
              href={bookingPath}
              className='mt-4 block w-full min-h-12 rounded-pill bg-cta px-4 font-oswald text-base font-medium tracking-wide text-on-cta hover:bg-cta-press'
            >
              Перейти к заявке
            </Link>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className='font-poiret text-[21px] font-normal tracking-wide text-[var(--ink)]'>
                Заявка на тур
              </DialogTitle>
            </DialogHeader>
            <BookingForm
              tourId={tourId}
              priceLabel={priceLabel}
              onSuccess={onSuccess}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
