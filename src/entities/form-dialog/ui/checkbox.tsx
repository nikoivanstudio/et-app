import { InputProps } from '@/entities/form-dialog/domain';

import { Checkbox as CheckboxUI } from '@/shared/ui/checkbox';

export const Checkbox = <
  T extends Record<string, unknown> = Record<string, string>
>({
  name,
  onChange,
  type,
  value
}: InputProps<T, boolean>) => {
  const onChangeBoolean = () => {
    if (type !== 'boolean') return;

    onChange({ [name]: !value });
  };

  return <CheckboxUI checked={value} name={name} onChange={onChangeBoolean} />;
};
