'use client';

import { Send, ShieldAlert } from 'lucide-react';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';

import { MessageDomain } from '@/entities/message';

import { cn } from '@/shared/lib/css';

type Variant = 'light' | 'dark';

type Props = {
  thread?: MessageDomain.ChatThread;
  isLoading: boolean;
  isSending: boolean;
  error?: string | null;
  variant?: Variant;
  onSend: (text: string) => void;
};

/**
 * Переписка по заявке. Одна и та же лента показывается клиенту на странице
 * заявки (светлая тема сайта) и гиду в кабинете (тёмная) — отличаются только
 * цвета, поведение общее.
 */
const styles: Record<Variant, Record<string, string>> = {
  light: {
    box: 'rounded-3xl border border-[var(--rule)] bg-white p-4',
    title: 'font-poiret text-[18px] tracking-wide text-[var(--ink)]',
    hint: 'text-[12px] text-[var(--ink-muted)]',
    mine: 'bg-[var(--cream)] text-[var(--ink)]',
    theirs: 'bg-[#f6f4ef] text-[var(--ink)]',
    time: 'text-[11px] text-[#9b8e72]',
    input:
      'w-full resize-none rounded-control border border-[var(--rule)] bg-[#fffdf8] px-3 py-2.5 text-[14px] text-[var(--ink)] outline-none focus:border-[var(--cta)]',
    button: 'bg-cta text-on-cta hover:bg-cta-press',
    alert: 'bg-alert-bg text-alert-ink'
  },
  dark: {
    box: 'rounded-xl border border-[#2C2C33] bg-[#1B1B1F] p-3.5',
    title: 'text-[14.5px] font-semibold text-zinc-100',
    hint: 'text-[12px] text-zinc-500',
    mine: 'bg-[#d19331]/15 text-zinc-100',
    theirs: 'bg-[#202026] text-zinc-200',
    time: 'text-[11px] text-zinc-500',
    input:
      'w-full resize-none rounded-lg border border-[#2C2C33] bg-[#202026] px-3 py-2.5 text-sm text-zinc-100 outline-none',
    button: 'bg-[#d19331] text-[#1c1305] hover:bg-[#e0a955]',
    alert: 'bg-red-500/10 text-red-300'
  }
};

const formatTime = (iso: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));

export const ChatThread: FC<Props> = ({
  thread,
  isLoading,
  isSending,
  error,
  variant = 'light',
  onSend
}) => {
  const style = styles[variant];
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const count = thread?.messages.length ?? 0;

  // Лента всегда открыта на последнем сообщении.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [count]);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const value = text.trim();

    if (!value || isSending) return;

    onSend(value);
    setText('');
  };

  const isMine = (message: MessageDomain.ChatMessage) =>
    message.authorRole === thread?.viewerRole;

  return (
    <div className={style.box}>
      <div className='mb-2 flex items-center justify-between gap-2'>
        <h3 className={style.title}>
          {thread ? `Переписка · ${thread.companionName}` : 'Переписка'}
        </h3>
      </div>

      <p className={cn('mb-3 flex items-start gap-1.5', style.hint)}>
        <ShieldAlert className='mt-[1px] size-3.5 shrink-0' />
        Обмен телефонами в переписке запрещён — все договорённости остаются на
        площадке.
      </p>

      <div
        ref={listRef}
        className='mb-3 max-h-[320px] space-y-2 overflow-y-auto pr-1'
      >
        {isLoading && <p className={style.hint}>Загружаем переписку…</p>}

        {!isLoading && !count && (
          <p className={style.hint}>
            Сообщений пока нет. Спросите гида о деталях тура — он ответит здесь.
          </p>
        )}

        {thread?.messages.map(message => (
          <div
            key={message.id}
            className={cn(
              'flex flex-col',
              isMine(message) ? 'items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[13.5px]',
                isMine(message) ? style.mine : style.theirs
              )}
            >
              {message.text}
            </div>
            <span className={cn('mt-0.5', style.time)}>
              {isMine(message) ? 'Вы' : message.authorName} ·{' '}
              {formatTime(message.createdAt)}
            </span>
          </div>
        ))}
      </div>

      {!!error && (
        <p
          className={cn(
            'mb-2 rounded-control px-3 py-2 text-[13px]',
            style.alert
          )}
        >
          {error}
        </p>
      )}

      {thread?.canWrite === false ? (
        <p className={style.hint}>Переписка по этой заявке закрыта.</p>
      ) : (
        <form onSubmit={submit} className='flex items-end gap-2'>
          <textarea
            value={text}
            onChange={event => setText(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) submit(event);
            }}
            maxLength={MessageDomain.MESSAGE_MAX_LENGTH}
            placeholder='Написать сообщение…'
            aria-label='Текст сообщения'
            className={cn(style.input, 'min-h-[44px] max-h-32')}
            rows={1}
          />
          <button
            type='submit'
            disabled={isSending || !text.trim()}
            aria-label='Отправить'
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-50',
              style.button
            )}
          >
            <Send className='size-4' />
          </button>
        </form>
      )}
    </div>
  );
};
