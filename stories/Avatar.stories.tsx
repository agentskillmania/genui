import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Avatar } from '../src/components/data/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Data/Avatar',
  component: Avatar,
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const ImageAvatar: Story = {
  name: 'Image Avatar',
  args: {
    id: 'av-1',
    type: 'Avatar',
    properties: {
      src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      size: 48,
      shape: 'circle',
    },
  },
};
