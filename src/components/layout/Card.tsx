import React from 'react';
import { Card as AntCard } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Card layout component — bordered content container.
 *
 * Defaults to `variant="outlined"` (border-only, no heavy shadow) for a clean
 * BI-dashboard look. Sets `min-width: 0` on the card so wide children (e.g.
 * ECharts canvas, wide tables) cannot blow out the parent grid column.
 */
export const Card: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { title, extra, bordered, hoverable, variant, style } = properties ?? {};

  return (
    <AntCard
      title={title as React.ReactNode}
      extra={extra as React.ReactNode}
      bordered={bordered !== false}
      variant={(variant as 'outlined' | 'borderless') ?? 'outlined'}
      hoverable={hoverable as boolean}
      style={{ minWidth: 0, ...(style as React.CSSProperties) }}
    >
      {children}
    </AntCard>
  );
};
