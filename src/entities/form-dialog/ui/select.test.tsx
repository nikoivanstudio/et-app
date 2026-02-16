import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Select } from './select';

vi.mock('@/shared/ui/select', () => ({
  Select: ({
    onValueChange,
    children
  }: {
    onValueChange: (value: string) => void;
    children: ReactNode;
  }) => (
    <div data-testid='select' onClick={() => onValueChange('A')}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

describe('Select', () => {
  it('calls onChange when value changes', () => {
    const onChange = vi.fn();

    render(
      <Select
        name='status'
        type='select'
        options={['A', 'B']}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId('select'));

    expect(onChange).toHaveBeenCalledWith({ status: 'A' });
  });
});
