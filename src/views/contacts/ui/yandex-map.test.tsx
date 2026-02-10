import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { YandexMap } from './yandex-map';

describe('YandexMap', () => {
  it('renders iframe widget', () => {
    const { container } = render(<YandexMap />);

    const iframe = container.querySelector('iframe');

    expect(iframe).not.toBeNull();
  });
});
