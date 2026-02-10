import { render, screen } from '@testing-library/react';
import { SocialItem } from './social-item';

describe('SocialItem', () => {
  it('renders link with icon', () => {
    render(
      <SocialItem href='https://example.com' icon={<span>Icon</span>} />
    );

    const link = screen.getByRole('link', { name: 'Icon' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});


