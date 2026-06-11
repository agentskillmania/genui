import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Switch } from '../../../src/components/input/Switch';

describe('Switch', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Switch id="s1" component="Switch" />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('calls onSyncState on toggle', () => {
    const onSyncState = vi.fn();
    const { container } = render(<Switch id="s1" component="Switch" onSyncState={onSyncState} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onSyncState).toHaveBeenCalledWith({ checked: true });
  });

  it('syncs checked state from properties', () => {
    const { container } = render(<Switch id="s1" component="Switch" properties={{ checked: true }} />);
    expect(container.querySelector('.ant-switch-checked')).toBeTruthy();
  });

  it('renders disabled switch', () => {
    const { container } = render(<Switch id="s1" component="Switch" properties={{ disabled: true }} />);
    expect(container.querySelector('button')!.disabled).toBe(true);
  });
});
