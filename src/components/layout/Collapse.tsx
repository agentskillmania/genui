import React from 'react';
import { Collapse as AntCollapse } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Collapse component — accordion-style panels that expand/collapse.
 *
 * Fully controlled: active panel keys come from `properties.activeKey` and
 * every change is reported upstream via `onSyncState({ activeKeys })`.
 */
export const Collapse: React.FC<GenUIComponentProps> = ({ properties, children, onSyncState }) => {
  const { items, activeKey, accordion, bordered, ghost, style } = properties ?? {};

  const handleChange = (keys: string | string[]) => {
    onSyncState?.({ activeKeys: Array.isArray(keys) ? keys : [keys] });
  };

  const collapseItems = (
    items as Array<{ key: string; label: string; children?: string }> ?? []
  ).map((item) => ({
    key: item.key,
    label: item.label,
    children: item.children ?? null,
  }));

  return (
    <AntCollapse
      activeKey={activeKey as string[] | string | undefined}
      accordion={accordion as boolean}
      bordered={bordered !== false}
      ghost={ghost as boolean}
      items={collapseItems}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Collapse.displayName = 'Collapse';
