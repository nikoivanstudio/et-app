import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Contacts } from './contacts';

vi.mock('@/shared/ui/contact-icon', () => ({
  ContactIcon: () => <div data-testid='contact-icon' />
}));

describe('Header Contacts', () => {
  it('renders phone link', async () => {
    const ui = await Contacts();

    render(ui);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:+79781113801');
    expect(screen.getByTestId('contact-icon')).toBeInTheDocument();
  });
});
