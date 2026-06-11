import React from 'react';
import { FloatButton as AntFloatButton } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * FloatButton component — floating action button with click callback.
 * Fires onAction('click') when pressed.
 */
export const FloatButton: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { icon, type, tooltip, shape, style } = properties ?? {};

  const handleClick = () => {
    onAction?.('click');
  };

  return (
    <AntFloatButton
      icon={icon as React.ReactNode}
      type={type as 'default' | 'primary'}
      tooltip={tooltip as React.ReactNode}
      shape={shape as 'circle' | 'square'}
      style={style as React.CSSProperties}
      onClick={handleClick}
    />
  );
};
FloatButton.displayName = 'FloatButton';
