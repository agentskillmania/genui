import React, { useState, useEffect } from 'react';
import { TreeSelect as AntTreeSelect } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * TreeSelect input component — tree-structured dropdown selector.
 * Wraps Ant Design TreeSelect with local state synchronization.
 */
export const TreeSelect: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    treeData,
    placeholder,
    disabled,
    multiple,
    showSearch,
    treeCheckable,
    style,
  } = properties ?? {};
  const [localValue, setLocalValue] = useState(value as string | string[] | undefined);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value as string | string[]);
    }
  }, [value]);

  const handleChange = (val: string | string[]) => {
    setLocalValue(val);
    onSyncState?.({ value: val });
  };

  return (
    <AntTreeSelect
      value={localValue}
      treeData={treeData as Array<{ value: string; title: string; children?: unknown[] }>}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      multiple={multiple as boolean}
      showSearch={showSearch as boolean}
      treeCheckable={treeCheckable as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange as never}
    />
  );
};
TreeSelect.displayName = 'TreeSelect';
