import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tag } from '../src/components/feedback/Tag';

const meta: Meta<typeof Tag> = {
  title: 'Feedback/Tag',
  component: Tag,
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const ColoredTag: Story = {
  name: 'Colored Tag',
  args: {
    id: 'tag-1',
    component: 'Tag',
    properties: {
      text: 'Important',
      color: 'red',
    },
  },
};

export const ClosableTag: Story = {
  name: 'Closable Tag',
  args: {
    id: 'tag-2',
    component: 'Tag',
    properties: {
      text: 'Removable',
      closable: true,
      color: 'blue',
    },
  },
};
