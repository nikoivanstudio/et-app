import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InputTypeString } from './input-type-string';

describe('InputTypeString', () => {
  it('calls onChange with text value', () => {
    const onChange = vi.fn();

    render(
      <InputTypeString
        name='title'
        onChange={onChange}
        type='string'
        value='Old'
      />
    );

    fireEvent.change(screen.getByDisplayValue('Old'), {
      target: { value: 'New' }
    });

    expect(onChange).toHaveBeenCalledWith({ title: 'New' });
  });
});
