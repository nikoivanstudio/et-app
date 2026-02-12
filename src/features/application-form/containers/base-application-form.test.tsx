import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BaseApplicationForm } from './base-application-form';

vi.mock('@/features/application-form/ui/layout', () => ({
  ApplicationFormLayout: () => <div data-testid='application-form-layout' />
}));

describe('BaseApplicationForm', () => {
  it('renders application layout', () => {
    render(<BaseApplicationForm />);

    expect(screen.getByTestId('application-form-layout')).toBeInTheDocument();
  });
});

