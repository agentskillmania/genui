import React from 'react';
import { Table as AntTable } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Table data component — columnar data display with optional pagination.
 *
 * Row interaction: set `rowClickAction` to an action name. When a row is
 * clicked, `onAction(rowClickAction, { record })` fires, giving the host the
 * full row object so it can open a drilldown / detail view. Omit for a
 * read-only table.
 */
export const Table: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { columns, dataSource, bordered, size, pagination, rowClickAction, style } = properties ?? {};

  return (
    <AntTable
      columns={columns as Array<Record<string, unknown>>}
      dataSource={dataSource as Array<Record<string, unknown>>}
      bordered={bordered as boolean}
      size={size as 'small' | 'middle' | 'large'}
      pagination={pagination !== false ? { pageSize: 10 } : false}
      style={style as React.CSSProperties}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => {
          if (rowClickAction && onAction) {
            onAction(rowClickAction as string, { record });
          }
        },
        style: rowClickAction ? { cursor: 'pointer' } : undefined,
      })}
    />
  );
};
