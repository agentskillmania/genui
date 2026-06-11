import React from 'react';
import { Alert as AntAlert } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Alert component — displays an alert banner with optional close action.
 */
export const Alert: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { message, description, type, closable, showIcon, banner, style } = properties ?? {};

  const handleClose = () => {
    onAction?.('close');
  };

  return (
    <AntAlert
      message={message as React.ReactNode}
      description={description as React.ReactNode}
      type={type as 'success' | 'info' | 'warning' | 'error'}
      closable={closable as boolean}
      showIcon={showIcon as boolean}
      banner={banner as boolean}
      style={style as React.CSSProperties}
      onClose={handleClose}
    />
  );
};
Alert.displayName = 'Alert';
