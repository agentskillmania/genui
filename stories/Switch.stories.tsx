import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Switch } from '../src/components/input/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Input/Switch',
  component: Switch,
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const BasicSwitch: Story = {
  name: 'Basic Switch',
  args: {
    id: 'sw-1',
    type: 'Switch',
    properties: { checked: false },
  },
};

export const CheckedSwitch: Story = {
  name: 'Checked Switch',
  args: {
    id: 'sw-2',
    type: 'Switch',
    properties: { checked: true, loading: false },
  },
};
