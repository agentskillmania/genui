/**
 * useSurfaceManager — React hook for SurfaceManager lifecycle.
 * Creates and initializes a SurfaceManager instance on mount, destroys on unmount.
 */

import { useState, useEffect } from 'react';
import { SurfaceManager } from '../SurfaceManager';
import { Genui } from '../GenuiEngine';

export interface UseSurfaceManagerResult {
  surfaceManager: SurfaceManager | null;
  loading: boolean;
  error: Error | null;
}

/**
 * React hook that manages a SurfaceManager instance.
 * SurfaceManager.initialize() is synchronous (no WASM), but the async
 * pattern is kept for API consistency.
 */
export function useSurfaceManager(): UseSurfaceManagerResult {
  const [surfaceManager, setSurfaceManager] = useState<SurfaceManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const sm = new SurfaceManager();

    // Wire up function resolution so `{ call, args }` data bindings resolve
    // against handlers registered via Genui.registerFunction.
    sm.setFunctionResolver((name) => Genui.getFunction(name));

    sm.initialize()
      .then(() => {
        if (isMounted) {
          setSurfaceManager(sm);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      sm.destroy();
    };
  }, []);

  return { surfaceManager, loading, error };
}
