import React from 'react';
import { Carousel as AntCarousel } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Carousel layout component — auto-playable slide show.
 */
export const Carousel: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { autoplay, autoplaySpeed, dots, effect, style } = properties ?? {};

  return (
    <AntCarousel
      autoplay={autoplay as boolean}
      autoplaySpeed={autoplaySpeed as number}
      dots={dots !== false}
      effect={effect as 'scrollx' | 'fade'}
      style={style as React.CSSProperties}
    >
      {children}
    </AntCarousel>
  );
};
