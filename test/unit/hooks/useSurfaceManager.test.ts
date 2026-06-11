/**
 * Unit tests for useSurfaceManager hook.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSurfaceManager } from '../../../src/hooks/useSurfaceManager';

// Mock SurfaceManager to control initialize/destroy behavior
vi.mock('../../../src/SurfaceManager', () => {
  return {
    SurfaceManager: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
    })),
  };
});

describe('useSurfaceManager', () => {
  it('creates and initializes a SurfaceManager', async () => {
    const { result } = renderHook(() => useSurfaceManager());

    // Wait for async initialize to resolve
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.surfaceManager).not.toBeNull();
  });

  it('starts with loading=true and no surfaceManager', async () => {
    let loadingSnapshot = false;
    let smSnapshot = null;
    let errorSnapshot = null;

    renderHook(() => {
      const state = useSurfaceManager();
      // Capture the initial render state synchronously
      if (state.loading && state.surfaceManager === null) {
        loadingSnapshot = state.loading;
        smSnapshot = state.surfaceManager;
        errorSnapshot = state.error;
      }
      return state;
    });

    expect(loadingSnapshot).toBe(true);
    expect(smSnapshot).toBeNull();
    expect(errorSnapshot).toBeNull();

    // Flush the async initialize
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  });

  it('captures initialization errors', async () => {
    // Override mock to throw on initialize
    const { SurfaceManager } = await import('../../../src/SurfaceManager');
    vi.mocked(SurfaceManager).mockImplementationOnce(
      () =>
        ({
          initialize: vi.fn().mockRejectedValue(new Error('init failed')),
          destroy: vi.fn(),
        }) as unknown as InstanceType<typeof SurfaceManager>,
    );

    const { result } = renderHook(() => useSurfaceManager());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('init failed');
  });

  it('captures non-Error initialization rejection as Error', async () => {
    const { SurfaceManager } = await import('../../../src/SurfaceManager');
    vi.mocked(SurfaceManager).mockImplementationOnce(
      () =>
        ({
          initialize: vi.fn().mockRejectedValue('string-error'),
          destroy: vi.fn(),
        }) as unknown as InstanceType<typeof SurfaceManager>,
    );

    const { result } = renderHook(() => useSurfaceManager());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('string-error');
  });

  it('does not update state after unmount', async () => {
    const { result, unmount } = renderHook(() => useSurfaceManager());

    // Unmount before initialize resolves
    unmount();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // Should not throw — state update after unmount is safely ignored
    expect(result.current.surfaceManager).toBeNull();
  });
});
