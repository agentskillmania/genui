import React, { useState, useEffect } from 'react';
import { Pagination as AntPagination } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Pagination component — page navigator with change callback.
 * Syncs current page and page size back to the host via onSyncState.
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

  const [localCurrent, setLocalCurrent] = useState((current as number) ?? 1);
  const [localPageSize, setLocalPageSize] = useState((pageSize as number) ?? 10);

  useEffect(() => {
    if (current !== undefined) {
      setLocalCurrent(current as number);
    }
  }, [current]);

  useEffect(() => {
    if (pageSize !== undefined) {
      setLocalPageSize(pageSize as number);
    }
  }, [pageSize]);

  const handleChange = (page: number, newPageSize: number) => {
    setLocalCurrent(page);
    setLocalPageSize(newPageSize);
    onSyncState?.({ page, pageSize: newPageSize });
  };

  return (
    <AntPagination
      current={localCurrent}
      total={(total as number) ?? 0}
      pageSize={localPageSize}
      showSizeChanger={showSizeChanger as boolean}
      showQuickJumper={showQuickJumper as boolean}
      showTotal={showTotal as boolean}
      size={size as 'default' | 'small'}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Pagination.displayName = 'Pagination';
