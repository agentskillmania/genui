import React from 'react';
import { Table as AntTable } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Table data component — columnar data display with optional pagination.
 */
export const Table: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { columns, dataSource, bordered, size, pagination, style } = properties ?? {};

  return (
    <AntTable
      columns={columns as Array<Record<string, unknown>>}
      dataSource={dataSource as Array<Record<string, unknown>>}
      bordered={bordered as boolean}
      size={size as 'small' | 'middle' | 'large'}
      pagination={pagination !== false ? { pageSize: 10 } : false}
      style={style as React.CSSProperties}
      rowKey="id"
    />
  );
};
