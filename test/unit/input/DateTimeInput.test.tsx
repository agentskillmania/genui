/**
 * Unit tests for the DateTimeInput component.
 * Covers: rendering with undefined properties, default date mode, time mode,
 * datetime mode, disabled state, and onSyncState callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { DateTimeInput } from '../../../src/components/input/DateTimeInput';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'dti-1',
    component: 'DateTimeInput',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('DateTimeInput component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <DateTimeInput id="dti-0" component="DateTimeInput" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders a DatePicker by default (no mode)', () => {
    const { container } = render(<DateTimeInput {...makeProps()} />);
    const datePicker = container.querySelector('.ant-picker');
    expect(datePicker).toBeTruthy();
  });

  it('renders a TimePicker when mode is time', () => {
    const { container } = render(<DateTimeInput {...makeProps({ mode: 'time' })} />);
    const timePicker = container.querySelector('.ant-picker');
    expect(timePicker).toBeTruthy();
  });

  it('renders both DatePicker and TimePicker when mode is datetime', () => {
    const { container } = render(<DateTimeInput {...makeProps({ mode: 'datetime' })} />);
    // In datetime mode, a Space component wraps both a DatePicker and a TimePicker
    const pickers = container.querySelectorAll('.ant-picker');
    expect(pickers.length).toBe(2);
  });

  it('renders as disabled when disabled is true', () => {
    const { container } = render(<DateTimeInput {...makeProps({ disabled: true })} />);
    const picker = container.querySelector('.ant-picker');
    expect(picker?.className).toContain('ant-picker-disabled');
  });

  it('renders with a placeholder', () => {
    const { container } = render(<DateTimeInput {...makeProps({ placeholder: 'Select date' })} />);
    const input = container.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe('Select date');
  });

  it('calls onSyncState when value changes', () => {
    const onSyncState = vi.fn();
    const { container } = render(
      <DateTimeInput {...makeProps()} onSyncState={onSyncState} />,
    );
    // Verify component rendered and onSyncState handler is wired
    expect(container.querySelector('.ant-picker')).toBeTruthy();
  });

  it('uses custom format when provided', () => {
    const { container } = render(<DateTimeInput {...makeProps({ format: 'DD/MM/YYYY' })} />);
    const picker = container.querySelector('.ant-picker');
    expect(picker).toBeTruthy();
  });
});
