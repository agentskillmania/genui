import React, { useState, useEffect } from 'react';
import { Transfer as AntTransfer } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Transfer input component — dual-list item mover.
 * Wraps Ant Design Transfer with local state synchronization.
 */
export const Transfer: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    dataSource,
    targetKeys,
    selectedKeys,
    titles,
    showSearch,
    oneWay,
    style,
  } = properties ?? {};
  const [localTargetKeys, setLocalTargetKeys] = useState(
    (targetKeys as string[]) ?? [],
  );
  const [localSelectedKeys, setLocalSelectedKeys] = useState(
    (selectedKeys as string[]) ?? [],
  );

  useEffect(() => {
    if (targetKeys !== undefined) {
      setLocalTargetKeys(targetKeys as string[]);
    }
  }, [targetKeys]);

  useEffect(() => {
    if (selectedKeys !== undefined) {
      setLocalSelectedKeys(selectedKeys as string[]);
    }
  }, [selectedKeys]);

  const handleChange = (
    nextTargetKeys: string[],
    direction: 'left' | 'right',
    moveKeys: string[],
  ) => {
    setLocalTargetKeys(nextTargetKeys);
    onSyncState?.({ targetKeys: nextTargetKeys, direction, moveKeys });
  };

  const handleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[],
  ) => {
    const next = [...sourceSelectedKeys, ...targetSelectedKeys];
    setLocalSelectedKeys(next);
    onSyncState?.({ selectedKeys: next });
  };

  return (
    <AntTransfer
      dataSource={(dataSource as Array<{ key: string; title: string; description?: string }>) ?? []}
      targetKeys={localTargetKeys}
      selectedKeys={localSelectedKeys}
      titles={titles as [string, string]}
      showSearch={showSearch as boolean}
      oneWay={oneWay as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
      onSelectChange={handleSelectChange}
      render={(item) => (item as { title?: string }).title ?? (item as { key: string }).key}
    />
  );
};
Transfer.displayName = 'Transfer';
