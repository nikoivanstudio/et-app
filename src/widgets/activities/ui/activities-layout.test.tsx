import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActivitiesLayout } from './activities-layout';

describe('ActivitiesLayout', () => {
  it('renders title, content, and footer', () => {
    render(
      <ActivitiesLayout
        title='Activities'
        content={<div data-testid='content' />}
        footer={<div data-testid='footer' />}
      />
    );

    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
