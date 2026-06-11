import React from 'react';
import { Statistic as AntStatistic } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Statistic component — displays a titled numeric value with optional prefix/suffix.
 */
export const Statistic: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { title, value, prefix, suffix, precision, valueStyle, style } = properties ?? {};

  return (
    <AntStatistic
      title={title as React.ReactNode}
      value={value as number | string}
      prefix={prefix as React.ReactNode}
      suffix={suffix as React.ReactNode}
      precision={precision as number}
      valueStyle={valueStyle as React.CSSProperties}
      style={style as React.CSSProperties}
    />
  );
};
Statistic.displayName = 'Statistic';
