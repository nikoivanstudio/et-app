import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders previous and next links', async () => {
    const ui = await Pagination({ totalPages: 3, currentPage: 2 });

    const { container } = render(ui);

    const links = container.querySelectorAll('a');

    expect(links.length).toBe(2);
  });
});
