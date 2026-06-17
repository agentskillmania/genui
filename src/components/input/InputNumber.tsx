import React from 'react';
import { InputNumber as AntInputNumber } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * InputNumber component — numeric input with controls.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
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

  const handleChange = (val: number | null) => {
    onSyncState?.({ value: val });
  };

  return (
    <AntInputNumber
      value={value as number | null}
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
