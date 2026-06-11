/**
 * Pagination component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pagination } from '../src/components/navigation/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {
  name: 'Basic Pagination',
  args: {
    id: 'pagination-1',
    type: 'Pagination',
    properties: {
      current: 1,
      total: 100,
      pageSize: 10,
    },
  },
};

export const WithSizeChanger: Story = {
  name: 'Pagination with Size Changer',
  args: {
    id: 'pagination-2',
    type: 'Pagination',
    properties: {
      current: 3,
      total: 200,
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
    },
  },
};

export const Mini: Story = {
  name: 'Mini Pagination',
  args: {
    id: 'pagination-3',
    type: 'Pagination',
    properties: {
      current: 1,
      total: 50,
      pageSize: 10,
      size: 'small',
    },
  },
};
