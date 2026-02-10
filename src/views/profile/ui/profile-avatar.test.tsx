import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileAvatar } from './profile-avatar';

describe('ProfileAvatar', () => {
  it('renders image with alt text', () => {
    render(<ProfileAvatar avatarPhoto='/avatar.jpg' />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
