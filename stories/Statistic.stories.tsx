import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Statistic } from '../src/components/data/Statistic';

const meta: Meta<typeof Statistic> = {
  title: 'Data/Statistic',
  component: Statistic,
};
export default meta;
type Story = StoryObj<typeof Statistic>;

export const RevenueStatistic: Story = {
  name: 'Revenue',
  args: {
    id: 'stat-1',
    component: 'Statistic',
    properties: {
      title: 'Monthly Revenue',
      value: 125000,
      prefix: '$',
      precision: 0,
    },
  },
};
