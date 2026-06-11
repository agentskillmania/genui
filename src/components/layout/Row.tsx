import React from 'react';
import { Row as AntRow } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Row layout component — horizontal flex container via Ant Design Row.
 */
export const Row: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { justify, align, gutter, wrap, style } = properties ?? {};

  return (
    <AntRow
      justify={justify as React.ComponentProps<typeof AntRow>['justify']}
      align={align as React.ComponentProps<typeof AntRow>['align']}
      gutter={gutter as number | [number, number]}
      wrap={wrap as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntRow>
  );
};
