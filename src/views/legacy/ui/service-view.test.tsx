import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServiceView } from './service-view';

vi.mock('@/views/legacy/ui/service-main', () => ({
  ServiceMain: () => <div data-testid='service-main' />
}));

describe('ServiceView', () => {
  it('renders service main', async () => {
    const ui = await ServiceView({
      id: 1,
      title: 'Service',
      mainImage: '/image.jpg',
      content: '<p>content</p>'
    });

    render(ui);

    expect(screen.getByTestId('service-main')).toBeInTheDocument();
  });
});
