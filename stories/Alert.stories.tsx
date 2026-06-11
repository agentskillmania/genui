import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert } from '../src/components/feedback/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const InfoAlert: Story = {
  name: 'Info Alert',
  args: {
    id: 'alert-1',
    type: 'Alert',
    properties: {
      message: 'Informational note',
      type: 'info',
      showIcon: true,
      closable: true,
    },
  },
};

export const ErrorAlert: Story = {
  name: 'Error Alert',
  args: {
    id: 'alert-2',
    type: 'Alert',
    properties: {
      message: 'Something went wrong',
      description: 'Please try again later',
      type: 'error',
      showIcon: true,
    },
  },
};
