import React, { useState, useEffect } from 'react';
import { Modal as AntModal } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Modal layout component — overlay dialog with ok/cancel actions.
 */
export const Modal: React.FC<GenUIComponentProps> = ({ properties, children, onAction }) => {
  const { title, open, width, centered, closable, maskClosable, footer, style } = properties;
  const [visible, setVisible] = useState(!!open);

  useEffect(() => {
    setVisible(!!open);
  }, [open]);

  const handleOk = () => {
    onAction?.('ok');
    setVisible(false);
  };

  const handleCancel = () => {
    onAction?.('cancel');
    setVisible(false);
  };

  // footer: 'default' | null | ReactNode
  const footerProp = footer === 'default' ? undefined : footer as React.ReactNode | null;

  return (
    <AntModal
      title={title as React.ReactNode}
      open={visible}
      width={width as number | string}
      centered={centered as boolean}
      closable={closable !== false}
      maskClosable={maskClosable !== false}
      footer={footerProp}
      style={style as React.CSSProperties}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {children}
    </AntModal>
  );
};
