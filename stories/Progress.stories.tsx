import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Progress } from '../src/components/feedback/Progress';

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const LineProgress: Story = {
  name: 'Line Progress',
  args: {
    id: 'prog-1',
    component: 'Progress',
    properties: {
      percent: 65,
      status: 'active',
    },
  },
};

export const CircleProgress: Story = {
  name: 'Circle Progress',
  args: {
    id: 'prog-2',
    component: 'Progress',
    properties: {
      percent: 85,
      component: 'circle',
    },
  },
};
