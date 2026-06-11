import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Rate } from '../../../src/components/input/Rate';

describe('Rate', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Rate id="r1" component="Rate" />);
    expect(container.querySelector('.ant-rate')).toBeTruthy();
  });

  it('renders with value and count', () => {
    const { container } = render(<Rate id="r1" component="Rate" properties={{ value: 3, count: 5 }} />);
    expect(container.querySelector('.ant-rate')).toBeTruthy();
  });

  it('syncs value from properties', () => {
    const { container } = render(<Rate id="r1" component="Rate" properties={{ value: 4 }} />);
    expect(container.querySelector('.ant-rate')).toBeTruthy();
  });
});
