import React from 'react';
import { Typography } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * RichText data component — renders raw HTML content via dangerouslySetInnerHTML.
 */
export const RichText: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { text, style } = properties ?? {};

  return (
    <Typography
      style={style as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: (text as string) || '' }}
    />
  );
};
