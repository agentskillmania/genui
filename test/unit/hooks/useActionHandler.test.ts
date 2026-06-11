/**
 * Unit tests for useActionHandler hook.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActionHandler } from '../../../src/hooks/useActionHandler';
import type { ActionEvent } from '../../../src/types/sdk';

describe('useActionHandler', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useActionHandler());
    expect(typeof result.current).toBe('function');
  });

  it('calls onAction when invoked', () => {
    const onAction = vi.fn();
    const { result } = renderHook(() => useActionHandler(onAction));

    const action: ActionEvent = { surfaceId: 's1', sourceComponentId: 'btn1' };
    act(() => {
      result.current(action);
    });

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(action);
  });

  it('does not throw when onAction is undefined', () => {
    const { result } = renderHook(() => useActionHandler(undefined));

    expect(() => {
      result.current({ surfaceId: 's1', sourceComponentId: 'btn1' });
    }).not.toThrow();
  });

  it('returns a stable reference when onAction does not change', () => {
    const onAction = vi.fn();
    const { result, rerender } = renderHook(() => useActionHandler(onAction));

    const first = result.current;
    rerender();
    const second = result.current;

    expect(first).toBe(second);
  });

  it('returns a new reference when onAction changes', () => {
    const onAction1 = vi.fn();
    const onAction2 = vi.fn();
    const { result, rerender } = renderHook(
      ({ cb }) => useActionHandler(cb),
      { initialProps: { cb: onAction1 } },
    );

    const first = result.current;
    rerender({ cb: onAction2 });
    const second = result.current;

    expect(first).not.toBe(second);
  });
});
