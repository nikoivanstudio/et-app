import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row } from './row';

describe('Row', () => {
  it('renders children', () => {
    render(
      <Row>
        <span>child</span>
      </Row>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
