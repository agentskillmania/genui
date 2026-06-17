import React from 'react';
import { AutoComplete as AntAutoComplete } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * AutoComplete input component — type-ahead text input with suggestions.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
 */
export const AutoComplete: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    options,
    placeholder,
    disabled,
    style,
  } = properties ?? {};

  const handleChange = (val: string) => {
    onSyncState?.({ value: val });
  };

  return (
    <AntAutoComplete
      value={(value as string) ?? ''}
      options={options as Array<{ value: string; label?: string }>}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
AutoComplete.displayName = 'AutoComplete';
