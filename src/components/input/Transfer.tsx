import React from 'react';
import { Transfer as AntTransfer } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Transfer input component — dual-list item mover.
 *
 * Fully controlled: targetKeys/selectedKeys come from `properties` and every
 * change is reported upstream via `onSyncState`.
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

  const handleChange = (
    nextTargetKeys: React.Key[],
    direction: 'left' | 'right',
    moveKeys: React.Key[],
  ) => {
    onSyncState?.({ targetKeys: nextTargetKeys, direction, moveKeys });
  };

  const handleSelectChange = (
    sourceSelectedKeys: React.Key[],
    targetSelectedKeys: React.Key[],
  ) => {
    onSyncState?.({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  return (
    <AntTransfer
      dataSource={(dataSource as Array<{ key: React.Key; title: string; description?: string }>) ?? []}
      targetKeys={(targetKeys as React.Key[]) ?? []}
      selectedKeys={(selectedKeys as React.Key[]) ?? []}
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
