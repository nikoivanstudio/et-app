import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GeoPointLayout } from './layout';

vi.mock('@/shared/ui/GeoPointIcon', () => ({
  GeoPointIcon: () => <span data-testid='geo-point-icon' />
}));

vi.mock('@/entities/geo-point/lib/geo-point-utils', () => ({
  getYandexGeoLink: () => 'https://example.com'
}));

describe('GeoPointLayout', () => {
  it('renders link with custom content', () => {
    render(
      <GeoPointLayout
        geoPoint={{ latitude: 1, longitude: 2 }}
        content='Custom'
      />
    );

    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });
});
