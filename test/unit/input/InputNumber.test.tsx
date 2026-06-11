import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { InputNumber } from '../../../src/components/input/InputNumber';

describe('InputNumber', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<InputNumber id="i1" component="InputNumber" />);
    expect(container.querySelector('.ant-input-number')).toBeTruthy();
  });

  it('renders with value and bounds', () => {
    const { container } = render(<InputNumber id="i1" component="InputNumber" properties={{ value: 5, min: 0, max: 10 }} />);
    expect(container.querySelector('.ant-input-number')).toBeTruthy();
  });

  it('renders with step and precision', () => {
    const { container } = render(<InputNumber id="i1" component="InputNumber" properties={{ value: 3.5, step: 0.5, precision: 1 }} />);
    expect(container.querySelector('.ant-input-number')).toBeTruthy();
  });

  it('renders disabled input', () => {
    const { container } = render(<InputNumber id="i1" component="InputNumber" properties={{ disabled: true }} />);
    expect(container.querySelector('.ant-input-number-disabled')).toBeTruthy();
  });
});
