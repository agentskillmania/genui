import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Rate } from '../src/components/input/Rate';

const meta: Meta<typeof Rate> = {
  title: 'Input/Rate',
  component: Rate,
};
export default meta;
type Story = StoryObj<typeof Rate>;

export const StarRating: Story = {
  name: 'Star Rating',
  args: {
    id: 'rate-1',
    type: 'Rate',
    properties: { value: 3, count: 5, allowHalf: true },
  },
};
