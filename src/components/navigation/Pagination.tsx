import React from 'react';
import { Pagination as AntPagination } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Pagination component — page navigator with change callback.
 *
 * Fully controlled: current page and page size come from `properties` and
 * every change is reported upstream via `onSyncState({ page, pageSize })`.
 */
export const Pagination: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    current,
    total,
    pageSize,
    showSizeChanger,
    showQuickJumper,
    showTotal,
    size,
    style,
  } = properties ?? {};

  const handleChange = (page: number, newPageSize: number) => {
    onSyncState?.({ page, pageSize: newPageSize });
  };

  return (
    <AntPagination
      current={(current as number) ?? 1}
      total={(total as number) ?? 0}
      pageSize={(pageSize as number) ?? 10}
      showSizeChanger={showSizeChanger as boolean}
      showQuickJumper={showQuickJumper as boolean}
      showTotal={showTotal ? (t: number, range: [number, number]) => `${range[0]}-${range[1]} of ${t} items` : undefined}
      size={size === 'small' ? 'small' : undefined}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Pagination.displayName = 'Pagination';
