import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { TreeSelect } from '../../../src/components/input/TreeSelect';

describe('TreeSelect', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<TreeSelect id="t1" component="TreeSelect" />);
    expect(container.querySelector('.ant-select')).toBeTruthy();
  });

  it('renders with treeData', () => {
    const treeData = [
      { value: '1', title: 'Node 1', children: [{ value: '1-1', title: 'Child' }] },
    ];
    const { container } = render(<TreeSelect id="t1" component="TreeSelect" properties={{ treeData }} />);
    expect(container.querySelector('.ant-select')).toBeTruthy();
  });

  it('renders disabled tree select', () => {
    const { container } = render(<TreeSelect id="t1" component="TreeSelect" properties={{ disabled: true }} />);
    expect(container.querySelector('.ant-select-disabled')).toBeTruthy();
  });
});
