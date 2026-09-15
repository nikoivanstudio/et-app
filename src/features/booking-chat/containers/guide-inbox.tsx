'use client';

import { MessageSquare, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { bookingChip, formatAgo } from '@/features/cabinet/lib/format';

import { MessageDomain } from '@/entities/message';

import { cn } from '@/shared/lib/css';
import {
  CabinetEmpty,
  cabinetInput,
  CabinetSkeleton,
  Chip,
  CountPill
} from '@/shared/ui/cabinet';

import { useChatThread, useSendMessage } from '../hooks/use-chat';
import { useGuideInbox, useRefreshCounters } from '../hooks/use-inbox';
import { CabinetChatPanel } from '../ui/cabinet-chat-panel';

/**
 * «Сообщения»: слева заявки с перепиской, справа лента.
 *
 * Список — это именно заявки: отдельной сущности «диалог» в базе нет, и
 * выдумывать её в интерфейсе тоже незачем. Выбранная переписка живёт
 * в адресе, чтобы на неё можно было сослаться с обзора и из письма.
 */
export const GuideInbox: FC<{ userId: number }> = ({ userId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { threads, isLoading, error } = useGuideInbox();
  const refreshCounters = useRefreshCounters();

  const [query, setQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);

  /**
   * Выбранная переписка — состояние, а не производная от списка.
   *
   * Пока она вычислялась как «первая в списке», получался цикл: открытая
   * лента помечалась прочитанной, список пересортировывался, первой
   * становилась следующая заявка — и кабинет по очереди «прочитывал» все
   * переписки сам. Адрес по-прежнему участвует, но только как начальное
   * значение и как то, что мы в него пишем.
   */
  /**
   * Выбранная переписка.
   *
   * Хранится только явный выбор гида (или заявка из адреса), а «первая в
   * списке» выводится при отрисовке. Так экран не выглядит пустым на широком
   * мониторе и при этом не открывает случайную переписку на телефоне —
   * там до явного выбора виден список.
   *
   * Раньше первая переписка проставлялась в состояние эффектом, и получался
   * цикл: открытая лента помечалась прочитанной, список пересортировывался,
   * первой становилась следующая заявка — кабинет «прочитывал» всё сам.
   */
  const [pickedId, setPickedId] = useState<number | null>(
    () => Number(searchParams.get('booking')) || null
  );
  const visible = useMemo(
    () =>
      threads
        .filter(thread => (onlyUnread ? thread.unreadCount > 0 : true))
        .filter(thread =>
          query
            ? `${thread.guestName} ${thread.tourTitle}`
                .toLowerCase()
                .includes(query.toLowerCase())
            : true
        ),
    [threads, onlyUnread, query]
  );

  const isPicked = pickedId !== null;
  const selected = isPicked
    ? (threads.find(thread => thread.bookingId === pickedId) ?? null)
    : (visible[0] ?? threads[0] ?? null);

  const target = { bookingId: selected?.bookingId };
  const { thread: chat, isLoading: isChatLoading } = useChatThread(
    target,
    !!selected
  );
  const {
    send,
    isPending,
    error: sendError
  } = useSendMessage(target as { bookingId: number });

  // Открытая лента помечается прочитанной на сервере: обновляем счётчики
  // в списке и в меню, но по одному разу на состояние переписки.
  const refreshedFor = useRef('');

  useEffect(() => {
    if (!chat) return;

    const key = `${chat.bookingId}:${chat.messages.length}`;

    if (refreshedFor.current === key) return;

    refreshedFor.current = key;
    refreshCounters();
  }, [chat, refreshCounters]);

  const select = (bookingId: number) => {
    setPickedId(bookingId);

    const params = new URLSearchParams(searchParams.toString());

    params.set('booking', String(bookingId));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading) return <CabinetSkeleton rows={3} />;

  if (error) {
    return (
      <CabinetEmpty
        tone='alert'
        icon={<MessageSquare className='size-6' />}
        title='Не удалось загрузить переписки'
        text={error.message}
      />
    );
  }

  if (!threads.length) {
    return (
      <CabinetEmpty
        icon={<MessageSquare className='size-6' />}
        title='Переписки пока нет'
        text='Здесь появятся диалоги по заявкам. Первым обычно пишет клиент, но можно начать и самому — сразу после того, как заявка пришла.'
      />
    );
  }

  return (
    <div className='border-cab-line bg-cab-panel grid min-h-0 flex-1 overflow-hidden rounded-2xl border lg:grid-cols-[332px_minmax(0,1fr)]'>
      <div
        className={cn(
          'border-cab-line-soft flex min-h-0 min-w-0 flex-col lg:border-r',
          isPicked && 'hidden lg:flex'
        )}
      >
        <div className='border-cab-line-soft flex flex-col gap-2.5 border-b px-3.5 py-3'>
          <label className='relative'>
            <Search className='text-cab-mute pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder='Имя клиента или тур'
              aria-label='Поиск по перепискам'
              className={cn(cabinetInput, 'pl-9')}
            />
          </label>
          <button
            type='button'
            onClick={() => setOnlyUnread(value => !value)}
            className={cn(
              'self-start rounded-full border px-3 py-1 text-[12px]',
              onlyUnread
                ? 'border-cab-gold/45 bg-cab-gold/12 text-cab-ink'
                : 'border-cab-line text-cab-dim'
            )}
          >
            Только непрочитанные
          </button>
        </div>

        <ul className='min-h-0 flex-1 overflow-y-auto'>
          {visible.map(thread => {
            const chip = bookingChip(thread.status);
            const isMine =
              thread.lastMessage?.authorRole ===
              MessageDomain.MessageAuthorRole.GUIDE;

            return (
              <li key={thread.bookingId}>
                <button
                  type='button'
                  onClick={() => select(thread.bookingId)}
                  className={cn(
                    'border-cab-line-soft w-full border-b px-3.5 py-3 text-left',
                    thread.bookingId === selected?.bookingId
                      ? 'bg-cab-gold/9 shadow-[inset_2px_0_0_var(--cab-gold)]'
                      : 'hover:bg-cab-raise'
                  )}
                >
                  <span className='flex items-center gap-2'>
                    <span className='truncate text-[13px] font-semibold'>
                      {thread.guestName}
                    </span>
                    <span className='text-cab-mute ml-auto text-[10.5px] whitespace-nowrap'>
                      {thread.lastMessage
                        ? formatAgo(thread.lastMessage.createdAt)
                        : ''}
                    </span>
                  </span>
                  <span className='text-cab-faint mt-1 block truncate text-[12px]'>
                    {isMine && 'Вы: '}
                    {thread.lastMessage?.text}
                  </span>
                  <span className='mt-2 flex items-center gap-2'>
                    <Chip tone={chip.tone}>{chip.label}</Chip>
                    <CountPill count={thread.unreadCount} />
                  </span>
                </button>
              </li>
            );
          })}

          {!visible.length && (
            <li className='text-cab-mute px-4 py-6 text-center text-[12.5px]'>
              Ничего не нашлось
            </li>
          )}
        </ul>
      </div>

      {selected ? (
        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-col',
            !isPicked && 'hidden lg:flex'
          )}
        >
          <button
            type='button'
            onClick={() => {
              setPickedId(null);
              router.replace('?', { scroll: false });
            }}
            className='border-cab-line-soft text-cab-dim border-b px-4 py-2.5 text-left text-[12.5px] lg:hidden'
          >
            ← Все переписки
          </button>
          <CabinetChatPanel
            userId={userId}
            thread={selected}
            chat={chat}
            isLoading={isChatLoading}
            isSending={isPending}
            error={sendError?.message ?? null}
            onSend={send}
          />
        </div>
      ) : (
        <CabinetEmpty
          className='hidden lg:flex'
          icon={<MessageSquare className='size-6' />}
          title='Выберите переписку'
          text='Слева — заявки, в которых есть сообщения.'
        />
      )}
    </div>
  );
};
