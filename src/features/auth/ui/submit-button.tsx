import React from 'react';

import { Button } from '@/shared/ui/button';

export function SubmitButton({
  children,
  isPending
}: {
  children: React.ReactNode;
  isPending?: boolean;
}) {
  return (
    <Button
      disabled={isPending}
      type='submit'
      /* Та же главная кнопка, что «Все туры» и «Забронировать»: 5.96:1. */
      className='min-h-12 w-full rounded-pill bg-cta text-base font-semibold text-on-cta hover:bg-cta-press'
    >
      {children}
    </Button>
  );
}
