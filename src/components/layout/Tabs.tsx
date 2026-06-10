import React from 'react';
import { Tabs as AntTabs } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Tabs layout component — switchable tab panels.
 */
export const Tabs: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { defaultActiveKey, centered, size, tabType, tabPosition, style, tabTitles } = properties;
  const childArray = React.Children.toArray(children);
  const titles = (tabTitles as string[]) || childArray.map((_, i) => `Tab ${i + 1}`);

  const items = childArray.map((child, index) => ({
    key: String(index),
    label: titles[index] || `Tab ${index + 1}`,
    children: child,
  }));

  return (
    <AntTabs
      defaultActiveKey={defaultActiveKey as string}
      centered={centered as boolean}
      size={size as 'small' | 'middle' | 'large'}
      type={tabType as 'line' | 'card' | 'editable-card'}
      tabPosition={tabPosition as 'top' | 'right' | 'bottom' | 'left'}
      style={style as React.CSSProperties}
      items={items}
    />
  );
};
