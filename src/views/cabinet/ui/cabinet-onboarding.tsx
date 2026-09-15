import { Plus } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { cabinetAction, CabinetPanel } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

const STEPS = [
  {
    title: 'Заполните профиль',
    text: 'Фото, город и пара строк о себе. Без этого тур на модерации завернут.'
  },
  {
    title: 'Создайте первый тур',
    text: 'Шесть шагов: основное, описание, цены, календарь, фото, точка старта. Черновик сохраняется на каждом шаге.'
  },
  {
    title: 'Отправьте на проверку',
    text: 'Администратор смотрит примерно сутки. После публикации тур появится в каталоге и начнёт собирать заявки.'
  }
];

/**
 * Первый экран нового гида. Пустой кабинет — это не поломка, а незаконченная
 * настройка, поэтому вместо «данных нет» здесь три шага до первой заявки.
 */
export const CabinetOnboarding: FC<{ userId: number; hasProfile: boolean }> = ({
  userId,
  hasProfile
}) => (
  <CabinetPanel title='С чего начать'>
    <ol className='flex flex-col gap-2.5'>
      {STEPS.map((step, index) => {
        const isDone = index === 0 && hasProfile;

        return (
          <li
            key={step.title}
            className='border-cab-line bg-cab-raise grid grid-cols-[26px_minmax(0,1fr)] gap-3 rounded-xl border p-3.5'
          >
            <span
              className={cn(
                'grid size-[26px] place-items-center rounded-full text-[12px] font-semibold',
                isDone
                  ? 'bg-cab-ok/18 text-cab-ok'
                  : index === (hasProfile ? 1 : 0)
                    ? 'bg-cab-gold text-cab-on-gold'
                    : 'bg-cab-line text-cab-dim'
              )}
            >
              {index + 1}
            </span>
            <span>
              <b className='block text-[13px] font-semibold'>{step.title}</b>
              <span className='text-cab-faint mt-1 block text-[12px] leading-relaxed'>
                {step.text}
              </span>
            </span>
          </li>
        );
      })}
    </ol>

    <div className='mt-4 flex flex-wrap gap-2'>
      <Link
        href={routes.cabinet.newTour(userId)}
        className={cabinetAction({ tone: 'gold' })}
      >
        <Plus className='size-4' />
        Создать первый тур
      </Link>
      <Link
        href={routes.cabinet.profile(userId)}
        className={cabinetAction({ tone: 'line' })}
      >
        Заполнить профиль
      </Link>
    </div>
  </CabinetPanel>
);
