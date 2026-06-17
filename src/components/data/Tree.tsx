import React from 'react';
import { Tree as AntTree } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Tree component — hierarchical tree view with selection and checkable support.
 *
 * Fully controlled: selectedKeys/checkedKeys come from `properties` and every
 * interaction is reported both as a state sync (`onSyncState`) and a semantic
 * action (`onAction`). The host owns the selection state.
 */
export const Tree: React.FC<GenUIComponentProps> = ({ properties, onAction, onSyncState }) => {
  const {
    treeData,
    checkable,
    selectable,
    checkedKeys,
    selectedKeys,
    defaultExpandAll,
    showLine,
    showIcon,
    multiple,
    style,
  } = properties ?? {};

  const handleSelect = (keys: React.Key[]) => {
    onSyncState?.({ selectedKeys: keys });
    if (keys.length > 0) {
      onAction?.('select', { key: keys[0] });
    }
  };

  const handleCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    const keys = Array.isArray(checked) ? checked : checked.checked;
    onSyncState?.({ checkedKeys: keys });
    onAction?.('check', { checkedKeys: keys });
  };

  return (
    <AntTree
      treeData={treeData as any[]}
      checkable={checkable as boolean}
      selectable={selectable !== false}
      checkedKeys={(checkedKeys as React.Key[]) ?? []}
      selectedKeys={(selectedKeys as React.Key[]) ?? []}
      defaultExpandAll={defaultExpandAll as boolean}
      showLine={showLine as boolean}
      showIcon={showIcon as boolean}
      multiple={multiple as boolean}
      style={style as React.CSSProperties}
      onSelect={handleSelect}
      onCheck={handleCheck}
    />
  );
};
Tree.displayName = 'Tree';
