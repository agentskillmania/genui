import React from 'react';
import { Typography } from 'antd';
import type { GenUIComponentProps } from '../types';

const { Text: AntText, Title } = Typography;

/**
 * Text component — renders plain or heading text via Ant Design Typography.
 */
export const Text: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { text, variant, style, color, strong, italic, underline, delete: del } = properties ?? {};
  const content = (text as string) || '';

  const textStyle: React.CSSProperties = {
    color: color as string,
    fontStyle: italic ? 'italic' : undefined,
    textDecoration: underline ? 'underline' : del ? 'line-through' : undefined,
    ...style as React.CSSProperties,
  };

  switch (variant) {
    case 'h1':
      return <Title level={1} style={textStyle}>{content}</Title>;
    case 'h2':
      return <Title level={2} style={textStyle}>{content}</Title>;
    case 'h3':
      return <Title level={3} style={textStyle}>{content}</Title>;
    case 'h4':
      return <Title level={4} style={textStyle}>{content}</Title>;
    case 'h5':
      return <Title level={5} style={textStyle}>{content}</Title>;
    case 'caption':
      return <AntText type="secondary" style={textStyle}>{content}</AntText>;
    default:
      return <AntText strong={strong as boolean} style={textStyle}>{content}</AntText>;
  }
};
