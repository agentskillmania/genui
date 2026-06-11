/**
 * Table component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Table } from '../src/components/data/Table';

const tableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
];

const tableData = [
  { id: '1', name: 'Alice', age: 28, role: 'Engineer' },
  { id: '2', name: 'Bob', age: 34, role: 'Designer' },
  { id: '3', name: 'Carol', age: 42, role: 'Manager' },
  { id: '4', name: 'Dave', age: 25, role: 'Engineer' },
];

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  argTypes: {
    id: { control: 'text' },
  },
};
export default meta;

type TableStory = StoryObj<typeof Table>;

export const BasicTable: TableStory = {
  name: 'Basic Table',
  args: {
    id: 'table-1',
    component: 'Table',
    properties: {
      columns: tableColumns,
      dataSource: tableData,
      bordered: true,
      size: 'middle',
    },
  },
};

export const CompactTable: TableStory = {
  name: 'Compact Table',
  args: {
    id: 'table-2',
    component: 'Table',
    properties: {
      columns: tableColumns,
      dataSource: tableData,
      bordered: false,
      size: 'small',
    },
  },
};

export const NoPaginationTable: TableStory = {
  name: 'Table without Pagination',
  args: {
    id: 'table-3',
    component: 'Table',
    properties: {
      columns: tableColumns,
      dataSource: tableData,
      pagination: false,
      size: 'middle',
    },
  },
};
