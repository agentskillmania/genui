import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Cascader } from '../../../src/components/input/Cascader';

describe('Cascader', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Cascader id="c1" component="Cascader" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with nested options', () => {
    const options = [
      { value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou' }] },
    ];
    const { container } = render(<Cascader id="c1" component="Cascader" properties={{ options }} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders disabled cascader', () => {
    const { container } = render(<Cascader id="c1" component="Cascader" properties={{ disabled: true }} />);
    expect(container.firstChild).toBeTruthy();
  });
});
