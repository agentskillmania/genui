import React from 'react';
import { TreeSelect as AntTreeSelect } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * TreeSelect input component — tree-structured dropdown selector.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
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

  const handleChange = (val: string | string[]) => {
    onSyncState?.({ value: val });
  };

  return (
    <AntTreeSelect
      value={value as string | string[] | undefined}
      treeData={(treeData as React.ComponentProps<typeof AntTreeSelect>['treeData']) ?? []}
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
