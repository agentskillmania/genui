import React from 'react';
import { Drawer as AntDrawer } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Drawer component — a sliding panel overlay.
 *
 * Fully controlled: visibility is driven by `properties.open`. Closing emits
 * both a semantic action (`onAction('close')`) and a state sync
 * (`onSyncState({ open: false })`); the host decides whether the drawer
 * actually closes by updating the data model. This component never forces
 * itself closed locally.
 */
export const Drawer: React.FC<GenUIComponentProps> = ({ properties, children, onAction, onSyncState }) => {
  const { title, open, placement, width, closable, maskClosable, style } = properties ?? {};

  const handleClose = () => {
    onAction?.('close');
    onSyncState?.({ open: false });
  };

  return (
    <AntDrawer
      title={title as React.ReactNode}
      open={!!open}
      placement={placement as 'left' | 'right' | 'top' | 'bottom'}
      width={width as number | string}
      closable={closable !== false}
      maskClosable={maskClosable as boolean}
      style={style as React.CSSProperties}
      onClose={handleClose}
    >
      {children}
    </AntDrawer>
  );
};
Drawer.displayName = 'Drawer';
