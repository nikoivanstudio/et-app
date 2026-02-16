import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TelField } from './tel-field';

describe('TelField', () => {
  it('calls onChangePhone with input value', () => {
    const onChangePhone = vi.fn();
    const { container } = render(
      <TelField onChangePhone={onChangePhone} />
    );

    const input = container.querySelector('input[name="tel"]');

    if (!input) {
      throw new Error('Tel input not found');
    }

    fireEvent.change(input, { target: { value: '123' } });

    expect(onChangePhone).toHaveBeenCalledWith('123');
  });
});
