import { ChangeEvent } from 'react';

import { InputProps } from '@/entities/form-dialog/domain';

import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

export const InputTypeString = <
  T extends Record<string, unknown> = Record<string, string>
>({
  name,
  onChange,
  type,
  value,
  multiple
}: InputProps<T>) => {
  const onChangeString = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (type !== 'string') return;

    onChange({ [name]: e.target.value });
  };

  return (
    <>
      {multiple ? (
        <Textarea value={value} name={name} onChange={onChangeString} />
      ) : (
        <Input value={value} name={name} onChange={onChangeString} />
      )}
    </>
  );
};
