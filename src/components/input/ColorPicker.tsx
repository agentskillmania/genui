import React from 'react';
import { ColorPicker as AntColorPicker } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * ColorPicker component — color selection input.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`. The sync key is `value`
 * (not `color`) for consistency with other input components.
 */
export const ColorPicker: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, disabled, showText, size, allowClear, style } = properties ?? {};

  // BUG2 fix: antd ColorPicker onChange passes a single AggregationColor arg
  // (not (color, hex)). Extract the hex string from the first argument.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (color: any) => {
    const hex = typeof color?.toHexString === 'function' ? color.toHexString() : String(color);
    onSyncState?.({ value: hex });
  };

  return (
    <AntColorPicker
      value={value as string}
      disabled={disabled as boolean}
      showText={showText as boolean}
      size={size as 'small' | 'middle' | 'large'}
      allowClear={allowClear as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
ColorPicker.displayName = 'ColorPicker';
