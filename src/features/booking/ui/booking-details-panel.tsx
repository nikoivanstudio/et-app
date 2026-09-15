'use client';

import {
  CalendarClock,
  Check,
  Flag,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

import {
  bookingChip,
  formatDate,
  formatDateTime,
  formatPeople
} from '@/features/cabinet/lib/format';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';
import {
  cabinetAction,
  cabinetInput,
  Chip
} from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { UpdateBookingPayload } from '../model/schemas';

type Action = BookingDomain.BookingActionType;

const Section: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => (
  <div className='border-cab-line-soft border-b px-4 py-4 last:border-b-0 sm:px-5'>
    <h3 className='text-cab-mute mb-3 text-[11px] tracking-[0.16em] uppercase'>
      {title}
    </h3>
    {children}
  </div>
);

const Row: FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children
}) => (
  <>
    <dt className='text-cab-faint text-[12.5px]'>{label}</dt>
    <dd className='text-[13px]'>{children}</dd>
  </>
);

/**
 * Карточка выбранной заявки.
 *
 * Набор кнопок повторяет `isActionAllowed` из домена: подтверждённую нельзя
 * подтвердить второй раз, «Выполнено» доступно только из «Подтверждена», а
 * у закрытой заявки действий нет вовсе — остаётся заметка, её пишут и задним
 * числом.
 */
export const BookingDetailsPanel: FC<{
  booking: BookingDomain.BookingListItem;
  userId: number;
  isPending: boolean;
  onAction: (payload: UpdateBookingPayload) => void;
}> = ({ booking, userId, isPending, onAction }) => {
  const chip = bookingChip(booking.status);
  const [note, setNote] = useState(booking.guideNote ?? '');
  const [dialog, setDialog] = useState<null | 'cancel' | 'reschedule'>(null);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  // Заметка, причина отмены и открытая форма относятся к конкретной заявке.
  // Сбрасываются они не эффектом, а ключом: список отрисовывает панель
  // с `key={booking.id}`, и при смене заявки состояние начинается заново.

  const allows = (action: Action) =>
    BookingDomain.isActionAllowed(booking.status, action);

  const act = (action: Action, extra?: Partial<UpdateBookingPayload>) =>
    onAction({ id: booking.id, action, ...extra });

  const isClosed = BookingDomain.TERMINAL_BOOKING_STATUSES.includes(
    booking.status
  );

  return (
    <aside className='border-cab-line bg-cab-panel overflow-hidden rounded-2xl border'>
      <header className='border-cab-line-soft from-cab-gold/9 to-cab-panel border-b bg-linear-120 px-4 py-4 sm:px-5'>
        <div className='flex items-center gap-3'>
          <div className='min-w-0'>
            <p className='text-[15px] font-semibold'>{booking.guestName}</p>
            <p className='text-cab-mute mt-0.5 text-[11.5px]'>
              Заявка № {booking.id} · создана {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <Chip tone={chip.tone} className='ml-auto'>
            {chip.label}
          </Chip>
        </div>
      </header>

      <Section title='Заявка'>
        <dl className='grid grid-cols-[104px_minmax(0,1fr)] gap-x-3 gap-y-2.5'>
          <Row label='Тур'>
            <Link
              href={routes.tour(booking.tour.slug)}
              className='hover:text-cab-gold'
            >
              {booking.tour.title}
            </Link>
          </Row>
          <Row label='Дата выезда'>{formatDate(booking.desiredDate)}</Row>
          <Row label='Гостей'>{formatPeople(booking.peopleCount)}</Row>
          <Row label='Телефон'>
            <span className='flex flex-wrap items-center gap-2'>
              <a
                href={`tel:${booking.guestPhone.replace(/[^\d+]/g, '')}`}
                className='hover:text-cab-gold flex items-center gap-1.5'
              >
                <Phone className='size-3.5' />
                {booking.guestPhone}
              </a>
              {booking.phoneVerified ? (
                <Chip tone='ok'>
                  <ShieldCheck className='size-3.5' />
                  подтверждён
                </Chip>
              ) : (
                <Chip tone='new'>не подтверждён</Chip>
              )}
            </span>
          </Row>
          {!!booking.guestEmail && (
            <Row label='Почта'>
              <a
                href={`mailto:${booking.guestEmail}`}
                className='hover:text-cab-gold flex items-center gap-1.5'
              >
                <Mail className='size-3.5' />
                {booking.guestEmail}
              </a>
            </Row>
          )}
          {!!booking.comment && (
            <Row label='Комментарий'>«{booking.comment}»</Row>
          )}
          {!!booking.cancelReason && (
            <Row label='Причина отмены'>
              <span className='text-cab-bad'>{booking.cancelReason}</span>
            </Row>
          )}
        </dl>

        {!booking.phoneVerified && (
          <p className='border-cab-gold/28 bg-cab-gold/8 mt-3 flex gap-2 rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed text-[#d8c39c]'>
            <Flag className='mt-0.5 size-3.5 shrink-0' />
            Клиент не подтвердил номер кодом. Такие заявки чаще всего приходят от
            ботов — перезванивать стоит осторожно.
          </p>
        )}
      </Section>

      <Section title={isClosed ? 'Заявка закрыта' : 'Что можно сделать сейчас'}>
        {isClosed ? (
          <p className='text-cab-faint text-[12.5px] leading-relaxed'>
            Статус «{chip.label}» — конечный, действий по такой заявке больше
            нет. Переписка и заметка остаются на месте.
          </p>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {allows('confirm') && (
              <button
                type='button'
                disabled={isPending}
                onClick={() => act('confirm')}
                className={cabinetAction({ tone: 'gold', size: 'sm' })}
              >
                <Check className='size-4' />
                Подтвердить
              </button>
            )}
            {allows('complete') && (
              <button
                type='button'
                disabled={isPending}
                onClick={() => act('complete')}
                className={cabinetAction({ tone: 'ok', size: 'sm' })}
              >
                <Check className='size-4' />
                Выполнено
              </button>
            )}
            <Link
              href={routes.cabinet.thread(userId, booking.id)}
              className={cabinetAction({ tone: 'solid', size: 'sm' })}
            >
              <MessageSquare className='size-4' />
              Ответить
              {!!booking.unreadCount && (
                <span className='bg-cab-gold text-cab-on-gold rounded-full px-1.5 text-[11px] font-semibold'>
                  {booking.unreadCount}
                </span>
              )}
            </Link>
            {allows('reschedule') && (
              <button
                type='button'
                disabled={isPending}
                onClick={() => setDialog(dialog === 'reschedule' ? null : 'reschedule')}
                className={cabinetAction({ tone: 'solid', size: 'sm' })}
              >
                <CalendarClock className='size-4' />
                Перенести
              </button>
            )}
            {allows('cancel') && (
              <button
                type='button'
                disabled={isPending}
                onClick={() => setDialog(dialog === 'cancel' ? null : 'cancel')}
                className={cabinetAction({ tone: 'bad', size: 'sm' })}
              >
                <X className='size-4' />
                Отменить
              </button>
            )}
            {allows('spam') && (
              <button
                type='button'
                disabled={isPending}
                onClick={() => act('spam')}
                className={cabinetAction({ tone: 'line', size: 'sm' })}
              >
                <Flag className='size-4' />В спам
              </button>
            )}
          </div>
        )}

        {dialog === 'reschedule' && (
          <div className='mt-3 flex flex-wrap items-end gap-2'>
            <input
              type='date'
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={event => setDate(event.target.value)}
              aria-label='Новая дата выезда'
              className={cn(cabinetInput, 'max-w-44 [color-scheme:dark]')}
            />
            <button
              type='button'
              disabled={!date || isPending}
              onClick={() => {
                act('reschedule', { desiredDate: date });
                setDialog(null);
              }}
              className={cabinetAction({ tone: 'gold', size: 'sm' })}
            >
              Перенести
            </button>
          </div>
        )}

        {dialog === 'cancel' && (
          <div className='mt-3 flex flex-col gap-2'>
            <input
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder='Причина отмены — её увидит клиент'
              aria-label='Причина отмены'
              className={cabinetInput}
            />
            <button
              type='button'
              disabled={isPending}
              onClick={() => {
                act('cancel', { reason });
                setDialog(null);
              }}
              className={cn(cabinetAction({ tone: 'bad', size: 'sm' }), 'self-start')}
            >
              Отменить заявку
            </button>
          </div>
        )}

        {!isClosed && !allows('complete') && (
          <p className='text-cab-mute mt-2.5 text-[11.5px] leading-relaxed'>
            «Выполнено» появится, когда заявка будет подтверждена: выполненным
            бывает только подтверждённый тур.
          </p>
        )}
      </Section>

      <Section title='Заметка для себя'>
        <textarea
          value={note}
          onChange={event => setNote(event.target.value)}
          rows={3}
          placeholder='Что учесть на выезде — клиент этого не видит'
          className={cn(cabinetInput, 'resize-none')}
        />
        <div className='mt-2 flex items-center gap-3'>
          <button
            type='button'
            disabled={isPending || note === (booking.guideNote ?? '')}
            onClick={() => act('note', { note })}
            className={cabinetAction({ tone: 'solid', size: 'sm' })}
          >
            Сохранить заметку
          </button>
          <span className='text-cab-mute text-[11.5px]'>
            Доступна в любом статусе.
          </span>
        </div>
      </Section>

      {!!booking.statusHistory.length && (
        <Section title='История'>
          <ol className='flex flex-col gap-3'>
            {booking.statusHistory.map((item, index) => {
              const historyChip = bookingChip(item.status);

              return (
                <li
                  key={`${item.at}-${index}`}
                  className='grid grid-cols-[11px_minmax(0,1fr)] gap-3'
                >
                  <span
                    className={cn(
                      'mt-1.5 size-[7px] rounded-full',
                      index === booking.statusHistory.length - 1
                        ? 'bg-cab-gold'
                        : 'bg-cab-line'
                    )}
                  />
                  <span>
                    <span className='block text-[12.5px]'>
                      {historyChip.label}
                      {!!item.note && (
                        <span className='text-cab-faint'> · {item.note}</span>
                      )}
                    </span>
                    <span className='text-cab-mute text-[11.5px]'>
                      {formatDateTime(item.at)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </Section>
      )}
    </aside>
  );
};
