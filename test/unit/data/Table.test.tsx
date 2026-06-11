/**
 * Unit tests for the Table data component.
 * Covers: rendering with undefined properties, column headers, data rows,
 * bordered, pagination, and empty data handling.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Table } from '../../../src/components/data/Table';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tbl-1',
    component: 'Table',
    properties: {
      ...overrides,
    },
  };
}

const sampleColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
];

const sampleDataSource = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
];

// ---------- tests ----------

describe('Table component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Table id="tbl-0" component="Table" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders column headers', () => {
    render(<Table {...makeProps({ columns: sampleColumns, dataSource: sampleDataSource })} />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Age')).toBeTruthy();
  });

  it('renders data rows', () => {
    render(<Table {...makeProps({ columns: sampleColumns, dataSource: sampleDataSource })} />);
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('renders with bordered style when bordered is true', () => {
    const { container } = render(
      <Table {...makeProps({ columns: sampleColumns, dataSource: sampleDataSource, bordered: true })} />,
    );
    const tableEl = container.querySelector('.ant-table');
    expect(tableEl?.className).toContain('ant-table-bordered');
  });

  it('renders pagination by default', () => {
    const { container } = render(
      <Table {...makeProps({ columns: sampleColumns, dataSource: sampleDataSource })} />,
    );
    const pagination = container.querySelector('.ant-pagination');
    expect(pagination).toBeTruthy();
  });

  it('hides pagination when pagination is false', () => {
    const { container } = render(
      <Table {...makeProps({ columns: sampleColumns, dataSource: sampleDataSource, pagination: false })} />,
    );
    const pagination = container.querySelector('.ant-pagination');
    expect(pagination).toBeFalsy();
  });

  it('renders empty table when no dataSource provided', () => {
    const { container } = render(
      <Table {...makeProps({ columns: sampleColumns })} />,
    );
    const tableEl = container.querySelector('.ant-table');
    expect(tableEl).toBeTruthy();
  });
});
