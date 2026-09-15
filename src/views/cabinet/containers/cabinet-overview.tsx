import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Inbox,
  MessageSquare,
  Phone,
  Route,
  Star,
  User2,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import {
  bookingChip,
  formatAgo,
  formatDayMonth,
  formatLongDate,
  formatPeople,
  tourChip
} from '@/features/cabinet/lib/format';
import { CabinetOverview } from '@/features/cabinet/server';

import { cn } from '@/shared/lib/css';
import {
  cabinetAction,
  CabinetEmpty,
  CabinetPanel,
  Chip,
  KpiCard
} from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { CabinetOnboarding } from '../ui/cabinet-onboarding';

const isToday = (iso?: string | null): boolean => {
  if (!iso) return false;

  const date = new Date(iso);
  const now = new Date();

  return date.toDateString() === now.toDateString();
};

/** Ближайший выезд: всё, что нужно знать перед выходом из дома. */
const NextTrip: FC<{
  userId: number;
  booking: NonNullable<CabinetOverview['next']>;
}> = ({ userId, booking }) => {
  const chip = bookingChip(booking.status);
  const today = isToday(booking.desiredDate);

  return (
    <section className='border-cab-gold/34 from-cab-gold/12 to-cab-panel grid gap-4 rounded-2xl border bg-linear-120 p-4 sm:p-5 lg:grid-cols-[120px_minmax(0,1fr)_auto] lg:items-center'>
      <div className='border-cab-gold/20 lg:border-r lg:pr-5'>
        <span className='text-cab-faint text-[11.5px]'>
          {today ? 'Сегодня выезд' : 'Ближайший выезд'}
        </span>
        <b className='mt-0.5 block text-[24px] font-semibold tracking-tight'>
          {formatDayMonth(booking.desiredDate)}
        </b>
        <span className='text-cab-mute text-[11.5px]'>
          {formatLongDate(booking.desiredDate)}
        </span>
      </div>

      <div className='min-w-0'>
        <div className='flex flex-wrap items-center gap-2.5'>
          <h2 className='text-[15.5px] font-semibold'>{booking.tour.title}</h2>
          <Chip tone={chip.tone}>{chip.label}</Chip>
        </div>
        <div className='text-cab-dim mt-2.5 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px]'>
          <span className='flex items-center gap-1.5'>
            <Users className='size-4' />
            {formatPeople(booking.peopleCount)}
          </span>
          <span className='flex items-center gap-1.5'>
            <User2 className='size-4' />
            {booking.guestName}
          </span>
          <a
            href={`tel:${booking.guestPhone.replace(/[^\d+]/g, '')}`}
            className='hover:text-cab-ink flex items-center gap-1.5'
          >
            <Phone className='size-4' />
            {booking.guestPhone}
          </a>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <Link
          href={routes.cabinet.thread(userId, booking.id)}
          className={cabinetAction({ tone: 'line', size: 'sm' })}
        >
          <MessageSquare className='size-4' />
          Написать
        </Link>
        <Link
          href={routes.cabinet.booking(userId, booking.id)}
          className={cabinetAction({ tone: 'gold', size: 'sm' })}
        >
          Открыть заявку
        </Link>
      </div>
    </section>
  );
};

export const CabinetOverviewView: FC<{
  userId: number;
  overview: CabinetOverview;
  hasProfile: boolean;
}> = ({ userId, overview, hasProfile }) => {
  const {
    badges,
    next,
    upcoming,
    waiting,
    moderation,
    toursPublished,
    toursTotal,
    rating,
    reviewsCount,
    unansweredReviews
  } = overview;

  if (!toursTotal) {
    return <CabinetOnboarding userId={userId} hasProfile={hasProfile} />;
  }

  return (
    <div className='flex flex-col gap-4 lg:gap-5'>
      {!!next && <NextTrip userId={userId} booking={next} />}

      <section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <KpiCard
          accent={badges.newBookings > 0}
          icon={<Inbox className='size-4' />}
          label='Новые заявки'
          value={badges.newBookings}
          hint='ждут ответа'
        />
        <KpiCard
          icon={<MessageSquare className='size-4' />}
          label='Непрочитанные сообщения'
          value={badges.unreadMessages}
          hint={waiting.length ? `в ${waiting.length} переписках` : 'всё прочитано'}
        />
        <KpiCard
          icon={<Route className='size-4' />}
          label='Туры опубликованы'
          value={
            <>
              {toursPublished}
              <span className='text-cab-mute text-[15px]'> из {toursTotal}</span>
            </>
          }
          hint={
            moderation.length
              ? `${moderation.length} ждут доработки или проверки`
              : 'все туры в каталоге'
          }
        />
        <KpiCard
          icon={<Star className='size-4' />}
          label='Рейтинг'
          value={rating ? rating.toFixed(1).replace('.', ',') : '—'}
          hint={
            reviewsCount
              ? `${reviewsCount} отзывов, ${unansweredReviews} без ответа`
              : 'отзывов пока нет'
          }
        />
      </section>

      <section className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_392px] lg:items-start'>
        <CabinetPanel
          title='Ближайшие выезды'
          flush
          action={
            <Link
              href={routes.cabinet.bookings(userId)}
              className='text-cab-faint hover:text-cab-ink text-[12px]'
            >
              Все заявки
            </Link>
          }
        >
          {upcoming.length ? (
            <ul>
              {upcoming.map(booking => {
                const chip = bookingChip(booking.status);

                return (
                  <li key={booking.id} className='border-cab-line-soft border-b last:border-b-0'>
                    <Link
                      href={routes.cabinet.booking(userId, booking.id)}
                      className='hover:bg-cab-raise grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5'
                    >
                      <span>
                        <b className='block text-[13px] font-semibold'>
                          {formatDayMonth(booking.desiredDate)}
                        </b>
                        <span className='text-cab-mute text-[11.5px]'>
                          {formatPeople(booking.peopleCount)}
                        </span>
                      </span>
                      <span className='min-w-0'>
                        <span className='block truncate text-[13px]'>
                          {booking.tour.title}
                        </span>
                        <span className='text-cab-mute text-[11.5px]'>
                          {booking.guestName}
                        </span>
                      </span>
                      <Chip tone={chip.tone}>{chip.label}</Chip>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <CabinetEmpty
              icon={<CalendarDays className='size-6' />}
              title='Ближайших выездов нет'
              text='Как только клиент оставит заявку с датой, она появится здесь и в календаре тура.'
            />
          )}
        </CabinetPanel>

        <div className='flex flex-col gap-4'>
          <CabinetPanel
            title='Ждут вашего ответа'
            flush
            action={
              <Link
                href={routes.cabinet.messages(userId)}
                className='text-cab-faint hover:text-cab-ink text-[12px]'
              >
                Все сообщения
              </Link>
            }
          >
            {waiting.length ? (
              <ul>
                {waiting.map(thread => (
                  <li
                    key={thread.bookingId}
                    className='border-cab-line-soft border-b last:border-b-0'
                  >
                    <Link
                      href={routes.cabinet.thread(userId, thread.bookingId)}
                      className='hover:bg-cab-raise grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3 sm:px-5'
                    >
                      <span className='min-w-0'>
                        <span className='flex items-center gap-1.5 text-[13px] font-semibold'>
                          {thread.guestName}
                          <span className='bg-cab-gold size-[7px] rounded-full' />
                        </span>
                        <span className='text-cab-faint mt-0.5 block truncate text-[12px]'>
                          {thread.lastMessage?.text}
                        </span>
                      </span>
                      <span className='text-cab-mute text-[11px] whitespace-nowrap'>
                        {thread.lastMessage
                          ? formatAgo(thread.lastMessage.createdAt)
                          : ''}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <CabinetEmpty
                icon={<MessageSquare className='size-6' />}
                title='Непрочитанных нет'
                text='Все вопросы клиентов отвечены.'
              />
            )}
          </CabinetPanel>

          {!!moderation.length && (
            <CabinetPanel title='Туры на проверке' flush>
              <ul>
                {moderation.map(tour => {
                  const chip = tourChip(tour.status);

                  return (
                    <li
                      key={tour.id}
                      className='border-cab-line-soft border-b px-4 py-3 last:border-b-0 sm:px-5'
                    >
                      <div className='flex items-start gap-2'>
                        <Link
                          href={routes.cabinet.tourEditor(userId, tour.id)}
                          className='hover:text-cab-gold text-[13px] font-medium'
                        >
                          {tour.title}
                        </Link>
                        <Chip tone={chip.tone} className='ml-auto'>
                          {chip.label}
                        </Chip>
                      </div>
                      <p
                        className={cn(
                          'mt-1.5 text-[11.5px] leading-relaxed',
                          tour.rejectionComment ? 'text-cab-bad' : 'text-cab-mute'
                        )}
                      >
                        {tour.rejectionComment ? (
                          <>
                            <AlertTriangle className='mr-1 inline size-3.5' />
                            {tour.rejectionComment}
                          </>
                        ) : (
                          <>
                            <Clock className='mr-1 inline size-3.5' />
                            На проверке у администратора — обычно занимает сутки.
                            Пока тур виден только вам.
                          </>
                        )}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </CabinetPanel>
          )}
        </div>
      </section>
    </div>
  );
};
