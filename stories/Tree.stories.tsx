import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tree } from '../src/components/data/Tree';

const meta: Meta<typeof Tree> = {
  title: 'Data/Tree',
  component: Tree,
};
export default meta;
type Story = StoryObj<typeof Tree>;

export const BasicTree: Story = {
  name: 'Basic Tree',
  args: {
    id: 'tree-1',
    component: 'Tree',
    properties: {
      treeData: [
        {
          key: '1',
          title: 'Root',
          children: [
            { key: '1-1', title: 'Child 1' },
            { key: '1-2', title: 'Child 2' },
          ],
        },
      ],
      defaultExpandAll: true,
    },
  },
};
