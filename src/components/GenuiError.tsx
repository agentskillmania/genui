import React from 'react';
import { Alert } from 'antd';
import type { GenUIComponentProps } from './types';

/**
 * GenuiError — built-in diagnostics component (not part of the public catalog).
 *
 * The render pipeline synthesizes `{ component: "GenuiError", ... }` metadata
 * whenever A2UI content cannot be rendered (unknown component type, missing
 * root, broken template binding, …), so failures surface in the UI instead of
 * rendering an empty subtree. Hosts should not emit this type themselves.
 */
export const GenuiError: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { message, description, severity } = properties ?? {};

  const type =
    severity === 'info' ? 'info' : severity === 'warning' ? 'warning' : 'error';

  return (
    <Alert
      type={type}
      showIcon
      message={(message as string) || 'GenUI render error'}
      description={description ? String(description) : undefined}
    />
  );
};

GenuiError.displayName = 'GenuiError';
