import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Video } from './video';

describe('Video', () => {
  it('renders youtube iframe', async () => {
    const ui = await Video();

    const { container } = render(ui);

    const iframe = container.querySelector('iframe');

    expect(iframe).not.toBeNull();
  });
});
