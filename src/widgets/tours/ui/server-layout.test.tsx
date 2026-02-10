import { render, screen } from '@testing-library/react';
import { ServerLayout } from './server-layout';

describe('ServerLayout', () => {
  it('renders title, list, and actions', async () => {
    const ui = await ServerLayout({
      title: <div>Title</div>,
      list: <div>List</div>,
      actions: <div>Actions</div>
    });

    render(ui);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});


