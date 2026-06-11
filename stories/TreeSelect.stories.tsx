import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TreeSelect } from '../src/components/input/TreeSelect';

const meta: Meta<typeof TreeSelect> = {
  title: 'Input/TreeSelect',
  component: TreeSelect,
};
export default meta;
type Story = StoryObj<typeof TreeSelect>;

export const BasicTreeSelect: Story = {
  name: 'Basic Tree Select',
  args: {
    id: 'ts-1',
    component: 'TreeSelect',
    properties: {
      placeholder: 'Select node',
      treeData: [
        {
          value: 'parent',
          title: 'Parent',
          children: [
            { value: 'child1', title: 'Child 1' },
            { value: 'child2', title: 'Child 2' },
          ],
        },
      ],
      showSearch: true,
    },
  },
};
