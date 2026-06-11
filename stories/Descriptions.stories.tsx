import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Descriptions } from '../src/components/data/Descriptions';

const meta: Meta<typeof Descriptions> = {
  title: 'Data/Descriptions',
  component: Descriptions,
};
export default meta;
type Story = StoryObj<typeof Descriptions>;

export const UserProfile: Story = {
  name: 'User Profile',
  args: {
    id: 'desc-1',
    type: 'Descriptions',
    properties: {
      title: 'User Info',
      bordered: true,
      column: 2,
      items: [
        { label: 'Name', children: 'Alice Johnson' },
        { label: 'Email', children: 'alice@example.com' },
        { label: 'Role', children: 'Admin' },
      ],
    },
  },
};
