import React, { useState, useEffect } from 'react';
import { Collapse as AntCollapse } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Collapse component — accordion-style panels that expand/collapse.
 * Syncs the active panel keys back to the host via onSyncState.
 */
export const Collapse: React.FC<GenUIComponentProps> = ({ properties, children, onSyncState }) => {
  const { items, activeKey, accordion, bordered, ghost, style } = properties ?? {};

  const [localActiveKeys, setLocalActiveKeys] = useState<
    string[] | string | undefined
  >((activeKey as string[] | string | undefined) ?? undefined);

  useEffect(() => {
    if (activeKey !== undefined) {
      setLocalActiveKeys(activeKey as string[] | string);
    }
  }, [activeKey]);

  const handleChange = (keys: string | string[]) => {
    setLocalActiveKeys(keys);
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
      activeKey={localActiveKeys}
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
