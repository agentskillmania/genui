import React, { useState, useEffect } from 'react';
import { Drawer as AntDrawer } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Drawer component — a sliding panel overlay with open/close state management.
 * Mirrors the Modal pattern: uses internal useState synced with the `open` prop.
 */
export const Drawer: React.FC<GenUIComponentProps> = ({ properties, children, onAction }) => {
  const { title, open, placement, width, closable, maskClosable, style } = properties ?? {};
  const [visible, setVisible] = useState(!!open);

  useEffect(() => {
    setVisible(!!open);
  }, [open]);

  const handleClose = () => {
    onAction?.('close');
    setVisible(false);
  };

  return (
    <AntDrawer
      title={title as React.ReactNode}
      open={visible}
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
