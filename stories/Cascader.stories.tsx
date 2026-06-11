import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Cascader } from '../src/components/input/Cascader';

const meta: Meta<typeof Cascader> = {
  title: 'Input/Cascader',
  component: Cascader,
};
export default meta;
type Story = StoryObj<typeof Cascader>;

export const RegionCascader: Story = {
  name: 'Region Cascader',
  args: {
    id: 'cas-1',
    type: 'Cascader',
    properties: {
      placeholder: 'Select region',
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            { value: 'hangzhou', label: 'Hangzhou' },
            { value: 'ningbo', label: 'Ningbo' },
          ],
        },
      ],
    },
  },
};
