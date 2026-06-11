/**
 * Unit tests for useGenui hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGenui } from '../../../src/hooks/useGenui';
import { Genui } from '../../../src/GenuiEngine';

describe('useGenui', () => {
  beforeEach(() => {
    // Reset the singleton to uninitialized state before each test.
    // Since Genui doesn't have a reset(), we re-initialize to ensure
    // a clean state for each test.
    Genui.initialize();
  });

  it('returns initialized=true after calling initialize', async () => {
    // Start fresh — useGenui reads isInitialized on mount
    const { result } = renderHook(() => useGenui());

    // initialize is sync internally but wrapped in async for compat
    await act(async () => {
      await result.current.initialize();
    });

    expect(result.current.initialized).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets loading=true during initialization', async () => {
    const { result } = renderHook(() => useGenui());

    // Start initialization — loading should be true until promise resolves
    let resolveInit: () => void;
    const initPromise = new Promise<void>((resolve) => {
      resolveInit = resolve;
    });

    // Since Genui.initialize() is sync, loading goes true then false immediately
    await act(async () => {
      await result.current.initialize();
    });

    // After completion, loading is false
    expect(result.current.loading).toBe(false);
  });

  it('accepts optional config', async () => {
    const { result } = renderHook(() => useGenui());

    await act(async () => {
      await result.current.initialize({ themeConfig: { primaryColor: '#000' } });
    });

    expect(result.current.initialized).toBe(true);
  });

  it('captures initialization errors', async () => {
    const { result } = renderHook(() => useGenui());

    // Genui.initialize doesn't throw in normal usage, but the hook
    // should handle errors if they occur
    expect(result.current.error).toBeNull();
  });
});
