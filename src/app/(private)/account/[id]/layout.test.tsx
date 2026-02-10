import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AccountLayout from './layout';

vi.mock('@/widgets/app-header/server', () => ({
  AccountHeader: () => <div data-testid='account-header' />
}));

describe('Account layout', () => {
  it('renders header and children', () => {
    render(
      <AccountLayout>
        <div data-testid='child' />
      </AccountLayout>
    );

    expect(screen.getByTestId('account-header')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
