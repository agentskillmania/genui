import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Spin } from '../src/components/feedback/Spin';

const meta: Meta<typeof Spin> = {
  title: 'Feedback/Spin',
  component: Spin,
};
export default meta;
type Story = StoryObj<typeof Spin>;

export const BasicSpin: Story = {
  name: 'Basic Spin',
  args: {
    id: 'spin-1',
    component: 'Spin',
    properties: {
      spinning: true,
      tip: 'Loading...',
    },
  },
};
