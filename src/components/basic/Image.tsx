import React from 'react';
import { Image as AntImage } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Image component — renders an image with optional fit/size control.
 */
export const Image: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { url, description, fit, width, height, style } = properties ?? {};

  const objectFit = fit as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  return (
    <AntImage
      src={url as string}
      alt={description as string}
      width={width as number | string}
      height={height as number | string}
      style={{
        objectFit,
        ...style as React.CSSProperties,
      }}
    />
  );
};
