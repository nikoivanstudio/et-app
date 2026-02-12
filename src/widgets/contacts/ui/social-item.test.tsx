import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SocialItem } from './social-item';

describe('SocialItem', () => {
  it('renders link with icon', () => {
    render(<SocialItem href='https://example.com' icon={<span>icon</span>} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('icon')).toBeInTheDocument();
  });
});
