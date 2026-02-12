import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeatureTriggerIcon } from './feature-trigger-icon';

describe('FeatureTriggerIcon', () => {
  it('renders create text for create type', () => {
    render(<FeatureTriggerIcon type='create' />);

    expect(screen.getByText('Создать пост')).toBeInTheDocument();
  });
});
