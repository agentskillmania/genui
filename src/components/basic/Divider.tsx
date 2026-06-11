import React from 'react';
import { Divider as AntDivider } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Divider component — horizontal or vertical separator.
 */
export const Divider: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { orientation, type, dashed, plain, style } = properties ?? {};

  return (
    <AntDivider
      orientation={orientation as 'horizontal' | 'vertical' | undefined}
      titlePlacement={type as 'left' | 'right' | 'center' | undefined}
      dashed={dashed as boolean}
      plain={plain as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntDivider>
  );
};
