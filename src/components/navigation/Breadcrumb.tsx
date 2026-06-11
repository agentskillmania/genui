import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Breadcrumb component — navigation trail showing current page location.
 * Purely display-oriented in the A2UI context; no callbacks are emitted.
 */
export const Breadcrumb: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { items, separator, style } = properties ?? {};

  const breadcrumbItems = (items as Array<{ title: string; href?: string; icon?: string }> ?? []).map(
    (item) => ({
      title: item.title,
    }),
  );

  return (
    <AntBreadcrumb
      items={breadcrumbItems}
      separator={separator as React.ReactNode}
      style={style as React.CSSProperties}
    />
  );
};
Breadcrumb.displayName = 'Breadcrumb';
