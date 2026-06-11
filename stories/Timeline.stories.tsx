import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Timeline } from '../src/components/data/Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Data/Timeline',
  component: Timeline,
};
export default meta;
type Story = StoryObj<typeof Timeline>;

export const ActivityTimeline: Story = {
  name: 'Activity Timeline',
  args: {
    id: 'tl-1',
    type: 'Timeline',
    properties: {
      items: [
        { children: 'Build started', color: 'green' },
        { children: 'Testing phase', color: 'blue' },
        { children: 'Deployment pending', color: 'gray' },
      ],
    },
  },
};
