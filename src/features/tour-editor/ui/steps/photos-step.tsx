'use client';

import { ImagePlus, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FC, useRef } from 'react';

import { cabinetAction, CabinetNote } from '@/shared/ui/cabinet';

import { MIN_TOUR_PHOTOS } from '../../lib/checklist';
import { TourEditorData } from '../../model/types';

import { StepShell } from './step-shell';

/**
 * Фотографии тура.
 *
 * Загружать можно только в сохранённый тур: файл кладётся в хранилище и
 * сразу привязывается к туру, а у черновика без id привязывать не к чему.
 */
export const PhotosStep: FC<{
  tour: TourEditorData;
  isUploading: boolean;
  onUpload: (files: File[]) => void;
  onSetMain: (photoId: number) => void;
  onRemove: (photoId: number) => void;
}> = ({ tour, isUploading, onUpload, onSetMain, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length) onUpload(files);

    event.target.value = '';
  };

  return (
    <StepShell
      title='Шаг 5. Фотографии'
      hint={`${tour.photos.length} из минимум ${MIN_TOUR_PHOTOS} · первая станет главной`}
    >
      {!tour.id && (
        <CabinetNote tone='gold'>
          Сначала сохраните черновик — фотографии привязываются к туру.
        </CabinetNote>
      )}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {tour.photos.map(photo => (
          <figure
            key={photo.id}
            className='border-cab-line bg-cab-raise overflow-hidden rounded-xl border'
          >
            <span className='relative block h-36'>
              <Image
                src={photo.source}
                alt={photo.title}
                fill
                sizes='(max-width: 640px) 100vw, 320px'
                className='object-cover'
              />
            </span>
            <figcaption className='flex items-center gap-2 px-3 py-2.5'>
              {photo.isMain ? (
                <span className='border-cab-gold/35 bg-cab-gold/15 text-cab-gold inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px]'>
                  <Star className='size-3.5' />
                  главная
                </span>
              ) : (
                <button
                  type='button'
                  onClick={() => onSetMain(photo.id)}
                  className={cabinetAction({ tone: 'line', size: 'sm' })}
                >
                  сделать главной
                </button>
              )}
              <button
                type='button'
                aria-label='Удалить фотографию'
                onClick={() => onRemove(photo.id)}
                className='text-cab-mute hover:text-cab-bad ml-auto'
              >
                <Trash2 className='size-4' />
              </button>
            </figcaption>
          </figure>
        ))}

        <div className='border-cab-line flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 text-center'>
          <ImagePlus className='text-cab-mute size-6' />
          <p className='text-cab-faint text-[12.5px]'>
            Горизонтальные снимки от 1600 px по длинной стороне
          </p>
          <button
            type='button'
            disabled={!tour.id || isUploading}
            onClick={() => inputRef.current?.click()}
            className={cabinetAction({ tone: 'gold', size: 'sm' })}
          >
            {isUploading ? 'Загружаем…' : 'Выбрать фото'}
          </button>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            multiple
            onChange={pick}
            className='hidden'
          />
        </div>
      </div>

      <CabinetNote>
        Главная фотография — обложка карточки в каталоге и в шапке страницы
        тура. Остальные показываются галереей.
      </CabinetNote>
    </StepShell>
  );
};
