'use client';

import { FC, PropsWithChildren } from 'react';

import { ThemeProvider } from '@/features/theme/theme-provider';

export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);
