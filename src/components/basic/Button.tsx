import React from 'react';
import { Button as AntButton } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Button component — triggers onAction('click') on press.
 */
export const Button: React.FC<GenUIComponentProps> = ({ properties, children, onAction }) => {
  const { text, variant, danger, disabled, loading, size, style } = properties ?? {};

  const handleClick = () => {
    onAction?.('click');
  };

  return (
    <AntButton
      type={variant as 'primary' | 'dashed' | 'link' | 'text' | 'default'}
      danger={danger as boolean}
      disabled={disabled as boolean}
      loading={loading as boolean}
      size={size as 'small' | 'middle' | 'large'}
      style={style as React.CSSProperties}
      onClick={handleClick}
    >
      {text as string}
      {children}
    </AntButton>
  );
};
