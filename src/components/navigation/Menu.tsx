import React from 'react';
import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Menu component — vertical or horizontal navigation menu with selection callback.
 * Fires onAction('select', {key}) when a menu item is selected.
 */
export const Menu: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { items, mode, selectedKeys, theme, style } = properties ?? {};

  const menuItems: MenuProps['items'] = (
    items as Array<{ key: string; label: string; icon?: string; children?: Array<{ key: string; label: string }> }> ?? []
  ).map((item) => ({
    key: item.key,
    label: item.label,
    children: item.children?.map((child) => ({
      key: child.key,
      label: child.label,
    })),
  }));

  const handleSelect: MenuProps['onSelect'] = (info) => {
    onAction?.('select', { key: info.key });
  };

  return (
    <AntMenu
      mode={mode as 'vertical' | 'horizontal' | 'inline'}
      selectedKeys={(selectedKeys as string[]) ?? []}
      theme={theme as 'light' | 'dark'}
      items={menuItems}
      style={style as React.CSSProperties}
      onSelect={handleSelect}
    />
  );
};
Menu.displayName = 'Menu';
