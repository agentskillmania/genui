import React, { useState, useEffect } from 'react';
import { Cascader as AntCascader } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Cascader input component — hierarchical multi-level selector.
 * Wraps Ant Design Cascader with local state synchronization.
 */
export const Cascader: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    options,
    placeholder,
    disabled,
    multiple,
    style,
  } = properties ?? {};
  const [localValue, setLocalValue] = useState(value as (string | number)[] | undefined);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value as (string | number)[]);
    }
  }, [value]);

  const handleChange = (
    val: (string | number)[] | ((string | number)[])[],
  ) => {
    setLocalValue(val as (string | number)[]);
    onSyncState?.({ value: val });
  };

  return (
    <AntCascader
      value={localValue}
      options={options as Array<{ value: string | number; label: string; children?: unknown[] }>}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      multiple={multiple as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange as never}
    />
  );
};
Cascader.displayName = 'Cascader';
