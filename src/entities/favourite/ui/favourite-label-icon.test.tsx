import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FavouriteLabelIcon } from './favourite-label-icon';

vi.mock('@/shared/ui/filled-heart-icon', () => ({
  FilledHeartIcon: ({ id }: { id: string }) => (
    <div data-testid='filled-heart'>{id}</div>
  )
}));

vi.mock('@/shared/ui/blank-heart-icon', () => ({
  BlankHeartIcon: ({ id }: { id: string }) => (
    <div data-testid='blank-heart'>{id}</div>
  )
}));

describe('FavouriteLabelIcon', () => {
  it('renders filled icon when favourite', () => {
    vi.useFakeTimers();

    render(<FavouriteLabelIcon isFavourite onChange={vi.fn()} />);

    expect(screen.queryByTestId('filled-heart')).not.toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByTestId('filled-heart')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('calls onChange on click', () => {
    vi.useFakeTimers();

    const onChange = vi.fn();
    const { container } = render(
      <FavouriteLabelIcon isFavourite={false} onChange={onChange} />
    );

    const root = container.querySelector('span');

    if (!root) {
      throw new Error('Root element not found');
    }

    fireEvent.click(root);

    expect(onChange).toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });
});
