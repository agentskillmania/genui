import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Spin } from '../../../src/components/feedback/Spin';

describe('Spin', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Spin id="s1" component="Spin" />);
    expect(container.querySelector('.ant-spin')).toBeTruthy();
  });

  it('renders spin with tip', () => {
    const { container } = render(
      <Spin id="s1" component="Spin" properties={{ tip: 'Loading...', spinning: true }} />,
    );
    expect(container.querySelector('.ant-spin')).toBeTruthy();
  });

  it('renders children when not spinning', () => {
    const { container } = render(
      <Spin id="s1" component="Spin" properties={{ spinning: false }}>
        <span data-testid="child">Content</span>
      </Spin>,
    );
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });
});
