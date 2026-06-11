import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ColorPicker } from '../../../src/components/input/ColorPicker';

describe('ColorPicker', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<ColorPicker id="c1" component="ColorPicker" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with value', () => {
    const { container } = render(<ColorPicker id="c1" component="ColorPicker" properties={{ value: '#1677ff' }} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders disabled color picker', () => {
    const { container } = render(<ColorPicker id="c1" component="ColorPicker" properties={{ disabled: true }} />);
    expect(container.firstChild).toBeTruthy();
  });
});
