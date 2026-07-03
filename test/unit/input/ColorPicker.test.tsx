import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock antd ColorPicker to capture the onChange handler passed to it,
// so we can invoke it with a single-arg AggregationColor (matching antd's
// real signature) and verify onSyncState receives the correct hex string.
let capturedOnChange: ((...args: unknown[]) => void) | undefined;
vi.mock('antd', () => ({
  ColorPicker: (props: { onChange?: (...args: unknown[]) => void; value?: unknown; disabled?: boolean }) => {
    capturedOnChange = props.onChange;
    return React.createElement('div', { 'data-testid': 'mock-color-picker' });
  },
}));

const { ColorPicker } = await import('../../../src/components/input/ColorPicker');

describe('ColorPicker', () => {
  beforeEach(() => {
    capturedOnChange = undefined;
  });

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<ColorPicker id="c1" component="ColorPicker" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with value', () => {
    const { container } = render(<ColorPicker id="c1" component="ColorPicker" properties={{ value: '#1677ff' }} />);
    expect(container.firstChild).toBeTruthy();
  });

  // BUG2: antd ColorPicker onChange passes a single AggregationColor arg,
  // not (color, hex). The old code read the non-existent second param →
  // onSyncState always got { value: undefined }.
  it('BUG2: onChange extracts hex from color.toHexString() (first arg only)', () => {
    const onSyncState = vi.fn();
    render(
      <ColorPicker
        id="c1"
        component="ColorPicker"
        properties={{ value: '#1677ff' }}
        onSyncState={onSyncState}
      />,
    );

    // Simulate antd calling onChange with a single AggregationColor arg
    const mockColor = { toHexString: () => '#ff0000' };
    capturedOnChange!(mockColor);

    expect(onSyncState).toHaveBeenCalledTimes(1);
    expect(onSyncState).toHaveBeenCalledWith({ value: '#ff0000' });
  });

  it('BUG2: does NOT pass undefined when color has toHexString', () => {
    const onSyncState = vi.fn();
    render(
      <ColorPicker
        id="c1"
        component="ColorPicker"
        properties={{ value: '#1677ff' }}
        onSyncState={onSyncState}
      />,
    );

    capturedOnChange!({ toHexString: () => '#00ff00' });

    // The synced value must be a valid hex string, not undefined
    const syncedValue = onSyncState.mock.calls[0]?.[0]?.value;
    expect(syncedValue).toBe('#00ff00');
    expect(syncedValue).not.toBeUndefined();
  });
});
