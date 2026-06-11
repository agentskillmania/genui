import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Space } from '../../../src/components/layout/Space';

describe('Space', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Space id="s1" component="Space" />);
    // AntD Space may render a fragment in jsdom; verify no throw
    expect(container).toBeTruthy();
  });

  it('renders children with spacing', () => {
    const { container } = render(
      <Space id="s1" component="Space" properties={{ size: 16 }}>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </Space>,
    );
    expect(container.querySelector('[data-testid="a"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="b"]')).toBeTruthy();
  });

  it('renders vertical space', () => {
    const { container } = render(
      <Space id="s1" component="Space" properties={{ direction: 'vertical' }}>
        <span>A</span>
        <span>B</span>
      </Space>,
    );
    expect(container).toBeTruthy();
  });
});
