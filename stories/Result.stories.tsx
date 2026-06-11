import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Result } from '../src/components/feedback/Result';

const meta: Meta<typeof Result> = {
  title: 'Feedback/Result',
  component: Result,
};
export default meta;
type Story = StoryObj<typeof Result>;

export const SuccessResult: Story = {
  name: 'Success Result',
  args: {
    id: 'res-1',
    component: 'Result',
    properties: {
      status: 'success',
      title: 'Operation Completed',
      subTitle: 'Your changes have been saved',
    },
  },
};
