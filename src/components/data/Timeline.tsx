import React from 'react';
import { Timeline as AntTimeline } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Timeline component — displays a vertical sequence of events.
 * Items are sourced from the `items` property array.
 */
export const Timeline: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { items, mode, style } = properties ?? {};

  const timelineItems = (items as Array<{
    color?: string;
    children?: React.ReactNode;
    dot?: React.ReactNode;
    label?: React.ReactNode;
  }>) ?? [];

  return (
    <AntTimeline
      mode={mode as 'left' | 'right' | 'alternate'}
      style={style as React.CSSProperties}
      items={timelineItems.map((item, idx) => ({
        key: idx,
        color: item.color,
        children: item.children,
        dot: item.dot,
        label: item.label,
      }))}
    />
  );
};
Timeline.displayName = 'Timeline';
