import React, { useState, useEffect } from 'react';
import { Tree as AntTree } from 'antd';
import type { GenUIComponentProps } from '../types';

/** Tree component — hierarchical tree view with selection and checkable support. */
export const Tree: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
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

  const [localSelectedKeys, setLocalSelectedKeys] = useState<React.Key[]>(
    (selectedKeys as React.Key[]) ?? [],
  );
  const [localCheckedKeys, setLocalCheckedKeys] = useState<React.Key[]>(
    (checkedKeys as React.Key[]) ?? [],
  );

  useEffect(() => {
    if (selectedKeys) setLocalSelectedKeys(selectedKeys as React.Key[]);
  }, [selectedKeys]);

  useEffect(() => {
    if (checkedKeys) setLocalCheckedKeys(checkedKeys as React.Key[]);
  }, [checkedKeys]);

  const handleSelect = (keys: React.Key[]) => {
    setLocalSelectedKeys(keys);
    if (keys.length > 0) {
      onAction?.('select', { key: keys[0] });
    }
  };

  const handleCheck = (keys: React.Key[]) => {
    setLocalCheckedKeys(keys);
    onAction?.('check', { checkedKeys: keys });
  };

  return (
    <AntTree
      treeData={treeData as any[]}
      checkable={checkable as boolean}
      selectable={selectable !== false}
      checkedKeys={localCheckedKeys}
      selectedKeys={localSelectedKeys}
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
