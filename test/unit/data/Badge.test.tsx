import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Badge } from '../../../src/components/data/Badge';

describe('Badge', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Badge id="b1" component="Badge">
        <span>Content</span>
      </Badge>,
    );
    expect(container.querySelector('.ant-badge')).toBeTruthy();
  });

  it('renders with count', () => {
    const { container } = render(
      <Badge id="b1" component="Badge" properties={{ count: 5 }}>
        <span>Content</span>
      </Badge>,
    );
    expect(container.querySelector('.ant-badge')).toBeTruthy();
  });

  it('renders dot badge', () => {
    const { container } = render(
      <Badge id="b1" component="Badge" properties={{ dot: true }}>
        <span>Content</span>
      </Badge>,
    );
    expect(container.querySelector('.ant-badge-dot')).toBeTruthy();
  });
});
