import React from 'react';
import { Progress as AntProgress } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Progress component — displays a progress bar or circle.
 */
export const Progress: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { percent, type, status, strokeColor, trailColor, style } = properties ?? {};

  return (
    <AntProgress
      percent={percent as number}
      type={type as 'line' | 'circle' | 'dashboard'}
      status={status as 'success' | 'exception' | 'normal' | 'active'}
      strokeColor={strokeColor as string}
      trailColor={trailColor as string}
      style={style as React.CSSProperties}
    />
  );
};
Progress.displayName = 'Progress';
