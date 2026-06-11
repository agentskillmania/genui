import type { ReactNode } from 'react';

/**
 * Core props passed to every GenUI component renderer.
 * Mirrors the A2UI v0.9 component model.
 */
export interface GenUIComponentProps {
  id: string;
  /** Component type name — matches A2UI v0.9 "component" field */
  component: string;
  /** Component-specific properties (text, variant, dataSource, etc.) */
  properties: Record<string, unknown>;
  children?: ReactNode;
  /** A2UI component types of each child, in the same order as `children`. */
  childTypes?: string[];
  onAction?: (action: string, context?: Record<string, unknown>) => void;
  onSyncState?: (change: Record<string, unknown>) => void;
}

/** @deprecated Use GenUIComponentProps */
export type AGenUIComponentProps = GenUIComponentProps;

export type ComponentRenderer = (props: GenUIComponentProps) => ReactNode;
