'use client';

import { Plus, X } from 'lucide-react';
import { FC, KeyboardEvent, useState } from 'react';

import { cn } from '@/shared/lib/css';

/**
 * Список коротких значений (что входит в цену, категории, города подбора).
 *
 * В базе это массивы строк, а не текст, — потому что каждый пункт рендерится
 * отдельной строкой на странице тура и попадает в разметку. Здесь они и
 * правятся по одному: Enter добавляет, крестик убирает.
 */
export const ChipsInput: FC<{
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxLength?: number;
  id?: string;
}> = ({ values, onChange, placeholder = 'Добавить', maxLength = 200, id }) => {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();

    if (!value || values.includes(value)) {
      setDraft('');

      return;
    }

    onChange([...values, value.slice(0, maxLength)]);
    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      add();
    }

    if (event.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className='border-cab-line flex flex-wrap items-center gap-2 rounded-[10px] border bg-[#121215] p-2'>
      {values.map(value => (
        <span
          key={value}
          className='border-cab-gold/45 bg-cab-gold/13 text-cab-ink inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12.5px]'
        >
          {value}
          <button
            type='button'
            aria-label={`Убрать «${value}»`}
            onClick={() => onChange(values.filter(item => item !== value))}
            className='text-cab-mute hover:text-cab-ink'
          >
            <X className='size-3.5' />
          </button>
        </span>
      ))}

      <span className='flex min-w-40 flex-1 items-center gap-1.5'>
        <input
          id={id}
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            'text-cab-ink placeholder:text-cab-mute w-full bg-transparent px-1.5 py-1 text-[13px] outline-none'
          )}
        />
        <button
          type='button'
          onClick={add}
          aria-label='Добавить'
          className='text-cab-mute hover:text-cab-gold'
        >
          <Plus className='size-4' />
        </button>
      </span>
    </div>
  );
};
