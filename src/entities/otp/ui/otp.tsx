'use client';

import React, { FC, useId, useState } from 'react';
import { toast } from 'sonner';

import { otpApi } from '@/entities/otp/api/otp-api';
import { emailSchema, telSchema } from '@/entities/otp/model/schemas';
import { TelField } from '@/entities/otp/ui/tel-field';

import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type Props = {
  email: string;
  setHasOtp?: (value: boolean) => void;
  formData?: FormData;
};

export const Otp: FC<Props> = ({ email, formData, setHasOtp }) => {
  const [tel, setTel] = useState('');
  const [hasTimeout, setHasTimeout] = useState<boolean>(false);

  const codeId = useId();
  const isValidMail = emailSchema.safeParse(email)?.success;
  const isValidPhone = telSchema.safeParse(tel)?.success;

  const debounceTimeout = () => {
    setHasTimeout(true);
    setHasOtp?.(isValidPhone);

    setTimeout(() => {
      setHasTimeout(false);
    }, 60000);
  };

  const onChangePhone = (value: string) => {
    setTel(value);
  };

  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const response = await otpApi.sendCode<{
      success: boolean;
      content: string;
    }>({
      email,
      tel
    });

    if (!response.success) {
      return toast.error(response.content);
    }

    toast.success(response.content);

    debounceTimeout();
  };

  return (
    <>
      <TelField
        onChangePhone={onChangePhone}
        defaultValue={formData?.get('tel')?.toString()}
      />
      <Input
        id={codeId}
        type='number'
        name='code'
        required
        placeholder='Код подтверждения'
        defaultValue={formData?.get('code')?.toString()}
      />
      {hasTimeout && (
        <span
          className={cn(
            'block',
            'p-2',
            'text-xs',
            'text-zinc-500',
            'text-center'
          )}
        >
          Повторно код можно будет отправить через 60 секунд
        </span>
      )}
      <Button
        onClick={onClick}
        disabled={!isValidPhone || !isValidMail || hasTimeout}
        className='w-full'
      >
        Получить код
      </Button>
    </>
  );
};
