import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClientLayout } from './client-layout';

describe('ClientLayout', () => {
  it('renders title, actions, and list', () => {
    render(
      <ClientLayout
        title={<div data-testid='title' />}
        actions={<div data-testid='actions' />}
        list={<div data-testid='list' />}
      />
    );

    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('actions')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });
});
