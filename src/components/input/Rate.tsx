import React from 'react';
import { Rate as AntRate } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Rate input component — star rating selector.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
 */
export const Rate: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    count,
    allowHalf,
    allowClear,
    disabled,
    tooltips,
    style,
  } = properties ?? {};

  const handleChange = (val: number) => {
    onSyncState?.({ value: val });
  };

  return (
    <AntRate
      value={(value as number) ?? 0}
      count={count as number}
      allowHalf={allowHalf as boolean}
      allowClear={allowClear as boolean}
      disabled={disabled as boolean}
      tooltips={tooltips as string[]}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Rate.displayName = 'Rate';
