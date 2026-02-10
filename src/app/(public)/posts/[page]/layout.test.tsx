import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './layout';

vi.mock('@/widgets/app-header/server', () => ({
  AppHeader: () => <div data-testid='app-header' />
}));

vi.mock('@/widgets/contacts/server', () => ({
  ContactsWidget: () => <div data-testid='contacts-widget' />
}));

describe('Posts page layout', () => {
  it('renders header, children, and footer', () => {
    render(
      <Layout params={Promise.resolve({ page: '1' })}>
        <div data-testid='child' />
      </Layout>
    );

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('contacts-widget')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
