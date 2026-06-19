'use client';

import {
  CalendarClock,
  Check,
  Flag,
  Phone,
  StickyNote,
  X
} from 'lucide-react';
import { FC, useState } from 'react';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

import { UpdateBookingPayload } from '../model/schemas';

import { BookingStatusBadge } from './booking-status-badge';

type Action = BookingDomain.BookingActionType;

type Props = {
  booking: BookingDomain.BookingListItem;
  isPending: boolean;
  onAction: (payload: UpdateBookingPayload) => void;
};

const TERMINAL = [
  BookingDomain.BookingStatus.COMPLETED,
  BookingDomain.BookingStatus.CANCELLED,
  BookingDomain.BookingStatus.EXPIRED,
  BookingDomain.BookingStatus.SPAM
];

const formatDate = (iso: string | null): string =>
  iso
    ? new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(iso))
    : '—';

const formatAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);

  if (min < 1) return 'только что';
  if (min < 60) return `${min} мин назад`;

  const hours = Math.round(min / 60);

  if (hours < 24) return `${hours} ч назад`;

  return `${Math.round(hours / 24)} дн назад`;
};

const Cell: FC<{ label: string; value: string; accent?: boolean }> = ({
  label,
  value,
  accent
}) => (
  <span className='text-[12.5px] text-zinc-400'>
    {label}
    <b
      className={cn(
        'mt-0.5 block text-[13px] font-semibold',
        accent ? 'text-sky-300' : 'text-zinc-100'
      )}
    >
      {value}
    </b>
  </span>
);

const btn =
  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] transition-colors disabled:opacity-50';

export const BookingCard: FC<Props> = ({ booking, isPending, onAction }) => {
  const { status } = booking;
  const isNew = BookingDomain.isNewBooking(status);
  const isTerminal = TERMINAL.includes(status as BookingDomain.BookingStatus);

  // Диалог для действий, требующих ввода (причина/дата/заметка).
  const [dialog, setDialog] = useState<{
    action: Action;
    title: string;
    field: 'reason' | 'note' | 'date';
  } | null>(null);
  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  const act = (action: Action, extra?: Partial<UpdateBookingPayload>) =>
    onAction({ id: booking.id, action, ...extra });

  const openDialog = (
    action: Action,
    title: string,
    field: 'reason' | 'note' | 'date'
  ) => {
    setText(field === 'note' ? booking.guideNote ?? '' : '');
    setDate('');
    setDialog({ action, title, field });
  };

  const submitDialog = () => {
    if (!dialog) return;

    if (dialog.field === 'date') {
      if (!date) return;
      act('reschedule', { desiredDate: date });
    } else if (dialog.field === 'reason') {
      act(dialog.action, { reason: text });
    } else {
      act('note', { note: text });
    }
    setDialog(null);
  };

  return (
    <div
      className={cn(
        'relative rounded-xl border bg-[#1B1B1F] p-3.5',
        isNew
          ? 'border-[#d19331]/55 shadow-[0_0_0_1px_rgba(209,147,49,0.25)]'
          : 'border-[#2C2C33]'
      )}
    >
      {isNew && (
        <span className='absolute left-0 top-3.5 bottom-3.5 w-[3px] rounded-r bg-[#d19331]' />
      )}

      <div className='mb-2.5 flex items-center gap-2.5'>
        <span className='text-[14.5px] font-semibold text-zinc-100'>
          {booking.guestName}
        </span>
        <BookingStatusBadge status={status} />
        <span className='ml-auto text-[11.5px] text-zinc-500'>
          {formatAgo(booking.createdAt)}
        </span>
      </div>

      <div className='mb-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4'>
        <Cell label='Тур' value={booking.tour.title} />
        <Cell label='Дата' value={formatDate(booking.desiredDate)} />
        <Cell label='Гостей' value={`${booking.peopleCount} чел.`} />
        <Cell label='Телефон' value={booking.guestPhone} />
      </div>

      {!!booking.comment && (
        <p className='mb-3 rounded-lg bg-[#202026] px-3 py-2 text-[12.5px] text-zinc-300'>
          «{booking.comment}»
        </p>
      )}
      {!!booking.cancelReason && (
        <p className='mb-3 text-[12px] text-red-300/90'>
          Причина отмены: {booking.cancelReason}
        </p>
      )}
      {!!booking.guideNote && (
        <p className='mb-3 text-[12px] text-amber-300/80'>
          📝 {booking.guideNote}
        </p>
      )}

      {!isTerminal && (
        <div className='flex flex-wrap gap-2'>
          {isNew && (
            <a
              href={`tel:${booking.guestPhone.replace(/[^\d+]/g, '')}`}
              onClick={() => act('contact')}
              className={cn(
                btn,
                'border-[#d19331] bg-[#d19331] font-semibold text-[#1c1305]'
              )}
            >
              <Phone className='size-3.5' /> Позвонить
            </a>
          )}
          {status !== BookingDomain.BookingStatus.CONFIRMED && (
            <button
              type='button'
              disabled={isPending}
              onClick={() => act('confirm')}
              className={cn(btn, 'border-emerald-500/40 text-emerald-300')}
            >
              <Check className='size-3.5' /> Подтвердить
            </button>
          )}
          {status === BookingDomain.BookingStatus.CONFIRMED && (
            <button
              type='button'
              disabled={isPending}
              onClick={() => act('complete')}
              className={cn(btn, 'border-emerald-500/40 text-emerald-300')}
            >
              <Check className='size-3.5' /> Выполнено
            </button>
          )}
          <button
            type='button'
            disabled={isPending}
            onClick={() => openDialog('reschedule', 'Перенести дату', 'date')}
            className={cn(btn, 'border-[#2C2C33] text-zinc-200')}
          >
            <CalendarClock className='size-3.5' /> Перенести
          </button>
          <button
            type='button'
            disabled={isPending}
            onClick={() => openDialog('cancel', 'Отменить заявку', 'reason')}
            className={cn(btn, 'border-red-500/40 text-red-300')}
          >
            <X className='size-3.5' /> Отменить
          </button>
          <button
            type='button'
            disabled={isPending}
            onClick={() => openDialog('note', 'Заметка по заявке', 'note')}
            className={cn(btn, 'border-[#2C2C33] text-zinc-400')}
          >
            <StickyNote className='size-3.5' /> Заметка
          </button>
          <button
            type='button'
            disabled={isPending}
            onClick={() => act('spam')}
            className={cn(btn, 'border-[#2C2C33] text-zinc-500')}
          >
            <Flag className='size-3.5' /> Спам
          </button>
        </div>
      )}

      <Dialog open={!!dialog} onOpenChange={open => !open && setDialog(null)}>
        <DialogContent className='max-w-sm border-[#2C2C33] bg-[#1B1B1F] text-zinc-100'>
          <DialogHeader>
            <DialogTitle className='text-zinc-100'>{dialog?.title}</DialogTitle>
          </DialogHeader>
          {dialog?.field === 'date' ? (
            <input
              type='date'
              value={date}
              onChange={e => setDate(e.target.value)}
              className='w-full rounded-lg border border-[#2C2C33] bg-[#202026] px-3 py-2.5 text-sm text-zinc-100 outline-none'
            />
          ) : (
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={
                dialog?.field === 'reason'
                  ? 'Причина отмены (необязательно)'
                  : 'Внутренняя заметка (клиент не видит)'
              }
              className='min-h-[90px] w-full resize-none rounded-lg border border-[#2C2C33] bg-[#202026] px-3 py-2.5 text-sm text-zinc-100 outline-none'
            />
          )}
          <button
            type='button'
            disabled={isPending || (dialog?.field === 'date' && !date)}
            onClick={submitDialog}
            className='mt-1 w-full rounded-lg bg-[#d19331] px-4 py-2.5 text-sm font-semibold text-[#1c1305] disabled:opacity-50'
          >
            Сохранить
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
