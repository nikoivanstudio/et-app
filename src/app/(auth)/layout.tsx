'use server';

import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';

import logo from '@/shared/assets/images/logo.png';

const AuthLayout: FC<PropsWithChildren> = async ({ children }) => (
  /* Было: белая shadcn-карточка на bg-zinc-800 без единого токена бренда —
     гид попадал сюда из письма и видел «другой продукт». */
  <div className='flex min-h-screen w-full flex-col justify-center bg-ink px-4 py-12'>
    <div className='mx-auto mb-7 text-center'>
      <Image
        src={logo}
        alt='Energy Tour'
        width={62}
        height={70}
        className='mx-auto h-[70px] w-auto object-contain'
      />
      <p className='font-oswald mt-3 text-xs uppercase tracking-[2.4px] text-gold-photo/60'>
        Energy Tour · Крым
      </p>
    </div>
    <div className='mx-auto w-full max-w-md'>{children}</div>
    <p className='font-oswald mx-auto mt-6 max-w-md text-center text-xs tracking-wide text-white/55'>
      Заявку можно оформить и без входа — аккаунт нужен гиду
    </p>
  </div>
);

export default AuthLayout;
