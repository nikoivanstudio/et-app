import { render, screen } from '@testing-library/react';
import { Layout } from './layout';

describe('PostsLayout', () => {
  it('renders title, list, and actions', () => {
    render(
      <Layout
        title={<div>Title</div>}
        list={<div>List</div>}
        actions={<div>Actions</div>}
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});


