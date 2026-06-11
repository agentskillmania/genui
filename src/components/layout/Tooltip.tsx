import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Tooltip component — hover/focus popup that wraps child content.
 */
export const Tooltip: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { title, placement, color, trigger, style } = properties ?? {};

  return (
    <AntTooltip
      title={title as React.ReactNode}
      placement={placement as 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'}
      color={color as string}
      trigger={trigger as 'hover' | 'focus' | 'click' | 'contextMenu'}
      style={style as React.CSSProperties}
    >
      {children ?? <span>Hover me</span>}
    </AntTooltip>
  );
};
Tooltip.displayName = 'Tooltip';
