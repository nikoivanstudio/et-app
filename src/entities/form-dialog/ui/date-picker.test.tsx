import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { DatePicker } from './date-picker';

vi.mock('@/shared/ui/popover', () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
}));

vi.mock('@/shared/ui/calendar', () => ({
  Calendar: () => <div data-testid='calendar' />
}));

vi.mock('@/shared/ui/button', () => ({
  Button: ({
    children,
    ...rest
  }: {
    children?: ReactNode;
  } & Record<string, unknown>) => <button {...rest}>{children}</button>
}));

vi.mock('lucide-react', () => ({
  ChevronDownIcon: () => <span data-testid='chevron' />
}));

vi.mock('@/shared/lib/date-utils', () => ({
  dateUtils: {
    getFormattedValue: (value: string) => value.padStart(2, '0')
  }
}));

describe('DatePicker', () => {
  it('renders default time and trigger button', () => {
    const { container, getByDisplayValue } = render(
      <DatePicker name='date' onChange={() => undefined} type='date' />
    );

    expect(getByDisplayValue('09:00')).toBeInTheDocument();
    expect(container.querySelector('#date-picker')).not.toBeNull();
  });
});
