import React from 'react';
import { Watermark as AntWatermark } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Watermark component — renders a tiled watermark overlay on child content.
 */
export const Watermark: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { content, fontColor, fontSize, gap, rotate, style } = properties ?? {};

  return (
    <AntWatermark
      content={content as string | string[]}
      fontColor={fontColor as string}
      fontSize={fontSize as number}
      gap={gap as [number, number]}
      rotate={rotate as number}
      style={style as React.CSSProperties}
    >
      {children}
    </AntWatermark>
  );
};
Watermark.displayName = 'Watermark';
