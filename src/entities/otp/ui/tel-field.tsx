'use client';

import React, { ChangeEvent, FC, useId } from 'react';

import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

type Props = {
  onChangePhone?: (value: string) => void;
  defaultValue?: string;
};

export const TelField: FC<Props> = ({ onChangePhone, defaultValue }) => {
  const telId = useId();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangePhone?.(e.target.value);
  };

  return (
    <>
      <Label htmlFor={telId}>Ваш телефон</Label>
      <Input
        id={telId}
        type='tel'
        name='tel'
        placeholder='Введите ваш телефон'
        required
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </>
  );
};
