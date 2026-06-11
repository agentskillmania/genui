import React from 'react';
import { Dropdown as AntDropdown, Button as AntButton } from 'antd';
import type { MenuProps } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Dropdown component — button-triggered menu with selection callback.
 * Fires onAction('select', {key}) when an item is chosen.
 */
export const Dropdown: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { label, items, trigger, placement, style } = properties ?? {};

  const menuItems: MenuProps['items'] = (
    items as Array<{ key: string; label: string; icon?: string; disabled?: boolean }> ?? []
  ).map((item) => ({
    key: item.key,
    label: item.label,
    disabled: item.disabled,
  }));

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    onAction?.('select', { key: info.key });
  };

  return (
    <AntDropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={trigger ? [trigger as 'click' | 'hover' | 'contextMenu'] : ['click']}
      placement={placement as 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight'}
    >
      <AntButton style={style as React.CSSProperties}>
        {(label as string) ?? 'Menu'}
      </AntButton>
    </AntDropdown>
  );
};
Dropdown.displayName = 'Dropdown';
