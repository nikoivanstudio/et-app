'use client';

import { FC } from 'react';

import type { CityOption } from '@/entities/city/domain';

import { cn } from '@/shared/lib/css';

/**
 * Города подбора: отметить нужные из справочника.
 *
 * Было полем свободного ввода (`ChipsInput`), и по набранным там строкам
 * строятся подборки «джип-туры из …». То есть опечатка в этом поле не
 * ломала ничего видимого — она просто оставляла тур вне подборки.
 * Городов в справочнике десятки, поэтому список, а не поиск.
 */
export const CityPicker: FC<{
  values: string[];
  cities: CityOption[];
  /** Город старта в списке не нужен: из него и так выезжают. */
  exclude?: string;
  onChange: (values: string[]) => void;
}> = ({ values, cities, exclude, onChange }) => {
  const toggle = (slug: string) =>
    onChange(
      values.includes(slug)
        ? values.filter(item => item !== slug)
        : [...values, slug]
    );

  return (
    <div className='border-cab-line flex flex-wrap gap-2 rounded-[10px] border bg-[#121215] p-2'>
      {cities
        .filter(city => city.slug !== exclude)
        .map(city => {
          const isPicked = values.includes(city.slug);

          return (
            <button
              key={city.slug}
              type='button'
              aria-pressed={isPicked}
              onClick={() => toggle(city.slug)}
              className={cn(
                'rounded-full border px-3 py-1 text-[12.5px] transition-colors',
                isPicked
                  ? 'border-cab-gold/45 bg-cab-gold/13 text-cab-ink'
                  : 'border-cab-line text-cab-mute hover:text-cab-ink'
              )}
            >
              {city.title}
            </button>
          );
        })}
    </div>
  );
};
