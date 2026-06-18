'use client';

import { FC, useId } from 'react';

import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

type Props = {
  errors?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
};

export const ChangePasswordFields: FC<Props> = ({ errors }) => {
  const currentId = useId();
  const newId = useId();
  const confirmId = useId();

  return (
    <>
      <div className='space-y-2'>
        <Label htmlFor={currentId}>Текущий пароль</Label>
        <Input
          id={currentId}
          type='password'
          name='currentPassword'
          placeholder='Введите текущий пароль'
          autoComplete='current-password'
          required
        />
        {errors?.currentPassword && (
          <div className='text-sm text-destructive'>
            {errors.currentPassword}
          </div>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor={newId}>Новый пароль</Label>
        <Input
          id={newId}
          type='password'
          name='newPassword'
          placeholder='Введите новый пароль'
          autoComplete='new-password'
          required
        />
        {errors?.newPassword && (
          <div className='text-sm text-destructive'>{errors.newPassword}</div>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor={confirmId}>Повторите новый пароль</Label>
        <Input
          id={confirmId}
          type='password'
          name='confirmPassword'
          placeholder='Повторите новый пароль'
          autoComplete='new-password'
          required
        />
        {errors?.confirmPassword && (
          <div className='text-sm text-destructive'>
            {errors.confirmPassword}
          </div>
        )}
      </div>
    </>
  );
};
