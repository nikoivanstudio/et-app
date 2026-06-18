'use client';

import { Compass, Store } from 'lucide-react';
import { FC } from 'react';

import { PartnerApplicationDomain } from '@/entities/partner-application';

import { cn } from '@/shared/lib/css';

type Option = {
  value: PartnerApplicationDomain.PartnerApplicationType;
  title: string;
  description: string;
  icon: FC<{ className?: string }>;
};

const options: Option[] = [
  {
    value: PartnerApplicationDomain.PartnerApplicationType.GUIDE,
    title: 'Стать гидом',
    description: 'Создавайте и проводите собственные туры и активности.',
    icon: Compass
  },
  {
    value: PartnerApplicationDomain.PartnerApplicationType.SELLER,
    title: 'Стать реализатором',
    description: 'Продавайте туры компании и получайте вознаграждение.',
    icon: Store
  }
];

type Props = {
  value: string;
  onChange: (value: PartnerApplicationDomain.PartnerApplicationType) => void;
};

export const PartnerTypeSelect: FC<Props> = ({ value, onChange }) => (
  <div className='grid gap-3 sm:grid-cols-2'>
    {options.map(option => {
      const Icon = option.icon;
      const isActive = value === option.value;

      return (
        <label
          key={option.value}
          className={cn(
            'flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors',
            isActive
              ? 'border-primary ring-2 ring-primary/40'
              : 'border-input hover:border-primary/50'
          )}
        >
          <div className='flex items-center gap-2'>
            <input
              type='radio'
              name='type'
              value={option.value}
              checked={isActive}
              onChange={() => onChange(option.value)}
              className='sr-only'
            />
            <Icon className='h-5 w-5 text-primary' />
            <span className='font-medium'>{option.title}</span>
          </div>
          <span className='text-sm text-muted-foreground'>
            {option.description}
          </span>
        </label>
      );
    })}
  </div>
);
