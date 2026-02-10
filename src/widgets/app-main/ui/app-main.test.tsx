import { render, screen } from '@testing-library/react';
import { AppMain } from './app-main';

describe('AppMain', () => {
  it('renders head, content, and bottom', async () => {
    const ui = await AppMain({
      mainHead: <div>Head</div>,
      mainContent: <div>Content</div>,
      mainBottom: <div>Bottom</div>
    });

    render(ui);

    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
  });
});


