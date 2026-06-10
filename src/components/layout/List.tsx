import React from 'react';
import { List as AntList } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * List layout component — renders children as list items.
 * Wraps in a flexShrink:0 container to prevent horizontal compression.
 */
export const List: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { header, footer, bordered, split, size, style } = properties;
  const childArray = React.Children.toArray(children);

  const items = childArray.map((child, index) => ({
    key: index,
    children: child,
  }));

  // flexShrink:0 prevents horizontal lists from being compressed, matching upstream virtual DOM default
  const containerStyle: React.CSSProperties = {
    ...(style as React.CSSProperties),
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <AntList
        header={header as React.ReactNode}
        footer={footer as React.ReactNode}
        bordered={bordered as boolean}
        split={split !== false}
        size={size as 'small' | 'default' | 'large'}
        dataSource={items}
        renderItem={(item) => <AntList.Item key={item.key}>{item.children}</AntList.Item>}
      />
    </div>
  );
};
