/**
 * Error surface components.
 *
 * When the render pipeline hits an unrecoverable state (unknown component
 * type, missing root, broken template binding, …) it must never fall back to
 * an empty subtree — instead it synthesizes a "GenuiError" A2UI component so
 * the failure is visible in the rendered UI, not just the console.
 */

import type { AGenUIComponent } from '../types/sdk';

/** Reserved component type name used for all self-describing error nodes. */
export const GENUI_ERROR_COMPONENT = 'GenuiError';

/** Severity levels supported by the built-in GenuiError renderer. */
export type GenuiErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Build an A2UI component that renders a visible error/warning card.
 * The result flows through the normal component pipeline (registry lookup,
 * property resolution), so hosts see the same shape as any other component.
 */
export function createErrorComponent(
  id: string,
  message: string,
  description?: string,
  severity: GenuiErrorSeverity = 'error',
): AGenUIComponent {
  return {
    id,
    component: GENUI_ERROR_COMPONENT,
    message,
    ...(description !== undefined ? { description } : {}),
    severity,
  };
}

/** Prefix used for all synthesized error component ids. */
export const ERROR_ID_PREFIX = '__genui_error__';
