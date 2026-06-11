import React from 'react';
import { Popover as AntPopover } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Popover component — click/hover popup with title and content, wrapping child content.
 */
export const Popover: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { title, content, placement, trigger, style } = properties ?? {};

  return (
    <AntPopover
      title={title as React.ReactNode}
      content={content as React.ReactNode}
      placement={placement as 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'}
      trigger={trigger as 'hover' | 'focus' | 'click' | 'contextMenu'}
      style={style as React.CSSProperties}
    >
      {children ?? <span>Click me</span>}
    </AntPopover>
  );
};
Popover.displayName = 'Popover';
