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
          'flex items-center justify-center gap-2 rounded-2xl bg-[#B8915A] px-5 py-3.5',
          'font-[Oswald,sans-serif] tracking-wide text-[#FBF7EE] transition-transform hover:-translate-y-0.5',
          className
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <CalendarHeart className='size-5' />
        Забронировать
      </DialogTrigger>

      <DialogContent className='max-w-md border-[#E2D5B7] bg-white'>
        {result ? (
          <div className='py-2 text-center font-[Caladea,serif]'>
            <div className='mx-auto grid size-16 place-items-center rounded-full border border-[#5C7A2E]/30 bg-[#5C7A2E]/10 text-3xl text-[#5C7A2E]'>
              <Check className='size-8' />
            </div>
            <h3 className='mt-3 font-[Century_Gothic,Questrial,sans-serif] text-[22px] tracking-wide text-[#1F1A12]'>
              Заявка отправлена!
            </h3>
            <p className='mt-2 text-[13.5px] text-[#6B5F47]'>
              Гид <b className='text-[#1F1A12]'>{result.guideName}</b> получил
              вашу заявку и скоро свяжется с вами.
            </p>

            <button
              type='button'
              onClick={onCopy}
              className='mt-4 flex w-full items-center gap-2 rounded-xl border border-dashed border-[#B8915A] bg-[#FBF7EE] px-3 py-2.5 text-left font-[Oswald,sans-serif] text-[12.5px] text-[#8B6F3D]'
            >
              🔗 <span className='flex-1 truncate'>{bookingPath}</span>
              <Copy className='size-4 shrink-0' />
            </button>

            <p className='mt-3 text-left text-[12px] text-[#6B5F47]'>
              По этой ссылке вы сможете отслеживать статус заявки. Мы сохранили
              её на этом устройстве.
            </p>

            <Link
              href={bookingPath}
              className='mt-4 block w-full rounded-2xl bg-[#B8915A] px-4 py-3 font-[Oswald,sans-serif] tracking-wide text-[#FBF7EE]'
            >
              Перейти к заявке
            </Link>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className='font-[Century_Gothic,Questrial,sans-serif] text-[21px] font-normal tracking-wide text-[#1F1A12]'>
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
