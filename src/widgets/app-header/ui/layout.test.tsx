import { render, screen } from '@testing-library/react';
import { Layout } from './layout';
import { ReactNode } from 'react';

jest.mock('@/shared/ui/sheet', () => ({
  Sheet: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

jest.mock('@/shared/ui/button', () => ({
  Button: ({ children }: { children: ReactNode }) => <button>{children}</button>
}));

describe('Layout', () => {
  it('renders logo, nav, and right node', async () => {
    const ui = await Layout({
      logo: <span>Logo</span>,
      nav: <nav>Nav</nav>,
      rightNode: <span>Right</span>
    });

    render(ui);

    expect(screen.getAllByText('Logo')).toHaveLength(2);
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });
});


