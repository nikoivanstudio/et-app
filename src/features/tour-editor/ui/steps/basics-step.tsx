'use client';

import { FC } from 'react';

import { MONTHS_SHORT_LABELS } from '@/features/cabinet/lib/format';

import { cn } from '@/shared/lib/css';
import { cabinetInput, Field } from '@/shared/ui/cabinet';

import { TourEditorData } from '../../model/types';
import { ChipsInput } from '../chips-input';

import { StepShell } from './step-shell';

const DIFFICULTY = [
  { id: 'EASY', label: 'Лёгкий' },
  { id: 'MEDIUM', label: 'Средний' },
  { id: 'HARD', label: 'Сложный' }
];

const toggle = (values: number[], value: number): number[] =>
  values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value].sort((a, b) => a - b);

export const BasicsStep: FC<{
  tour: TourEditorData;
  set: <K extends keyof TourEditorData>(key: K, value: TourEditorData[K]) => void;
}> = ({ tour, set }) => (
  <StepShell title='Шаг 1. Основное' hint='С этого начинается карточка тура'>
    <Field
      label='Название тура'
      htmlFor='tour-title'
      hint={`${tour.title.length} из 180 знаков. Это же название встанет в заголовок страницы и в поиск.`}
    >
      <input
        id='tour-title'
        value={tour.title}
        onChange={event => set('title', event.target.value)}
        maxLength={180}
        placeholder='Джип-тур на Ай-Петри из Ялты'
        className={cabinetInput}
      />
    </Field>

    <Field
      label='Коротко о туре'
      htmlFor='tour-about'
      hint={`${tour.about.length} из 512 знаков. Этот текст показывается в карточке тура в каталоге.`}
    >
      <textarea
        id='tour-about'
        value={tour.about}
        onChange={event => set('about', event.target.value)}
        maxLength={512}
        rows={3}
        placeholder='Поднимаемся на плато по старой военной дороге, заезжаем к водопаду и зубцам.'
        className={cn(cabinetInput, 'resize-none')}
      />
    </Field>

    <div className='grid gap-4 sm:grid-cols-3'>
      <Field label='Город старта' htmlFor='tour-city'>
        <input
          id='tour-city'
          value={tour.startCity}
          onChange={event => set('startCity', event.target.value)}
          maxLength={120}
          placeholder='Ялта'
          className={cabinetInput}
        />
      </Field>
      <Field label='Длительность, часов' htmlFor='tour-duration'>
        <input
          id='tour-duration'
          type='number'
          min={1}
          max={24}
          value={tour.durationHours}
          onChange={event => set('durationHours', Number(event.target.value))}
          className={cabinetInput}
        />
      </Field>
      <Field
        label='Сколько человек берёт машина'
        htmlFor='tour-capacity'
        hint='Главный вопрос на входящем звонке.'
      >
        <input
          id='tour-capacity'
          type='number'
          min={1}
          max={100}
          value={tour.capacity ?? ''}
          onChange={event =>
            set('capacity', event.target.value ? Number(event.target.value) : null)
          }
          className={cabinetInput}
        />
      </Field>
    </div>

    <div className='grid gap-4 sm:grid-cols-3'>
      <Field label='Сложность'>
        <div className='flex flex-wrap gap-2'>
          {DIFFICULTY.map(item => (
            <button
              key={item.id}
              type='button'
              onClick={() =>
                set('difficulty', tour.difficulty === item.id ? '' : item.id)
              }
              className={cn(
                'rounded-full border px-3.5 py-2 text-[12.5px]',
                tour.difficulty === item.id
                  ? 'border-cab-gold/45 bg-cab-gold/13 text-cab-ink'
                  : 'border-cab-line text-cab-dim'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label='Цена' htmlFor='tour-price'>
        <input
          id='tour-price'
          type='number'
          min={0}
          step={100}
          value={tour.price}
          onChange={event => set('price', Number(event.target.value))}
          className={cabinetInput}
        />
      </Field>

      <Field
        label='Цена указана'
        hint='Без этого «от 8 000 ₽» и «2000 за машину» стоят на странице рядом.'
      >
        <div className='flex flex-wrap gap-2'>
          {[
            { id: 'PER_CAR', label: 'за машину' },
            { id: 'PER_PERSON', label: 'с человека' }
          ].map(item => (
            <button
              key={item.id}
              type='button'
              onClick={() => set('priceUnit', item.id)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-[12.5px]',
                tour.priceUnit === item.id
                  ? 'border-cab-gold/45 bg-cab-gold/13 text-cab-ink'
                  : 'border-cab-line text-cab-dim'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Field>
    </div>

    <Field
      label='Когда тур идёт'
      hint='Ничего не выбрано — тур круглогодичный. Зимой половина маршрутов на плато недоступна, и показывать их в декабре — гарантированная несостоявшаяся заявка.'
    >
      <div className='flex flex-wrap gap-2'>
        {MONTHS_SHORT_LABELS.map((month, index) => {
          const value = index + 1;
          const isOn = tour.seasons.includes(value);

          return (
            <button
              key={month}
              type='button'
              onClick={() => set('seasons', toggle(tour.seasons, value))}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[12.5px]',
                isOn
                  ? 'border-cab-gold/45 bg-cab-gold/13 text-cab-ink'
                  : 'border-cab-line text-cab-dim'
              )}
            >
              {month}
            </button>
          );
        })}
      </div>
    </Field>

    <Field
      label='Активности и категории'
      hint='По ним тур попадает в подборки каталога.'
    >
      <ChipsInput
        values={tour.categories}
        onChange={values => set('categories', values)}
        placeholder='Джиппинг, экскурсия, для детей…'
        maxLength={60}
      />
    </Field>
  </StepShell>
);
