import React from 'react';
import { Modal as AntModal } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Modal layout component — overlay dialog with ok/cancel actions.
 *
 * Fully controlled: visibility is driven by `properties.open`. Ok/Cancel
 * emit both a semantic action (`onAction('ok'|'cancel')`) and a state sync
 * (`onSyncState({ open: false })`); the host decides whether the modal
 * actually closes by updating the data model. This component never forces
 * itself closed locally.
 */
export const Modal: React.FC<GenUIComponentProps> = ({ properties, children, onAction, onSyncState }) => {
  const { title, open, width, centered, closable, maskClosable, footer, style } = properties ?? {};

  const handleOk = () => {
    onAction?.('ok');
    onSyncState?.({ open: false });
  };

  const handleCancel = () => {
    onAction?.('cancel');
    onSyncState?.({ open: false });
  };

  // footer: 'default' | null | ReactNode
  const footerProp = footer === 'default' ? undefined : footer as React.ReactNode | null;

  return (
    <AntModal
      title={title as React.ReactNode}
      open={!!open}
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
