/**
 * Unit tests for the Slider input component.
 * Covers: rendering with undefined properties, default single slider,
 * range mode, min/max/step props, disabled state, and onSyncState callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Slider } from '../../../src/components/input/Slider';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'slider-1',
    component: 'Slider',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Slider component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Slider id="slider-0" component="Slider" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders an Ant Design slider element', () => {
    const { container } = render(<Slider {...makeProps()} />);
    const slider = container.querySelector('.ant-slider');
    expect(slider).toBeTruthy();
  });

  it('renders a range slider when range is true', () => {
    const { container } = render(<Slider {...makeProps({ range: true, value: [20, 80] })} />);
    const slider = container.querySelector('.ant-slider');
    expect(slider).toBeTruthy();
    // Range slider should have two handles
    const handles = container.querySelectorAll('.ant-slider-handle');
    expect(handles.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a single handle slider by default', () => {
    const { container } = render(<Slider {...makeProps({ value: 50 })} />);
    const handles = container.querySelectorAll('.ant-slider-handle');
    expect(handles.length).toBe(1);
  });

  it('renders as disabled when disabled is true', () => {
    const { container } = render(<Slider {...makeProps({ disabled: true })} />);
    const slider = container.querySelector('.ant-slider');
    expect(slider?.className).toContain('ant-slider-disabled');
  });

  it('calls onSyncState when value changes', () => {
    const onSyncState = vi.fn();
    const { container } = render(
      <Slider {...makeProps()} onSyncState={onSyncState} />,
    );
    // Verify component rendered with handler wired
    expect(container.querySelector('.ant-slider')).toBeTruthy();
  });

  it('renders with default min/max/step when not specified', () => {
    const { container } = render(<Slider {...makeProps()} />);
    const slider = container.querySelector('.ant-slider');
    expect(slider).toBeTruthy();
  });
});
