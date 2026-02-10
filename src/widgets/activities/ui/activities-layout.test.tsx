import { render, screen } from '@testing-library/react';
import { ActivitiesLayout } from './activities-layout';

describe('ActivitiesLayout', () => {
  it('renders title, content, and footer', () => {
    render(
      <ActivitiesLayout
        title='Title'
        content={<div>Content</div>}
        footer={<div>Footer</div>}
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});


