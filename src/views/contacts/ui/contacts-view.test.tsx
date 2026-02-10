import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactsView } from './contacts-view';

describe('ContactsView', () => {
  it('renders map inside main layout', async () => {
    const ui = await ContactsView();

    render(ui);

    expect(screen.getByTestId('app-main')).toBeInTheDocument();
    expect(screen.getByTestId('page-head-layout')).toBeInTheDocument();
  });
});
