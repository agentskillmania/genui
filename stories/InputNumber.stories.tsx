import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { InputNumber } from '../src/components/input/InputNumber';

const meta: Meta<typeof InputNumber> = {
  title: 'Input/InputNumber',
  component: InputNumber,
};
export default meta;
type Story = StoryObj<typeof InputNumber>;

export const BasicNumber: Story = {
  name: 'Basic Number Input',
  args: {
    id: 'num-1',
    component: 'InputNumber',
    properties: { value: 42, min: 0, max: 100, step: 1 },
  },
};
