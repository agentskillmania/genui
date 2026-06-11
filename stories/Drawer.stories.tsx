import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Drawer } from '../src/components/feedback/Drawer';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Drawer> = {
  title: 'Feedback/Drawer',
  component: Drawer,
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const OpenDrawer: Story = {
  name: 'Open Drawer',
  args: {
    id: 'drawer-1',
    component: 'Drawer',
    properties: {
      title: 'Settings',
      open: true,
      placement: 'right',
      width: 400,
    },
    children: <Text id="d-body" type="Text" properties={{ text: 'Drawer content here' }} />,
  },
};
