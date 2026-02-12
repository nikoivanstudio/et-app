import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactsLayout } from './contacts-layout';

vi.mock('@/widgets/contacts/ui/row', () => ({
  Row: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='row'>{children}</div>
  )
}));

vi.mock('@/widgets/contacts/ui/social-item', () => ({
  SocialItem: ({ href }: { href: string; icon: React.ReactNode }) => (
    <a data-testid='social-item' href={href} />
  )
}));

vi.mock('@/shared/lib/string-utils', () => ({
  formatNumber: (value: string) => value
}));

vi.mock('@/shared/ui/GeoPointIcon', () => ({
  GeoPointIcon: () => <span data-testid='geo-icon' />
}));

vi.mock('@/shared/ui/mailIcon', () => ({
  MailIcon: () => <span data-testid='mail-icon' />
}));

vi.mock('@/shared/ui/PhoneIcon', () => ({
  PhoneIcon: () => <span data-testid='phone-icon' />
}));

vi.mock('@/shared/ui/telegramm-icon', () => ({
  TelegrammIcon: () => <span />
}));

vi.mock('@/shared/ui/whats-app-icon', () => ({
  WhatsAppIcon: () => <span />
}));

vi.mock('@/shared/ui/vk-icon', () => ({
  VkIcon: () => <span />
}));

vi.mock('@/shared/ui/rutube-icon', () => ({
  RutubeIcon: () => <span />
}));

describe('ContactsLayout', () => {
  it('renders contact rows and social links', () => {
    render(
      <ContactsLayout
        type='server'
        address='Address'
        email='mail@example.com'
        phones={['+79000000000']}
        telegram='https://t.me/test'
        whatsapp='https://wa.me/79000000000'
        vk='https://vk.com/test'
        ruTube='https://rutube.ru/test'
      >
        <div data-testid='child' />
      </ContactsLayout>
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('mail@example.com')).toBeInTheDocument();
    expect(screen.getAllByTestId('social-item').length).toBe(4);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
