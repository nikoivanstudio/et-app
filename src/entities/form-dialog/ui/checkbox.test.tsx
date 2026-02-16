import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

vi.mock('@/shared/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    name,
    onChange
  }: {
    checked?: boolean;
    name?: string;
    onChange?: () => void;
  }) => (
    <button
      data-testid='checkbox'
      data-name={name}
      data-checked={String(checked)}
      onClick={onChange}
    />
  )
}));

describe('Checkbox', () => {
  it('toggles boolean value', () => {
    const onChange = vi.fn();

    render(
      <Checkbox
        name='isActive'
        onChange={onChange}
        type='boolean'
        value={true}
      />
    );

    fireEvent.click(screen.getByTestId('checkbox'));

    expect(onChange).toHaveBeenCalledWith({ isActive: false });
  });
});
