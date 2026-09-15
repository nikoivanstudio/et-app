'use client';

import { MapPin } from 'lucide-react';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { cabinetInput, Field } from '@/shared/ui/cabinet';

import { TourEditorData } from '../../model/types';
import { ChipsInput } from '../chips-input';

import { StepShell } from './step-shell';

export const MeetingStep: FC<{
  tour: TourEditorData;
  set: <K extends keyof TourEditorData>(key: K, value: TourEditorData[K]) => void;
}> = ({ tour, set }) => (
  <StepShell
    title='Шаг 6. Точка старта'
    hint='Отсюда клиент строит дорогу до места встречи'
  >
    <div className='grid gap-4 sm:grid-cols-2'>
      <Field label='Город' htmlFor='meeting-city'>
        <input
          id='meeting-city'
          value={tour.startCity}
          onChange={event => set('startCity', event.target.value)}
          maxLength={120}
          placeholder='Ялта'
          className={cabinetInput}
        />
      </Field>
      <Field label='Адрес встречи' htmlFor='meeting-address'>
        <input
          id='meeting-address'
          value={tour.meetingAddress}
          onChange={event => set('meetingAddress', event.target.value)}
          maxLength={300}
          placeholder='ул. Московская, 8, автовокзал'
          className={cabinetInput}
        />
      </Field>
    </div>

    <Field
      label='Как добраться'
      htmlFor='meeting-note'
      hint='Самый частый вопрос перед выездом: по какому ориентиру искать и что рядом.'
    >
      <textarea
        id='meeting-note'
        value={tour.meetingNote}
        onChange={event => set('meetingNote', event.target.value)}
        rows={4}
        maxLength={1000}
        placeholder='Площадка у касс междугородних рейсов, ориентир — синий внедорожник с наклейкой Energy Tour.'
        className={cn(cabinetInput, 'resize-none leading-relaxed')}
      />
    </Field>

    <Field
      label='Можем забрать ещё отсюда'
      hint='Из этих городов тур попадёт в подборки «джип-туры из …».'
    >
      <ChipsInput
        values={tour.pickupCities}
        onChange={values => set('pickupCities', values)}
        placeholder='Алупка'
        maxLength={120}
      />
    </Field>

    <p className='text-cab-mute flex items-center gap-2 text-[11.5px]'>
      <MapPin className='size-3.5' />
      Точка на карте задаётся администратором из справочника мест — по ней
      строится блок «туры сюда» на странице объекта.
    </p>
  </StepShell>
);
