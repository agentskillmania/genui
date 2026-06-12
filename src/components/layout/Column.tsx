import React from 'react';
import { Col } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * CSS properties that indicate the Column has a visual "box" appearance.
 * When present, all user styles are moved to an inner wrapper to keep
 * Ant Design's gutter padding transparent.
 */
const VISUAL_INDICATORS = new Set([
  'background',
  'backgroundColor',
  'border',
  'borderRadius',
  'boxShadow',
]);

/** Base flex-column style applied to every Column (or its inner wrapper). */
const BASE_FLEX_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

/**
 * Column layout component — vertical flex child within a Row.
 *
 * When the user style contains visual properties (background, border,
 * borderRadius, boxShadow), ALL user styles are rendered on an inner
 * wrapper div so that Ant Design's gutter padding on the Col remains
 * transparent. Otherwise styles are applied directly to the Col.
 */
export const Column: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { span, offset, push, pull, order, flex, style } = properties ?? {};

  const userStyle = style as React.CSSProperties | undefined;
  const hasVisualBox = userStyle && Object.keys(userStyle).some(
    (k) => VISUAL_INDICATORS.has(k),
  );

  if (hasVisualBox) {
    return (
      <Col
        span={span as number}
        offset={offset as number}
        push={push as number}
        pull={pull as number}
        order={order as number}
        flex={flex as string | number}
        style={BASE_FLEX_STYLE}
      >
        <div style={{ ...BASE_FLEX_STYLE, flex: 1, ...userStyle }}>
          {children}
        </div>
      </Col>
    );
  }

  return (
    <Col
      span={span as number}
      offset={offset as number}
      push={push as number}
      pull={pull as number}
      order={order as number}
      flex={flex as string | number}
      style={{ ...BASE_FLEX_STYLE, ...userStyle }}
    >
      {children}
    </Col>
  );
};
