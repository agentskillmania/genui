import React, { useState, useEffect } from 'react';
import { ColorPicker as AntColorPicker } from 'antd';
import type { GenUIComponentProps } from '../types';

/** ColorPicker component — color selection input. */
export const ColorPicker: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, disabled, showText, size, allowClear, style } = properties ?? {};
  const [localValue, setLocalValue] = useState(value as string | undefined);

  useEffect(() => {
    if (value !== undefined) setLocalValue(value as string);
  }, [value]);

  const handleChange = (color: any, hex: string) => {
    setLocalValue(hex);
    onSyncState?.({ color: hex });
  };

  return (
    <AntColorPicker
      value={localValue}
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
