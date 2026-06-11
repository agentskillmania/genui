import React from 'react';
import { Space as AntSpace } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Space component — adds consistent spacing between child elements.
 */
export const Space: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { direction, size, align, wrap, style } = properties ?? {};

  return (
    <AntSpace
      direction={direction as 'horizontal' | 'vertical'}
      size={size as number | 'small' | 'middle' | 'large'}
      align={align as 'start' | 'end' | 'center' | 'baseline'}
      wrap={wrap as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntSpace>
  );
};
Space.displayName = 'Space';
