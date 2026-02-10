import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('renders title text', async () => {
    const ui = await Header({ title: 'Test title', mainPhoto: '/image.jpg' });

    render(ui);

    expect(screen.getByText('Test title')).toBeInTheDocument();
  });
});
