'use client';

import { Inbox, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';

import { BookingDomain } from '@/entities/booking';

import { cn } from '@/shared/lib/css';
import {
  CabinetEmpty,
  cabinetInput,
  CabinetNote,
  CabinetSkeleton
} from '@/shared/ui/cabinet';

import { useGuideBookings, useUpdateBooking } from '../hooks/use-bookings';
import { BookingDetailsPanel } from '../ui/booking-details-panel';
import { BookingListCard } from '../ui/booking-list-card';

const { BookingStatus } = BookingDomain;

const TABS: { id: string; label: string; statuses: string[] }[] = [
  { id: 'new', label: 'Новые', statuses: [BookingStatus.NEW] },
  { id: 'work', label: 'В работе', statuses: [BookingStatus.CONTACTED] },
  {
    id: 'confirmed',
    label: 'Подтверждённые',
    statuses: [BookingStatus.CONFIRMED]
  },
  { id: 'done', label: 'Выполненные', statuses: [BookingStatus.COMPLETED] },
  {
    id: 'cancelled',
    label: 'Отменённые',
    statuses: [BookingStatus.CANCELLED, BookingStatus.EXPIRED]
  },
  { id: 'spam', label: 'Спам', statuses: [BookingStatus.SPAM] }
];

const matchesQuery = (
  booking: BookingDomain.BookingListItem,
  query: string
): boolean => {
  if (!query) return true;

  const haystack = [
    booking.guestName,
    booking.guestPhone,
    booking.tour.title,
    String(booking.id)
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

/**
 * «Заявки»: слева список, справа карточка выбранной.
 *
 * Выбранная заявка живёт в адресе (`?booking=`), потому что на неё ссылаются
 * и обзор, и письма о новой заявке: ссылка должна открывать сразу нужную
 * карточку, а не просто список.
 */
export const GuideBookingsBoard: FC<{ userId: number }> = ({ userId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, isFetching, error } = useGuideBookings();
  const { update, isPending } = useUpdateBooking();

  const [tab, setTab] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const bookings = useMemo(() => data?.bookings ?? [], [data]);
  const selectedId = Number(searchParams.get('booking')) || null;
  const selected = bookings.find(booking => booking.id === selectedId) ?? null;
  /**
   * Ссылка из письма живёт дольше заявки: её могли удалить, или гид открыл
   * чужой адрес. Дальше всё считается по `selected`, а не по номеру из
   * адреса, иначе на телефоне список спрятался бы под несуществующую
   * карточку и вернуться к нему было бы нечем.
   */
  const isMissing = selectedId !== null && !selected;

  const countOf = (statuses: string[]) =>
    bookings.filter(booking => statuses.includes(booking.status)).length;

  /**
   * Вкладка по умолчанию: та, в которой лежит открытая заявка (ссылка из
   * письма ведёт на конкретную), иначе первая непустая — у гида без новых
   * заявок «Новые» это пустой экран, на котором нечего делать.
   */
  const activeTab =
    tab ??
    (selected
      ? TABS.find(item => item.statuses.includes(selected.status))?.id
      : undefined) ??
    TABS.find(item => countOf(item.statuses) > 0)?.id ??
    TABS[0].id;

  const visible = bookings
    .filter(booking =>
      (TABS.find(item => item.id === activeTab) ?? TABS[0]).statuses.includes(
        booking.status
      )
    )
    .filter(booking => matchesQuery(booking, query));

  const select = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('booking', String(id));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return <CabinetSkeleton rows={4} />;
  }

  if (error) {
    return (
      <CabinetEmpty
        tone='alert'
        icon={<Inbox className='size-6' />}
        title='Не удалось загрузить заявки'
        text={error.message}
      />
    );
  }

  if (!bookings.length) {
    return (
      <CabinetEmpty
        icon={<Inbox className='size-6' />}
        title='Заявок пока нет'
        text='Заявка приходит с карточки тура. Если туры опубликованы, а заявок нет — проверьте, что в карточке есть фото, цена и точка старта: без них до кнопки просто не доходят.'
      />
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center gap-2'>
        {TABS.map(item => {
          const count = countOf(item.statuses);

          return (
            <button
              key={item.id}
              type='button'
              onClick={() => setTab(item.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors',
                item.id === activeTab
                  ? 'border-cab-gold/45 bg-cab-gold/12 text-cab-ink'
                  : 'border-cab-line bg-cab-raise text-cab-dim hover:text-cab-ink'
              )}
            >
              {item.label}
              {!!count && (
                <span
                  className={cn(
                    'ml-1.5 font-semibold',
                    item.id === activeTab ? 'text-cab-gold' : 'text-cab-ink'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <label className='relative ml-auto w-full sm:w-64'>
          <Search className='text-cab-mute pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Имя, телефон или № заявки'
            aria-label='Поиск по заявкам'
            className={cn(cabinetInput, 'pl-9')}
          />
        </label>
      </div>

      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_428px] xl:items-start'>
        {/* На узком экране список и карточка не помещаются рядом: выбранная
            заявка занимает экран целиком, а список прячется до возврата. */}
        <div
          className={cn(
            'flex flex-col gap-2.5',
            isFetching && 'opacity-70',
            selected && 'hidden xl:flex'
          )}
        >
          {isMissing && (
            <CabinetNote tone='bad'>
              Заявки №{selectedId} больше нет — её удалили или ссылка ведёт к
              чужой. Ниже весь список.
            </CabinetNote>
          )}
          {visible.length ? (
            visible.map(booking => (
              <BookingListCard
                key={booking.id}
                booking={booking}
                isActive={booking.id === selectedId}
                onSelect={select}
              />
            ))
          ) : (
            <CabinetEmpty
              icon={<Inbox className='size-6' />}
              title='В этой вкладке пусто'
              text={
                query
                  ? 'По запросу ничего не нашлось — попробуйте номер заявки или телефон.'
                  : 'Здесь появятся заявки с таким статусом.'
              }
            />
          )}

          <CabinetNote>
            Заявка со статусом «Отменена», «Выполнена», «Истекла» или «Спам»
            действий больше не показывает: это конечные статусы, и сервер такие
            переходы не принимает. Остаётся только заметка.
          </CabinetNote>
        </div>

        {selected ? (
          <div className='flex flex-col gap-2.5'>
            <button
              type='button'
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());

                params.delete('booking');
                router.replace(params.size ? `?${params.toString()}` : '?', {
                  scroll: false
                });
              }}
              className='text-cab-dim self-start text-[12.5px] xl:hidden'
            >
              ← Все заявки
            </button>
            <BookingDetailsPanel
              key={selected.id}
              booking={selected}
              userId={userId}
              isPending={isPending}
              onAction={update}
            />
          </div>
        ) : (
          <aside className='border-cab-line bg-cab-panel hidden rounded-2xl border xl:block'>
            <CabinetEmpty
              icon={<Inbox className='size-6' />}
              title='Выберите заявку'
              text='Слева — список, здесь появятся контакты клиента, действия и история.'
            />
          </aside>
        )}
      </div>
    </div>
  );
};
