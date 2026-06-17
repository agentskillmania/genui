/**
 * Unit tests for the TextField input component.
 * Covers: rendering with undefined properties, single-line input, multiline textarea,
 * placeholder, disabled state, initial value, and onSyncState callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TextField } from '../../../src/components/input/TextField';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tf-1',
    component: 'TextField',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('TextField component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <TextField id="tf-0" component="TextField" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders a single-line input by default', () => {
    const { container } = render(<TextField {...makeProps()} />);
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeFalsy();
  });

  it('renders a textarea when variant is multiline', () => {
    const { container } = render(<TextField {...makeProps({ variant: 'multiline' })} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('displays placeholder text', () => {
    render(<TextField {...makeProps({ placeholder: 'Enter text' })} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeTruthy();
  });

  it('renders initial value', () => {
    const { container } = render(<TextField {...makeProps({ value: 'Hello World' })} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Hello World');
  });

  it('renders as disabled when disabled is true', () => {
    const { container } = render(<TextField {...makeProps({ disabled: true })} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('calls onSyncState when text changes', () => {
    const onSyncState = vi.fn();
    const { container } = render(
      <TextField {...makeProps()} onSyncState={onSyncState} />,
    );
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new text' } });
    expect(onSyncState).toHaveBeenCalledWith({ value: 'new text' });
  });

  it('reflects external value updates (controlled mode)', () => {
    // Fully controlled: the host owns state. Re-rendering with a new value
    // must update the input — the component has no internal state of its own.
    const { container, rerender } = render(<TextField {...makeProps({ value: 'first' })} />);
    const input = () => container.querySelector('input') as HTMLInputElement;
    expect(input().value).toBe('first');

    rerender(<TextField {...makeProps({ value: 'second' })} />);
    expect(input().value).toBe('second');
  });

  it('respects maxLength property', () => {
    const { container } = render(<TextField {...makeProps({ maxLength: 10 })} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('maxlength')).toBe('10');
  });
});
