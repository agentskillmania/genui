import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from '../src/components/data/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Data/Badge',
  component: Badge,
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const CountBadge: Story = {
  name: 'Count Badge',
  args: {
    id: 'badge-1',
    type: 'Badge',
    properties: {
      count: 5,
    },
    children: <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 4 }} />,
  },
};
