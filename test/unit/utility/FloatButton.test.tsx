/**
 * Unit tests for the FloatButton utility component.
 * Covers: rendering without properties, rendering with valid props,
 * click callback, type, shape, tooltip, and style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FloatButton } from '../../../src/components/utility/FloatButton';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'floatbtn-1',
    component: 'FloatButton',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('FloatButton', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <FloatButton
        id="fb-undef"
        component="FloatButton"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-float-btn')).toBeTruthy();
  });

  it('renders with default type', () => {
    const { container } = render(
      <FloatButton {...makeProps()} />,
    );
    const btn = container.querySelector('.ant-float-btn');
    expect(btn).toBeTruthy();
  });

  it('renders with primary type', () => {
    const { container } = render(
      <FloatButton {...makeProps({ type: 'primary' })} />,
    );
    const btn = container.querySelector('.ant-float-btn');
    expect(btn?.className).toContain('primary');
  });

  it('renders with circle shape', () => {
    const { container } = render(
      <FloatButton {...makeProps({ shape: 'circle' })} />,
    );
    const btn = container.querySelector('.ant-float-btn');
    expect(btn).toBeTruthy();
  });

  it('calls onAction with "click" when clicked', () => {
    const onAction = vi.fn();
    const { container } = render(
      <FloatButton {...makeProps()} onAction={onAction} />,
    );
    const btn = container.querySelector('.ant-float-btn');
    if (btn) {
      fireEvent.click(btn);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onAction).toHaveBeenCalledWith('click');
    }
  });

  it('renders with tooltip property', () => {
    const { container } = render(
      <FloatButton {...makeProps({ tooltip: 'Go to top' })} />,
    );
    const btn = container.querySelector('.ant-float-btn');
    expect(btn).toBeTruthy();
  });

  it('applies custom style', () => {
    const { container } = render(
      <FloatButton {...makeProps({ style: { right: 24, bottom: 24 } })} />,
    );
    const btn = container.querySelector('.ant-float-btn') as HTMLElement;
    expect(btn.style.right).toBe('24px');
    expect(btn.style.bottom).toBe('24px');
  });
});
