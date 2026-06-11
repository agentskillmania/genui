import React from 'react';
import { Col } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Column layout component — vertical flex child within a Row.
 */
export const Column: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { span, offset, push, pull, order, flex, style } = properties ?? {};

  return (
    <Col
      span={span as number}
      offset={offset as number}
      push={push as number}
      pull={pull as number}
      order={order as number}
      flex={flex as string | number}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style as React.CSSProperties }}
    >
      {children}
    </Col>
  );
};
