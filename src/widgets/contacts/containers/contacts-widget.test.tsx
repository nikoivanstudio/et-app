import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactsWidget } from './contacts-widget';

vi.mock('@/widgets/contacts/ui/contacts-layout', () => ({
  ContactsLayout: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='contacts-layout'>{children}</div>
  )
}));

vi.mock('@/shared/ui/rights', () => ({
  Rights: () => <div data-testid='rights' />
}));

vi.mock('@/widgets/contacts/constants/contacts', () => ({
  CONTACTS: {
    address: 'Address',
    email: 'mail@example.com',
    phones: ['+79000000000'],
    telegram: '#',
    whatsapp: '#',
    vk: '#'
  }
}));

describe('ContactsWidget', () => {
  it('renders layout with rights', async () => {
    const ui = await ContactsWidget();

    render(ui);

    expect(screen.getByTestId('contacts-widget')).toBeInTheDocument();
  });
});
