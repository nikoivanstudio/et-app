import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Otp } from './otp';
import { otpApi } from '@/entities/otp/api/otp-api';
import { toast } from 'sonner';

vi.mock('@/shared/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled
  }: {
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}));

vi.mock('@/entities/otp/api/otp-api', () => ({
  otpApi: {
    sendCode: vi.fn(async () => ({ success: true, content: 'ok' }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/entities/otp/model/schemas', () => ({
  emailSchema: { safeParse: () => ({ success: true }) },
  telSchema: { safeParse: () => ({ success: true }) }
}));

describe('Otp', () => {
  it('sends code on submit', async () => {
    render(<Otp email='user@example.com' />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(otpApi.sendCode).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith('ok');
  });
});
