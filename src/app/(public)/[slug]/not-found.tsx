import Link from 'next/link';
import { FC } from 'react';

/**
 * У публичных страниц шапка лежит поверх фото-героя, поэтому её иконки белые.
 * На 404 фото нет — экран делаем тёмным (--ink), иначе бургер и телефон
 * пропадают на светлом фоне.
 */
const NotFound: FC = () => (
  <div className='bg-ink flex min-h-[80vh] items-center justify-center px-4 py-24'>
    <div className='mx-auto max-w-[520px] text-center'>
      <p className='font-oswald text-gold-photo text-sm tracking-[0.18em] uppercase'>
        Ошибка 404
      </p>
      <h1 className='text-cream mt-4 text-[28px] leading-tight'>
        Такого тура у нас нет
      </h1>
      <p className='text-cream/80 mt-3 text-[15px] leading-relaxed'>
        Возможно, страница переехала или ссылка устарела. Посмотрите все
        маршруты — или позвоните, подберём выезд под ваши даты.
      </p>
      <div className='mt-8 flex flex-col items-center gap-2'>
        <Link
          className='bg-cta text-on-cta hover:bg-cta-press rounded-pill flex min-h-12 w-full max-w-[320px] items-center justify-center px-6 font-medium transition-colors'
          href='/category/vse_tury'
        >
          Все туры
        </Link>
        <Link
          className='text-cream/80 hover:text-cream flex min-h-12 items-center px-4 text-sm underline underline-offset-4'
          href='/'
        >
          На главную
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
