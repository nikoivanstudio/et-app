import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormRow } from './form-row';

vi.mock('@/entities/form-dialog/ui/input-type-string', () => ({
  InputTypeString: () => <div data-testid='input-string' />
}));

vi.mock('@/entities/form-dialog/ui/input-type-number', () => ({
  InputTypeNumber: () => <div data-testid='input-number' />
}));

vi.mock('@/entities/form-dialog/ui/checkbox', () => ({
  Checkbox: () => <div data-testid='input-checkbox' />
}));

vi.mock('@/entities/form-dialog/ui/input-type-file', () => ({
  InputTypeFile: () => <div data-testid='input-file' />
}));

vi.mock('@/entities/form-dialog/ui/date-picker', () => ({
  DatePicker: () => <div data-testid='input-date' />
}));

vi.mock('@/entities/form-dialog/ui/select', () => ({
  Select: () => <div data-testid='input-select' />
}));

vi.mock('@/entities/form-dialog/ui/multi-select', () => ({
  MultiSelect: () => <div data-testid='input-multi-select' />
}));

describe('FormRow', () => {
  it('renders string input and label', () => {
    render(
      <FormRow
        type='string'
        label='Name'
        name='name'
        onChange={vi.fn()}
        value='John'
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByTestId('input-string')).toBeInTheDocument();
  });
});
