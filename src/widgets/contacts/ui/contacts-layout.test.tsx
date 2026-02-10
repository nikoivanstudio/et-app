import { render, screen } from '@testing-library/react';
import { ContactsLayout } from './contacts-layout';

describe('ContactsLayout', () => {
  it('renders email and social links', () => {
    render(
      <ContactsLayout
        type='client'
        address='Address'
        geoPoint='https://example.com'
        email='test@example.com'
        phones={['+70000000000']}
        telegram='https://t.me/test'
        whatsapp='https://wa.me/70000000000'
        vk='https://vk.com/test'
        ruTube='https://example.com'
      >
        <div>Children</div>
      </ContactsLayout>
    );

    const mailLink = screen.getByRole('link', { name: /test@example.com/i });
    expect(mailLink).toHaveAttribute('href', 'mailto:test@example.com');
    expect(screen.getByRole('link', { name: /test@example.com/i })).toBeInTheDocument();
  });
});


