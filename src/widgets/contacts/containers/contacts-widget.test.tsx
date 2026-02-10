import { render, screen } from '@testing-library/react';
import { ContactsWidget } from './contacts-widget';

describe('ContactsWidget', () => {
  it('renders email link from contacts data', async () => {
    const ui = await ContactsWidget();

    render(ui);

    const link = screen.getByRole('link', { name: /infoenergytur@gmail.com/i });
    expect(link).toHaveAttribute('href', 'mailto:infoenergytur@gmail.com');
  });
});


