import React from 'react';
import { Badge as AntBadge } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Badge component — displays a small status badge or count indicator.
 * Wraps children as the badge target.
 */
export const Badge: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { count, dot, status, color, text, overflowCount, style } = properties ?? {};

  return (
    <AntBadge
      count={count as number}
      dot={dot as boolean}
      status={status as 'success' | 'processing' | 'default' | 'error' | 'warning'}
      color={color as string}
      text={text as React.ReactNode}
      overflowCount={overflowCount as number}
      style={style as React.CSSProperties}
    >
      {children}
    </AntBadge>
  );
};
Badge.displayName = 'Badge';
