import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileLayout } from './profile-view-layout';

describe('ProfileLayout', () => {
  it('renders dashboard link and logout action', () => {
    render(<ProfileLayout id={1} role='SUPER_ADMIN' />);

    expect(screen.getAllByTestId('button').length).toBe(2);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
