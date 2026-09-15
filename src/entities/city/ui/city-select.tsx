'use client';

import { FC } from 'react';

import type { CityOption } from '@/entities/city/domain';

import { cabinetInput } from '@/shared/ui/cabinet';

/**
 * Выбор города из справочника вместо свободного ввода.
 *
 * Поле было обычным `input`, и это работало ровно до второго гида:
 * «Ялта», «г. Ялта» и «ялта» — три разных города для любой выборки,
 * и тур, у которого набрано не то написание, просто не попадает
 * в подборку своего города. Ошибка при этом ничем себя не проявляет,
 * поэтому единственная защита — не давать её совершить.
 *
 * Значение — слаг города, а не название: название это подпись, и правка
 * подписи в справочнике не должна отвязывать от города десяток туров.
 */
export const CitySelect: FC<{
  id?: string;
  value: string;
  cities: CityOption[];
  onChange: (slug: string) => void;
}> = ({ id, value, cities, onChange }) => {
  // Группируем по региону: пока регион один, `optgroup` не появляется
  // и список выглядит как обычный.
  const regions = [...new Set(cities.map(city => city.regionSlug))];

  return (
    <select
      id={id}
      value={value}
      onChange={event => onChange(event.target.value)}
      className={cabinetInput}
    >
      <option value=''>Не выбран</option>

      {regions.length > 1
        ? regions.map(regionSlug => (
            <optgroup
              key={regionSlug}
              label={
                cities.find(city => city.regionSlug === regionSlug)
                  ?.regionTitle ?? regionSlug
              }
            >
              {cities
                .filter(city => city.regionSlug === regionSlug)
                .map(city => (
                  <option key={city.slug} value={city.slug}>
                    {city.title}
                  </option>
                ))}
            </optgroup>
          ))
        : cities.map(city => (
            <option key={city.slug} value={city.slug}>
              {city.title}
            </option>
          ))}
    </select>
  );
};
