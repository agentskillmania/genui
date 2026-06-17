/**
 * Unit tests for the CheckBox input component.
 * Covers: rendering with undefined properties, checked/indeterminate/disabled states,
 * and onSyncState callback on change.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CheckBox } from '../../../src/components/input/CheckBox';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cb-1',
    component: 'CheckBox',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('CheckBox component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <CheckBox id="cb-0" component="CheckBox" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders a checkbox input', () => {
    const { container } = render(<CheckBox {...makeProps()} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
  });

  it('renders as checked when checked property is true', () => {
    const { container } = render(<CheckBox {...makeProps({ checked: true })} />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('renders as unchecked when checked property is false', () => {
    const { container } = render(<CheckBox {...makeProps({ checked: false })} />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('renders as disabled when disabled is true', () => {
    const { container } = render(<CheckBox {...makeProps({ disabled: true })} />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('calls onSyncState with checked value on change', () => {
    const onSyncState = vi.fn();
    const { container } = render(
      <CheckBox {...makeProps({ checked: false })} onSyncState={onSyncState} />,
    );
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(input);
    expect(onSyncState).toHaveBeenCalledWith({ checked: true });
  });

  it('reflects external checked updates (controlled mode)', () => {
    // Fully controlled: checked state is owned by the host. Re-rendering with
    // a new checked value must update the checkbox.
    const { container, rerender } = render(<CheckBox {...makeProps({ checked: false })} />);
    const input = () => container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input().checked).toBe(false);

    rerender(<CheckBox {...makeProps({ checked: true })} />);
    expect(input().checked).toBe(true);
  });
});
