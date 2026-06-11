import React from 'react';
import { Spin as AntSpin } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Spin component — shows a spinning loading indicator.
 * Wraps children; displays spinner overlay when `spinning` is true.
 */
export const Spin: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { spinning, size, tip, delay, style } = properties ?? {};

  return (
    <AntSpin
      spinning={spinning as boolean}
      size={size as 'small' | 'default' | 'large'}
      tip={tip as React.ReactNode}
      delay={delay as number}
      style={style as React.CSSProperties}
    >
      {children}
    </AntSpin>
  );
};
Spin.displayName = 'Spin';
