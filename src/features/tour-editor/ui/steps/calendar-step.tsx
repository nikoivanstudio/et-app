'use client';

import { CalendarDays } from 'lucide-react';
import { FC, useState } from 'react';

import { cn } from '@/shared/lib/css';
import { cabinetInput, CabinetNote, Field } from '@/shared/ui/cabinet';

import { TourEditorData } from '../../model/types';

import { StepShell } from './step-shell';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const monthName = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric'
});

const toKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/**
 * Календарь тура.
 *
 * Занятые дни не редактируются: они приходят из заявок (`desiredDate`),
 * отдельной таблицы слотов в базе нет и заводить её ради подсветки незачем.
 * Руками гид закрывает только свободные дни — это и есть `blockedDates`.
 */
export const CalendarStep: FC<{
  tour: TourEditorData;
  set: <K extends keyof TourEditorData>(key: K, value: TourEditorData[K]) => void;
}> = ({ tour, set }) => {
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const cursor = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0
  ).getDate();
  // В русском календаре неделя начинается с понедельника, getDay() — с воскресенья.
  const leading = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7;

  const blocked = new Set(
    tour.blockedDates.map(date => toKey(new Date(date)))
  );
  const booked = new Map(
    tour.bookedDates.map(item => [
      toKey(new Date(item.date)),
      `${item.guestName}, ${item.peopleCount} чел.`
    ])
  );

  const toggleBlocked = (date: Date) => {
    const key = toKey(date);
    const iso = date.toISOString();

    set(
      'blockedDates',
      blocked.has(key)
        ? tour.blockedDates.filter(item => toKey(new Date(item)) !== key)
        : [...tour.blockedDates, iso]
    );
  };

  const toggleWeekday = (day: number) =>
    set(
      'weekdays',
      tour.weekdays.includes(day)
        ? tour.weekdays.filter(item => item !== day)
        : [...tour.weekdays, day].sort((a, b) => a - b)
    );

  return (
    <StepShell title='Шаг 4. Календарь' hint='Когда и как часто выезжаете'>
      <div className='grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start'>
        <div className='flex flex-col gap-4'>
          <Field label='Обычное время старта' htmlFor='calendar-time'>
            <input
              id='calendar-time'
              type='time'
              value={tour.startTime}
              onChange={event => set('startTime', event.target.value)}
              className={cn(cabinetInput, '[color-scheme:dark]')}
            />
          </Field>

          <Field
            label='Дни недели'
            hint='Ничего не выбрано — выезжаем в любой день.'
          >
            <div className='flex flex-wrap gap-2'>
              {WEEKDAYS.map((label, index) => {
                const day = index + 1;

                return (
                  <button
                    key={label}
                    type='button'
                    onClick={() => toggleWeekday(day)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-[12.5px]',
                      tour.weekdays.includes(day)
                        ? 'border-cab-gold/45 bg-cab-gold/13 text-cab-ink'
                        : 'border-cab-line text-cab-dim'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          <CabinetNote>
            <CalendarDays className='mt-0.5 size-3.5 shrink-0' />
            <span>
              Дни с выездами подтягиваются из заявок — вручную их не ставят.
              Закрыть можно любой свободный день.
            </span>
          </CabinetNote>
        </div>

        <div>
          <div className='mb-3 flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setMonthOffset(value => value - 1)}
              disabled={monthOffset === 0}
              className='text-cab-dim disabled:text-cab-mute/50 px-2 text-[13px]'
            >
              ←
            </button>
            <span className='text-[13px] font-medium'>
              {monthName.format(cursor)}
            </span>
            <button
              type='button'
              onClick={() => setMonthOffset(value => value + 1)}
              className='text-cab-dim px-2 text-[13px]'
            >
              →
            </button>
          </div>

          <div className='grid grid-cols-7 gap-1.5'>
            {WEEKDAYS.map(day => (
              <span
                key={day}
                className='text-cab-mute pb-1 text-center text-[11px] tracking-[0.12em] uppercase'
              >
                {day}
              </span>
            ))}

            {[...Array(leading).keys()].map(index => (
              <span key={`lead-${index}`} />
            ))}

            {[...Array(daysInMonth).keys()].map(index => {
              const date = new Date(
                cursor.getFullYear(),
                cursor.getMonth(),
                index + 1
              );
              const key = toKey(date);
              const isPast = date < today;
              const trip = booked.get(key);
              const isBlocked = blocked.has(key);

              return (
                <button
                  key={key}
                  type='button'
                  disabled={isPast || !!trip}
                  onClick={() => toggleBlocked(date)}
                  title={trip ?? (isBlocked ? 'День закрыт' : 'Закрыть день')}
                  className={cn(
                    'min-h-16 rounded-[10px] border px-2 py-1.5 text-left text-[13px]',
                    trip
                      ? 'border-cab-gold/45 bg-cab-gold/10 text-cab-ink'
                      : isBlocked
                        ? 'border-cab-line border-dashed text-cab-mute'
                        : isPast
                          ? 'border-cab-line bg-[#131316] text-[#4d4d55]'
                          : 'border-cab-line bg-cab-raise text-[#c7c7cd] hover:border-cab-gold/40'
                  )}
                >
                  {index + 1}
                  {!!trip && (
                    <span className='text-cab-gold mt-1 block text-[10.5px] leading-tight'>
                      {trip}
                    </span>
                  )}
                  {isBlocked && !trip && (
                    <span className='mt-1 block text-[10.5px]'>закрыто</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className='text-cab-faint mt-3 flex flex-wrap items-center gap-4 text-[12px]'>
            <span className='flex items-center gap-2'>
              <span className='border-cab-gold/45 bg-cab-gold/10 size-3 rounded border' />
              выезд по заявке
            </span>
            <span className='flex items-center gap-2'>
              <span className='border-cab-line size-3 rounded border border-dashed' />
              закрыто вручную
            </span>
            <span className='flex items-center gap-2'>
              <span className='border-cab-line size-3 rounded border bg-[#131316]' />
              прошедшие дни
            </span>
          </div>
        </div>
      </div>
    </StepShell>
  );
};
