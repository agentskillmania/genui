import React from 'react';
import { Avatar as AntAvatar } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Avatar component — displays a user avatar image, text, or icon.
 */
export const Avatar: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { src, alt, size, shape, icon, style } = properties ?? {};

  return (
    <AntAvatar
      src={src as string}
      alt={alt as string}
      size={size as number | 'large' | 'small' | 'default'}
      shape={shape as 'circle' | 'square'}
      icon={icon as React.ReactNode}
      style={style as React.CSSProperties}
    >
      {(alt as string) ?? ''}
    </AntAvatar>
  );
};
Avatar.displayName = 'Avatar';
