import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GeoPoint } from './geo-point';

vi.mock('@/entities/geo-point/ui/layout', () => ({
  GeoPointLayout: ({ content }: { content?: string }) => (
    <div data-testid='geo-point-layout'>{content}</div>
  )
}));

describe('GeoPoint', () => {
  it('renders layout with content', () => {
    render(<GeoPoint content='Point' />);

    expect(screen.getByTestId('geo-point-layout')).toHaveTextContent('Point');
  });
});
