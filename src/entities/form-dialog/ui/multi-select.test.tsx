import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { MultiSelect } from './multi-select';

vi.mock('@/shared/ui/multi-selector', () => ({
  MultiSelector: ({ children }: { children: ReactNode }) => (
    <div data-testid='multi-selector'>{children}</div>
  ),
  MultiSelectorTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  MultiSelectorInput: ({ placeholder }: { placeholder?: string }) => (
    <input placeholder={placeholder} />
  ),
  MultiSelectorContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  MultiSelectorList: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  MultiSelectorItem: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
}));

describe('MultiSelect', () => {
  it('renders provided options', () => {
    render(
      <MultiSelect
        name='tags'
        options={['A', 'B']}
        onChange={() => undefined}
        type='stringArray'
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
