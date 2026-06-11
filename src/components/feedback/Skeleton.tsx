import React from 'react';
import { Skeleton as AntSkeleton } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Skeleton component — shows a placeholder loading state while content loads.
 * Wraps children; displays skeleton when `loading` is true.
 */
export const Skeleton: React.FC<GenUIComponentProps> = ({ properties, children }) => {
  const { active, loading, avatar, paragraph, title, round, style } = properties ?? {};

  return (
    <AntSkeleton
      active={active as boolean}
      loading={loading as boolean}
      avatar={avatar as boolean}
      paragraph={paragraph as boolean}
      title={title as boolean}
      round={round as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntSkeleton>
  );
};
Skeleton.displayName = 'Skeleton';
