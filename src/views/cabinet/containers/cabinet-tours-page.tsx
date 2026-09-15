import { Plus, Route } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { CabinetShell } from '@/widgets/guide-cabinet/server';

import { CabinetBadges, CabinetIdentity } from '@/features/cabinet/server';
import { CabinetTourItem } from '@/features/tour-editor/server';

import { cabinetAction, CabinetEmpty, CabinetNote } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import {
  CabinetTourCard,
  tourFilterClass,
  tourMatchesFilter
} from '../ui/cabinet-tour-card';

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'APPROVED', label: 'Опубликованы' },
  { id: 'PENDING', label: 'На модерации' },
  { id: 'REJECTED', label: 'Отклонены' },
  { id: 'draft', label: 'Черновики' }
];

export const CabinetToursPage: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
  tours: CabinetTourItem[];
  filter?: string;
}> = ({ identity, badges, tours, filter = 'all' }) => {
  const visible = tours.filter(tour => tourMatchesFilter(tour, filter));

  return (
    <CabinetShell
      identity={identity}
      badges={badges}
      section='tours'
      title='Мои туры'
      subtitle='Список туров со статусами и тем, чего в карточке не хватает: это те самые поля, из которых собирается страница тура и её разметка для поиска.'
      actions={
        <Link
          href={routes.cabinet.newTour(identity.id)}
          className={cabinetAction({ tone: 'gold' })}
        >
          <Plus className='size-4' />
          Создать тур
        </Link>
      }
    >
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center gap-2'>
          {FILTERS.map(item => {
            const count = tours.filter(tour =>
              tourMatchesFilter(tour, item.id)
            ).length;

            return (
              <Link
                key={item.id}
                href={
                  item.id === 'all'
                    ? routes.cabinet.tours(identity.id)
                    : `${routes.cabinet.tours(identity.id)}?status=${item.id}`
                }
                className={tourFilterClass(item.id === filter)}
              >
                {item.label}
                {!!count && <span className='ml-1.5 font-semibold'>{count}</span>}
              </Link>
            );
          })}
        </div>

        {visible.length ? (
          <div className='flex flex-col gap-3'>
            {visible.map(tour => (
              <CabinetTourCard key={tour.id} userId={identity.id} tour={tour} />
            ))}
          </div>
        ) : (
          <CabinetEmpty
            icon={<Route className='size-6' />}
            title={
              tours.length ? 'В этой вкладке пусто' : 'Туров пока нет'
            }
            text={
              tours.length
                ? 'Здесь появятся туры с таким статусом.'
                : 'Создайте первый тур: шесть шагов, черновик сохраняется на каждом. Пока тур не отправлен на проверку, его видите только вы.'
            }
            action={
              <Link
                href={routes.cabinet.newTour(identity.id)}
                className={cabinetAction({ tone: 'gold' })}
              >
                <Plus className='size-4' />
                Создать тур
              </Link>
            }
          />
        )}

        <CabinetNote>
          Правка опубликованного тура возвращает его на проверку: изменённый
          текст не уезжает в каталог мимо модератора. Тур с незакрытыми заявками
          удалить нельзя — сначала снимите его с публикации.
        </CabinetNote>
      </div>
    </CabinetShell>
  );
};
