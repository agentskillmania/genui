/**
 * useActionHandler — React hook for dispatching A2UI actions.
 */

import { useCallback } from 'react';
import type { ActionEvent } from '../types/sdk';

/**
 * Creates a stable action handler callback.
 * Wraps the consumer's onAction callback to provide a consistent interface.
 */
export function useActionHandler(
  onAction?: (action: ActionEvent) => void
): (action: ActionEvent) => void {
  return useCallback(
    (action: ActionEvent) => {
      onAction?.(action);
    },
    [onAction]
  );
}
