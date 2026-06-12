import React from 'react';
import { Col } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Column layout component — vertical flex child within a Row.
 *
 * Always renders an inner wrapper div so that:
 * - The Col element only handles grid positioning (span, offset, flex, order)
 * - All user styles (background, padding, border, etc.) go to the inner div
 * - Ant Design's gutter padding on Col stays transparent
 *
 * This eliminates the need to detect which CSS properties are "visual"
 * and avoids gutter-spacing bugs when Column has a background color.
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
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: 1,
        ...(style as React.CSSProperties),
      }}>
        {children}
      </div>
    </Col>
  );
};
