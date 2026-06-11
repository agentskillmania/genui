import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton } from '../src/components/feedback/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const ActiveSkeleton: Story = {
  name: 'Active Skeleton',
  args: {
    id: 'skel-1',
    component: 'Skeleton',
    properties: {
      active: true,
      avatar: true,
      paragraph: { rows: 3 },
    },
  },
};
