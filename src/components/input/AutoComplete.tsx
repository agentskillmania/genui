import React, { useState, useEffect } from 'react';
import { AutoComplete as AntAutoComplete } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * AutoComplete input component — type-ahead text input with suggestions.
 * Wraps Ant Design AutoComplete with local state synchronization.
 */
export const AutoComplete: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    options,
    placeholder,
    disabled,
    style,
  } = properties ?? {};
  const [localValue, setLocalValue] = useState((value as string) ?? '');

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value as string);
    }
  }, [value]);

  const handleChange = (val: string) => {
    setLocalValue(val);
    onSyncState?.({ value: val });
  };

  return (
    <AntAutoComplete
      value={localValue}
      options={options as Array<{ value: string; label?: string }>}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
AutoComplete.displayName = 'AutoComplete';
