import { render, screen } from '@testing-library/react';
import { CreateActivityForm } from './create-activity-form';

jest.mock('@/entities/form-dialog', () => ({
  FormDialog: () => <div data-testid='form-dialog' />,
  FormDialogDomain: {}
}));

jest.mock('@/entities/activity/server', () => ({
  createActivitySchema: {
    safeParse: jest.fn(() => ({ success: true, data: {} }))
  }
}));

describe('CreateActivityForm', () => {
  it('renders form dialog', () => {
    render(<CreateActivityForm />);

    expect(screen.getByTestId('form-dialog')).toBeInTheDocument();
  });
});


