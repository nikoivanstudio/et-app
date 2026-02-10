import { render, screen } from '@testing-library/react';
import { Row } from './row';

describe('Row', () => {
  it('renders children', () => {
    render(
      <Row>
        <span>Row content</span>
      </Row>
    );

    expect(screen.getByText('Row content')).toBeInTheDocument();
  });
});


