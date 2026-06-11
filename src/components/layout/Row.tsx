import React from 'react';
import { Row as AntRow, Col } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Row layout component — horizontal flex container via Ant Design Row.
 *
 * Ant Design's Row expects Col children for proper grid distribution.
 * When a child is NOT a Column component, it is automatically wrapped
 * in a Col with `flex={1}` so it participates in the grid layout.
 * Children that are already Column components pass through unchanged.
 */
export const Row: React.FC<GenUIComponentProps> = ({ properties, children, childTypes }) => {
  const { justify, align, gutter, wrap, style } = properties ?? {};

  const childArray = React.Children.toArray(children);

  // Wrap non-Column children in Col so Ant Design grid distributes them correctly
  const wrappedChildren = childArray.map((child, index) => {
    const type = childTypes?.[index];
    if (type === 'Column') return child;
    return <Col key={`auto-col-${index}`} flex={1}>{child}</Col>;
  });

  return (
    <AntRow
      justify={justify as React.ComponentProps<typeof AntRow>['justify']}
      align={align as React.ComponentProps<typeof AntRow>['align']}
      gutter={gutter as number | [number, number]}
      wrap={wrap as boolean}
      style={style as React.CSSProperties}
    >
      {wrappedChildren}
    </AntRow>
  );
};
