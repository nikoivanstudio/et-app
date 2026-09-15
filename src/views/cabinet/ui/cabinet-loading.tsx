import { FC } from 'react';

/**
 * Скелет кабинета.
 *
 * Прежний общий скелет рисовал кремовую страницу сайта — на тёмном кабинете
 * это читалось как вспышка чужого экрана. Здесь повторяется раскладка
 * кабинета: колонка меню и карточки списка.
 */
export const CabinetLoading: FC = () => (
  <div className='bg-cab-bg min-h-screen' aria-busy>
    <div className='grid min-h-screen lg:grid-cols-[264px_minmax(0,1fr)]'>
      <aside className='border-cab-line-soft hidden border-r bg-[#101013] px-4 py-5 lg:block'>
        <span className='bg-cab-line block h-9 w-36 animate-pulse rounded-xl' />
        <div className='mt-5 flex flex-col gap-2'>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <span
              key={index}
              className='bg-cab-line block h-11 animate-pulse rounded-[10px]'
            />
          ))}
        </div>
      </aside>

      <div className='flex min-w-0 flex-col'>
        <div className='border-cab-line-soft border-b px-4 py-5 sm:px-6 lg:px-8'>
          <span className='bg-cab-line block h-6 w-48 animate-pulse rounded-lg' />
          <span className='bg-cab-line mt-3 block h-3 w-2/3 max-w-[520px] animate-pulse rounded-full' />
        </div>

        <div className='flex flex-col gap-3 px-4 pt-5 sm:px-6 lg:px-8'>
          {[0, 1, 2, 3].map(index => (
            <span
              key={index}
              className='border-cab-line bg-cab-panel block h-28 animate-pulse rounded-2xl border'
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
