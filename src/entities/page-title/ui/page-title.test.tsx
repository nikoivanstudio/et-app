import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageTitle } from './page-title';

describe('PageTitle', () => {
  it('renders title parts', async () => {
    const ui = await PageTitle({
      title: { text: 'Main' },
      topTitle: { text: 'Top' },
      middleTitle: { text: 'Middle' },
      bottomTitle: { text: 'Bottom' }
    });

    render(ui);

    const title = screen.getByTestId('page-title');

    expect(title).toHaveTextContent('Top');
    expect(title).toHaveTextContent('Middle');
  });
});
