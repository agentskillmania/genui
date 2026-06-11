import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ColorPicker } from '../src/components/input/ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Input/ColorPicker',
  component: ColorPicker,
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const BasicColorPicker: Story = {
  name: 'Basic Color Picker',
  args: {
    id: 'cp-1',
    type: 'ColorPicker',
    properties: { value: '#1677ff', showText: true },
  },
};
