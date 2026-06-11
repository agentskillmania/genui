import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AutoComplete } from '../src/components/input/AutoComplete';

const meta: Meta<typeof AutoComplete> = {
  title: 'Input/AutoComplete',
  component: AutoComplete,
};
export default meta;
type Story = StoryObj<typeof AutoComplete>;

export const BasicAutoComplete: Story = {
  name: 'Basic AutoComplete',
  args: {
    id: 'ac-1',
    type: 'AutoComplete',
    properties: {
      placeholder: 'Type to search',
      options: [
        { value: 'Apple' },
        { value: 'Banana' },
        { value: 'Cherry' },
      ],
    },
  },
};
