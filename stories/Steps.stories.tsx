/**
 * Steps component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Steps } from '../src/components/navigation/Steps';

const meta: Meta<typeof Steps> = {
  title: 'Navigation/Steps',
  component: Steps,
};
export default meta;

type Story = StoryObj<typeof Steps>;

export const Basic: Story = {
  name: 'Basic Steps',
  args: {
    id: 'steps-1',
    component: 'Steps',
    properties: {
      current: 1,
      items: [
        { title: 'Login', description: 'Enter your credentials' },
        { title: 'Verification', description: 'Verify your identity' },
        { title: 'Complete', description: 'Done' },
      ],
    },
  },
};

export const VerticalSteps: Story = {
  name: 'Vertical Steps',
  args: {
    id: 'steps-2',
    component: 'Steps',
    properties: {
      current: 0,
      direction: 'vertical',
      items: [
        { title: 'Step 1', description: 'Select items' },
        { title: 'Step 2', description: 'Review order' },
        { title: 'Step 3', description: 'Payment' },
        { title: 'Step 4', description: 'Confirmation' },
      ],
    },
  },
};

export const ErrorStep: Story = {
  name: 'Steps with Error',
  args: {
    id: 'steps-3',
    component: 'Steps',
    properties: {
      current: 1,
      status: 'error',
      items: [
        { title: 'Personal Info' },
        { title: 'Payment', description: 'Payment failed' },
        { title: 'Done' },
      ],
    },
  },
};
