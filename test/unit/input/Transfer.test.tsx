import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Transfer } from '../../../src/components/input/Transfer';

describe('Transfer', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Transfer id="t1" component="Transfer" />);
    expect(container.querySelector('.ant-transfer')).toBeTruthy();
  });

  it('renders with dataSource', () => {
    const dataSource = [
      { key: '1', title: 'Item 1' },
      { key: '2', title: 'Item 2' },
    ];
    const { container } = render(<Transfer id="t1" component="Transfer" properties={{ dataSource, targetKeys: [] }} />);
    expect(container.querySelector('.ant-transfer')).toBeTruthy();
  });

  it('renders with showSearch', () => {
    const { container } = render(
      <Transfer id="t1" component="Transfer" properties={{ dataSource: [], targetKeys: [], showSearch: true }} />,
    );
    expect(container.querySelector('.ant-transfer')).toBeTruthy();
  });
});
