'use client';

import { FC, useId } from 'react';

import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export const AuthFields: FC = () => {
  const loginId = useId();
  const passwordId = useId();

  return (
    <>
      <div className='space-y-2'>
        <Label htmlFor={loginId}>E-mail</Label>
        <Input
          id={loginId}
          type='login'
          name='login'
          placeholder='Введите адрес электронной почты'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor={passwordId}>Пароль</Label>
        <Input
          id={passwordId}
          type='password'
          name='password'
          placeholder='Введите адрес электронной почты'
          required
        />
      </div>
    </>
  );
};
