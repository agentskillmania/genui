import React from 'react';
import { Card as AntCard } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Card layout component — bordered content container.
 */
export const Card: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { title, extra, bordered, hoverable, style } = properties;

  return (
    <AntCard
      title={title as React.ReactNode}
      extra={extra as React.ReactNode}
      bordered={bordered !== false}
      hoverable={hoverable as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntCard>
  );
};
