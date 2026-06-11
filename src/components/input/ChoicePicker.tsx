import React, { useState } from 'react';
import { Select } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * ChoicePicker input component — single or multi-select dropdown.
 */
export const ChoicePicker: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, options, placeholder, disabled, mode, size, style } = properties ?? {};
  const [localValue, setLocalValue] = useState(value as string | string[]);

  const handleChange = (newValue: string | string[]) => {
    setLocalValue(newValue);
    onSyncState?.({ value: newValue });
  };

  const selectOptions = (options as Array<{ label: string; value: string }>) || [];

  return (
    <Select
      value={localValue}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      mode={mode as 'multiple' | 'tags'}
      size={size as 'small' | 'middle' | 'large'}
      style={{ width: '100%', ...style as React.CSSProperties }}
      onChange={handleChange}
      options={selectOptions}
    />
  );
};
