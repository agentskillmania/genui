import React from 'react';
import { Select } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * ChoicePicker input component — single or multi-select dropdown.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
 */
export const ChoicePicker: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, options, placeholder, disabled, mode, size, style } = properties ?? {};

  const handleChange = (newValue: string | string[]) => {
    onSyncState?.({ value: newValue });
  };

  const selectOptions = (options as Array<{ label: string; value: string }>) || [];

  return (
    <Select
      value={value as string | string[]}
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
