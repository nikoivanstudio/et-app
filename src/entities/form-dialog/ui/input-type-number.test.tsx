import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InputTypeNumber } from './input-type-number';

describe('InputTypeNumber', () => {
  it('calls onChange with numeric value', () => {
    const onChange = vi.fn();

    render(
      <InputTypeNumber
        name='count'
        onChange={onChange}
        type='number'
        value={1}
      />
    );

    fireEvent.change(screen.getByDisplayValue('1'), {
      target: { value: '5' }
    });

    expect(onChange).toHaveBeenCalledWith({ count: 5 });
  });
});
