'use client';

import { RotateCcw, TriangleAlert } from 'lucide-react';
import { FC, useEffect } from 'react';

import { cabinetAction, CabinetEmpty } from '@/shared/ui/cabinet';

/**
 * Экран обрыва: гид открывает кабинет с телефона в горах, и «не удалось
 * загрузить» здесь — обычное дело, а не авария. Кнопка повторяет запрос,
 * ничего не теряя.
 */
const CabinetError: FC<{ error: Error; reset: () => void }> = ({
  error,
  reset
}) => {
  useEffect(() => {
    console.error('Ошибка кабинета', error);
  }, [error]);

  return (
    <div className='bg-cab-bg text-cab-ink flex min-h-screen items-center justify-center px-4'>
      <CabinetEmpty
        tone='alert'
        icon={<TriangleAlert className='size-6' />}
        title='Не удалось загрузить кабинет'
        text='Похоже, пропала связь с сервером. Уже отправленные ответы и заявки не потерялись — они на месте.'
        action={
          <button
            type='button'
            onClick={reset}
            className={cabinetAction({ tone: 'gold' })}
          >
            <RotateCcw className='size-4' />
            Повторить
          </button>
        }
      />
    </div>
  );
};

export default CabinetError;
