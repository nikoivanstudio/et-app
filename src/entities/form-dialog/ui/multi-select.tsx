import { useState } from 'react';

import { InputProps } from '@/entities/form-dialog/domain';
import { mergeOptions } from '@/entities/form-dialog/lib/multi-select-utils';

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from '@/shared/ui/multi-selector';

export const MultiSelect = <
  T extends Record<string, unknown> = Record<string, string>
>({
  name,
  options: defaultOptions,
  value: values,
  onChange,
  placeHolder
}: InputProps<T, string[]> & { placeHolder?: string; options: string[] }) => {
  const [value, setValue] = useState<string[]>(values || []);

  const options = mergeOptions(defaultOptions, values);

  const toggleSelection = (values: string[]) => {
    setValue(values);
    onChange({ [name]: values });
  };

  return (
    <MultiSelector values={value} onValuesChange={toggleSelection} loop>
      <MultiSelectorTrigger className='dark:bg-input/30'>
        <MultiSelectorInput placeholder={placeHolder} />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {options.map((option, idx) => (
            <MultiSelectorItem value={option} key={idx}>
              {option}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};
