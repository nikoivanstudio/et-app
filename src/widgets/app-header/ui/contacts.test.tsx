import { render, screen } from '@testing-library/react';
import { Contacts } from './contacts';

describe('Contacts', () => {
  it('renders phone link', async () => {
    const ui = await Contacts();

    render(ui);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'tel:+79781113801');
  });
});


