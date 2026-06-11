import React from 'react';
import { Descriptions as AntDescriptions } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Descriptions component — displays a list of label/value pairs in a table-like layout.
 * Items are sourced from the `items` property array.
 */
export const Descriptions: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { title, items, bordered, column, size, style } = properties ?? {};

  const descItems = (items as Array<{
    label?: React.ReactNode;
    children?: React.ReactNode;
  }>) ?? [];

  return (
    <AntDescriptions
      title={title as React.ReactNode}
      bordered={bordered as boolean}
      column={column as number}
      size={size as 'default' | 'middle' | 'small'}
      style={style as React.CSSProperties}
      items={descItems.map((item, idx) => ({
        key: idx,
        label: item.label,
        children: item.children,
      }))}
    />
  );
};
Descriptions.displayName = 'Descriptions';
