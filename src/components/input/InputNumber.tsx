import React, { useState, useEffect } from 'react';
import { InputNumber as AntInputNumber } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * InputNumber component — numeric input with controls.
 * Wraps Ant Design InputNumber with local state synchronization.
 */
export const InputNumber: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    min,
    max,
    step,
    precision,
    disabled,
    placeholder,
    addonBefore,
    addonAfter,
    style,
  } = properties ?? {};
  const [localValue, setLocalValue] = useState(value as number | null ?? null);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value as number | null);
    }
  }, [value]);

  const handleChange = (val: number | null) => {
    setLocalValue(val);
    onSyncState?.({ value: val });
  };

  return (
    <AntInputNumber
      value={localValue}
      min={min as number}
      max={max as number}
      step={step as number}
      precision={precision as number}
      disabled={disabled as boolean}
      placeholder={placeholder as string}
      addonBefore={addonBefore as React.ReactNode}
      addonAfter={addonAfter as React.ReactNode}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
InputNumber.displayName = 'InputNumber';
