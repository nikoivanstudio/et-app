'use client';

import { Check, Send, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';

import { bookingChip, formatDate, formatTime } from '@/features/cabinet/lib/format';

import { MessageDomain } from '@/entities/message';

import { cn } from '@/shared/lib/css';
import { cabinetAction, Chip } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { InboxThreadItem } from '../services/inbox-service';

/**
 * Переписка в кабинете: шапка с заявкой, лента и поле ввода.
 *
 * От клиентской ленты (`ChatThread`) отличается тем, что занимает всю высоту
 * экрана и держит рядом заявку: гид отвечает и тут же подтверждает дату,
 * не уходя в другой раздел.
 */
export const CabinetChatPanel: FC<{
  userId: number;
  thread: InboxThreadItem;
  chat?: MessageDomain.ChatThread;
  isLoading: boolean;
  isSending: boolean;
  error?: string | null;
  onSend: (text: string) => void;
}> = ({ userId, thread, chat, isLoading, isSending, error, onSend }) => {
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const chip = bookingChip(thread.status);
  const count = chat?.messages.length ?? 0;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [count, thread.bookingId]);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const value = text.trim();

    if (!value || isSending) return;

    onSend(value);
    setText('');
  };

  return (
    <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
      <header className='border-cab-line-soft flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-5'>
        <div className='min-w-0'>
          <p className='text-[14.5px] font-semibold'>{thread.guestName}</p>
          <p className='text-cab-mute mt-0.5 line-clamp-2 text-[11.5px]'>
            {thread.tourTitle} · {formatDate(thread.desiredDate)} ·{' '}
            {thread.peopleCount} чел. · № {thread.bookingId}
          </p>
        </div>
        <div className='ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2'>
          <Chip tone={chip.tone}>{chip.label}</Chip>
          <Link
            href={routes.cabinet.booking(userId, thread.bookingId)}
            className={cabinetAction({ tone: 'line', size: 'sm' })}
          >
            Открыть заявку
          </Link>
        </div>
      </header>

      <div
        ref={listRef}
        className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#111114] px-4 py-4 sm:px-5'
      >
        {isLoading && (
          <p className='text-cab-mute text-[12.5px]'>Загружаем переписку…</p>
        )}

        {!isLoading && !count && (
          <p className='text-cab-mute text-[12.5px]'>
            Сообщений пока нет. Напишите первым — клиент получит письмо со
            ссылкой на переписку.
          </p>
        )}

        {chat?.messages.map(message => {
          const isMine = message.authorRole === chat.viewerRole;

          return (
            <div
              key={message.id}
              className={cn('flex flex-col', isMine ? 'items-end' : 'items-start')}
            >
              <p
                className={cn(
                  'max-w-[78%] rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed break-words whitespace-pre-wrap',
                  isMine
                    ? 'bg-cab-gold/15 text-cab-ink'
                    : 'bg-cab-line/70 text-[#e4e4e7]'
                )}
              >
                {message.text}
              </p>
              <span className='text-cab-mute mt-1 flex items-center gap-1 text-[10.5px]'>
                {isMine ? 'Вы' : message.authorName} ·{' '}
                {formatTime(message.createdAt)}
                {isMine && !!message.readAt && (
                  <>
                    <Check className='size-3' />
                    прочитано
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <footer className='border-cab-line-soft border-t px-4 py-3 sm:px-5'>
        {!!error && (
          <p className='border-cab-bad/28 bg-cab-bad/8 text-cab-bad mb-2.5 rounded-xl border px-3 py-2 text-[12px]'>
            {error}
          </p>
        )}

        {chat?.canWrite === false ? (
          <p className='text-cab-mute text-[12.5px]'>
            Переписка по этой заявке закрыта.
          </p>
        ) : (
          <form onSubmit={submit} className='flex items-end gap-2.5'>
            <textarea
              value={text}
              onChange={event => setText(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) submit(event);
              }}
              rows={1}
              maxLength={MessageDomain.MESSAGE_MAX_LENGTH}
              placeholder='Написать сообщение…'
              aria-label='Текст сообщения'
              className='border-cab-line text-cab-ink placeholder:text-cab-mute focus:border-cab-gold/60 max-h-32 min-h-11 w-full min-w-0 flex-1 resize-none rounded-[10px] border bg-[#17171b] px-3.5 py-3 text-[13px] outline-none'
            />
            <button
              type='submit'
              disabled={isSending || !text.trim()}
              aria-label='Отправить'
              className='bg-cab-gold text-cab-on-gold grid size-11 shrink-0 place-items-center rounded-full disabled:opacity-50'
            >
              <Send className='size-4' />
            </button>
          </form>
        )}

        <p className='text-cab-mute mt-2.5 flex items-center gap-2 text-[11.5px]'>
          <ShieldAlert className='size-3.5 shrink-0' />
          Телефоны и ссылки на мессенджеры в переписке блокируются — номер
          клиента и так есть в заявке.
        </p>
      </footer>
    </div>
  );
};
