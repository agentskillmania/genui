import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Progress } from '../../../src/components/feedback/Progress';

describe('Progress', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Progress id="p1" component="Progress" />);
    expect(container.querySelector('.ant-progress')).toBeTruthy();
  });

  it('renders with percentage', () => {
    const { container } = render(<Progress id="p1" component="Progress" properties={{ percent: 75 }} />);
    expect(container.querySelector('.ant-progress')).toBeTruthy();
  });

  it('renders circle type', () => {
    const { container } = render(
      <Progress id="p1" component="Progress" properties={{ percent: 50, type: 'circle' }} />,
    );
    expect(container.querySelector('.ant-progress-circle')).toBeTruthy();
  });
});
