import { ChevronDownIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

import { InputProps } from '@/entities/form-dialog/domain';

import { dateUtils } from '@/shared/lib/date-utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export const DatePicker = <
  T extends Record<string, unknown> = Record<string, string>
>({
  name,
  onChange,
  type,
  value
}: InputProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [time, setTime] = useState<string>(
    date
      ? `${dateUtils.getFormattedValue(String(date.getHours()))}:${dateUtils.getFormattedValue(String(date.getMinutes()))}`
      : '09:00'
  );

  const onSelectDate = (date: Date | undefined) => {
    if (type !== 'date' || !date) return;

    date?.setHours(Number(time.slice(0, 2)));
    date?.setMinutes(Number(time.slice(3, 5)));

    setDate(date);
    setOpen(false);

    onChange({
      [name]: date.toISOString()
    });
  };

  const onChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setTime(value);

    if (!date) return;

    date.setHours(Number(value.slice(0, 2)));
    date.setMinutes(Number(value.slice(3, 5)));

    onChange({
      [name]: date.toISOString()
    });
  };

  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-3'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              id='date-picker'
              className='w-32 justify-between font-normal w-full'
            >
              {date
                ? date.toLocaleString('ru-Ru', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })
                : 'Выберите дату'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={date}
              captionLayout='dropdown'
              onSelect={onSelectDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex flex-col gap-3'>
        <Input
          className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
          onChange={onChangeTime}
          value={time}
          type='time'
          step='1'
        />
      </div>
    </div>
  );
};
