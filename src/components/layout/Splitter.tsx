import React from 'react';
import { Splitter as AntSplitter } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Splitter component — resizable split-panel container.
 * Each child is automatically wrapped in a Splitter.Panel.
 */
export const Splitter: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { layout, style } = properties ?? {};

  // Wrap each child in Splitter.Panel so AntD renders proper split panels
  const panelChildren = React.Children.map(children, (child) => (
    <AntSplitter.Panel>{child}</AntSplitter.Panel>
  ));

  return (
    <AntSplitter
      layout={layout as 'horizontal' | 'vertical'}
      style={style as React.CSSProperties}
    >
      {panelChildren}
    </AntSplitter>
  );
};
Splitter.displayName = 'Splitter';
