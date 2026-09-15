'use client';

import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

import { formatMoney, formatPriceUnit } from '@/features/cabinet/lib/format';

import { cn } from '@/shared/lib/css';
import {
  cabinetAction,
  cabinetInput,
  CabinetNote,
  Field
} from '@/shared/ui/cabinet';

import { TourEditorData } from '../../model/types';

import { StepShell } from './step-shell';

const emptyOption = {
  label: '',
  unit: 'PER_CAR',
  durationHours: 4,
  price: 0
};

/**
 * Цены.
 *
 * Базовая цена остаётся в `price` — по ней сортируется каталог и строится
 * «от N ₽». Варианты билетов лежат отдельным полем: у одного тура бывает
 * и сборная группа с человека, и вся машина целиком.
 */
export const PricingStep: FC<{
  tour: TourEditorData;
  set: <K extends keyof TourEditorData>(key: K, value: TourEditorData[K]) => void;
}> = ({ tour, set }) => {
  const [draft, setDraft] = useState(emptyOption);

  const minPrice = [tour.price, ...tour.priceOptions.map(item => item.price)]
    .filter(price => price > 0)
    .sort((a, b) => a - b)[0];

  const add = () => {
    if (draft.label.trim().length < 2) return;

    set('priceOptions', [
      ...tour.priceOptions,
      { ...draft, label: draft.label.trim() }
    ]);
    setDraft(emptyOption);
  };

  return (
    <StepShell
      title='Шаг 3. Цены'
      hint='Укажите свою обычную цену — комиссия площадки считается от неё'
    >
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Field label='Базовая цена' htmlFor='price-base'>
          <input
            id='price-base'
            type='number'
            min={0}
            step={100}
            value={tour.price}
            onChange={event => set('price', Number(event.target.value))}
            className={cabinetInput}
          />
        </Field>
        <Field label='За что цена'>
          <div className='flex gap-2'>
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
        <Field
          label='Минимум участников'
          htmlFor='price-min'
          hint='Со скольких человек выезд состоится.'
        >
          <input
            id='price-min'
            type='number'
            min={1}
            max={100}
            value={tour.minGroupSize ?? ''}
            onChange={event =>
              set(
                'minGroupSize',
                event.target.value ? Number(event.target.value) : null
              )
            }
            className={cabinetInput}
          />
        </Field>
        <Field
          label='Принимать заявки не позднее'
          htmlFor='price-lead'
          hint='За сколько дней до выезда закрывается запись.'
        >
          <input
            id='price-lead'
            type='number'
            min={0}
            max={60}
            value={tour.bookingLeadDays ?? ''}
            onChange={event =>
              set(
                'bookingLeadDays',
                event.target.value ? Number(event.target.value) : null
              )
            }
            className={cabinetInput}
          />
        </Field>
      </div>

      <Field label='Варианты билетов'>
        <div className='border-cab-line overflow-hidden rounded-xl border'>
          <div className='border-cab-line-soft text-cab-mute grid grid-cols-[1.6fr_1fr_1fr_120px_40px] gap-3 border-b px-3.5 py-2.5 text-[11px] tracking-[0.14em] uppercase'>
            <span>Вариант</span>
            <span>Формат</span>
            <span>Длительность</span>
            <span className='text-right'>Цена</span>
            <span />
          </div>

          {tour.priceOptions.map((option, index) => (
            <div
              key={`${option.label}-${index}`}
              className='border-cab-line-soft grid grid-cols-[1.6fr_1fr_1fr_120px_40px] items-center gap-3 border-b px-3.5 py-3 text-[13px] last:border-b-0'
            >
              <span>{option.label}</span>
              <span className='text-cab-faint'>
                {formatPriceUnit(option.unit)}
              </span>
              <span className='text-cab-faint'>{option.durationHours} ч</span>
              <span className='text-right font-semibold'>
                {formatMoney(option.price)}
              </span>
              <button
                type='button'
                aria-label='Убрать вариант'
                onClick={() =>
                  set(
                    'priceOptions',
                    tour.priceOptions.filter(entry => entry !== option)
                  )
                }
                className='text-cab-mute hover:text-cab-bad'
              >
                <Trash2 className='size-4' />
              </button>
            </div>
          ))}

          <div className='grid grid-cols-[1.6fr_1fr_1fr_120px_40px] items-center gap-3 px-3.5 py-3'>
            <input
              value={draft.label}
              onChange={event => setDraft({ ...draft, label: event.target.value })}
              placeholder='Сборная группа'
              aria-label='Название варианта'
              className={cabinetInput}
            />
            <select
              value={draft.unit}
              onChange={event => setDraft({ ...draft, unit: event.target.value })}
              aria-label='Формат цены'
              className={cabinetInput}
            >
              <option value='PER_CAR'>за машину</option>
              <option value='PER_PERSON'>с человека</option>
            </select>
            <input
              type='number'
              min={1}
              max={24}
              value={draft.durationHours}
              onChange={event =>
                setDraft({ ...draft, durationHours: Number(event.target.value) })
              }
              aria-label='Длительность варианта'
              className={cabinetInput}
            />
            <input
              type='number'
              min={0}
              step={100}
              value={draft.price}
              onChange={event =>
                setDraft({ ...draft, price: Number(event.target.value) })
              }
              aria-label='Цена варианта'
              className={cn(cabinetInput, 'text-right')}
            />
            <button
              type='button'
              onClick={add}
              aria-label='Добавить вариант'
              className={cabinetAction({ tone: 'solid', size: 'sm' })}
            >
              <Plus className='size-4' />
            </button>
          </div>
        </div>
      </Field>

      <CabinetNote tone='gold'>
        <AlertTriangle className='mt-0.5 size-3.5 shrink-0' />
        <span>
          В карточке тура клиент увидит «от {formatMoney(minPrice ?? 0)}» —
          минимальную из цен.
        </span>
      </CabinetNote>
    </StepShell>
  );
};
