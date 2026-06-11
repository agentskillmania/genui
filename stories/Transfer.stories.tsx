import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Transfer } from '../src/components/input/Transfer';

const meta: Meta<typeof Transfer> = {
  title: 'Input/Transfer',
  component: Transfer,
};
export default meta;
type Story = StoryObj<typeof Transfer>;

export const BasicTransfer: Story = {
  name: 'Basic Transfer',
  args: {
    id: 'tr-1',
    component: 'Transfer',
    properties: {
      dataSource: [
        { key: '1', title: 'Option A' },
        { key: '2', title: 'Option B' },
        { key: '3', title: 'Option C' },
      ],
      targetKeys: ['2'],
      showSearch: true,
    },
  },
};
