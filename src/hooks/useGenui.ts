/**
 * useGenui — React hook for GenUI engine lifecycle.
 * Replaces the AGenUI WASM-based initialization with sync init.
 */

import { useState, useCallback } from 'react';
import { Genui } from '../GenuiEngine';
import type { GenuiConfig } from '../types/sdk';

export interface UseGenuiResult {
  initialized: boolean;
  loading: boolean;
  error: Error | null;
  initialize: (config?: GenuiConfig) => Promise<void>;
}

/**
 * React hook for GenUI engine initialization.
 * Initialization is synchronous under the hood — no WASM loading.
 * The async API is kept for backward compatibility.
 */
export function useGenui(): UseGenuiResult {
  const [initialized, setInitialized] = useState(Genui.isInitialized());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async (config?: GenuiConfig) => {
    if (Genui.isInitialized()) {
      setInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Genui.initialize(config);
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { initialized, loading, error, initialize };
}
