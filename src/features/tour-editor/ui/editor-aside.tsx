'use client';

import { AlertTriangle, Check } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

import {
  formatDuration,
  formatMoney,
  formatPriceUnit
} from '@/features/cabinet/lib/format';

import { cn } from '@/shared/lib/css';
import { cabinetAction, CabinetPanel } from '@/shared/ui/cabinet';

import { buildTourChecklist, tourCompleteness } from '../lib/checklist';
import { TourEditorData } from '../model/types';

/**
 * Правая колонка редактора: как тур увидит клиент, чего не хватает и как
 * карточка попадёт в поиск. Всё три блока считаются из тех же полей формы,
 * так что гид видит последствия правки сразу, а не после модерации.
 */
export const EditorAside: FC<{ tour: TourEditorData }> = ({ tour }) => {
  const checklist = buildTourChecklist(tour);
  const percent = tourCompleteness(checklist);
  const cover = tour.photos.find(photo => photo.isMain) ?? tour.photos[0];

  return (
    <div className='flex flex-col gap-4'>
      <div className='border-cab-line bg-cab-panel overflow-hidden rounded-2xl border'>
        <span className='bg-cab-raise relative block h-36'>
          {cover ? (
            <Image
              src={cover.source}
              alt={tour.title || 'Фото тура'}
              fill
              sizes='372px'
              className='object-cover'
            />
          ) : (
            <span className='text-cab-mute flex h-full items-center justify-center text-[12px]'>
              Фотографий пока нет
            </span>
          )}
        </span>
        <div className='p-4'>
          <span className='text-cab-mute text-[11.5px]'>
            Так тур увидит клиент
          </span>
          <h3 className='mt-2 text-[15px] font-semibold'>
            {tour.title || 'Название тура'}
          </h3>
          <div className='text-cab-faint mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px]'>
            {!!tour.startCity && <span>{tour.startCity}</span>}
            <span>{formatDuration(tour.durationHours * 3600)}</span>
            {!!tour.capacity && <span>до {tour.capacity} чел.</span>}
          </div>
          <div className='mt-3 flex items-center gap-2'>
            <span className='text-[17px] font-semibold'>
              {formatMoney(tour.price)}
            </span>
            <span className='text-cab-mute text-[11.5px]'>
              {formatPriceUnit(tour.priceUnit)}
            </span>
            <span
              className={cn(
                cabinetAction({ tone: 'gold', size: 'sm' }),
                'pointer-events-none ml-auto'
              )}
            >
              Оставить заявку
            </span>
          </div>
        </div>
      </div>

      <CabinetPanel
        title='Готовность карточки'
        action={<span className='text-cab-mute text-[12px]'>{percent}%</span>}
      >
        <span className='bg-cab-line block h-1.5 overflow-hidden rounded-full'>
          <span
            className='from-cab-gold block h-full bg-linear-to-r to-[#8b6f3d]'
            style={{ width: `${percent}%` }}
          />
        </span>

        <ul className='mt-3.5 flex flex-col gap-2.5'>
          {checklist.map(item => (
            <li
              key={item.id}
              className='grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2.5 text-[12.5px] text-[#c7c7cd]'
            >
              {item.done ? (
                <Check className='text-cab-ok size-4' />
              ) : (
                <AlertTriangle
                  className={cn(
                    'size-4',
                    item.required ? 'text-cab-gold' : 'text-cab-mute'
                  )}
                />
              )}
              <span>
                {item.label}
                {!item.required && !item.done && (
                  <span className='text-cab-mute'> — необязательно</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <p className='text-cab-mute mt-3 text-[11.5px] leading-relaxed'>
          Золотым отмечено то, без чего тур не отправить на проверку.
        </p>
      </CabinetPanel>

      <CabinetPanel title='Как это попадёт в поиск'>
        <div className='border-cab-line rounded-[10px] border bg-[#121215] p-3'>
          <p className='text-cab-mute text-[11.5px]'>
            energy-tour.ru › tour › {tour.slug || 'novyy-tur'}
          </p>
          <p className='text-cab-info mt-1 text-[14px]'>
            {tour.metaTitle || tour.title || 'Название тура'}
          </p>
          <p className='text-cab-faint mt-1 line-clamp-3 text-[12px] leading-relaxed'>
            {tour.metaDescription ||
              tour.about ||
              'Короткое описание тура — его же увидят в каталоге.'}
          </p>
        </div>
      </CabinetPanel>
    </div>
  );
};
