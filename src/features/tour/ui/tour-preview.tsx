'use client';

import { FC, useEffect, useState } from 'react';

import { emptyTourContent, TourContent } from '@/entities/tour/model/content';

import { cn } from '@/shared/lib/css';

import { TourContentView } from '@/views/tour/ui/tour-content';

export type TourPreviewProps = {
  title?: string;
  mainPhoto?: string | File | (string | File)[];
  price?: number | string;
  duration?: number | string;
  content?: TourContent;
  photos?: (string | File)[];
  rating?: number;
};

const normalizeMainPhoto = (
  value?: string | File | (string | File)[]
): string | File | undefined => (Array.isArray(value) ? value[0] : value);

const toSignature = (inputs: (string | File | undefined)[]) =>
  inputs
    .map(input =>
      !input
        ? ''
        : typeof input === 'string'
          ? input
          : `${input.name}:${input.size}`
    )
    .join('|');

// Преобразует File в object URL для живого предпросмотра и отзывает его
// при смене файлов/размонтировании, чтобы не текла память.
const useResolvedSources = (
  inputs: (string | File | undefined)[]
): (string | undefined)[] => {
  const signature = toSignature(inputs);
  const [sources, setSources] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    const created: string[] = [];
    const resolved = inputs.map(input => {
      if (!input) {
        return undefined;
      }

      if (typeof input === 'string') {
        return input;
      }

      const url = URL.createObjectURL(input);
      created.push(url);

      return url;
    });

    // Object URL — внешний ресурс: его нельзя создавать во время рендера,
    // потому что он требует парного revoke в cleanup. Поэтому setState здесь
    // неизбежен.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSources(resolved);

    return () => created.forEach(url => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return sources;
};

export const TourPreview: FC<TourPreviewProps> = ({
  title,
  mainPhoto,
  price,
  duration,
  content,
  photos = [],
  rating
}) => {
  const inputs = [normalizeMainPhoto(mainPhoto), ...photos];
  const resolved = useResolvedSources(inputs);

  const mainSrc = resolved[0];
  const gallerySrcs = resolved.slice(1).filter(Boolean) as string[];

  const safeContent: TourContent = content ?? emptyTourContent;
  const priceNumber = Number(price) || 0;
  const durationHours = duration ? Math.round(Number(duration) / 3600) : 0;

  return (
    <div
      className={cn(
        'rounded-2xl',
        'border',
        'overflow-hidden',
        'bg-white',
        'dark:bg-black'
      )}
    >
      <div className='relative w-full aspect-video bg-muted'>
        {mainSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainSrc}
            alt={title || ''}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='flex items-center justify-center w-full h-full text-muted-foreground'>
            Заглавное фото появится здесь
          </div>
        )}
        <h2 className='absolute inset-x-0 bottom-0 m-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-2xl font-medium text-white'>
          {title || 'Название тура'}
        </h2>
      </div>

      <div className='flex flex-wrap gap-6 border-b px-4 py-3 text-sm'>
        <span>
          Цена: <b>{priceNumber ? `${priceNumber} ₽` : '—'}</b>
        </span>
        <span>
          Длительность: <b>{durationHours ? `${durationHours} ч` : '—'}</b>
        </span>
        {!!rating && (
          <span>
            Рейтинг: <b>{rating}</b>
          </span>
        )}
      </div>

      <div className='p-4'>
        <TourContentView
          content={safeContent}
          photos={gallerySrcs.map(source => ({ source }))}
        />
      </div>
    </div>
  );
};
