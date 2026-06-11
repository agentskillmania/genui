import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Tree } from '../../../src/components/data/Tree';

describe('Tree', () => {
  const treeData = [
    { key: '1', title: 'Parent', children: [{ key: '1-1', title: 'Child' }] },
  ];

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Tree id="t1" component="Tree" />);
    expect(container.querySelector('.ant-tree')).toBeTruthy();
  });

  it('renders tree with data', () => {
    const { container } = render(
      <Tree id="t1" component="Tree" properties={{ treeData, defaultExpandAll: true }} />,
    );
    expect(container.querySelector('.ant-tree')).toBeTruthy();
  });

  it('renders checkable tree', () => {
    const { container } = render(
      <Tree id="t1" component="Tree" properties={{ treeData, checkable: true }} />,
    );
    expect(container.querySelector('.ant-tree-checkbox')).toBeTruthy();
  });
});
