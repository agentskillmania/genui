import React from 'react';
import { Tag as AntTag } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Tag component — displays a colored label with optional close action.
 */
export const Tag: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { text, color, closable, bordered, style } = properties ?? {};

  const handleClose = () => {
    onAction?.('close');
  };

  return (
    <AntTag
      color={color as string}
      closable={closable as boolean}
      bordered={bordered as boolean}
      style={style as React.CSSProperties}
      onClose={handleClose}
    >
      {text as React.ReactNode}
    </AntTag>
  );
};
Tag.displayName = 'Tag';
