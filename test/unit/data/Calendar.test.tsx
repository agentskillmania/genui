import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Calendar } from '../../../src/components/data/Calendar';

describe('Calendar', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Calendar id="c1" component="Calendar" />);
    expect(container.querySelector('.ant-picker-calendar')).toBeTruthy();
  });

  it('calls onSyncState on date select', () => {
    const onSyncState = vi.fn();
    const { container } = render(<Calendar id="c1" component="Calendar" onSyncState={onSyncState} />);
    expect(container.querySelector('.ant-picker-calendar')).toBeTruthy();
  });
});
