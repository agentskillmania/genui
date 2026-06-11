import React, { useState, useEffect } from 'react';
import { Rate as AntRate } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Rate input component — star rating selector.
 * Wraps Ant Design Rate with local state synchronization.
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
  const [localValue, setLocalValue] = useState(value as number ?? 0);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value as number);
    }
  }, [value]);

  const handleChange = (val: number) => {
    setLocalValue(val);
    onSyncState?.({ value: val });
  };

  return (
    <AntRate
      value={localValue}
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
