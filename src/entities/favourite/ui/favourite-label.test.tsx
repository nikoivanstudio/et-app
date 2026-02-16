import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FavouriteLabel } from './favourite-label';
import * as favouriteService from '@/entities/favourite/services/client-service';

vi.mock('@/entities/favourite/services/client-service', () => ({
  addTourToFavourites: vi.fn(),
  removeFromFavourite: vi.fn(),
  getFavouriteTours: vi.fn(() => [])
}));

vi.mock('@/entities/favourite/lib/helpers', () => ({
  isTourFavourite: vi.fn(() => false)
}));

vi.mock('@/entities/favourite/ui/favourite-label-icon', () => ({
  FavouriteLabelIcon: ({ onChange }: { onChange: () => void }) => (
    <button data-testid='favourite-icon' onClick={onChange} />
  )
}));

describe('FavouriteLabel', () => {
  it('adds tour to favourites when not included', () => {
    vi.useFakeTimers();

    render(<FavouriteLabel id={5} />);

    vi.runAllTimers();

    fireEvent.click(screen.getByTestId('favourite-icon'));

    expect(favouriteService.addTourToFavourites).toHaveBeenCalledWith(5);
    expect(favouriteService.removeFromFavourite).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
