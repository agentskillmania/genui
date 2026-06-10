import type { ReactNode } from 'react';

/**
 * Core props passed to every GenUI component renderer.
 * Mirrors the A2UI component tree node shape.
 */
export interface GenUIComponentProps {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  children?: ReactNode;
  onAction?: (action: string, context?: Record<string, unknown>) => void;
  onSyncState?: (change: Record<string, unknown>) => void;
}

/** @deprecated Use GenUIComponentProps */
export type AGenUIComponentProps = GenUIComponentProps;

export type ComponentRenderer = (props: GenUIComponentProps) => ReactNode;
