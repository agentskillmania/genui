import React from 'react';
import { Col } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Visual CSS properties that should be moved to the inner wrapper
 * so that Ant Design's gutter padding remains transparent.
 */
const VISUAL_PROPS = new Set([
  'background',
  'backgroundColor',
  'backgroundImage',
  'backgroundClip',
  'border',
  'borderRadius',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderColor',
  'borderWidth',
  'borderStyle',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'boxShadow',
]);

/**
 * Split a style object into layout styles (for Col) and visual styles (for inner wrapper).
 */
function splitStyle(style: React.CSSProperties): {
  colStyle: React.CSSProperties;
  innerStyle: React.CSSProperties;
} {
  const colStyle: Record<string, unknown> = {};
  const innerStyle: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(style)) {
    if (VISUAL_PROPS.has(key)) {
      innerStyle[key] = value;
    } else {
      colStyle[key] = value;
    }
  }
  return { colStyle, innerStyle };
}

/**
 * Column layout component — vertical flex child within a Row.
 *
 * Visual styles (background, border, borderRadius, boxShadow) are rendered
 * on an inner wrapper so that Ant Design's gutter padding remains transparent.
 */
export const Column: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { span, offset, push, pull, order, flex, style } = properties ?? {};

  const baseColStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const hasVisualProps = style && Object.keys(style as Record<string, unknown>).some(
    (k) => VISUAL_PROPS.has(k),
  );

  if (hasVisualProps) {
    const { colStyle, innerStyle } = splitStyle(style as React.CSSProperties);
    return (
      <Col
        span={span as number}
        offset={offset as number}
        push={push as number}
        pull={pull as number}
        order={order as number}
        flex={flex as string | number}
        style={{ ...baseColStyle, ...colStyle }}
      >
        <div style={{ ...innerStyle, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
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
      style={{ ...baseColStyle, ...(style as React.CSSProperties) }}
    >
      {children}
    </Col>
  );
};
