import { Turnstile } from 'next-turnstile';
import React, { ChangeEvent, FC, useId, useState } from 'react';

import { Otp } from '@/entities/otp';

import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const CLODFLARE_KEY = process.env.NEXT_PUBLIC_CF_SITE_KEY || '';

type Props = {
  type: 'signup' | 'signin';
  formData?: FormData;
  errors?: {
    login?: string;
    password?: string;
  };
};

export const AuthFields: FC<Props> = ({ type, errors, formData }) => {
  const [email, setEmail] = useState(formData?.get('login')?.toString() || '');
  const loginId = useId();
  const passwordId = useId();

  const isSignup = type === 'signup';
  const placeholder = isSignup
    ? 'Адрес электронной почты'
    : 'Введите ваше имя пользователя';

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  return (
    <>
      <div className='space-y-2'>
        <Label htmlFor={loginId}>
          {isSignup ? placeholder : 'Имя пользователя'}
        </Label>
        <Input
          id={loginId}
          type='login'
          name='login'
          value={email}
          onChange={onChangeEmail}
          placeholder={placeholder}
          required
          defaultValue={formData?.get('login')?.toString()}
        />
        {errors?.login && <div>{errors.login}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor={passwordId}>Пароль</Label>
        <Input
          id={passwordId}
          type='password'
          name='password'
          placeholder='Введите ваш пароль'
          required
          defaultValue={formData?.get('password')?.toString()}
        />
        {errors?.password && <div>{errors.password}</div>}
        {type === 'signup' && <Otp formData={formData} email={email} />}
        <Turnstile siteKey={CLODFLARE_KEY} theme='auto' />
      </div>
    </>
  );
};
