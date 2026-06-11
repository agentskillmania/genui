import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Calendar } from '../src/components/data/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Data/Calendar',
  component: Calendar,
};
export default meta;
type Story = StoryObj<typeof Calendar>;

export const BasicCalendar: Story = {
  name: 'Basic Calendar',
  args: {
    id: 'cal-1',
    component: 'Calendar',
    properties: {
      fullscreen: false,
    },
  },
};
