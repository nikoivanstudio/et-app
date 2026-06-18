'use client';

import { cn } from '@bem-react/classname';

import {
  FormCheckTypes,
  FormRowProps,
  Value
} from '@/entities/form-dialog/domain';
import { Checkbox } from '@/entities/form-dialog/ui/checkbox';
import { DatePicker } from '@/entities/form-dialog/ui/date-picker';
import { InputTypeBlocks } from '@/entities/form-dialog/ui/input-type-blocks';
import { InputTypeFile } from '@/entities/form-dialog/ui/input-type-file';
import { InputTypeNumber } from '@/entities/form-dialog/ui/input-type-number';
import { InputTypeString } from '@/entities/form-dialog/ui/input-type-string';
import { MultiSelect } from '@/entities/form-dialog/ui/multi-select';
import { Select } from '@/entities/form-dialog/ui/select';

export const cnFormRow = cn('FormRow');

export const FormRow = <
  T extends Record<string, unknown> = Record<string, string>
>({
  type,
  value,
  label,
  name,
  onChange,
  multiple,
  hidden,
  options,
  error
}: FormRowProps<FormCheckTypes<T>>) => (
  <div className={cnFormRow(null)}>
    <div className={hidden ? 'absolute top-[-1000px]' : undefined}>
      <span className='block mb-3 px-3'>{label}</span>
      {type === 'string' && (
        <InputTypeString
          name={name}
          onChange={onChange}
          value={value}
          type={type}
          multiple={multiple}
        />
      )}
      {type === 'number' && (
        <InputTypeNumber
          name={name}
          onChange={onChange}
          value={value}
          type={type}
        />
      )}
      {type === 'boolean' && (
        <Checkbox
          value={value}
          name={name}
          onChange={
            onChange as (
              value: Record<string, Value<Record<string, string>>>
            ) => void
          }
          type={type}
        />
      )}
      {type === 'files' && (
        <InputTypeFile
          name={name}
          onChange={onChange}
          type={type}
          multiple={multiple}
        />
      )}
      {type === 'date' && (
        <DatePicker name={name} onChange={onChange} type={type} />
      )}
      {type === 'select' && !!options?.length && (
        <Select
          name={name}
          onChange={onChange}
          value={value}
          type={type}
          options={options}
        />
      )}
      {type === 'stringArray' && !!options?.length && (
        <MultiSelect
          name={name}
          onChange={onChange}
          value={value}
          type={type}
          options={options}
        />
      )}
      {type === 'blocks' && (
        <InputTypeBlocks
          name={name}
          onChange={onChange}
          value={value}
          type={type}
        />
      )}
    </div>
    <div className={cnFormRow('Error', ['text-red-600', 'h-6'])}>{error}</div>
  </div>
);
