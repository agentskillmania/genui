import React from 'react';
import type { GenUIComponentProps } from '../types';

/**
 * Web component — embeds an external URL in a sandboxed iframe.
 */
export const Web: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { url, width, height, style } = properties ?? {};

  return (
    <iframe
      src={url as string}
      width={width as string | number}
      height={height as string | number}
      style={{
        border: 'none',
        ...style as React.CSSProperties,
      }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="Web Content"
    />
  );
};
