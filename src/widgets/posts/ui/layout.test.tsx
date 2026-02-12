import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Layout } from './layout';

describe('Posts Layout', () => {
  it('renders title, list, and actions', () => {
    render(
      <Layout
        title={<div data-testid='title' />}
        list={<div data-testid='list' />}
        actions={<div data-testid='actions' />}
      />
    );

    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
    expect(screen.getByTestId('actions')).toBeInTheDocument();
  });
});
