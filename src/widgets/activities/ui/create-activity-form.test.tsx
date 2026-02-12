import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateActivityForm } from './create-activity-form';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: () => <div data-testid='form-dialog' />,
  FormDialogDomain: {}
}));

vi.mock('@/widgets/activities/model/create-activity', () => ({
  createActivityFormModel: [],
  initialCreateActivityFormData: {}
}));

vi.mock('@/features/activity/api/activity-api', () => ({
  createActivity: vi.fn(async () => undefined)
}));

vi.mock('@/entities/activity/server', () => ({
  createActivitySchema: {
    safeParse: () => ({ success: true, data: {} })
  }
}));

describe('CreateActivityForm', () => {
  it('renders form dialog', () => {
    render(<CreateActivityForm />);

    expect(screen.getByTestId('form-dialog')).toBeInTheDocument();
  });
});
