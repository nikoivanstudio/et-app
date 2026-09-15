'use client';

import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useSyncExternalStore } from 'react';

import { REGIONS } from '@/entities/region/constants/regions';
import { regionPath } from '@/entities/region/lib/region-registry';

import { cn } from '@/shared/lib/css';
import {
  REGION_COOKIE,
  REGION_COOKIE_MAX_AGE
} from '@/shared/lib/geo/region-cookie';

/**
 * Выбранный регион как внешнее хранилище.
 *
 * Cookie читается через `useSyncExternalStore`, а не в эффекте: при
 * серверном рендере снимок пуст, при клиентском — берётся из браузера,
 * и React сам разводит эти два состояния без мигания после гидратации.
 */
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const readRegionCookie = (): string =>
  document.cookie
    .split('; ')
    .find(row => row.startsWith(`${REGION_COOKIE}=`))
    ?.split('=')[1] ?? '';

/** На сервере выбора ещё нет: cookie живёт в браузере. */
const readServerSnapshot = (): string => '';

const writeRegionCookie = (slug: string): void => {
  document.cookie = `${REGION_COOKIE}=${slug}; path=/; max-age=${REGION_COOKIE_MAX_AGE}; samesite=lax`;
  listeners.forEach(listener => listener());
};

/**
 * Переключатель региона.
 *
 * Клиентский компонент и читает cookie в браузере — это не стилистика.
 * Любое обращение к `cookies()` в серверном рендере переводит маршрут
 * в динамику и обнуляет ISR на всех 868 публичных страницах; ровно из-за
 * этого из шапки в своё время убрали `verifySession()` (см. комментарий
 * в `widgets/app-header/containers/app-header.tsx`), и повторять эту
 * ошибку ради переключателя нельзя.
 *
 * Пока опубликован один регион, переключатель не рендерится вовсе —
 * условие стоит у места вызова, в `main-nav` и `desktop-nav`.
 *
 * Определения по IP здесь нет намеренно. IP отвечает на вопрос «откуда
 * смотрят», а регион на туристическом сайте — на вопрос «куда едем»:
 * человек ищет туры по Крыму, сидя в Москве. Подробности — `docs/geo/plan.md`.
 */
export const RegionSwitcher: FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const published = REGIONS.filter(region => region.isPublished);
  const current = useSyncExternalStore(
    subscribe,
    readRegionCookie,
    readServerSnapshot
  );

  const select = (slug: string) => {
    const region = published.find(item => item.slug === slug);

    if (!region) {
      return;
    }

    writeRegionCookie(slug);

    // Уводим на корень региона, а не остаёмся на месте: текущий адрес
    // принадлежит прежнему региону, и оставить человека на нём — значит
    // показать переключённый регион в шапке и чужие туры под ней.
    router.push(regionPath(region, '/'));
  };

  const selected = published.some(region => region.slug === current)
    ? current
    : published[0].slug;

  return (
    <label className={cn('flex items-center gap-1.5', className)}>
      <MapPin className='size-4 shrink-0' aria-hidden />
      <span className='sr-only'>Регион</span>
      <select
        value={selected}
        onChange={event => select(event.target.value)}
        className='bg-transparent text-[15px] outline-none'
      >
        {published.map(region => (
          <option key={region.slug} value={region.slug}>
            {region.title}
          </option>
        ))}
      </select>
    </label>
  );
};
